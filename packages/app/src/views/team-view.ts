import { html, css } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Team } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View } from "@calpoly/mustang";

export class TeamViewElement extends View<Model, Msg> {
    @property({attribute: "team-id"})
    teamId?: number;

    @state()
    get team(): Team | undefined {
        return this.model.team;
    }

    @state()
    get rosterCount(): number | undefined {
        return this.model.roster?.length;
    }

    constructor() {
        super("stats:model");
    }

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            name === "team-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            this.dispatchMessage([
            "team/request",
            { teamId: Number(newValue) }
            ]);
            this.dispatchMessage([
            "team/roster/request",
            { teamId: Number(newValue) }
            ]);
        }
    }

    render() {
        return html`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    ${this.team?.teamName}
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <section class="teamInfo">
                <p>Team Name: ${this.team?.teamName}</p>
                <p>Division: College</p>
                <p>Number of Players: ${this.rosterCount}</p>
            </section>
            <div class="subheader">
                    <h2>Team Access</h2>
                </div>
            <div class="grid">
                <a href="/app/team/${this.teamId}/roster">
                    <h2>Team Roster</h2>
                </a>
                <a href="/app/team/${this.teamId}/stats">
                    <h2>Team Stats</h2>
                </a>
                <a href="/app/team/${this.teamId}/schedule">
                    <h2>Team Schedule</h2>
                </a>
            </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }`
    ]
}