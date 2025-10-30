// src/index.ts
import express, { Request, Response } from "express";
import { openDatabase } from "./services/sqlite3"
import UserService from "./services/user-svc";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const staticDir = process.env.STATIC || "public";

  app.use(express.static(staticDir));

  // Wait for database to open before continuing
  const db = await openDatabase();
  const userService = new UserService(db);

  app.get("/users/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;

    userService.getUserById(userid).then((data) => {
      if (data) res
        .set("Content-Type", "application/json")
        .send(JSON.stringify(data));
      else {
        res.status(404).send();
        console.log("userid not found:", userid);
      } 
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.log("Failed to start server:", err);
})
