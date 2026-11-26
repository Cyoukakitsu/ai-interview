import { z } from "zod";

// 職務経歴書文本的上限（字符数）。日文每字 3 字节，30_000 字约 90KB，刚好在 Express 默认 100KB 请求体上限之内，
// 这样超长由 zod 返回 400，而不是被框架先以 413 拦下
export const CAREER_DOCUMENT_MAX_LENGTH = 30_000;

// 扫描版（图片）PDF 抽不出文字时，api 返回的错误码；web 据此引导改为粘贴文本
export const SCANNED_PDF_ERROR_CODE = "SCANNED_PDF";

// 粘贴文本入库的请求体
export const createCareerDocumentSchema = z.object({
  text: z.string().min(1).max(CAREER_DOCUMENT_MAX_LENGTH),
});

export type CreateCareerDocumentInput = z.infer<
  typeof createCareerDocumentSchema
>;
