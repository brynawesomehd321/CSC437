// src/cardGrid.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { property } from "lit/decorators.js";
import { Team } from "server/models";
import { Player } from "server/models";
import pageCss from "../styles/page.css.ts";

export class CardGridElement extends LitElement {
    @property({ type: Array })
    cards: Array<Player | Team> = [];

    @property({ attribute: "team-id" })
    teamId?: number;

    @property()
    dataType?: "teams" | "roster";

    renderCardGrid() {
        if (this.dataType === "teams") {
            if (!this.cards || this.cards.length === 0) return html`
                <h2>No teams yet!</h2>
            `;
            return this.cards.map((card) => {
                if ("teamName" in card) { // type guard
                    return html`
                        <a href="/app/team/${card.teamId}">
                            <h2>${card.teamName}</h2>
                        </a>
                    `;
                }
            });
        }
        else if (this.dataType === "roster") {
            if (!this.cards || this.cards.length === 0) return html`
                <h2>No players yet!</h2>
            `;
            return this.cards.map((card) => {
                if ("playerName" in card) { // type guard
                    return html`
                        <a href="/app/team/${this.teamId}/player/${card.playerId}">
                            <h3>${card.playerName}</h3>
                        </a>
                    `;
                }
            });
        }
    }

    override render() {
        return html`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `
    }
    static styles = [
        reset.styles,
        pageCss.styles,
        css`
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--margin);

                > * {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--color-grid);
                    color: var(--color-text);
                    margin: var(--margin);
                    padding: var(--margin);
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: box-shadow 0.3s ease;
                }

                > *:hover {
                    box-shadow: 0 8px 16px var(--color-hover);
                }
            }
        `
    ];
}