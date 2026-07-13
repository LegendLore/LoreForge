export function createRouter(onRoute){
  function routeFromHash(){return location.hash.replace(/^#/,"")||"dashboard";}
  window.addEventListener("hashchange",()=>onRoute(routeFromHash()));
  return {current:routeFromHash,go(route){location.hash=route;}};
}
