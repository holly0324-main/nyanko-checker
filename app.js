(()=>{
'use strict';
const D=window.NYANKO_DATA;
const STORAGE='nyanko-owned-v2';
let owned=loadOwned();
let selectedGroup='all', status='all', query='';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const els={grid:$('#grid'),empty:$('#empty'),groupName:$('#groupName'),ownedCount:$('#ownedCount'),totalCount:$('#totalCount'),meter:$('#meterBar'),search:$('#searchInput'),sheet:$('#groupSheet'),backdrop:$('#sheetBackdrop'),options:$('#groupOptions'),modal:$('#settingsModal'),toast:$('#toast')};
function loadOwned(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(x))return new Set(x.map(v=>String(v).padStart(3,'0')));if(x&&typeof x==='object')return new Set(Object.entries(x).filter(([,v])=>v).map(([k])=>String(k).padStart(3,'0')))}catch{} return new Set()}
function save(){localStorage.setItem(STORAGE,JSON.stringify([...owned].sort()))}
function groupObj(){return D.groups.find(g=>g.id===selectedGroup)}
function baseCharacters(){if(selectedGroup==='all')return D.characters;const ids=new Set(groupObj()?.ids||[]);return D.characters.filter(c=>ids.has(c.id))}
function filtered(){const q=query.trim().toLowerCase();return baseCharacters().filter(c=>{if(status==='owned'&&!owned.has(c.id))return false;if(status==='unowned'&&owned.has(c.id))return false;if(q&&!c.search.toLowerCase().includes(q))return false;return true})}
function card(c){const o=owned.has(c.id);const b=document.createElement('button');b.className='card '+(o?'owned':'unowned');b.dataset.id=c.id;b.setAttribute('aria-pressed',o?'true':'false');b.innerHTML=`<div class="imagebox"><img loading="lazy" decoding="async" src="${c.image}" alt="${escapeHtml(c.name)}"><i class="owned-badge">✓</i></div><div class="label"><b>${escapeHtml(c.name)}</b><small>No.${c.id}</small></div>`;b.addEventListener('click',()=>toggle(c.id,b));b.querySelector('img').addEventListener('error',e=>{e.currentTarget.alt=`画像取得失敗 / ${c.name}`});return b}
function toggle(id,node){if(owned.has(id))owned.delete(id);else owned.add(id);save();node.classList.toggle('owned',owned.has(id));node.classList.toggle('unowned',!owned.has(id));node.setAttribute('aria-pressed',owned.has(id)?'true':'false');updateSummary();if(status!=='all')setTimeout(render,80)}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function updateSummary(){const base=baseCharacters();const n=base.filter(c=>owned.has(c.id)).length;els.ownedCount.textContent=n;els.totalCount.textContent=base.length;els.meter.style.width=(base.length?100*n/base.length:0)+'%';els.groupName.textContent=selectedGroup==='all'?'全キャラ':groupObj().name}
function render(){els.grid.replaceChildren(...filtered().map(card));els.empty.classList.toggle('hidden',filtered().length!==0);updateSummary();updateOptionCounts()}
function buildOptions(){const frag=document.createDocumentFragment();for(const cat of D.categories){const h=document.createElement('div');h.className='group-category';h.textContent=cat;frag.appendChild(h);for(const g of D.groups.filter(x=>x.category===cat)){const b=document.createElement('button');b.className='group-option';b.dataset.group=g.id;b.innerHTML=`<span>${escapeHtml(g.name)}</span><b>${g.ids.length}体</b>`;b.onclick=()=>selectGroup(g.id);frag.appendChild(b)}}els.options.replaceChildren(frag);$('#allGroupCount').textContent=D.characters.length+'体'}
function updateOptionCounts(){$$('.group-option').forEach(b=>b.classList.toggle('active',b.dataset.group===selectedGroup))}
function selectGroup(id){selectedGroup=id;closeSheet();render();scrollTo({top:0,behavior:'smooth'})}
function openSheet(){els.sheet.classList.remove('hidden');els.backdrop.classList.remove('hidden');document.body.style.overflow='hidden'}
function closeSheet(){els.sheet.classList.add('hidden');els.backdrop.classList.add('hidden');document.body.style.overflow=''}
function toast(s){els.toast.textContent=s;els.toast.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.add('hidden'),1700)}
function bulk(makeOwned){const list=filtered();if(!list.length)return;const verb=makeOwned?'所持':'未所持';if(!confirm(`現在表示されている ${list.length}体をすべて「${verb}」にします。`))return;for(const c of list){makeOwned?owned.add(c.id):owned.delete(c.id)}save();render();toast(`${list.length}体を${verb}に変更`)}
function backupObj(){return{app:'nyanko-uber-checker',version:2,exportedAt:new Date().toISOString(),dataSnapshot:D.snapshot,owned:[...owned].sort()}}
async function backup(){const blob=new Blob([JSON.stringify(backupObj(),null,2)],{type:'application/json'});const file=new File([blob],`nyanko-checker-backup-${new Date().toISOString().slice(0,10)}.json`,{type:'application/json'});try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:'にゃんこ所持チェッカー バックアップ',files:[file]});toast('共有メニューを開きました');return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('バックアップを書き出しました')}
async function restore(file){if(!file)return;try{const obj=JSON.parse(await file.text());let ids=[];if(Array.isArray(obj.owned))ids=obj.owned;else if(obj.owned&&typeof obj.owned==='object')ids=Object.entries(obj.owned).filter(([,v])=>v).map(([k])=>k);else if(Array.isArray(obj))ids=obj;else throw new Error('format');const valid=new Set(D.characters.map(c=>c.id));owned=new Set(ids.map(x=>String(x).padStart(3,'0')).filter(x=>valid.has(x)));save();render();els.modal.classList.add('hidden');toast(`復元完了：${owned.size}体所持`)}catch{alert('このファイルは所持チェッカーのバックアップとして読み込めませんでした。')}}
function init(){buildOptions();render();$('#appVersion').textContent=D.version;$('#snapshot').textContent=D.snapshot;$('#masterCount').textContent=D.characters.length+'体';
$('#groupBtn').onclick=openSheet;$('#closeSheet').onclick=closeSheet;els.backdrop.onclick=closeSheet;$('#settingsBtn').onclick=()=>els.modal.classList.remove('hidden');$('#closeSettings').onclick=()=>els.modal.classList.add('hidden');
$$('.segmented button').forEach(b=>b.onclick=()=>{$$('.segmented button').forEach(x=>x.classList.remove('active'));b.classList.add('active');status=b.dataset.status;render()});
els.search.addEventListener('input',()=>{query=els.search.value;render()});$('#markAllOwned').onclick=()=>bulk(true);$('#markAllUnowned').onclick=()=>bulk(false);$('#backupBtn').onclick=backup;$('#restoreInput').onchange=e=>restore(e.target.files[0]);$('#resetBtn').onclick=()=>{if(confirm('所持状況をすべて未所持に戻します。バックアップ未作成なら先に書き出すのがおすすめです。')){owned.clear();save();render();toast('リセットしました')}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
