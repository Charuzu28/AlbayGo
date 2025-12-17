import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan'
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MONGODB CONNECTED!");
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    })
}).catch((err) => console.log("Error connecting to MongoDB: ", err));

app.get('/health', (req,res) => {
    res.status(200).json({status: 'OK'});
})

app.get('/', (req, res) => {
    res.send("Backend running!");
})