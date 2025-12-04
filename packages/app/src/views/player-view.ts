import { html, css } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Stat, Player, Game } from "server/models";
import { View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class PlayerViewElement extends View<Model, Msg> {
    @property({ attribute: "player-id" })
    playerId?: number;

    @property({ attribute: "team-id" })
    teamId?: number;

    @state()
    get playerStats(): Array<Stat> {
        return this.model.playerStats ?? [];
    }

    @state()
    get player(): Player | undefined {
        return this.model.player;
    }

    @state()
    get schedule(): Array<Game> {
        return this.model.schedule ?? [];
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

        if (name === "player-id" && newValue) {
            this.dispatchMessage(["player/request", { playerId: Number(newValue) }]);
            this.dispatchMessage(["player/stats/request", { playerId: Number(newValue) }]);

            // ONLY request schedule if we already know the team-id
            if (this.teamId) {
                this.dispatchMessage(["team/schedule/request", { teamId: this.teamId }]);
            }
        }

        if (name === "team-id" && newValue) {
            this.dispatchMessage(["team/schedule/request", { teamId: Number(newValue) }]);
        }
    }

    render() {
        return html`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-player" />
                    </svg>
                    Player Profile
                </h2>
            </div>
            <section class="player-profile">
                <div class="info-pair">
                    <h3>Name:</h3>
                    <p>${this.player ? this.player.playerName : "Loading..."}</p>
                </div>
                <div class="info-pair">
                    <h3>Number:</h3>
                    <p>${this.player ? this.player.playerNumber : "Loading..."}</p>
                </div>
            </section>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Total Player Stats
                </h2>
            </div>
            <stat-table .stats=${this.playerStats} .players=${this.player ? [this.player] : []} team-id=${this.teamId}></stat-table>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Stats Per Game
                </h2>
            </div>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
            <player-stat-table .stats=${this.playerStats} .games=${this.schedule} team-id=${this.teamId}></player-stat-table>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
        .player-profile {
            display: grid; 
            grid-template-columns: 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .info-pair {
            display: flex;       /* lay out h3 and p horizontally */
            align-items: center; /* vertically center h3 and p */
            gap: 0.5rem;         /* space between h3 and p */
        }
        `
    ]
}