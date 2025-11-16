import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
  requestId: string;
  isPreview?: boolean;
}

const asyncStorage = new AsyncLocalStorage<RequestContext>();

export const withRequestContext = (id: RequestContext, fn: () => unknown) => {
  return asyncStorage.run(id, fn);
};

export const getRequestContext = () => {
  return asyncStorage.getStore();
};
