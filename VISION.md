<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#4a2918">
  <title>Loreforge</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/theme.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <div id="app" class="app-shell">
    <header class="topbar">
      <button id="menuButton" class="icon-button" aria-label="Open navigation">☰</button>
      <div>
        <div class="brand">Loreforge</div>
        <div class="brand-subtitle">Worlds become connected here.</div>
      </div>
      <button id="searchButton" class="icon-button" aria-label="Search">⌕</button>
    </header>

    <aside id="sidebar" class="sidebar" aria-label="Primary navigation">
      <nav id="primaryNav"></nav>
    </aside>

    <main id="mainView" class="main-view" tabindex="-1"></main>

    <nav id="bottomNav" class="bottom-nav" aria-label="Mobile navigation"></nav>
  </div>

  <dialog id="commandPalette" class="command-palette">
    <form method="dialog" class="command-frame">
      <div class="command-header">
        <input id="commandInput" type="search" placeholder="Search Loreforge or type “new npc”…" autocomplete="off">
        <button class="icon-button" value="cancel" aria-label="Close">×</button>
      </div>
      <div id="commandResults" class="command-results"></div>
    </form>
  </dialog>

  <dialog id="entryDialog" class="entry-dialog">
    <form id="entryForm" class="entry-form" method="dialog">
      <header class="dialog-header">
        <h2 id="entryDialogTitle">New entry</h2>
        <button class="icon-button" value="cancel" aria-label="Close">×</button>
      </header>
      <div id="entryFields" class="dialog-body"></div>
      <footer class="dialog-actions">
        <button type="button" class="button button-secondary" id="cancelEntryButton">Cancel</button>
        <button type="submit" class="button">Save entry</button>
      </footer>
    </form>
  </dialog>

  <input id="importInput" type="file" accept="application/json,.json" hidden>

  <script type="module" src="js/app.js"></script>
</body>
</html>
