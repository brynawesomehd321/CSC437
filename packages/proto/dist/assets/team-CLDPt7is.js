import{i as p,O as c,x as d,r as l,b as m,n as f,c as u,d as y,a as v}from"./mustang-nWy_x3l5.js";import{p as b,H as g}from"./header-yGZUB2kS.js";import{s as _}from"./stats.css-C0u7BRNn.js";var P=Object.defineProperty,i=(h,t,e,O)=>{for(var s=void 0,a=h.length-1,o;a>=0;a--)(o=h[a])&&(s=o(t,e,s)||s);return s&&P(t,e,s),s};const n=class n extends p{constructor(){super(...arguments),this._authObserver=new c(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e)return this.team=e,fetch(`/api/teams/${this.team.teamId}/roster`,{headers:this.authorization})}).then(e=>e?.json()).then(e=>{e&&(this.numPlayers=e.length)}).catch(e=>console.error("Hydrate failed:",e))}render(){return d`
        <section class="teamInfo">
            <p>Team Name: ${this.team?.teamName}</p>
            <p>Division: College</p>
            <p>Number of Players: ${this.numPlayers}</p>
        </section>
        `}};n.styles=[l.styles,b.styles,_.styles,m`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }
        `];let r=n;i([f()],r.prototype,"src");i([u()],r.prototype,"team");i([u()],r.prototype,"numPlayers");y({"page-header":g,"team-info":r,"mu-auth":v.Provider});
