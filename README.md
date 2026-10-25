# Calibre Atelier

An interactive Three.js watch study inspired by the Rolex Submariner Date 126610LV, the Raptor engine exploded-view demonstration, and a technical instrument workspace. The page and 3D background are pure white.

[Open the live experience](https://thanujgthub.github.io/calibre-atelier/)

## Run

Requires Node.js 20.19+ or 22.12+.

```powershell
git clone https://github.com/Thanujgthub/calibre-atelier.git
cd calibre-atelier
npm install
npm run dev -- --port 5173
```

Open http://localhost:5173.

```powershell
npm run build
npm run preview
```

## Explore

- Drag to orbit; scroll or use the zoom buttons to zoom.
- Drag the assembly slider or choose **Explore the assembly** to separate the watch.
- Play/pause a 5.5-second assembly or disassembly sequence.
- Select one of nine component groups from the list or by clicking the model. Isolate a component to inspect it.
- Use **SECTION** to cut away half of the outer shell, **WIREFRAME** for mesh inspection, and **NAMES** for anchored part labels.
- The hands, gears and balance animate. Pause the mechanism or switch between 1× and 10× playback. The balance trace illustrates a 4 Hz cycle; it is not measured performance data.
- Switch to a front view or drag the rotation slider to orbit.
- Export the current visible assembly as a named GLB model.
- Keyboard: Tab to the viewer, use arrow keys to orbit and + / − to zoom. The slider supports arrow keys and Home / End. Escape closes the reference dialog.
- Reduced-motion preferences replace assembly transitions with immediate changes.

## Model and references

378 meshes form nine component groups: crystal, bezel, hands, dial, movement, rotor, case, case back, and bracelet. Geometry is generated locally in `src/watch.js`. Curved case profiles, brushed-metal textures, sapphire highlights and a locally bundled studio HDR environment distinguish the surfaces. The interface is in `src/app.js` and `src/workbench.css`. Fonts use Google Fonts with system fallbacks. No remote 3D asset or runtime HDR download is required.

This is an independent illustrative model, not an exact Rolex movement, service guide, or manufacturing CAD model. The published 41 mm / calibre 3235 / approximately 70-hour specifications refer to the real watch. The model uses arbitrary scene units. GLB is a visual mesh format, not a STEP solid.

- [Raptor 3 interaction reference by Konstantin Saifoulline](https://x.com/konstantinsaifo/status/2106786935951745338)
- [Official Rolex Submariner Date 126610LV](https://www.rolex.com/watches/submariner/m126610lv-0002)
- [Official Rolex Submariner features](https://www.rolex.com/watches/submariner/features)
- [Studio Small 09](https://polyhaven.com/a/studio_small_09) by Sergej Majboroda / Poly Haven, CC0. The 2K HDR file is bundled in `public/textures/`.
- [Watch Club product photography](https://www.watchclub.com/rolex/submariner-date/126610lv-box-and-certificate-ref-126610lv-year-2020), retained in `references/` for local visual research. It is not included in the deployed application.
- [Calibre 3235 exploded reference](https://www.montres-de-luxe.com/Rolex-a-la-decouverte-du-calibre-3235_a11504.html), found during reference search; its image download was blocked by the source.

## Deployment

GitHub Actions builds and deploys to GitHub Pages on every push to `master`. Relative asset paths support the repository URL.

## Validation

Production build and browser checks cover assembly endpoints, part isolation, playback/pause, reset, camera controls, GLB download, reduced motion, mobile overflow, and dialog dismissal. Local screenshots and the exported sample are in `output/playwright/` (ignored by Git). Section cuts and wireframe are display modes: GLB export preserves the visible part geometry, not the cut or line display effect.
