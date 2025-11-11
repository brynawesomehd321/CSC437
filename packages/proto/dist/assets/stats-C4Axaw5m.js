import{a as h,O as l,x as n,r as u,i as g,n as p,b as v}from"./mustang-DkBCA8E-.js";var b=Object.defineProperty,c=(d,r,t,m)=>{for(var s=void 0,a=d.length-1,i;a>=0;a--)(i=d[a])&&(s=i(r,t,s)||s);return s&&b(r,t,s),s};const o=class o extends h{constructor(){super(...arguments),this.stats=[],this._authObserver=new l(this,"stats:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(r=>{this._user=r.user}),this.src&&this.hydrate(this.src)}hydrate(r){fetch(r).then(t=>t.json()).then(t=>{t&&(this.stats=t)})}renderStatRows(){return this.stats.map(t=>n`
            <div class="stat-row">
                <dt>${t.name}</dt>
                <dd>${t.scores}</dd>
                <dd>${t.blocks}</dd>
                <dd>${t.drops}</dd>
                <dd>${t.incompletions}</dd>
            </div>
        `)}render(){return n`
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
        `}};o.styles=[u.styles,g`
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
        `];let e=o;c([p()],e.prototype,"src");c([v()],e.prototype,"stats");customElements.define("stat-table",e);
