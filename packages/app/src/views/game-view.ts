import { html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Game } from "server/models";

export class GameViewElement extends LitElement {
    @property()
    gameId?: number;

    @property()
    teamId?: number;

    @state()
    game?: Game;

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
            this.hydrate();
        });
    }

    hydrate() {
        fetch(`/api/games/${this.gameId}`, { headers: this.authorization })
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                this.game = json as Game;
            }
        })
        .catch(err => console.error("Hydrate failed:", err));
    }

    render() {
        return html`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                ${this.game?.title}
            </h2>
        </div>
        <stat-table src="/api/games/${this.gameId}/stats"></stat-table>
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