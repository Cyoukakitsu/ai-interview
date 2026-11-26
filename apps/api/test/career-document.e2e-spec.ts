import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('POST /career-documents (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('规范化后入库，挂在默认求職者下', async () => {
    const res = await request(app.getHttpServer())
      .post('/career-documents')
      .send({ text: 'Ｗｅｂ　開 発\r\n\r\n\r\nｼｽﾃﾑ' })
      .expect(201);

    const saved = await prisma.careerDocument.findUniqueOrThrow({
      where: { id: res.body.id },
    });
    expect(saved.text).toBe('Web 開発\n\nシステム');
    expect(saved.applicantId).toBe('default-applicant');
    await prisma.careerDocument.delete({ where: { id: saved.id } });
  });

  it.each([
    ['缺 text', {}],
    ['text 为空', { text: '' }],
    ['text 不是字符串', { text: 123 }],
    ['text 超长', { text: 'あ'.repeat(30_001) }],
    ['规范化后为空（全是空白）', { text: ' 　\n\t ' }],
  ])('400 且不入库：%s', async (_name, body) => {
    const before = await prisma.careerDocument.count();
    await request(app.getHttpServer())
      .post('/career-documents')
      .send(body)
      .expect(400);
    expect(await prisma.careerDocument.count()).toBe(before);
  });
});

describe('POST /career-documents/upload (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const fx = (name: string) =>
    fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));
  const flat = (s: string) => s.replace(/\s/g, ''); // 比对时忽略空白与换行

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });
  afterEach(async () => {
    await app.close();
  });

  const post = () =>
    request(app.getHttpServer()).post('/career-documents/upload');

  it.each(['resume.pdf', 'resume.docx'])(
    '%s：抽出文本并规范化入库',
    async (name) => {
      const tmpBefore = readdirSync(tmpdir()).length;
      const res = await post().attach('file', fx(name)).expect(201);
      const saved = await prisma.careerDocument.findUniqueOrThrow({
        where: { id: res.body.id },
      });
      const text = flat(saved.text);
      expect(text).toContain('山田太郎'); // PDF 里是康熙部首字符，NFKC 后应还原为正常汉字
      expect(text).toContain('株式会社サンプル'); // 表格单元格被硬换行拆开也能匹配
      expect(text).toContain('AWS上でのシステム開発'); // 全角英数已转半角
      expect(readdirSync(tmpdir()).length).toBe(tmpBefore); // 原始文件没有落盘
      await prisma.careerDocument.delete({ where: { id: saved.id } });
    },
  );

  it('扫描版 PDF：422 + SCANNED_PDF，提示改为粘贴文本，不入库', async () => {
    const before = await prisma.careerDocument.count();
    const res = await post().attach('file', fx('scanned.pdf')).expect(422);
    expect(res.body.code).toBe('SCANNED_PDF');
    expect(await prisma.careerDocument.count()).toBe(before);
  });

  it.each([
    ['非 PDF/Word 的内容', Buffer.from('hello'), 'a.txt'],
    ['扩展名是 pdf 但内容不是', Buffer.from('not a pdf'), 'fake.pdf'],
    ['损坏的 PDF', Buffer.from('%PDF-1.4 broken'), 'broken.pdf'],
    ['不是 docx 的 zip', Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 0]), 'x.docx'],
  ])('400：%s', async (_n, buf, filename) => {
    await post().attach('file', buf, filename).expect(400);
  });

  it('400：没带 file', async () => {
    await post().field('x', '1').expect(400);
  });

  it('413：超过 5MB', async () => {
    await post()
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), 'big.pdf')
      .expect(413);
  });
});
