import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import UserRouter from './Routes/userRoutes.js';
import ProductRouter from './Routes/productRoutes.js';
import OrderRouter from './Routes/orderRoutes.js';
import CartRouter from './Routes/cartRoutes.js';
import cors from 'cors';
import {config} from 'dotenv';
import path from 'path';
import authRoute from './Routes/authRoutes.js';
import { fileURLToPath } from 'url';

//Load environment path variables
config({ path: './data/config.env' });

const app=express()
app.use(express.json())
app.use(cookieParser());
console.log("Frontend_URL:", process.env.Frontend_URL);
app.use(cors({
    origin: process.env.Frontend_URL, // Adjust based on your frontend URL
    methods:["POST","GET","PUT","DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve Uploads Folder
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
// Now any file inside 'Uploads' can be accessed via:
// http://localhost:5000/Uploads/<filename>


mongoose.connect(process.env.MONGO_URL,{
    dbName:"old-newspaper-selling-web",
}).then(()=>console.log("MongoDB is connected"))

app.use('/api/users/',UserRouter);
app.use('/api/products/',ProductRouter);
app.use('/api/orders/',OrderRouter);
app.use('/api/cart/',CartRouter);
app.use('/api/auth', authRoute);

const port =process.env.PORT

app.listen(port,()=>console.log(`Server is running on ${port}`))
