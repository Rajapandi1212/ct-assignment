import axios from './axios';

export const fetcher = async <T = unknown>(
  url: string,
  params?: unknown,
  headers: Record<string, string> = {}
): Promise<T> => {
  return axios.get(url, { params, headers });
};

export const postFetcher = async <T = unknown>(
  url: string,
  data?: unknown,
  headers: Record<string, string> = {}
): Promise<T> => {
  return axios.post(url, data, { headers });
};
