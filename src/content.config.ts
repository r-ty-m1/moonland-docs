import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      // 文章類型：功能介紹、應用、主題應用、模型介紹
      type: z.enum(['功能介紹', '應用', '主題應用', '模型介紹', '分類總覽', '團隊管理']).optional(),
      // 難度：顯示在標題下方
      level: z.enum(['新手', '進階', '團隊']).optional(),
      // 適用模型，例如 ['FLUX.2']
      models: z.array(z.string()).optional(),
      // 預估閱讀時間（分鐘）
      minutes: z.number().optional(),
      // 搬移追蹤：原本的 Notion 頁面
      notionUrl: z.string().url().optional(),
      // 搬移狀態：todo = 尚未搬移，done = 已依新範本改寫
      migration: z.enum(['todo', 'done']).default('done'),
    }),
  }),
});

export const collections = { docs };
