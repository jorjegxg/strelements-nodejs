import express from "express";
import {
  getEffect,
  getEffects,
  getEffectSettings,
  updateEffectSettings,
} from "./controller";

export const sharedRouter = express.Router();

sharedRouter.get("/effects", getEffects);
sharedRouter.get("/effect", getEffect);
sharedRouter.get("/effect/settings", getEffectSettings);
sharedRouter.put("/tiny-walkers/settings", updateEffectSettings);
