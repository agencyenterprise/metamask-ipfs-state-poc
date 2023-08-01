import { OnRpcRequestHandler } from '@metamask/snaps-types';

import type { State } from './types';
import { getState, saveState } from './ipfs';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'get_state':
      return handleGetState();

    case 'save_state':
      return handleSaveState(request.params as State);

    case 'refresh_state':
      return '';

    default:
      throw new Error('Method not found.');
  }
};

/**
 * Handle get state requests. It returns the persisted state in the snap side.
 *
 * @returns A promise that resolves to the persisted state.
 */
export async function handleGetState(): Promise<State> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  return state ?? {};
}

/**
 * Persists a state on the snap side and IPFS snap if available.
 *
 * @param newState - The new state to be persisted.
 */
export async function handleSaveState(newState: State): Promise<void> {
  await Promise.all([
    snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState },
    }),
    saveState(newState),
  ]);
}

/**
 * Refreshes the state on the snap side if available on IPFS.
 */
export async function handleRefreshState(): Promise<void> {
  const state = await getState();

  if (state) {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState: state },
    });
  }
}
