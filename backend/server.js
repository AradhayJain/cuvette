import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/MongoDb.js';
import userRoutes from './routes/userRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import cookieParser from 'cookie-parser';
import path from "path"
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config({});
const app = express();
const port = process.env.PORT ||  3000;
app.use(cookieParser());

const corsOptions = {
    origin:"*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);









connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const __dirname=path.resolve()
console.log(__dirname)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'frontend', 'dist')))
    app.get("*",(_,res)=>res.sendFile(path.resolve(__dirname,"frontend","dist","index.html")))
}
else{
    app.get("/",(_,res)=>{
        res.send("API is running")
    })
}
app.use(notFound)
app.use(errorHandler)