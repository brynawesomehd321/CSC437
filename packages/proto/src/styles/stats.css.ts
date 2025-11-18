import { css } from "lit";

const styles = css`
.stat-grid-header {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--margin);
    text-align: center;
    background-color: var(--color-background-header);
    color: var(--color-header);
    margin-top: var(--margin);
}

.stat-grid-body {
    background-color: var(--color-grid)
}

.stat-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 columns */
    text-align: center;
    border-bottom: 1px solid var(--color-accent);
    padding: var(--padding);
    margin: 0px;
    transition: background-color 0.3s ease;

     > dt {
        font-weight: bold;
    }
}

.stat-row:hover {
    background-color: var(--color-hover);
}
`;

export default { styles };