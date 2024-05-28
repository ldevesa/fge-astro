import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    image: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()),
  })
});

const redCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    map: z.string().optional(),
    publishDate: z.coerce.date(),
  })
});

export const collections = {
  'blog': blogCollection,
  'red': redCollection
};