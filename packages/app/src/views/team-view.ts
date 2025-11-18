import { html, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property } from "lit/decorators.js";

export class TeamViewElement extends LitElement {
    @property()
    teamId?: number;

    render() {
        return html`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    SLO Motion
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <team-info src="/api/teams/${this.teamId}"></team-info>
            <div class="subheader">
                    <h2>Team Access</h2>
                </div>
            <div class="grid">
                <a href="/app/team/${this.teamId}/roster">
                    <h2>Team Roster</h2>
                </a>
                <a href="/app/team/${this.teamId}/stats">
                    <h2>Team Stats</h2>
                </a>
                <a href="/app/team/${this.teamId}/schedule">
                    <h2>Team Schedule</h2>
                </a>
            </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles
    ]
}