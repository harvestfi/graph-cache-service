import { Injectable } from '@nestjs/common';

const DEFAULT_TTL = 10 * 60 * 60 * 1000; // 10 hours
const SHORT_TTL = 10 * 60 * 1000; // 10 min

@Injectable()
export class CacheService {
  private cache = new Map<string, { value: string; expiresAt: number }>();

  set(key: string, value: string, ttl: number) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  generateExpirationTime(request: string): number {
    if (request.includes('userBalanceHistories')) {
      return SHORT_TTL;
    }
    return DEFAULT_TTL;
  }
}
