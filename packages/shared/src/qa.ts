import { z } from "zod";

// 想定問答的类型：標準質問 / 深掘り質問。feat-009 要按它分组显示
export const qaKindSchema = z.enum(["standard", "deep-dive"]);

// 所有条目共有的字段
const baseFields = {
  kind: qaKindSchema,
  question: z.string().min(1), // 面试官会问的问题
};

// 正常条目：有回答，也有根拠
const okQaSchema = z.object({
  ...baseFields,
  status: z.literal("ok"),
  answer: z.string().min(1),
  // 根拠：職務経歴書里的原文片段。至少 1 条，因为"找不到根拠视为编造"
  evidence: z.array(z.string().min(1)).min(1),
});

// 要確認条目：没有回答，只有 Agent 向求職者提出的追问
const needsConfirmationQaSchema = z.object({
  ...baseFields,
  status: z.literal("needs-confirmation"),
  followUpQuestion: z.string().min(1),
});

// 判别联合：按 status 区分两种形态
export const qaSchema = z.discriminatedUnion("status", [
  okQaSchema,
  needsConfirmationQaSchema,
]);

export type Qa = z.infer<typeof qaSchema>;
