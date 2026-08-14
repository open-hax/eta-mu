'use strict';

const BEGIN = 'ETA_MU_REVIEW_V1_BEGIN';
const END = 'ETA_MU_REVIEW_V1_END';
const SCHEMA = 'open-hax.github-review/v1';
const EVENTS = new Set(['APPROVE', 'COMMENT', 'REQUEST_CHANGES']);
const SEVERITIES = new Set(['critical', 'high', 'medium', 'low']);

function parseEnvelope(body) {
  const text = String(body || '');
  const begin = text.indexOf(BEGIN);
  const end = text.indexOf(END, begin + BEGIN.length);
  if (begin < 0 || end < 0 || end <= begin) {
    throw new Error(`OpenCode response must contain ${BEGIN} ... ${END}`);
  }

  const payload = text.slice(begin + BEGIN.length, end).trim();
  if (!payload) throw new Error('Review envelope is empty.');

  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new Error(`Review envelope is not valid JSON: ${error.message}`);
  }
}

function addedRightLines(patch) {
  if (typeof patch !== 'string' || patch.length === 0) return null;

  const added = new Set();
  let oldLine = null;
  let newLine = null;

  for (const row of patch.split('\n')) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(row);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      continue;
    }
    if (oldLine === null || newLine === null) continue;
    if (row.startsWith('\\ No newline at end of file')) continue;

    if (row.startsWith('+')) {
      added.add(newLine);
      newLine += 1;
      continue;
    }
    if (row.startsWith('-')) {
      oldLine += 1;
      continue;
    }

    oldLine += 1;
    newLine += 1;
  }

  return added;
}

function validateEnvelope(envelope, changedLines) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    throw new Error('Review envelope must be a JSON object.');
  }
  if (envelope.schema !== SCHEMA) {
    throw new Error(`Review envelope schema must be ${SCHEMA}.`);
  }
  if (!EVENTS.has(envelope.event)) {
    throw new Error('Review event must be APPROVE, COMMENT, or REQUEST_CHANGES.');
  }
  if (typeof envelope.summary !== 'string' || envelope.summary.trim().length === 0) {
    throw new Error('Review summary must be a non-empty string.');
  }
  if (!Array.isArray(envelope.comments)) {
    throw new Error('Review comments must be an array.');
  }
  if (envelope.comments.length > 50) {
    throw new Error('Review envelope may contain at most 50 inline comments.');
  }

  const seen = new Set();
  let hasBlocking = false;

  for (const [index, comment] of envelope.comments.entries()) {
    const label = `comments[${index}]`;
    if (!comment || typeof comment !== 'object' || Array.isArray(comment)) {
      throw new Error(`${label} must be an object.`);
    }
    if (typeof comment.path !== 'string' || comment.path.length === 0) {
      throw new Error(`${label}.path must be a non-empty repository path.`);
    }
    if (!Number.isInteger(comment.line) || comment.line < 1) {
      throw new Error(`${label}.line must be a positive integer.`);
    }
    if (comment.side !== 'RIGHT') {
      throw new Error(`${label}.side must be RIGHT; findings attach to changed lines in the PR head.`);
    }
    if (typeof comment.body !== 'string' || comment.body.trim().length === 0) {
      throw new Error(`${label}.body must be a non-empty string.`);
    }
    if (!SEVERITIES.has(comment.severity)) {
      throw new Error(`${label}.severity must be critical, high, medium, or low.`);
    }
    if (typeof comment.blocking !== 'boolean') {
      throw new Error(`${label}.blocking must be boolean.`);
    }
    if (comment.blocking && !['critical', 'high'].includes(comment.severity)) {
      throw new Error(`${label} may be blocking only at critical or high severity.`);
    }

    const lines = changedLines.get(comment.path);
    if (!lines) {
      throw new Error(`${label} targets ${comment.path}, but GitHub did not provide a reviewable patch for that changed file.`);
    }
    if (!lines.has(comment.line)) {
      throw new Error(`${label} targets ${comment.path}:${comment.line}, which is not an added line in the pull-request diff.`);
    }

    const key = `${comment.path}:${comment.line}`;
    if (seen.has(key)) {
      throw new Error(`Multiple findings target ${key}; combine them into one inline comment.`);
    }
    seen.add(key);
    hasBlocking ||= comment.blocking;
  }

  const expectedEvent = hasBlocking
    ? 'REQUEST_CHANGES'
    : envelope.comments.length > 0
      ? 'COMMENT'
      : 'APPROVE';
  if (envelope.event !== expectedEvent) {
    throw new Error(
      `Review event ${envelope.event} contradicts the findings; expected ${expectedEvent}.`,
    );
  }

  return envelope;
}

async function findRunComment({ github, context, startedAt }) {
  const { owner, repo } = context.repo;
  const pr = context.payload.pull_request;
  if (!pr) throw new Error('Pull request payload is unavailable.');

  const started = new Date(startedAt || 0).getTime();
  const runMarker = `/actions/runs/${context.runId}`;
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: pr.number,
    per_page: 100,
  });

  const matches = comments
    .filter((comment) => new Date(comment.created_at).getTime() >= started)
    .filter((comment) => String(comment.body || '').includes(runMarker))
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one OpenCode run comment containing ${runMarker}; found ${matches.length}.`,
    );
  }
  return matches[0];
}

async function changedLineIndex({ github, context }) {
  const { owner, repo } = context.repo;
  const pr = context.payload.pull_request;
  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  });

  return new Map(files.map((file) => [file.filename, addedRightLines(file.patch)]));
}

async function publishReview({ github, context, core, startedAt }) {
  const { owner, repo } = context.repo;
  const pr = context.payload.pull_request;
  if (!pr) throw new Error('Pull request payload is unavailable.');

  const runComment = await findRunComment({ github, context, startedAt });
  const envelope = parseEnvelope(runComment.body);
  const changedLines = await changedLineIndex({ github, context });
  validateEnvelope(envelope, changedLines);

  const comments = envelope.comments.map(({ path, line, side, body }) => ({
    path,
    line,
    side,
    body,
  }));

  const review = await github.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pr.number,
    commit_id: pr.head.sha,
    event: envelope.event,
    body: envelope.summary,
    comments,
  });

  await github.rest.issues.deleteComment({
    owner,
    repo,
    comment_id: runComment.id,
  });

  core.info(
    `Submitted ${envelope.event} review ${review.data.html_url || review.data.id} with ${comments.length} inline comment(s); removed temporary OpenCode issue comment ${runComment.id}.`,
  );
  return review.data;
}

module.exports = {
  BEGIN,
  END,
  SCHEMA,
  parseEnvelope,
  addedRightLines,
  validateEnvelope,
  findRunComment,
  changedLineIndex,
  publishReview,
};
