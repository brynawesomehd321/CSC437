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
var gameRouter_exports = {};
__export(gameRouter_exports, {
  default: () => gameRouter_default
});
module.exports = __toCommonJS(gameRouter_exports);
var import_express = __toESM(require("express"));
var import_game_svc = __toESM(require("../services/game-svc"));
const gameRouter = import_express.default.Router();
const gameService = new import_game_svc.default();
gameRouter.get("/", (_, res) => {
  gameService.index().then((data) => res.json(data)).catch((err) => res.status(500).send(err));
});
gameRouter.get("/:gameId", (req, res) => {
  const { gameId } = req.params;
  gameService.getGameById(Number(gameId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
gameRouter.post("/", (req, res) => {
  const newGame = req.body;
  gameService.createGame(newGame).then((data) => res.status(201).json(data)).catch((err) => res.status(500).send(err));
});
gameRouter.put("/:gameId", (req, res) => {
  const updatedGame = req.body;
  const { gameId } = req.params;
  gameService.updateGame(updatedGame, Number(gameId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
gameRouter.delete("/:gameId", (req, res) => {
  const { gameId } = req.params;
  gameService.removeGame(Number(gameId)).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var gameRouter_default = gameRouter;
