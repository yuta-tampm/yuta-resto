import { describe, expect, it, vi } from 'vitest';
import { getPostSaveHistoryOperationId } from './employee-history-refresh';

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
});
