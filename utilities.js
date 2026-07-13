import {escapeHtml} from "./utilities.js";
import {ENTRY_ICONS} from "./database.js";

export function entryCard(entry){
  return `<article class="entry-card">
    <div class="entry-symbol">${ENTRY_ICONS[entry.type]||"◆"}</div>
    <div>
      <strong>${escapeHtml(entry.name)}</strong>
      <div class="entry-meta">${escapeHtml(entry.type)} · ${escapeHtml(entry.recordState||"Active")}</div>
      <div>${(entry.tags||[]).slice(0,3).map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
    <button class="button button-secondary" data-open-entry="${entry.id}">Open</button>
  </article>`;
}
export function emptyState(text){return `<div class="empty">${escapeHtml(text)}</div>`;}
