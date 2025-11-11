"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_sqlite3 = require("./services/sqlite3");
var import_userRouter = __toESM(require("./routes/userRouter"));
var import_teamRouter = __toESM(require("./routes/teamRouter"));
var import_playerRouter = __toESM(require("./routes/playerRouter"));
var import_statRouter = __toESM(require("./routes/statRouter"));
var import_gameRouter = __toESM(require("./routes/gameRouter"));
var import_authRouter = __toESM(require("./routes/authRouter"));
async function startServer() {
  const app = (0, import_express.default)();
  const port = process.env.PORT || 3e3;
  const staticDir = process.env.STATIC || "public";
  app.use(import_express.default.static(staticDir));
  app.use(import_express.default.json());
  app.use("/api/users", import_authRouter.authenticateUser, import_userRouter.default);
  app.use("/api/:userId/teams", import_authRouter.authenticateUser, import_teamRouter.default);
  app.use("/api/players", import_authRouter.authenticateUser, import_playerRouter.default);
  app.use("/api/stats", import_authRouter.authenticateUser, import_statRouter.default);
  app.use("/api/games", import_authRouter.authenticateUser, import_gameRouter.default);
  app.use("/auth", import_authRouter.default);
  await (0, import_sqlite3.openDatabase)();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
startServer().catch((err) => {
  console.log("Failed to start server:", err);
});
