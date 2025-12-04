import { html } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Observer, Auth } from "@calpoly/mustang";
import { View } from "@calpoly/mustang";
import { Team } from "server/models";

export class HomeViewElement extends View<Model, Msg> {

    @state()
    get teams(): Array<Team> | undefined {
        return this.model.userTeams;
    }

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
            this._user= auth.user;
            if (this._user && this._user.authenticated) {
                this.dispatchMessage([
                    "user/teams/request",
                    { email: this._user?.username }
                ]);
            }
        });
    }

    render() {
        return html`
            <div class="subheader">
                <h1>My Teams</h1>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <card-grid .cards=${this.teams} dataType="teams"></card-grid>
        `;
    }

    static styles = [
        reset.styles,
        page.styles,
    ];
}