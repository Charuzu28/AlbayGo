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
    fromKey: {
        type: String,
        lowercase: true,
        trim: true,
        set: v => v.toLowerCase()
    }
    ,
    to: {
        type: String,
        required: true
    },
    toKey: {
        type: String,
        lowercase: true,
        trim: true,
        set: v => v.toLowerCase()
    }
    ,
    via:{
        type: [String],
        default: []
    },
    loopType: {
        type: String,
        default: "one-way"
    },
    fare: String,
    notes: String
})

export default mongoose.model("Route", routeSchema)