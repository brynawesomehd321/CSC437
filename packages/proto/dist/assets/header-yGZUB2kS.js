import{b as d,i as g,O as h,e as u,x as n,r as v,c}from"./mustang-nWy_x3l5.js";const y=d`
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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
    font-family: var(--font-family-body);
    color: var(--color-header);

    > input {
        margin-right: 5px;
    }
}
`,b={styles:y};var p=Object.defineProperty,f=(s,e,t,x)=>{for(var r=void 0,o=s.length-1,l;o>=0;o--)(l=s[o])&&(r=l(e,t,r)||r);return r&&p(e,t,r),r};const i=class i extends g{constructor(){super(...arguments),this._authObserver=new h(this,"stats:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:t}=e;t&&t.authenticated?(this.loggedIn=!0,this.userId=t.username):(this.loggedIn=!1,this.userId=void 0)})}renderSignOutButton(){return n`
            <button
                @click=${e=>{u.relay(e,"auth:message",["auth/signout"])}}
            >
                Sign Out
            </button>
        `}renderSignInButton(){return n`
        <a href="/login.html">
            Sign In…
        </a>
    `}render(){return n`
        <section class="header">
            <span>
                <a href="index.html">
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-home" />
                    </svg>
                </a>
            </span>
            <h1>Stat Tracker</h1>
            <a class="user" slot="actuator">
                ${this.userId||"Guest"}
                ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
            </a>
        </section>
        `}};i.styles=[v.styles,b.styles,d`
            .user {
                font-size: 20px;
            }

            button {
                padding: var(--padding);
                font-family: var(--font-family-body);
                background-color: white;
                border: 1px solid var(--color-accent);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
            }

            button:hover {
                box-shadow: 0 4px 8px var(--color-hover);
            }
        `];let a=i;f([c()],a.prototype,"loggedIn");f([c()],a.prototype,"userId");export{a as H,b as p};
