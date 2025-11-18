// src/cardGrid.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Team } from "server/models";
import { Player } from "server/models";
import pageCss from "../styles/page.css.ts";

export class CardGridElement extends LitElement {
    @property()
    src?: string;

    @property()
    dataType?: string;

    @state()
    cards: any[] = [];

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

    checkSrc(src: string): void {
        if (src.includes("teams")) {
            this.dataType = "teams"
        } 
        if (src.includes("roster")) {
            this.dataType = "roster"
        }
    }

    hydrate(src: string) {
        this.checkSrc(src);
        const url = `${src}?email=${this._user?.username}`
        fetch(url, { headers: this.authorization })
        .then(res => res.json())
        .then((json: object) => {
            if(json) {
                if (this.dataType === "teams")
                    this.cards = json as Array<Team>;
                else if (this.dataType === "roster")
                    this.cards = json as Array<Player>;
            }
        })
        .catch((err) => console.error(err));
    }

    renderCardGrid() {
        if (this.dataType === "teams") {
            return this.cards.map((card) => 
                html`
                    <a href="/app/team/${card.teamId}">
                        <h2>${card.teamName}</h2>
                    </a>
                `
            );
        }
        else {
            return this.cards.map((card) =>
                html`
                    <a href="/app/player/${card.playerId}">
                        <h3>${card.playerName}</h3>
                    </a>
                `
            );
        }
    }

    override render() {
        return html`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `
    }
    static styles = [
        reset.styles,
        pageCss.styles,
        css`
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--margin);

                > * {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--color-grid);
                    color: var(--color-text);
                    margin: var(--margin);
                    padding: var(--margin);
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: box-shadow 0.3s ease;
                }

                > *:hover {
                    box-shadow: 0 8px 16px var(--color-hover);
                }
            }
        `
    ];
}