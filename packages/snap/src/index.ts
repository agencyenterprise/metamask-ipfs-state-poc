import { OnRpcRequestHandler } from '@metamask/snaps-types';

export const onRpcRequest: OnRpcRequestHandler = ({ request }) => {
  switch (request.method) {
    default:
      throw new Error('Method not found.');
  }
};
