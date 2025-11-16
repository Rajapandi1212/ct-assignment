import logger from './logger';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private defaultTTL: number; // in seconds

  constructor(defaultTTL: number = 3600) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // Clean up expired entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const ttlSeconds = ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.cache.set(key, { value, expiresAt });
    logger.debug('Cache SET', { key, ttl: ttlSeconds });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      logger.debug('Cache MISS', { key });
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      logger.debug('Cache EXPIRED', { key });
      return undefined;
    }

    logger.debug('Cache HIT', { key });
    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug('Cache DEL', { key });
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    logger.info('Cache CLEARED');
  }

  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      logger.debug('Cache CLEANUP', { expiredCount });
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance with 1 hour default TTL
export default new SimpleCache(3600);
