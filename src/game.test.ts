import { describe, expect, it } from "vitest";
import { game, type FacetState } from "./game";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";

async function setup() {
  const events: string[] = [];
  const api = {
    input: { register: () => {} },
    audio: { load: async () => {} },
    assets: { loadImage: async () => ({}), load: async () => new Blob(["{}"]) },
    diagnostics: { register: () => {} },
  } as unknown as InitApi<FacetState>;
  const [state, debug] = await game.initialize(api);
  const updateApi = {
    input: {
      pressed: () => false,
      pointerSamples: () => [],
      pointer: () => ({ x: 0, y: 0, down: false, device: "mouse" }),
    },
    audio: {
      muted: () => false,
      looping: () => true,
      loop: () => {},
      stop: () => {},
      play: (cue: string) => events.push(cue),
      setMuted: () => {},
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 16 }),
  } as unknown as UpdateApi;
  return { state, debug, updateApi, events };
}
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
describe("Facet simulation", () => {
  it("initializes a complete title state and validates notation", async () => {
    const { state, debug } = await setup();
    expect(debug.snapshot(state)).toMatchObject({
      screen: "title",
      level: 1,
      score: 0,
      phase: "idle",
      board: { cols: 0, rows: 0, cells: [] },
    });
    expect(() => debug.loadBoard(state, ["R0"])).toThrow();
    expect(() => debug.setGem(state, 0, 0, "R0")).toThrow();
  });
  it("deals a board with no opening runs and a legal swap", async () => {
    const { state, debug } = await setup();
    const dealt = debug.dealBoard(state);
    const snap = debug.snapshot(dealt) as {
      legalSwap: boolean;
      board: { cells: { kind: string | null }[] };
    };
    expect(snap.legalSwap).toBe(true);
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const cells = snap.board.cells;
        const i = r * 8 + c;
        if (c < 6)
          expect(
            !(
              cells[i].kind === cells[i + 1].kind &&
              cells[i].kind === cells[i + 2].kind
            ),
          ).toBe(true);
        if (r < 6)
          expect(
            !(
              cells[i].kind === cells[i + 8].kind &&
              cells[i].kind === cells[i + 16].kind
            ),
          ).toBe(true);
      }
  });
  it("refuses an unproductive swap without changing the board", async () => {
    const { state, debug } = await setup();
    const posed = debug.loadBoard(state, rows);
    const result = debug.requestSwap(posed, 0, 0, 1, 0);
    expect(result.phase).toBe("idle");
    expect(result.board).toEqual(posed.board);
    expect(result.refusal).toMatchObject({
      a: { col: 0, row: 0 },
      b: { col: 1, row: 0 },
    });
  });
  it("resolves a prism swap, scoring every target kind", async () => {
    const { state, debug, updateApi, events } = await setup();
    let posed = debug.loadBoard({ ...state, screen: "playing" }, rows);
    posed = debug.setGem(posed, 0, 0, "X0");
    const started = debug.requestSwap(posed, 0, 0, 1, 0);
    expect(started.phase).toBe("swapping");
    const after = game.update(started, updateApi, 0.19);
    expect(after.phase).toBe("resolving");
    expect(after.lastCleared).toBeGreaterThan(4);
    expect(after.score).toBe(after.lastPoints);
    expect(events).toContain("clear");
  });
  it("raises strain beside a three-gem clear", async () => {
    const { state, debug, updateApi } = await setup();
    let posed = debug.loadBoard({ ...state, screen: "playing" }, rows);
    posed = debug.setGem(posed, 1, 0, "R0");
    posed = debug.setGem(posed, 2, 1, "R0");
    posed = debug.requestSwap(posed, 2, 0, 2, 1);
    const after = game.update(posed, updateApi, 0.19);
    expect(after.lastCleared).toBe(3);
    expect(after.lastPoints).toBe(30);
    expect(after.board.cells[3].strain).toBe(1);
  });
  it("creates a brilliant from a line of four", async () => {
    const { state, debug, updateApi } = await setup();
    let posed = debug.loadBoard({ ...state, screen: "playing" }, rows);
    posed = debug.setGem(posed, 1, 0, "R0");
    posed = debug.setGem(posed, 2, 0, "R0");
    posed = debug.setGem(posed, 3, 1, "R0");
    posed = debug.requestSwap(posed, 3, 0, 3, 1);
    const after = game.update(posed, updateApi, 0.19);
    expect(after.lastPoints).toBe(40);
    expect(after.board.cells.some((g) => g.cut === "brilliant")).toBe(true);
  });
  it("pointer poses select, offer, and release immediately", async () => {
    const { state, debug } = await setup();
    let posed = debug.loadBoard({ ...state, screen: "playing" }, rows);
    posed = debug.pointerDown(posed, 388, 144);
    expect(posed.selection).toEqual({ col: 0, row: 0 });
    posed = debug.pointerMove(posed, 460, 144);
    expect(posed.offer).toEqual({ col: 1, row: 0 });
    posed = debug.pointerUp(posed);
    expect(posed.refusal).not.toBeNull();
    expect(posed.selection).toBeNull();
  });
});
