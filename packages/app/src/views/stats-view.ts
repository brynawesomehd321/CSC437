import { html } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Stat, Player } from "server/models";
import { View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class StatsViewElement extends View<Model, Msg> {
    @property({ attribute: "team-id" })
    teamId?: number;

    @state()
    get teamStats(): Array<Stat> {
        return this.model.teamStats ?? [];
    }

    @state()
    get roster(): Array<Player> {
        return this.model.roster ?? [];
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
            "team/stats/request",
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
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Team Stats
                </h2>
            </div>
            <total-stat-block src="/api/teams/${this.teamId}/totalStats"/></total-stat-block>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Player Stats
                </h2>
            </div>
            <stat-table .stats=${this.teamStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
            <div class="centered-content">
                <back-button team-id=${this.teamId}></back-button>
            </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles
    ]
}