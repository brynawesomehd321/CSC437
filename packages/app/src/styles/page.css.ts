import { css } from "lit";

const styles = css`
    h1 {
    text-align: var(--text-align);
    font-size: var(--font-size-header);
    font-style: var(--font-style-header);
    font-family: var(--font-family-header);
}

h2 {
    text-align: var(--text-align);
    font-size: var(--font-size-subheader);
    font-style: var(--font-style-header);
    font-family: var(--font-family-header);
}

h3 {
    text-align: var(--text-align);
    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
    font-family: var(--font-family-header);
}

p {
    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
    font-family: var(--font-family-body);
}

ul {
    background-color: white;
    color: var(--color-text);
    text-align: var(text-align-list);
    font-size: var(--font-size-body);
    font-style: var(--font-style-subheader);
}

dl {
    background-color: var(--color-background-page);
    color: var(--color-text);
    text-align: var(text-align-list);
    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
}

dt {
    font-weight: bold;
}

dd {
    margin-left: 20px;
}

body {
    background-color: var(--color-background-page);
    color: var(--color-text);
    font-family: var(--font-family-body);
}

svg.icon {
  display: inline;
  height: 2em;
  width: 2em;
  vertical-align: middle;
  fill: var(--color-icon);
}

.header {
    display: grid;
    grid-template-columns: [start] 1fr 1fr 1fr [end];
    gap: var(--margin);
    align-items: baseline;
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: var(--color-background-header);
    color: var(--color-header);
    text-align: var(--text-align);
    font-size: var(--font-size-header);
    font-style: var(--font-style-header);
    font-family: var(--font-family-header);
    padding: var(--padding);
}

/* Position each grid item */
.header > :first-child {
    justify-self: start;   /* home symbol aligned left */
}

.header > :nth-child(2) {
    justify-self: center;  /* title centered (default text-align still applies) */
}

.header > :last-child {
    justify-self: end;     /* login button aligned right */
}

.subheader {
    display: flex;
    align-items: baseline;
    justify-content: center;
    background-color: var(--color-background-subheader);
    color: var(--color-text);
    text-align: var(--text-align);
    font-size: var(--font-size-subheader);
    font-style: var(--font-style-header);
    font-family: var(--font-family-header);
    padding: var(--padding);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--margin);

    > * {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-grid);
        color: var(--color-text);
        margin: var(--margin);
        padding: var(--margin);
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
    }

    > *:hover {
        box-shadow: 0 8px 16px var(--color-hover);
    }
}

.grid-paragraph {
    display: flex;
    grid-column: start / end;
    align-items: baseline;
    justify-content: space-between;
    background-color: var(--color-grid);
    color: var(--color-text);
    margin: var(--margin);
    padding: var(--padding);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.grid-header {
    display: flex;
    grid-column: start / end;
    align-items: baseline;
    justify-content: center;
    background-color: var(--color-background-subheader);
}

.checkbox {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
    font-family: var(--font-family-body);
    color: var(--color-text);

    /* Improve click target */
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    background: var(--color-background-page);
}

/* Hide the actual checkbox visually but keep it accessible */
.checkbox > input {
    appearance: none;
    -webkit-appearance: none;
    width: 40px;
    height: 22px;
    border-radius: 20px;
    background: #bbb;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background 0.25s ease;
}

/* The sliding circle */
.checkbox > input::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: 3px;
    transition: transform 0.25s ease;
}

/* ON state */
.checkbox > input:checked {
    background: #4caf50; /* green toggle */
}

.checkbox > input:checked::before {
    transform: translateX(18px);
}

.error {
    color: red;
    text-align: center;
}

.form {
    display: flex;
    padding: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: var(--color-grid);
    margin: var(--margin);
    align-items: center;
    justify-content: center;
    width: 95%;
    
    > * {
        margin-bottom: 1rem;
    }
}

.centered-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.delete-button {
    padding: 0.7rem 1.4rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.delete-button:hover {
    background: linear-gradient(135deg, #ff6b61, #d8433f);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}
`;

export default { styles };