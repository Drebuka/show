# Models

- `elmina-castle.glb` — **the reconstruction**, exported from the Blender master
  by `blender/scripts/bake_and_export.py`. Interpretive reconstruction based on
  authorised reference material; not survey data. Metres, +Y up, 1.5 m on its
  longest side (about 1:159), base at y = 0, entrance side facing +Z.
- `elmina-castle.web.glb` — the compact copy the page loads (Meshopt compression),
  made from `elmina-castle.glb` by `npm run compress:model`.
- `textures/elmina-*-detail.webp` — the model's full-resolution textures. The GLB
  holds light copies so it loads quickly; the page swaps these in afterwards.
- `elmina-castle.anchors.json` — label positions for the reconstruction (generated).
- `elmina-castle.usdz` — the same model exported for iOS Quick Look. Not used
  by default; see `web-ar/README.md` section 7.
- `elmina-massing.glb`, `elmina-massing.anchors.json` — small generated fallback,
  shown only if `elmina-castle.glb` is missing (`npm run generate:model`).

Do not edit these by hand: rebuild from `blender/scripts/`.
