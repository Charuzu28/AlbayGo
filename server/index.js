import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://albay-go.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED!"))
  .catch(err => console.error("Mongo error:", err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send("Backend running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
