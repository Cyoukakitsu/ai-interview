import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ResumeModule } from './resume/resume.module.js';

@Module({
  imports: [PrismaModule, ResumeModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局启用：@Body({ schema }) 等参数上的 zod schema 才会真正被校验
    { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
  ],
})
export class AppModule {}
