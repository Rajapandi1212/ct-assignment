import { ENV } from './env';

export const ctClientConfig = {
  clientId: ENV.CTP_CLIENT_ID,
  clientSecret: ENV.CTP_CLIENT_SECRET,
  projectKey: ENV.CTP_PROJECT_KEY,
  authUrl: ENV.CTP_AUTH_URL,
  apiUrl: ENV.CTP_API_URL,
  scopes: ENV.CTP_SCOPES,
};

export const CT_DEFAULT_LOCALE = 'en-US';
