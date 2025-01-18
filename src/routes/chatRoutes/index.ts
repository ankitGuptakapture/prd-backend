import { checkToken } from "@/utils"
import express from "express"
import { createThread, getThreadMessages, getThreads } from "./handler"



const router = express.Router()

router.get("/get-threads",checkToken,getThreads)
router.post("/create-thread",checkToken,createThread)
router.get("/get-thread-messages/:id",checkToken,getThreadMessages)


export default router