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

export const collections = {
  'blog': blogCollection
};