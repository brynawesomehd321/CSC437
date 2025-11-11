// scripts/header.js
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";
import page from "./styles/page.css.ts";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
    _authObserver = new Observer<Auth.Model>(this, "stats:auth");

    @state()
    loggedIn = false;

    @state()
    userid?: string;

    connectedCallback() {
        super.connectedCallback();

        this._authObserver.observe((auth: Auth.Model) => {
            const { user } = auth;

            if (user && user.authenticated ) {
                this.loggedIn = true;
                this.userid = user.username;
            } else {
                this.loggedIn = false;
                this.userid = undefined;
            }
        });
    }

    renderSignOutButton() {
    return html`
            <button
                @click=${(e: UIEvent) => {
                    Events.relay(e, "auth:message", ["auth/signout"])
                }}
            >
                Sign Out
            </button>
        `;
    }

    renderSignInButton() {
    return html`
        <a href="/login.html">
            Sign In…
        </a>
    `;
    }

    override render() {
        return html`
        <section class="header">
            <span>
                <a href="index.html">
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-home" />
                    </svg>
                </a>
            </span>
            <h1>Stat Tracker</h1>
            <a class="user" slot="actuator">
                ${this.userid || "Guest"}
                ${this.loggedIn ?
                    this.renderSignOutButton() :
                    this.renderSignInButton()
                }
            </a>
        </section>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
            .user {
                font-size: 20px;
            }

            button {
                padding: var(--padding);
                font-family: var(--font-family-body);
                background-color: white;
                border: 1px solid var(--color-accent);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
            }

            button:hover {
                box-shadow: 0 4px 8px var(--color-hover);
            }
        `
    ];
}