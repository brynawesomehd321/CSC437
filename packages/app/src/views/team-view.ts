import { html, css } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Team } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View, History } from "@calpoly/mustang";

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

    @state()
    _error?: Error;

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

    handleDeleteTeam = () => {
        if (!this.teamId) return;
        this.dispatchMessage([
            "team/delete"
            , { teamId: this.teamId }
            , {
                onSuccess: () =>
                    History.dispatch(this, "history/navigate", {
                        href: `/`
                    }),
                onFailure: (error: Error) =>
                    this._error = error
            }
        ]);
    }

    renderError() {
        return this._error ?
            html`
            <p class="error">
                ${this._error}
            </p>` :
            ""
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
            </div>
            <section class="teamInfo">
                <div class="info-pair">
                    <h3>Team Name:</h3>
                    <p>${this.team?.teamName}</p>
                </div>
                <div class="info-pair">
                    <h3>Number of Players:</h3>
                    <p>${this.rosterCount}</p>
                </div>
                <button class="delete-button" @click=${this.handleDeleteTeam}>Delete Team</button>
                ${this.renderError()}
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
                display: grid; 
                grid-template-columns: 1fr 1fr 1fr;
                justify-items: center;
                margin: var(--margin);
                padding: var(--padding);
            }
            .info-pair {
                display: flex;       
                align-items: center; 
                gap: 0.5rem;
            }
        `
    ]
}