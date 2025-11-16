import { ProductRepository } from './product-repo';

const productRepo = new ProductRepository();

export const getProducts = async () => {
  const products = await productRepo.query();
  return products;
};
