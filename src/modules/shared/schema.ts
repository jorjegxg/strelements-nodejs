import z from "zod";

export const getEffectSchema = z.object({
  name: z.string().min(1, "Missing name"),
});

export const effectSettingsReqSchema = z.object({
  app_user_id: z.string(),
  effect_name: z.string(),
});

export const updateEffectSettingsSchema = z.object({
  app_user_id: z.number().min(1, "Missing app_user_id"),
  effect_name: z.string().min(1, "Missing effect_name"),
  settings: z.array(z.any()),
});

export const kickEffectSettingsSchema = z.object({
  platform_id: z.string().min(1, "Missing app_user_id"),
  effect_name: z.string().min(1, "Missing effect_name"),
});
