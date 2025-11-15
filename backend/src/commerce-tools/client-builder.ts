import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { ctClientConfig } from '../config/ct';

export const projectKey = ctClientConfig.projectKey;
const scopes = [ctClientConfig.scopes];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: ctClientConfig.authUrl,
  projectKey,
  credentials: {
    clientId: ctClientConfig.clientId,
    clientSecret: ctClientConfig.clientSecret,
  },
  scopes,
  httpClient: fetch,
};

const httpAPIHTTPMiddlewareOptions: HttpMiddlewareOptions = {
  host: ctClientConfig.apiUrl,
  httpClient: fetch,
};

export const ctpClientHTTPAPI = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpAPIHTTPMiddlewareOptions)
  // .withLoggerMiddleware()
  .build();
