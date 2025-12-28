import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    vehicle: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    via:{
        type: String,
        dafault: []
    },
    loopType: {
        type: String,
        default: "one-way"
    },
    fare: String,
    notes: String
})

export default mongoose.model("Route", routeSchema)