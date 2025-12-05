// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import stats from "../styles/stats.css.ts";
import { property } from "lit/decorators.js";


export class BackButtonElement extends LitElement {
    @property({ attribute: "team-id" })
    teamId?: number;

    override render() {
        return html`
        <a href="/app/team/${this.teamId}" class="back-button">
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
        stats.styles,
        css`
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;

            padding: 0.6rem 1.1rem;
            border-radius: 12px;

            background: var(--color-accent);
            color: white;

            transition: background-color 0.2s ease, 
                        transform 0.15s ease, 
                        box-shadow 0.2s ease;
        }

        .back-button:hover {
            background: var(--color-accent-dark, #1f6feb);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        `
    ];
}