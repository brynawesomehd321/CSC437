import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import { property, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Game, Player, Stat } from "server/models";
import { Msg } from "../messages.ts";
import { Model } from "../model.ts";

export class GameViewElement extends View<Model, Msg> {
    @property({ attribute: "game-id" })
    gameId?: number;

    @property({ attribute: "team-id" })
    teamId?: number;

    @state()
    get game(): Game | undefined {
        return this.model.game;
    }

    @state()
    get gameStats(): Array<Stat> {
        return this.model.gameStats ?? [];
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
            name === "game-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            this.dispatchMessage([
            "game/request",
            { gameId: Number(newValue) }
            ]);
            this.dispatchMessage([
            "game/stats/request",
            { gameId: Number(newValue) }
            ]);
            this.dispatchMessage([
            "team/roster/request",
            { teamId: Number(this.teamId) }
            ]);
        }
    }

    render() {
        return html`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                ${this.game?.title}
            </h2>
        </div>
        <section class="gameInfo">
            <div class="infoPair">
                <h3>Location:</h3>
                <p>${this.game?.location}</p>
            </div>
            <div class="infoPair">
                <h3>Date:</h3>
                <p>${this.game?.date}</p>
            </div>
        </section>
        <stat-table .stats=${this.gameStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
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
        page.styles,
        css`
        .gameInfo {
            display: grid; 
            grid-template-columns: 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .infoPair {
            display: flex;       /* lay out h3 and p horizontally */
            align-items: center; /* vertically center h3 and p */
            gap: 0.5rem;         /* space between h3 and p */
        }
        `
    ]
}