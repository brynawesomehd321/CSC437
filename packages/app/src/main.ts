import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
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
import { ScheduleViewElement } from "./views/schedule-view";
import { ScheduleTableElement } from "./components/scheduleTable";
import { GameViewElement } from "./views/game-view";

const routes = [
    {
        path: "/app/team/:teamId",
        view: (params: Switch.Params) => html`
            <team-view .teamId=${Number(params.teamId)}></team-view>
        `
    },
    {
        path: "/app/team/:teamId/roster",
        view: (params: Switch.Params) => html`
            <roster-view .teamId=${Number(params.teamId)}></roster-view>
        `
    },
    {
        path: "/app/team/:teamId/stats",
        view: (params: Switch.Params) => html`
            <stats-view .teamId=${Number(params.teamId)}></stats-view>
        `
    },
    {
        path: "/app/team/:teamId/schedule",
        view: (params: Switch.Params) => html`
            <schedule-view .teamId=${Number(params.teamId)}></schedule-view>
        `
    },
    {
        path: "/app/team/:teamId/schedule/:gameId",
        view: (params: Switch.Params) => html`
            <game-view .teamId=${Number(params.teamId)} .gameId=${Number(params.gameId)}></game-view>
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
    "page-header": HeaderElement,
    "home-view": HomeViewElement,
    "team-view": TeamViewElement,
    "roster-view": RosterViewElement,
    "stats-view": StatsViewElement,
    "game-view": GameViewElement,
    "schedule-view": ScheduleViewElement,
    "card-grid": CardGridElement,
    "team-info": TeamInfoElement,
    "total-stat-block": TotalStatBlockElement,
    "stat-table": StatTableElement,
    "schedule-table": ScheduleTableElement,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "stats:history", "stats:auth");
        }
    },
});