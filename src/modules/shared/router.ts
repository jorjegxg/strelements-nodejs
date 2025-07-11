import express from "express";
import {
  getEffect,
  getEffects,
  getEffectSettings,
  getEffectSettingsFromKickId,
  updateEffectSettings,
} from "./controller";

export const sharedRouter = express.Router();

sharedRouter.get("/effects", getEffects);
sharedRouter.get("/effect", getEffect);
sharedRouter.get("/effect/settings", getEffectSettings);
sharedRouter.put("/effect/settings", updateEffectSettings);
sharedRouter.get("/effect/settings/platform", getEffectSettingsFromKickId);
