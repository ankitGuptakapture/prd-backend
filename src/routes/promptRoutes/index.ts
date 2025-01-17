import express from 'express'
import { handleUserPropmts } from './handlers';

const router = express.Router();


router.post("/prompt-chat",handleUserPropmts)


export default router