import { ProjectRepository } from './project-repo';
import cache from '../../utils/cache';
import logger from '../../utils/logger';
import {
  ProductTypePagedQueryResponse,
  Project,
} from '@commercetools/platform-sdk';

const CACHE_KEYS = {
  PROJECT: 'ct:project',
  PRODUCT_TYPES: 'ct:product-types',
};

const CACHE_TTL = {
  PROJECT: 3600, // 1 hour
  PRODUCT_TYPES: 3600, // 1 hour
};

const createProjectRepo = () => {
  return new ProjectRepository();
};

export const getProject = async () => {
  const cacheKey = CACHE_KEYS.PROJECT;

  // Try to get from cache
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug('Returning cached project');
    return cached as Project;
  }

  // Fetch from API
  logger.debug('Fetching project from API');
  const projectRepo = createProjectRepo();
  const project = await projectRepo.getProject();

  // Store in cache
  cache.set(cacheKey, project, CACHE_TTL.PROJECT);

  return project;
};

export const getProductTypes = async () => {
  const cacheKey = CACHE_KEYS.PRODUCT_TYPES;

  // Try to get from cache
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug('Returning cached product types');
    return cached as ProductTypePagedQueryResponse;
  }

  // Fetch from API
  logger.debug('Fetching product types from API');
  const projectRepo = createProjectRepo();
  const productTypes = await projectRepo.getProductTypes();

  // Store in cache
  cache.set(cacheKey, productTypes, CACHE_TTL.PRODUCT_TYPES);

  return productTypes;
};
