import express from "express";
import { PLACE_REGISTRY } from "../data/placeRegistery.js";
const router = express.Router();
router.get("/", (_req, res) => {
    res.json({
        places: PLACE_REGISTRY,
    });
});
export default router;
