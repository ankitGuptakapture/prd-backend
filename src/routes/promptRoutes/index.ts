import express from "express";
import { handleUserPropmts, handleFileUpload } from "./handlers";
import { uploadBuffer } from "@/middleware";

const router = express.Router();

router.post("/prompt-chat", handleUserPropmts);
router.post(
  "/file-text-extractor",
  uploadBuffer.single("file"),
  handleFileUpload
);

export default router;
