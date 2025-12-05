import { html, css } from "lit";
import { View, Form, define, History } from "@calpoly/mustang";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { User } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class UserViewElement extends View<Model, Msg> {

    static uses = define({
        "mu-form": Form.Element, // make sure mu-form is defined
    });

    @property({attribute: "user-id"})
    userid?: number;

    @state()
    get profile(): User | undefined {
        return this.model.user;
    }

    constructor() {
        super("stats:model");
    }

    handleSubmit(event: Form.SubmitEvent<User>) {
        console.log("Submitting profile update:", event.detail);
        this.dispatchMessage([
            "user/save",
            {
                userid: this.userid!,
                user: event.detail
            },
            {
            onSuccess: () =>
                History.dispatch(this, "history/navigate", {
                    href: `/app/${this.userid}`
                }),
            onFailure: (error: Error) =>
                console.log("ERROR:", error)
            }
        ]);
    }

    render() {
        return html`
        <h2 class="subheader">Profile Details</h2>
        <div class="content">
            <section>
                <dl>
                    <dt>Email:</dt>
                    <dd>${this.profile?.email}</dd>
                    <dt>Full Name:</dt>
                    <dd>${this.profile?.fullName}</dd>
                </dl>
            </section>
            <section>
                <h3>Edit Profile</h3>
                <mu-form class="form" .init=${this.profile} @mu-form:submit=${this.handleSubmit}>
                    <label>
                        <span class="label-text">Full Name:</span>
                        <input 
                            name="fullName"
                        />
                    </label>
                </mu-form>
            </section>
            <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                <input type="checkbox" autocomplete="off"/>
                Dark mode
            </label>
        </div>
        `
    }
    static styles = [
        reset.styles,
        page.styles,
        css`
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
        }
        `
    ]
}