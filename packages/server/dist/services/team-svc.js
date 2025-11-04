"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var team_svc_exports = {};
__export(team_svc_exports, {
  default: () => team_svc_default
});
module.exports = __toCommonJS(team_svc_exports);
var import_sqlite3 = require("./sqlite3");
class TeamService {
  //index
  async index() {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM teams`;
    const teams = await db.all(sql);
    return teams;
  }
  //get
  async getTeamById(teamId) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM teams WHERE teamId = ?`;
    const row = await db.get(sql, [teamId]);
    return row;
  }
  //create
  async createTeam(team) {
    const db = await import_sqlite3.dbPromise;
    const { teamName } = team;
    const sql = `INSERT INTO teams (teamName) VALUES (?)`;
    const result = await db.run(sql, [teamName]);
    if (result.lastID) {
      const createdTeam = await this.getTeamById(result.lastID);
      return createdTeam;
    } else {
      throw new Error("Failed to create new team.");
    }
  }
  //put
  async updateTeam(updatedTeam, teamId) {
    const { teamName } = updatedTeam;
    const db = await import_sqlite3.dbPromise;
    const sql = `UPDATE teams SET teamName = ? WHERE teamId = ?`;
    const result = await db.run(sql, [teamName, teamId]);
    if (result.changes) {
      return updatedTeam;
    } else {
      throw new Error("Team not found or update failed.");
    }
  }
  //delete
  async removeTeam(teamId) {
    const db = await import_sqlite3.dbPromise;
    const sql = "DELETE FROM teams WHERE teamId = ?";
    const result = await db.run(sql, [teamId]);
    if (result.changes === 0) {
      throw new Error("Team not found or deletion failed");
    }
  }
}
var team_svc_default = TeamService;
