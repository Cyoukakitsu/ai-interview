import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // 全局模块：以后哪个模块要用库，不用再各自 import
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 不 export，别的模块拿不到
})
export class PrismaModule {}
