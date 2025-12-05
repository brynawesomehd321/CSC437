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
var user_svc_exports = {};
__export(user_svc_exports, {
  default: () => user_svc_default
});
module.exports = __toCommonJS(user_svc_exports);
var import_sqlite3 = require("./sqlite3");
class UserService {
  //index
  async index() {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM users`;
    const users = await db.all(sql);
    return users;
  }
  //get
  async getUserById(userid) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM users WHERE userid = ?`;
    const row = await db.get(sql, [userid]);
    return row;
  }
  //get user by email
  async getUserByEmail(email) {
    const db = await import_sqlite3.dbPromise;
    const sql = `SELECT * FROM users WHERE email = ?`;
    const row = await db.get(sql, [email]);
    return row;
  }
  //create
  async createUser(user) {
    const db = await import_sqlite3.dbPromise;
    const { fullName, email } = user;
    const sql = `INSERT INTO users (fullName, email) VALUES (?, ?)`;
    const result = await db.run(sql, [fullName, email]);
    if (result.lastID) {
      const createdUser = await this.getUserById(result.lastID);
      return createdUser;
    } else {
      throw new Error("Failed to create new user.");
    }
  }
  //put
  async updateUser(updatedUser, userid) {
    const { fullName, email } = updatedUser;
    const db = await import_sqlite3.dbPromise;
    const sql = `UPDATE users SET fullName = ?, email = ? WHERE userid = ?`;
    const result = await db.run(sql, [fullName, email, userid]);
    if (result.changes) {
      return updatedUser;
    } else {
      throw new Error("User not found or update failed.");
    }
  }
  //delete
  async removeUser(userid) {
    const db = await import_sqlite3.dbPromise;
    const sql = "DELETE FROM users WHERE userid = ?";
    const result = await db.run(sql, [userid]);
    if (result.changes === 0) {
      throw new Error("User not found or deletion failed");
    }
  }
}
var user_svc_default = UserService;
