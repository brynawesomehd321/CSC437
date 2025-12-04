// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import { Stat, Game } from "server/models";
import pageCss from "../styles/page.css.ts";
import statsCss from "../styles/stats.css.ts";


interface StatRow {
    name: string;
    scores: number;
    blocks: number;
    drops: number;
    incompletions: number;
}

export class PlayerStatTableElement extends LitElement {
    @property({ type: Array })
    stats: Array<Stat> = [];

    @property({ type: Array })
    games: Array<Game> = [];

    @property({ attribute: "team-id" })
    teamId?: number;

    getGameName(gameId: number): string {
        const game = this.games.find(g => g.gameId === gameId);
        return game ? game.title : "Unknown";
    }

    @state()
    get statRows(): Array<StatRow> {
        const rows: Record<number, StatRow> = {};

        for (const stat of this.stats) {
            if (!rows[stat.gameId]) {
                rows[stat.gameId] = {
                    name: this.getGameName(stat.gameId) ?? "Unknown",
                    scores: 0,
                    blocks: 0,
                    drops: 0,
                    incompletions: 0
                };
            }

            switch (stat.statType) {
                case "score": rows[stat.gameId].scores++; break;
                case "block": rows[stat.gameId].blocks++; break;
                case "drop": rows[stat.gameId].drops++; break;
                case "incompletion": rows[stat.gameId].incompletions++; break;
            }
        }

        return Object.values(rows);
    }

    renderStatRows() {
        const rows = Object.values(this.statRows);

        if (!rows.length) {
            return html`<h2>No stats to report yet...</h2>`;
        }

        return rows.map((row) => {
            // Find the corresponding game to get their ID
            const game = this.games.find(g => g.title === row.name);
            const gameId = game ? game.gameId : null;

            return html`
            <div class="stat-row">
                <dt>
                    ${gameId
                        ? html`<a href="/app/team/${this.teamId}/schedule/${gameId}">${row.name}</a>`
                        : row.name
                    }
                </dt>
                <dd>${row.scores}</dd>
                <dd>${row.blocks}</dd>
                <dd>${row.drops}</dd>
                <dd>${row.incompletions}</dd>
            </div>
        `
        });
    }

    override render() {
        return html`
        <section class="stat-grid-header">
            <h3>Name</h3>
            <h3>Scores</h3>
            <h3>Blocks</h3>
            <h3>Drops</h3>
            <h3>Incompletions</h3>
        </section>
        <section class="stat-grid-body">
            <dl>
                ${this.renderStatRows()}
            </dl>
        </section>
        `
    }
    static styles = [
        reset.styles,
        pageCss.styles,
        statsCss.styles,
        css`
        `
    ];
}