import{i as l,x as i,r as h,a as p,n as g,b as m}from"./state-J0lqo2u5.js";var u=Object.defineProperty,n=(d,s,r,v)=>{for(var t=void 0,o=d.length-1,c;o>=0;o--)(c=d[o])&&(t=c(s,r,t)||t);return t&&u(s,r,t),t};const a=class a extends l{constructor(){super(...arguments),this.stats=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(s){fetch(s).then(r=>r.json()).then(r=>{r&&(this.stats=r)})}renderStatRows(){return this.stats.map(r=>i`
            <div class="stat-row">
                <dt>${r.name}</dt>
                <dd>${r.scores}</dd>
                <dd>${r.blocks}</dd>
                <dd>${r.drops}</dd>
                <dd>${r.incompletions}</dd>
            </div>
        `)}render(){return i`
        <section class="stat-grid-header">
            <h3>Name</h3>
            <h3>Scores</h3>
            <h3>Blocks</h3>
            <h3>Drops</h3>
            <h3>Incompletions</h3>
        </section>
        <section class="stat-grid-body">
            <dl>
                ${this.renderStatRows()}
            </dl>
        </section>
        `}};a.styles=[h.styles,p`
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
        `];let e=a;n([g()],e.prototype,"src");n([m()],e.prototype,"stats");customElements.define("stat-table",e);
