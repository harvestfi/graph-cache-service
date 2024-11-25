import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller()
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post(':chainId')
  @HttpCode(200)
  async setCache(
    @Param('chainId') chainId: string,
    @Body() body: any,
  ): Promise<string> {
    return await this.graphService.execute(parseInt(chainId), body);
  }
}
