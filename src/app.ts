import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import authRoutes from "./modules/auth/auth.route";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({ message: `🎓 School Management APIs Server Running on ${PORT}` });
});
export default app;
