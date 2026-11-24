import { qaSchema } from '@ai-interview/shared';

describe('@ai-interview/shared', () => {
  it('api 能导入并使用 qaSchema', () => {
    const result = qaSchema.safeParse({
      kind: 'standard',
      status: 'needs-confirmation',
      question: '自己紹介をお願いします',
      followUpQuestion: '直近の担当業務を教えてください',
    });
    expect(result.success).toBe(true);
  });
});
