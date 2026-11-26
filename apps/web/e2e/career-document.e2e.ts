import { expect, test } from "@playwright/test";
import path from "node:path";

const fx = (name: string) =>
  path.join(__dirname, "../../api/test/fixtures", name);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

for (const name of ["resume.pdf", "resume.docx"]) {
  test(`${name}：上传后提示保存成功`, async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(fx(name));
    await page.getByRole("button", { name: "アップロード" }).click();
    await expect(page.getByText("保存しました")).toBeVisible();
  });
}

test("扫描版 PDF：提示无法抽取，并能一键切到贴り付け", async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles(fx("scanned.pdf"));
  await page.getByRole("button", { name: "アップロード" }).click();
  await expect(page.getByText("テキストを抽出できません").first()).toBeVisible();

  await page.getByRole("button", { name: "テキストを貼り付けに切り替える" }).click();
  await expect(page.getByPlaceholder("職務経歴書の本文を貼り付けてください")).toBeVisible();
});

test("粘贴文本：成功；空文本：不发请求并提示", async ({ page }) => {
  await page.getByRole("tab", { name: "テキストを貼り付け" }).click();
  await page.getByRole("button", { name: "アップロード" }).click();
  await expect(page.getByText("本文を入力してください")).toBeVisible();

  await page.getByPlaceholder("職務経歴書の本文を貼り付けてください").fill("Ｗｅｂ開発を５年担当しました。");
  await page.getByRole("button", { name: "アップロード" }).click();
  await expect(page.getByText("保存しました")).toBeVisible();
});

test("没选文件就提交：提示选择文件", async ({ page }) => {
  await page.getByRole("button", { name: "アップロード" }).click();
  await expect(page.getByText("ファイルを選択してください")).toBeVisible();
});
