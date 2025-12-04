import { html } from "lit";
import { View } from "@calpoly/mustang";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { property, state } from "lit/decorators.js";
import { User } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class UserViewElement extends View<Model, Msg> {
    @property({attribute: "user-id"})
    userid?: string;

    @state()
    get profile(): User | undefined {
        return this.model.user;
    }

    constructor() {
        super("stats:model");
    }

    render() {
        return html`
            <section>
                <h2 class="subheader">Profile Details</h2>
                <dl>
                    <dt>Email:</dt>
                    <dd>${this.profile?.email}</dd>
                    <dt>Full Name:</dt>
                    <dd>${this.profile?.fullName}</dd>
                </dl>
            </section>
        `
    }
    static styles = [
        reset.styles,
        page.styles
    ]
}