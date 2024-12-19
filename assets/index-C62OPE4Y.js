import{C as L,a as R,L as _,P as F,b as O,p as T,c as U,d as H,e as E,r as l,j as t,f as M,g as j,h as q}from"./vendor-CR5vm7Vg.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))c(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();L.register(R,_,F,O,T,U,H);const J=10*60*1e3,v=1200;let w=0;const C=async e=>{const a=Date.now()-w;return a<v&&(console.log(`Rate limiting: Waiting ${v-a}ms`),await new Promise(c=>setTimeout(c,v-a))),w=Date.now(),e()},N=async(e,o)=>{const a=localStorage.getItem(e);if(a){const{data:s,timestamp:r}=JSON.parse(a);if(Date.now()-r<J)return console.log(`Serving cached data for ${e}`),s}const c=await o();return localStorage.setItem(e,JSON.stringify({data:c,timestamp:Date.now()})),c},W=e=>{const o={},a={};e.forEach(([s,r])=>{const p=new Date(s),i=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}`;o[i]||(o[i]=0,a[i]=0),o[i]+=r,a[i]+=1});const c={};return Object.keys(o).forEach(s=>{c[s]=(o[s]/a[s]).toFixed(2)}),c},P=({coinId:e})=>{const[o,a]=l.useState(null),[c,s]=l.useState(null),[r,p]=l.useState(null),[i,f]=l.useState(null),[d,y]=l.useState(null);return l.useEffect(()=>{(async()=>{try{console.log(`Fetching historical data for coinId: ${e}`);const n=await N(e,async()=>{const h=`https://api.coingecko.com/api/v3/coins/${e}/market_chart`;console.log("Constructed URL for historical data:",h);const m=await C(()=>j.get(h,{params:{vs_currency:"usd",days:"90",interval:"daily"}}));m.data&&console.log(`Received data for ${e}:`,m.data);const{prices:b}=m.data,A=W(b);return{prices:b,monthlyAverages:A}}),x=n.prices.map(h=>new Date(h[0]).toLocaleDateString()),u=n.prices.map(h=>h[1]),D=(u.reduce((h,m)=>h+m,0)/u.length).toFixed(2);p(D),a({labels:x,datasets:[{label:`${e.toUpperCase()} Historical Prices (USD)`,data:u,borderColor:"rgba(75, 192, 192, 1)",backgroundColor:"rgba(75, 192, 192, 0.2)",fill:!0}]}),s(null)}catch(n){n.response?console.error(`API Response Error for ${e}:`,n.response.data):console.error(`Error fetching historical data for ${e}:`,n.message),s("Failed to fetch historical chart data")}})()},[e]),l.useEffect(()=>{(async()=>{try{console.log(`Fetching live price for ${e}`);const n=await N(`${e}_live`,async()=>{var u;return((u=(await C(()=>j.get("https://api.coingecko.com/api/v3/simple/price",{params:{ids:e,vs_currencies:"usd"}}))).data[e])==null?void 0:u.usd)||null});if(f(n),r&&n){const x=((n-r)/r*100).toFixed(2);y(x)}}catch(n){n.response?console.error(`API Response Error for live price of ${e}:`,n.response.data):console.error(`Error fetching live price for ${e}:`,n.message)}})()},[e,r]),t.jsxs("div",{className:"bg-gray-800 p-4 rounded-lg shadow-lg text-white",children:[t.jsxs("h2",{className:"text-2xl font-semibold mb-4",children:[e.toUpperCase()," Historical Chart"]}),c?t.jsx("p",{className:"text-red-400",children:c}):o?t.jsxs("div",{children:[t.jsx("div",{className:"w-full max-w-screen-lg mx-auto h-96 overflow-hidden mb-4",children:t.jsx(M,{data:o,options:{responsive:!0,maintainAspectRatio:!1}})}),t.jsx("div",{className:"text-center mb-4",children:t.jsxs("h3",{className:"text-lg font-semibold",children:["Average Monthly Cost: ",t.jsxs("span",{className:"text-blue-400",children:["$",r]})]})}),i&&d&&t.jsxs("div",{className:"text-center",children:[t.jsxs("h3",{className:"text-lg font-semibold",children:["Current Price: ",t.jsxs("span",{className:"text-green-400",children:["$",i]})]}),t.jsx("p",{className:`text-xl font-bold ${d>=0?"text-green-400":"text-red-400"}`,children:d>=0?`${d}% ↑`:`${Math.abs(d)}% ↓`})]})]}):t.jsx("p",{children:"Loading..."})]})};P.propTypes={coinId:E.string.isRequired};const k=10*60*1e3,$={},S=({coinId:e})=>{const[o,a]=l.useState(null),[c,s]=l.useState(null);return l.useEffect(()=>{const r=async()=>{var f;const i=$[e];if(i&&Date.now()-i.timestamp<k){console.log(`Serving cached live price for ${e}`),a(i.price);return}try{console.log(`Fetching live price for ${e}`);const d=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${e}&vs_currencies=usd`);if(!d.ok)throw new Error(`API response error: ${d.status}`);const g=((f=(await d.json())[e])==null?void 0:f.usd)||"N/A";$[e]={price:g,timestamp:Date.now()},a(g),s(null)}catch(d){console.error("Error fetching live price:",d.message),s("Failed to fetch live price")}};r();const p=setInterval(r,3e4);return()=>clearInterval(p)},[e]),t.jsxs("div",{className:"bg-gray-800 p-4 rounded-lg shadow-lg text-center",children:[t.jsxs("h2",{className:"text-xl font-semibold mb-2",children:[e.toUpperCase()," Live Price"]}),c?t.jsx("p",{className:"text-red-400",children:c}):t.jsxs("p",{className:"text-3xl font-bold",children:["$",o]})]})};S.propTypes={coinId:E.string.isRequired};const B=()=>{const[e,o]=l.useState("bitcoin");return t.jsxs("div",{className:"min-h-screen bg-gray-900 text-white p-6",children:[t.jsx("header",{className:"text-center mb-6",children:t.jsx("h1",{className:"text-4xl font-bold text-blue-400",children:"Crypto Dashboard"})}),t.jsx("nav",{className:"flex justify-center space-x-4 mb-6",children:["bitcoin","ethereum","tellor"].map(a=>t.jsx("button",{onClick:()=>o(a),className:`px-4 py-2 rounded-lg font-semibold transition ${e===a?"bg-blue-500 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`,children:a.charAt(0).toUpperCase()+a.slice(1)},a))}),t.jsxs("main",{className:"container mx-auto space-y-8",children:[t.jsx("section",{children:t.jsx(P,{coinId:e})}),t.jsx("section",{children:t.jsx(S,{coinId:e})})]})]})};function K(){return t.jsx("div",{children:t.jsx(B,{})})}q.createRoot(document.getElementById("root")).render(t.jsx(l.StrictMode,{children:t.jsx(K,{})}));