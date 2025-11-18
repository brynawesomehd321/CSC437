import { html, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property } from "lit/decorators.js";

export class ScheduleViewElement extends LitElement {
    @property()
    teamId?: number;

    render() {
        return html`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                SLO Motion Schedule
            </h2>
        </div>
        <schedule-table src="/api/teams/${this.teamId}/schedule"></schedule-table>
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