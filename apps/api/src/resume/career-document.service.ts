import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DEFAULT_APPLICANT_ID,
  PrismaService,
} from '../prisma/prisma.service.js';
import { normalizeText } from './normalize-text.js';

@Injectable()
export class CareerDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  /** 规范化后入库，挂在默认求職者下。PDF / Word 解析出文本后也走这里 */
  async createFromText(rawText: string) {
    const text = normalizeText(rawText);
    if (!text) throw new BadRequestException('職務経歴書の本文が空です');
    return this.prisma.careerDocument.create({
      data: { applicantId: DEFAULT_APPLICANT_ID, text },
      select: { id: true },
    });
  }
}
