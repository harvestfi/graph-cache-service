import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_TTL = 10 * 60 * 1000; // 10 min

@Injectable()
export class CacheService {
  private cache = new Map<string, { value: string; expiresAt: number }>();

  constructor(private configService: ConfigService) {}

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

  generateExpirationTime(): number {
    return this.configService.get<number>('CACHE_TTL') || DEFAULT_TTL;
  }
}
