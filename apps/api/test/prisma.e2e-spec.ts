import { Test } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('PrismaService (e2e)', () => {
  it('能连上数据库并执行查询', async () => {
    // 只装 PrismaModule，不拉起整个 AppModule，测试范围最小
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
    await moduleRef.init(); // 触发 onModuleInit，库连不上会在这里抛错

    const prisma = moduleRef.get(PrismaService);
    const rows = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
    expect(rows[0].ok).toBe(1);

    await moduleRef.close(); // 释放连接，否则测试进程不退出
  });
});
