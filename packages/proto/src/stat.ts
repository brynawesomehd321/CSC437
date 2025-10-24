// src/stat.ts
import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";

export class StatElement extends LitElement {
    override render() {
        return html`
        <dl>
            <slot>
                <dt>Bryn Harper</dt>
                <dd>100</dd>
            </slot>
        </dl>
        `
    }
    static styles = [
        reset.styles,
        css`
            dl {
                display: grid;
                grid-template-columns: repeat(5, 1fr); /* 5 columns */
                text-align: center;
                border-bottom: 1px solid var(--color-accent);
                padding: var(--padding);
                margin: 0px;
                transition: background-color 0.3s ease;
            }

            dl:hover {
                background-color: var(--color-hover);
            }
            `
        ];
}