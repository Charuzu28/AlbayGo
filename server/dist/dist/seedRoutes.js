import mongoose from "mongoose";
import Route from "./models/Route.js";
import dotenv from "dotenv";
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Route.deleteMany();
await Route.insertMany([
    {
        fromKey: "airport",
        toKey: "sm-legazpi",
        from: "Bicol International Airport",
        to: "SM Legazpi",
        vehicle: "Taxi",
        via: ["Daraga"],
        fare: "Verify locally",
        notes: "Fastest option. Fare should be verified with current local rates."
    },
    {
        fromKey: "sm-legazpi",
        toKey: "airport",
        from: "SM Legazpi",
        to: "Bicol International Airport",
        vehicle: "Taxi",
        via: ["Daraga"],
        fare: "Verify locally",
        notes: "Fastest reverse route. Fare should be verified with current local rates."
    },
    {
        fromKey: "daraga",
        toKey: "legazpi-boulevard",
        from: "Daraga",
        to: "Legazpi Boulevard",
        vehicle: "Jeepney",
        via: ["Mercury Drug Daraga"],
        fare: "₱15",
        notes: "Budget-friendly route."
    },
    {
        fromKey: "legazpi-boulevard",
        toKey: "daraga",
        from: "Legazpi Boulevard",
        to: "Daraga",
        vehicle: "Jeepney",
        via: ["Mercury Drug Daraga"],
        fare: "₱15",
        notes: "Common return route."
    }
]);
console.log("Routes seeded");
process.exit();
