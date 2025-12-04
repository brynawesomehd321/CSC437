import { html } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View } from "@calpoly/mustang";

export class ScheduleViewElement extends View<Model, Msg> {
    @property({attribute: "team-id" })
    teamId?: number;

    @state()
    get schedule(): Array<Game> | undefined {
        return this.model.schedule;
    }

    constructor() {
        super("stats:model");
    }

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            name === "team-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            this.dispatchMessage([
            "team/schedule/request",
            { teamId: Number(newValue) }
            ]);
        }
    }

    render() {
        return html`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                SLO Motion Schedule
            </h2>
        </div>
        <schedule-table .games=${this.schedule}></schedule-table>
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