// src/index.ts
import express from "express";
import { openDatabase } from "./services/sqlite3"
import userRouter from "./routes/userRouter";
import teamRouter from "./routes/teamRouter";
import playerRouter from "./routes/playerRouter";
import statRouter from "./routes/statRouter";
import gameRouter from "./routes/gameRouter";
import authRouter, { authenticateUser } from "./routes/authRouter";
import fs from "node:fs/promises";
import path from "path";
import { Request, Response } from "express";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const staticDir = process.env.STATIC || "public";

  app.use(express.static(staticDir));
  // Middleware:
  app.use(express.json());
  
  //Routes
  app.use("/api/users", authenticateUser, userRouter);
  app.use("/api/teams", authenticateUser, teamRouter);
  app.use("/api/players", authenticateUser, playerRouter);
  app.use("/api/stats", authenticateUser, statRouter);
  app.use("/api/games", authenticateUser, gameRouter);
  app.use("/auth", authRouter);

  // Wait for database to open before continuing
  await openDatabase();

  // SPA Routes: /app/...
  app.use("/app", (req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
      res.send(html)
    );
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.log("Failed to start server:", err);
})
