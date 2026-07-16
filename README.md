# minimaCore App Store (MiniDapp)

A MiniDapp for **Minima Classic** (the official MDS node with MiniHub) with three tabs:

1. **Android Apps** — a web clone of the native **PandaApps** APK store. Fetches the **same**
   catalog the native app reads —
   `https://raw.githubusercontent.com/eurobuddha/minima-core-apks/main/apks.json` — and renders
   every app grouped exactly like the native app (**YOUR APPS** / **OFFICIAL MINIMA** / **MORE**),
   each with a **Download** button.
2. **PandaDapps** — the community MiniDapp store (`https://eurobuddha.com/pandadapps.json`),
   with **one-tap Install** straight onto the node this MiniDapp is running on.
3. **Minima Dapps** — the eurobuddha-hosted official Minima MiniDapp catalog
   (`https://eurobuddha.com/store/minimadapps.json`), same one-tap Install.

## Install mechanics

- **APKs are download-only, by design.** A MiniDapp runs in the MDS webview and **cannot** invoke
  Android's package installer (native-only). So the Android tab is a bootstrap: tap **Download** →
  install manually → once you have **PandaApps**, that native app auto-updates the rest.
- **MiniDapps install directly.** Install = `MDS.file.download(url)` →
  `MDS.file.getpath("/download/…")` → `mds action:install file:<path> trust:read`. If the store
  only has read permission, the `mds` command lands in the **Pending** MiniDapp for the user to
  approve (the UI says so). Cards show **Installed ✓ / Update** by matching the node's `mds` list
  by dapp name. The official catalog's string-or-array `description` quirk is normalized.

All three catalogs are fetched live, so the MiniDapp needs no per-release maintenance.

## Files

| File | Purpose |
|------|---------|
| `dapp.conf` | MiniDapp manifest (name, version, icon, description, category) |
| `index.html` | The store UI — `MDS.net.GET` the catalog, render grouped cards + disclaimer |
| `mds.js` | The MDS library (fetch the external catalog without CORS issues) |
| `favicon.png` | Store icon (the PandaApps panda) |
| `build.sh` | Packages `*.mds.zip` with `dapp.conf` first (required by MiniHub) |

## Build

```bash
./build.sh          # → minimaCore-App-Store-<version>.mds.zip
```

## Publish

Hosted at `https://eurobuddha.com/panda_dapps/` and listed in the PandaDapps catalog
(`https://eurobuddha.com/pandadapps.json`). Deploy is over SSH/scp to the Apache server
(the GitHub repo is source-only and does not auto-publish):

```bash
scp minimaCore-App-Store-<ver>.mds.zip eurobuddha.com:/var/www/html/panda_dapps/
scp favicon.png                        eurobuddha.com:/var/www/html/panda_dapps/minimacore-appstore.png
# then add an entry to pandadapps.json and scp it to /var/www/html/pandadapps.json
```

## Licence

MIT © 2026 eurobuddha. Experimental software, provided **as is** — use at your own risk.
