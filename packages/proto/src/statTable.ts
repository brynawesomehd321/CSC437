// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Stat } from "./models/stat.ts";
import { Player } from "./models/player.ts";
import pageCss from "./styles/page.css.ts";
import statsCss from "./styles/stats.css.ts";

/*
    let rows = stats.map((row) =>
        html`
            <dt>${row.name}</dt>
        `
    )
*/

interface StatRow {
  name: string;
  scores: number;
  blocks: number;
  drops: number;
  incompletions: number;
}

export class StatTableElement extends LitElement {
    @property()
    src?: string;

    @state()
    stats: Array<Stat> = [];

    @state()
    statRows: Record<number, StatRow> = {}; //playerId, StatRow

    _authObserver = new Observer<Auth.Model>(this, "stats:auth");
    _user?: Auth.User;
    
    get authorization(): { Authorization?: string } {
        if (this._user && this._user.authenticated)
            return {
                Authorization:
                    `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
            };
        else return {};
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            this._user= auth.user;
            if (this.src) this.hydrate(this.src);
        });
    }


    async getPlayerName(playerId: number): Promise<string> {
        return await fetch(`/api/players/${playerId}`, { headers: this.authorization })
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                const player = json as Player
                return player.playerName;      
            }
            console.log("Player not found");
            throw new Error("Player not found");
        })
    }

    /*parseStatTypes() {
        //for each stat that we get back from the server:
        for(const stat of this.stats) {
            const playerId = stat.playerId;
            //make a new statRow for each player
            console.log(playerId);
            if (!this.statRows[playerId]) {
                const name = this.getPlayerName(playerId);
                const statRow = {
                    name: name,
                    scores: 0,
                    blocks: 0,
                    drops: 0,
                    incompletions: 0
                };
                this.statRows[playerId] = statRow;
                console.log("new");
            }
            if (stat.statType === "score") {
                this.statRows[playerId].scores += 1;
            }
            else if (stat.statType === "block") {
                this.statRows[playerId].blocks += 1;
            }
            else if (stat.statType === "drop") {
                this.statRows[playerId].drops += 1;
            }
            else if (stat.statType === "incompletion") {
                this.statRows[playerId].incompletions += 1;
            }
        }
    }*/

    hydrate(src: string) {
        fetch(src, { headers: this.authorization })
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                // store the data as @state
                this.stats = json as Array<Stat>;

                //get unique player ids
                const playerIds = Array.from(
                    new Set(this.stats.map(stat => stat.playerId).filter(id => id != null))
                );
                console.log(playerIds);

                //Fetch all player names concurrently
                const namePromises = playerIds.map(playerId =>
                    this.getPlayerName(playerId)
                        .then(name => ({ playerId, name }))
                        .catch(err => {
                            console.error(`Failed to fetch player ${playerId}:`, err);
                            return { playerId, name: "Unknown" }; // fallback
                        })
                );

                return Promise.all(namePromises);
            }
        })
       .then(players => {
            if (!players) return;

            // initialize statRows
            players.forEach(({ playerId, name }) => {
                console.log(name);
                if (!this.statRows[playerId]) {
                    this.statRows[playerId] = {
                        name,
                        scores: 0,
                        blocks: 0,
                        drops: 0,
                        incompletions: 0
                    };
                }
            });

            // Accumulate stats
            this.stats.forEach(stat => {
                const row = this.statRows[stat.playerId];
                if (!row) return; // safety
                switch (stat.statType) {
                    case "score": 
                    row.scores += 1; break;
                    case "block": row.blocks += 1; break;
                    case "drop": row.drops += 1; break;
                    case "incompletion": row.incompletions += 1; break;
                }
            });
            // Tell Lit to re-render
            this.requestUpdate();
        })
        .catch(err => console.error("Failed to hydrate stats:", err));
    }

    renderStatRows() {
        const rows = Object.values(this.statRows);

        if (!rows.length) {
            return html`<div>Loading stats...</div>`;
        }

        return rows.map((row) =>
        html`
            <div class="stat-row">
                <dt>${row.name}</dt>
                <dd>${row.scores}</dd>
                <dd>${row.blocks}</dd>
                <dd>${row.drops}</dd>
                <dd>${row.incompletions}</dd>
            </div>
        `
        )
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