// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";
import { property, state } from "lit/decorators.js";


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
    stats: Array<StatRow> = [];

    connectedCallback() {
        super.connectedCallback();
        if (this.src) this.hydrate(this.src);
    }

    hydrate(src: string) {
        fetch(src)
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                // store the data as @state
                this.stats = json as Array<StatRow>;
            }
        })
    }

    renderStatRows() {
        let rows = this.stats.map((row) =>
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
        return rows;
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
        css`
            .stat-grid-header {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: var(--margin);
                text-align: center;
                background-color: var(--color-background-header);
                color: var(--color-header);
                margin-top: var(--margin);
            }

            .stat-grid-body {
                background-color: var(--color-grid)
            }

            .stat-row {
                display: grid;
                grid-template-columns: repeat(5, 1fr); /* 5 columns */
                text-align: center;
                border-bottom: 1px solid var(--color-accent);
                padding: var(--padding);
                margin: 0px;
                transition: background-color 0.3s ease;

                > dt {
                    font-weight: bold;
                }
            }

            .stat-row:hover {
                background-color: var(--color-hover);
            }
        `
    ];
}