// repositories/base.repository.ts

import {
  ApiRoot,
  createApiBuilderFromCtpClient,
  type Project,
  type ProductTypePagedQueryResponse,
} from '@commercetools/platform-sdk';

import { ctpClientHTTPAPI } from './client-builder';
import { ctClientConfig } from '../config/ct';

export abstract class BaseRepository {
  protected apiRoot!: ApiRoot;
  protected projectKey = ctClientConfig.projectKey;

  constructor() {}

  /** Lazy initialization of apiRoot */
  private getApiRoot(): ApiRoot {
    if (!this.apiRoot) {
      this.apiRoot = createApiBuilderFromCtpClient(ctpClientHTTPAPI);
    }
    return this.apiRoot;
  }

  /** Request builder for the project */
  protected requestBuilder() {
    return this.getApiRoot().withProjectKey({
      projectKey: this.projectKey,
    });
  }

  /** Get project */
  async getCtProject(): Promise<Project> {
    const response = await this.requestBuilder().get().execute();
    return response.body;
  }

  /** Get product types */
  async getCtProductTypes(): Promise<ProductTypePagedQueryResponse> {
    const response = await this.requestBuilder().productTypes().get().execute();

    return response.body;
  }
}
