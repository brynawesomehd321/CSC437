import { html, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property } from "lit/decorators.js";

export class StatsViewElement extends LitElement {
    @property()
    teamId?: number;

    render() {
        return html`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Team Stats
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <total-stat-block src="/api/teams/${this.teamId}/totalStats"/></total-stat-block>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Player Stats
                </h2>
            </div>
            <stat-table src="/api/teams/${this.teamId}/stats"></stat-table>
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
        page.styles
    ]
}