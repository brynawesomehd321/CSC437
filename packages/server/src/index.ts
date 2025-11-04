// src/index.ts
import express from "express";
import { openDatabase } from "./services/sqlite3"
import userRouter from "./routes/userRouter";
import teamRouter from "./routes/teamRouter";
import playerRouter from "./routes/playerRouter";
import statRouter from "./routes/statRouter";
import gameRouter from "./routes/gameRouter";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const staticDir = process.env.STATIC || "public";

  app.use(express.static(staticDir));
  // Middleware:
  app.use(express.json());
  
  //Routes
  app.use("/api/users", userRouter);
  app.use("/api/teams", teamRouter);
  app.use("/api/players", playerRouter);
  app.use("/api/stats", statRouter);
  app.use("/api/games", gameRouter);

  // Wait for database to open before continuing
  await openDatabase();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.log("Failed to start server:", err);
})
