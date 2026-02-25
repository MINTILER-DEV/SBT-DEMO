import initWasm, { compile_source_to_sb3_with_options } from "./wasm/sbtext_rs_core.js";

const sourceEl = document.getElementById("source");
const outputNameEl = document.getElementById("outputName");
const scaleSvgsEl = document.getElementById("scaleSvgs");
const compileBtn = document.getElementById("compileBtn");
const sampleBtn = document.getElementById("sampleBtn");
const statusEl = document.getElementById("status");

const SAMPLE_SOURCE = `stage
  when flag clicked
    broadcast [start]
  end
end

sprite Demo
  var x

  when I receive [start]
    set [x] to (0)
    repeat (20)
      move (8) [steps]
      turn right (18)
      change [x] by (1)
    end
    say ("done")
  end
end`;

let wasmReady = false;

function setStatus(message) {
  statusEl.textContent = message;
}

function sanitizeFileName(name) {
  const raw = (name || "project").trim();
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 ? cleaned : "project";
}

function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.sb3`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function boot() {
  try {
    await initWasm();
    wasmReady = true;
    sourceEl.value = SAMPLE_SOURCE;
    setStatus("WASM ready. Paste SBText source and click Compile.");
  } catch (err) {
    console.error(err);
    setStatus(`Failed to initialize WASM:\n${String(err)}`);
  }
}

compileBtn.addEventListener("click", () => {
  if (!wasmReady) {
    setStatus("WASM is not ready yet.");
    return;
  }

  const source = sourceEl.value;
  if (!source.trim()) {
    setStatus("Source is empty.");
    return;
  }

  const outputName = sanitizeFileName(outputNameEl.value);
  const scaleSvgs = scaleSvgsEl.checked;

  compileBtn.disabled = true;
  setStatus("Compiling...");

  try {
    const sb3Bytes = compile_source_to_sb3_with_options(source, ".", scaleSvgs);
    triggerDownload(sb3Bytes, outputName);
    setStatus(`Compiled successfully. Downloaded ${outputName}.sb3`);
  } catch (err) {
    console.error(err);
    setStatus(`Compile failed:\n${String(err)}`);
  } finally {
    compileBtn.disabled = false;
  }
});

sampleBtn.addEventListener("click", () => {
  sourceEl.value = SAMPLE_SOURCE;
  setStatus("Sample loaded.");
});

boot();
