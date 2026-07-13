import {uid} from "./utilities.js";
export const ENTRY_TYPES=["NPC","Location","Faction","Item","Story Thread","Session"];
export const ENTRY_ICONS={"NPC":"👤","Location":"⌖","Faction":"⚑","Item":"✦","Story Thread":"🧵","Session":"📖"};

function makeEntry(worldId,name,type,description,tags=[],extra={}){
  const now=new Date().toISOString();
  return {id:uid(),worldId,name,type,description,tags,recordState:"Active",canon:"Established canon",condition:"Not applicable",notes:"",relationships:[],created:now,updated:now,...extra};
}
const worldId=uid();
export const seedDatabase={
  version:"0.1.0",
  worlds:[{
    id:worldId,
    name:"Where the Map Ends",
    system:"Avatar Legends",
    description:"A campaign of pursuit, forgotten lands, spiritual power, and the moral weight of bringing danger to hidden people."
  }],
  entries:[
    makeEntry(worldId,"Admiral Kazan Ryu","NPC","A charismatic Fire Nation commander who arrives as a benefactor before tightening control.",["Villain","Fire Nation","Recurring"],{role:"Primary antagonist"}),
    makeEntry(worldId,"General Uyanga","NPC","A relentless Fire Nation commander pursuing the party and the missing route.",["Fire Nation","Military"],{role:"General"}),
    makeEntry(worldId,"Pasho the Jar Merchant","NPC","A traveling merchant, gossip conduit, and recurring source of inconvenient levity.",["Merchant","Comic relief"],{role:"Merchant"}),
    makeEntry(worldId,"Western Air Temple","Location","An abandoned Air Nomad complex containing hidden records and a route beyond the known map.",["Air Nomad","Ruins","Exploration"],{region:"Earth Kingdom"}),
    makeEntry(worldId,"Senra","Location","A hidden hill-clan society shaped by stewardship, sacred ember traditions, drought, and inequality.",["Hidden lands","Spirit"],{region:"Beyond the map"}),
    makeEntry(worldId,"Spirit Seas","Location","Dangerous waters that isolated Senra from the known world.",["Ocean","Spirit"]),
    makeEntry(worldId,"Fire Nation","Faction","An expansionist industrial power seeking military and spiritual advantage.",["Empire","Military"]),
    makeEntry(worldId,"Ash Clan","Faction","Traditional clans who treat fire as a communal responsibility.",["Senra","Traditionalists"]),
    makeEntry(worldId,"Scale Houses","Faction","Merchant houses whose influence creates wealth and social tension.",["Senra","Merchants"]),
    makeEntry(worldId,"Coal Walkers","Faction","Custodians who carry the sacred ember and train Ember Witnesses.",["Senra","Sacred order"]),
    makeEntry(worldId,"Spirit of Ember","Item","A minor spirit bound within a log and capable of powering Ryu's ship.",["Spirit","Major plot"]),
    makeEntry(worldId,"Ancient Route Map","Item","A divided map showing a path through the Spirit Seas.",["Map","Quest"]),
    makeEntry(worldId,"The Stolen Ember","Story Thread","Ryu seeks to capture the Spirit of Ember and turn it into an engine of war.",["Main plot"],{threadStatus:"Open"}),
    makeEntry(worldId,"Fire Nation Pursuit","Story Thread","The party's flight risks leading the Fire Nation directly to Senra.",["Main plot","Chase"],{threadStatus:"Advancing"})
  ],
  trash:[]
};
export function entriesForWorld(db,worldId){return db.entries.filter(entry=>entry.worldId===worldId);}
export function createEntry(db,worldId,data){
  const now=new Date().toISOString();
  const entry={id:uid(),worldId,relationships:[],notes:"",created:now,updated:now,...data};
  db.entries.push(entry);return entry;
}
export function updateEntry(db,id,data){
  const entry=db.entries.find(item=>item.id===id);
  if(!entry)return null;
  Object.assign(entry,data,{updated:new Date().toISOString()});
  return entry;
}
