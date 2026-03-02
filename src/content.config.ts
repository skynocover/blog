import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.enum(['科技觀察', '技術筆記', '隨筆']),
    description: z.string(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
