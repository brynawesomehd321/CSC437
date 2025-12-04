import { html } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Player, Team } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View } from "@calpoly/mustang";

export class RosterViewElement extends View<Model, Msg> {
    @property({ attribute: "team-id" })
    teamId?: number;

    @state()
    get roster(): Array<Player> | undefined {
        return this.model.roster;
    }

    @state()
    get team(): Team | undefined {
        return this.model.team;
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
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    ${this.team?.teamName} Roster
                </h2>
            </div>
            <card-grid .cards=${this.roster} datatype="roster" team-id=${this.teamId}></card-grid>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
        `
    }
    static styles = [
        reset.styles,
        page.styles
    ]
}