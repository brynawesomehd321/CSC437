import{i as u,O as l,x as h,r as m,b as f,n as p,c as v}from"./mustang-nWy_x3l5.js";var y=Object.defineProperty,o=(c,e,s,r)=>{for(var t=void 0,i=c.length-1,d;i>=0;i--)(d=c[i])&&(t=d(e,s,t)||t);return t&&y(e,s,t),t};const n=class n extends u{constructor(){super(...arguments),this.cards=[],this._authObserver=new l(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}checkSrc(e){e.includes("teams")&&(this.dataType="teams"),e.includes("roster")&&(this.dataType="roster")}hydrate(e){this.checkSrc(e);const s=`${e}?email=${this._user?.username}`;fetch(s,{headers:this.authorization}).then(r=>r.json()).then(r=>{r&&(this.dataType==="teams"?this.cards=r:this.dataType==="roster"&&(this.cards=r))})}renderCardGrid(){return this.dataType==="teams"?this.cards.map(e=>h`
                    <a href="/team.html">
                        <h2>${e.teamName}</h2>
                    </a>
                `):this.cards.map(e=>h`
                    <a href="/team.html">
                        <h2>${e.playerName}</h2>
                    </a>
                `)}render(){return h`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `}};n.styles=[m.styles,f`
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
        `];let a=n;o([p()],a.prototype,"src");o([p()],a.prototype,"dataType");o([v()],a.prototype,"cards");export{a as C};
