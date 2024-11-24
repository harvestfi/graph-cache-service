import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NetworkUtils {
  private readonly ethUrl = this.configService.get<string>('ETH_URL');
  private readonly polygonUrl = this.configService.get<string>('POLYGON_URL');
  private readonly zkSyncUrl = this.configService.get<string>('ZKSYNC_URL');
  private readonly baseUrl = this.configService.get<string>('BASE_URL');
  private readonly arbitrumUrl = this.configService.get<string>('ARBITRUM_URL');

  constructor(private configService: ConfigService) {}

  getLinkByChainId(chainId: number) {
    switch (chainId) {
      case 1:
        return this.ethUrl;
      case 137:
        return this.polygonUrl;
      case 324:
        return this.zkSyncUrl;
      case 8453:
        return this.baseUrl;
      case 42161:
        return this.arbitrumUrl;
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }
}
