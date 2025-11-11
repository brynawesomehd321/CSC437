import{a as d,O as u,x as h,r as l,i as p,n as v,b as g}from"./mustang-DkBCA8E-.js";var f=Object.defineProperty,c=(o,e,r,m)=>{for(var t=void 0,a=o.length-1,n;a>=0;a--)(n=o[a])&&(t=n(e,r,t)||t);return t&&f(e,r,t),t};const i=class i extends d{constructor(){super(...arguments),this.cards=[],this._authObserver=new u(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}hydrate(e){fetch(e,{headers:this.authorization}).then(r=>r.json()).then(r=>{r&&(this.cards=r)})}renderCardGrid(){return this.cards.map(r=>h`
            <a href="/team.html">
                <h2>${r.teamName}</h2>
            </a>
        `)}render(){return h`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `}};i.styles=[l.styles,p`
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
        `];let s=i;c([v()],s.prototype,"src");c([g()],s.prototype,"cards");export{s as C};
