import { describe, expect, it, vi } from 'vitest';
import {
  getEmployeeEditCommitRefreshPlan,
  getPostSaveHistoryOperationId,
  restoreEmployeeEditFocus,
} from './employee-history-refresh';

describe('employee history refresh', () => {
  it('starts a fresh history load when history is active after a save', () => {
    const createOperationId = vi.fn(() => 'fresh-history-operation');

    expect(getPostSaveHistoryOperationId(true, createOperationId)).toBe(
      'fresh-history-operation',
    );
    expect(createOperationId).toHaveBeenCalledOnce();
  });

  it('invalidates history without loading it while another tab is active', () => {
    const createOperationId = vi.fn(() => 'unused-operation');

    expect(getPostSaveHistoryOperationId(false, createOperationId)).toBe('');
    expect(createOperationId).not.toHaveBeenCalled();
  });

  it.each(['drawer', 'full_dossier'] as const)(
    'uses the same committed refresh behavior for the %s surface',
    (surface) => {
      expect(
        getEmployeeEditCommitRefreshPlan(surface, true, () => 'fresh-id'),
      ).toEqual({
        surface,
        closeEditor: true,
        resetHistory: true,
        historyOperationId: 'fresh-id',
      });
    },
  );

  it('restores focus to the connected edit trigger after close', () => {
    const focus = vi.fn();
    const schedule = vi.fn((callback: () => void) => callback());

    restoreEmployeeEditFocus({ isConnected: true, focus }, schedule);

    expect(schedule).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
  });

  it('does not focus a trigger that is no longer connected', () => {
    const focus = vi.fn();
    restoreEmployeeEditFocus({ isConnected: false, focus }, (callback) =>
      callback(),
    );
    expect(focus).not.toHaveBeenCalled();
  });
});
