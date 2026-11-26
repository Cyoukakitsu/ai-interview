"use client";

import { useState } from "react";
import {
  CAREER_DOCUMENT_MAX_LENGTH,
  createCareerDocumentSchema,
  SCANNED_PDF_ERROR_CODE,
} from "@ai-interview/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type ApiError,
  createCareerDocumentFromFile,
  createCareerDocumentFromText,
} from "@/lib/api";

type Result =
  | { kind: "ok"; id: string }
  | { kind: "error"; error: ApiError };

export function CareerDocumentForm() {
  const [mode, setMode] = useState<string>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // 扫描版 PDF：api 返回 SCANNED_PDF，引导用户切到「貼り付け」
  const scanned = result?.kind === "error" && result.error.code === SCANNED_PDF_ERROR_CODE;

  async function submit() {
    setPending(true);
    setResult(null);
    try {
      if (mode === "file") {
        if (!file) throw { status: 0, message: "ファイルを選択してください" } satisfies ApiError;
        const { id } = await createCareerDocumentFromFile(file);
        setResult({ kind: "ok", id });
      } else {
        // 与 api 共用同一份 zod schema，提交前先在浏览器里校验
        const parsed = createCareerDocumentSchema.safeParse({ text });
        if (!parsed.success)
          throw {
            status: 0,
            message: `本文を入力してください（${CAREER_DOCUMENT_MAX_LENGTH.toLocaleString()}文字以内）`,
          } satisfies ApiError;
        const { id } = await createCareerDocumentFromText(parsed.data);
        setResult({ kind: "ok", id });
      }
    } catch (e) {
      setResult({ kind: "error", error: e as ApiError });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Tabs value={mode} onValueChange={(v) => { setMode(v as string); setResult(null); }}>
        <TabsList>
          <TabsTrigger value="file">PDF / Word</TabsTrigger>
          <TabsTrigger value="text">テキストを貼り付け</TabsTrigger>
        </TabsList>
        <TabsContent value="file" className="flex flex-col gap-2 pt-2">
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <p className="text-muted-foreground text-xs">
            5MB以内。ファイルは保存されず、抽出したテキストのみ保存されます。
          </p>
        </TabsContent>
        <TabsContent value="text" className="pt-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            placeholder="職務経歴書の本文を貼り付けてください"
          />
        </TabsContent>
      </Tabs>

      <Button onClick={submit} disabled={pending} className="self-start">
        {pending ? "送信中…" : "アップロード"}
      </Button>

      {result?.kind === "ok" && (
        <Alert>
          <AlertTitle>保存しました</AlertTitle>
          <AlertDescription>職務経歴書を登録しました（ID: {result.id}）</AlertDescription>
        </Alert>
      )}
      {result?.kind === "error" && (
        <Alert variant="destructive">
          <AlertTitle>{scanned ? "テキストを抽出できません" : "登録できませんでした"}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span className="whitespace-pre-line">{result.error.message}</span>
            {scanned && (
              <Button variant="outline" size="sm" className="self-start" onClick={() => { setMode("text"); setResult(null); }}>
                テキストを貼り付けに切り替える
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
