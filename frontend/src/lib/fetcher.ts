import axios from './axios';

export const fetcher = async (url: string) => {
  return axios.get(url);
};

export const fetcherWithParams = async (
  args: readonly [string, Record<string, unknown>]
) => {
  const [url, params] = args;
  return axios.get(url, { params });
};

export const postFetcher = async (
  args: readonly [string, Record<string, unknown>]
) => {
  const [url, data] = args;
  return axios.post(url, data);
};
