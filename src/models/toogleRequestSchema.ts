import z from 'zod';

const toggleRequestBodySchema = z.object({
  isActive: z.boolean(),
  accessToken: z.string(),
});


export { toggleRequestBodySchema };

