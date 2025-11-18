(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var W,Le;class ut extends Error{}ut.prototype.name="InvalidTokenError";function sr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function rr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return sr(t)}catch{return atob(t)}}function ds(i,t){if(typeof i!="string")throw new ut("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new ut(`Invalid token specified: missing part #${e+1}`);let s;try{s=rr(r)}catch(n){throw new ut(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new ut(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ir="mu:context",Xt=`${ir}:change`;class nr{constructor(t,e){this._proxy=or(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ps extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new nr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function or(i,t){return new Proxy(i,{get:(r,s,n)=>{if(s==="then")return;const o=Reflect.get(r,s,n);return console.log(`Context['${s}'] => `,o),o},set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function ar(i,t){const e=fs(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function fs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return fs(i,s.host)}class lr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ms(i="mu:message"){return(t,...e)=>t.dispatchEvent(new lr(e,i))}class ne{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function cr(i){return t=>({...t,...i})}const te="mu:auth:jwt",gs=class ys extends ne{constructor(t,e){super((r,s)=>this.update(r,s),t,ys.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(ur(r)),Zt(s);case"auth/signout":return e(dr()),Zt(this._redirectForLogin);case"auth/redirect":return Zt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};gs.EVENT_TYPE="auth:message";let vs=gs;const _s=ms(vs.EVENT_TYPE);function Zt(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,n])=>r.searchParams.set(s,n)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class hr extends ps{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new vs(this.context,this.redirect).attach(this)}}class ft{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class G extends ft{constructor(t){super();const e=ds(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?G.authenticate(t):new ft}}function ur(i){return cr({user:G.authenticate(i),token:i})}function dr(){return i=>{const t=i.user;return{user:t&&t.authenticated?ft.deauthenticate(t):t,token:""}}}function pr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function fr(i){return i.authenticated?ds(i.token||""):{}}const mr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:hr,User:ft,dispatch:_s,headers:pr,payload:fr},Symbol.toStringTag,{value:"Module"}));function Ot(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function ee(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}const gr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ee,relay:Ot},Symbol.toStringTag,{value:"Module"}));function $s(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const yr=new DOMParser;function D(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=yr.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ze(a);case"bigint":case"boolean":case"number":case"symbol":return ze(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ze(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}W=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(W.template).styles(W.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ot(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},vr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},W.template=D`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,W.styles=$s`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function vr(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return i}const bs=class As extends ne{constructor(t){super((e,r)=>this.update(e,r),t,As.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e($r(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(br(r,s));break}}}};bs.EVENT_TYPE="history:message";let oe=bs;class He extends ps{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=_r(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ae(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new oe(this.context).attach(this)}}function _r(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function $r(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function br(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ae=ms(oe.EVENT_TYPE),Ar=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:He,Provider:He,Service:oe,dispatch:ae},Symbol.toStringTag,{value:"Module"}));class C{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new De(this._provider,t);this._effects.push(s),e(s)}else ar(this._target,this._contextLabel).then(s=>{const n=new De(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class De{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ws=class Es extends HTMLElement{constructor(){super(),this._state={},this._user=new ft,this._authObserver=new C(this,"blazing:auth"),Dt(this).template(Es.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;wr(s,this._state,e,this.authorization).then(n=>at(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},at(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Be(this.src,this.authorization).then(e=>{this._state=e,at(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Be(this.src,this.authorization).then(s=>{this._state=s,at(s,this)});break;case"new":r&&(this._state={},at({},this));break}}};ws.observedAttributes=["src","new","action"];ws.template=D`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Be(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function at(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function wr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const Er=class xs extends ne{constructor(t,e){super(e,t,xs.EVENT_TYPE,!1)}};Er.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,le=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),qe=new WeakMap;let Ss=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(le&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&qe.set(e,t))}return t}toString(){return this.cssText}};const xr=i=>new Ss(typeof i=="string"?i:i+"",void 0,ce),Sr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Ss(e,i,ce)},kr=(i,t)=>{if(le)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Pt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Fe=le?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return xr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Pr,defineProperty:Cr,getOwnPropertyDescriptor:Or,getOwnPropertyNames:Tr,getOwnPropertySymbols:Rr,getPrototypeOf:Nr}=Object,Q=globalThis,Ve=Q.trustedTypes,Ir=Ve?Ve.emptyScript:"",We=Q.reactiveElementPolyfillSupport,dt=(i,t)=>i,Tt={toAttribute(i,t){switch(t){case Boolean:i=i?Ir:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},he=(i,t)=>!Pr(i,t),Ye={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:he};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ye){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Cr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Or(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s?.call(this)},set(o){const l=s?.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ye}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Nr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,r=[...Tr(e),...Rr(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Fe(s))}else t!==void 0&&e.push(Fe(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return kr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Tt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Tt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??he)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[dt("elementProperties")]=new Map,K[dt("finalized")]=new Map,We?.({ReactiveElement:K}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,Nt=Rt.trustedTypes,Ke=Nt?Nt.createPolicy("lit-html",{createHTML:i=>i}):void 0,ks="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,Ps="?"+N,Ur=`<${Ps}>`,B=document,mt=()=>B.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",ue=Array.isArray,Mr=i=>ue(i)||typeof i?.[Symbol.iterator]=="function",Gt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ze=/>/g,j=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Qe=/"/g,Cs=/^(?:script|style|textarea|title)$/i,jr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ct=jr(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Xe=new WeakMap,z=B.createTreeWalker(B,129);function Os(i,t){if(!ue(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(t):t}const Lr=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===lt?f[1]==="!--"?o=Je:f[1]!==void 0?o=Ze:f[2]!==void 0?(Cs.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=s??lt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?j:f[3]==='"'?Qe:Ge):o===Qe||o===Ge?o=j:o===Je||o===Ze?o=lt:(o=j,s=void 0);const h=o===j&&i[l+1].startsWith("/>")?" ":"";n+=o===lt?a+Ur:u>=0?(r.push(d),a.slice(0,u)+ks+a.slice(u)+N+h):a+N+(u===-2?l:h)}return[Os(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let se=class Ts{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Lr(t,e);if(this.el=Ts.createElement(d,r),z.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=z.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(ks)){const c=f[o++],h=s.getAttribute(u).split(N),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Hr:p[1]==="?"?Dr:p[1]==="@"?Br:Bt}),s.removeAttribute(u)}else u.startsWith(N)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Cs.test(s.tagName)){const u=s.textContent.split(N),c=u.length-1;if(c>0){s.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],mt()),z.nextNode(),a.push({type:2,index:++n});s.append(u[c],mt())}}}else if(s.nodeType===8)if(s.data===Ps)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(N,u+1))!==-1;)a.push({type:7,index:n}),u+=N.length-1}n++}}static createElement(t,e){const r=B.createElement("template");return r.innerHTML=t,r}};function tt(i,t,e=i,r){var s,n;if(t===X)return t;let o=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=gt(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=o:e.l=o),o!==void 0&&(t=tt(i,o._$AS(i,t.values),o,r)),t}class zr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??B).importNode(e,!0);z.currentNode=s;let n=z.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new qr(n,this,t)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=z.nextNode(),o++)}return z.currentNode=B,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Mr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=se.createElement(Os(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new zr(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=Xe.get(t.strings);return e===void 0&&Xe.set(t.strings,e=new se(t)),e}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new wt(this.O(mt()),this.O(mt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[r+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Hr extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Dr extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Br extends Bt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class qr{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ts=Rt.litHtmlPolyfillSupport;ts?.(se,wt),(Rt.litHtmlVersions??(Rt.litHtmlVersions=[])).push("3.2.0");const Fr=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new wt(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Z=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Fr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};Z._$litElement$=!0,Z.finalized=!0,(Le=globalThis.litElementHydrateSupport)==null||Le.call(globalThis,{LitElement:Z});const es=globalThis.litElementPolyfillSupport;es?.({LitElement:Z});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vr={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:he},Wr=(i=Vr,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function Rs(i){return(t,e)=>typeof e=="object"?Wr(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ns(i){return Rs({...i,state:!0,attribute:!1})}function Yr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Kr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Is={};(function(i){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,v,Vt){var E=v.length-1;switch(m){case 1:return new g.Root({},[v[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[E-1],v[E]]);break;case 4:case 5:this.$=v[E];break;case 6:this.$=new g.Literal({value:v[E]});break;case 7:this.$=new g.Splat({name:v[E]});break;case 8:this.$=new g.Param({name:v[E]});break;case 9:this.$=new g.Optional({},[v[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],v=this.table,Vt="",E=0,Ue=0,Qs=2,Me=1,Xs=m.slice.call(arguments,1),_=Object.create(this.lexer),U={yy:{}};for(var Wt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Wt)&&(U.yy[Wt]=this.yy[Wt]);_.setInput(c,U.yy),U.yy.lexer=_,U.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Yt=_.yylloc;m.push(Yt);var tr=_.options&&_.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var er=function(){var V;return V=_.lex()||Me,typeof V!="number"&&(V=h.symbols_[V]||V),V},w,M,S,Kt,F={},St,T,je,kt;;){if(M=p[p.length-1],this.defaultActions[M]?S=this.defaultActions[M]:((w===null||typeof w>"u")&&(w=er()),S=v[M]&&v[M][w]),typeof S>"u"||!S.length||!S[0]){var Jt="";kt=[];for(St in v[M])this.terminals_[St]&&St>Qs&&kt.push("'"+this.terminals_[St]+"'");_.showPosition?Jt="Parse error on line "+(E+1)+`:
`+_.showPosition()+`
Expecting `+kt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Jt="Parse error on line "+(E+1)+": Unexpected "+(w==Me?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Jt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Yt,expected:kt})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+w);switch(S[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(S[1]),w=null,Ue=_.yyleng,Vt=_.yytext,E=_.yylineno,Yt=_.yylloc;break;case 2:if(T=this.productions_[S[1]][1],F.$=g[g.length-T],F._$={first_line:m[m.length-(T||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(T||1)].first_column,last_column:m[m.length-1].last_column},tr&&(F._$.range=[m[m.length-(T||1)].range[0],m[m.length-1].range[1]]),Kt=this.performAction.apply(F,[Vt,Ue,E,U.yy,S[1],g,m].concat(Xs)),typeof Kt<"u")return Kt;T&&(p=p.slice(0,-1*T*2),g=g.slice(0,-1*T),m=m.slice(0,-1*T)),p.push(this.productions_[S[1]][0]),g.push(F.$),m.push(F._$),je=v[p[p.length-2]][p[p.length-1]],p.push(je);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Kr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Is);function Y(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Us={Root:Y("Root"),Concat:Y("Concat"),Literal:Y("Literal"),Splat:Y("Splat"),Param:Y("Param"),Optional:Y("Optional")},Ms=Is.parser;Ms.yy=Us;var Jr=Ms,Zr=Object.keys(Us);function Gr(i){return Zr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var js=Gr,Qr=js,Xr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ls(i){this.captures=i.captures,this.re=i.re}Ls.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var ti=Qr({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Xr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ls({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ei=ti,si=js,ri=si({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),ii=ri,ni=Jr,oi=ei,ai=ii;Et.prototype=Object.create(null);Et.prototype.match=function(i){var t=oi.visit(this.ast),e=t.match(i);return e||!1};Et.prototype.reverse=function(i){return ai.visit(this.ast,i)};function Et(i){var t;if(this?t=this:t=Object.create(Et.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ni.parse(i),t}var li=Et,ci=li,hi=ci;const ui=Yr(hi);var di=Object.defineProperty,zs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&di(t,e,s),s};const Hs=class extends Z{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ct` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new ui(s.path)})),this._historyObserver=new C(this,e),this._authObserver=new C(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ct` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(_s(this,"auth/redirect"),ct` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ct` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ct` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){ae(this,"history/redirect",{href:t})}};Hs.styles=Sr`
    :host,
    main {
      display: contents;
    }
  `;let It=Hs;zs([Ns()],It.prototype,"_user");zs([Ns()],It.prototype,"_match");const pi=Object.freeze(Object.defineProperty({__proto__:null,Element:It,Switch:It},Symbol.toStringTag,{value:"Module"})),fi=class Ds extends HTMLElement{constructor(){if(super(),Dt(this).template(Ds.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};fi.template=D`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Bs=class re extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(re.template).styles(re.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(qs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?Ot(t,"input-array:add"):ee(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],mi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};Bs.template=D`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Bs.styles=$s`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function mi(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(qs(e)))}function qs(i,t){const e=i===void 0?D`<input />`:D`<input value="${i}" />`;return D`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function gi(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var yi=Object.defineProperty,vi=Object.getOwnPropertyDescriptor,_i=(i,t,e,r)=>{for(var s=vi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&yi(t,e,s),s};class $i extends Z{constructor(t){super(),this._pending=[],this._observer=new C(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}_i([Rs()],$i.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,de=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),ss=new WeakMap;let Fs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ss.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ss.set(e,t))}return t}toString(){return this.cssText}};const bi=i=>new Fs(typeof i=="string"?i:i+"",void 0,pe),R=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1]),i[0]);return new Fs(e,i,pe)},Ai=(i,t)=>{if(de)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const r=document.createElement("style"),s=Ct.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},rs=de?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return bi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:wi,defineProperty:Ei,getOwnPropertyDescriptor:xi,getOwnPropertyNames:Si,getOwnPropertySymbols:ki,getPrototypeOf:Pi}=Object,qt=globalThis,is=qt.trustedTypes,Ci=is?is.emptyScript:"",Oi=qt.reactiveElementPolyfillSupport,pt=(i,t)=>i,Ut={toAttribute(i,t){switch(t){case Boolean:i=i?Ci:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},fe=(i,t)=>!wi(i,t),ns={attribute:!0,type:String,converter:Ut,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??=Symbol("metadata"),qt.litPropertyMetadata??=new WeakMap;let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ns){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ei(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=xi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ns}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,r=[...Si(e),...ki(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(rs(s))}else t!==void 0&&e.push(rs(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(r.converter?.toAttribute!==void 0?r.converter:Ut).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ut;this._$Em=s;const l=o.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){const s=this.constructor,n=this[t];if(r??=s.getPropertyOptions(t),!((r.hasChanged??fe)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[pt("elementProperties")]=new Map,J[pt("finalized")]=new Map,Oi?.({ReactiveElement:J}),(qt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,Mt=me.trustedTypes,os=Mt?Mt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Vs="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,Ws="?"+I,Ti=`<${Ws}>`,q=document,yt=()=>q.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",ge=Array.isArray,Ri=i=>ge(i)||typeof i?.[Symbol.iterator]=="function",Qt=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,as=/-->/g,ls=/>/g,L=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cs=/'/g,hs=/"/g,Ys=/^(?:script|style|textarea|title)$/i,Ni=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=Ni(1),et=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),us=new WeakMap,H=q.createTreeWalker(q,129);function Ks(i,t){if(!ge(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return os!==void 0?os.createHTML(t):t}const Ii=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ht;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ht?f[1]==="!--"?o=as:f[1]!==void 0?o=ls:f[2]!==void 0?(Ys.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=s??ht,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?hs:cs):o===hs||o===cs?o=L:o===as||o===ls?o=ht:(o=L,s=void 0);const h=o===L&&i[l+1].startsWith("/>")?" ":"";n+=o===ht?a+Ti:u>=0?(r.push(d),a.slice(0,u)+Vs+a.slice(u)+I+h):a+I+(u===-2?l:h)}return[Ks(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class _t{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ii(t,e);if(this.el=_t.createElement(d,r),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Vs)){const c=f[o++],h=s.getAttribute(u).split(I),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Mi:p[1]==="?"?ji:p[1]==="@"?Li:Ft}),s.removeAttribute(u)}else u.startsWith(I)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Ys.test(s.tagName)){const u=s.textContent.split(I),c=u.length-1;if(c>0){s.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],yt()),H.nextNode(),a.push({type:2,index:++n});s.append(u[c],yt())}}}else if(s.nodeType===8)if(s.data===Ws)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(I,u+1))!==-1;)a.push({type:7,index:n}),u+=I.length-1}n++}}static createElement(t,e){const r=q.createElement("template");return r.innerHTML=t,r}}function st(i,t,e=i,r){if(t===et)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=st(i,s._$AS(i,t.values),s,r)),t}class Ui{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??q).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new xt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new zi(n,this,t)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=H.nextNode(),o++)}return H.currentNode=q,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class xt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ri(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=_t.createElement(Ks(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const n=new Ui(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=us.get(t.strings);return e===void 0&&us.set(t.strings,e=new _t(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new xt(this.O(yt()),this.O(yt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[r+a],e,a),d===et&&(d=this._$AH[a]),o||=!vt(d)||d!==this._$AH[a],d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mi extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class ji extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Li extends Ft{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??b)===et)return;const r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class zi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Hi=me.litHtmlPolyfillSupport;Hi?.(_t,xt),(me.litHtmlVersions??=[]).push("3.3.1");const Di=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new xt(t.insertBefore(yt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ye=globalThis;class A extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Di(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}}A._$litElement$=!0,A.finalized=!0,ye.litElementHydrateSupport?.({LitElement:A});const Bi=ye.litElementPolyfillSupport;Bi?.({LitElement:A});(ye.litElementVersions??=[]).push("4.2.1");const qi=R`
    * {
        margin: 0;
        box-sizing: border-box;
    }
    body {
        line-height: 1.5;
    }
    img {
        max-width: 100%;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    a {
        text-decoration: none;
    }
`,k={styles:qi};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:fe},Vi=(i=Fi,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function x(i){return(t,e)=>typeof e=="object"?Vi(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function O(i){return x({...i,state:!0,attribute:!1})}const Wi=R`
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
`,P={styles:Wi};var Yi=Object.defineProperty,ve=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Yi(t,e,s),s};const we=class we extends A{constructor(){super(...arguments),this.cards=[],this._authObserver=new C(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}checkSrc(t){t.includes("teams")&&(this.dataType="teams"),t.includes("roster")&&(this.dataType="roster")}hydrate(t){this.checkSrc(t);const e=`${t}?email=${this._user?.username}`;fetch(e,{headers:this.authorization}).then(r=>r.json()).then(r=>{r&&(this.dataType==="teams"?this.cards=r:this.dataType==="roster"&&(this.cards=r))}).catch(r=>console.error(r))}renderCardGrid(){return this.dataType==="teams"?this.cards.map(t=>y`
                    <a href="/app/team/${t.teamId}">
                        <h2>${t.teamName}</h2>
                    </a>
                `):this.cards.map(t=>y`
                    <a href="/app/player/${t.playerId}">
                        <h3>${t.playerName}</h3>
                    </a>
                `)}render(){return y`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `}};we.styles=[k.styles,P.styles,R`
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
        `];let rt=we;ve([x()],rt.prototype,"src");ve([x()],rt.prototype,"dataType");ve([O()],rt.prototype,"cards");var Ki=Object.defineProperty,Js=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ki(t,e,s),s};const Ee=class Ee extends A{constructor(){super(...arguments),this._authObserver=new C(this,"stats:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userId=e.username):(this.loggedIn=!1,this.userId=void 0)})}renderSignOutButton(){return y`
            <button
                @click=${t=>{gr.relay(t,"auth:message",["auth/signout"])}}
            >
                Sign Out
            </button>
        `}renderSignInButton(){return y`
        <a href="/login.html">
            Sign In…
        </a>
    `}render(){return y`
        <section class="header">
            <span>
                <a href="/">
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
        `}};Ee.styles=[k.styles,P.styles,R`
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
        `];let $t=Ee;Js([O()],$t.prototype,"loggedIn");Js([O()],$t.prototype,"userId");const xe=class xe extends A{render(){return y`
            <div class="subheader">
                <h1>My Teams</h1>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <card-grid src="/api/teams"></card-grid>
        `}};xe.styles=[k.styles,P.styles];let ie=xe;var Ji=Object.defineProperty,Zi=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ji(t,e,s),s};const Se=class Se extends A{render(){return y`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    SLO Motion
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <team-info src="/api/teams/${this.teamId}"></team-info>
            <div class="subheader">
                    <h2>Team Access</h2>
                </div>
            <div class="grid">
                <a href="/app/team/${this.teamId}/roster">
                    <h2>Team Roster</h2>
                </a>
                <a href="/app/team/${this.teamId}/stats">
                    <h2>Team Stats</h2>
                </a>
                <a href="/app/team/${this.teamId}/schedule">
                    <h2>Team Schedule</h2>
                </a>
            </div>
        `}};Se.styles=[k.styles,P.styles];let jt=Se;Zi([x()],jt.prototype,"teamId");const Gi=R`
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
`,_e={styles:Gi};var Qi=Object.defineProperty,$e=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Qi(t,e,s),s};const ke=class ke extends A{constructor(){super(...arguments),this._authObserver=new C(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e)return this.team=e,fetch(`/api/teams/${this.team.teamId}/roster`,{headers:this.authorization})}).then(e=>e?.json()).then(e=>{e&&(this.numPlayers=e.length)}).catch(e=>console.error("Hydrate failed:",e))}render(){return y`
        <section class="teamInfo">
            <p>Team Name: ${this.team?.teamName}</p>
            <p>Division: College</p>
            <p>Number of Players: ${this.numPlayers}</p>
        </section>
        `}};ke.styles=[k.styles,P.styles,_e.styles,R`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }
        `];let it=ke;$e([x()],it.prototype,"src");$e([O()],it.prototype,"team");$e([O()],it.prototype,"numPlayers");var Xi=Object.defineProperty,Zs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Xi(t,e,s),s};const Pe=class Pe extends A{constructor(){super(...arguments),this._authObserver=new C(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.total=e)}).catch(e=>console.error("Failed to hydrate total stat block:",e))}renderTotalStatBlock(){return y`
            <div class="stat-row">
                <dt>${this.total?.totalScores}</dt>
                <dd>${this.total?.totalBlocks}</dd>
                <dd>${this.total?.totalDrops}</dd>
                <dd>${this.total?.totalIncompletions}</dd>
            </div>
        `}render(){return y`
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
        `}};Pe.styles=[k.styles,P.styles,_e.styles,R`
        `];let bt=Pe;Zs([x()],bt.prototype,"src");Zs([O()],bt.prototype,"total");var tn=Object.defineProperty,en=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&tn(t,e,s),s};const Ce=class Ce extends A{render(){return y`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    SLO Motion Roster
                </h2>
            </div>
            <card-grid src="/api/teams/${this.teamId}/roster"></card-grid>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
        `}};Ce.styles=[k.styles,P.styles];let Lt=Ce;en([x()],Lt.prototype,"teamId");var sn=Object.defineProperty,rn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&sn(t,e,s),s};const Oe=class Oe extends A{render(){return y`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Team Stats
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <total-stat-block src="/api/teams/${this.teamId}/totalStats"/></total-stat-block>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Player Stats
                </h2>
            </div>
            <stat-table src="/api/teams/${this.teamId}/stats"></stat-table>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
        `}};Oe.styles=[k.styles,P.styles];let zt=Oe;rn([x()],zt.prototype,"teamId");var nn=Object.defineProperty,be=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&nn(t,e,s),s};const Te=class Te extends A{constructor(){super(...arguments),this.stats=[],this.statRows={},this._authObserver=new C(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}async getPlayerName(t){return await fetch(`/api/players/${t}`,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e)return e.playerName;throw console.log("Player not found"),new Error("Player not found")})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e){this.stats=e;const r=Array.from(new Set(this.stats.map(n=>n.playerId).filter(n=>n!=null)));console.log(r);const s=r.map(n=>this.getPlayerName(n).then(o=>({playerId:n,name:o})).catch(o=>(console.error(`Failed to fetch player ${n}:`,o),{playerId:n,name:"Unknown"})));return Promise.all(s)}}).then(e=>{e&&(e.forEach(({playerId:r,name:s})=>{console.log(s),this.statRows[r]||(this.statRows[r]={name:s,scores:0,blocks:0,drops:0,incompletions:0})}),this.stats.forEach(r=>{const s=this.statRows[r.playerId];if(s)switch(r.statType){case"score":s.scores+=1;break;case"block":s.blocks+=1;break;case"drop":s.drops+=1;break;case"incompletion":s.incompletions+=1;break}}),this.requestUpdate())}).catch(e=>console.error("Failed to hydrate stats:",e))}renderStatRows(){const t=Object.values(this.statRows);return t.length?t.map(e=>y`
            <div class="stat-row">
                <dt>${e.name}</dt>
                <dd>${e.scores}</dd>
                <dd>${e.blocks}</dd>
                <dd>${e.drops}</dd>
                <dd>${e.incompletions}</dd>
            </div>
        `):y`<h2>No stats to report yet...</h2>`}render(){return y`
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
        `}};Te.styles=[k.styles,P.styles,_e.styles,R`
        `];let nt=Te;be([x()],nt.prototype,"src");be([O()],nt.prototype,"stats");be([O()],nt.prototype,"statRows");var on=Object.defineProperty,an=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&on(t,e,s),s};const Re=class Re extends A{render(){return y`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                SLO Motion Schedule
            </h2>
        </div>
        <schedule-table src="/api/teams/${this.teamId}/schedule"></schedule-table>
        <a href="/app/team/${this.teamId}">
            <h3>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-team" />
                </svg>
                Back to Team
            </h3>
        </a>
        `}};Re.styles=[k.styles,P.styles];let Ht=Re;an([x()],Ht.prototype,"teamId");var ln=Object.defineProperty,Gs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ln(t,e,s),s};const Ne=class Ne extends A{constructor(){super(...arguments),this._authObserver=new C(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.games=e)}).catch(e=>console.error("Hydrate failed:",e))}renderGames(){return this.games?this.games.map(t=>y`
                    <div class="game-row">
                        <dt>
                            <a href="/app/game/${t.gameId}">
                                ${t.title}
                            </a>
                        </dt>
                        <dd>${t.location}</dd>
                        <dd>${t.date}</dd>
                        <dd>
                            <a class="stat-button" href="/app/team/${t.teamId}/schedule/${t.gameId}">
                                <svg class="icon">
                                    <use href="/icons/base.svg#icon-stats" />
                                </svg>
                            </a>
                        </dd>
                    </div>
                `):y`
                <h2>No games yet...</h2>
            `}render(){return y`
            <section class="grid-header">
                <h3>Title</h3>
                <h3>Location</h3>
                <h3>Date</h3>
                <h3>Stats</h3>
            </section>
            <section class="grid-body">
                <dl>
                    ${this.renderGames()}
                </dl>
            </section>
        `}};Ne.styles=[k.styles,P.styles,R`
        .grid-header {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--margin);
            text-align: center;
            background-color: var(--color-background-header);
            color: var(--color-header);
            margin-top: var(--margin);
        }

        .grid-body {
            background-color: var(--color-grid)
        }

        .game-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr); /* 5 columns */
            text-align: center;
            border-bottom: 1px solid var(--color-accent);
            padding: var(--padding);
            margin: 0px;
            transition: background-color 0.3s ease;

            > dt {
                font-weight: bold;
            }
        }

        .game-row:hover {
            background-color: var(--color-hover);
        }

        .stat-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem;
            border-radius: 8px;
            cursor: pointer;
            transition: 
                background-color 0.2s ease,
                transform 0.15s ease,
                box-shadow 0.2s ease;
        }


        /* Hover: brighter, raised, larger */
        .stat-button:hover {
            background-color: rgba(0, 0, 0, 0.08);
            transform: scale(1.12);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        /* Click: subtle press-down */
        .stat-button:active {
            transform: scale(1.05);
            background-color: rgba(0, 0, 0, 0.15);
        }
        `];let At=Ne;Gs([x()],At.prototype,"src");Gs([O()],At.prototype,"games");var cn=Object.defineProperty,Ae=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&cn(t,e,s),s};const Ie=class Ie extends A{render(){return y`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                ${this.game?.title}
            </h2>
        </div>
        <stat-table src="/api/games/${this.gameId}/stats"></stat-table>
        <a href="/app/team/${this.teamId}">
            <h3>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-team" />
                </svg>
                Back to Team
            </h3>
        </a>
        `}};Ie.styles=[k.styles,P.styles];let ot=Ie;Ae([x()],ot.prototype,"gameId");Ae([x()],ot.prototype,"teamId");Ae([O()],ot.prototype,"game");const hn=[{path:"/app/team/:teamId",view:i=>y`
            <team-view .teamId=${Number(i.teamId)}></team-view>
        `},{path:"/app/team/:teamId/roster",view:i=>y`
            <roster-view .teamId=${Number(i.teamId)}></roster-view>
        `},{path:"/app/team/:teamId/stats",view:i=>y`
            <stats-view .teamId=${Number(i.teamId)}></stats-view>
        `},{path:"/app/team/:teamId/schedule",view:i=>y`
            <schedule-view .teamId=${Number(i.teamId)}></schedule-view>
        `},{path:"/app/team/:teamId/schedule/:gameId",view:i=>y`
            <game-view .teamId=${Number(i.teamId)} .gameId=${Number(i.gameId)}></game-view>
        `},{path:"/app",view:()=>y`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];gi({"mu-auth":mr.Provider,"mu-history":Ar.Provider,"page-header":$t,"home-view":ie,"team-view":jt,"roster-view":Lt,"stats-view":zt,"game-view":ot,"schedule-view":Ht,"card-grid":rt,"team-info":it,"total-stat-block":bt,"stat-table":nt,"schedule-table":At,"mu-switch":class extends pi.Element{constructor(){super(hn,"stats:history","stats:auth")}}});
