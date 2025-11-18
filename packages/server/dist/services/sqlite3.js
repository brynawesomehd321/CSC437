"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sqlite3_exports = {};
__export(sqlite3_exports, {
  dbPromise: () => dbPromise,
  openDatabase: () => openDatabase
});
module.exports = __toCommonJS(sqlite3_exports);
var import_sqlite3 = __toESM(require("sqlite3"));
var import_sqlite = require("sqlite");
const dbPromise = (0, import_sqlite.open)({
  filename: "../database.db",
  // Specify the database file
  driver: import_sqlite3.default.Database
});
async function openDatabase() {
  const db = await dbPromise;
  await db.run("PRAGMA foreign_keys = ON;");
  const createCredentialsTableSql = `
        CREATE TABLE IF NOT EXISTS credentials (
            email TEXT PRIMARY KEY,
            hashedPassword TEXT NOT NULL
        );`;
  await db.run(createCredentialsTableSql, (err) => {
    if (err) {
      return console.error("Error creating credentials table:", err.message);
    }
    console.log("credentials table created successfully");
  });
  const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            FOREIGN KEY (email) REFERENCES credentials(email)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;
  await db.run(createUsersTableSql, (err) => {
    if (err) {
      return console.error("Error creating users table:", err.message);
    }
    console.log("users table created successfully");
  });
  const createTeamsTableSql = `
        CREATE TABLE IF NOT EXISTS teams (
            teamId INTEGER PRIMARY KEY AUTOINCREMENT,
            teamName TEXT UNIQUE NOT NULL,
            email INTEGER NOT NULL,
            FOREIGN KEY (email) REFERENCES users(email)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;
  await db.run(createTeamsTableSql, (err) => {
    if (err) {
      return console.error("Error creating teams table:", err.message);
    }
    console.log("teams table created successfully");
  });
  const createPlayersTableSql = `
        CREATE TABLE IF NOT EXISTS players (
            playerId INTEGER PRIMARY KEY AUTOINCREMENT,
            playerName TEXT UNIQUE NOT NULL,
            playerNumber INTEGER NOT NULL,
            teamId INTEGER NOT NULL,
            FOREIGN KEY (teamId) REFERENCES teams(teamId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;
  await db.run(createPlayersTableSql, (err) => {
    if (err) {
      return console.error("Error creating players table:", err.message);
    }
    console.log("players table created successfully");
  });
  const createGamesTableSql = `
        CREATE TABLE IF NOT EXISTS games (
            gameId INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            date TEXT NOT NULL,
            teamId INTEGER NOT NULL,
            FOREIGN KEY (teamId) REFERENCES teams(teamId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;
  await db.run(createGamesTableSql, (err) => {
    if (err) {
      return console.error("Error creating games table:", err.message);
    }
    console.log("games table created successfully");
  });
  const createStatsTableSql = `
        CREATE TABLE IF NOT EXISTS stats (
            statId INTEGER PRIMARY KEY AUTOINCREMENT,
            statType TEXT NOT NULL,
            playerId INTEGER NOT NULL,
            gameId INTEGER NOT NULL,
            FOREIGN KEY (playerId) REFERENCES players(playerId)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            FOREIGN KEY (gameId) REFERENCES games(gameId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;
  await db.run(createStatsTableSql, (err) => {
    if (err) {
      return console.error("Error creating stats table:", err.message);
    }
    console.log("stats table created successfully");
  });
  return db;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dbPromise,
  openDatabase
});
