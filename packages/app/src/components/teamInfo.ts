// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import stats from "../styles/stats.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { Team } from "server/models";
import { Player } from "server/models";


export class TeamInfoElement extends LitElement {
    @property()
    src?: string;

    @state()
    team?: Team;

    @state()
    numPlayers?: number;

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
                this.team = json as Team;

                return fetch(`/api/teams/${this.team.teamId}/roster`, { 
                    headers: this.authorization 
                });
            }
        })
        .then(res => res?.json())
        .then((players: Array<Player> | undefined) => {
            if (players) {
                this.numPlayers = players.length;
            }
        })
        .catch(err => console.error("Hydrate failed:", err));
    }

    override render() {
        return html`
        <section class="teamInfo">
            <p>Team Name: ${this.team?.teamName}</p>
            <p>Division: College</p>
            <p>Number of Players: ${this.numPlayers}</p>
        </section>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        stats.styles,
        css`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }
        `
    ];
}