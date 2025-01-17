import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import promptRoutes from "./routes/promptRoutes";

const app = express();
app.use(express.json());
app.use(cors());

const API_PREFIX = "/api";
const PORT = process.env.PORT || 8080;

app.use(API_PREFIX, promptRoutes);

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
