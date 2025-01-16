import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user"
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import createSocketInit from "./socket";
dotenv.config()
const app = express()
app.use(express.json())
const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    }
})
export type SocketServer = typeof io
const socketInit = createSocketInit(io);

io.on("connection", socketInit);
app.use(express.json())
app.use(cors())

const API_PREFIX = '/api';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/user`, userRoutes);
httpServer.listen(8080, () => console.log(`up and running 8080`))