/* global console, document */
import { chromium } from "playwright";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.error(e));
await page.goto("http://127.0.0.1:5173/");
await page.waitForTimeout(900);
await page.screenshot({ path: "showcase/title.png" });
await page.mouse.click(640, 515);
await page.waitForTimeout(250);
await page.screenshot({ path: "showcase/board.png" });
const recording = await page.evaluate(async () => {
  const [{ createEngine, ConstantClock }, { game, BACKGROUND }] =
    await Promise.all([
      import("/node_modules/@clockwyrks/simple-2d/dist/index.js"),
      import("/src/game.ts"),
    ]);
  const canvas = document.createElement("canvas");
  canvas.style.width = "1280px";
  canvas.style.height = "720px";
  document.body.appendChild(canvas);
  const engine = createEngine({
    canvas,
    width: 1280,
    height: 720,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(1000 / 30),
  });
  await engine.initialize();
  const d = engine.debug;
  const rows = [
    "R0 A0 C0 J0 B0 S0 M0 R0",
    "C0 J0 B0 S0 M0 R0 A0 C0",
    "B0 S0 M0 R0 A0 C0 J0 B0",
    "M0 R0 A0 C0 J0 B0 S0 M0",
    "A0 C0 J0 B0 S0 M0 R0 A0",
    "J0 B0 S0 M0 R0 A0 C0 J0",
    "S0 M0 R0 A0 C0 J0 B0 S0",
    "R0 A0 C0 J0 B0 S0 M0 R0",
  ];
  engine.apply((s) => d.setScreen(s, "playing"));
  engine.apply((s) => d.loadBoard(s, rows));
  engine.apply((s) => d.setGem(s, 0, 0, "X0"));
  engine.apply((s) => d.requestSwap(s, 0, 0, 1, 0));
  engine.startRecording();
  await engine.advance(42);
  const result = engine.stopRecording();
  engine.destroy();
  return result;
});
fs.writeFileSync(
  "showcase/chain.json.gz",
  gzipSync(JSON.stringify(recording), { level: 9 }),
);
console.log(
  "frames",
  recording.frames.length,
  "bytes",
  fs.statSync("showcase/chain.json.gz").size,
);
await browser.close();
