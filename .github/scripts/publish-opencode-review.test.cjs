'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  BEGIN,
  END,
  parseEnvelope,
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

test('parseEnvelope extracts the machine review from an OpenCode issue comment footer', () => {
  const body = [
    'transient wrapper text',
    BEGIN,
    JSON.stringify(envelope()),
    END,
    '[github run](/open-hax/eta-mu/actions/runs/123)',
  ].join('\n');

  assert.deepEqual(parseEnvelope(body), envelope());
});

test('parseEnvelope rejects prose pretending to be an inline comment', () => {
  assert.throws(
    () => parseEnvelope('**Inline comment:** line 12 is broken'),
    /ETA_MU_REVIEW_V1_BEGIN/,
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

  const listComments = async () => {};
  const listFiles = async () => {};
  let createReviewInput;
  let deleteCommentInput;
  const info = [];

  const github = {
    rest: {
      issues: {
        listComments,
        deleteComment: async (input) => {
          deleteCommentInput = input;
          return { data: {} };
        },
      },
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
      if (operation === listComments) {
        return [
          {
            id: 9001,
            created_at: '2026-08-14T14:35:05Z',
            updated_at: '2026-08-14T14:35:06Z',
            body: [
              BEGIN,
              JSON.stringify(value),
              END,
              '[github run](/open-hax/eta-mu/actions/runs/123)',
            ].join('\n'),
          },
        ];
      }
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

  const review = await publishReview({
    github,
    context,
    core,
    startedAt: '2026-08-14T14:35:04Z',
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
  assert.deepEqual(deleteCommentInput, {
    owner: 'open-hax',
    repo: 'eta-mu',
    comment_id: 9001,
  });
  assert.deepEqual(review, {
    id: 42,
    html_url: 'https://example.test/reviews/42',
  });
  assert.match(info.at(-1), /with 1 inline comment\(s\)/);
});
