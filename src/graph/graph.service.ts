import { Injectable } from '@nestjs/common';
import { NetworkUtils } from '../utils/network.utils';
import { CacheService } from '../cache/cache.service';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class GraphService {
  constructor(
    private readonly networkUtils: NetworkUtils,
    private readonly cacheService: CacheService,
  ) {}

  async execute(
    chainId: number,
    request: { query: string; variables?: any },
  ): Promise<any> {
    const key = this.generateKey(chainId, request.query);
    const cacheResponse = this.cacheService.get(key);

    if (cacheResponse) {
      return cacheResponse;
    }

    const link = this.networkUtils.getLinkByChainId(chainId);
    const response = await this.executeWithRetry(link, request, 3);
    const ttl = this.cacheService.generateExpirationTime(request.query) || 3600; // Default TTL: 1 hour
    this.cacheService.set(key, response, ttl);

    return response;
  }

  private async executeWithRetry(
    link: string,
    request: { query: string; variables?: any },
    retryLimit: number,
    delay: number = 1000,
  ): Promise<any> {
    let attempts = 0;
    while (attempts < retryLimit) {
      try {
        return await this.executeToGraph(link, request);
      } catch (error) {
        console.error(`Request failed: ${error.message}`);
        attempts++;
        if (attempts >= retryLimit) {
          throw new Error(
            `Failed to execute request after ${retryLimit} attempts`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async executeToGraph(
    link: string,
    request: { query: string; variables?: any },
  ): Promise<any> {
    try {
      const response = await axios.post(link, request, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.errors) {
        throw new Error(
          `GraphQL Errors: ${JSON.stringify(response.data.errors)}`,
        );
      }

      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to execute GraphQL query: ${error.message}`);
    }
  }

  private generateKey(chainId: number, query: string): string {
    const key = `${chainId}-${query}`;
    return crypto.createHash('sha256').update(key).digest('hex');
  }
}
