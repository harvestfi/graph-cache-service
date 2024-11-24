import { Module } from '@nestjs/common';
import { NetworkUtils } from './network.utils';

@Module({
  providers: [NetworkUtils],
  exports: [NetworkUtils],
})
export class UtilsModule {}
