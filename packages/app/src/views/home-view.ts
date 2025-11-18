import { html, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";

export class HomeViewElement extends LitElement {
    render() {
        return html`
            <div class="subheader">
                <h1>My Teams</h1>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <card-grid src="/api/teams"></card-grid>
        `;
    }

    static styles = [
        reset.styles,
        page.styles,
    ];
}