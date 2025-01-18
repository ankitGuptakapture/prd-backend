import express from "express";
import { getChatsByProjectId, getProjects } from "./handler";
import { checkToken } from "@/utils";


const router = express.Router();


router.get("/get-chats-by-project-id/:id",checkToken,getChatsByProjectId)
router.get("/get-projects",checkToken,getProjects)

export default router;


