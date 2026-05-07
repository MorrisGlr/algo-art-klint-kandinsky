# algo-art-klint-kandinsky

## Project Overview

Browser-based generative art piece using p5.js WEBGL mode. Renders extruded geometric primitives (trapezoids, rectangles, circles, semi-circles, triangles, teardrops) with randomized spatial placement, color, rotation, and z-depth on a portrait canvas. Ships two painter profiles selectable via URL param: the default (`?painter=klint-kandinsky`) is inspired by Hilma af Klint and Wassily Kandinsky — geometric abstraction, deliberate color harmonics, spatial tension; `?painter=mondrian` is inspired by Piet Mondrian — primary palettes, orthogonal rectangle-only compositions, sparse grid.

This project is one entry in a broader "Computational Art History" series (alongside `algo-art-hopper` and `algo-art-wing-scale`) and is part of a multi-media creative portfolio spanning photography, sculpture, generative art, and paper layering — all housed under a unified Astro 5 portfolio site deployed to GitHub Pages.

## Workflow

- Always use an interview-based approach before planning or implementing features. Ask clarifying questions before starting work.
- When implementing from SPEC.md, read the relevant spec section first, create a step-by-step plan, then implement incrementally with verification at each step.
- When external APIs or downloads fail, pivot quickly to local/offline alternatives rather than retrying failed URLs.

## CLAUDE.md Maintenance

- After any significant implementation work, audit and update CLAUDE.md sections (directory tree, commands, conventions) to match actual repo state.

## Testing

- Always verify the sketch renders correctly in the browser and run `npm test` before reporting completion.
- `npm test` runs the Vitest suite (5 test files in `test/`): `palette.test.js`, `spatial.test.js`, `gradient.test.js`, `seed.test.js`, `animation.test.js`.
- Tests run headlessly via Node — no browser required. A `test/helpers/p5mock.js` stubs p5 globals.

## Architecture

- Single-page app with **Vite** build system and ES modules
- p5.js **v1.11.12** installed via npm (not CDN); dynamically imported in `src/main.js` to avoid module hoisting issues with global mode
- Two painter profiles ship: `src/klint-kandinsky.js` (Klint + Kandinsky, 5 palettes, 6×11 grid) and `src/mondrian.js` (Mondrian, 5 palettes, 4×6 grid, rectangles only). `src/painters.js` is the registry; active profile is selected at runtime via `?painter=<key>` URL param (default: `klint-kandinsky`). Adding painter #3 = create file + add one entry to `painters.js`
- `selectPalette(palettes)` and `computePlacementPositions(grid)` are parameter-driven — no profile is hardcoded in `palette.js` or `spatial.js`
- Recording uses the native MediaRecorder API (no CDN) — `startRecording()` / `stopRecording()` in `sketch.js`; triggered by C key, `?export=true` URL param, or the "Export video" button in the info panel
- Canvas: 1080×1920 (portrait, 9:16), with CSS responsive sizing; layout is side-by-side (info panel left, canvas right) on wide screens, stacked on mobile
- Deployed to GitHub Pages at `morrisglr.github.io/algo-art-klint-kandinsky` via GitHub Actions (Vite build → `dist/`)
- No server-side dependencies — pure client-side rendering

## Key Files

```
algo-art-klint-kandinsky/
  src/
    main.js              — bootstrap: dynamic p5 import, hands off to initSketch()
    sketch.js            — setup(), draw(), keyPressed(), mousePressed(), seed & export logic; resolves active painter from ?painter= URL param
    config.js            — rendering constants (canvas size, shape counts, timing, etc.)
    painters.js          — painter registry: imports all profiles, exports PAINTERS map and DEFAULT_PAINTER
    klint-kandinsky.js   — painter profile: 5 curated HSB palettes + grid {cols:6, rows:11} + no shapeTypes restriction
    mondrian.js          — painter profile: 5 curated HSB palettes + grid {cols:4, rows:6} + shapeTypes:['rectangle'] + rotationMode:'fixed'
    palette.js           — color functions: selectPalette(palettes), sampleColor(), computeGradient(); no hardcoded profile import
    shapes.js            — 6 shape draw functions: drawTrapezoid, drawRectangle, drawCircle, drawSemiCircle, drawTriangle, drawTeardrop
    spatial.js           — grid + jitter placement; computePlacementPositions(grid), computeGridCells(); no hardcoded profile import
    animation.js         — animation state machine: PLACING → DELAYING → ROTATING → COMPLETE
  test/
    helpers/p5mock.js     — headless p5 global stubs for Vitest
    palette.test.js
    spatial.test.js
    gradient.test.js
    seed.test.js
    animation.test.js
  public/
    og-image.png    — social sharing image (1200×630)
    robots.txt
    sitemap.xml
  drafts/           — 11 archived sketch iterations (moved from root)
  index.html        — Vite entry point, landing page HTML (info panel + canvas container)
  vite.config.js
  package.json
  README.md
  SPEC.md
  CHANGELOG.md      — working lab notebook; read at session start, update at session end
  demo.mp4          — local copy of the animation demo video
  google58c296d5b2305ccf.html  — Google Search Console domain verification
  .github/
    workflows/
      deploy.yml    — GitHub Actions: Vite build → GitHub Pages deploy
```

## Conventions

- All shape geometry uses `beginShape()`/`endShape()` with explicit vertex definitions
- Shapes have three face groups: top face (lighter gradient color), bottom face (base color), side faces (muted complementary HSB color via `computeSideColor()`)
- Color uses **HSB mode** (`colorMode(HSB, 360, 100, 100)`) with 5 curated palettes per painter (10 total: Klint/Kandinsky + Mondrian), extracted from actual source paintings; shapes sample colors with per-palette HSB variation
- Gradient: `computeGradient(baseColor)` lerps `GRADIENT_LERP_AMOUNT` (0.2) toward white — top face is visibly lighter than the base
- Animation sequence: sequential shape placement (one every 2 frames, up to 45 shapes) → 0.5s delay → 8.5s full rotation (2π on X and Z axes) → COMPLETE phase (parallax + click-to-freeze active; draw loop continues)
- Lighting: `ambientLight(60)` + `directionalLight(200, 200, 200, 1, -1, -1)` — top-right direction
- Seed control: `randomSeed(currentSeed)` in `initComposition()`; seed read from `#seed=N` URL hash or random on load; seed displayed in canvas corner overlay; URL hash updated on init
- `R` key — regenerate with new random seed; `Click` — freeze/unfreeze after animation completes; `C` key — manual recording toggle; `?export=true` — auto-start/stop export; `Copy seed link` button — shares the current composition URL (clipboard on desktop, OS share sheet on mobile); `Export video (.webm)` button in info panel — replays full animation and downloads recording (enabled only at COMPLETE phase)
- Rendering constants (canvas size, shape counts, timing, gradient) live in `src/config.js`; painter-specific constants (palette data, grid, shapeTypes) live in the painter profile files (`src/klint-kandinsky.js`, `src/mondrian.js`) — do not hardcode these values in other files
- Painter profile optional fields: `shapeTypes: ['rectangle', ...]` restricts draw functions (default: all 6); `rotationMode: 'fixed'` locks rotation to 0, `'orthogonal'` picks from 0°/90°/180°/270°, absent = `'free'` (random full rotation)
- `?painter=klint-kandinsky` or `?painter=mondrian` in the URL selects the active painter at load time; `?painter=` is preserved through seed updates and refresh — combine with `#seed=N` for fully reproducible compositions. The info panel painter tabs (Klint & Kandinsky | Mondrian) call `switchPainter(key)` in `sketch.js` for dynamic reinit without a page reload; switching resets `activePaletteIndex` since palettes are painter-specific.
- `?palette=N` (0-indexed) pins the active palette; the info panel `← / →` buttons set this param via `history.replaceState` and trigger a full animation replay with the same seed; `R` key keeps the pinned palette; "Copy seed link" captures the full URL including `?palette=N`
- Shape objects carry `aspectRatio` (random 0.4–2.5); `drawRectangle` uses `size * aspectRatio` for width and `size` for height, producing true rectangles rather than always-square shapes

## Commands

- **Dev server:** `npm run dev` (Vite, default port 5173)
- **Build:** `npm run build` (outputs to `dist/`)
- **Tests:** `npm test` (Vitest, headless)
- **Video capture (manual):** Press `C` during animation to toggle CCapture recording
- **Video export (auto):** Open `/?export=true` in browser — auto-starts on load, auto-stops and downloads after rotation completes; filename includes current seed
- **Deploy:** Push to `main` branch (GitHub Actions runs `npm run build` and deploys `dist/` to GitHub Pages)

## Development Log

This project maintains `CHANGELOG.md` as a working lab notebook — not a user-facing release log. It exists so that successive AI sessions (and the developer returning after a break) do not re-discover the same dead ends.

**At the start of each working session:** Read `CHANGELOG.md` to orient. Check "Failed Approaches" before proposing any approach — if it is listed there, do not attempt it again without a materially different strategy.

**At the end of each working session:** Update `CHANGELOG.md` with:
- Any tasks completed (move from "In Progress" to "Completed")
- Any approaches that failed — describe what was tried, what happened, and why it didn't work. This is the most important section.
- Any new known limitations discovered
- Any accuracy/quality checkpoints (e.g., visual output comparisons, test results) as small tables

**Structure of `CHANGELOG.md`:**

```
## Current Status
One-paragraph snapshot of where the project stands right now.

## Completed
Timestamped list of finished work, newest first.

## In Progress
What is actively being worked on.

## Failed Approaches
For each dead end: what was tried, what happened, why it was abandoned. Never delete entries.

## Known Limitations
Current constraints, bugs, or design gaps that are accepted for now.

## Checkpoints
Tables of quality/accuracy measurements at significant milestones.
```

## Code Quality Standards

- Prefer `const`/`let` over `var`
- Use descriptive function names for shape drawing (`drawTrapezoid`, `drawTeardrop`, etc.)
- Keep randomization parameters as named constants at the top of the file for easy tuning
- When refactoring, preserve the sequential animation logic — shapes must appear one at a time before the rotation reveal

---

## Current Priorities

P0–P7 from the original spec are **all implemented**. The following open items remain.

### Completed (P0–P7 summary)

| Priority | Feature | Status |
|---|---|---|
| P0 | Color system — HSB mode, 5 curated Klint/Kandinsky palettes | ✅ Done (`src/klint-kandinsky.js` data, `src/palette.js` functions) |
| P1 | Gradient fix — `GRADIENT_LERP_AMOUNT: 0.2`, top face visibly lighter | ✅ Done (`src/config.js`, `src/palette.js`) |
| P2 | Spatial composition — 6×11 grid with jitter + 30% skip for negative space | ✅ Done (`src/spatial.js`) |
| P3 | Seed control — URL hash `#seed=N`, R key, seed overlay, reproducible output | ✅ Done (`src/sketch.js`) |
| P4 | Lighting — `ambientLight(60)` + `directionalLight()` top-right direction | ✅ Done (`src/sketch.js`) |
| P5 | Interactivity — Y-axis mouse parallax after animation; click to freeze/unfreeze | ✅ Done (`src/sketch.js`) |
| P6 | CCapture export — `?export=true` URL param, auto-start/stop, seed in filename | ✅ Done (`src/sketch.js`) |
| P7 | Unit tests — Vitest, 5 test suites, headless p5 mock | ✅ Done (`test/`) |

### Open Items

- ~~**Embed screenshot or GIF in README**~~ — ✅ Done (MP4 video via GitHub CDN)
- ~~**Expand artist statement**~~ — ✅ Done (3 paragraphs: artistic reference, algorithmic approach, series context)
- ~~**Rewrite seed URL instruction as plain English**~~ — ✅ Done (full example URL in controls)
- ~~**WebGL browser-compatibility notice**~~ — ✅ Done (README Technical Overview)
- ~~**Add "Copy link" / share button**~~ — ✅ Done (`Copy seed link` button in `#seed-bar`; clipboard on desktop, native share sheet on mobile)
- ~~**QUICKSTART / Run Locally section in README**~~ — ✅ Done (Node v18+ prereq, npm install/dev, localhost:5173, 4-row script table; clarifying sentence added to Technical Overview)
- **Submit to creative coding platforms** — OpenProcessing, fxhash, Processing Community Day, SIGGRAPH Art Gallery; discoverability is currently near zero beyond direct GitHub links.
- **Curate 10-20 seed outputs** — run the export pipeline on strong seeds, save as submittable artifacts for exhibitions and social media.

---

# Strategic Context & Portfolio Vision

> The sections below provide broader context about how this project fits into a creative portfolio and career strategy. They are not code-level guidance — they inform framing, positioning, and non-code decisions.

---

## What Could Use Improvement (Beyond Code)

These are non-code improvements that affect how the work is perceived and discovered. They matter because the generative art community and the traditional art world both evaluate context and framing, not just the visual output.

### ✅ Landing Page with Context (Done)

The deployed page has a title ("Klint & Kandinsky"), artist name (Morris Aguilar), a 3-paragraph artist statement (artistic reference, algorithmic approach, series context), keyboard shortcut instructions, and a portfolio link. Dark background (#1a1a1a) matches portfolio visual language.

### ✅ Artist Statement — Expanded (Done)

The statement in `index.html` is 3 paragraphs: (1) artistic reference + conceptual frame (Klint/Kandinsky visual grammars), (2) algorithmic approach (5 palettes, 30% cell-skip, 6 primitives, 3D extrusion), (3) series context (Computational Art History, reproducible by seed). Suitable for curatorial and residency contexts.

### ✅ Connection to Portfolio Site (Done)

The live page links back to the portfolio site via `<a href="https://morrisglr.github.io/creative" rel="author">` with `rel="author"` for SEO.

### ✅ Social Sharing Metadata (Done)

`index.html` now includes full OG tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Card tags, `<meta name="author">`, `<link rel="canonical">`, and JSON-LD `VisualArtwork` structured data.

### No Presence on Creative Coding Platforms

The work is not on OpenProcessing, fxhash, or any generative art community. Discoverability is currently near zero beyond direct GitHub links. Submitting here is the highest-leverage discoverability action remaining.

---

## Future Directions

### Near-Term (This Project)

1. **Parameterized generative system.** ✅ Seed control and 5 curated palettes are in place — the system already generates visually distinct compositions that belong to the same aesthetic family. Next step: curate 10-20 strong seeds as submittable artifacts and expose the palette/grid parameters to viewers (e.g., a palette cycle button).

2. **Gallery/exhibition-ready outputs.** Curate 10-20 specific seeds that produce strong compositions. Export high-resolution video loops and stills for each. These become submittable artifacts for creative coding showcases (Processing Community Day, SIGGRAPH Art Gallery, Ars Electronica Open Call, Gray Area Festival, Eyeo Festival).

3. **Short-form video for social media.** The 1080×1920 portrait format is already optimized for Instagram Reels and TikTok. A 15-second loop with the caption "I wrote code that paints like Kandinsky" would perform well in creative tech circles.

### Medium-Term (Series Level)

4. **"Computational Art History" series expansion.** This piece is one of at least three (alongside Hopper, Wing-Scale). A coherent series of 5-10 pieces — each reverse-engineering a different artist's compositional logic into parametric code — becomes a body of work. Bodies of work get exhibited, written about, and invited. ~~Mondrian~~ ✅ (shipped as `?painter=mondrian`). Remaining candidates: Agnes Martin, Bridget Riley, de Chirico, Vermeer.

5. **Shared Custom Skill across the series.** A `generative-art-p5` skill encoding common standards (HSB color mode, seed control, portrait canvas, CCapture pipeline, named constants for parameters) would benefit every project in the series. Build once, apply everywhere.

6. **Artist statement + About page on the portfolio site.** The portfolio website context identifies this as the single highest-friction gap across the entire creative practice. The statement should frame the interdisciplinary identity as a thesis, not a curiosity: "I make work about how knowledge is structured, visualized, and transformed — whether that is a medical note, a textbook, or an algorithm."

### Long-Term (Portfolio + Career Level)

7. **Custom domain for the portfolio site.** `morrisglr.github.io/creative` signals "developer side project." A domain like `morrisaguilar.art` signals "professional artist." Curators and gallery directors notice this. Cost: ~$12/year.

8. **CV/exhibition history page.** Standard expectation for artists seeking gallery representation or residencies.

9. **Blog/writing section.** Even 3-4 short essays on the intersection of medicine, AI, and creative practice would create searchable, shareable content. A portfolio of images has a narrow discovery surface; a portfolio with essays has a vastly wider one.

---

## How to Improve Impact

These are drawn from both the project-level and portfolio-level context documents, merged and deduplicated.

### For This Project Specifically

- ~~**Curated palettes from source paintings.**~~ ✅ Done — 5 palettes extracted as HSB values from actual Klint and Kandinsky paintings.
- ~~**Seed control + reproducibility.**~~ ✅ Done — `#seed=N` URL hash, R key regeneration, seed overlay, reproducible output per pinned p5.js version.
- ~~**Interactivity.**~~ ✅ Done — Y-axis mouse parallax after animation; click to freeze/unfreeze; `Copy seed link` share button.
- **Series framing.** One sketch is a project. A curated series of 5-10 "Algorithmic Masters" pieces becomes a body of work. Bodies of work get invited.
- ~~**Export pipeline.**~~ ✅ Done — "Export video (.webm)" button in info panel replays animation and downloads recording via MediaRecorder.
- **Submit to showcases.** Processing Community Day, SIGGRAPH Art Gallery, Ars Electronica Open Call, creative coding meetups. The interdisciplinary signal (physician-engineer-artist) is an asymmetric advantage in these venues because that combination essentially does not exist.

### For the Portfolio as a Whole

- **Artist statement page.** Most significant gap. Curators check for this before the work itself.
- ~~**Open Graph / social sharing metadata on this project.**~~ ✅ Done — full OG tags, Twitter Card, JSON-LD in `index.html`. Still needed: portfolio site's `Layout.astro`.
- **Contact page on the portfolio site.** Currently the only contact info is in the GitHub README.
- **Process documentation.** Curators increasingly value seeing how the work was made. Even 1-2 process screenshots per series would differentiate.
- **Connect creative work to the startup narrative.** Palentra targets documentation-heavy institutional workflows. The creative portfolio is literally a documentation system for creative work. The pattern is identical: take messy, heterogeneous content, impose structure, present it for professional evaluation.

---

## What Would Make It Genuinely Infeasible Before

The project in its current form was feasible before. p5.js has supported WEBGL mode since 2017. Randomized 3D primitives, camera rotation, and CCapture.js integration are established techniques. A motivated creative coder could have built this at any point in the last decade.

To cross into structurally new territory, the project would need to leverage capabilities that didn't exist before ~2023-2024:

### LLM-Driven Compositional Intelligence

Use an LLM to analyze a specific Klint or Kandinsky painting, extract compositional rules (spatial relationships, color harmonics, shape proportions, density patterns), and generate p5.js parameters programmatically. This turns "inspired by Klint" from aesthetic intuition into data-driven parametric generation. A multimodal model analyzing a painting and outputting a JSON configuration for the sketch is a capability that genuinely didn't exist before.

### Real-Time Style Transfer

Use a neural style transfer model (TensorFlow.js, ONNX Runtime Web) to post-process the p5.js canvas in real time, applying the actual brushstroke texture and color temperature of a source painting to the generated geometry. Browser-accessible ML inference at this quality level is a recent capability.

### Mass Personalization at Scale

Generate thousands of unique compositions using LLM-guided parameter search, with each output curated for aesthetic quality by a vision model. This "taste at scale" approach — where judgment is human but execution is AI-assisted — is genuinely new.

### For the Portfolio Site: AI-Driven Curation

Use an LLM to automatically generate artist statements, exhibition proposals, or curatorial notes for each series based on visual content and metadata. This converts the portfolio from a static archive into a generative curatorial system. Separately, cross-media semantic linking via embeddings (CLIP, BLIP) could let visitors navigate by visual concept rather than media type — connecting a textbook sculpture to a generative video piece based on shared compositional patterns.

---

## Reframing for Asymmetric Optionality

### The Current State

This project proves the creator can ship creative code. As a standalone artifact, it creates limited leverage. The portfolio site provides a platform that absorbs new work with near-zero marginal cost, but it does not yet connect to any professional network, gallery system, or discovery mechanism. It does not generate inbound interest and does not position itself within any art-world conversation.

### The Reframe

The portfolio becomes strategically compounding when positioned as **the public evidence layer for an interdisciplinary identity that is genuinely scarce.** The combination — Ph.D. (bioinformatics + clinical medicine) + applied AI research + serious multi-media creative practice + startup co-founder — is a profile that barely exists. The AAMC profiles a handful of physician-artists. A Ph.D. who builds generative art systems, carves textbooks, and shoots film is vanishingly rare.

**This project compounds when it is:**

1. **Part of a series, not a standalone piece.** A single sketch is forgettable. A "Computational Art History" series — each piece reverse-engineering a different artist's spatial and compositional logic into parametric 3D systems — becomes a portfolio that signals a unique capability: someone who can bridge art history, spatial computing, and generative systems.

2. **Paired with the narrative.** "Ph.D. creates generative art series reinterpreting abstract masters through code" is a story that journalists, curators, and conference organizers want to tell. The interdisciplinary angle is the asset — the art quality now matches the narrative ambition (curated palettes, seed control, lighting, interactivity). The remaining gap is curation and submission.

3. **Connected to the startup.** Palentra targets documentation-heavy institutional workflows. The creative portfolio is a documentation system for creative work. The pattern is identical: take messy, heterogeneous content (medical notes / art across four media), impose structure (JSON schemas / content architecture), present it for professional evaluation (clinical quality / curatorial review). Making this parallel explicit is compelling to investors, collaborators, and press.

4. **Used as a Chicago entry point.** Chicago has a strong creative coding scene (School of the Art Institute's Art and Technology department, creative coding communities, the Museum of Contemporary Art's digital programming, active gallery scenes in Pilsen, West Loop, and River North). Showing up with a polished generative art portfolio is a concrete way to build the arts/tech network.

---

## The Difference Between a Project and a Strategy

Right now, `algo-art-klint-kandinsky` is a **project**: a finished artifact that exists but doesn't compound.

It becomes a **strategy** when it is explicitly connected to:

1. **The "Computational Art History" series** — one piece is a weekend project; a series that systematically translates different painters' compositional logic into parametric 3D systems becomes a recognizable artistic identity.
2. **The portfolio site** — with an artist statement, proper metadata, and curatorial framing that makes the generative art legible to both tech and art audiences.
3. **The Palentra startup** — shared pattern of structuring heterogeneous content for professional evaluation, cited explicitly in pitch conversations.
4. **The clinical AI research** — shared pattern of quality evaluation of generated/documented artifacts, creating a coherent "I decompose complex human artifacts into parametric systems" narrative.
5. **The Chicago art/tech ecosystem** — submitted to showcases, presented at meetups, positioned as entry point for an interdisciplinary identity in a city that values it.

### To Convert Project → Strategy

| Action | Effort | What It Unlocks |
|---|---|---|
| ~~Curated palettes + seed control~~ | ~~3 hrs~~ | ✅ Done — generative system, not animation |
| ~~Clean up repo + CLAUDE.md~~ | ~~1 hr~~ | ✅ Done |
| ~~Landing page with artist statement~~ | ~~1 hr~~ | ✅ Done — live URL is presentable to curators |
| ~~Open Graph metadata on both sites~~ | ~~30 min~~ | ✅ Done (this project) — still needed on portfolio site |
| ~~Expand artist statement to 3 paragraphs~~ | ~~30 min~~ | ✅ Done — 3 paragraphs in `index.html` |
| 10-20 curated seed outputs | ~2 hours | Submittable artifacts for exhibitions and social media |
| Post to OpenProcessing + social media | ~1 hour | Discoverability goes from zero to nonzero |
| Submit to 2-3 creative coding showcases | ~2 hours | External validation, network entry, career signal |
| About page on portfolio site | ~2 hours | Frames interdisciplinary identity as thesis, not curiosity |
| Custom domain for portfolio | ~30 min | Professional artist signal, not developer side project |

Remaining: ~7 hours. The foundation (palettes, seed control, landing page, OG metadata, share button, QUICKSTART) is in place — the next highest-leverage actions are curation and submission.

---

## Dependencies and Known Issues

- **p5.js:** v1.11.12 installed via npm (`dependencies`). Do NOT upgrade to p5.js 2.x — it requires instance mode, which would force `p.` prefix on every p5 call throughout `src/`.
- **MediaRecorder API:** Native browser API used for all recording (`C` key and `?export=true`). No CDN dependency. `canvas.captureStream(60)` feeds a `MediaStream` into `MediaRecorder`; `onstop` assembles the recorded chunks into a `.webm` blob and downloads it. Supported in Chrome, Firefox, and Safari 14.1+. CCapture.js was removed — it relied on `canvas.toDataURL('image/webp')` which Firefox and Safari handle strictly per the WebGL spec (blank frames when `preserveDrawingBuffer` is false).
- **Vite:** v6.x devDependency. Base path configured to `/algo-art-klint-kandinsky/` in `vite.config.js` for GitHub Pages sub-path deployment.
- **Vitest:** v3.x devDependency. Test environment is `node`; p5 globals are stubbed in `test/helpers/p5mock.js`.
- **Portrait canvas sizing:** The 1080×1920 canvas is hardcoded in `src/config.js` (`CANVAS_WIDTH`, `CANVAS_HEIGHT`). CSS responsive sizing adapts to viewport.
- **Seed reproducibility:** Guaranteed within a pinned p5.js version only. Document this if sharing seeds publicly.
