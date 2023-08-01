import type { State } from './types';

const IPFS_SNAP_ID = 'local:http://localhost:8080';

/**
 * Get saved state from IPFS snap.
 *
 * @returns Persisted state or null if not found.
 */
export async function getState(): Promise<State | null> {
  try {
    const output = await snap.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: IPFS_SNAP_ID,
        request: {
          method: 'get',
        },
      },
    });

    return (output as State) ?? { found: false };
  } catch (error) {
    return { message: error.message };
  }
}

/**
 * Save state to IPFS snap.
 *
 * @param state - State to save.
 * @returns True if state was saved successfully, false otherwise.
 */
export async function saveState(state: State): Promise<boolean> {
  try {
    await snap.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: IPFS_SNAP_ID,
        request: {
          method: 'set',
          params: state,
        },
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
