import{i as h,x as c,r as p,a as l,n as g,b as x}from"./state-J0lqo2u5.js";var f=Object.defineProperty,d=(o,e,r,m)=>{for(var a=void 0,t=o.length-1,n;t>=0;t--)(n=o[t])&&(a=n(e,r,a)||a);return a&&f(e,r,a),a};const i=class i extends h{constructor(){super(...arguments),this.cards=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(e){fetch(e).then(r=>r.json()).then(r=>{r&&(this.cards=r)})}renderCardGrid(){return this.cards.map(r=>c`
            <a href="/team.html">
                <h2>${r}</h2>
            </a>
        `)}render(){return c`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `}};i.styles=[p.styles,l`
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
        `];let s=i;d([g()],s.prototype,"src");d([x()],s.prototype,"cards");export{s as C};
