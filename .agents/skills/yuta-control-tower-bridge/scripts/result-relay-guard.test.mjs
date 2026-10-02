import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyResultRelay, maySubmitResult } from './result-relay-guard.mjs';

const expected = {
  runId: 'FED-NEW-RUN',
  roundId: 1,
  commandId: 'FED-NEW-RUN:1',
};
const first = { type: 'YUTA_CODEX_RESULT', ...expected };

test('one command permits one result only before Send is activated', () => {
  assert.equal(
    maySubmitResult({
      expected,
      observedResults: [],
      historyComplete: true,
      deliveryState: 'NOT_SENT',
      sendActivated: false,
    }).allowed,
    true,
  );
  assert.deepEqual(
    classifyResultRelay({
      expected,
      observedResults: [first],
      historyComplete: true,
    }),
    {
      status: 'RESULT_ALREADY_POSTED',
      matchingCount: 1,
    },
  );
  assert.equal(
    maySubmitResult({
      expected,
      observedResults: [first],
      historyComplete: true,
      deliveryState: 'NOT_SENT',
      sendActivated: false,
    }).allowed,
    false,
  );
});

test('a second relay for the same command is detected, including a changed encoding', () => {
  const second = { ...first, urlEncoding: 'PERCENT_UTF8' };
  assert.deepEqual(
    classifyResultRelay({
      expected,
      observedResults: [first, second],
      historyComplete: true,
    }),
    { status: 'DUPLICATE_RESULT_RELAY', matchingCount: 2 },
  );
});

test('send activation or uncertain delivery forbids a second Send without a posted message', () => {
  for (const [deliveryState, sendActivated] of [
    ['SENDING', true],
    ['DELIVERY_UNCERTAIN', true],
    ['DELIVERY_UNCERTAIN', false],
  ]) {
    assert.equal(
      maySubmitResult({
        expected,
        observedResults: [],
        historyComplete: true,
        deliveryState,
        sendActivated,
      }).allowed,
      false,
    );
  }
});

test('incomplete history cannot establish non-delivery', () => {
  assert.equal(
    maySubmitResult({
      expected,
      observedResults: [],
      historyComplete: false,
      deliveryState: 'NOT_SENT',
      sendActivated: false,
    }).allowed,
    false,
  );
});

test('other commands do not consume this command result slot', () => {
  const other = {
    type: 'YUTA_CODEX_RESULT',
    runId: 'FED-OTHER-RUN',
    roundId: 1,
    commandId: 'FED-OTHER-RUN:1',
  };
  assert.equal(
    maySubmitResult({
      expected,
      observedResults: [other],
      historyComplete: true,
      deliveryState: 'NOT_SENT',
      sendActivated: false,
    }).allowed,
    true,
  );
});
