import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import mongoose from "mongoose";
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8000;

// Set Mongoose strictPopulate to false
mongoose.set("strictPopulate", false);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Updated CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use('/api/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "frontend", "public")));
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
