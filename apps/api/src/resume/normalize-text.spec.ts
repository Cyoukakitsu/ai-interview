import { normalizeText } from './normalize-text.js';

describe('normalizeText', () => {
  it('全角英数统一为半角，半角カナ统一为全角', () => {
    expect(normalizeText('ＡＷＳ　１０年')).toBe('AWS 10年');
    expect(normalizeText('ｼｽﾃﾑ')).toBe('システム');
  });

  it('只去掉两个日文字符之间的空格，英文与日文之间的空格保留', () => {
    expect(normalizeText('シ ス テ ム 開 発')).toBe('システム開発');
    expect(normalizeText('Web 開発 と React 実装')).toBe(
      'Web 開発と React 実装',
    );
  });

  it('统一换行，压缩空行，去掉首尾空白', () => {
    expect(normalizeText('\r\n 業務内容 \r\n\r\n\r\n\r\n成果  \r\n')).toBe(
      '業務内容\n\n成果',
    );
  });

  it('去掉零宽字符与 BOM', () => {
    expect(normalizeText('\ufeff開\u200b発')).toBe('開発');
  });

  it('幂等：规范化两次结果不变', () => {
    const once = normalizeText('Ｗｅｂ　開 発\r\n\r\n\r\nｼｽﾃﾑ');
    expect(normalizeText(once)).toBe(once);
  });
});
