const STORAGE_KEY="loreforge-db-v01";
export function loadDatabase(fallback){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  }catch(error){
    console.error("Failed to load Loreforge data",error);
    return structuredClone(fallback);
  }
}
export function saveDatabase(db){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
export function exportDatabase(db){
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;link.download="loreforge-backup.json";link.click();
  URL.revokeObjectURL(url);
}
export async function importDatabase(file){
  const parsed=JSON.parse(await file.text());
  if(!Array.isArray(parsed.worlds)||!Array.isArray(parsed.entries)) throw new Error("Invalid Loreforge backup");
  return parsed;
}
