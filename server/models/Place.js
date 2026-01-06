import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  key: String,
  intent: String,          // food | tourist | stay

  description: String,

  category: String,        // landmark, delicacy, heritage
  bestTime: String,        // morning, afternoon, evening

  tips: [String],          // short, factual
  culturalNotes: String,   // optional controlled context

  nearby: [String]
});

export default mongoose.model("Place", placeSchema);
