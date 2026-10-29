import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Software', 'Automation', 'AI', 'Hardware']),
    year: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    github: z.string().optional(),
    demo: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { projects };
