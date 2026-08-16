import { spawn } from "node:child_process";

const devServer = spawn(process.execPath, ["node_modules/vinext/dist/cli.js", "dev"], {
  stdio: "inherit",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
  },
});

devServer.on("error", (error) => {
  console.error(`No se pudo iniciar vinext: ${error.message}`);
  process.exit(1);
});

devServer.on("exit", (code) => {
  process.exit(code ?? 1);
});
