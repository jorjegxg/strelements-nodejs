import z from "zod";

export const getEffectSchema = z.object({
  name: z.string().min(1, "Missing name"),
});
