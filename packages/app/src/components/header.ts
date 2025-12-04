// scripts/header.js
import { html, css } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events, View } from "@calpoly/mustang";
import { User } from "server/models";
import { Model } from "../model";
import { Msg } from "../messages";

export class HeaderElement extends View<Model, Msg> {

    @state()
    loggedIn = false;

    constructor() {
        super("stats:model");
    }

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
            this._user = auth.user;  // store the authenticated user

            if (this._user && this._user.authenticated) {
                this.loggedIn = true;
                this.dispatchMessage([
                    "user/request",
                    { email: this._user?.username }
                ]);                
            } else {
                this.loggedIn = false;
            }
        });
    }

    // Read the actual user from global Model
    get user(): User | undefined {
        return this.model?.user;
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
                <a href="/">
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-home" />
                    </svg>
                </a>
            </span>
            <h1>Stat Tracker</h1>
            <a class="user" slot="actuator" href=${this.user?.userid ? `/app/${this.user?.userid}` : `/app`}>
                ${this.user?.email || "Guest"}
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