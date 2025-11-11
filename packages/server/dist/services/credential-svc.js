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
var credential_svc_exports = {};
__export(credential_svc_exports, {
  default: () => credential_svc_default
});
module.exports = __toCommonJS(credential_svc_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_sqlite3 = require("./sqlite3");
class CredentialService {
  //create
  async createCredential(email, password) {
    const db = await import_sqlite3.dbPromise;
    const salt = await import_bcryptjs.default.genSalt(10);
    const hashedPassword = await import_bcryptjs.default.hash(password, salt);
    const sql = `INSERT INTO credentials (email, hashedPassword) VALUES (?, ?)`;
    await db.run(sql, [email, hashedPassword]);
    const createdCredential = await db.get(
      "SELECT * FROM credentials WHERE email = ?",
      [email]
    );
    if (!createdCredential) {
      throw new Error("Failed to retrieve the created credential.");
    }
    return createdCredential;
  }
  //verify
  async verify(email, password) {
    const db = await import_sqlite3.dbPromise;
    return await db.get("SELECT * FROM credentials WHERE email = ?", [email]).then((credsOnFile) => import_bcryptjs.default.compare(password, credsOnFile.hashedPassword).then((result) => {
      if (!result) throw new Error("Invalid username or password");
      return credsOnFile.email;
    }));
  }
}
var credential_svc_default = CredentialService;
