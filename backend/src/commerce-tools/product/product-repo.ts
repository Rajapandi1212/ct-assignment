import { BaseRepository } from '../base-repo';

export class ProductRepository extends BaseRepository {
  constructor() {
    super();
  }
  async query() {
    const products = await this.requestBuilder()
      .productProjections()
      .search()
      .get({ queryArgs: { limit: 12 } })
      .execute();
    return products;
  }
}
