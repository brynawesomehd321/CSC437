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
var stat_svc_exports = {};
__export(stat_svc_exports, {
  default: () => stat_svc_default
});
module.exports = __toCommonJS(stat_svc_exports);
var import_sqlite3 = require("./sqlite3");
var import_player_svc = __toESM(require("./player-svc"));
var import_game_svc = __toESM(require("./game-svc"));
const playerService = new import_player_svc.default();
const gameService = new import_game_svc.default();
class StatService {
  //index
  async index() {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM stats`;
    const stats = await db.all(sql);
    return stats;
  }
  //get stat by player Id
  async getStatByPlayerId(playerId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM stats WHERE playerId = ?`;
    const row = await db.all(sql, [playerId]);
    return row;
  }
  //get all individual stats for a team
  async getStatByTeamId(teamId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `
            SELECT s.*
            FROM stats s
            JOIN players p ON s.playerId = p.playerId
            WHERE p.teamId = ?
        ;`;
    const row = await db.all(sql, [teamId]);
    return row;
  }
  //get all stats for a game
  async getStatsByGameId(gameId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `
            SELECT *
            FROM stats
            WHERE gameId = ?
        ;`;
    const row = await db.all(sql, [gameId]);
    return row;
  }
  //get a total count of all stats for a TEAM
  /*Returns an object like this:
      {
      "totalScores": 15,
      "totalBlocks": 7,
      "totalDrops": 3,
      "totalIncompletions": 2
      }
  */
  async getAllTeamStats(teamId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `
            SELECT 
                SUM(CASE WHEN s.statType = 'score' THEN 1 ELSE 0 END) AS totalScores,
                SUM(CASE WHEN s.statType = 'block' THEN 1 ELSE 0 END) AS totalBlocks,
                SUM(CASE WHEN s.statType = 'drop' THEN 1 ELSE 0 END) AS totalDrops,
                SUM(CASE WHEN s.statType = 'incompletion' THEN 1 ELSE 0 END) AS totalIncompletions
            FROM stats s
            JOIN players p ON s.playerId = p.playerId
            WHERE p.teamId = ?;
        `;
    const result = await db.get(sql, [teamId]);
    return result;
  }
  //get a total count of all stats for a PLAYER
  /*Returns an object like this:
      {
      "totalScores": 15,
      "totalBlocks": 7,
      "totalDrops": 3,
      "totalIncompletions": 2
      }
  */
  async getAllPlayerStats(playerId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `
            SELECT 
                SUM(CASE WHEN statType = 'score' THEN 1 ELSE 0 END) AS totalScores,
                SUM(CASE WHEN statType = 'block' THEN 1 ELSE 0 END) AS totalBlocks,
                SUM(CASE WHEN statType = 'drop' THEN 1 ELSE 0 END) AS totalDrops,
                SUM(CASE WHEN statType = 'incompletion' THEN 1 ELSE 0 END) AS totalIncompletions
            FROM stats
            WHERE playerId = ?;
        `;
    const result = await db.get(sql, [playerId]);
    return result;
  }
  //get
  async getStatById(statId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM stats WHERE statId = ?`;
    const row = await db.get(sql, [statId]);
    return row;
  }
  //create
  async createStat(stat) {
    const db = await import_sqlite3.dbPromise;
    const { statType, playerId, gameId } = stat;
    const player = await playerService.getPlayerById(playerId);
    if (!player) throw new Error("Player does not exist");
    const game = await gameService.getGameById(gameId);
    if (!game) throw new Error("Game does not exist");
    const sql = `INSERT INTO stats (statType, playerId, gameId) VALUES (?, ?, ?)`;
    const result = await db.run(sql, [statType, Number(playerId), Number(gameId)]);
    if (result.lastID) {
      const createdStat = await this.getStatById(result.lastID);
      return createdStat;
    } else {
      throw new Error("Failed to create new stat.");
    }
  }
  //put
  async updateStat(updatedStat, statId) {
    const { statType, playerId, gameId } = updatedStat;
    const db = await import_sqlite3.dbPromise;
    const sql = `UPDATE stats SET statType = ?, playerId = ?, gameId = ? WHERE statId = ?`;
    const result = await db.run(sql, [statType, playerId, gameId, statId]);
    if (result.changes) {
      return updatedStat;
    } else {
      throw new Error("Stat not found or update failed.");
    }
  }
  //delete
  async removeStat(statId) {
    const db = await import_sqlite3.dbPromise;
    const sql = "DELETE FROM stats WHERE statId = ?";
    const result = await db.run(sql, [statId]);
    if (result.changes === 0) {
      throw new Error("Stat not found or deletion failed");
    }
  }
}
var stat_svc_default = StatService;
