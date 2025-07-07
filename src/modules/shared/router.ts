import express from "express";
import { getEffect, getEffects } from "./controller";

export const sharedRouter = express.Router();

sharedRouter.get("/effects", getEffects);
sharedRouter.get("/effect", getEffect);
