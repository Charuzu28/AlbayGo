import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "./models/Route.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Route.deleteMany();

await Route.insertMany([
  {
    from: "Daraga Airport",
    fromKey: "airport",
    to: "SM Legazpi",
    toKey: "sm legazpi",
    vehicle: "Taxi",
    via: ["Daraga"],
    fare: "₱15–₱20",
    notes: "Ask the driver going to SM or Terminal"
  },
  {
    from: "SM Legazpi",
    fromKey: "sm legazpi",
    to: "Daraga",
    toKey: "daraga",
    vehicle: "Jeepney",
    via: ["Terminal"],
    fare: "₱15",
    notes: "Common public route"
  },
  {
    from: "Legazpi Port",
    fromKey: "legazpi port",
    to: "SM Legazpi",
    toKey: "sm legazpi",
    vehicle: "Tricycle",
    via: [],
    fare: "₱30–₱50",
    notes: "Fare depends on distance"
  }
]);

console.log("Routes seeded");
process.exit();
