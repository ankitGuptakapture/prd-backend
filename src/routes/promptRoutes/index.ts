import express from "express";
import { handleUserPropmts, handleFileUpload, getSummary } from "./handlers";
import { uploadBuffer } from "@/middleware";
import { checkToken } from "@/utils";

const router = express.Router();

router.post("/prompt-chat", checkToken, handleUserPropmts);
router.post(
  "/file-text-extractor",
  checkToken,
  uploadBuffer.single("file"),
  handleFileUpload
);

router.post(
  "/get-summary",
  checkToken,
  uploadBuffer.single("file"),
  getSummary
);

export default router;
