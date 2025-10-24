// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";

export class StatTableElement extends LitElement {
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
            <slot>
                <dl>
                    <dt>Bryn Harper</dt>
                    <dd>10</dd>
                </dl>
            </slot>
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
        `
    ];
}