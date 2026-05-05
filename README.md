# Klint and Kandinsky Algorithmic Art

## Overview
I was inspired to make this [algorithmic art](https://en.wikipedia.org/wiki/Algorithmic_art) (algo art) from the pioneering works of [Wassily Kandinsky](https://en.wikipedia.org/wiki/Wassily_Kandinsky) and [Hilma af Klint](https://en.wikipedia.org/wiki/Hilma_af_Klint). My JavaScript-based project uses the p5.js library to dynamically generate artwork that captures the essence of abstract paintings with a modern twist. The algorithmic approach to creating art not only pays homage to the masters of abstract painting but also explores the possibilities that emerge when art intersects with technology.

<b>You can view the animation in your own browser by following [this link](https://morrisglr.github.io/algo-art-klint-kandinsky/)! Get a new random animation each time you refresh the page.</b>

https://github.com/user-attachments/assets/868af39e-aa54-4428-8cef-fb428973add5

## Visual Description 
In the animation, colorful shapes are scattered on the canvas that gives the viewer the impression that they are viewing a 2D plane, but once the canvas is populated with shapes, the viewer can see that the shapes are actually 3D objects. The point of view rotates to reveal that the shapes have variable depth, occupy 3D space, 

## Conceptual Inspiration
The colors and shapes are inspired by the works of Kandinsky and af Klint, who were known for their use of [vibrant colors](https://en.wikipedia.org/wiki/Hilma_af_Klint#/media/File:Hilma_af_Klint_-_Group_IX_UW_No._25,_The_Dove,_No._1_(13912).jpg) and [geometric forms](https://en.wikipedia.org/wiki/Wassily_Kandinsky#/media/File:Vassily_Kandinsky,_1923_-_On_White_II.jpg). It is a testament to the enduring influence of their artistry and an exploration of how their visionary approaches to abstraction can be reinterpreted in the digital age.

## Technical Overview

- **Stack:** JavaScript, [p5.js](https://p5js.org/) (WEBGL mode), Vite
- **Rendering:** 6 extruded 3D primitives (trapezoid, rectangle, circle, semi-circle, triangle, teardrop) placed on a probabilistic grid; 5 color palettes extracted from source Klint and Kandinsky paintings
- **Randomness:** Every composition is seeded — same seed always produces the same output. Share a specific composition via URL (`#seed=42`)
- **Browser:** Runs in any modern browser with WebGL. Older Safari versions and some mobile browsers may fail silently.
- **Local development:** See [Run Locally](#run-locally) below

## Run Locally

**Prerequisites:** Node.js v18+

```bash
git clone https://github.com/MorrisGlr/algo-art-klint-kandinsky.git
cd algo-art-klint-kandinsky
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest suite (5 test files, headless) |

## About

Morris Aguilar, M.D./Ph.D., has work that spans clinical AI and computational biology. This project is the first entry in the Computational Art History series, a body of work that translates each painter's spatial and color logic into a parametric, browser-based generative system.

## Contact

[@morrisglr.bsky.social](https://bsky.app/profile/morrisglr.bsky.social) · [Creative Portfolio](https://mementomorris.art/) · [LinkedIn](https://www.linkedin.com/in/morris-a-aguilar/)