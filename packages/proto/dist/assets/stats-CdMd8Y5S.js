import{i as f,O as y,x as n,r as b,b as m,n as v,c as d,d as g,a as w}from"./mustang-nWy_x3l5.js";import{p as k,H as P}from"./header-yGZUB2kS.js";import{s as _}from"./stats.css-C0u7BRNn.js";var O=Object.defineProperty,l=(h,e,t,a)=>{for(var s=void 0,r=h.length-1,o;r>=0;r--)(o=h[r])&&(s=o(e,t,s)||s);return s&&O(e,t,s),s};const u=class u extends f{constructor(){super(...arguments),this.stats=[],this.statRows={},this._authObserver=new y(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}async getPlayerName(e){return await fetch(`/api/players/${e}`,{headers:this.authorization}).then(t=>t.json()).then(t=>{if(t)return t.playerName;throw console.log("Player not found"),new Error("Player not found")})}hydrate(e){fetch(e,{headers:this.authorization}).then(t=>t.json()).then(t=>{if(t){this.stats=t;const a=Array.from(new Set(this.stats.map(r=>r.playerId).filter(r=>r!=null)));console.log(a);const s=a.map(r=>this.getPlayerName(r).then(o=>({playerId:r,name:o})).catch(o=>(console.error(`Failed to fetch player ${r}:`,o),{playerId:r,name:"Unknown"})));return Promise.all(s)}}).then(t=>{t&&(t.forEach(({playerId:a,name:s})=>{console.log(s),this.statRows[a]||(this.statRows[a]={name:s,scores:0,blocks:0,drops:0,incompletions:0})}),this.stats.forEach(a=>{const s=this.statRows[a.playerId];if(s)switch(a.statType){case"score":s.scores+=1;break;case"block":s.blocks+=1;break;case"drop":s.drops+=1;break;case"incompletion":s.incompletions+=1;break}}),this.requestUpdate())}).catch(t=>console.error("Failed to hydrate stats:",t))}renderStatRows(){const e=Object.values(this.statRows);return e.length?e.map(t=>n`
            <div class="stat-row">
                <dt>${t.name}</dt>
                <dd>${t.scores}</dd>
                <dd>${t.blocks}</dd>
                <dd>${t.drops}</dd>
                <dd>${t.incompletions}</dd>
            </div>
        `):n`<div>Loading stats...</div>`}render(){return n`
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
        `}};u.styles=[b.styles,k.styles,_.styles,m`
        `];let i=u;l([v()],i.prototype,"src");l([d()],i.prototype,"stats");l([d()],i.prototype,"statRows");var R=Object.defineProperty,$=(h,e,t,a)=>{for(var s=void 0,r=h.length-1,o;r>=0;r--)(o=h[r])&&(s=o(e,t,s)||s);return s&&R(e,t,s),s};const p=class p extends f{constructor(){super(...arguments),this._authObserver=new y(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}hydrate(e){fetch(e,{headers:this.authorization}).then(t=>t.json()).then(t=>{t&&(this.total=t)}).catch(t=>console.error("Failed to hydrate total stat block:",t))}renderTotalStatBlock(){return n`
            <div class="stat-row">
                <dt>${this.total?.totalScores}</dt>
                <dd>${this.total?.totalBlocks}</dd>
                <dd>${this.total?.totalDrops}</dd>
                <dd>${this.total?.totalIncompletions}</dd>
            </div>
        `}render(){return n`
        <section class="stat-grid-header">
            <h3>Total Scores</h3>
            <h3>Total Blocks</h3>
            <h3>Total Drops</h3>
            <h3>Total Incompletions</h3>
        </section>
        <section class="stat-grid-body">
            <dl>
                ${this.renderTotalStatBlock()}
            </dl>
        </section>
        `}};p.styles=[b.styles,k.styles,_.styles,m`
        `];let c=p;$([v()],c.prototype,"src");$([d()],c.prototype,"total");g({"stat-table":i,"total-stat-block":c,"page-header":P,"mu-auth":w.Provider});
