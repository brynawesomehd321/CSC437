(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var X,es;class _t extends Error{}_t.prototype.name="InvalidTokenError";function br(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function wr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return br(t)}catch{return atob(t)}}function Cs(i,t){if(typeof i!="string")throw new _t("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new _t(`Invalid token specified: missing part #${e+1}`);let r;try{r=wr(s)}catch(n){throw new _t(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new _t(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ar="mu:context",he=`${Ar}:change`;class Er{constructor(t,e){this._proxy=Sr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ge extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Er(t,this),this.style.display="contents"}attach(t){return this.addEventListener(he,t),t}detach(t){this.removeEventListener(he,t)}}function Sr(i,t){return new Proxy(i,{get:(s,r,n)=>r==="then"?void 0:Reflect.get(s,r,n),set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(he,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function xr(i,t){const e=ks(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ks(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ks(i,r.host)}class Pr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ns(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Pr(e,i))}class ye{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const ue="mu:auth:jwt",Is=class Ts extends ye{constructor(t,e){super((s,r)=>this.update(s,r),t,Ts.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:n}=t[1];return[Cr(r),ae(n)]}case"auth/signout":return[kr(e.user),ae(this._redirectForLogin)];case"auth/redirect":return[e,ae(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};Is.EVENT_TYPE="auth:message";let Rs=Is;const js=Ns(Rs.EVENT_TYPE);function ae(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,n=new URL(i,r);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",i),window.location.assign(n)}e([])})}class Or extends ge{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=it.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Rs(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ue),t}}class it extends rt{constructor(t){super();const e=Cs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new it(t);return localStorage.setItem(ue,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ue);return t?it.authenticate(t):new rt}}function Cr(i){return{user:it.authenticate(i),token:i}}function kr(i){return{user:i&&i.authenticated?rt.deauthenticate(i):i,token:""}}function Nr(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Ir(i){return i.authenticated?Cs(i.token||""):{}}const k=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:it,Provider:Or,User:rt,dispatch:js,headers:Nr,payload:Ir},Symbol.toStringTag,{value:"Module"}));function Ms(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function Dt(i,t,e){const s=i.target;Ms(s,t,e)}function de(i,t="*"){return i.composedPath().find(r=>{const n=r;return n.tagName&&n.matches(t)})||void 0}const Tr=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:Ms,originalTarget:de,relay:Dt},Symbol.toStringTag,{value:"Module"}));function ve(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Rr=new DOMParser;function W(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=Rr.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ss(a);case"bigint":case"boolean":case"number":case"symbol":return ss(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ss(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Kt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}X=class extends HTMLElement{constructor(){super(),this._state={},Kt(this).template(X.template).styles(X.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Dt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},jr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},X.template=W`
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
  `,X.styles=ve`
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
  `;function jr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":r instanceof Date?o.value=r.toISOString().substr(0,10):o.value=r;break;default:o.value=r;break}}}return i}const Us=class Ls extends ye{constructor(t){super((e,s)=>this.update(e,s),t,Ls.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return Ur(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return Lr(s,r)}}}};Us.EVENT_TYPE="history:message";let _e=Us;class rs extends ge{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Mr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),$e(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new _e(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function Mr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Ur(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function Lr(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const $e=Ns(_e.EVENT_TYPE),Dr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:rs,Provider:rs,Service:_e,dispatch:$e},Symbol.toStringTag,{value:"Module"}));class R{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new is(this._provider,t);this._effects.push(r),e(r)}else xr(this._target,this._contextLabel).then(r=>{const n=new is(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class is{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ds=class zs extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new R(this,"blazing:auth"),Kt(this).template(zs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;zr(r,this._state,e,this.authorization).then(n=>mt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},mt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ns(this.src,this.authorization).then(e=>{this._state=e,mt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ns(this.src,this.authorization).then(r=>{this._state=r,mt(r,this)});break;case"new":s&&(this._state={},mt({},this));break}}};Ds.observedAttributes=["src","new","action"];Ds.template=W`
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
  `;function ns(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function mt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function zr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Hs=class qs extends ye{constructor(t,e){super(e,t,qs.EVENT_TYPE,!1)}};Hs.EVENT_TYPE="mu:message";let Bs=Hs;class Hr extends ge{constructor(t,e,s){super(e),this._user=new rt,this._updateFn=t,this._authObserver=new R(this,s)}connectedCallback(){const t=new Bs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const qr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Hr,Service:Bs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,be=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),os=new WeakMap;let Fs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(be&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=os.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&os.set(e,t))}return t}toString(){return this.cssText}};const Br=i=>new Fs(typeof i=="string"?i:i+"",void 0,we),Fr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Fs(e,i,we)},Wr=(i,t)=>{if(be)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ut.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},as=be?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Br(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Jr,defineProperty:Yr,getOwnPropertyDescriptor:Gr,getOwnPropertyNames:Kr,getOwnPropertySymbols:Zr,getPrototypeOf:Qr}=Object,nt=globalThis,ls=nt.trustedTypes,Xr=ls?ls.emptyScript:"",cs=nt.reactiveElementPolyfillSupport,$t=(i,t)=>i,zt={toAttribute(i,t){switch(t){case Boolean:i=i?Xr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ae=(i,t)=>!Jr(i,t),hs={attribute:!0,type:String,converter:zt,reflect:!1,useDefault:!1,hasChanged:Ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),nt.litPropertyMetadata??(nt.litPropertyMetadata=new WeakMap);let tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=hs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Yr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Gr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??hs}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;const t=Qr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){const e=this.properties,s=[...Kr(e),...Zr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(as(r))}else t!==void 0&&e.push(as(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Wr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:zt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s,r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:zt;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((r=this._$Ej)==null?void 0:r.get(o))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??Ae)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[$t("elementProperties")]=new Map,tt[$t("finalized")]=new Map,cs?.({ReactiveElement:tt}),(nt.reactiveElementVersions??(nt.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ht=globalThis,qt=Ht.trustedTypes,us=qt?qt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ws="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,Js="?"+j,Vr=`<${Js}>`,J=document,wt=()=>J.createComment(""),At=i=>i===null||typeof i!="object"&&typeof i!="function",Ee=Array.isArray,ti=i=>Ee(i)||typeof i?.[Symbol.iterator]=="function",le=`[ 	
\f\r]`,gt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ds=/-->/g,ps=/>/g,H=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fs=/'/g,ms=/"/g,Ys=/^(?:script|style|textarea|title)$/i,ei=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),yt=ei(1),ot=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),gs=new WeakMap,B=J.createTreeWalker(J,129);function Gs(i,t){if(!Ee(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return us!==void 0?us.createHTML(t):t}const si=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=gt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===gt?f[1]==="!--"?o=ds:f[1]!==void 0?o=ps:f[2]!==void 0?(Ys.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=H):f[3]!==void 0&&(o=H):o===H?f[0]===">"?(o=r??gt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?H:f[3]==='"'?ms:fs):o===ms||o===fs?o=H:o===ds||o===ps?o=gt:(o=H,r=void 0);const h=o===H&&i[l+1].startsWith("/>")?" ":"";n+=o===gt?a+Vr:u>=0?(s.push(d),a.slice(0,u)+Ws+a.slice(u)+j+h):a+j+(u===-2?l:h)}return[Gs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let pe=class Ks{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=si(t,e);if(this.el=Ks.createElement(d,s),B.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=B.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ws)){const c=f[o++],h=r.getAttribute(u).split(j),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ii:p[1]==="?"?ni:p[1]==="@"?oi:Zt}),r.removeAttribute(u)}else u.startsWith(j)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ys.test(r.tagName)){const u=r.textContent.split(j),c=u.length-1;if(c>0){r.textContent=qt?qt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],wt()),B.nextNode(),a.push({type:2,index:++n});r.append(u[c],wt())}}}else if(r.nodeType===8)if(r.data===Js)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(j,u+1))!==-1;)a.push({type:7,index:n}),u+=j.length-1}n++}}static createElement(t,e){const s=J.createElement("template");return s.innerHTML=t,s}};function at(i,t,e=i,s){var r,n;if(t===ot)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=At(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=at(i,o._$AS(i,t.values),o,s)),t}let ri=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??J).importNode(e,!0);B.currentNode=r;let n=B.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Se(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new ai(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=B.nextNode(),o++)}return B.currentNode=J,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Se=class Zs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),At(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ti(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(J.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=pe.createElement(Gs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new ri(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=gs.get(t.strings);return e===void 0&&gs.set(t.strings,e=new pe(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Zs(this.O(wt()),this.O(wt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Zt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=at(this,t,e,0),o=!At(t)||t!==this._$AH&&t!==ot,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=at(this,l[s+a],e,a),d===ot&&(d=this._$AH[a]),o||(o=!At(d)||d!==this._$AH[a]),d===w?t=w:t!==w&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ii=class extends Zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},ni=class extends Zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},oi=class extends Zt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??w)===ot)return;const s=this._$AH,r=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==w&&(s===w||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},ai=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}};const ys=Ht.litHtmlPolyfillSupport;ys?.(pe,Se),(Ht.litHtmlVersions??(Ht.litHtmlVersions=[])).push("3.3.0");const li=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new Se(t.insertBefore(wt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis;let st=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=li(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ot}};st._$litElement$=!0,st.finalized=!0,(es=Et.litElementHydrateSupport)==null||es.call(Et,{LitElement:st});const vs=Et.litElementPolyfillSupport;vs?.({LitElement:st});(Et.litElementVersions??(Et.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ci={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:Ae},hi=(i=ci,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Qs(i){return(t,e)=>typeof e=="object"?hi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Xs(i){return Qs({...i,state:!0,attribute:!1})}function ui(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function di(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Vs={};(function(i){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,y,g,v,se){var P=v.length-1;switch(g){case 1:return new y.Root({},[v[P-1]]);case 2:return new y.Root({},[new y.Literal({value:""})]);case 3:this.$=new y.Concat({},[v[P-1],v[P]]);break;case 4:case 5:this.$=v[P];break;case 6:this.$=new y.Literal({value:v[P]});break;case 7:this.$=new y.Splat({name:v[P]});break;case 8:this.$=new y.Param({name:v[P]});break;case 9:this.$=new y.Optional({},[v[P-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(y,g){this.message=y,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],y=[null],g=[],v=this.table,se="",P=0,Xe=0,yr=2,Ve=1,vr=g.slice.call(arguments,1),b=Object.create(this.lexer),D={yy:{}};for(var re in this.yy)Object.prototype.hasOwnProperty.call(this.yy,re)&&(D.yy[re]=this.yy[re]);b.setInput(c,D.yy),D.yy.lexer=b,D.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var ie=b.yylloc;g.push(ie);var _r=b.options&&b.options.ranges;typeof D.yy.parseError=="function"?this.parseError=D.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var $r=function(){var Q;return Q=b.lex()||Ve,typeof Q!="number"&&(Q=h.symbols_[Q]||Q),Q},x,z,C,ne,Z={},jt,T,ts,Mt;;){if(z=p[p.length-1],this.defaultActions[z]?C=this.defaultActions[z]:((x===null||typeof x>"u")&&(x=$r()),C=v[z]&&v[z][x]),typeof C>"u"||!C.length||!C[0]){var oe="";Mt=[];for(jt in v[z])this.terminals_[jt]&&jt>yr&&Mt.push("'"+this.terminals_[jt]+"'");b.showPosition?oe="Parse error on line "+(P+1)+`:
`+b.showPosition()+`
Expecting `+Mt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":oe="Parse error on line "+(P+1)+": Unexpected "+(x==Ve?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(oe,{text:b.match,token:this.terminals_[x]||x,line:b.yylineno,loc:ie,expected:Mt})}if(C[0]instanceof Array&&C.length>1)throw new Error("Parse Error: multiple actions possible at state: "+z+", token: "+x);switch(C[0]){case 1:p.push(x),y.push(b.yytext),g.push(b.yylloc),p.push(C[1]),x=null,Xe=b.yyleng,se=b.yytext,P=b.yylineno,ie=b.yylloc;break;case 2:if(T=this.productions_[C[1]][1],Z.$=y[y.length-T],Z._$={first_line:g[g.length-(T||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(T||1)].first_column,last_column:g[g.length-1].last_column},_r&&(Z._$.range=[g[g.length-(T||1)].range[0],g[g.length-1].range[1]]),ne=this.performAction.apply(Z,[se,Xe,P,D.yy,C[1],y,g].concat(vr)),typeof ne<"u")return ne;T&&(p=p.slice(0,-1*T*2),y=y.slice(0,-1*T),g=g.slice(0,-1*T)),p.push(this.productions_[C[1]][0]),y.push(Z.$),g.push(Z._$),ts=v[p[p.length-2]][p[p.length-1]],p.push(ts);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===y.length?this.yylloc.first_column:0)+y[y.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,y,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),y=c[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,y;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,y=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[y]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,y,g){switch(y){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof di<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Vs);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var tr={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},er=Vs.parser;er.yy=tr;var pi=er,fi=Object.keys(tr);function mi(i){return fi.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var sr=mi,gi=sr,yi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function rr(i){this.captures=i.captures,this.re=i.re}rr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var vi=gi({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(yi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new rr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),_i=vi,$i=sr,bi=$i({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),wi=bi,Ai=pi,Ei=_i,Si=wi;Nt.prototype=Object.create(null);Nt.prototype.match=function(i){var t=Ei.visit(this.ast),e=t.match(i);return e||!1};Nt.prototype.reverse=function(i){return Si.visit(this.ast,i)};function Nt(i){var t;if(this?t=this:t=Object.create(Nt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Ai.parse(i),t}var xi=Nt,Pi=xi,Oi=Pi;const Ci=ui(Oi);var ki=Object.defineProperty,ir=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ki(t,e,r),r};const nr=class extends st{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>yt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Ci(r.path)})),this._historyObserver=new R(this,e),this._authObserver=new R(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),yt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(js(this,"auth/redirect"),yt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):yt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),yt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){$e(this,"history/redirect",{href:t})}};nr.styles=Fr`
    :host,
    main {
      display: contents;
    }
  `;let Bt=nr;ir([Xs()],Bt.prototype,"_user");ir([Xs()],Bt.prototype,"_match");const Ni=Object.freeze(Object.defineProperty({__proto__:null,Element:Bt,Switch:Bt},Symbol.toStringTag,{value:"Module"})),or=class fe extends HTMLElement{constructor(){if(super(),Kt(this).template(fe.template).styles(fe.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};or.template=W` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;or.styles=ve`
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
  `;const ar=class me extends HTMLElement{constructor(){super(),this._array=[],Kt(this).template(me.template).styles(me.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(lr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{de(t,"button.add")?Dt(t,"input-array:add"):de(t,"button.remove")&&Dt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ii(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ar.template=W`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ar.styles=ve`
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
  `;function Ii(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(lr(e)))}function lr(i,t){const e=i===void 0?W`<input />`:W`<input value="${i}" />`;return W`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Ti(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ri=Object.defineProperty,ji=Object.getOwnPropertyDescriptor,Mi=(i,t,e,s)=>{for(var r=ji(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ri(t,e,r),r};class I extends st{constructor(t){super(),this._pending=[],this._observer=new R(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Mi([Qs()],I.prototype,"model");const Ui={};function Li(i,t,e){switch(console.log("authUser in update:",e),i[0]){case"user/request":{const[,s]=i,{email:r}=s;return t.user?.email===r?t:[{...t,user:{email:r}},Di(s,e).then(n=>["user/load",{user:n}])]}case"user/load":{const[,s]=i,{user:r}=s;return{...t,user:r}}case"user/teams/request":{const[,s]=i;return[t,zi(s,e).then(r=>["user/teams/load",{userTeams:r}])]}case"user/teams/load":{const[,s]=i,{userTeams:r}=s;return{...t,userTeams:r}}case"team/request":{const[,s]=i,{teamId:r}=s;return t.team?.teamId===r?t:[{...t,team:{teamId:r}},Hi(s,e).then(n=>["team/load",{team:n}])]}case"team/load":{const[,s]=i,{team:r}=s;return{...t,team:r}}case"team/roster/request":{const[,s]=i;return[t,qi(s,e).then(r=>["team/roster/load",{roster:r}])]}case"team/roster/load":{const[,s]=i,{roster:r}=s;return{...t,roster:r}}case"team/schedule/request":{const[,s]=i;return[t,Bi(s,e).then(r=>["team/schedule/load",{schedule:r}])]}case"team/schedule/load":{const[,s]=i,{schedule:r}=s;return{...t,schedule:r}}case"team/stats/request":{const[,s]=i;return[t,Fi(s,e).then(r=>["team/stats/load",{teamStats:r}])]}case"team/stats/load":{const[,s]=i,{teamStats:r}=s;return{...t,teamStats:r}}case"game/stats/request":{const[,s]=i;return[t,Wi(s,e).then(r=>["game/stats/load",{gameStats:r}])]}case"game/stats/load":{const[,s]=i,{gameStats:r}=s;return{...t,gameStats:r}}case"game/request":{const[,s]=i;return[t,Yi(s,e).then(r=>["game/load",{game:r}])]}case"game/load":{const[,s]=i,{game:r}=s;return{...t,game:r}}case"player/request":{const[,s]=i;return[t,Gi(s,e).then(r=>["player/load",{player:r}])]}case"player/load":{const[,s]=i,{player:r}=s;return{...t,player:r}}case"player/stats/request":{const[,s]=i;return[t,Ji(s,e).then(r=>["player/stats/load",{playerStats:r}])]}case"player/stats/load":{const[,s]=i,{playerStats:r}=s;return{...t,playerStats:r}}default:throw new Error('Unhandled Auth message"')}}function Di(i,t){return fetch(`/api/users/email/${i.email}`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function zi(i,t){return fetch(`/api/teams?email=${i.email}`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Hi(i,t){return fetch(`/api/teams/${i.teamId}`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function qi(i,t){return fetch(`/api/teams/${i.teamId}/roster`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Bi(i,t){return fetch(`/api/teams/${i.teamId}/schedule`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Fi(i,t){return fetch(`/api/teams/${i.teamId}/stats`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Wi(i,t){return fetch(`/api/games/${i.gameId}/stats`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Ji(i,t){return fetch(`/api/players/${i.playerId}/stats`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Yi(i,t){return fetch(`/api/games/${i.gameId}`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Gi(i,t){return fetch(`/api/players/${i.playerId}`,{headers:k.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt=globalThis,xe=Lt.ShadowRoot&&(Lt.ShadyCSS===void 0||Lt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),_s=new WeakMap;let cr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=_s.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&_s.set(e,t))}return t}toString(){return this.cssText}};const Ki=i=>new cr(typeof i=="string"?i:i+"",void 0,Pe),O=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1]),i[0]);return new cr(e,i,Pe)},Zi=(i,t)=>{if(xe)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Lt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},$s=xe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ki(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Qi,defineProperty:Xi,getOwnPropertyDescriptor:Vi,getOwnPropertyNames:tn,getOwnPropertySymbols:en,getPrototypeOf:sn}=Object,Qt=globalThis,bs=Qt.trustedTypes,rn=bs?bs.emptyScript:"",nn=Qt.reactiveElementPolyfillSupport,bt=(i,t)=>i,Ft={toAttribute(i,t){switch(t){case Boolean:i=i?rn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Oe=(i,t)=>!Qi(i,t),ws={attribute:!0,type:String,converter:Ft,reflect:!1,useDefault:!1,hasChanged:Oe};Symbol.metadata??=Symbol("metadata"),Qt.litPropertyMetadata??=new WeakMap;let et=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ws){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Xi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Vi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ws}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;const t=sn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){const e=this.properties,s=[...tn(e),...en(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift($s(r))}else t!==void 0&&e.push($s(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:Ft).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ft;this._$Em=r;const l=o.fromAttribute(e,n.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const r=this.constructor,n=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??Oe)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,n]of s){const{wrapped:o}=n,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};et.elementStyles=[],et.shadowRootOptions={mode:"open"},et[bt("elementProperties")]=new Map,et[bt("finalized")]=new Map,nn?.({ReactiveElement:et}),(Qt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ce=globalThis,Wt=Ce.trustedTypes,As=Wt?Wt.createPolicy("lit-html",{createHTML:i=>i}):void 0,hr="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+M,on=`<${ur}>`,Y=document,St=()=>Y.createComment(""),xt=i=>i===null||typeof i!="object"&&typeof i!="function",ke=Array.isArray,an=i=>ke(i)||typeof i?.[Symbol.iterator]=="function",ce=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Es=/-->/g,Ss=/>/g,q=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xs=/'/g,Ps=/"/g,dr=/^(?:script|style|textarea|title)$/i,ln=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=ln(1),lt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Os=new WeakMap,F=Y.createTreeWalker(Y,129);function pr(i,t){if(!ke(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return As!==void 0?As.createHTML(t):t}const cn=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=vt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===vt?f[1]==="!--"?o=Es:f[1]!==void 0?o=Ss:f[2]!==void 0?(dr.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=q):f[3]!==void 0&&(o=q):o===q?f[0]===">"?(o=r??vt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?q:f[3]==='"'?Ps:xs):o===Ps||o===xs?o=q:o===Es||o===Ss?o=vt:(o=q,r=void 0);const h=o===q&&i[l+1].startsWith("/>")?" ":"";n+=o===vt?a+on:u>=0?(s.push(d),a.slice(0,u)+hr+a.slice(u)+M+h):a+M+(u===-2?l:h)}return[pr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Pt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=cn(t,e);if(this.el=Pt.createElement(d,s),F.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=F.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(hr)){const c=f[o++],h=r.getAttribute(u).split(M),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?un:p[1]==="?"?dn:p[1]==="@"?pn:Xt}),r.removeAttribute(u)}else u.startsWith(M)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(dr.test(r.tagName)){const u=r.textContent.split(M),c=u.length-1;if(c>0){r.textContent=Wt?Wt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],St()),F.nextNode(),a.push({type:2,index:++n});r.append(u[c],St())}}}else if(r.nodeType===8)if(r.data===ur)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(M,u+1))!==-1;)a.push({type:7,index:n}),u+=M.length-1}n++}}static createElement(t,e){const s=Y.createElement("template");return s.innerHTML=t,s}}function ct(i,t,e=i,s){if(t===lt)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const n=xt(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=ct(i,r._$AS(i,t.values),r,s)),t}class hn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??Y).importNode(e,!0);F.currentNode=r;let n=F.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new It(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new fn(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=F.nextNode(),o++)}return F.currentNode=Y,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class It{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ct(this,t,e),xt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==lt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):an(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Y.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Pt.createElement(pr(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const n=new hn(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Os.get(t.strings);return e===void 0&&Os.set(t.strings,e=new Pt(t)),e}k(t){ke(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new It(this.O(St()),this.O(St()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Xt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=ct(this,t,e,0),o=!xt(t)||t!==this._$AH&&t!==lt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ct(this,l[s+a],e,a),d===lt&&(d=this._$AH[a]),o||=!xt(d)||d!==this._$AH[a],d===A?t=A:t!==A&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class un extends Xt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class dn extends Xt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class pn extends Xt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=ct(this,t,e,0)??A)===lt)return;const s=this._$AH,r=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==A&&(s===A||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class fn{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ct(this,t)}}const mn=Ce.litHtmlPolyfillSupport;mn?.(Pt,It),(Ce.litHtmlVersions??=[]).push("3.3.1");const gn=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new It(t.insertBefore(St(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis;class N extends et{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=gn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lt}}N._$litElement$=!0,N.finalized=!0,Ne.litElementHydrateSupport?.({LitElement:N});const yn=Ne.litElementPolyfillSupport;yn?.({LitElement:N});(Ne.litElementVersions??=[]).push("4.2.1");const vn=O`
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
`,E={styles:vn};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _n={attribute:!0,type:String,converter:Ft,reflect:!1,hasChanged:Oe},$n=(i=_n,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function _(i){return(t,e)=>typeof e=="object"?$n(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $(i){return _({...i,state:!0,attribute:!1})}const bn=O`
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
`,S={styles:bn};var wn=Object.defineProperty,Ie=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&wn(t,e,r),r};const Ue=class Ue extends N{constructor(){super(...arguments),this.cards=[]}renderCardGrid(){if(this.dataType==="teams")return!this.cards||this.cards.length===0?m`
                <h2>No teams yet!</h2>
            `:this.cards.map(t=>{if("teamName"in t)return m`
                        <a href="/app/team/${t.teamId}">
                            <h2>${t.teamName}</h2>
                        </a>
                    `});if(this.dataType==="roster")return!this.cards||this.cards.length===0?m`
                <h2>No players yet!</h2>
            `:this.cards.map(t=>{if("playerName"in t)return m`
                        <a href="/app/team/${this.teamId}/player/${t.playerId}">
                            <h3>${t.playerName}</h3>
                        </a>
                    `})}render(){return m`
        <section class="grid">
            ${this.renderCardGrid()}
        </section>
        `}};Ue.styles=[E.styles,S.styles,O`
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
        `];let ht=Ue;Ie([_({type:Array})],ht.prototype,"cards");Ie([_({attribute:"team-id"})],ht.prototype,"teamId");Ie([_()],ht.prototype,"dataType");var An=Object.defineProperty,En=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&An(t,e,r),r};const Le=class Le extends I{constructor(){super("stats:model"),this.loggedIn=!1,this._authObserver=new R(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user&&this._user.authenticated?(this.loggedIn=!0,this.dispatchMessage(["user/request",{email:this._user?.username}])):this.loggedIn=!1})}get user(){return this.model?.user}renderSignOutButton(){return m`
            <button
                @click=${t=>{Tr.relay(t,"auth:message",["auth/signout"])}}
            >
                Sign Out
            </button>
        `}renderSignInButton(){return m`
        <a href="/login.html">
            Sign In…
        </a>
    `}render(){return m`
        <section class="header">
            <span>
                <a href="/">
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-home" />
                    </svg>
                </a>
            </span>
            <h1>Stat Tracker</h1>
            <a class="user" slot="actuator" href=${this.user?.userid?`/app/${this.user?.userid}`:"/app"}>
                ${this.user?.email||"Guest"}
                ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
            </a>
        </section>
        `}};Le.styles=[E.styles,S.styles,O`
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
        `];let Jt=Le;En([$()],Jt.prototype,"loggedIn");var Sn=Object.defineProperty,xn=Object.getOwnPropertyDescriptor,Pn=(i,t,e,s)=>{for(var r=xn(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Sn(t,e,r),r};const De=class De extends I{constructor(){super("stats:model"),this._authObserver=new R(this,"stats:auth")}get teams(){return this.model.userTeams}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user&&this._user.authenticated&&this.dispatchMessage(["user/teams/request",{email:this._user?.username}])})}render(){return m`
            <div class="subheader">
                <h1>My Teams</h1>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <card-grid .cards=${this.teams} dataType="teams"></card-grid>
        `}};De.styles=[E.styles,S.styles];let Yt=De;Pn([$()],Yt.prototype,"teams");var On=Object.defineProperty,Cn=Object.getOwnPropertyDescriptor,Te=(i,t,e,s)=>{for(var r=s>1?void 0:s?Cn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&On(t,e,r),r};const ze=class ze extends I{get team(){return this.model.team}get rosterCount(){return this.model.roster?.length}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    ${this.team?.teamName}
                </h2>
                <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                    <input type="checkbox" autocomplete="off"/>
                    Dark mode
                </label>
            </div>
            <section class="teamInfo">
                <p>Team Name: ${this.team?.teamName}</p>
                <p>Division: College</p>
                <p>Number of Players: ${this.rosterCount}</p>
            </section>
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
        `}};ze.styles=[E.styles,S.styles,O`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }`];let ut=ze;Te([_({attribute:"team-id"})],ut.prototype,"teamId",2);Te([$()],ut.prototype,"team",1);Te([$()],ut.prototype,"rosterCount",1);const kn=O`
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
`,Vt={styles:kn};var Nn=Object.defineProperty,Re=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Nn(t,e,r),r};const He=class He extends N{constructor(){super(...arguments),this._authObserver=new R(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e)return this.team=e,fetch(`/api/teams/${this.team.teamId}/roster`,{headers:this.authorization})}).then(e=>e?.json()).then(e=>{e&&(this.numPlayers=e.length)}).catch(e=>console.error("Hydrate failed:",e))}render(){return m`
        <section class="teamInfo">
            <p>Team Name: ${this.team?.teamName}</p>
            <p>Division: College</p>
            <p>Number of Players: ${this.numPlayers}</p>
        </section>
        `}};He.styles=[E.styles,S.styles,Vt.styles,O`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }
        `];let dt=He;Re([_()],dt.prototype,"src");Re([$()],dt.prototype,"team");Re([$()],dt.prototype,"numPlayers");var In=Object.defineProperty,fr=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&In(t,e,r),r};const qe=class qe extends N{constructor(){super(...arguments),this._authObserver=new R(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.total=e)}).catch(e=>console.error("Failed to hydrate total stat block:",e))}renderTotalStatBlock(){return m`
            <div class="stat-row">
                <dt>${this.total?.totalScores}</dt>
                <dd>${this.total?.totalBlocks}</dd>
                <dd>${this.total?.totalDrops}</dd>
                <dd>${this.total?.totalIncompletions}</dd>
            </div>
        `}render(){return m`
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
        `}};qe.styles=[E.styles,S.styles,Vt.styles,O`
        `];let Ot=qe;fr([_()],Ot.prototype,"src");fr([$()],Ot.prototype,"total");var Tn=Object.defineProperty,Rn=Object.getOwnPropertyDescriptor,je=(i,t,e,s)=>{for(var r=s>1?void 0:s?Rn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Tn(t,e,r),r};const Be=class Be extends I{get roster(){return this.model.roster}get team(){return this.model.team}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    ${this.team?.teamName} Roster
                </h2>
            </div>
            <card-grid .cards=${this.roster} datatype="roster" team-id=${this.teamId}></card-grid>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
        `}};Be.styles=[E.styles,S.styles];let pt=Be;je([_({attribute:"team-id"})],pt.prototype,"teamId",2);je([$()],pt.prototype,"roster",1);je([$()],pt.prototype,"team",1);var jn=Object.defineProperty,Mn=Object.getOwnPropertyDescriptor,Me=(i,t,e,s)=>{for(var r=s>1?void 0:s?Mn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&jn(t,e,r),r};const Fe=class Fe extends I{get teamStats(){return this.model.teamStats??[]}get roster(){return this.model.roster??[]}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/stats/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}render(){return m`
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
            <stat-table .stats=${this.teamStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
        `}};Fe.styles=[E.styles,S.styles];let ft=Fe;Me([_({attribute:"team-id"})],ft.prototype,"teamId",2);Me([$()],ft.prototype,"teamStats",1);Me([$()],ft.prototype,"roster",1);var Un=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,te=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ln(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Un(t,e,r),r};const We=class We extends N{constructor(){super(...arguments),this.stats=[],this.players=[]}getPlayerName(t){const e=this.players.find(s=>s.playerId===t);return e?e.playerName:"Unknown"}get statRows(){const t={};for(const e of this.stats)switch(t[e.playerId]||(t[e.playerId]={name:this.getPlayerName(e.playerId)??"Unknown",scores:0,blocks:0,drops:0,incompletions:0}),e.statType){case"score":t[e.playerId].scores++;break;case"block":t[e.playerId].blocks++;break;case"drop":t[e.playerId].drops++;break;case"incompletion":t[e.playerId].incompletions++;break}return Object.values(t)}renderStatRows(){const t=Object.values(this.statRows);return t.length?t.map(e=>{const s=this.players.find(n=>n.playerName===e.name),r=s?s.playerId:null;return m`
            <div class="stat-row">
                <dt>
                    ${r?m`<a href="/app/team/${this.teamId}/player/${r}">${e.name}</a>`:e.name}
                </dt>
                <dd>${e.scores}</dd>
                <dd>${e.blocks}</dd>
                <dd>${e.drops}</dd>
                <dd>${e.incompletions}</dd>
            </div>
        `}):m`<h2>No stats to report yet...</h2>`}render(){return m`
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
        `}};We.styles=[E.styles,S.styles,Vt.styles,O`
        `];let G=We;te([_({type:Array})],G.prototype,"stats",2);te([_({type:Array})],G.prototype,"players",2);te([_({attribute:"team-id"})],G.prototype,"teamId",2);te([$()],G.prototype,"statRows",1);var Dn=Object.defineProperty,zn=Object.getOwnPropertyDescriptor,ee=(i,t,e,s)=>{for(var r=s>1?void 0:s?zn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Dn(t,e,r),r};const Je=class Je extends N{constructor(){super(...arguments),this.stats=[],this.games=[]}getGameName(t){const e=this.games.find(s=>s.gameId===t);return e?e.title:"Unknown"}get statRows(){const t={};for(const e of this.stats)switch(t[e.gameId]||(t[e.gameId]={name:this.getGameName(e.gameId)??"Unknown",scores:0,blocks:0,drops:0,incompletions:0}),e.statType){case"score":t[e.gameId].scores++;break;case"block":t[e.gameId].blocks++;break;case"drop":t[e.gameId].drops++;break;case"incompletion":t[e.gameId].incompletions++;break}return Object.values(t)}renderStatRows(){const t=Object.values(this.statRows);return t.length?t.map(e=>{const s=this.games.find(n=>n.title===e.name),r=s?s.gameId:null;return m`
            <div class="stat-row">
                <dt>
                    ${r?m`<a href="/app/team/${this.teamId}/schedule/${r}">${e.name}</a>`:e.name}
                </dt>
                <dd>${e.scores}</dd>
                <dd>${e.blocks}</dd>
                <dd>${e.drops}</dd>
                <dd>${e.incompletions}</dd>
            </div>
        `}):m`<h2>No stats to report yet...</h2>`}render(){return m`
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
        `}};Je.styles=[E.styles,S.styles,Vt.styles,O`
        `];let K=Je;ee([_({type:Array})],K.prototype,"stats",2);ee([_({type:Array})],K.prototype,"games",2);ee([_({attribute:"team-id"})],K.prototype,"teamId",2);ee([$()],K.prototype,"statRows",1);var Hn=Object.defineProperty,qn=Object.getOwnPropertyDescriptor,mr=(i,t,e,s)=>{for(var r=s>1?void 0:s?qn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Hn(t,e,r),r};const Ye=class Ye extends I{get schedule(){return this.model.schedule}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&this.dispatchMessage(["team/schedule/request",{teamId:Number(s)}])}render(){return m`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                SLO Motion Schedule
            </h2>
        </div>
        <schedule-table .games=${this.schedule}></schedule-table>
        <a href="/app/team/${this.teamId}">
            <h3>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-team" />
                </svg>
                Back to Team
            </h3>
        </a>
        `}};Ye.styles=[E.styles,S.styles];let Ct=Ye;mr([_({attribute:"team-id"})],Ct.prototype,"teamId",2);mr([$()],Ct.prototype,"schedule",1);var Bn=Object.defineProperty,Fn=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Bn(t,e,r),r};const Ge=class Ge extends N{renderGames(){return!this.games||this.games.length===0?m`
                <h2>No games yet...</h2>
            `:this.games.map(t=>m`
                    <div class="game-row">
                        <dt>
                            <a href="/app/team/${t.teamId}/schedule/${t.gameId}">
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
                `)}render(){return m`
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
        `}};Ge.styles=[E.styles,S.styles,O`
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
        `];let Gt=Ge;Fn([_({type:Array})],Gt.prototype,"games");var Wn=Object.defineProperty,Jn=Object.getOwnPropertyDescriptor,Tt=(i,t,e,s)=>{for(var r=s>1?void 0:s?Jn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Wn(t,e,r),r};const Ke=class Ke extends I{get game(){return this.model.game}get gameStats(){return this.model.gameStats??[]}get roster(){return this.model.roster??[]}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="game-id"&&e!==s&&s&&(this.dispatchMessage(["game/request",{gameId:Number(s)}]),this.dispatchMessage(["game/stats/request",{gameId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(this.teamId)}]))}render(){return m`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                ${this.game?.title}
            </h2>
        </div>
        <section class="gameInfo">
            <div class="infoPair">
                <h3>Location:</h3>
                <p>${this.game?.location}</p>
            </div>
            <div class="infoPair">
                <h3>Date:</h3>
                <p>${this.game?.date}</p>
            </div>
        </section>
        <stat-table .stats=${this.gameStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
        <a href="/app/team/${this.teamId}">
            <h3>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-team" />
                </svg>
                Back to Team
            </h3>
        </a>
        `}};Ke.styles=[E.styles,S.styles,O`
        .gameInfo {
            display: grid; 
            grid-template-columns: 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .infoPair {
            display: flex;       /* lay out h3 and p horizontally */
            align-items: center; /* vertically center h3 and p */
            gap: 0.5rem;         /* space between h3 and p */
        }
        `];let U=Ke;Tt([_({attribute:"game-id"})],U.prototype,"gameId",2);Tt([_({attribute:"team-id"})],U.prototype,"teamId",2);Tt([$()],U.prototype,"game",1);Tt([$()],U.prototype,"gameStats",1);Tt([$()],U.prototype,"roster",1);var Yn=Object.defineProperty,Gn=Object.getOwnPropertyDescriptor,gr=(i,t,e,s)=>{for(var r=s>1?void 0:s?Gn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Yn(t,e,r),r};const Ze=class Ze extends I{get profile(){return this.model.user}constructor(){super("stats:model")}render(){return m`
            <section>
                <h2 class="subheader">Profile Details</h2>
                <dl>
                    <dt>Email:</dt>
                    <dd>${this.profile?.email}</dd>
                    <dt>Full Name:</dt>
                    <dd>${this.profile?.fullName}</dd>
                </dl>
            </section>
        `}};Ze.styles=[E.styles,S.styles];let kt=Ze;gr([_({attribute:"user-id"})],kt.prototype,"userid",2);gr([$()],kt.prototype,"profile",1);var Kn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,Rt=(i,t,e,s)=>{for(var r=s>1?void 0:s?Zn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Kn(t,e,r),r};const Qe=class Qe extends I{get playerStats(){return this.model.playerStats??[]}get player(){return this.model.player}get schedule(){return this.model.schedule??[]}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="player-id"&&s&&(this.dispatchMessage(["player/request",{playerId:Number(s)}]),this.dispatchMessage(["player/stats/request",{playerId:Number(s)}]),this.teamId&&this.dispatchMessage(["team/schedule/request",{teamId:this.teamId}])),t==="team-id"&&s&&this.dispatchMessage(["team/schedule/request",{teamId:Number(s)}])}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-player" />
                    </svg>
                    Player Profile
                </h2>
            </div>
            <section class="player-profile">
                <div class="info-pair">
                    <h3>Name:</h3>
                    <p>${this.player?this.player.playerName:"Loading..."}</p>
                </div>
                <div class="info-pair">
                    <h3>Number:</h3>
                    <p>${this.player?this.player.playerNumber:"Loading..."}</p>
                </div>
            </section>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Total Player Stats
                </h2>
            </div>
            <stat-table .stats=${this.playerStats} .players=${this.player?[this.player]:[]} team-id=${this.teamId}></stat-table>
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Stats Per Game
                </h2>
            </div>
            <a href="/app/team/${this.teamId}">
                <h3>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    Back to Team
                </h3>
            </a>
            <player-stat-table .stats=${this.playerStats} .games=${this.schedule} team-id=${this.teamId}></player-stat-table>
        `}};Qe.styles=[E.styles,S.styles,O`
        .player-profile {
            display: grid; 
            grid-template-columns: 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .info-pair {
            display: flex;       /* lay out h3 and p horizontally */
            align-items: center; /* vertically center h3 and p */
            gap: 0.5rem;         /* space between h3 and p */
        }
        `];let L=Qe;Rt([_({attribute:"player-id"})],L.prototype,"playerId",2);Rt([_({attribute:"team-id"})],L.prototype,"teamId",2);Rt([$()],L.prototype,"playerStats",1);Rt([$()],L.prototype,"player",1);Rt([$()],L.prototype,"schedule",1);const Qn=[{path:"/app/team/:teamId",view:i=>m`
            <team-view team-id=${Number(i.teamId)}></team-view>
        `},{path:"/app/team/:teamId/roster",view:i=>m`
            <roster-view team-id=${Number(i.teamId)}></roster-view>
        `},{path:"/app/team/:teamId/stats",view:i=>m`
            <stats-view team-id=${Number(i.teamId)}></stats-view>
        `},{path:"/app/team/:teamId/schedule",view:i=>m`
            <schedule-view team-id=${Number(i.teamId)}></schedule-view>
        `},{path:"/app/team/:teamId/schedule/:gameId",view:i=>m`
            <game-view team-id=${Number(i.teamId)} game-id=${Number(i.gameId)}></game-view>
        `},{path:"/app/team/:teamId/player/:playerId",view:i=>m`
            <player-view player-id=${Number(i.playerId)} team-id=${Number(i.teamId)}></player-view>
        `},{path:"/app/:userid",view:i=>m`
            <user-view user-id=${i.userid}></user-view>
        `},{path:"/app",view:()=>m`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];Ti({"mu-auth":k.Provider,"mu-history":Dr.Provider,"mu-store":class extends qr.Provider{constructor(){super(Li,Ui,"stats:auth")}},"page-header":Jt,"home-view":Yt,"team-view":ut,"roster-view":pt,"stats-view":ft,"game-view":U,"user-view":kt,"player-view":L,"schedule-view":Ct,"card-grid":ht,"team-info":dt,"player-stat-table":K,"total-stat-block":Ot,"stat-table":G,"schedule-table":Gt,"mu-switch":class extends Ni.Element{constructor(){super(Qn,"stats:history","stats:auth")}}});
