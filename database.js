import {seedDatabase,entriesForWorld,ENTRY_TYPES,createEntry} from "./database.js";
import {loadDatabase,saveDatabase,exportDatabase,importDatabase} from "./storage.js";
import {entryCard,emptyState} from "./ui.js";
import {escapeHtml} from "./utilities.js";
import {createRouter} from "./router.js";

const state={db:loadDatabase(seedDatabase),worldId:null,route:"dashboard"};
state.worldId=state.db.worlds[0]?.id||null;

const mainView=document.querySelector("#mainView");
const primaryNav=document.querySelector("#primaryNav");
const bottomNav=document.querySelector("#bottomNav");
const searchButton=document.querySelector("#searchButton");
const commandPalette=document.querySelector("#commandPalette");
const commandInput=document.querySelector("#commandInput");
const commandResults=document.querySelector("#commandResults");
const entryDialog=document.querySelector("#entryDialog");
const entryForm=document.querySelector("#entryForm");
const entryFields=document.querySelector("#entryFields");
const entryDialogTitle=document.querySelector("#entryDialogTitle");
const cancelEntryButton=document.querySelector("#cancelEntryButton");
const importInput=document.querySelector("#importInput");

const NAV=[
  ["dashboard","Home"],["entries","Entries"],["threads","Threads"],["sessions","Sessions"],["settings","Settings"]
];

const router=createRouter(route=>{state.route=route;render();});

function currentWorld(){return state.db.worlds.find(world=>world.id===state.worldId);}
function worldEntries(){return entriesForWorld(state.db,state.worldId);}

function renderNav(){
  primaryNav.innerHTML=NAV.map(([route,label])=>`<button class="nav-link ${state.route===route?"active":""}" data-route="${route}">${label}</button>`).join("");
  bottomNav.innerHTML=NAV.map(([route,label])=>`<button class="bottom-link ${state.route===route?"active":""}" data-route="${route}">${label}</button>`).join("");
  document.querySelectorAll("[data-route]").forEach(button=>button.onclick=()=>router.go(button.dataset.route));
}

function render(){
  renderNav();
  const route=state.route;
  if(route==="dashboard")renderDashboard();
  else if(route==="entries")renderEntries();
  else if(route==="threads")renderType("Story Thread","Story Threads");
  else if(route==="sessions")renderType("Session","Sessions");
  else if(route==="settings")renderSettings();
  else renderDashboard();
  bindOpenButtons();
  mainView.focus();
}

function renderDashboard(){
  const world=currentWorld();
  const entries=worldEntries();
  const recent=[...entries].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,5);
  const threads=entries.filter(e=>e.type==="Story Thread"&&!["Resolved","Abandoned"].includes(e.threadStatus||"Open"));
  mainView.innerHTML=`
    <section class="paper">
      <div class="hero-row">
        <div>
          <div class="muted">Continue world</div>
          <h1>${escapeHtml(world?.name||"Untitled World")}</h1>
        </div>
        <button class="button" id="newEntryButton">New entry</button>
      </div>
      <p>${escapeHtml(world?.description||"")}</p>
      <div class="stats">
        ${["NPC","Location","Faction","Item"].map(type=>`<div class="stat-card"><strong>${entries.filter(e=>e.type===type).length}</strong>${type}${type==="NPC"?"s":"s"}</div>`).join("")}
      </div>
    </section>
    <section class="paper">
      <div class="section-heading"><h2>Open story threads</h2><button class="button button-secondary" id="newThreadButton">Add</button></div>
      <div class="list">${threads.length?threads.slice(0,5).map(entryCard).join(""):emptyState("No open threads yet.")}</div>
    </section>
    <section class="paper">
      <h2>Recently touched</h2>
      <div class="list">${recent.length?recent.map(entryCard).join(""):emptyState("The archive is waiting for ink.")}</div>
    </section>`;
  document.querySelector("#newEntryButton").onclick=()=>openEntryDialog();
  document.querySelector("#newThreadButton").onclick=()=>openEntryDialog("Story Thread");
}

function renderEntries(){
  const entries=worldEntries();
  mainView.innerHTML=`
    <section class="paper">
      <div class="section-heading"><h1>Entries</h1><button class="button" id="newEntryButton">New</button></div>
      <div class="toolbar">
        <input id="entrySearch" type="search" placeholder="Filter entries…">
        <select id="entryType"><option value="">All types</option>${ENTRY_TYPES.map(type=>`<option>${type}</option>`).join("")}</select>
      </div>
      <div id="entryList" class="list">${entries.map(entryCard).join("")||emptyState("No entries yet.")}</div>
    </section>`;
  document.querySelector("#newEntryButton").onclick=()=>openEntryDialog();
  const search=document.querySelector("#entrySearch"),type=document.querySelector("#entryType");
  const filter=()=>{
    const q=search.value.toLowerCase();
    const list=entries.filter(e=>(!type.value||e.type===type.value)&&JSON.stringify(e).toLowerCase().includes(q));
    document.querySelector("#entryList").innerHTML=list.map(entryCard).join("")||emptyState("Nothing found.");
    bindOpenButtons();
  };
  search.oninput=filter;type.onchange=filter;
}

function renderType(type,title){
  const entries=worldEntries().filter(e=>e.type===type);
  mainView.innerHTML=`<section class="paper">
    <div class="section-heading"><h1>${title}</h1><button class="button" id="newTypedButton">Add</button></div>
    <div class="list">${entries.map(entryCard).join("")||emptyState(`No ${title.toLowerCase()} yet.`)}</div>
  </section>`;
  document.querySelector("#newTypedButton").onclick=()=>openEntryDialog(type);
}

function renderSettings(){
  const world=currentWorld();
  mainView.innerHTML=`
    <section class="paper">
      <h1>World settings</h1>
      <label>World name</label><input id="worldName" value="${escapeHtml(world.name)}">
      <label>System</label><input id="worldSystem" value="${escapeHtml(world.system||"")}">
      <label>Description</label><textarea id="worldDescription">${escapeHtml(world.description||"")}</textarea>
      <button class="button" id="saveWorldButton">Save world</button>
    </section>
    <section class="paper">
      <h2>Backup and transfer</h2>
      <p class="notice">Your campaign data stays in this browser unless you export it.</p>
      <div class="hero-row">
        <button class="button" id="exportButton">Export JSON</button>
        <button class="button button-secondary" id="importButton">Import JSON</button>
      </div>
    </section>`;
  document.querySelector("#saveWorldButton").onclick=()=>{
    world.name=document.querySelector("#worldName").value.trim()||"Untitled World";
    world.system=document.querySelector("#worldSystem").value;
    world.description=document.querySelector("#worldDescription").value;
    saveDatabase(state.db);render();
  };
  document.querySelector("#exportButton").onclick=()=>exportDatabase(state.db);
  document.querySelector("#importButton").onclick=()=>importInput.click();
}

function bindOpenButtons(){
  document.querySelectorAll("[data-open-entry]").forEach(button=>{
    button.onclick=()=>openDetail(button.dataset.openEntry);
  });
}

function openDetail(id){
  const entry=state.db.entries.find(e=>e.id===id);
  if(!entry)return;
  mainView.innerHTML=`<section class="paper">
    <div class="section-heading"><h1>${escapeHtml(entry.name)}</h1><button class="button button-secondary" id="backButton">Back</button></div>
    <div class="muted">${escapeHtml(entry.type)}</div>
    <div>${(entry.tags||[]).map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    <p>${escapeHtml(entry.description||"").replaceAll("\n","<br>")}</p>
    <div class="notice">Editing existing entries arrives in v0.2. Creation, search, storage, backup, and navigation are active now.</div>
  </section>`;
  document.querySelector("#backButton").onclick=()=>render();
}

function openEntryDialog(type="NPC"){
  entryDialogTitle.textContent=`New ${type}`;
  entryFields.innerHTML=`
    <div class="form-grid">
      <div><label>Type</label><select name="type">${ENTRY_TYPES.map(t=>`<option ${t===type?"selected":""}>${t}</option>`).join("")}</select></div>
      <div><label>Name or title</label><input name="name" required></div>
      <div><label>Record state</label><select name="recordState"><option>Draft</option><option selected>Active</option><option>Archived</option></select></div>
      <div><label>Canon marking</label><select name="canon"><option>Established canon</option><option>Player-known</option><option>Rumor</option><option>GM secret</option><option>Planned</option></select></div>
    </div>
    <label>Description</label><textarea name="description"></textarea>
    <label>Tags</label><input name="tags" placeholder="villain, Senra, Book One">
    <label>Notes</label><textarea name="notes"></textarea>`;
  entryForm.reset();
  entryDialog.showModal();
}

entryForm.addEventListener("submit",event=>{
  event.preventDefault();
  const data=new FormData(entryForm);
  createEntry(state.db,state.worldId,{
    type:data.get("type"),
    name:data.get("name").trim(),
    description:data.get("description"),
    tags:String(data.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),
    notes:data.get("notes"),
    recordState:data.get("recordState"),
    canon:data.get("canon"),
    condition:"Not applicable"
  });
  saveDatabase(state.db);
  entryDialog.close();
  render();
});
cancelEntryButton.onclick=()=>entryDialog.close();

searchButton.onclick=()=>{
  commandInput.value="";
  renderCommandResults("");
  commandPalette.showModal();
  requestAnimationFrame(()=>commandInput.focus());
};
commandInput.oninput=()=>renderCommandResults(commandInput.value);

function renderCommandResults(query){
  const q=query.trim().toLowerCase();
  const actions=[
    {label:"New NPC",run:()=>openEntryDialog("NPC")},
    {label:"New Location",run:()=>openEntryDialog("Location")},
    {label:"New Story Thread",run:()=>openEntryDialog("Story Thread")},
    {label:"Go to Entries",run:()=>router.go("entries")},
    {label:"Go to Settings",run:()=>router.go("settings")}
  ];
  const actionMatches=actions.filter(a=>!q||a.label.toLowerCase().includes(q));
  const entryMatches=worldEntries().filter(e=>q&&JSON.stringify(e).toLowerCase().includes(q)).slice(0,8);
  commandResults.innerHTML=[
    ...actionMatches.map((a,i)=>`<button class="command-item" data-action="${i}">${escapeHtml(a.label)}</button>`),
    ...entryMatches.map(e=>`<button class="command-item" data-command-entry="${e.id}">${escapeHtml(e.name)} <span class="muted">· ${escapeHtml(e.type)}</span></button>`)
  ].join("")||emptyState("No matching lore.");
  commandResults.querySelectorAll("[data-action]").forEach(button=>button.onclick=()=>{commandPalette.close();actions[Number(button.dataset.action)].run();});
  commandResults.querySelectorAll("[data-command-entry]").forEach(button=>button.onclick=()=>{commandPalette.close();openDetail(button.dataset.commandEntry);});
}

importInput.addEventListener("change",async()=>{
  const file=importInput.files[0];if(!file)return;
  try{
    state.db=await importDatabase(file);
    state.worldId=state.db.worlds[0]?.id||null;
    saveDatabase(state.db);render();alert("Loreforge backup imported.");
  }catch(error){alert("That file is not a valid Loreforge backup.");}
  importInput.value="";
});

document.addEventListener("keydown",event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();searchButton.click();}
});
render();
