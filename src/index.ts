import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import promptRoutes from "./routes/promptRoutes"
import authRotes from "./routes/auth"
import chatRoutes from "./routes/chatRoutes"
import projectRoutes from "./routes/projectRoutes"
import path from "path";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));
console.log(path.join(__dirname, 'uploads'))
const PORT = process.env.PORT || 8080;
const API_PREFIX = "/api"
app.use(`${API_PREFIX}/project`,projectRoutes);
app.use(`${API_PREFIX}/ai`, promptRoutes);
app.use(`${API_PREFIX}/chat`,chatRoutes);
app.use(`${API_PREFIX}/auth`,authRotes);
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
