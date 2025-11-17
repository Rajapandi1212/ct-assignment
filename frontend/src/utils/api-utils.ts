export const withLocale = (headers: Record<string, string> = {}) => {
  // If Accept-Language is already set, use it
  if (headers['Accept-Language']) {
    return headers;
  }

  // Otherwise, use the default
  return {
    ...headers,
    'Accept-Language': 'en-US',
  };
};
