import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js'; // ESM 要带 .js 后缀

export const DEFAULT_APPLICANT_ID = 'default-applicant';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 连接串来自根 .env，main.ts 启动时已经加载进 process.env
    const adapter = new PrismaPg({
      connectionString: process.env['DATABASE_URL'],
    });
    super({ adapter }); // 把 adapter 交给父类 PrismaClient
  }

  async onModuleInit() {
    // $connect() 在 adapter 模式下是懒连接，不会真连库；
    // 用一次真实查询让「库连不上」在启动时就报错
    await this.$queryRaw`SELECT 1`;

    // 单用户 MVP：固定 id + skipDuplicates（INSERT ... ON CONFLICT DO NOTHING）。
    // 不用 upsert：Prisma 的 upsert 是先查后插，并发启动时会撞主键
    await this.applicant.createMany({
      data: [{ id: DEFAULT_APPLICANT_ID }],
      skipDuplicates: true,
    });
  }
}
