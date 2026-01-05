import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan'
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js'
import Route from './models/Route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI).then( async () => {
    console.log("MONGODB CONNECTED!");
    const count = await Route.countDocuments();
    console.log(`Route Loaded: `, count);
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    })
}).catch((err) => console.log("Error connecting to MongoDB: ", err));

app.get('/health', (req,res) => {
    res.status(200).json({status: 'OK'});
})

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send("Backend running!");
})