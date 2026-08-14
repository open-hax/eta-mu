'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  BEGIN,
  END,
  parseEnvelope,
  addedRightLines,
  validateEnvelope,
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
  assert.equal(validateEnvelope(envelope(), new Map()), envelope().event);
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
