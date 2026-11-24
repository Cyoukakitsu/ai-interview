import { describe, expect, it } from "vitest";
import { qaSchema } from "../src/qa.js";

const ok = {
  kind: "standard",
  status: "ok",
  question: "自己紹介をお願いします",
  answer: "Web 開発を 5 年担当してきました。",
  evidence: ["Web アプリケーションの開発に 5 年従事"],
};

const needsConfirmation = {
  kind: "deep-dive",
  status: "needs-confirmation",
  question: "チームの規模は？",
  followUpQuestion: "このプロジェクトのチームは何人でしたか？",
};

describe("qaSchema", () => {
  describe("合法数据", () => {
    it("接受正常条目", () => {
      expect(qaSchema.safeParse(ok).success).toBe(true);
    });

    it("接受要確認条目", () => {
      expect(qaSchema.safeParse(needsConfirmation).success).toBe(true);
    });
  });

  describe("非法数据", () => {
    it.each([
      ["缺 evidence", { ...ok, evidence: undefined }],
      ["evidence 为空数组", { ...ok, evidence: [] }],
      ["evidence 含空字符串", { ...ok, evidence: [""] }],
      ["缺 answer", { ...ok, answer: undefined }],
      ["要確認缺 followUpQuestion", { ...needsConfirmation, followUpQuestion: undefined }],
      ["要確認的 followUpQuestion 为空", { ...needsConfirmation, followUpQuestion: "" }],
      ["未知 status", { ...ok, status: "done" }],
      ["未知 kind", { ...ok, kind: "other" }],
      ["question 为空", { ...ok, question: "" }],
    ])("拒绝：%s", (_name, data) => {
      expect(qaSchema.safeParse(data).success).toBe(false);
    });

    it("要確認条目不带回答（多余的 answer 被剥掉，不会混成正常条目）", () => {
      const result = qaSchema.safeParse({ ...needsConfirmation, answer: "编造的回答" });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).not.toHaveProperty("answer");
    });
  });
});
