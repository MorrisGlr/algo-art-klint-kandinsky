# algo-art-klint-kandinsky

## Project Overview

Browser-based generative art piece using p5.js WEBGL mode. Renders extruded geometric primitives (trapezoids, rectangles, circles, semi-circles, triangles, teardrops) with randomized spatial placement, color, rotation, and z-depth on a portrait canvas. Inspired by the compositional principles of Hilma af Klint and Wassily Kandinsky — specifically their use of geometric abstraction, deliberate color harmonics, and spatial tension between shapes.

This project is one entry in a broader "Computational Art History" series (alongside `algo-art-hopper` and `algo-art-wing-scale`) and is part of a multi-media creative portfolio spanning photography, sculpture, generative art, and paper layering — all housed under a unified Astro 5 portfolio site deployed to GitHub Pages.

## Workflow

- Always use an interview-based approach before planning or implementing features. Ask clarifying questions before starting work.
- When implementing from SPEC.md, read the relevant spec section first, create a step-by-step plan, then implement incrementally with verification at each step.
- When external APIs or downloads fail, pivot quickly to local/offline alternatives rather than retrying failed URLs.

## CLAUDE.md Maintenance

- After any significant implementation work, audit and update CLAUDE.md sections (directory tree, commands, conventions) to match actual repo state.

## Testing

- Always verify the sketch renders correctly in the browser and run any configured tests before reporting completion. Run `npm test` if available; otherwise open `index.html` locally and confirm no console errors.

## Architecture

- Single-page app, no build system, no bundler
- p5.js (v1.4.0) loaded via cdnjs CDN, running in WEBGL mode
- CCapture.js (v1.1.0) for video export (WebM at 60fps), loaded via jsdelivr CDN
- `package.json` exists with `ccapture.js` as a GitHub dependency (`spite/ccapture.js`); local copy in `node_modules/`
- Canvas: 1080×1920 (portrait, 9:16), with CSS responsive sizing (`100vh` height, auto width, centered)
- Deployed to GitHub Pages at `morrisglr.github.io/algo-art-klint-kandinsky`
- No server-side dependencies — pure client-side rendering

## Key Files

- `sketch_with_linear_gradient.js` — canonical sketch file (this is what `index.html` loads via `<script>` tag)
- `index.html` — entry point, loads p5.js and CCapture.js from CDN, then loads the canonical sketch

**Archived iterations:** The repo has ~10 other sketch variants in the root directory (`sketch.js`, `sketch_final_corrected.js`, `sketch_final_fix.js`, `corrected_separated_gradient_sketch.js`, etc.). These are earlier iterations and should eventually move to a `/drafts` directory.

## Conventions

- All shape geometry uses `beginShape()`/`endShape()` with explicit vertex definitions
- Shapes have three face groups: top face, bottom face, side faces (sides are currently flat gray `fill(150)`)
- Color is currently fully random RGB — this is the project's biggest aesthetic weakness and the highest-priority fix
- Animation sequence: sequential shape placement (one every 2 frames, up to 45 shapes) → 0.5s delay → 8.5s full rotation (2π on X and Z axes) → `noLoop()` halts rendering
- Gradient uses a double-lerp via `computeGradient()`: base color is lerped 1% toward white (`0.01`), then each shape lerps 10% between those two nearly-identical colors — net effect is ~0.1% shift, visually broken
- No seed-based randomization exists yet — outputs are not reproducible

## Commands

- **Local preview:** Open `index.html` in a browser (no server needed)
- **Video capture:** Press `C` during animation to toggle CCapture recording
- **Deploy:** Push to `main` branch (GitHub Pages auto-deploys)

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

These are ranked by impact. The first three are code-level fixes that dramatically improve the piece's visual quality. The rest are structural improvements that elevate it from a learning exercise to a portfolio-grade generative art system.

### P0 — Fix the Color System (Critical)

Fully random RGB (`color(random(255), random(255), random(255))`) produces muddy, incoherent compositions that undermine the stated connection to Klint and Kandinsky, who both used deliberate, harmonious palettes. A creative coding curator would immediately notice this disconnect.

**What to do:**
- Switch from RGB to HSB color mode for better control over hue, saturation, and brightness
- Replace random color generation with curated palettes extracted from actual Klint and Kandinsky paintings (e.g., Klint's "The Ten Largest" series, Kandinsky's "Composition VIII", "Several Circles", "Yellow-Red-Blue")
- Each page load should randomly select one palette from a set of 4-6 options
- Within a palette, individual shapes should sample colors with slight HSB variation for richness — not identical swatches, but constrained to the palette's harmonic range
- The background color should complement the selected palette, not always be the same gray

### P1 — Fix the Gradient Bug (Quick Win)

The gradient is implemented as a double-lerp that produces an imperceptible color shift:
1. `computeGradient(baseColor)` creates `c2` via `lerpColor(c1, color(255, 255, 255), 0.01)` — only 1% toward white
2. Each shape's draw function then calls `lerpColor(gradientColors[0], gradientColors[1], 0.1)` — 10% between two nearly-identical colors
3. Net result: ~0.1% color shift from the base, visually indistinguishable

**What to do:**
- Fix the blend factor in `computeGradient()` — increase from `0.01` to `0.15-0.25` for a visible lighter variant
- Consider applying the gradient to the top face only (lighter) while the bottom face uses the base color, creating a sense of light direction

### P2 — Improve Spatial Composition (High Impact)

Random placement within margins produces overlapping clusters and dead zones. No spatial logic governs where shapes land.

**What to do (evaluate these approaches and pick one):**
- **Grid with jitter:** Divide the canvas into cells, place one shape per cell with random offset. Simple, effective, preserves randomness.
- **Poisson disk sampling:** Enforce minimum distance between shape centers. Better visual distribution but more complex.
- **Golden ratio spiral:** Place shapes along a spiral path. More structured, risks looking too "designed."

The chosen approach must be compatible with the sequential animation (shapes appearing one at a time).

### P3 — Add Seed Control (Essential for Generative Art)

There is no way to reproduce a specific composition. Standard practice in generative art is to seed the random number generator and display the seed value, so good outputs can be saved and shared.

**What to do:**
- Implement a seeded PRNG (p5.js `randomSeed()` and `noiseSeed()`)
- Accept seed via URL hash parameter (e.g., `#seed=42`) so compositions are linkable
- Display the current seed in small text in a canvas corner
- Support `R` key to regenerate with a new random seed without page reload

### P4 — Add Lighting (Visual Polish)

The flat gray side faces (`fill(150)`) are functional but crude. p5.js WEBGL supports real lighting.

**What to do:**
- Add `ambientLight()` and `directionalLight()` to create depth
- Use `specularMaterial()` or `ambientMaterial()` instead of flat `fill()` for sides
- Light direction should complement the rotation animation — the reveal should feel like shapes catching light as they turn

### P5 — Add Interactivity (Elevates from Animation to Artwork)

Currently the viewer is entirely passive. Even subtle interaction would distinguish this from a screensaver.

**What to do (pick one to start):**
- Mouse position subtly influences shape rotation angles (parallax effect)
- Mouse proximity causes nearby shapes to gently push away (repulsion)
- Click to freeze/unfreeze the animation

Keep interaction gentle — a suggestion, not a disruption. The existing animation sequence should still function when the mouse is idle.

### P6 — Polish CCapture Export

The CCapture.js integration exists but isn't production-ready for exhibition or social media.

**What to do:**
- Auto-start recording on page load (no keyboard trigger needed for export mode)
- Stop recording after the rotation animation completes
- Include the seed value in the export filename for traceability
- Ensure the exported video loops cleanly if the animation is designed to loop

### P7 — Add Unit Tests

No tests exist. The sketch relies entirely on manual visual inspection, making refactors risky and regressions invisible.

**What to do:**
- Extract pure logic (color computation, gradient calculation, spatial placement, animation timing) out of p5.js draw functions into testable utility functions
- Add a lightweight test runner (e.g., Vitest or plain Node `assert`) — keep it minimal, no heavy framework
- Write unit tests for:
  - `computeGradient()` — verify the lerp produces the expected color values
  - Palette selection — each palette returns valid HSB/RGB values within expected ranges
  - Spatial placement logic — shapes land within canvas bounds, respect margins, satisfy minimum distance constraints (once P2 is implemented)
  - Animation timing — shape count caps at 45, rotation starts after placement phase, `noLoop()` triggers at correct frame
  - Seed reproducibility — same seed produces identical shape/color/position arrays (once P3 is implemented)
- Tests should run headlessly (no canvas needed) — mock or stub p5.js globals where necessary
- Add a `test` script to `package.json`

---

# Strategic Context & Portfolio Vision

> The sections below provide broader context about how this project fits into a creative portfolio and career strategy. They are not code-level guidance — they inform framing, positioning, and non-code decisions.

---

## What Could Use Improvement (Beyond Code)

These are non-code improvements that affect how the work is perceived and discovered. They matter because the generative art community and the traditional art world both evaluate context and framing, not just the visual output.

### No Context at the Live URL

The deployed page shows the animation with no title, no artist name, no explanation, and no instructions. A viewer who receives the link doesn't know it's inspired by butterfly wing scales (wrong project — for this one, Klint and Kandinsky). They don't know to press `C` to record. The experience lacks an on-ramp.

**What to do:** Create a minimal landing page wrapper with: project title, a 2-sentence artist statement, artist name, and keyboard shortcut instructions. The page should use a dark background consistent with the portfolio site's visual language.

### No Artist Statement for the Generative Art Series

This is flagged by the portfolio website context as one of the most significant gaps across the entire creative practice. A curator visiting the portfolio site sees "Klint-Kandinsky" and "Wing-Scale" as titles but cannot evaluate the conceptual depth without visible descriptions. Generative art in particular requires contextual framing to be taken seriously by traditional art institutions.

**What to do:** Write a 1-2 paragraph artist statement that connects the computational approach to the source artists' principles — not "I was inspired by Kandinsky" but "Kandinsky's systematic approach to composition (his 'Point and Line to Plane' treatise, 1926) treated visual elements as a grammar with rules. This project translates that grammar into executable code."

### No Connection to the Portfolio Site

The algo-art pieces exist as standalone GitHub Pages deployments with no link back to the portfolio site (`morrisglr.github.io/creative`). The portfolio site's Algo section should embed or link to each piece with proper metadata (`page.json`).

### No Social Sharing Metadata

No Open Graph tags, no Twitter card metadata, no `<meta>` description. When the link is shared on social media or found via search, it appears as a blank card. This is fixable in the `<head>` of `index.html` with minimal effort.

### No Presence on Creative Coding Platforms

The work is not on OpenProcessing, fxhash, or any generative art community. Discoverability is effectively zero beyond people who receive the GitHub link directly.

---

## Future Directions

### Near-Term (This Project)

1. **Parameterized generative system.** The project currently produces a single fixed animation style. True generative art produces *families* of outputs. Once seed control and curated palettes are in place, the system should be capable of generating visually distinct compositions that all belong to the same aesthetic family — different palette, different spatial arrangement, different shape distribution, same underlying rules.

2. **Gallery/exhibition-ready outputs.** Curate 10-20 specific seeds that produce strong compositions. Export high-resolution video loops and stills for each. These become submittable artifacts for creative coding showcases (Processing Community Day, SIGGRAPH Art Gallery, Ars Electronica Open Call, Gray Area Festival, Eyeo Festival).

3. **Short-form video for social media.** The 1080×1920 portrait format is already optimized for Instagram Reels and TikTok. A 15-second loop with the caption "I wrote code that paints like Kandinsky" would perform well in creative tech circles.

### Medium-Term (Series Level)

4. **"Computational Art History" series expansion.** This piece is one of at least three (alongside Hopper, Wing-Scale). A coherent series of 5-10 pieces — each reverse-engineering a different artist's compositional logic into parametric code — becomes a body of work. Bodies of work get exhibited, written about, and invited. Candidate artists: Mondrian, Agnes Martin, Bridget Riley, de Chirico, Vermeer.

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

- **Curated palettes from source paintings.** The single biggest visual improvement. Turns "inspired by Klint" from vibes into data.
- **Seed control + reproducibility.** Transforms the project from a "motion graphic" into a "generative system" in the strict sense. Unlocks curation, sharing, and exhibition.
- **Interactivity.** Even subtle mouse interaction elevates the work from animation to interactive artwork in curatorial eyes.
- **Series framing.** One sketch is a project. A curated series of 5-10 "Algorithmic Masters" pieces becomes a body of work. Bodies of work get invited.
- **Export pipeline.** The CCapture.js infrastructure exists but isn't polished enough for exhibition-quality video or social-media-ready loops.
- **Submit to showcases.** Processing Community Day, SIGGRAPH Art Gallery, Ars Electronica Open Call, creative coding meetups. The interdisciplinary signal (physician-engineer-artist) is an asymmetric advantage in these venues because that combination essentially does not exist.

### For the Portfolio as a Whole

- **Artist statement page.** Most significant gap. Curators check for this before the work itself.
- **Open Graph / social sharing metadata.** Both on this project's `index.html` and on the portfolio site's `Layout.astro`.
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

2. **Paired with the narrative.** "Ph.D. creates generative art series reinterpreting abstract masters through code" is a story that journalists, curators, and conference organizers want to tell. The interdisciplinary angle is the asset — but only if the art quality matches the narrative ambition. Random RGB colors and no seed control currently undercut this.

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
| Curated palettes + seed control | ~3 hours | Generative system, not animation. Prerequisite for everything below. |
| Clean up repo + CLAUDE.md | ~1 hour | Claude Code can work on the project effectively. |
| Landing page with artist statement | ~1 hour | The live URL becomes presentable to curators and collaborators. |
| 10-20 curated seed outputs | ~2 hours | Submittable artifacts for exhibitions and social media. |
| Post to OpenProcessing + social media | ~1 hour | Discoverability goes from zero to nonzero. |
| Submit to 2-3 creative coding showcases | ~2 hours | External validation, network entry, career signal. |
| About page on portfolio site | ~2 hours | Frames interdisciplinary identity as thesis, not curiosity. |
| Custom domain for portfolio | ~30 min | Professional artist signal, not developer side project. |
| Open Graph metadata on both sites | ~30 min | Social sharing produces visible cards, not blank links. |

Total: ~12-13 hours of focused work. The return: a publicly legible, searchable, shareable identity platform that compounds with every new piece, every publication, and every startup milestone.

---

## Dependencies and Known Issues

- **p5.js CDN loading:** p5.js v1.4.0 loads from cdnjs (`cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js`). Version is pinned but CDN availability is a dependency.
- **CCapture.js CDN loading:** CCapture.js v1.1.0 loads from jsdelivr (`cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.all.min.js`). Also available locally via `node_modules/ccapture.js` but the CDN version is what `index.html` references.
- **Portrait canvas sizing:** The 1080×1920 canvas is hardcoded but CSS responsive sizing (`100vh` height, auto width, centered) adapts to viewport.
- **Unused variable:** `canvasAttributes` is defined in `setup()` but never passed to `createCanvas()` — dead code.
- **`package.json` exists** with `ccapture.js` as the sole dependency (GitHub source). Minimal — no build scripts, no test runner.
