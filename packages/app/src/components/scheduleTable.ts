// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Game} from "server/models";


export class ScheduleTableElement extends LitElement {
    @property()
    src?: string;

    @state()
    games?: Array<Game>;

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

    hydrate(src: string) {
        fetch(src, { headers: this.authorization })
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                this.games = json as Array<Game>;
            }
        })
        .catch(err => console.error("Hydrate failed:", err));
    }

    renderGames() {
        if(!this.games) {
            return html`
                <h2>No games yet...</h2>
            `
        } else {
            return this.games.map((game) =>
                html`
                    <div class="game-row">
                        <dt>
                            <a href="/app/game/${game.gameId}">
                                ${game.title}
                            </a>
                        </dt>
                        <dd>${game.location}</dd>
                        <dd>${game.date}</dd>
                        <dd>
                            <a class="stat-button" href="/app/team/${game.teamId}/schedule/${game.gameId}">
                                <svg class="icon">
                                    <use href="/icons/base.svg#icon-stats" />
                                </svg>
                            </a>
                        </dd>
                    </div>
                `
            );
        }
    }

    override render() {
        return html`
            <section class="grid-header">
                <h3>Title</h3>
                <h3>Location</h3>
                <h3>Date</h3>
                <h3>Stats</h3>
            </section>
            <section class="grid-body">
                <dl>
                    ${this.renderGames()}
                </dl>
            </section>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
        .grid-header {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--margin);
            text-align: center;
            background-color: var(--color-background-header);
            color: var(--color-header);
            margin-top: var(--margin);
        }

        .grid-body {
            background-color: var(--color-grid)
        }

        .game-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr); /* 5 columns */
            text-align: center;
            border-bottom: 1px solid var(--color-accent);
            padding: var(--padding);
            margin: 0px;
            transition: background-color 0.3s ease;

            > dt {
                font-weight: bold;
            }
        }

        .game-row:hover {
            background-color: var(--color-hover);
        }

        .stat-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem;
            border-radius: 8px;
            cursor: pointer;
            transition: 
                background-color 0.2s ease,
                transform 0.15s ease,
                box-shadow 0.2s ease;
        }


        /* Hover: brighter, raised, larger */
        .stat-button:hover {
            background-color: rgba(0, 0, 0, 0.08);
            transform: scale(1.12);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        /* Click: subtle press-down */
        .stat-button:active {
            transform: scale(1.05);
            background-color: rgba(0, 0, 0, 0.15);
        }
        `
    ];
}