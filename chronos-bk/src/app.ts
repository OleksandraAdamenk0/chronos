import express, { Application } from 'express';
import path from 'path';
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from "dotenv";
import {connectDB} from "./db";

dotenv.config();
connectDB();

const client = process.env.CLIENT;
console.log("client", client);

import indexRouter from './routes';

const app: Application = express();

app.use(cors({
    origin: client,
    credentials: true,
}))
app.use((req, res, next) => {
  console.log("🛰️  Origin:", req.headers.origin);
  console.log("➡️  Request from:", req.method, req.url);
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

export default app;

