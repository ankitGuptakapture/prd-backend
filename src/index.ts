import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.json());
app.use(cors());
const API_PREFIX = "/api";
app.get(`${API_PREFIX}/health-check`, (req, res) => {
  try {
    return res.status(200).json({
      message: "Server is running",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(8080, () => console.log(`up and running 8080`));
