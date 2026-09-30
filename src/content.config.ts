import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/** A string in both site languages. */
const L = z.object({ de: z.string(), en: z.string() });
const LList = z.object({ de: z.array(z.string()), en: z.array(z.string()) });

/**
 * `draft: true` marks content the client has not confirmed yet. Drafts render with an
 * "Entwurf" marker on preview deployments and are listed by `npm run content:drafts`.
 */
const draft = z.boolean().default(false);

const packages = defineCollection({
  loader: file('src/content/data/packages.yaml'),
  schema: z.object({
    order: z.number(),
    draft,
    popular: z.boolean().default(false),
    priceFrom: z.number().positive(),
    group: z.enum(['interior', 'exterior', 'complete', 'ceramic']),
    name: L,
    duration: L,
    summary: L,
    includes: LList,
    note: L.optional(),
  }),
});

const addons = defineCollection({
  loader: file('src/content/data/addons.yaml'),
  schema: z.object({
    order: z.number(),
    draft,
    priceFrom: z.number().positive().optional(),
    name: L,
    desc: L,
  }),
});

const faqs = defineCollection({
  loader: file('src/content/data/faqs.yaml'),
  schema: z.object({
    page: z.enum(['home', 'car', 'aviation']),
    order: z.number(),
    draft,
    q: L,
    a: L,
  }),
});

const aviationServices = defineCollection({
  loader: file('src/content/data/aviation-services.yaml'),
  schema: z.object({
    order: z.number(),
    draft,
    icon: z.enum(['wash', 'brightwork', 'paint', 'cabin', 'handover', 'programme']),
    name: L,
    desc: L,
  }),
});

const airfields = defineCollection({
  loader: file('src/content/data/airfields.yaml'),
  schema: z.object({
    order: z.number(),
    draft,
    base: z.boolean().default(false),
    icao: z.string().length(4),
    name: z.string(),
    city: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
});

const aviationStats = defineCollection({
  loader: file('src/content/data/aviation-stats.yaml'),
  schema: z.object({
    order: z.number(),
    draft,
    value: L,
    label: L,
  }),
});

export const collections = { packages, addons, faqs, aviationServices, airfields, aviationStats };
