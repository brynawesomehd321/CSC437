import { html } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { View, Form, History } from "@calpoly/mustang";

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

    handleSubmit(event: Form.SubmitEvent<Game>) {

        const newGame: Game = {
            title: event.detail.title,
            location: event.detail.location,
            date: event.detail.date,
            teamId: this.teamId!
        };
        this.dispatchMessage([
            "game/save",
            { game: newGame },
            {
                onSuccess: () => {
                    History.dispatch(this, "history/navigate", {
                        href: `/app/team/${this.teamId}/schedule`
                    })
                },
                onFailure: (error: Error) =>
                    console.log("ERROR:", error)
            }
        ]);
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
        <div class="centered-content">
                <mu-form
                    .init=${{title: "", location: "", date: ""}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Game Title:
                        <input name="title" placeholder="Enter game name"/>
                    </label>
                    <label>
                        Game Location:
                        <input name="location" placeholder="Enter game location"/>
                    </label>
                    <label>
                        Game Date:
                        <input name="date" placeholder="Enter game date"/>
                    </label>
                </mu-form>
                <back-button team-id=${this.teamId}></back-button>
            </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles
    ]
}