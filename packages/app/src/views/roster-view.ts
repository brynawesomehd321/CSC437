import { html, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property } from "lit/decorators.js";

export class RosterViewElement extends LitElement {
    @property()
    teamId?: number;

    render() {
        return html`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    SLO Motion Roster
                </h2>
            </div>
            <card-grid src="/api/teams/${this.teamId}/roster"></card-grid>
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