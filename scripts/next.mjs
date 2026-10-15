import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname } from "node:path";

const require = createRequire(import.meta.url);

// Some Windows installations cannot load Next's native SWC binary. Use its
// official WebAssembly package for those machines while keeping native SWC elsewhere.
if (process.platform === "win32" && !process.env.NEXT_TEST_WASM_DIR) {
  try {
    require("@next/swc-win32-x64-msvc");
  } catch {
    process.env.NEXT_TEST_WASM_DIR = dirname(require.resolve("@next/swc-wasm-nodejs/wasm.js"));
  }
}

const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", error => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", code => {
  process.exitCode = code ?? 1;
});
