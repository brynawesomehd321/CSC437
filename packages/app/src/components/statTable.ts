// src/statTable.ts
import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import { Stat, Player } from "server/models";
import pageCss from "../styles/page.css.ts";
import statsCss from "../styles/stats.css.ts";
import { View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";

interface StatRow {
    statId: number;
    name: string;
    scores: number;
    blocks: number;
    drops: number;
    incompletions: number;
}

export class StatTableElement extends View<Model, Msg> {
    @property({ type: Array })
    stats: Array<Stat> = [];

    @property({ type: Array })
    players: Array<Player> = [];

    @property({ attribute: "team-id" })
    teamId?: number;

    @state()
    _error?: Error;

    getPlayerName(playerId: number): string {
        const player = this.players.find(p => p.playerId === playerId);
        return player ? player.playerName : "Unknown";
    }

    @state()
    get statRows(): Array<StatRow> {
        const rows: Record<number, StatRow> = {};

        for (const stat of this.stats) {
            if (!rows[stat.playerId] && stat.statId) {
                rows[stat.playerId] = {
                    statId: stat.statId,
                    name: this.getPlayerName(stat.playerId) ?? "Unknown",
                    scores: 0,
                    blocks: 0,
                    drops: 0,
                    incompletions: 0
                };
            }

            switch (stat.statType) {
                case "score": rows[stat.playerId].scores++; break;
                case "block": rows[stat.playerId].blocks++; break;
                case "drop": rows[stat.playerId].drops++; break;
                case "incompletion": rows[stat.playerId].incompletions++; break;
            }
        }

        return Object.values(rows);
    }

    renderStatRows() {
        const rows = Object.values(this.statRows);

        if (!rows || !rows.length) {
            return html`<h3>No stats to report yet...</h3>`;
        }

        return rows.map((row) => {
            // Find the corresponding player to get their ID
            const player = this.players.find(p => p.playerName === row.name);
            const playerId = player ? player.playerId : null;

            return html`
            <div class="stat-row">
                <dt>
                    ${playerId
                        ? html`<a href="/app/team/${this.teamId}/player/${playerId}">${row.name}</a>`
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
        <div class="table">
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
        </div>
        `
    }
    static styles = [
        reset.styles,
        pageCss.styles,
        statsCss.styles,
        css`
        .table {
            margin-bottom: var(--margin);
        `
    ];
}