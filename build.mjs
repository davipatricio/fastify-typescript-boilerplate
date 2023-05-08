import * as esbuild from "esbuild";
import fastGlob from "fast-glob";
import chokidar from "chokidar";
import { exec, ChildProcess } from "child_process";
import fs from "fs/promises";

const ctx = await esbuild.context({
  entryPoints: await fastGlob("src/**/*.ts"),
  outdir: "dist",
  target: "node20",
  platform: "node",
  minify: true,
  sourcemap: false,
  format: "cjs",
});

function startServer() {
  return exec("node dist/app.js", (error, stdout, stderr) => {
    if (error) return;

    if (stderr) console.error(stderr);
    else console.log(stdout);
  });
}

function cleanupDist() {
  return fs.rm("dist", { recursive: true, force: true });
}

await cleanupDist();

// if cmdline has --watch, then watch for changes
if (process.argv.includes("--watch")) {
  console.log("compiling...");
  await ctx.rebuild();

  let process = startServer();

  console.log("starting server & watching for changes...");

  chokidar.watch("src").on("change", () => {
    console.log("change detected - restarting server");
    ctx.rebuild().then(() => {
      if (process) process.kill();

      process = startServer();
    });
  });
} else {
  await ctx.rebuild();
  process.exit(0);
}
