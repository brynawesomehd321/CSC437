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
var statRouter_exports = {};
__export(statRouter_exports, {
  default: () => statRouter_default
});
module.exports = __toCommonJS(statRouter_exports);
var import_express = __toESM(require("express"));
var import_stat_svc = __toESM(require("../services/stat-svc"));
const statRouter = import_express.default.Router();
const statService = new import_stat_svc.default();
statRouter.get("/", (_, res) => {
  statService.index().then((data) => res.json(data)).catch((err) => res.status(500).send(err));
});
statRouter.get("/:statId", (req, res) => {
  const { statId } = req.params;
  statService.getStatById(Number(statId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
statRouter.post("/", (req, res) => {
  const newStat = req.body;
  statService.createStat(newStat).then((data) => res.status(201).json(data)).catch((err) => res.status(500).send(err));
});
statRouter.put("/:statId", (req, res) => {
  const updatedStat = req.body;
  const { statId } = req.params;
  statService.updateStat(updatedStat, Number(statId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
statRouter.delete("/:statId", (req, res) => {
  const { statId } = req.params;
  statService.removeStat(Number(statId)).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var statRouter_default = statRouter;
