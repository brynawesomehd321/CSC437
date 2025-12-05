import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import { property, state } from "lit/decorators.js";
import { View, History, Form } from "@calpoly/mustang";
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

    @state()
    lastPlayerId: number | "" = "";

    @state()
    lastStatType: string = "score";

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

    handleSubmit(event: Form.SubmitEvent<Stat>) {
        this.lastPlayerId = event.detail.playerId;
        this.lastStatType = event.detail.statType;

        const newStat: Stat = {
            statType: event.detail.statType,
            playerId: event.detail.playerId,
            gameId: this.gameId!,
        };
        // Dispatch "team/save" instead of manually appending
        this.dispatchMessage([
            "stat/save",
            { stat: newStat },
            {
                onSuccess: () => {

                    History.dispatch(this, "history/navigate", {
                        href: `/app/team/${this.teamId}/schedule/${this.gameId}`
                    });
                },
                onFailure: (error: Error) => {
                    console.log("ERROR:", error)
                }
            }
        ]);
    }

    handleDeleteStat = (statId: number) => {
        this.dispatchMessage([
            "stat/delete"
            , { statId: statId }
            , {
                onSuccess: () => {
                    this.model.gameStats = this.model.gameStats?.filter(s => s.statId !== statId) ?? [];
                    History.dispatch(this, "history/navigate", {
                        href: `/app/team/${this.teamId}/schedule/${this.gameId}`
                    });
                },
                onFailure: (error: Error) =>
                    this._error = error
            }
        ]);
    }

    handleDeleteGame = () => {
        if (!this.gameId) return;
        this.dispatchMessage([
            "game/delete"
            , { gameId: this.gameId }
            , {
                onSuccess: () =>
                    History.dispatch(this, "history/navigate", {
                        href: `/app/team/${this.teamId}/schedule`
                    }),
                onFailure: (error: Error) =>
                    this._error = error
            }
        ]);
    }

    renderError() {
        return html`<div class="error">
            <p>Error: ${this._error?.message}</p>
        </div>`;
    }

    renderGameStats() {
        return this.gameStats.map(stat => {
            // Find the corresponding player to get their ID
            const player = this.roster.find(p => p.playerId === stat.playerId);
            const playerName = player ? player.playerName : null;
            return html`
            <div class="game-stat-row">
                <dt>
                    ${playerName}
                </dt>
                <dd>${stat.statType}</dd>
                <button 
                    class="delete-stat-button" 
                    @click=${() => this.handleDeleteStat(stat.statId!)}
                >
                    <svg viewBox="0 0 24 24"><path d="M6 6 L18 18 M6 18 L18 6" stroke="white" stroke-width="2"/></svg>
                </button>
            </div>
            `
        });
    }

    render() {
        const initialPlayerId =
        this.lastPlayerId || this.roster[0]?.playerId || "";

        const initialStatType = this.lastStatType;
        
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
            <div class="infoBlock">
                <h3>Location:</h3>
                <p>${this.game?.location}</p>
            </div>
            <div class="infoPair">
                <h3>Date:</h3>
                <p>${this.game?.date}</p>
            </div>
            <button class="delete-button" @click=${this.handleDeleteGame}>Delete Game</button>
        </section>
        <stat-table .stats=${this.gameStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
        
        <div class="subheader">
            <h2>Game Stats</h2>
        </div>
        ${this._error ? this.renderError() : null}
        <div class="game-stats-header">
            <h3>Player Name</h3>
            <h3>Stat Type</h3>
        </div>
        ${this.renderGameStats()}

        <div class="subheader">
            <h2> -- Add a New Stat --</h2>
        </div>
        <div class="centered-content">
        <mu-form
            .init=${{
              playerId: initialPlayerId,
              statType: initialStatType
            }}
            @mu-form:submit=${this.handleSubmit} class="form">
            
            <!-- Player Dropdown -->
            <label>
                Player:
                <select name="playerId" required>
                <option value="" disabled selected>Select a player</option>
                ${this.roster.map(
                    (player) => html`
                    <option value=${player.playerId}>
                        ${player.playerName}
                    </option>
                    `
                )}
                </select>
            </label>

             <!-- Stat Type Dropdown -->
            <label>
                Stat Type:
                <select name="statType" required>
                <option value="" disabled selected>Select a stat type</option>
                <option value="score">Score</option>
                <option value="block">Block</option>
                <option value="drop">Drop</option>
                <option value="incompletion">Incompletion</option>
                </select>
            </label>
        </mu-form>
        <back-button team-id=${this.teamId}></back-button>
        </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
        .gameInfo {
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .infoBlock {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .game-stats-header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            margin-top: var(--margin);
            background-color: var(--color-background-header);
            color: var(--color-header);
        }

        .game-stat-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            text-align: center;
            border-bottom: 1px solid var(--color-accent);
            padding: var(--padding);
            margin: 0px;
            transition: background-color 0.3s ease;

            > dt {
                font-weight: bold;
            }
        }

        .game-stat-row:hover {
            background-color: var(--color-hover);
        }

        .delete-stat-button {
            padding: 0.25rem 0.5rem;      /* small but clickable */
            font-size: 0.85rem;           /* slightly smaller text */
            font-weight: 600;
            border: none;
            border-radius: 6px;
            background-color: #e74c3c;    /* nice red */
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;
            width: auto;           /* don't stretch to fill column */
            justify-self: center;
            }

            .delete-stat-button:hover {
            background-color: #c0392b;    /* darker red on hover */
            transform: scale(1.05);       /* subtle pop */
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }

            .delete-stat-button:active {
            transform: scale(0.95);       /* pressed effect */
            }

            .delete-stat-button svg {
            width: 0.8rem;
            height: 0.8rem;
            }

        `
    ]
}