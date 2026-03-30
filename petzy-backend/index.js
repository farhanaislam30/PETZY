import express from "express";
import userRouter from "./routes/userRoutes.js";
import refreshTokentroute from "./routes/refreshToken.route.js";
import donatecreate from "./routes/donatecreate.route.js";
import donateget from "./routes/donateget.route.js";
import petRoutes from "./routes/petRoutes.js";
import customerRoute from "./routes/customerRoute.js";
// import chatRoutes from "./routes/chatRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
// import geminiRoutes from "./routes/geminiRoutes.js";
// import { askGemini } from "./controllers/chatController.js";

import airoute from './routes/ai.js';


import { log } from "./middlewares/logger.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

const app = express();

mongoose
.connect(process.env.DB_URL)
.then(() => console.log("Database connected "))
.catch((err) => console.log(`Error connecting database ${err}`));

const PORT = process.env.PORT || 3000;

console.log(process.env.DB_URL);

app.use(express.json());
app.use(log);
app.use(cors());

// app.use(cors({
  //   origin: "http://localhost:3000", // Allow frontend to access API
  //   methods: "GET,POST,PUT,DELETE",
  //   allowedHeaders: "Content-Type",
  // }));
  
  app.get("/", (req, res) => {
    res.send("Petzy backend server ready!");
  });
  
  app.get("/pets/", (req, res) => {
    res.send("There are 3 pets");
  });
  
  app.use("/users", userRouter);

  
  app.use("/refresh_tokens", refreshTokentroute);
  
  app.use("/donates", donatecreate);
  
  app.use("/donateget", donateget);
  
  app.use("/show-interest", petRoutes);
  
app.use("/customer", customerRoute);
app.use('/', airoute);

app.use("/doctors", doctorRoutes);

// app.use("/chat", chatRoutes);

// app.use("/gemini", geminiRoutes);
// app.post("/chat", askGemini);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
