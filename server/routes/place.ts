import express, { type Request, type Response } from "express";
import { PLACE_REGISTRY } from "../data/placeRegistery.js";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    places: PLACE_REGISTRY,
  });
});

export default router;