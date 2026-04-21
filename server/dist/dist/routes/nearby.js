import express from "express";
import { findNearbyPlaces } from "../utils/nearbyPlaces.js";
const router = express.Router();
router.get("/", (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({
            error: "lat and lng query parameters are required.",
        });
    }
    const nearby = findNearbyPlaces([lat, lng], {
        category: category,
        limit: 5,
        maxDistanceKm: 5,
    });
    return res.json({ places: nearby });
});
export default router;
