
# Birdle AU — Daily Bird Guessing Game

A lightweight, front-end web app (no backend required) inspired by daily guessing games. Players have **5 guesses** to identify the **bird of the day** based on hints across taxonomy, size, colours, habitat, region, and silhouette.

## Features
- Deterministic **daily bird** based on UTC date (same for everyone).
- **Small Australian bird dataset** (20 species; easily extensible).
- **Autocomplete** for valid bird names; clear hint cards per guess.
- **Shareable emoji grid** summary — no spoilers.
- Progress and simple stats saved to **localStorage**.
- Accessible HTML (labels, ARIA live regions) and responsive design.

## Run locally
1. Download or clone this folder.
2. Open a terminal in the folder.
3. Start a local server (recommended):
   ```bash
   python3 -m http.server 8000
   ```
4. Navigate to `http://localhost:8000` and open `index.html`.

> You can also open `index.html` directly in your browser, but some browsers block `datalist`+`fetch`/clipboard features on the `file://` protocol. Use a local server for best results.

## Customize
- Edit `script.js` to add birds (extend the `BIRDS` array). Keep fields consistent.
- Change the `SALT` constant to reshuffle the calendar mapping.
- Tweak scoring in `compareBirds()` / `scoreToSquares()` for different hint logic.

## Deploy
Static hosting works great: GitHub Pages, Netlify, Vercel, Azure Static Web Apps.

## Attribution & notes
- Species info is simplified to suit gameplay; **not a definitive field guide**. Verify details with trusted sources.
- Consider sourcing images from Wikimedia Commons and crediting authors if you add images.

## Optional backend (if you want server authority)
This app is fully client-side. If you'd prefer the server to choose the daily bird (for anti-cheat and calendar control), create a minimal endpoint that returns `{date, birdId}` based on UTC. The client can then fetch that JSON and use the ID to lock the puzzle.
