import { z } from 'zod';
import { insertDesignerSchema, designers } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  designers: {
    list: {
      method: 'GET' as const,
      path: '/api/designers' as const,
      responses: {
        200: z.array(z.custom<typeof designers.$inferSelect>()),
      },
    },
    getWinners: {
      method: 'GET' as const,
      path: '/api/designers/winners' as const,
      responses: {
        200: z.array(z.custom<typeof designers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/designers' as const,
      input: insertDesignerSchema,
      responses: {
        201: z.custom<typeof designers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/designers/:id' as const,
      input: insertDesignerSchema.partial(),
      responses: {
        200: z.custom<typeof designers.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    award: {
      method: 'POST' as const,
      path: '/api/designers/:id/award' as const,
      input: z.object({ reason: z.string().optional() }),
      responses: {
        200: z.custom<typeof designers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    removeAward: {
      method: 'POST' as const,
      path: '/api/designers/:id/remove-award' as const,
      responses: {
        200: z.custom<typeof designers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/designers/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}