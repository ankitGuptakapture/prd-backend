import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user"
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import scoketInit from "./socket";
import db from "./drizzle";
import Chats from "./models/Chats";
import SocketRoom from "./models/SocketRoom";
dotenv.config()
const app = express()
app.use(express.json())
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
app.use(`${API_PREFIX}/user`, userRoutes);
httpServer.listen(8080, () => console.log(`up and running 8080`))