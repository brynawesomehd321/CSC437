import { html, css } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Observer, Auth, History, Form } from "@calpoly/mustang";
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

    handleSubmit(event: Form.SubmitEvent<Array<Team>>) {
        if (!this._user?.username) return;

        const newTeam: Team = {
            teamName: event.detail.teamName,
            email: this._user.username
        };
        this.dispatchMessage([
            "team/save",
            { team: newTeam },
            {
                onSuccess: () =>
                History.dispatch(this, "history/navigate", {
                    href: `/`
                }),
                onFailure: (error: Error) =>
                    console.log("ERROR:", error)
            }
        ]);
    }

    render() {
        return html`
            <div class="subheader">
                <h1>My Teams</h1>
            </div>
            <card-grid .cards=${this.teams} dataType="teams"></card-grid>
            <div class="subheader">
                <h2>Add a team</h2>
            </div>
            <div class="centered-content">
                <mu-form
                    .init=${{}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Team Name:
                        <input name="teamName" placeholder="Enter team name"/>
                    </label>
                </mu-form>
            </div>
        `;
    }

    static styles = [
        reset.styles,
        page.styles,
        css`

        `
    ];
}