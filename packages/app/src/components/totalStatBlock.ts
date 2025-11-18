// src/statTable.ts
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import page from "../styles/page.css.ts";
import stats from "../styles/stats.css.ts";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";


interface TotalStatBlock {
  totalScores: string;
  totalBlocks: number;
  totalDrops: number;
  totalIncompletions: number;
}

export class TotalStatBlockElement extends LitElement {
    @property()
    src?: string;

    @state()
    total?: TotalStatBlock;

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
                this.total = json as TotalStatBlock;
            }
        })
        .catch(err => console.error("Failed to hydrate total stat block:", err));
    }

    renderTotalStatBlock() {
        return html`
            <div class="stat-row">
                <dt>${this.total?.totalScores}</dt>
                <dd>${this.total?.totalBlocks}</dd>
                <dd>${this.total?.totalDrops}</dd>
                <dd>${this.total?.totalIncompletions}</dd>
            </div>
        `
    }

    override render() {
        return html`
        <section class="stat-grid-header">
            <h3>Total Scores</h3>
            <h3>Total Blocks</h3>
            <h3>Total Drops</h3>
            <h3>Total Incompletions</h3>
        </section>
        <section class="stat-grid-body">
            <dl>
                ${this.renderTotalStatBlock()}
            </dl>
        </section>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        stats.styles,
        css`
        `
    ];
}