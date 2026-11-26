// 日文字符：汉字、平假名、片假名（含长音符 ー）
const JA = String.raw`[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]`;
const SPACE_BETWEEN_JA = new RegExp(`(?<=${JA})[ \\t]+(?=${JA})`, 'gu');

/**
 * 职务经历书文本入库前的规范化：统一字符的写法（全半角、康熙部首、空格），
 * 使同一内容无论来自 PDF、Word 还是粘贴，字符种类一致。
 * 不保证换行位置一致，所以 feat-008 匹配根拠时必须忽略空白与换行。
 *
 * ponytail: 不合并 PDF 的硬换行（无法区分段落换行和硬换行）
 */
export function normalizeText(raw: string): string {
  return raw
    .normalize('NFKC') // 全角英数→半角，半角カナ→全角，全角空格→半角空格
    .replace(/[\u200b\ufeff]/g, '') // 零宽字符、BOM
    .replace(/\r\n?/g, '\n')
    .replace(SPACE_BETWEEN_JA, '') // PDF 抽取常在日文字符间插空格
    .replace(/[ \t]+/g, ' ') // 连续空白合并
    .replace(/ ?\n ?/g, '\n') // 行首行尾空格
    .replace(/\n{3,}/g, '\n\n') // 最多保留一个空行
    .trim();
}
