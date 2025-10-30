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
class UserService {
  constructor(db) {
    this.db = db;
  }
  //get
  async getUserById(id) {
    const sql = `SELECT * FROM users WHERE userid = ?`;
    const row = await this.db.get(sql, [id]);
    return row;
  }
  //create
  /*async createUser(user: User): Promise<User> {
          const { userid, username, email } = user;
          const sql = `INSERT INTO users (userid, username, email) VALUES (${userid}, ${username}, ${email})'`;
  
          const result = await this.db.run(sql);
          const createdUser = this.getUserById(userid);
          if (createdUser) {
              return createdUser;
          } else {
              throw new Error('Failed to create user');
          }
      }*/
}
var user_svc_default = UserService;
