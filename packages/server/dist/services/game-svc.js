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
var game_svc_exports = {};
__export(game_svc_exports, {
  default: () => game_svc_default
});
module.exports = __toCommonJS(game_svc_exports);
var import_sqlite3 = require("./sqlite3");
var import_team_svc = __toESM(require("./team-svc"));
const teamService = new import_team_svc.default();
class GameService {
  //index
  async index() {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM games`;
    const games = await db.all(sql);
    return games;
  }
  //get
  async getGameById(gameId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM games WHERE gameId = ?`;
    const row = await db.get(sql, [gameId]);
    return row;
  }
  //create
  async createGame(game) {
    const db = await import_sqlite3.dbPromise;
    const { location, date, teamId } = game;
    const team = await teamService.getTeamById(teamId);
    if (!team) throw new Error("Team does not exist");
    const sql = `INSERT INTO games (location, date, teamId) VALUES (?, ?, ?)`;
    const result = await db.run(sql, [location, date, Number(teamId)]);
    if (result.lastID) {
      const createdGame = await this.getGameById(result.lastID);
      return createdGame;
    } else {
      throw new Error("Failed to create new game.");
    }
  }
  //put
  async updateGame(updatedGame, gameId) {
    const { location, date, teamId } = updatedGame;
    const db = await import_sqlite3.dbPromise;
    const sql = `UPDATE games SET location = ?, date = ?, teamId = ? WHERE gameId = ?`;
    const result = await db.run(sql, [location, date, teamId, gameId]);
    if (result.changes) {
      return updatedGame;
    } else {
      throw new Error("Game not found or update failed.");
    }
  }
  //delete
  async removeGame(gameId) {
    const db = await import_sqlite3.dbPromise;
    const sql = "DELETE FROM games WHERE gameId = ?";
    const result = await db.run(sql, [gameId]);
    if (result.changes === 0) {
      throw new Error("Game not found or deletion failed");
    }
  }
}
var game_svc_default = GameService;
