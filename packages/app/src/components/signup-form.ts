import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../../../proto/src/styles/reset.css.js";

interface SignUpFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export class SignUpFormElement extends LitElement {

  @state()
  formData: SignUpFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(
      this.api &&
      this.formData.email &&
      this.formData.password &&
      this.formData.confirmPassword &&
      this.formData.password === this.formData.confirmPassword
    );
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>

        <label>
          Email
          <input type="email" name="email" .value=${this.formData.email || ""} required>
        </label>

        <label>
          Password
          <input type="password" name="password" .value=${this.formData.password || ""} required>
        </label>

        <label>
          Confirm Password
          <input type="password" name="confirmPassword" .value=${this.formData.confirmPassword || ""} required>
        </label>

        <slot name="button">
          <button
            ?disabled=${false}
            type="submit">
            Sign Up
          </button>
        </slot>

        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,
    css`
      label {
        display: block;
        margin-bottom: var(--size-spacing-medium);
      }

      input {
        width: 100%;
        padding: var(--size-spacing-small);
        margin-top: 0.25rem;
      }

      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "email":
        this.formData = { ...prevData, email: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
      case "confirmPassword":
        this.formData = { ...prevData, confirmPassword: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (!this.canSubmit) {
      this.error = "Passwords do not match or fields are missing";
      return;
    }

    const credential = {
      email: this.formData.email!,
      password: this.formData.password
    };

    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credential)
    })
    .then(res => {
      if (res.status !== 201) throw Error("Sign-up failed");
      return res.json();
    })
    .then((json: object) => {
      const { token } = json as { token: string };
      const customEvent = new CustomEvent('auth:message', {
        bubbles: true,
        composed: true,
        detail: ['auth/signup', { token, redirect: this.redirect }]
      });
      this.dispatchEvent(customEvent);
    })
    .catch((error: Error) => {
      this.error = error.toString();
    });
  }

}