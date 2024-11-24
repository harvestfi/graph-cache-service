import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { UtilsModule } from '../utils/utils.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  providers: [GraphService],
  controllers: [GraphController],
  imports: [UtilsModule, CacheModule],
})
export class GraphModule {}
