import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SCANNED_PDF_ERROR_CODE } from '@ai-interview/shared';
import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';
import { normalizeText } from './normalize-text.js';

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_PAGES = 30; // unpdf 一次会处理所有页，先限页数防止被超大文件拖住
// 规范化后文字少于此值，视为扫描版（图片）PDF。真实職務経歴書远多于 50 字
// ponytail: 阈值是经验值；混合页（部分图片）的 PDF 可能漏判，需要时改为按页判断
const MIN_PDF_TEXT_LENGTH = 50;

// 按文件头判断类型，不信扩展名和客户端给的 mimetype
function detectKind(buf: Buffer): 'pdf' | 'docx' | null {
  if (buf.subarray(0, 5).toString('latin1') === '%PDF-') return 'pdf';
  if (buf.subarray(0, 4).toString('latin1') === 'PK\x03\x04') return 'docx'; // docx 是 zip；不是 docx 的 zip 会在 mammoth 里报错
  return null;
}

async function pdfToText(buf: Buffer): Promise<string> {
  let pdf;
  try {
    pdf = await getDocumentProxy(new Uint8Array(buf));
  } catch {
    throw new BadRequestException(
      'PDFを読み取れません（破損またはパスワード保護の可能性があります）',
    );
  }
  if (pdf.numPages > MAX_PDF_PAGES)
    throw new BadRequestException(
      `PDFは${MAX_PDF_PAGES}ページ以内にしてください`,
    );

  const { text } = await extractText(pdf, { mergePages: true });
  if (normalizeText(text).length < MIN_PDF_TEXT_LENGTH)
    throw new UnprocessableEntityException({
      code: SCANNED_PDF_ERROR_CODE,
      message:
        'このPDFからはテキストを抽出できません（スキャン画像の可能性があります）。本文を貼り付けて入力してください',
    });
  return text;
}

async function docxToText(buf: Buffer): Promise<string> {
  try {
    return (await mammoth.extractRawText({ buffer: buf })).value;
  } catch {
    throw new BadRequestException('Wordファイル(.docx)を読み取れません');
  }
}

/** 上传文件 → 原始文本（未规范化，入库时由 CareerDocumentService 规范化） */
export async function extractTextFromFile(buf: Buffer): Promise<string> {
  const kind = detectKind(buf);
  if (kind === 'pdf') return pdfToText(buf);
  if (kind === 'docx') return docxToText(buf);
  throw new BadRequestException(
    'PDF または Word(.docx) をアップロードしてください',
  );
}
