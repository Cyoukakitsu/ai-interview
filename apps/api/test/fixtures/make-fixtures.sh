#!/usr/bin/env bash
# 由 resume.html（虚构内容）生成 e2e 用的样本：resume.pdf、resume.docx、scanned.pdf（纯图片版）
# 依赖 macOS：Google Chrome（无头打印）与 textutil。生成物不进 git（见根 .gitignore）
set -euo pipefail
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=resume.pdf "file://$PWD/resume.html" >/dev/null 2>&1

# 扫描版：先截成图片，再把图片打印成 PDF，这样 PDF 里没有文字层
"$CHROME" --headless=new --disable-gpu --window-size=900,700 \
  --screenshot="$TMP/page.png" "file://$PWD/resume.html" >/dev/null 2>&1
echo '<html><body style="margin:0"><img src="page.png" style="width:100%"></body></html>' > "$TMP/scan.html"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=scanned.pdf "file://$TMP/scan.html" >/dev/null 2>&1

textutil -convert docx resume.html -output resume.docx
ls -la resume.pdf scanned.pdf resume.docx
