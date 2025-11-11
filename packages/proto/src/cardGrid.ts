// src/cardGrid.ts
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Team } from "./models/team.ts";

export class CardGridElement extends LitElement {
    @property()
    src?: string;

    @state()
    cards: Array<Team> = [];

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
                // store the data as @state
                this.cards = json as Array<Team>;
            }
        })
    }

    renderCardGrid() {
        let cards = this.cards.map((card) =>
        html`
            <a href="/team.html">
                <h2>${card.teamName}</h2>
            </a>
        `
        )
        return cards;
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