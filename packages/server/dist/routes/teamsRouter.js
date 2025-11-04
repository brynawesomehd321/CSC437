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
var teamsRouter_exports = {};
__export(teamsRouter_exports, {
  default: () => teamsRouter_default
});
module.exports = __toCommonJS(teamsRouter_exports);
var import_express = __toESM(require("express"));
var import_team_svc = __toESM(require("../services/team-svc"));
const teamRouter = import_express.default.Router();
const teamService = new import_team_svc.default();
teamRouter.get("/", (_, res) => {
  teamService.index().then((data) => res.json(data)).catch((err) => res.status(500).send(err));
});
teamRouter.get("/:teamId", (req, res) => {
  const { teamId } = req.params;
  teamService.getTeamById(Number(teamId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
teamRouter.post("/", (req, res) => {
  const newTeam = req.body;
  teamService.createTeam(newTeam).then((data) => res.status(201).json(data)).catch((err) => res.status(500).send(err));
});
teamRouter.put("/:teamId", (req, res) => {
  const updatedTeam = req.body;
  const { teamId } = req.params;
  teamService.updateTeam(updatedTeam, Number(teamId)).then((data) => res.json(data)).catch((err) => res.status(404).send(err));
});
teamRouter.delete("/:teamId", (req, res) => {
  const { teamId } = req.params;
  teamService.removeTeam(Number(teamId)).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var teamsRouter_default = teamRouter;
