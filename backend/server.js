// import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

// dotenv.config();

// console.log(process.env.CLOUD_NAME);
// console.log(process.env.CLOUD_API_KEY);
// console.log(process.env.CLOUD_API_SECRET);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.use("/api/admin", adminRoutes);
// app.use("/api/students", studentRoutes);

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   // console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
//   // console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
//   // console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "loaded" : "missing");
//   console.log(`Server running on port ${PORT}`);
// });