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
var authRouter_exports = {};
__export(authRouter_exports, {
  authenticateUser: () => authenticateUser,
  default: () => authRouter_default
});
module.exports = __toCommonJS(authRouter_exports);
var import_express = __toESM(require("express"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
var import_credential_svc = __toESM(require("../services/credential-svc"));
const authRouter = import_express.default.Router();
const credentialService = new import_credential_svc.default();
import_dotenv.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";
authRouter.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentialService.createCredential(email, password).then((creds) => generateAccessToken(creds.email)).then((token) => {
      res.status(201).send({ token });
    }).catch((err) => {
      res.status(409).send({ error: err.message });
    });
  }
});
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentialService.verify(email, password).then((goodUser) => generateAccessToken(goodUser)).then((token) => res.status(200).send({ token })).catch((error) => res.status(401).send("Unauthorized"));
  }
});
function generateAccessToken(email) {
  return new Promise((resolve, reject) => {
    import_jsonwebtoken.default.sign(
      { username: email },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).end();
  } else {
    import_jsonwebtoken.default.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(401).end();
    });
  }
}
var authRouter_default = authRouter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUser
});
