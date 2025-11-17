import { SWRConfiguration, MutatorOptions } from 'swr';

export const defaultSWROptions: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

export const silentMutateOptions: MutatorOptions = {
  revalidate: false,
  populateCache: true,
  rollbackOnError: false,
};
