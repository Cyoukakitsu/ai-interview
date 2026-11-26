import type { CreateCareerDocumentInput } from "@ai-interview/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiError = { code?: string; message: string };

// api 的错误体：{ message: string | string[], code?: string }
async function toApiError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => ({}));
  const message = Array.isArray(body.message) ? body.message.join("\n") : body.message;
  return { code: body.code, message: message ?? "エラーが発生しました" };
}

async function post(path: string, init: RequestInit): Promise<{ id: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { method: "POST", ...init });
  } catch {
    throw { message: "サーバーに接続できません" } satisfies ApiError;
  }
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

/** 粘贴文本入库 */
export const createCareerDocumentFromText = (input: CreateCareerDocumentInput) =>
  post("/career-documents", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

/** 上传 PDF / Word；不要手动设置 Content-Type，浏览器会带上 multipart 边界 */
export const createCareerDocumentFromFile = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return post("/career-documents/upload", { body: form });
};
