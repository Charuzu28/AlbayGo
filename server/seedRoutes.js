import mongoose from "mongoose";
import Route from "./models/Route.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Route.deleteMany();

await Route.insertMany([
  {
    fromKey: "airport",
    toKey: "sm legazpi",
    from: "Daraga Airport",
    to: "SM Legazpi",
    vehicle: "Taxi",
    via: ["Daraga"],
    fare: "₱15–₱20",
    notes: "Fastest option"
  },
  {
    fromKey: "daraga",
    toKey: "legazpi boulevard",
    from: "Daraga",
    to: "Legazpi Boulevard",
    vehicle: "Jeepney",
    via: ["Mercury Drug Daraga"],
    fare: "₱15"
  }
]);

console.log("Routes seeded");
process.exit();
