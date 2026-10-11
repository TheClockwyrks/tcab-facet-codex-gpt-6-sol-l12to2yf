import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import { ParticleCanvasPlayer } from "@clockwyrks/particle-runtime/canvas";
import type { ParticleSystem } from "@clockwyrks/particle-runtime";
import {
  ACTIONS,
  BINDINGS,
  BACK_LABEL,
  BASE_SCORE,
  BEST_CHAIN_LABEL,
  BEST_MOVE_LABEL,
  BOARD_CX,
  BOARD_CY,
  CELL_PITCH,
  CUES,
  FALL_SECONDS_PER_ROW,
  FLAWED_SCORE,
  GAMEOVER_ITEMS,
  GAMEOVER_TITLE_TEXT,
  GEM_HIT_R,
  GEM_KINDS,
  GRID_COLS,
  GRID_ROWS,
  HUD_CHAIN_LABEL,
  HUD_LEVEL_LABEL,
  HUD_SCORE_LABEL,
  LAND_MIN_ROWS,
  LEVELCLEAR_ITEMS,
  LEVELCLEAR_TITLE_TEXT,
  LEVEL_TARGET_STEP,
  MATCH_MIN,
  MAX_MULTIPLIER,
  MAX_STRAIN,
  PAUSED_ITEMS,
  PAUSED_TITLE_TEXT,
  PAUSE_LABEL,
  REFUSAL_SECONDS,
  STAGE_H,
  STAGE_W,
  STEP_SECONDS,
  SWAP_SECONDS,
  TAGLINE_TEXT,
  TARGET_MIN_H,
  TITLE_ITEMS,
  TITLE_TEXT,
  WAVE_SECONDS,
  FACET_DEBUG_VERSION,
} from "./constants";

export type GemKind =
  "ruby" | "amber" | "citrine" | "jade" | "beryl" | "sapphire" | "amethyst";
export type Cut = "plain" | "brilliant" | "star" | "prism";
export type Screen =
  "title" | "howto" | "playing" | "paused" | "levelclear" | "gameover";
export type Phase = "idle" | "swapping" | "resolving";
export type PointerDevice = "mouse" | "pen" | "touch";
export interface CellRef {
  readonly col: number;
  readonly row: number;
}
export interface GemState {
  readonly col: number;
  readonly row: number;
  readonly kind: GemKind | null;
  readonly cut: Cut;
  readonly strain: number;
  readonly fell: number;
}
export interface BoardState {
  readonly cols: number;
  readonly rows: number;
  readonly cells: readonly GemState[];
}
export interface RefusalState {
  readonly a: CellRef;
  readonly b: CellRef;
  readonly timer: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
  readonly device: PointerDevice;
}
export interface FacetState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly board: BoardState;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly swapTimer: number;
  readonly stepTimer: number;
  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;
  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;
  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: RefusalState | null;
  readonly armedTarget: string | null;
  readonly pointer: PointerState;
  readonly simTime: number;
  readonly muted: boolean;
  readonly refillKinds: readonly string[];
  readonly swapA?: CellRef | null;
  readonly swapB?: CellRef | null;
  readonly prismKind?: GemKind | null | "all";
  readonly blasts?: readonly {
    col: number;
    row: number;
    wave: number;
    kind: GemKind | null;
    cut: Cut;
    strain: number;
  }[];
}
export interface Target {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}
export interface FacetDebugApi {
  readonly version: number;
  reset(s: DeepReadonly<FacetState>): FacetState;
  reconcile(s: DeepReadonly<FacetState>): FacetState;
  snapshot(s: DeepReadonly<FacetState>): object;
  setScreen(s: DeepReadonly<FacetState>, screen: Screen): FacetState;
  setMenuIndex(s: DeepReadonly<FacetState>, index: number): FacetState;
  loadBoard(s: DeepReadonly<FacetState>, rows: readonly string[]): FacetState;
  dealBoard(s: DeepReadonly<FacetState>): FacetState;
  clearBoard(s: DeepReadonly<FacetState>): FacetState;
  setGem(
    s: DeepReadonly<FacetState>,
    col: number,
    row: number,
    token: string,
  ): FacetState;
  setRefillKinds(
    s: DeepReadonly<FacetState>,
    col: number,
    kinds: string,
  ): FacetState;
  clearRefillKinds(s: DeepReadonly<FacetState>): FacetState;
  setScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setLevel(s: DeepReadonly<FacetState>, level: number): FacetState;
  setLevelScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setBestChain(s: DeepReadonly<FacetState>, chainStep: number): FacetState;
  setBestMove(s: DeepReadonly<FacetState>, points: number): FacetState;
  setMoveScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setSelection(
    s: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearSelection(s: DeepReadonly<FacetState>): FacetState;
  setOffer(s: DeepReadonly<FacetState>, col: number, row: number): FacetState;
  clearOffer(s: DeepReadonly<FacetState>): FacetState;
  clearRefusal(s: DeepReadonly<FacetState>): FacetState;
  clearChain(s: DeepReadonly<FacetState>): FacetState;
  requestSwap(
    s: DeepReadonly<FacetState>,
    colA: number,
    rowA: number,
    colB: number,
    rowB: number,
  ): FacetState;
  pointerDown(
    s: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerMove(
    s: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerUp(s: DeepReadonly<FacetState>, device?: PointerDevice): FacetState;
}
export const BACKGROUND = "#091422";
const letters: Record<string, GemKind> = {
  R: "ruby",
  A: "amber",
  C: "citrine",
  J: "jade",
  B: "beryl",
  S: "sapphire",
  M: "amethyst",
};
const ix = (c: number, r: number) => r * GRID_COLS + c;
const cx = (c: number) => BOARD_CX + (c - (GRID_COLS - 1) / 2) * CELL_PITCH;
const cy = (r: number) => BOARD_CY + (r - (GRID_ROWS - 1) / 2) * CELL_PITCH;
const emptyBoard: BoardState = { cols: 0, rows: 0, cells: [] };
const clone = (s: DeepReadonly<FacetState>): FacetState => ({
  ...s,
  board: { ...s.board, cells: [...s.board.cells] },
  refillKinds: [...s.refillKinds],
  blasts: s.blasts?.map((b) => ({ ...b })),
});
const eq = (a: CellRef | null | undefined, b: CellRef | null | undefined) =>
  !!a && !!b && a.col === b.col && a.row === b.row;
const adjacent = (a: CellRef, b: CellRef) =>
  Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1;
const validCell = (c: number, r: number) =>
  Number.isInteger(c) &&
  Number.isInteger(r) &&
  c >= 0 &&
  c < GRID_COLS &&
  r >= 0 &&
  r < GRID_ROWS;
function checkCell(c: number, r: number) {
  if (!validCell(c, r)) throw new RangeError(`invalid cell ${c},${r}`);
}
function checkNonneg(v: number) {
  if (!Number.isFinite(v) || v < 0) throw new RangeError(`invalid value ${v}`);
}
function checkWhole(v: number, min = 0) {
  if (!Number.isInteger(v) || v < min)
    throw new RangeError(`invalid value ${v}`);
}
function initial(muted = false): FacetState {
  return {
    screen: "title",
    menuIndex: 0,
    board: emptyBoard,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    pointer: { x: 0, y: 0, down: false, device: "mouse" },
    simTime: 0,
    muted,
    refillKinds: Array(GRID_COLS).fill(""),
    swapA: null,
    swapB: null,
    prismKind: null,
    blasts: [],
  };
}
function parse(token: string, c: number, r: number): GemState {
  const m = /^([RACJBSMX])([0-3])([bs]?)$/.exec(token);
  if (!m || (m[1] === "X" && m[3]))
    throw new Error(`invalid gem token ${token}`);
  return {
    col: c,
    row: r,
    kind: m[1] === "X" ? null : letters[m[1]],
    cut:
      m[1] === "X"
        ? "prism"
        : m[3] === "b"
          ? "brilliant"
          : m[3] === "s"
            ? "star"
            : "plain",
    strain: Number(m[2]),
    fell: 0,
  };
}
const randomKind = (): GemKind =>
  GEM_KINDS[Math.floor(Math.random() * GEM_KINDS.length)];
interface Run {
  cells: number[];
  kind: GemKind;
  horizontal: boolean;
}
function runs(board: BoardState): Run[] {
  if (!board.cells.length) return [];
  const result: Run[] = [];
  for (const horizontal of [true, false])
    for (let outer = 0; outer < GRID_ROWS; outer++) {
      let start = 0;
      while (start < GRID_COLS) {
        const at = (n: number) => (horizontal ? ix(n, outer) : ix(outer, n));
        const kind = board.cells[at(start)].kind;
        let end = start + 1;
        while (
          end < GRID_COLS &&
          kind !== null &&
          board.cells[at(end)].kind === kind
        )
          end++;
        if (kind && end - start >= MATCH_MIN)
          result.push({
            cells: Array.from({ length: end - start }, (_, i) => at(start + i)),
            kind,
            horizontal,
          });
        start = end;
      }
    }
  return result;
}
function exchange(board: BoardState, a: CellRef, b: CellRef): BoardState {
  const cells = [...board.cells];
  const ia = ix(a.col, a.row),
    ib = ix(b.col, b.row);
  cells[ia] = { ...board.cells[ib], col: a.col, row: a.row, fell: 0 };
  cells[ib] = { ...board.cells[ia], col: b.col, row: b.row, fell: 0 };
  return { ...board, cells };
}
function legal(board: BoardState): boolean {
  if (!board.cells.length) return false;
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      for (const [dc, dr] of [
        [1, 0],
        [0, 1],
      ]) {
        const a = { col: c, row: r },
          b = { col: c + dc, row: r + dr };
        if (!validCell(b.col, b.row)) continue;
        if (
          board.cells[ix(c, r)].cut === "prism" ||
          board.cells[ix(b.col, b.row)].cut === "prism" ||
          runs(exchange(board, a, b)).length
        )
          return true;
      }
  return false;
}
function deal(): BoardState {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const cells: GemState[] = [];
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++) {
        let choices = [...GEM_KINDS];
        if (c >= 2 && cells[ix(c - 1, r)].kind === cells[ix(c - 2, r)].kind)
          choices = choices.filter((k) => k !== cells[ix(c - 1, r)].kind);
        if (r >= 2 && cells[ix(c, r - 1)].kind === cells[ix(c, r - 2)].kind)
          choices = choices.filter((k) => k !== cells[ix(c, r - 1)].kind);
        cells.push({
          col: c,
          row: r,
          kind: choices[Math.floor(Math.random() * choices.length)],
          cut: "plain",
          strain: 0,
          fell: r + 1,
        });
      }
    const board = { cols: GRID_COLS, rows: GRID_ROWS, cells };
    if (legal(board)) return board;
  }
  throw new Error("cannot deal board");
}
function request(
  s: DeepReadonly<FacetState>,
  a: CellRef,
  b: CellRef,
): FacetState {
  checkCell(a.col, a.row);
  checkCell(b.col, b.row);
  const rejected = () => ({ ...clone(s), refusal: { a, b, timer: 0 } });
  if (!adjacent(a, b) || s.phase !== "idle" || !s.board.cells.length)
    return rejected();
  const board = exchange(s.board as BoardState, a, b);
  if (
    s.board.cells[ix(a.col, a.row)].cut !== "prism" &&
    s.board.cells[ix(b.col, b.row)].cut !== "prism" &&
    !runs(board).length
  )
    return rejected();
  const ga = s.board.cells[ix(a.col, a.row)],
    gb = s.board.cells[ix(b.col, b.row)];
  const prismKind =
    ga.cut === "prism" && gb.cut === "prism"
      ? "all"
      : ga.cut === "prism"
        ? gb.kind
        : gb.cut === "prism"
          ? ga.kind
          : null;
  return {
    ...clone(s),
    board,
    phase: "swapping",
    swapTimer: 0,
    stepTimer: 0,
    chainStep: 0,
    moveScore: 0,
    refusal: null,
    swapA: a,
    swapB: b,
    prismKind,
    blasts: [],
  };
}
function step(s: FacetState): {
  state: FacetState;
  flaw: boolean;
  cut: boolean;
} {
  const board = s.board,
    allRuns = s.prismKind && s.chainStep === 1 ? [] : runs(board);
  const wave = new Map<number, number>();
  if (s.prismKind && s.chainStep === 1) {
    for (let i = 0; i < board.cells.length; i++)
      if (
        s.prismKind === "all" ||
        board.cells[i].kind === s.prismKind ||
        (board.cells[i].cut === "prism" &&
          (eq({ col: board.cells[i].col, row: board.cells[i].row }, s.swapA) ||
            eq({ col: board.cells[i].col, row: board.cells[i].row }, s.swapB)))
      )
        wave.set(i, 0);
  } else for (const run of allRuns) for (const i of run.cells) wave.set(i, 0);
  const queue = [...wave.keys()];
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi],
      g = board.cells[i],
      w = wave.get(i)!;
    const add = (j: number) => {
      if (!wave.has(j)) {
        wave.set(j, w + 1);
        queue.push(j);
      }
    };
    if (g.cut === "brilliant")
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if ((dr || dc) && validCell(g.col + dc, g.row + dr))
            add(ix(g.col + dc, g.row + dr));
    if (g.cut === "star") {
      for (let c = 0; c < GRID_COLS; c++) add(ix(c, g.row));
      for (let r = 0; r < GRID_ROWS; r++) add(ix(g.col, r));
    }
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      if (validCell(g.col + dc, g.row + dr)) {
        const j = ix(g.col + dc, g.row + dr);
        if (board.cells[j].strain === MAX_STRAIN) add(j);
      }
  }
  const cleared = [...wave.keys()];
  const points = cleared.reduce(
    (n, i) =>
      n +
      (board.cells[i].strain === MAX_STRAIN ? FLAWED_SCORE : BASE_SCORE) *
        Math.min(s.chainStep, MAX_MULTIPLIER),
    0,
  );
  const cells = [...board.cells];
  let flaw = false;
  for (let i = 0; i < cells.length; i++)
    if (!wave.has(i)) {
      const g = cells[i];
      if (
        [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].some(
          ([dc, dr]) =>
            validCell(g.col + dc, g.row + dr) &&
            wave.has(ix(g.col + dc, g.row + dr)),
        )
      ) {
        const strain = Math.min(MAX_STRAIN, g.strain + 1);
        if (strain === MAX_STRAIN && g.strain < MAX_STRAIN) flaw = true;
        cells[i] = { ...g, strain };
      }
    }
  const made = new Map<number, GemState>();
  const rank = (cut: Cut) =>
    cut === "prism" ? 3 : cut === "star" ? 2 : cut === "brilliant" ? 1 : 0;
  const create = (i: number, cut: Cut, kind: GemKind | null) => {
    if (rank(cut) > rank(made.get(i)?.cut ?? "plain")) {
      const g = board.cells[i];
      made.set(i, { col: g.col, row: g.row, kind, cut, strain: 0, fell: 0 });
    }
  };
  for (const run of allRuns) {
    const swapped = [s.swapA, s.swapB]
      .filter((v): v is CellRef => !!v)
      .map((v) => ix(v.col, v.row));
    const chosen =
      run.cells.find((i) => swapped.includes(i)) ??
      run.cells[Math.floor((run.cells.length - 1) / 2)];
    if (run.cells.length >= 5) create(chosen, "prism", null);
    else if (run.cells.length === 4) create(chosen, "brilliant", run.kind);
  }
  for (const a of allRuns.filter((v) => v.horizontal))
    for (const b of allRuns.filter((v) => !v.horizontal))
      for (const i of a.cells)
        if (b.cells.includes(i)) create(i, "star", a.kind);
  const next: Array<GemState | undefined> = Array(board.cells.length).fill(
    undefined,
  );
  let fall = 0;
  for (let c = 0; c < GRID_COLS; c++) {
    let dest = GRID_ROWS - 1;
    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      const i = ix(c, r);
      if (!wave.has(i) || made.has(i)) {
        const g = made.get(i) ?? cells[i];
        const fell = dest - r;
        next[ix(c, dest)] = { ...g, row: dest, fell };
        fall = Math.max(fall, fell);
        dest--;
      }
    }
    for (let r = dest; r >= 0; r--) {
      if (next[ix(c, r)]) continue;
      const posed = s.refillKinds[c]?.[r];
      const kind = posed ? letters[posed] : undefined;
      const fell = r + 1 + Math.max(0, dest - r);
      next[ix(c, r)] = {
        col: c,
        row: r,
        kind: kind ?? randomKind(),
        cut: "plain",
        strain: 0,
        fell,
      };
      fall = Math.max(fall, fell);
    }
  }
  const filled = next.map(
    (g, i) =>
      g ?? {
        col: i % GRID_COLS,
        row: Math.floor(i / GRID_COLS),
        kind: randomKind(),
        cut: "plain" as Cut,
        strain: 0,
        fell: 1,
      },
  );
  return {
    state: {
      ...s,
      board: { ...board, cells: filled },
      score: s.score + points,
      levelScore: s.levelScore + points,
      moveScore: s.moveScore + points,
      bestChain: Math.max(s.bestChain, s.chainStep),
      lastCleared: cleared.length,
      lastPoints: points,
      lastWaves: Math.max(0, ...wave.values()),
      stepTimer: 0,
      blasts: cleared.map((i) => ({ ...board.cells[i], wave: wave.get(i)! })),
      prismKind: null,
    },
    flaw,
    cut: made.size > 0,
  };
}
function targetList(screen: Screen): Target[] {
  if (screen === "playing")
    return [{ id: "pause", x: 1090, y: 30, w: 145, h: TARGET_MIN_H }];
  if (screen === "howto")
    return [{ id: "back", x: 45, y: 35, w: 130, h: TARGET_MIN_H }];
  return [0, 1].map((i) => ({
    id: `menu-${i}`,
    x: 487,
    y: screen === "title" ? 480 + i * 90 : 470 + i * 90,
    w: 306,
    h: TARGET_MIN_H,
  }));
}
function targetAt(s: FacetState, x: number, y: number) {
  return (
    targetList(s.screen).find(
      (t) => x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h,
    )?.id ?? null
  );
}
function cellAt(x: number, y: number): CellRef | null {
  let best: CellRef | null = null,
    d = GEM_HIT_R * GEM_HIT_R;
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++) {
      const q = (x - cx(c)) ** 2 + (y - cy(r)) ** 2;
      if (q <= d) {
        d = q;
        best = { col: c, row: r };
      }
    }
  return best;
}
function quit(s: FacetState): FacetState {
  return {
    ...s,
    screen: "title",
    menuIndex: 0,
    board: emptyBoard,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    swapA: null,
    swapB: null,
    blasts: [],
  };
}
function choose(s: FacetState): FacetState {
  switch (s.screen) {
    case "title":
      return s.menuIndex === 0
        ? {
            ...initial(s.muted),
            screen: "playing",
            board: deal(),
            simTime: s.simTime,
            pointer: s.pointer,
          }
        : { ...s, screen: "howto", menuIndex: 0, armedTarget: null };
    case "paused":
      return s.menuIndex === 0
        ? { ...s, screen: "playing", menuIndex: 0, armedTarget: null }
        : quit(s);
    case "levelclear":
      return s.menuIndex === 0
        ? {
            ...s,
            screen: "playing",
            level: s.level + 1,
            levelScore: 0,
            bestMove: 0,
            bestChain: 0,
            board: deal(),
            menuIndex: 0,
            armedTarget: null,
            blasts: [],
          }
        : quit(s);
    case "gameover":
      return s.menuIndex === 0
        ? {
            ...initial(s.muted),
            screen: "playing",
            board: deal(),
            simTime: s.simTime,
            pointer: s.pointer,
          }
        : quit(s);
    default:
      return s;
  }
}
function pointerEvent(
  s: DeepReadonly<FacetState>,
  type: "down" | "move" | "up",
  x: number,
  y: number,
  device: PointerDevice,
): FacetState {
  let n = {
    ...clone(s),
    pointer: {
      x,
      y,
      down: type === "down" ? true : type === "up" ? false : s.pointer.down,
      device,
    },
  };
  const target = targetAt(n, x, y);
  if (type === "down") {
    if (target) {
      n = { ...n, armedTarget: target };
      if (target.startsWith("menu-"))
        n = { ...n, menuIndex: Number(target.slice(5)) };
      return n;
    }
    if (n.screen === "playing") {
      const cell = cellAt(x, y);
      if (!cell)
        return { ...n, selection: null, offer: null, armedTarget: null };
      if (!n.selection) return { ...n, selection: cell, offer: null };
      if (eq(cell, n.selection)) return { ...n, offer: null };
      if (adjacent(cell, n.selection)) return { ...n, offer: cell };
      return { ...n, selection: cell, offer: null };
    }
    return { ...n, armedTarget: null };
  }
  if (type === "move") {
    if (!n.pointer.down && target?.startsWith("menu-"))
      n = { ...n, menuIndex: Number(target.slice(5)) };
    if (
      n.screen === "playing" &&
      n.pointer.down &&
      n.selection &&
      !n.armedTarget
    ) {
      const cell = cellAt(x, y);
      if (eq(cell, n.selection)) n = { ...n, offer: null };
      else if (cell && adjacent(cell, n.selection)) n = { ...n, offer: cell };
    }
    return n;
  }
  if (n.armedTarget) {
    const armed = n.armedTarget;
    n = { ...n, armedTarget: null };
    if (target === armed) {
      if (armed.startsWith("menu-"))
        return choose({ ...n, menuIndex: Number(armed.slice(5)) });
      if (armed === "pause") return { ...n, screen: "paused", menuIndex: 0 };
      if (armed === "back") return { ...n, screen: "title", menuIndex: 1 };
    }
    return n;
  }
  if (n.screen === "playing" && n.offer && n.selection) {
    const a = n.selection,
      b = n.offer;
    return { ...request(n, a, b), selection: null, offer: null };
  }
  return n;
}
function snapshot(s: DeepReadonly<FacetState>) {
  const fall = Math.max(0, ...s.board.cells.map((g) => g.fell));
  return {
    version: FACET_DEBUG_VERSION,
    screen: s.screen,
    menuIndex: s.menuIndex,
    score: s.score,
    level: s.level,
    levelScore: s.levelScore,
    levelTarget: LEVEL_TARGET_STEP * s.level,
    phase: s.phase,
    chainStep: s.chainStep,
    multiplier: Math.min(s.chainStep, MAX_MULTIPLIER),
    swapTimer: s.swapTimer,
    stepTimer: s.stepTimer,
    stepHold:
      s.lastWaves * WAVE_SECONDS + fall * FALL_SECONDS_PER_ROW + STEP_SECONDS,
    board: {
      cols: s.board.cols,
      rows: s.board.rows,
      cells: s.board.cells.map((g) => ({ ...g, x: cx(g.col), y: cy(g.row) })),
    },
    selection: s.selection,
    offer: s.offer,
    refusal: s.refusal ? { a: s.refusal.a, b: s.refusal.b } : null,
    lastCleared: s.lastCleared,
    lastPoints: s.lastPoints,
    lastWaves: s.lastWaves,
    lastFall: fall,
    moveScore: s.moveScore,
    bestMove: s.bestMove,
    bestChain: s.bestChain,
    legalSwap: legal(s.board as BoardState),
    refillKinds: [...s.refillKinds],
    pointer: s.pointer,
    armedTarget: s.armedTarget,
    targets: targetList(s.screen),
    muted: s.muted,
    simTime: s.simTime,
  };
}
function debugSurface(): FacetDebugApi {
  return {
    version: FACET_DEBUG_VERSION,
    reset: (s) => initial(s.muted),
    reconcile: (s) => clone(s),
    snapshot,
    setScreen: (s, screen) => {
      if (
        !(
          [
            "title",
            "howto",
            "playing",
            "paused",
            "levelclear",
            "gameover",
          ] as string[]
        ).includes(screen)
      )
        throw new Error("invalid screen");
      return { ...clone(s), screen };
    },
    setMenuIndex: (s, menuIndex) => {
      checkWhole(menuIndex);
      return { ...clone(s), menuIndex };
    },
    loadBoard: (s, rows) => {
      if (rows.length !== GRID_ROWS) throw new Error("invalid board rows");
      const cells = rows.flatMap((line, r) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length !== GRID_COLS) throw new Error("invalid board cols");
        return parts.map((t, c) => parse(t, c, r));
      });
      return {
        ...clone(s),
        board: { cols: GRID_COLS, rows: GRID_ROWS, cells },
      };
    },
    dealBoard: (s) => ({ ...clone(s), board: deal() }),
    clearBoard: (s) => ({ ...clone(s), board: emptyBoard }),
    setGem: (s, c, r, t) => {
      checkCell(c, r);
      if (!s.board.cells.length) throw new Error("no board");
      const cells = [...s.board.cells];
      cells[ix(c, r)] = parse(t, c, r);
      return { ...clone(s), board: { ...s.board, cells } };
    },
    setRefillKinds: (s, c, k) => {
      if (
        !Number.isInteger(c) ||
        c < 0 ||
        c >= GRID_COLS ||
        !new RegExp(`^[RACJBSM]{0,${GRID_ROWS}}$`).test(k)
      )
        throw new Error("invalid refill");
      const refillKinds = [...s.refillKinds];
      refillKinds[c] = k;
      return { ...clone(s), refillKinds };
    },
    clearRefillKinds: (s) => ({
      ...clone(s),
      refillKinds: Array(GRID_COLS).fill(""),
    }),
    setScore: (s, score) => {
      checkNonneg(score);
      return { ...clone(s), score };
    },
    setLevel: (s, level) => {
      checkWhole(level, 1);
      return { ...clone(s), level };
    },
    setLevelScore: (s, levelScore) => {
      checkNonneg(levelScore);
      return { ...clone(s), levelScore };
    },
    setBestChain: (s, bestChain) => {
      checkWhole(bestChain);
      return { ...clone(s), bestChain };
    },
    setBestMove: (s, bestMove) => {
      checkNonneg(bestMove);
      return { ...clone(s), bestMove };
    },
    setMoveScore: (s, moveScore) => {
      checkNonneg(moveScore);
      return { ...clone(s), moveScore };
    },
    setSelection: (s, col, row) => {
      checkCell(col, row);
      return { ...clone(s), selection: { col, row } };
    },
    clearSelection: (s) => ({ ...clone(s), selection: null }),
    setOffer: (s, col, row) => {
      checkCell(col, row);
      return { ...clone(s), offer: { col, row } };
    },
    clearOffer: (s) => ({ ...clone(s), offer: null }),
    clearRefusal: (s) => ({ ...clone(s), refusal: null }),
    clearChain: (s) => ({
      ...clone(s),
      phase: "idle",
      chainStep: 0,
      swapTimer: 0,
      stepTimer: 0,
      blasts: [],
    }),
    requestSwap: (s, a, b, c, d) =>
      request(s, { col: a, row: b }, { col: c, row: d }),
    pointerDown: (s, x, y, device = "mouse") =>
      pointerEvent(s, "down", x, y, device),
    pointerMove: (s, x, y, device = "mouse") =>
      pointerEvent(s, "move", x, y, device),
    pointerUp: (s, device = "mouse") =>
      pointerEvent(s, "up", s.pointer.x, s.pointer.y, device),
  };
}
const sprites = new Map<string, ImageBitmap>();
const systems = new Map<string, ParticleSystem>();
const particles = new Map<
  string,
  { canvas: HTMLCanvasElement; player: ParticleCanvasPlayer }
>();
function particle(
  ctx: CanvasRenderingContext2D,
  key: string,
  type: string,
  x: number,
  y: number,
  dt: number,
) {
  const system = systems.get(type);
  if (!system || typeof document === "undefined") return;
  let item = particles.get(key);
  if (!item) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return;
    item = {
      canvas,
      player: new ParticleCanvasPlayer(system, context, { pixelRadius: 2.2 }),
    };
    particles.set(key, item);
  }
  item.player.update(dt);
  ctx.drawImage(item.canvas, x - 64, y - 64, 128, 128);
}
function drawParticles(
  ctx: CanvasRenderingContext2D,
  s: DeepReadonly<FacetState>,
  dt: number,
) {
  const active = new Set<string>();
  if (s.screen !== "playing") return;
  for (const g of s.board.cells) {
    if (g.cut === "plain") continue;
    const key = `aura-${g.col}-${g.row}`;
    active.add(key);
    particle(ctx, key, "aura", cx(g.col), cy(g.row), dt);
  }
  if (s.phase === "resolving") {
    for (const b of s.blasts ?? []) {
      const age = s.stepTimer - b.wave * WAVE_SECONDS;
      if (age < 0 || age > 0.7) continue;
      const type = b.strain === MAX_STRAIN ? "flawed" : "clear";
      const key = `${type}-${b.col}-${b.row}-${b.wave}`;
      active.add(key);
      particle(ctx, key, type, cx(b.col), cy(b.row), dt);
    }
    if (s.stepTimer < 0.5)
      for (const g of s.board.cells) {
        if (g.cut === "plain" || g.fell > 0) continue;
        const key = `cut-${g.col}-${g.row}`;
        active.add(key);
        particle(ctx, key, "cut", cx(g.col), cy(g.row), dt);
      }
  }
  for (const key of particles.keys())
    if (!active.has(key)) particles.delete(key);
}
function spriteKey(g: Pick<GemState, "kind" | "cut" | "strain">) {
  return g.cut === "prism" ? `prism-${g.strain}` : `${g.kind}-${g.strain}`;
}
const sound = (api: UpdateApi, cue: string) => api.audio.play(cue);
function advance(s: FacetState, api: UpdateApi, dt: number): FacetState {
  let n = s;
  if (n.refusal) {
    const timer = n.refusal.timer + dt;
    n = {
      ...n,
      refusal: timer >= REFUSAL_SECONDS ? null : { ...n.refusal, timer },
    };
  }
  let left = dt;
  let loops = 0;
  while (left > 1e-9 && loops++ < 100) {
    if (n.phase === "swapping") {
      const remain = SWAP_SECONDS - n.swapTimer,
        used = Math.min(remain, left);
      n = { ...n, swapTimer: n.swapTimer + used };
      left -= used;
      if (n.swapTimer + 1e-9 >= SWAP_SECONDS) {
        n = { ...n, phase: "resolving", swapTimer: 0, chainStep: 1 };
        const result = step(n);
        n = result.state;
        sound(api, CUES.clear);
        api.audio.play(`chain${Math.min(n.chainStep, MAX_MULTIPLIER)}`);
        api.audio.play("shatter");
        if (result.flaw) sound(api, CUES.flaw);
        if (result.cut) sound(api, CUES.cut);
      } else break;
    } else if (n.phase === "resolving") {
      const fall = Math.max(0, ...n.board.cells.map((g) => g.fell));
      const landAt = n.lastWaves * WAVE_SECONDS + fall * FALL_SECONDS_PER_ROW,
        hold = landAt + STEP_SECONDS;
      const before = n.stepTimer,
        used = Math.min(hold - before, left);
      n = { ...n, stepTimer: before + used };
      left -= used;
      if (before < landAt && n.stepTimer >= landAt && fall > LAND_MIN_ROWS)
        sound(api, CUES.land);
      if (n.stepTimer + 1e-9 >= hold) {
        n = { ...n, stepTimer: 0, blasts: [] };
        if (runs(n.board).length) {
          n = { ...n, chainStep: n.chainStep + 1 };
          const result = step(n);
          n = result.state;
          sound(api, CUES.clear);
          api.audio.play(`chain${Math.min(n.chainStep, MAX_MULTIPLIER)}`);
          api.audio.play("shatter");
          if (result.flaw) sound(api, CUES.flaw);
          if (result.cut) sound(api, CUES.cut);
        } else {
          n = {
            ...n,
            phase: "idle",
            chainStep: 0,
            bestMove: Math.max(n.bestMove, n.moveScore),
            swapA: null,
            swapB: null,
          };
          if (n.levelScore >= LEVEL_TARGET_STEP * n.level) {
            n = { ...n, screen: "levelclear", menuIndex: 0 };
            sound(api, CUES.levelUp);
          } else if (!legal(n.board)) {
            n = { ...n, screen: "gameover", menuIndex: 0 };
            sound(api, CUES.gameOver);
          }
          break;
        }
      } else break;
    } else break;
  }
  return n;
}
function renderText(
  ctx: CanvasRenderingContext2D,
  t: string,
  x: number,
  y: number,
  size: number,
  color = "#e9f5ef",
  align: CanvasTextAlign = "center",
  weight = "600",
) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillText(t, x, y);
}
function round(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function drawGem(
  ctx: CanvasRenderingContext2D,
  g: DeepReadonly<GemState>,
  x: number,
  y: number,
  time: number,
  scale = 1,
) {
  const key = spriteKey(g);
  let img = sprites.get(key);
  if (g.cut === "prism") {
    const f = Math.floor(time * 7) % 6;
    img = sprites.get(`turn-${f}`) ?? img;
  }
  if (!img) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, -32, -32, 64, 64);
  if (g.cut === "prism" && g.strain > 0) {
    const cracked = sprites.get(`prism-${g.strain}`);
    if (cracked) {
      ctx.globalAlpha = g.strain === MAX_STRAIN ? 0.9 : 0.68;
      ctx.drawImage(cracked, -32, -32, 64, 64);
      ctx.globalAlpha = 1;
    }
  }
  if (g.cut === "brilliant" || g.cut === "star") {
    const overlay = sprites.get(g.cut);
    if (overlay) ctx.drawImage(overlay, -32, -32, 64, 64);
  }
  if (g.cut !== "plain") {
    ctx.globalAlpha = 0.28 + 0.2 * Math.sin(time * 5 + g.row + g.col);
    ctx.strokeStyle = g.cut === "prism" ? "#f9ddfd" : "#f8eeaf";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 31, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
function drawBoard(ctx: CanvasRenderingContext2D, s: DeepReadonly<FacetState>) {
  const frame = sprites.get("frame");
  if (frame) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame, 334, 90, 612, 612);
  } else round(ctx, 334, 90, 612, 612, 20, "#142b3a", "#b4a172");
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++) {
      const x = cx(c),
        y = cy(r);
      round(
        ctx,
        x - 34,
        y - 34,
        68,
        68,
        9,
        (r + c) % 2 ? "#112738" : "#152b3b",
        "#294457",
      );
    }
  if (s.selection) {
    const x = cx(s.selection.col),
      y = cy(s.selection.row);
    round(ctx, x - 34, y - 34, 68, 68, 9, "#1c3243", "#f9d98c");
  }
  if (s.refusal) {
    ctx.strokeStyle = "#fa6d6d";
    ctx.lineWidth = 3;
    for (const cell of [s.refusal.a, s.refusal.b])
      ctx.strokeRect(cx(cell.col) - 33, cy(cell.row) - 33, 66, 66);
  }
  for (const g of s.board.cells) {
    let x = cx(g.col),
      y = cy(g.row),
      alpha = 1;
    const cell = { col: g.col, row: g.row };
    if (s.offer && s.selection) {
      if (eq(cell, s.offer)) {
        x = cx(s.selection.col);
        y = cy(s.selection.row);
      } else if (eq(cell, s.selection)) {
        x = cx(s.offer.col);
        y = cy(s.offer.row);
      }
    }
    if (s.phase === "swapping" && s.swapA && s.swapB) {
      const f = Math.min(1, s.swapTimer / SWAP_SECONDS);
      if (eq(cell, s.swapA)) {
        x = cx(s.swapB.col) + (cx(s.swapA.col) - cx(s.swapB.col)) * f;
        y = cy(s.swapB.row) + (cy(s.swapA.row) - cy(s.swapB.row)) * f;
      } else if (eq(cell, s.swapB)) {
        x = cx(s.swapA.col) + (cx(s.swapB.col) - cx(s.swapA.col)) * f;
        y = cy(s.swapA.row) + (cy(s.swapB.row) - cy(s.swapA.row)) * f;
      }
    }
    if (s.phase === "resolving" && g.fell > 0) {
      const start = s.lastWaves * WAVE_SECONDS;
      const elapsed = Math.max(0, s.stepTimer - start);
      const duration = g.fell * FALL_SECONDS_PER_ROW;
      const f = Math.min(1, elapsed / duration);
      y -= g.fell * CELL_PITCH * (1 - f) * (1 - f);
      if (s.stepTimer < start) alpha = 0;
    }
    ctx.globalAlpha = alpha;
    drawGem(ctx, g, x, y, s.simTime);
    ctx.globalAlpha = 1;
  }
  if (s.phase === "resolving" && s.blasts) {
    for (const b of s.blasts) {
      const age = s.stepTimer - b.wave * WAVE_SECONDS;
      if (age < 0 || age > 0.32) continue;
      const g: GemState = {
        col: b.col,
        row: b.row,
        kind: b.kind,
        cut: b.cut,
        strain: b.strain,
        fell: 0,
      };
      const frame = Math.min(5, Math.floor(age / 0.055));
      const img = sprites.get(`break-${b.kind ?? "prism"}-${frame}`);
      if (img) {
        ctx.globalAlpha = 1 - age / 0.35;
        ctx.drawImage(img, cx(b.col) - 32, cy(b.row) - 32, 64, 64);
        ctx.globalAlpha = 1;
      } else drawGem(ctx, g, cx(b.col), cy(b.row), s.simTime, 1 + age * 1.5);
    }
  }
}
function hud(ctx: CanvasRenderingContext2D, s: DeepReadonly<FacetState>) {
  renderText(ctx, HUD_SCORE_LABEL, 54, 45, 14, "#a4c9c9", "left");
  renderText(ctx, String(s.score), 54, 85, 40, "#fff6d5", "left", "700");
  renderText(ctx, HUD_LEVEL_LABEL, 385, 45, 14, "#a4c9c9", "left");
  renderText(
    ctx,
    String(s.level).padStart(2, "0"),
    385,
    82,
    32,
    "#fff6d5",
    "left",
  );
  round(ctx, 475, 45, 390, 16, 8, "#284354");
  round(
    ctx,
    475,
    45,
    390 * Math.min(1, s.levelScore / (LEVEL_TARGET_STEP * s.level)),
    16,
    8,
    "#d8b577",
  );
  renderText(
    ctx,
    `${s.levelScore} / ${LEVEL_TARGET_STEP * s.level}`,
    865,
    83,
    15,
    "#c3ddda",
    "right",
  );
  if (s.phase === "resolving") {
    renderText(ctx, HUD_CHAIN_LABEL, 956, 50, 15, "#a4c9c9", "left");
    renderText(
      ctx,
      `× ${Math.min(s.chainStep, MAX_MULTIPLIER)}`,
      956,
      89,
      36,
      "#f5d58a",
      "left",
      "700",
    );
  }
  drawButton(ctx, targetList("playing")[0], PAUSE_LABEL, false);
}
function drawButton(
  ctx: CanvasRenderingContext2D,
  t: Target,
  label: string,
  selected: boolean,
) {
  round(
    ctx,
    t.x,
    t.y,
    t.w,
    t.h,
    13,
    selected ? "#d5b776" : "#1b3545",
    selected ? "#fff4ce" : "#577686",
  );
  renderText(
    ctx,
    label,
    t.x + t.w / 2,
    t.y + t.h / 2 + 8,
    21,
    selected ? "#172934" : "#ebead9",
  );
}
function overlay(ctx: CanvasRenderingContext2D, s: DeepReadonly<FacetState>) {
  ctx.fillStyle =
    s.screen === "title" || s.screen === "howto" ? "#091422ed" : "#07121cdd";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.strokeStyle = "#384f5b";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, STAGE_W - 48, STAGE_H - 48);
  if (s.screen === "title") {
    ctx.globalAlpha = 0.72;
    for (const [kind, x, y, size] of [
      ["ruby", 278, 273, 1.7],
      ["citrine", 990, 253, 1.45],
      ["beryl", 194, 500, 1.1],
      ["amethyst", 1082, 490, 1.15],
    ] as const) {
      drawGem(
        ctx,
        { col: 0, row: 0, kind, cut: "plain", strain: 0, fell: 0 },
        x,
        y,
        s.simTime,
        size,
      );
    }
    ctx.globalAlpha = 1;
    renderText(ctx, TITLE_TEXT, 640, 285, 104, "#f0dbab", "center", "800");
    renderText(ctx, TAGLINE_TEXT, 640, 340, 23, "#a4c8c5");
    renderText(
      ctx,
      "CUT THE LINE · RELEASE THE PRESSURE",
      640,
      401,
      18,
      "#648e99",
    );
  } else if (s.screen === "howto") {
    renderText(ctx, "HOW TO PLAY", 640, 92, 49, "#f0dbab");
    const lines = [
      "Seven stones. Swap neighbors by dragging, or select one and tap its neighbor.",
      "Release beside a neighbor to play. Drag back to cancel. Lines of 3+ shatter.",
      "A swap without a clear is refused. Neighbors of a clear take strain.",
      "A flawed stone breaks when a clear touches it, and scores double.",
      "Four in a line leaves a BRILLIANT: it clears its surrounding ring.",
      "Five or more leaves a PRISM: trade it to clear all stones of one kind.",
      "Crossing lines leave a STAR: it clears its row and column.",
      "Falling stones can chain; each step scores more. Fill the meter to level up.",
      "No legal move ends the round. Use mouse, pen, or touch on the board.",
      "Menus: ↑ / ↓, Enter / Space. Esc / P pauses. M mutes. Esc goes back.",
    ];
    lines.forEach((t, i) =>
      renderText(ctx, t, 640, 160 + i * 47, 20, i % 2 ? "#bfd5d1" : "#e1e8dc"),
    );
  } else {
    const title =
      s.screen === "paused"
        ? PAUSED_TITLE_TEXT
        : s.screen === "levelclear"
          ? LEVELCLEAR_TITLE_TEXT
          : GAMEOVER_TITLE_TEXT;
    renderText(ctx, title, 640, 210, 64, "#f0dbab");
    if (s.screen === "levelclear") {
      renderText(ctx, `LEVEL ${s.level}`, 640, 278, 25);
      renderText(ctx, `${BEST_CHAIN_LABEL}   ${s.bestChain}`, 640, 332, 23);
      renderText(ctx, `${BEST_MOVE_LABEL}   ${s.bestMove}`, 640, 372, 23);
    }
    if (s.screen === "gameover") {
      renderText(ctx, `SCORE ${s.score}   ·   LEVEL ${s.level}`, 640, 320, 28);
    }
  }
  if (s.screen === "howto")
    drawButton(ctx, targetList(s.screen)[0], BACK_LABEL, false);
  else {
    const labels =
      s.screen === "title"
        ? TITLE_ITEMS
        : s.screen === "paused"
          ? PAUSED_ITEMS
          : s.screen === "levelclear"
            ? LEVELCLEAR_ITEMS
            : GAMEOVER_ITEMS;
    targetList(s.screen).forEach((t, i) =>
      drawButton(ctx, t, labels[i], s.menuIndex === i),
    );
  }
}
export const game: Game<FacetState, FacetDebugApi> = {
  async initialize(api: InitApi<FacetState>) {
    for (const action of ACTIONS)
      api.input.register(action, { keys: [...BINDINGS[action]] });
    const paths: string[] = [];
    for (const kind of [...GEM_KINDS, "prism"])
      for (let strain = 0; strain <= MAX_STRAIN; strain++)
        paths.push(`${kind}-${strain}`);
    paths.push("brilliant", "star", "frame");
    for (let i = 0; i < 6; i++) {
      paths.push(`turn-${i}`);
      for (const kind of [...GEM_KINDS, "prism"])
        paths.push(`break-${kind}-${i}`);
    }
    await Promise.all(
      paths.map(async (key) => {
        const path =
          key === "frame"
            ? "board/frame.png"
            : key.startsWith("turn-")
              ? `gems/prism-turn/${key.slice(5)}.png`
              : key.startsWith("break-")
                ? `gems/break/${key.split("-")[1]}/${key.split("-")[2]}.png`
                : `gems/${key}.png`;
        sprites.set(key, await api.assets.loadImage(path));
      }),
    );
    await Promise.all(
      ["clear", "flawed", "cut", "aura"].map(async (name) => {
        const blob = await api.assets.load(`fx/${name}.json`);
        systems.set(name, JSON.parse(await blob.text()) as ParticleSystem);
      }),
    );
    const cues = Object.values(CUES);
    await Promise.all([
      ...cues.map((c) => api.audio.load(c, `audio/${c}.wav`)),
      ...Array.from({ length: MAX_MULTIPLIER }, (_, i) =>
        api.audio.load(`chain${i + 1}`, `audio/chain${i + 1}.wav`),
      ),
      api.audio.load("shatter", "audio/shatter.wav"),
      api.audio.load("titleMusic", "audio/title.wav"),
      api.audio.load("playMusic", "audio/play.wav"),
    ]);
    const diag: Record<
      string,
      (s: DeepReadonly<FacetState>) => string | number | boolean
    > = {
      screen: (s) => s.screen,
      phase: (s) => s.phase,
      board: (s) => `${s.board.cols}×${s.board.rows}`,
      score: (s) => s.score,
      level: (s) => s.level,
      levelScore: (s) => `${s.levelScore}/${s.level * LEVEL_TARGET_STEP}`,
      chain: (s) => s.chainStep,
      multiplier: (s) => Math.min(s.chainStep, MAX_MULTIPLIER),
      cleared: (s) => s.lastCleared,
      points: (s) => s.lastPoints,
      waves: (s) => s.lastWaves,
      fall: (s) => Math.max(0, ...s.board.cells.map((g) => g.fell)),
      selection: (s) =>
        s.selection ? `${s.selection.col},${s.selection.row}` : "none",
      offer: (s) => (s.offer ? `${s.offer.col},${s.offer.row}` : "none"),
      bestMove: (s) => s.bestMove,
      bestChain: (s) => s.bestChain,
      legalSwap: (s) => legal(s.board as BoardState),
      pointer: (s) =>
        `${s.pointer.x.toFixed(0)},${s.pointer.y.toFixed(0)} ${s.pointer.device}`,
    };
    for (const [name, source] of Object.entries(diag))
      api.diagnostics.register(name, source);
    return [initial(), debugSurface()];
  },
  update(state: DeepReadonly<FacetState>, api: UpdateApi, dt: number) {
    let n = { ...clone(state), simTime: state.simTime + dt };
    if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
    n = { ...n, muted: api.audio.muted() };
    const title = n.screen === "title" || n.screen === "howto";
    if (title) {
      if (!api.audio.looping("titleMusic")) api.audio.loop("titleMusic");
      api.audio.stop("playMusic");
    } else {
      if (!api.audio.looping("playMusic")) api.audio.loop("playMusic");
      api.audio.stop("titleMusic");
    }
    const prevScreen = n.screen;
    const count =
      n.screen === "title"
        ? TITLE_ITEMS.length
        : n.screen === "paused"
          ? PAUSED_ITEMS.length
          : n.screen === "levelclear"
            ? LEVELCLEAR_ITEMS.length
            : n.screen === "gameover"
              ? GAMEOVER_ITEMS.length
              : 0;
    if (count) {
      if (api.input.pressed("up"))
        n = { ...n, menuIndex: (n.menuIndex + count - 1) % count };
      if (api.input.pressed("down"))
        n = { ...n, menuIndex: (n.menuIndex + 1) % count };
      if (api.input.pressed("confirm")) n = choose(n);
    }
    if (api.input.pressed("pause")) {
      if (n.screen === "playing")
        n = { ...n, screen: "paused", menuIndex: 0, armedTarget: null };
      else if (n.screen === "paused")
        n = { ...n, screen: "playing", menuIndex: 0, armedTarget: null };
    }
    if (api.input.pressed("back")) {
      if (n.screen === "howto")
        n = { ...n, screen: "title", menuIndex: 1, armedTarget: null };
      else if (n.screen === "gameover")
        n = { ...n, screen: "title", menuIndex: 0, armedTarget: null };
    }
    const pointerCues = new Set<string>();
    for (const p of api.input
      .pointerSamples()
      .filter(
        (p) => p.primary && (p.button === "primary" || p.button === null),
      )) {
      const before = n;
      n = pointerEvent(n, p.type, p.x, p.y, p.device);
      if (n.selection && !eq(before.selection, n.selection))
        pointerCues.add(CUES.select);
      if (before.phase === "idle" && n.phase === "swapping")
        pointerCues.add(CUES.swap);
      if (n.refusal && before.refusal !== n.refusal)
        pointerCues.add(CUES.refuse);
    }
    for (const cue of pointerCues) sound(api, cue);
    const pointer = api.input.pointer();
    n = {
      ...n,
      pointer: {
        x: pointer.x,
        y: pointer.y,
        down: pointer.down,
        device: pointer.device,
      },
    };
    if (n.screen === "playing" && prevScreen === "playing")
      n = advance(n, api, dt);
    return n;
  },
  render(state: DeepReadonly<FacetState>, api: RenderApi) {
    const ctx = api.ctx;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    const grad = ctx.createRadialGradient(640, 360, 100, 640, 360, 720);
    grad.addColorStop(0, "#183446");
    grad.addColorStop(1, BACKGROUND);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    ctx.strokeStyle = "#375268";
    ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 70 - 230, 0);
      ctx.lineTo(i * 70 + 260, 720);
      ctx.stroke();
    }
    if (
      state.board.cells.length &&
      state.screen !== "title" &&
      state.screen !== "howto"
    ) {
      drawBoard(ctx, state);
      drawParticles(ctx, state, api.frame().lastDeltaMs / 1000);
      hud(ctx, state);
    }
    if (state.screen !== "playing") overlay(ctx, state);
  },
};
