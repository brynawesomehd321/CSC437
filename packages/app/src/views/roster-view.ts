import { html, css } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Player, Team } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View, History, Form } from "@calpoly/mustang";

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

    handleSubmit(event: Form.SubmitEvent<Player>) {

        if (!this.teamId) return;
        if (!event.detail.playerName || !event.detail.playerNumber) {
            this._error = new Error("Player name and number are required.");
            return;
        }
        if (isNaN(Number(event.detail.playerNumber))) {
            this._error = new Error("Player number must be a valid number.");
            return;
        }

        const newPlayer: Player = {
            playerName: event.detail.playerName,
            playerNumber: Number(event.detail.playerNumber),
            teamId: this.teamId
        };
        this.dispatchMessage([
            "player/save",
            { player: newPlayer },
            {
                onSuccess: () => {
                    History.dispatch(this, "history/navigate", {
                        href: `/app/team/${this.teamId}/roster`
                    })
                },
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
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    ${this.team?.teamName} Roster
                </h2>
            </div>
            <card-grid .cards=${this.roster} datatype="roster" team-id=${this.teamId}></card-grid>
            
            <div class="subheader">
                <h2>Add a Player</h2>
            </div>
            <div class="centered-content">
                <mu-form
                    .init=${{playerName: "", playerNumber: ""}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Player Name:
                        <input name="playerName" placeholder="Enter player name"/>
                    </label>
                    <label>
                        Player Number:
                        <input name="playerNumber" placeholder="Enter player number"/>
                    </label>
                </mu-form>
                <back-button team-id=${this.teamId}></back-button>
            </div>
            
            ${this.renderError()}
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
            .centered-content {
                display: flex;
                justify-content: center;
        `
    ]
}