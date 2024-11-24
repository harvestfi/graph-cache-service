import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CacheModule } from './cache/cache.module';
import { GraphModule } from './graph/graph.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule,
    GraphModule,
    UtilsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
