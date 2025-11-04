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
var player_svc_exports = {};
__export(player_svc_exports, {
  default: () => player_svc_default
});
module.exports = __toCommonJS(player_svc_exports);
var import_sqlite3 = require("./sqlite3");
var import_team_svc = __toESM(require("./team-svc"));
const teamService = new import_team_svc.default();
class PlayerService {
  //index
  async index() {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM players`;
    const players = await db.all(sql);
    return players;
  }
  //index a list of players on a team
  async getPlayersByTeam(teamId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM players WHERE teamId = ?`;
    const players = await db.all(sql, [teamId]);
    return players;
  }
  //get
  async getPlayerById(playerId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM players WHERE playerId = ?`;
    const row = await db.get(sql, [playerId]);
    return row;
  }
  //create
  async createPlayer(player) {
    const db = await import_sqlite3.dbPromise;
    const { playerName, playerNumber, teamId } = player;
    const team = await teamService.getTeamById(teamId);
    if (!team) throw new Error("Team does not exist");
    const sql = `INSERT INTO players (playerName, playerNumber, teamId) VALUES (?, ?, ?)`;
    const result = await db.run(sql, [playerName, playerNumber, Number(teamId)]);
    if (result.lastID) {
      const createdPlayer = await this.getPlayerById(result.lastID);
      return createdPlayer;
    } else {
      throw new Error("Failed to create new player.");
    }
  }
  //put
  async updatePlayer(updatedPlayer, playerId) {
    const { playerName, playerNumber, teamId } = updatedPlayer;
    const db = await import_sqlite3.dbPromise;
    const sql = `UPDATE players SET playerName = ?, playerNumber = ?, teamId = ? WHERE playerId = ?`;
    const result = await db.run(sql, [playerName, playerNumber, teamId, playerId]);
    if (result.changes) {
      return updatedPlayer;
    } else {
      throw new Error("Player not found or update failed.");
    }
  }
  //delete
  async removePlayer(playerId) {
    const db = await import_sqlite3.dbPromise;
    const sql = "DELETE FROM players WHERE playerId = ?";
    const result = await db.run(sql, [playerId]);
    if (result.changes === 0) {
      throw new Error("Player not found or deletion failed");
    }
  }
}
var player_svc_default = PlayerService;
