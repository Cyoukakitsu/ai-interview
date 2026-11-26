import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createCareerDocumentSchema,
  type CreateCareerDocumentInput,
} from '@ai-interview/shared';
import { extractTextFromFile, MAX_FILE_BYTES } from './extract-text.js';
import { CareerDocumentService } from './career-document.service.js';

@Controller('career-documents')
export class CareerDocumentController {
  constructor(private readonly service: CareerDocumentService) {}

  // 粘贴文本入库；校验交给 Nest 内置的 StandardSchema 管道（zod）
  @Post()
  create(
    @Body({ schema: createCareerDocumentSchema })
    body: CreateCareerDocumentInput,
  ) {
    return this.service.createFromText(body.text);
  }

  // 上传 PDF / Word：不指定 storage，multer 默认放内存，原始文件不会落盘
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_BYTES } }),
  )
  async upload(@UploadedFile() file?: { buffer: Buffer }) {
    if (!file) throw new BadRequestException('file フィールドが必要です');
    return this.service.createFromText(await extractTextFromFile(file.buffer));
  }
}
