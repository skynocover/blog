import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.enum(['深度分析', '新聞精選']),
    description: z.string(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
