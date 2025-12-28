import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true
  },
  name: String,
  description: String,
  fare: String,
  location: String,
  notes: String
});

export default mongoose.model("Place", placeSchema);
