(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=e(r);fetch(r.href,a)}})();var st,is;class wt extends Error{}wt.prototype.name="InvalidTokenError";function Ar(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function xr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ar(t)}catch{return atob(t)}}function ks(i,t){if(typeof i!="string")throw new wt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new wt(`Invalid token specified: missing part #${e+1}`);let r;try{r=xr(s)}catch(a){throw new wt(`Invalid token specified: invalid base64 for part #${e+1} (${a.message})`)}try{return JSON.parse(r)}catch(a){throw new wt(`Invalid token specified: invalid json for part #${e+1} (${a.message})`)}}const Pr="mu:context",me=`${Pr}:change`;class Or{constructor(t,e){this._proxy=Nr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class _e extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Or(t,this),this.style.display="contents"}attach(t){return this.addEventListener(me,t),t}detach(t){this.removeEventListener(me,t)}}function Nr(i,t){return new Proxy(i,{get:(s,r,a)=>r==="then"?void 0:Reflect.get(s,r,a),set:(s,r,a,n)=>{const o=i[r];console.log(`Context['${r.toString()}'] <= `,a);const l=Reflect.set(s,r,a,n);if(l){let u=new CustomEvent(me,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:o,value:a}),t.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${a}`);return l}})}function Ir(i,t){const e=Ts(t,i);return new Promise((s,r)=>{if(e){const a=e.localName;customElements.whenDefined(a).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Ts(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return Ts(i,r.host)}class Cr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Rs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Cr(e,i))}class we{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(a=>a.then(n=>{n.length&&this.consume(n)}))}}}const ge="mu:auth:jwt",js=class Ms extends we{constructor(t,e){super((s,r)=>this.update(s,r),t,Ms.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:a}=t[1];return[Tr(r),ue(a)]}case"auth/signout":return[Rr(e.user),ue(this._redirectForLogin)];case"auth/redirect":return[e,ue(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};js.EVENT_TYPE="auth:message";let Ls=js;const Ds=Rs(Ls.EVENT_TYPE);function ue(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,a=new URL(i,r);t&&Object.entries(t).forEach(([n,o])=>a.searchParams.set(n,o)),console.log("Redirecting to ",i),window.location.assign(a)}e([])})}class kr extends _e{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=lt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Ls(this.context,this.redirect).attach(this)}}class ot{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ge),t}}class lt extends ot{constructor(t){super();const e=ks(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new lt(t);return localStorage.setItem(ge,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ge);return t?lt.authenticate(t):new ot}}function Tr(i){return{user:lt.authenticate(i),token:i}}function Rr(i){return{user:i&&i.authenticated?ot.deauthenticate(i):i,token:""}}function jr(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Mr(i){return i.authenticated?ks(i.token||""):{}}const _=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:lt,Provider:kr,User:ot,dispatch:Ds,headers:jr,payload:Mr},Symbol.toStringTag,{value:"Module"}));function Us(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function qt(i,t,e){const s=i.target;Us(s,t,e)}function ye(i,t="*"){return i.composedPath().find(r=>{const a=r;return a.tagName&&a.matches(t)})||void 0}const Lr=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:Us,originalTarget:ye,relay:qt},Symbol.toStringTag,{value:"Module"}));function Se(i,...t){const e=i.map((r,a)=>a?[t[a-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Dr=new DOMParser;function Y(i,...t){const e=t.map(o),s=i.map((l,u)=>{if(u===0)return[l];const f=e[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,l]:[f,l]}).flat().join(""),r=Dr.parseFromString(s,"text/html"),a=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...a),e.forEach((l,u)=>{if(l instanceof Node){const f=n.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d?.replaceChild(l,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function o(l,u){if(l===null)return"";switch(typeof l){case"string":return as(l);case"bigint":case"boolean":case"number":case"symbol":return as(l.toString());case"object":if(Array.isArray(l)){const f=new DocumentFragment,d=l.map(o);return f.replaceChildren(...d),f}return l instanceof Node?l:new Text(l.toString());default:return new Comment(`[invalid parameter of type "${typeof l}"]`)}}}function as(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function te(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:a};return s;function r(n){const o=n.firstElementChild,l=o&&o.tagName==="TEMPLATE"?o:void 0;return l&&e.appendChild(l.content.cloneNode(!0)),s}function a(...n){e.adoptedStyleSheets=n}}let Ur=(st=class extends HTMLElement{constructor(){super(),this._state={},te(this).template(st.template).styles(st.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),qt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},zr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},st.template=Y`
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
  `,st.styles=Se`
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
  `,st);function zr(i,t){const e=Object.entries(i);for(const[s,r]of e){const a=t.querySelector(`[name="${s}"]`);if(a){const n=a;switch(n.type){case"checkbox":const o=n;o.checked=!!r;break;case"date":r instanceof Date?n.value=r.toISOString().substr(0,10):n.value=r;break;default:n.value=r;break}}}return i}const Hr=Object.freeze(Object.defineProperty({__proto__:null,Element:Ur},Symbol.toStringTag,{value:"Module"})),zs=class Hs extends we{constructor(t){super((e,s)=>this.update(e,s),t,Hs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return Fr(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return Br(s,r)}}}};zs.EVENT_TYPE="history:message";let Ee=zs;class ns extends _e{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=qr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Ae(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Ee(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function qr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Fr(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function Br(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const Ae=Rs(Ee.EVENT_TYPE),T=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:ns,Provider:ns,Service:Ee,dispatch:Ae},Symbol.toStringTag,{value:"Module"}));class M{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new os(this._provider,t);this._effects.push(r),e(r)}else Ir(this._target,this._contextLabel).then(r=>{const a=new os(r,t);this._provider=r,this._effects.push(a),r.attach(n=>this._handleChange(n)),e(a)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class os{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const qs=class Fs extends HTMLElement{constructor(){super(),this._state={},this._user=new ot,this._authObserver=new M(this,"blazing:auth"),te(this).template(Fs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Jr(r,this._state,e,this.authorization).then(a=>vt(a,this)).then(a=>{const n=`mu-rest-form:${s}`,o=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:a,url:r}});this.dispatchEvent(o)}).catch(a=>{const n="mu-rest-form:error",o=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:a,url:r,request:this._state}});this.dispatchEvent(o)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},vt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ls(this.src,this.authorization).then(e=>{this._state=e,vt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ls(this.src,this.authorization).then(r=>{this._state=r,vt(r,this)});break;case"new":s&&(this._state={},vt({},this));break}}};qs.observedAttributes=["src","new","action"];qs.template=Y`
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
  `;function ls(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function vt(i,t){const e=Object.entries(i);for(const[s,r]of e){const a=t.querySelector(`[name="${s}"]`);if(a){const n=a;switch(n.type){case"checkbox":const o=n;o.checked=!!r;break;default:n.value=r;break}}}return i}function Jr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Bs=class Js extends we{constructor(t,e){super(e,t,Js.EVENT_TYPE,!1)}};Bs.EVENT_TYPE="mu:message";let Gs=Bs;class Gr extends _e{constructor(t,e,s){super(e),this._user=new ot,this._updateFn=t,this._authObserver=new M(this,s)}connectedCallback(){const t=new Gs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Wr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Gr,Service:Gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zt=globalThis,xe=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),cs=new WeakMap;let Ws=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&cs.set(e,t))}return t}toString(){return this.cssText}};const Yr=i=>new Ws(typeof i=="string"?i:i+"",void 0,Pe),Kr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1],i[0]);return new Ws(e,i,Pe)},Zr=(i,t)=>{if(xe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=zt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},hs=xe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Yr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Xr,defineProperty:Qr,getOwnPropertyDescriptor:Vr,getOwnPropertyNames:ti,getOwnPropertySymbols:ei,getPrototypeOf:si}=Object,ct=globalThis,ds=ct.trustedTypes,ri=ds?ds.emptyScript:"",us=ct.reactiveElementPolyfillSupport,St=(i,t)=>i,Ft={toAttribute(i,t){switch(t){case Boolean:i=i?ri:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Oe=(i,t)=>!Xr(i,t),ps={attribute:!0,type:String,converter:Ft,reflect:!1,useDefault:!1,hasChanged:Oe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ct.litPropertyMetadata??(ct.litPropertyMetadata=new WeakMap);let it=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ps){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Qr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:a}=Vr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const o=r?.call(this);a?.call(this,n),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ps}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;const t=si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){const e=this.properties,s=[...ti(e),...ei(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(hs(r))}else t!==void 0&&e.push(hs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,r);if(a!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ft).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(t,e){var s,r;const a=this.constructor,n=a._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=a.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ft;this._$Em=n,this[n]=l.fromAttribute(e,o.type)??((r=this._$Ej)==null?void 0:r.get(n))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const a=this.constructor,n=this[t];if(s??(s=a.getPropertyOptions(t)),!((s.hasChanged??Oe)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:a},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[a,n]of r){const{wrapped:o}=n,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,n,l)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var a;return(a=r.hostUpdate)==null?void 0:a.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};it.elementStyles=[],it.shadowRootOptions={mode:"open"},it[St("elementProperties")]=new Map,it[St("finalized")]=new Map,us?.({ReactiveElement:it}),(ct.reactiveElementVersions??(ct.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt=globalThis,Jt=Bt.trustedTypes,fs=Jt?Jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ys="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,Ks="?"+D,ii=`<${Ks}>`,K=document,At=()=>K.createComment(""),xt=i=>i===null||typeof i!="object"&&typeof i!="function",Ne=Array.isArray,ai=i=>Ne(i)||typeof i?.[Symbol.iterator]=="function",pe=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ms=/-->/g,gs=/>/g,B=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ys=/'/g,vs=/"/g,Zs=/^(?:script|style|textarea|title)$/i,ni=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),$t=ni(1),ht=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),bs=new WeakMap,G=K.createTreeWalker(K,129);function Xs(i,t){if(!Ne(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return fs!==void 0?fs.createHTML(t):t}const oi=(i,t)=>{const e=i.length-1,s=[];let r,a=t===2?"<svg>":t===3?"<math>":"",n=bt;for(let o=0;o<e;o++){const l=i[o];let u,f,d=-1,c=0;for(;c<l.length&&(n.lastIndex=c,f=n.exec(l),f!==null);)c=n.lastIndex,n===bt?f[1]==="!--"?n=ms:f[1]!==void 0?n=gs:f[2]!==void 0?(Zs.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=B):f[3]!==void 0&&(n=B):n===B?f[0]===">"?(n=r??bt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?B:f[3]==='"'?vs:ys):n===vs||n===ys?n=B:n===ms||n===gs?n=bt:(n=B,r=void 0);const h=n===B&&i[o+1].startsWith("/>")?" ":"";a+=n===bt?l+ii:d>=0?(s.push(u),l.slice(0,d)+Ys+l.slice(d)+D+h):l+D+(d===-2?o:h)}return[Xs(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ve=class Qs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let a=0,n=0;const o=t.length-1,l=this.parts,[u,f]=oi(t,e);if(this.el=Qs.createElement(u,s),G.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=G.nextNode())!==null&&l.length<o;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Ys)){const c=f[n++],h=r.getAttribute(d).split(D),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:a,name:p[2],strings:h,ctor:p[1]==="."?ci:p[1]==="?"?hi:p[1]==="@"?di:ee}),r.removeAttribute(d)}else d.startsWith(D)&&(l.push({type:6,index:a}),r.removeAttribute(d));if(Zs.test(r.tagName)){const d=r.textContent.split(D),c=d.length-1;if(c>0){r.textContent=Jt?Jt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],At()),G.nextNode(),l.push({type:2,index:++a});r.append(d[c],At())}}}else if(r.nodeType===8)if(r.data===Ks)l.push({type:2,index:a});else{let d=-1;for(;(d=r.data.indexOf(D,d+1))!==-1;)l.push({type:7,index:a}),d+=D.length-1}a++}}static createElement(t,e){const s=K.createElement("template");return s.innerHTML=t,s}};function dt(i,t,e=i,s){var r,a;if(t===ht)return t;let n=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const o=xt(t)?void 0:t._$litDirective$;return n?.constructor!==o&&((a=n?._$AO)==null||a.call(n,!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=dt(i,n._$AS(i,t.values),n,s)),t}let li=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??K).importNode(e,!0);G.currentNode=r;let a=G.nextNode(),n=0,o=0,l=s[0];for(;l!==void 0;){if(n===l.index){let u;l.type===2?u=new Ie(a,a.nextSibling,this,t):l.type===1?u=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(u=new ui(a,this,t)),this._$AV.push(u),l=s[++o]}n!==l?.index&&(a=G.nextNode(),n++)}return G.currentNode=K,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Ie=class Vs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=dt(this,t,e),xt(t)?t===S||t==null||t===""?(this._$AH!==S&&this._$AR(),this._$AH=S):t!==this._$AH&&t!==ht&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==S&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,a=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ve.createElement(Xs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===a)this._$AH.p(s);else{const n=new li(a,this),o=n.u(this.options);n.p(s),this.T(o),this._$AH=n}}_$AC(t){let e=bs.get(t.strings);return e===void 0&&bs.set(t.strings,e=new ve(t)),e}k(t){Ne(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const a of t)r===e.length?e.push(s=new Vs(this.O(At()),this.O(At()),this,this.options)):s=e[r],s._$AI(a),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,a){this.type=1,this._$AH=S,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=S}_$AI(t,e=this,s,r){const a=this.strings;let n=!1;if(a===void 0)t=dt(this,t,e,0),n=!xt(t)||t!==this._$AH&&t!==ht,n&&(this._$AH=t);else{const o=t;let l,u;for(t=a[0],l=0;l<a.length-1;l++)u=dt(this,o[s+l],e,l),u===ht&&(u=this._$AH[l]),n||(n=!xt(u)||u!==this._$AH[l]),u===S?t=S:t!==S&&(t+=(u??"")+a[l+1]),this._$AH[l]=u}n&&!r&&this.j(t)}j(t){t===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ci=class extends ee{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===S?void 0:t}},hi=class extends ee{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==S)}},di=class extends ee{constructor(t,e,s,r,a){super(t,e,s,r,a),this.type=5}_$AI(t,e=this){if((t=dt(this,t,e,0)??S)===ht)return;const s=this._$AH,r=t===S&&s!==S||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==S&&(s===S||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},ui=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){dt(this,t)}};const $s=Bt.litHtmlPolyfillSupport;$s?.(ve,Ie),(Bt.litHtmlVersions??(Bt.litHtmlVersions=[])).push("3.3.0");const pi=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const a=e?.renderBefore??null;s._$litPart$=r=new Ie(t.insertBefore(At(),a),a,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis;let nt=class extends it{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ht}};nt._$litElement$=!0,nt.finalized=!0,(is=Pt.litElementHydrateSupport)==null||is.call(Pt,{LitElement:nt});const _s=Pt.litElementPolyfillSupport;_s?.({LitElement:nt});(Pt.litElementVersions??(Pt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fi={attribute:!0,type:String,converter:Ft,reflect:!1,hasChanged:Oe},mi=(i=fi,t,e)=>{const{kind:s,metadata:r}=e;let a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(n,l,i)},init(o){return o!==void 0&&this.C(n,void 0,i,o),o}}}if(s==="setter"){const{name:n}=e;return function(o){const l=this[n];t.call(this,o),this.requestUpdate(n,l,i)}}throw Error("Unsupported decorator location: "+s)};function tr(i){return(t,e)=>typeof e=="object"?mi(i,t,e):((s,r,a)=>{const n=r.hasOwnProperty(a);return r.constructor.createProperty(a,s),n?Object.getOwnPropertyDescriptor(r,a):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function er(i){return tr({...i,state:!0,attribute:!1})}function gi(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function yi(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var sr={};(function(i){var t=(function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],r=[1,10],a=[1,11],n=[1,12],o=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,y,g,b,oe){var N=b.length-1;switch(g){case 1:return new y.Root({},[b[N-1]]);case 2:return new y.Root({},[new y.Literal({value:""})]);case 3:this.$=new y.Concat({},[b[N-1],b[N]]);break;case 4:case 5:this.$=b[N];break;case 6:this.$=new y.Literal({value:b[N]});break;case 7:this.$=new y.Splat({name:b[N]});break;case 8:this.$=new y.Param({name:b[N]});break;case 9:this.$=new y.Optional({},[b[N-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:a,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:a,15:n},{1:[2,2]},e(o,[2,4]),e(o,[2,5]),e(o,[2,6]),e(o,[2,7]),e(o,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:a,15:n},e(o,[2,10]),e(o,[2,11]),e(o,[2,12]),{1:[2,1]},e(o,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:a,15:n},e(o,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(y,g){this.message=y,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],y=[null],g=[],b=this.table,oe="",N=0,es=0,_r=2,ss=1,wr=g.slice.call(arguments,1),w=Object.create(this.lexer),q={yy:{}};for(var le in this.yy)Object.prototype.hasOwnProperty.call(this.yy,le)&&(q.yy[le]=this.yy[le]);w.setInput(c,q.yy),q.yy.lexer=w,q.yy.parser=this,typeof w.yylloc>"u"&&(w.yylloc={});var ce=w.yylloc;g.push(ce);var Sr=w.options&&w.options.ranges;typeof q.yy.parseError=="function"?this.parseError=q.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Er=function(){var et;return et=w.lex()||ss,typeof et!="number"&&(et=h.symbols_[et]||et),et},O,F,I,he,tt={},Dt,j,rs,Ut;;){if(F=p[p.length-1],this.defaultActions[F]?I=this.defaultActions[F]:((O===null||typeof O>"u")&&(O=Er()),I=b[F]&&b[F][O]),typeof I>"u"||!I.length||!I[0]){var de="";Ut=[];for(Dt in b[F])this.terminals_[Dt]&&Dt>_r&&Ut.push("'"+this.terminals_[Dt]+"'");w.showPosition?de="Parse error on line "+(N+1)+`:
`+w.showPosition()+`
Expecting `+Ut.join(", ")+", got '"+(this.terminals_[O]||O)+"'":de="Parse error on line "+(N+1)+": Unexpected "+(O==ss?"end of input":"'"+(this.terminals_[O]||O)+"'"),this.parseError(de,{text:w.match,token:this.terminals_[O]||O,line:w.yylineno,loc:ce,expected:Ut})}if(I[0]instanceof Array&&I.length>1)throw new Error("Parse Error: multiple actions possible at state: "+F+", token: "+O);switch(I[0]){case 1:p.push(O),y.push(w.yytext),g.push(w.yylloc),p.push(I[1]),O=null,es=w.yyleng,oe=w.yytext,N=w.yylineno,ce=w.yylloc;break;case 2:if(j=this.productions_[I[1]][1],tt.$=y[y.length-j],tt._$={first_line:g[g.length-(j||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(j||1)].first_column,last_column:g[g.length-1].last_column},Sr&&(tt._$.range=[g[g.length-(j||1)].range[0],g[g.length-1].range[1]]),he=this.performAction.apply(tt,[oe,es,N,q.yy,I[1],y,g].concat(wr)),typeof he<"u")return he;j&&(p=p.slice(0,-1*j*2),y=y.slice(0,-1*j),g=g.slice(0,-1*j)),p.push(this.productions_[I[1]][0]),y.push(tt.$),g.push(tt._$),rs=b[p[p.length-2]][p[p.length-1]],p.push(rs);break;case 3:return!0}}return!0}},u=(function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===y.length?this.yylloc.first_column:0)+y[y.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,y,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),y=c[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var b in g)this[b]=g[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,y;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),b=0;b<g.length;b++)if(p=this._input.match(this.rules[g[b]]),p&&(!h||p[0].length>h[0].length)){if(h=p,y=b,this.options.backtrack_lexer){if(c=this.test_match(p,g[b]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[y]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,y,g){switch(y){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d})();l.lexer=u;function f(){this.yy={}}return f.prototype=l,l.Parser=f,new f})();typeof yi<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(sr);function rt(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var rr={Root:rt("Root"),Concat:rt("Concat"),Literal:rt("Literal"),Splat:rt("Splat"),Param:rt("Param"),Optional:rt("Optional")},ir=sr.parser;ir.yy=rr;var vi=ir,bi=Object.keys(rr);function $i(i){return bi.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ar=$i,_i=ar,wi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function nr(i){this.captures=i.captures,this.re=i.re}nr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Si=_i({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(wi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new nr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ei=Si,Ai=ar,xi=Ai({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Pi=xi,Oi=vi,Ni=Ei,Ii=Pi;Rt.prototype=Object.create(null);Rt.prototype.match=function(i){var t=Ni.visit(this.ast),e=t.match(i);return e||!1};Rt.prototype.reverse=function(i){return Ii.visit(this.ast,i)};function Rt(i){var t;if(this?t=this:t=Object.create(Rt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Oi.parse(i),t}var Ci=Rt,ki=Ci,Ti=ki;const Ri=gi(Ti);var ji=Object.defineProperty,or=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&ji(t,e,r),r};const lr=class extends nt{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>$t` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Ri(r.path)})),this._historyObserver=new M(this,e),this._authObserver=new M(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),$t` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Ds(this,"auth/redirect"),$t` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):$t` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),$t` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),a=s+e;for(const n of this._cases){const o=n.route.match(a);if(o)return{...n,path:s,params:o,query:r}}}redirect(t){Ae(this,"history/redirect",{href:t})}};lr.styles=Kr`
    :host,
    main {
      display: contents;
    }
  `;let Gt=lr;or([er()],Gt.prototype,"_user");or([er()],Gt.prototype,"_match");const Mi=Object.freeze(Object.defineProperty({__proto__:null,Element:Gt,Switch:Gt},Symbol.toStringTag,{value:"Module"})),cr=class be extends HTMLElement{constructor(){if(super(),te(this).template(be.template).styles(be.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};cr.template=Y` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;cr.styles=Se`
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
  `;const hr=class $e extends HTMLElement{constructor(){super(),this._array=[],te(this).template($e.template).styles($e.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(dr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,a=e.closest("label");if(a){const n=Array.from(this.children).indexOf(a);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ye(t,"button.add")?qt(t,"input-array:add"):ye(t,"button.remove")&&qt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Li(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};hr.template=Y`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;hr.styles=Se`
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
  `;function Li(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(dr(e)))}function dr(i,t){const e=i===void 0?Y`<input />`:Y`<input value="${i}" />`;return Y`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ur(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Di=Object.defineProperty,Ui=Object.getOwnPropertyDescriptor,zi=(i,t,e,s)=>{for(var r=Ui(t,e),a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&Di(t,e,r),r};class k extends nt{constructor(t){super(),this._pending=[],this._observer=new M(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}zi([tr()],k.prototype,"model");const Hi={};function qi(i,t,e){const[s,r,a]=i;switch(s){case"user/request":{const{email:o}=r;return t.user?.email===o?t:[{...t,user:{email:o}},Fi(r,e).then(l=>["user/load",{user:l}])]}case"user/load":{const{user:o}=r;return{...t,user:o}}case"user/save":return[t,Vi(r,e,a).then(o=>["user/load",{user:o}])];case"user/teams/request":return[t,Bi(r,e).then(o=>["user/teams/load",{userTeams:o}])];case"team/save":return[t,ta(r,e,a).then(o=>["user/teams/load",{userTeams:[...t.userTeams??[],o]}])];case"game/save":return[t,ea(r,e,a).then(o=>["team/schedule/load",{schedule:[...t.schedule??[],o]}])];case"stat/save":return[t,sa(r,e,a).then(o=>{const l=[...t.playerStats??[],o],u=[...t.gameStats??[],o],f=[...t.teamStats??[],o];return["stats/load",{playerStats:l,gameStats:u,teamStats:f}]})];case"stats/load":{const{playerStats:o,gameStats:l,teamStats:u}=r;return{...t,playerStats:o,gameStats:l,teamStats:u}}case"user/teams/load":{const{userTeams:o}=r;return{...t,userTeams:o}}case"team/request":{const{teamId:o}=r;return t.team?.teamId===o?t:[{...t,team:{teamId:o}},Ji(r,e).then(l=>["team/load",{team:l}])]}case"team/load":{const{team:o}=r;return{...t,team:o}}case"team/delete":return[t,ia(r,e,a).then()];case"stat/delete":return[t,aa(r,e,a).then()];case"game/delete":return[t,na(r,e,a).then()];case"player/delete":return[t,oa(r,e,a).then()];case"team/roster/request":return[t,Gi(r,e).then(o=>["team/roster/load",{roster:o}])];case"team/roster/load":{const{roster:o}=r;return{...t,roster:o}}case"team/schedule/request":return[t,Wi(r,e).then(o=>["team/schedule/load",{schedule:o}])];case"team/schedule/load":{const{schedule:o}=r;return{...t,schedule:o}}case"team/stats/request":return[t,Yi(r,e).then(o=>["team/stats/load",{teamStats:o}])];case"team/stats/load":{const{teamStats:o}=r;return{...t,teamStats:o}}case"game/stats/request":return[t,Ki(r,e).then(o=>["game/stats/load",{gameStats:o}])];case"game/stats/load":{const{gameStats:o}=r;return{...t,gameStats:o}}case"game/request":return[t,Xi(r,e).then(o=>["game/load",{game:o}])];case"game/load":{const{game:o}=r;return{...t,game:o}}case"player/request":return[t,Qi(r,e).then(o=>["player/load",{player:o}])];case"player/save":return[t,ra(r,e,a).then(o=>["team/roster/load",{roster:[...t.roster??[],o]}])];case"player/load":{const{player:o}=r;return{...t,player:o}}case"player/stats/request":return[t,Zi(r,e).then(o=>["player/stats/load",{playerStats:o}])];case"player/stats/load":{const{playerStats:o}=r;return{...t,playerStats:o}}default:const n=s;throw new Error(`Unhandled message "${n}"`)}}function Fi(i,t){return fetch(`/api/users/email/${i.email}`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Bi(i,t){return fetch(`/api/teams?email=${i.email}`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Ji(i,t){return fetch(`/api/teams/${i.teamId}`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Gi(i,t){return fetch(`/api/teams/${i.teamId}/roster`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Wi(i,t){return fetch(`/api/teams/${i.teamId}/schedule`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Yi(i,t){return fetch(`/api/teams/${i.teamId}/stats`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Ki(i,t){return fetch(`/api/games/${i.gameId}/stats`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Zi(i,t){return fetch(`/api/players/${i.playerId}/stats`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Xi(i,t){return fetch(`/api/games/${i.gameId}`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Qi(i,t){return fetch(`/api/players/${i.playerId}`,{headers:_.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")})}function Vi(i,t,e){return fetch(`/api/users/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",..._.headers(t)},body:JSON.stringify(i.user)}).then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function ta(i,t,e){return fetch("/api/teams",{method:"POST",headers:{"Content-Type":"application/json",..._.headers(t)},body:JSON.stringify(i.team)}).then(s=>{if(s.status===201)return s.json();throw new Error(`Failed to save team for ${JSON.stringify(i.team)}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function ea(i,t,e){return fetch("/api/games",{method:"POST",headers:{"Content-Type":"application/json",..._.headers(t)},body:JSON.stringify(i.game)}).then(s=>{if(s.status===201)return s.json();throw new Error(`Failed to save team for ${JSON.stringify(i.game)}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function sa(i,t,e){return fetch("/api/stats",{method:"POST",headers:{"Content-Type":"application/json",..._.headers(t)},body:JSON.stringify(i.stat)}).then(s=>{if(s.status===201)return s.json();throw new Error(`Failed to save stat for ${JSON.stringify(i.stat)}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function ra(i,t,e){return fetch("/api/players",{method:"POST",headers:{"Content-Type":"application/json",..._.headers(t)},body:JSON.stringify(i.player)}).then(s=>{if(s.status===201)return s.json();throw new Error(`Failed to save stat for ${JSON.stringify(i.player)}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function ia(i,t,e){return fetch(`/api/teams/${i.teamId}`,{method:"DELETE",headers:{"Content-Type":"application/json",..._.headers(t)}}).then(s=>{if(s.ok){e.onSuccess&&e.onSuccess();return}throw new Error("Failed to delete team")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function aa(i,t,e){return fetch(`/api/stats/${i.statId}`,{method:"DELETE",headers:{"Content-Type":"application/json",..._.headers(t)}}).then(s=>{if(s.ok){e.onSuccess&&e.onSuccess();return}throw new Error("Failed to delete stat")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function na(i,t,e){return fetch(`/api/games/${i.gameId}`,{method:"DELETE",headers:{"Content-Type":"application/json",..._.headers(t)}}).then(s=>{if(s.ok){e.onSuccess&&e.onSuccess();return}throw new Error("Failed to delete game")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function oa(i,t,e){return fetch(`/api/players/${i.playerId}`,{method:"DELETE",headers:{"Content-Type":"application/json",..._.headers(t)}}).then(s=>{if(s.ok){e.onSuccess&&e.onSuccess();return}throw new Error("Failed to delete player")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ht=globalThis,Ce=Ht.ShadowRoot&&(Ht.ShadyCSS===void 0||Ht.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ke=Symbol(),ws=new WeakMap;let pr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ws.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ws.set(e,t))}return t}toString(){return this.cssText}};const la=i=>new pr(typeof i=="string"?i:i+"",void 0,ke),A=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1]),i[0]);return new pr(e,i,ke)},ca=(i,t)=>{if(Ce)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Ht.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ss=Ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return la(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ha,defineProperty:da,getOwnPropertyDescriptor:ua,getOwnPropertyNames:pa,getOwnPropertySymbols:fa,getPrototypeOf:ma}=Object,se=globalThis,Es=se.trustedTypes,ga=Es?Es.emptyScript:"",ya=se.reactiveElementPolyfillSupport,Et=(i,t)=>i,Wt={toAttribute(i,t){switch(t){case Boolean:i=i?ga:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Te=(i,t)=>!ha(i,t),As={attribute:!0,type:String,converter:Wt,reflect:!1,useDefault:!1,hasChanged:Te};Symbol.metadata??=Symbol("metadata"),se.litPropertyMetadata??=new WeakMap;let at=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=As){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&da(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:a}=ua(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const o=r?.call(this);a?.call(this,n),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??As}static _$Ei(){if(this.hasOwnProperty(Et("elementProperties")))return;const t=ma(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Et("properties"))){const e=this.properties,s=[...pa(e),...fa(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ss(r))}else t!==void 0&&e.push(Ss(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ca(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:Wt).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Wt;this._$Em=r;const o=n.fromAttribute(e,a.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const r=this.constructor,a=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??Te)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,a]of s){const{wrapped:n}=a,o=this[r];n!==!0||this._$AL.has(r)||o===void 0||this.C(r,void 0,a,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};at.elementStyles=[],at.shadowRootOptions={mode:"open"},at[Et("elementProperties")]=new Map,at[Et("finalized")]=new Map,ya?.({ReactiveElement:at}),(se.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Re=globalThis,Yt=Re.trustedTypes,xs=Yt?Yt.createPolicy("lit-html",{createHTML:i=>i}):void 0,fr="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,mr="?"+U,va=`<${mr}>`,Z=document,Ot=()=>Z.createComment(""),Nt=i=>i===null||typeof i!="object"&&typeof i!="function",je=Array.isArray,ba=i=>je(i)||typeof i?.[Symbol.iterator]=="function",fe=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ps=/-->/g,Os=/>/g,J=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ns=/'/g,Is=/"/g,gr=/^(?:script|style|textarea|title)$/i,$a=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=$a(1),ut=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),Cs=new WeakMap,W=Z.createTreeWalker(Z,129);function yr(i,t){if(!je(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return xs!==void 0?xs.createHTML(t):t}const _a=(i,t)=>{const e=i.length-1,s=[];let r,a=t===2?"<svg>":t===3?"<math>":"",n=_t;for(let o=0;o<e;o++){const l=i[o];let u,f,d=-1,c=0;for(;c<l.length&&(n.lastIndex=c,f=n.exec(l),f!==null);)c=n.lastIndex,n===_t?f[1]==="!--"?n=Ps:f[1]!==void 0?n=Os:f[2]!==void 0?(gr.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=J):f[3]!==void 0&&(n=J):n===J?f[0]===">"?(n=r??_t,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?J:f[3]==='"'?Is:Ns):n===Is||n===Ns?n=J:n===Ps||n===Os?n=_t:(n=J,r=void 0);const h=n===J&&i[o+1].startsWith("/>")?" ":"";a+=n===_t?l+va:d>=0?(s.push(u),l.slice(0,d)+fr+l.slice(d)+U+h):l+U+(d===-2?o:h)}return[yr(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class It{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let a=0,n=0;const o=t.length-1,l=this.parts,[u,f]=_a(t,e);if(this.el=It.createElement(u,s),W.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=W.nextNode())!==null&&l.length<o;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(fr)){const c=f[n++],h=r.getAttribute(d).split(U),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:a,name:p[2],strings:h,ctor:p[1]==="."?Sa:p[1]==="?"?Ea:p[1]==="@"?Aa:re}),r.removeAttribute(d)}else d.startsWith(U)&&(l.push({type:6,index:a}),r.removeAttribute(d));if(gr.test(r.tagName)){const d=r.textContent.split(U),c=d.length-1;if(c>0){r.textContent=Yt?Yt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],Ot()),W.nextNode(),l.push({type:2,index:++a});r.append(d[c],Ot())}}}else if(r.nodeType===8)if(r.data===mr)l.push({type:2,index:a});else{let d=-1;for(;(d=r.data.indexOf(U,d+1))!==-1;)l.push({type:7,index:a}),d+=U.length-1}a++}}static createElement(t,e){const s=Z.createElement("template");return s.innerHTML=t,s}}function pt(i,t,e=i,s){if(t===ut)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const a=Nt(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=pt(i,r._$AS(i,t.values),r,s)),t}class wa{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??Z).importNode(e,!0);W.currentNode=r;let a=W.nextNode(),n=0,o=0,l=s[0];for(;l!==void 0;){if(n===l.index){let u;l.type===2?u=new jt(a,a.nextSibling,this,t):l.type===1?u=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(u=new xa(a,this,t)),this._$AV.push(u),l=s[++o]}n!==l?.index&&(a=W.nextNode(),n++)}return W.currentNode=Z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class jt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=pt(this,t,e),Nt(t)?t===E||t==null||t===""?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ba(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==E&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=It.createElement(yr(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const a=new wa(r,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=Cs.get(t.strings);return e===void 0&&Cs.set(t.strings,e=new It(t)),e}k(t){je(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const a of t)r===e.length?e.push(s=new jt(this.O(Ot()),this.O(Ot()),this,this.options)):s=e[r],s._$AI(a),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class re{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,a){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E}_$AI(t,e=this,s,r){const a=this.strings;let n=!1;if(a===void 0)t=pt(this,t,e,0),n=!Nt(t)||t!==this._$AH&&t!==ut,n&&(this._$AH=t);else{const o=t;let l,u;for(t=a[0],l=0;l<a.length-1;l++)u=pt(this,o[s+l],e,l),u===ut&&(u=this._$AH[l]),n||=!Nt(u)||u!==this._$AH[l],u===E?t=E:t!==E&&(t+=(u??"")+a[l+1]),this._$AH[l]=u}n&&!r&&this.j(t)}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Sa extends re{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===E?void 0:t}}class Ea extends re{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E)}}class Aa extends re{constructor(t,e,s,r,a){super(t,e,s,r,a),this.type=5}_$AI(t,e=this){if((t=pt(this,t,e,0)??E)===ut)return;const s=this._$AH,r=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==E&&(s===E||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class xa{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){pt(this,t)}}const Pa=Re.litHtmlPolyfillSupport;Pa?.(It,jt),(Re.litHtmlVersions??=[]).push("3.3.1");const Oa=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const a=e?.renderBefore??null;s._$litPart$=r=new jt(t.insertBefore(Ot(),a),a,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=globalThis;class R extends at{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Oa(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ut}}R._$litElement$=!0,R.finalized=!0,Me.litElementHydrateSupport?.({LitElement:R});const Na=Me.litElementPolyfillSupport;Na?.({LitElement:R});(Me.litElementVersions??=[]).push("4.2.1");const Ia=A`
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
`,x={styles:Ia};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ca={attribute:!0,type:String,converter:Wt,reflect:!1,hasChanged:Te},ka=(i=Ca,t,e)=>{const{kind:s,metadata:r}=e;let a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(n,l,i)},init(o){return o!==void 0&&this.C(n,void 0,i,o),o}}}if(s==="setter"){const{name:n}=e;return function(o){const l=this[n];t.call(this,o),this.requestUpdate(n,l,i)}}throw Error("Unsupported decorator location: "+s)};function $(i){return(t,e)=>typeof e=="object"?ka(i,t,e):((s,r,a)=>{const n=r.hasOwnProperty(a);return r.constructor.createProperty(a,s),n?Object.getOwnPropertyDescriptor(r,a):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(i){return $({...i,state:!0,attribute:!1})}const Ta=A`
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

h3 {
    text-align: var(--text-align);
    font-size: var(--font-size-body);
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
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    font-size: var(--font-size-body);
    font-style: var(--font-style-header);
    font-family: var(--font-family-body);
    color: var(--color-text);

    /* Improve click target */
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    background: var(--color-background-page);
}

/* Hide the actual checkbox visually but keep it accessible */
.checkbox > input {
    appearance: none;
    -webkit-appearance: none;
    width: 40px;
    height: 22px;
    border-radius: 20px;
    background: #bbb;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background 0.25s ease;
}

/* The sliding circle */
.checkbox > input::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: 3px;
    transition: transform 0.25s ease;
}

/* ON state */
.checkbox > input:checked {
    background: #4caf50; /* green toggle */
}

.checkbox > input:checked::before {
    transform: translateX(18px);
}

.error {
    color: red;
    text-align: center;
}

.form {
    display: flex;
    padding: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: var(--color-grid);
    margin: var(--margin);
    align-items: center;
    justify-content: center;
    width: 95%;
    
    > * {
        margin-bottom: 1rem;
    }
}

.centered-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.delete-button {
    padding: 0.7rem 1.4rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.delete-button:hover {
    background: linear-gradient(135deg, #ff6b61, #d8433f);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}
`,P={styles:Ta};var Ra=Object.defineProperty,Le=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&Ra(t,e,r),r};const ze=class ze extends R{constructor(){super(...arguments),this.cards=[]}renderCardGrid(){if(this.dataType==="teams")return!this.cards||this.cards.length===0?m`
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
        `}};ze.styles=[x.styles,P.styles,A`
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
        `];let ft=ze;Le([$({type:Array})],ft.prototype,"cards");Le([$({attribute:"team-id"})],ft.prototype,"teamId");Le([$()],ft.prototype,"dataType");var ja=Object.defineProperty,Ma=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&ja(t,e,r),r};const He=class He extends k{constructor(){super("stats:model"),this.loggedIn=!1,this._authObserver=new M(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user&&this._user.authenticated?(this.loggedIn=!0,this.dispatchMessage(["user/request",{email:this._user?.username}])):this.loggedIn=!1})}get user(){return this.model?.user}renderSignOutButton(){return m`
            <button
                @click=${t=>{Lr.relay(t,"auth:message",["auth/signout"])}}
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
        `}};He.styles=[x.styles,P.styles,A`
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
        `];let Kt=He;Ma([v()],Kt.prototype,"loggedIn");var La=Object.defineProperty,Da=Object.getOwnPropertyDescriptor,Ua=(i,t,e,s)=>{for(var r=Da(t,e),a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&La(t,e,r),r};const qe=class qe extends k{constructor(){super("stats:model"),this._authObserver=new M(this,"stats:auth")}get teams(){return this.model.userTeams}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user&&this._user.authenticated&&this.dispatchMessage(["user/teams/request",{email:this._user?.username}])})}handleSubmit(t){if(!this._user?.username)return;const e={teamName:t.detail.teamName,email:this._user.username};this.dispatchMessage(["team/save",{team:e},{onSuccess:()=>T.dispatch(this,"history/navigate",{href:"/"}),onFailure:s=>console.log("ERROR:",s)}])}render(){return m`
            <div class="subheader">
                <h1>My Teams</h1>
            </div>
            <card-grid .cards=${this.teams} dataType="teams"></card-grid>
            <div class="subheader">
                <h2>Add a team</h2>
            </div>
            <div class="centered-content">
                <mu-form
                    .init=${{}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Team Name:
                        <input name="teamName" placeholder="Enter team name"/>
                    </label>
                </mu-form>
            </div>
        `}};qe.styles=[x.styles,P.styles,A`

        `];let Zt=qe;Ua([v()],Zt.prototype,"teams");var za=Object.defineProperty,Ha=Object.getOwnPropertyDescriptor,ie=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ha(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&za(t,e,r),r};const Fe=class Fe extends k{constructor(){super("stats:model"),this.handleDeleteTeam=()=>{this.teamId&&this.dispatchMessage(["team/delete",{teamId:this.teamId},{onSuccess:()=>T.dispatch(this,"history/navigate",{href:"/"}),onFailure:t=>this._error=t}])}}get team(){return this.model.team}get rosterCount(){return this.model.roster?.length}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}renderError(){return this._error?m`
            <p class="error">
                ${this._error}
            </p>`:""}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-team" />
                    </svg>
                    ${this.team?.teamName}
                </h2>
            </div>
            <section class="teamInfo">
                <div class="info-pair">
                    <h3>Team Name:</h3>
                    <p>${this.team?.teamName}</p>
                </div>
                <div class="info-pair">
                    <h3>Number of Players:</h3>
                    <p>${this.rosterCount}</p>
                </div>
                <button class="delete-button" @click=${this.handleDeleteTeam}>Delete Team</button>
                ${this.renderError()}
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
        `}};Fe.styles=[x.styles,P.styles,A`
            .teamInfo {
                display: grid; 
                grid-template-columns: 1fr 1fr 1fr;
                justify-items: center;
                margin: var(--margin);
                padding: var(--padding);
            }
            .info-pair {
                display: flex;       
                align-items: center; 
                gap: 0.5rem;
            }
        `];let X=Fe;ie([$({attribute:"team-id"})],X.prototype,"teamId",2);ie([v()],X.prototype,"team",1);ie([v()],X.prototype,"rosterCount",1);ie([v()],X.prototype,"_error",2);const qa=A`
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
    grid-template-columns: repeat(5, 1fr);
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
`,Mt={styles:qa};var Fa=Object.defineProperty,De=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&Fa(t,e,r),r};const Be=class Be extends R{constructor(){super(...arguments),this._authObserver=new M(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{if(e)return this.team=e,fetch(`/api/teams/${this.team.teamId}/roster`,{headers:this.authorization})}).then(e=>e?.json()).then(e=>{e&&(this.numPlayers=e.length)}).catch(e=>console.error("Hydrate failed:",e))}render(){return m`
        <section class="teamInfo">
            <p>Team Name: ${this.team?.teamName}</p>
            <p>Division: College</p>
            <p>Number of Players: ${this.numPlayers}</p>
        </section>
        `}};Be.styles=[x.styles,P.styles,Mt.styles,A`
        .teamInfo {
            display: flex; 
            align-items: baseline; 
            justify-content: space-between;
            margin: var(--margin);
            padding: var(--padding);
        }
        `];let mt=Be;De([$()],mt.prototype,"src");De([v()],mt.prototype,"team");De([v()],mt.prototype,"numPlayers");var Ba=Object.defineProperty,vr=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&Ba(t,e,r),r};const Je=class Je extends R{constructor(){super(...arguments),this._authObserver=new M(this,"stats:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.total=e)}).catch(e=>console.error("Failed to hydrate total stat block:",e))}renderTotalStatBlock(){return m`
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
        `}};Je.styles=[x.styles,P.styles,Mt.styles,A`
        `];let Ct=Je;vr([$()],Ct.prototype,"src");vr([v()],Ct.prototype,"total");var Ja=Object.defineProperty,Ga=Object.getOwnPropertyDescriptor,ae=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ga(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ja(t,e,r),r};const Ge=class Ge extends k{get roster(){return this.model.roster}get team(){return this.model.team}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}handleSubmit(t){if(!this.teamId)return;if(!t.detail.playerName||!t.detail.playerNumber){this._error=new Error("Player name and number are required.");return}if(isNaN(Number(t.detail.playerNumber))){this._error=new Error("Player number must be a valid number.");return}const e={playerName:t.detail.playerName,playerNumber:Number(t.detail.playerNumber),teamId:this.teamId};this.dispatchMessage(["player/save",{player:e},{onSuccess:()=>{T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/roster`})},onFailure:s=>this._error=s}])}renderError(){return this._error?m`
            <p class="error">
                ${this._error}
            </p>`:""}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-roster" />
                    </svg>
                    ${this.team?.teamName} Roster
                </h2>
            </div>
            <card-grid .cards=${this.roster} datatype="roster" team-id=${this.teamId}></card-grid>
            
            <div class="subheader">
                <h2>Add a Player</h2>
            </div>
            <div class="centered-content">
                <mu-form
                    .init=${{playerName:"",playerNumber:""}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Player Name:
                        <input name="playerName" placeholder="Enter player name"/>
                    </label>
                    <label>
                        Player Number:
                        <input name="playerNumber" placeholder="Enter player number"/>
                    </label>
                </mu-form>
                <back-button team-id=${this.teamId}></back-button>
            </div>
            
            ${this.renderError()}
        `}};Ge.styles=[x.styles,P.styles,A`
            .centered-content {
                display: flex;
                justify-content: center;
        `];let Q=Ge;ae([$({attribute:"team-id"})],Q.prototype,"teamId",2);ae([v()],Q.prototype,"roster",1);ae([v()],Q.prototype,"team",1);ae([v()],Q.prototype,"_error",2);var Wa=Object.defineProperty,Ya=Object.getOwnPropertyDescriptor,Ue=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ya(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Wa(t,e,r),r};const We=class We extends k{get teamStats(){return this.model.teamStats??[]}get roster(){return this.model.roster??[]}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&(this.dispatchMessage(["team/stats/request",{teamId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(s)}]))}render(){return m`
            <div class="subheader">
                <h2>
                    <svg class="icon">
                        <use href="/icons/base.svg#icon-stats" />
                    </svg>
                    Team Stats
                </h2>
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
            <div class="centered-content">
                <back-button team-id=${this.teamId}></back-button>
            </div>
        `}};We.styles=[x.styles,P.styles];let gt=We;Ue([$({attribute:"team-id"})],gt.prototype,"teamId",2);Ue([v()],gt.prototype,"teamStats",1);Ue([v()],gt.prototype,"roster",1);var Ka=Object.defineProperty,Za=Object.getOwnPropertyDescriptor,Lt=(i,t,e,s)=>{for(var r=s>1?void 0:s?Za(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ka(t,e,r),r};const Ye=class Ye extends k{constructor(){super(...arguments),this.stats=[],this.players=[]}getPlayerName(t){const e=this.players.find(s=>s.playerId===t);return e?e.playerName:"Unknown"}get statRows(){const t={};for(const e of this.stats)switch(!t[e.playerId]&&e.statId&&(t[e.playerId]={statId:e.statId,name:this.getPlayerName(e.playerId)??"Unknown",scores:0,blocks:0,drops:0,incompletions:0}),e.statType){case"score":t[e.playerId].scores++;break;case"block":t[e.playerId].blocks++;break;case"drop":t[e.playerId].drops++;break;case"incompletion":t[e.playerId].incompletions++;break}return Object.values(t)}renderStatRows(){const t=Object.values(this.statRows);return!t||!t.length?m`<h3>No stats to report yet...</h3>`:t.map(e=>{const s=this.players.find(a=>a.playerName===e.name),r=s?s.playerId:null;return m`
            <div class="stat-row">
                <dt>
                    ${r?m`<a href="/app/team/${this.teamId}/player/${r}">${e.name}</a>`:e.name}
                </dt>
                <dd>${e.scores}</dd>
                <dd>${e.blocks}</dd>
                <dd>${e.drops}</dd>
                <dd>${e.incompletions}</dd>
            </div>
        `})}render(){return m`
        <div class="table">
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
        </div>
        `}};Ye.styles=[x.styles,P.styles,Mt.styles,A`
        .table {
            margin-bottom: var(--margin);
        `];let z=Ye;Lt([$({type:Array})],z.prototype,"stats",2);Lt([$({type:Array})],z.prototype,"players",2);Lt([$({attribute:"team-id"})],z.prototype,"teamId",2);Lt([v()],z.prototype,"_error",2);Lt([v()],z.prototype,"statRows",1);var Xa=Object.defineProperty,Qa=Object.getOwnPropertyDescriptor,ne=(i,t,e,s)=>{for(var r=s>1?void 0:s?Qa(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Xa(t,e,r),r};const Ke=class Ke extends R{constructor(){super(...arguments),this.stats=[],this.games=[]}getGameName(t){const e=this.games.find(s=>s.gameId===t);return e?e.title:"Unknown"}get statRows(){const t={};for(const e of this.stats)switch(t[e.gameId]||(t[e.gameId]={name:this.getGameName(e.gameId)??"Unknown",scores:0,blocks:0,drops:0,incompletions:0}),e.statType){case"score":t[e.gameId].scores++;break;case"block":t[e.gameId].blocks++;break;case"drop":t[e.gameId].drops++;break;case"incompletion":t[e.gameId].incompletions++;break}return Object.values(t)}renderStatRows(){const t=Object.values(this.statRows);return t.length?t.map(e=>{const s=this.games.find(a=>a.title===e.name),r=s?s.gameId:null;return m`
            <div class="stat-row">
                <dt>
                    ${r?m`<a href="/app/team/${this.teamId}/schedule/${r}">${e.name}</a>`:e.name}
                </dt>
                <dd>${e.scores}</dd>
                <dd>${e.blocks}</dd>
                <dd>${e.drops}</dd>
                <dd>${e.incompletions}</dd>
            </div>
        `}):m`<h3>No stats to report yet...</h3>`}render(){return m`
        <div class="table">
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
        </div>
        `}};Ke.styles=[x.styles,P.styles,Mt.styles,A`
        .table {
            margin-bottom: var(--margin);
        }
        `];let V=Ke;ne([$({type:Array})],V.prototype,"stats",2);ne([$({type:Array})],V.prototype,"games",2);ne([$({attribute:"team-id"})],V.prototype,"teamId",2);ne([v()],V.prototype,"statRows",1);var Va=Object.defineProperty,tn=Object.getOwnPropertyDescriptor,br=(i,t,e,s)=>{for(var r=s>1?void 0:s?tn(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Va(t,e,r),r};const Ze=class Ze extends k{get schedule(){return this.model.schedule}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="team-id"&&e!==s&&s&&this.dispatchMessage(["team/schedule/request",{teamId:Number(s)}])}handleSubmit(t){const e={title:t.detail.title,location:t.detail.location,date:t.detail.date,teamId:this.teamId};this.dispatchMessage(["game/save",{game:e},{onSuccess:()=>{T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/schedule`})},onFailure:s=>console.log("ERROR:",s)}])}render(){return m`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                SLO Motion Schedule
            </h2>
        </div>
        <schedule-table .games=${this.schedule}></schedule-table>
        <div class="centered-content">
                <mu-form
                    .init=${{title:"",location:"",date:""}}
                    @mu-form:submit=${this.handleSubmit} class="form">
                    <label>
                        Game Title:
                        <input name="title" placeholder="Enter game name"/>
                    </label>
                    <label>
                        Game Location:
                        <input name="location" placeholder="Enter game location"/>
                    </label>
                    <label>
                        Game Date:
                        <input name="date" placeholder="Enter game date"/>
                    </label>
                </mu-form>
                <back-button team-id=${this.teamId}></back-button>
            </div>
        `}};Ze.styles=[x.styles,P.styles];let kt=Ze;br([$({attribute:"team-id"})],kt.prototype,"teamId",2);br([v()],kt.prototype,"schedule",1);var en=Object.defineProperty,sn=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&en(t,e,r),r};const Xe=class Xe extends R{renderGames(){return!this.games||this.games.length===0?m`
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
        `}};Xe.styles=[x.styles,P.styles,A`
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
        `];let Xt=Xe;sn([$({type:Array})],Xt.prototype,"games");var rn=Object.defineProperty,an=Object.getOwnPropertyDescriptor,H=(i,t,e,s)=>{for(var r=s>1?void 0:s?an(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&rn(t,e,r),r};const Qe=class Qe extends k{constructor(){super("stats:model"),this.lastPlayerId="",this.lastStatType="score",this.handleDeleteStat=t=>{this.dispatchMessage(["stat/delete",{statId:t},{onSuccess:()=>{this.model.gameStats=this.model.gameStats?.filter(e=>e.statId!==t)??[],T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/schedule/${this.gameId}`})},onFailure:e=>this._error=e}])},this.handleDeleteGame=()=>{this.gameId&&this.dispatchMessage(["game/delete",{gameId:this.gameId},{onSuccess:()=>T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/schedule`}),onFailure:t=>this._error=t}])}}get game(){return this.model.game}get gameStats(){return this.model.gameStats??[]}get roster(){return this.model.roster??[]}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="game-id"&&e!==s&&s&&(this.dispatchMessage(["game/request",{gameId:Number(s)}]),this.dispatchMessage(["game/stats/request",{gameId:Number(s)}]),this.dispatchMessage(["team/roster/request",{teamId:Number(this.teamId)}]))}handleSubmit(t){this.lastPlayerId=t.detail.playerId,this.lastStatType=t.detail.statType;const e={statType:t.detail.statType,playerId:t.detail.playerId,gameId:this.gameId};this.dispatchMessage(["stat/save",{stat:e},{onSuccess:()=>{T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/schedule/${this.gameId}`})},onFailure:s=>{console.log("ERROR:",s)}}])}renderError(){return m`<div class="error">
            <p>Error: ${this._error?.message}</p>
        </div>`}renderGameStats(){return this.gameStats.map(t=>{const e=this.roster.find(r=>r.playerId===t.playerId),s=e?e.playerName:null;return m`
            <div class="game-stat-row">
                <dt>
                    ${s}
                </dt>
                <dd>${t.statType}</dd>
                <button 
                    class="delete-stat-button" 
                    @click=${()=>this.handleDeleteStat(t.statId)}
                >
                    <svg viewBox="0 0 24 24"><path d="M6 6 L18 18 M6 18 L18 6" stroke="white" stroke-width="2"/></svg>
                </button>
            </div>
            `})}render(){const t=this.lastPlayerId||this.roster[0]?.playerId||"",e=this.lastStatType;return m`
        <div class="subheader">
            <h2>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-game" />
                </svg>
                ${this.game?.title}
            </h2>
        </div>
        <section class="gameInfo">
            <div class="infoBlock">
                <h3>Location:</h3>
                <p>${this.game?.location}</p>
            </div>
            <div class="infoPair">
                <h3>Date:</h3>
                <p>${this.game?.date}</p>
            </div>
            <button class="delete-button" @click=${this.handleDeleteGame}>Delete Game</button>
        </section>
        <stat-table .stats=${this.gameStats} .players=${this.roster} team-id=${this.teamId}></stat-table>
        
        <div class="subheader">
            <h2>Game Stats</h2>
        </div>
        ${this._error?this.renderError():null}
        <div class="game-stats-header">
            <h3>Player Name</h3>
            <h3>Stat Type</h3>
        </div>
        ${this.renderGameStats()}

        <div class="subheader">
            <h2> -- Add a New Stat --</h2>
        </div>
        <div class="centered-content">
        <mu-form
            .init=${{playerId:t,statType:e}}
            @mu-form:submit=${this.handleSubmit} class="form">
            
            <!-- Player Dropdown -->
            <label>
                Player:
                <select name="playerId" required>
                <option value="" disabled selected>Select a player</option>
                ${this.roster.map(s=>m`
                    <option value=${s.playerId}>
                        ${s.playerName}
                    </option>
                    `)}
                </select>
            </label>

             <!-- Stat Type Dropdown -->
            <label>
                Stat Type:
                <select name="statType" required>
                <option value="" disabled selected>Select a stat type</option>
                <option value="score">Score</option>
                <option value="block">Block</option>
                <option value="drop">Drop</option>
                <option value="incompletion">Incompletion</option>
                </select>
            </label>
        </mu-form>
        <back-button team-id=${this.teamId}></back-button>
        </div>
        `}};Qe.styles=[x.styles,P.styles,A`
        .gameInfo {
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .infoBlock {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .game-stats-header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            margin-top: var(--margin);
            background-color: var(--color-background-header);
            color: var(--color-header);
        }

        .game-stat-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            text-align: center;
            border-bottom: 1px solid var(--color-accent);
            padding: var(--padding);
            margin: 0px;
            transition: background-color 0.3s ease;

            > dt {
                font-weight: bold;
            }
        }

        .game-stat-row:hover {
            background-color: var(--color-hover);
        }

        .delete-stat-button {
            padding: 0.25rem 0.5rem;      /* small but clickable */
            font-size: 0.85rem;           /* slightly smaller text */
            font-weight: 600;
            border: none;
            border-radius: 6px;
            background-color: #e74c3c;    /* nice red */
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;
            width: auto;           /* don't stretch to fill column */
            justify-self: center;
            }

            .delete-stat-button:hover {
            background-color: #c0392b;    /* darker red on hover */
            transform: scale(1.05);       /* subtle pop */
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }

            .delete-stat-button:active {
            transform: scale(0.95);       /* pressed effect */
            }

            .delete-stat-button svg {
            width: 0.8rem;
            height: 0.8rem;
            }

        `];let C=Qe;H([$({attribute:"game-id"})],C.prototype,"gameId",2);H([$({attribute:"team-id"})],C.prototype,"teamId",2);H([v()],C.prototype,"game",1);H([v()],C.prototype,"gameStats",1);H([v()],C.prototype,"roster",1);H([v()],C.prototype,"lastPlayerId",2);H([v()],C.prototype,"lastStatType",2);H([v()],C.prototype,"_error",2);var nn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,$r=(i,t,e,s)=>{for(var r=s>1?void 0:s?on(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&nn(t,e,r),r};const Vt=class Vt extends k{get profile(){return this.model.user}constructor(){super("stats:model")}handleSubmit(t){console.log("Submitting profile update:",t.detail),this.dispatchMessage(["user/save",{userid:this.userid,user:t.detail},{onSuccess:()=>T.dispatch(this,"history/navigate",{href:`/app/${this.userid}`}),onFailure:e=>console.log("ERROR:",e)}])}render(){return m`
        <h2 class="subheader">Profile Details</h2>
        <div class="content">
            <section>
                <dl>
                    <dt>Email:</dt>
                    <dd>${this.profile?.email}</dd>
                    <dt>Full Name:</dt>
                    <dd>${this.profile?.fullName}</dd>
                </dl>
            </section>
            <section>
                <h3>Edit Profile</h3>
                <mu-form class="form" .init=${this.profile} @mu-form:submit=${this.handleSubmit}>
                    <label>
                        <span class="label-text">Full Name:</span>
                        <input 
                            name="fullName"
                        />
                    </label>
                </mu-form>
            </section>
            <label class="checkbox" onchange="toggleDarkMode(event.target, event.target.checked)">
                <input type="checkbox" autocomplete="off"/>
                Dark mode
            </label>
        </div>
        `}};Vt.uses=ur({"mu-form":Hr.Element}),Vt.styles=[x.styles,P.styles,A`
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
        }
        `];let Tt=Vt;$r([$({attribute:"user-id"})],Tt.prototype,"userid",2);$r([v()],Tt.prototype,"profile",1);var ln=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,yt=(i,t,e,s)=>{for(var r=s>1?void 0:s?cn(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&ln(t,e,r),r};const Ve=class Ve extends k{constructor(){super("stats:model"),this.handleDeletePlayer=()=>{this.playerId&&this.dispatchMessage(["player/delete",{playerId:this.playerId},{onSuccess:()=>T.dispatch(this,"history/navigate",{href:`/app/team/${this.teamId}/roster`}),onFailure:t=>this._error=t}])}}get playerStats(){return this.model.playerStats??[]}get player(){return this.model.player}get schedule(){return this.model.schedule??[]}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="player-id"&&s&&(this.dispatchMessage(["player/request",{playerId:Number(s)}]),this.dispatchMessage(["player/stats/request",{playerId:Number(s)}]),this.teamId&&this.dispatchMessage(["team/schedule/request",{teamId:this.teamId}])),t==="team-id"&&s&&this.dispatchMessage(["team/schedule/request",{teamId:Number(s)}])}render(){return m`
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
                <button class="delete-button" @click=${this.handleDeletePlayer}>Delete Player</button>
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
            <player-stat-table .stats=${this.playerStats} .games=${this.schedule} team-id=${this.teamId}></player-stat-table>
            <div class="centered-content">
                <back-button team-id=${this.teamId}></back-button>
            </div>
        `}};Ve.styles=[x.styles,P.styles,A`
        .player-profile {
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr;
            justify-items: center;
            margin: var(--margin);
            padding: var(--padding);
        }
        .info-pair {
            display: flex;       /* lay out h3 and p horizontally */
            align-items: center; /* vertically center h3 and p */
            gap: 0.5rem;         /* space between h3 and p */
        }
        `];let L=Ve;yt([$({attribute:"player-id"})],L.prototype,"playerId",2);yt([$({attribute:"team-id"})],L.prototype,"teamId",2);yt([v()],L.prototype,"playerStats",1);yt([v()],L.prototype,"player",1);yt([v()],L.prototype,"schedule",1);yt([v()],L.prototype,"_error",2);var hn=Object.defineProperty,dn=(i,t,e,s)=>{for(var r=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=n(t,e,r)||r);return r&&hn(t,e,r),r};const ts=class ts extends R{render(){return m`
        <a href="/app/team/${this.teamId}" class="back-button">
            <h3>
                <svg class="icon">
                    <use href="/icons/base.svg#icon-team" />
                </svg>
                Back to Team
            </h3>
        </a>
        `}};ts.styles=[x.styles,P.styles,Mt.styles,A`
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;

            padding: 0.6rem 1.1rem;
            border-radius: 12px;

            background: var(--color-accent);
            color: white;

            transition: background-color 0.2s ease, 
                        transform 0.15s ease, 
                        box-shadow 0.2s ease;
        }

        .back-button:hover {
            background: var(--color-accent-dark, #1f6feb);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        `];let Qt=ts;dn([$({attribute:"team-id"})],Qt.prototype,"teamId");const un=[{path:"/app/team/:teamId",view:i=>m`
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
        `},{path:"/",redirect:"/app"}];ur({"mu-auth":_.Provider,"mu-history":T.Provider,"mu-store":class extends Wr.Provider{constructor(){super(qi,Hi,"stats:auth")}},"page-header":Kt,"home-view":Zt,"team-view":X,"roster-view":Q,"stats-view":gt,"game-view":C,"user-view":Tt,"player-view":L,"schedule-view":kt,"card-grid":ft,"team-info":mt,"player-stat-table":V,"total-stat-block":Ct,"stat-table":z,"schedule-table":Xt,"back-button":Qt,"mu-switch":class extends Mi.Element{constructor(){super(un,"stats:history","stats:auth")}}});
