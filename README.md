# SBT-DEMO

Static GitHub Pages demo that compiles SBText to `.sb3` in-browser using the `sbtext-rs` WASM release build.

## Files

- `index.html` - page layout
- `app.js` - browser logic
- `styles.css` - styling
- `wasm/` - generated WASM package output from `SBText-RS/pkg`

## Local preview

Any static server works. Example (PowerShell):

```powershell
cd D:\GitHub\Repositories\SBT-DEMO
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Refreshing WASM build

From `D:\GitHub\Repositories\SBText-RS`:

```powershell
wasm-pack build --release --target web --features wasm-bindings
```

Then copy these files from `SBText-RS\pkg` to `SBT-DEMO\wasm`:

- `sbtext_rs_core.js`
- `sbtext_rs_core_bg.wasm`
- `sbtext_rs_core.d.ts` (optional)
- `sbtext_rs_core_bg.wasm.d.ts` (optional)
