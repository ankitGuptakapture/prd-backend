import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth";
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import scoketInit from "./socket";
import db from "./drizzle";
import users from "./models/User";
dotenv.config()
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    }
})


io.on("connection",scoketInit)
app.use(express.json())
app.use(cors())
const API_PREFIX = '/api';
app.use(`${API_PREFIX}/auth`, authRoutes);
httpServer.listen(8080, () => console.log(`up and running 8080`))