import {
  Auth,
  define,
  History,
  Switch,
  Store
} from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html } from "lit";
import { CardGridElement } from "./components/cardGrid";
import { HeaderElement } from "./components/header";
import { HomeViewElement } from "./views/home-view";
import { TeamViewElement } from "./views/team-view";
import { TeamInfoElement } from "./components/teamInfo";
import { TotalStatBlockElement } from "./components/totalStatBlock";
import { RosterViewElement } from "./views/roster-view";
import { StatsViewElement } from "./views/stats-view";
import { StatTableElement } from "./components/statTable";
import { PlayerStatTableElement } from "./components/playerStatTable";
import { ScheduleViewElement } from "./views/schedule-view";
import { ScheduleTableElement } from "./components/scheduleTable";
import { GameViewElement } from "./views/game-view";
import { UserViewElement } from "./views/user-view";
import { PlayerViewElement } from "./views/player-view";
import { BackButtonElement } from "./components/backButton";

const routes = [
    {
        path: "/app/team/:teamId",
        view: (params: Switch.Params) => html`
            <team-view team-id=${Number(params.teamId)}></team-view>
        `
    },
    {
        path: "/app/team/:teamId/roster",
        view: (params: Switch.Params) => html`
            <roster-view team-id=${Number(params.teamId)}></roster-view>
        `
    },
    {
        path: "/app/team/:teamId/stats",
        view: (params: Switch.Params) => html`
            <stats-view team-id=${Number(params.teamId)}></stats-view>
        `
    },
    {
        path: "/app/team/:teamId/schedule",
        view: (params: Switch.Params) => html`
            <schedule-view team-id=${Number(params.teamId)}></schedule-view>
        `
    },
    {
        path: "/app/team/:teamId/schedule/:gameId",
        view: (params: Switch.Params) => html`
            <game-view team-id=${Number(params.teamId)} game-id=${Number(params.gameId)}></game-view>
        `
    },
    {
        path: "/app/team/:teamId/player/:playerId",
        view: (params: Switch.Params) => html`
            <player-view player-id=${Number(params.playerId)} team-id=${Number(params.teamId)}></player-view>
        `
    },
    {
        path: "/app/:userid",
        view: (params: Switch.Params) => html`
            <user-view user-id=${params.userid}></user-view>
        `
    },
    {
        path: "/app",
        view: () => html`
            <home-view></home-view>
        `
    },
    {
        path: "/",
        redirect: "/app"
    }
];

define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-store": class AppStore extends Store.Provider<Model, Msg>
    {
        constructor() {
        super(update, init, "stats:auth");
        }
    },
    "page-header": HeaderElement,
    "home-view": HomeViewElement,
    "team-view": TeamViewElement,
    "roster-view": RosterViewElement,
    "stats-view": StatsViewElement,
    "game-view": GameViewElement,
    "user-view": UserViewElement,
    "player-view": PlayerViewElement,
    "schedule-view": ScheduleViewElement,
    "card-grid": CardGridElement,
    "team-info": TeamInfoElement,
    "player-stat-table": PlayerStatTableElement,
    "total-stat-block": TotalStatBlockElement,
    "stat-table": StatTableElement,
    "schedule-table": ScheduleTableElement,
    "back-button": BackButtonElement,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "stats:history", "stats:auth");
        }
    },
});