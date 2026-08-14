'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  readSubmission,
  addedRightLines,
  validateEnvelope,
  publishReview,
} = require('./publish-opencode-review.cjs');

function envelope(overrides = {}) {
  return {
    schema: 'open-hax.github-review/v1',
    event: 'APPROVE',
    summary: 'No confirmed defects survived validation.',
    comments: [],
    ...overrides,
  };
}

function tempSubmissionFile(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eta-mu-review-'));
  const file = path.join(dir, 'submission.json');
  fs.writeFileSync(file, contents);
  return file;
}

test('readSubmission reads the machine-written review submission', () => {
  const value = envelope();
  const file = tempSubmissionFile(`${JSON.stringify(value, null, 2)}\n`);
  assert.deepEqual(readSubmission({ submissionFile: file }), value);
});

test('readSubmission requires the review_submit artifact', () => {
  assert.throws(() => readSubmission({}), /submissionFile is required/);
  assert.throws(
    () => readSubmission({ submissionFile: '/does/not/exist.json' }),
    /review_submit/,
  );
  assert.throws(
    () => readSubmission({ submissionFile: tempSubmissionFile('{broken') }),
    /not valid JSON/,
  );
});

test('addedRightLines indexes only added lines on the PR head side', () => {
  const patch = [
    '@@ -10,4 +10,5 @@ function example() {',
    ' context',
    '-old',
    '+new',
    '+another',
    ' tail',
  ].join('\n');

  assert.deepEqual([...addedRightLines(patch)], [11, 12]);
});

test('addedRightLines treats +++ and --- prefixes as diff content inside hunks', () => {
  const patch = [
    '@@ -20,4 +20,5 @@',
    ' context',
    '---',
    '+++i',
    '+tail',
  ].join('\n');

  assert.deepEqual([...addedRightLines(patch)], [21, 22]);
});

test('validateEnvelope accepts a clean approval', () => {
  const value = envelope();
  assert.equal(validateEnvelope(value, new Map()), value);
});

test('validateEnvelope accepts a non-blocking inline review comment', () => {
  const value = envelope({
    event: 'COMMENT',
    comments: [
      {
        path: 'src/example.js',
        line: 12,
        side: 'RIGHT',
        severity: 'medium',
        blocking: false,
        body: 'This changed branch drops the caller result. Return it here.',
      },
    ],
  });
  const changed = new Map([['src/example.js', new Set([12])]]);

  assert.equal(validateEnvelope(value, changed), value);
});

test('validateEnvelope requires request-changes when a finding is blocking', () => {
  const value = envelope({
    event: 'COMMENT',
    comments: [
      {
        path: 'src/example.js',
        line: 12,
        side: 'RIGHT',
        severity: 'high',
        blocking: true,
        body: 'This changed authorization branch fails open.',
      },
    ],
  });
  const changed = new Map([['src/example.js', new Set([12])]]);

  assert.throws(() => validateEnvelope(value, changed), /expected REQUEST_CHANGES/);
});

test('validateEnvelope rejects findings that are not attached to added diff lines', () => {
  const value = envelope({
    event: 'COMMENT',
    comments: [
      {
        path: 'src/example.js',
        line: 13,
        side: 'RIGHT',
        severity: 'medium',
        blocking: false,
        body: 'Finding body.',
      },
    ],
  });
  const changed = new Map([['src/example.js', new Set([12])]]);

  assert.throws(() => validateEnvelope(value, changed), /not an added line/);
});

test('publishReview sends a finding through pulls.createReview as an inline comment', async () => {
  const findingBody = 'This changed branch drops the caller result. Return it here.';
  const summary = 'One confirmed non-blocking defect.';
  const value = envelope({
    event: 'COMMENT',
    summary,
    comments: [
      {
        path: 'src/example.js',
        line: 12,
        side: 'RIGHT',
        severity: 'medium',
        blocking: false,
        body: findingBody,
      },
    ],
  });

  const listFiles = async () => {};
  let createReviewInput;
  const info = [];

  const github = {
    rest: {
      pulls: {
        listFiles,
        createReview: async (input) => {
          createReviewInput = input;
          return {
            data: {
              id: 42,
              html_url: 'https://example.test/reviews/42',
            },
          };
        },
      },
    },
    paginate: async (operation) => {
      if (operation === listFiles) {
        return [
          {
            filename: 'src/example.js',
            patch: [
              '@@ -10,4 +10,5 @@ function example() {',
              ' context',
              '-old',
              '+new',
              '+another',
              ' tail',
            ].join('\n'),
          },
        ];
      }
      throw new Error('Unexpected paginated GitHub operation.');
    },
  };
  const context = {
    repo: { owner: 'open-hax', repo: 'eta-mu' },
    runId: 123,
    payload: {
      pull_request: {
        number: 288,
        head: { sha: 'deadbeef' },
      },
    },
  };
  const core = {
    info: (message) => info.push(message),
  };

  const submissionFile = tempSubmissionFile(`${JSON.stringify(value, null, 2)}\n`);

  const review = await publishReview({
    github,
    context,
    core,
    submissionFile,
  });

  assert.deepEqual(createReviewInput, {
    owner: 'open-hax',
    repo: 'eta-mu',
    pull_number: 288,
    commit_id: 'deadbeef',
    event: 'COMMENT',
    body: summary,
    comments: [
      {
        path: 'src/example.js',
        line: 12,
        side: 'RIGHT',
        body: findingBody,
      },
    ],
  });
  assert.deepEqual(review, {
    id: 42,
    html_url: 'https://example.test/reviews/42',
  });
  assert.match(info.at(-1), /with 1 inline comment\(s\)/);
});
