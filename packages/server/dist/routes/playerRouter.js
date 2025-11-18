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
var playerRouter_exports = {};
__export(playerRouter_exports, {
  default: () => playerRouter_default
});
module.exports = __toCommonJS(playerRouter_exports);
var import_express = __toESM(require("express"));
var import_player_svc = __toESM(require("../services/player-svc"));
var import_stat_svc = __toESM(require("../services/stat-svc"));
const playerRouter = import_express.default.Router();
const playerService = new import_player_svc.default();
const statService = new import_stat_svc.default();
playerRouter.get("/", (_, res) => {
  playerService.index().then((data) => res.json(data)).catch((err) => res.status(500).send(err));
});
playerRouter.get("/:playerId", (req, res) => {
  const { playerId } = req.params;
  playerService.getPlayerById(Number(playerId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
playerRouter.get("/:playerId/stats", (req, res) => {
  const { playerId } = req.params;
  statService.getStatByPlayerId(Number(playerId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
playerRouter.get("/:playerId/totalStats", (req, res) => {
  const { playerId } = req.params;
  statService.getAllPlayerStats(Number(playerId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
playerRouter.post("/", (req, res) => {
  const newPlayer = req.body;
  playerService.createPlayer(newPlayer).then((data) => res.status(201).json(data)).catch((err) => res.status(500).send(err));
});
playerRouter.put("/:playerId", (req, res) => {
  const updatedPlayer = req.body;
  const { playerId } = req.params;
  playerService.updatePlayer(updatedPlayer, Number(playerId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
playerRouter.delete("/:playerId", (req, res) => {
  const { playerId } = req.params;
  playerService.removePlayer(Number(playerId)).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var playerRouter_default = playerRouter;
