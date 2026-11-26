import { Module } from '@nestjs/common';
import { CareerDocumentController } from './career-document.controller.js';
import { CareerDocumentService } from './career-document.service.js';

@Module({
  controllers: [CareerDocumentController],
  providers: [CareerDocumentService],
})
export class ResumeModule {}
