import { createCanvas } from "@napi-rs/canvas";
import fs from "node:fs";
const root = "public/assets";
const colors = [
  ["ruby", "#ed5666", "#8e223c"],
  ["amber", "#eda752", "#9a5622"],
  ["citrine", "#ead768", "#98812c"],
  ["jade", "#67d38d", "#247254"],
  ["beryl", "#60d7d0", "#277c88"],
  ["sapphire", "#659ee9", "#304d9d"],
  ["amethyst", "#b98ade", "#684892"],
];
function canvas(w = 64, h = 64) {
  const c = createCanvas(w, h);
  return [c, c.getContext("2d")];
}
function poly(ctx, pts, fill, stroke = "#ffffff80", line = 1) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = line;
  ctx.stroke();
}
function save(c, path) {
  fs.mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  fs.writeFileSync(path, c.toBuffer("image/png"));
}
function gem(kind, light, dark, strain, turn = 0) {
  const [c, g] = canvas();
  const sides =
    kind === "ruby"
      ? 8
      : kind === "amber"
        ? 6
        : kind === "citrine"
          ? 10
          : kind === "jade"
            ? 4
            : kind === "beryl"
              ? 5
              : kind === "sapphire"
                ? 6
                : kind === "amethyst"
                  ? 7
                  : 8;
  const rotate =
    kind === "jade"
      ? Math.PI / 4
      : kind === "sapphire"
        ? Math.PI / 6
        : Math.PI / 2;
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (i * 2 * Math.PI) / sides + rotate + turn;
    const rr = kind === "amethyst" && i % 2 ? 25 : 29;
    pts.push([32 + Math.cos(a) * rr, 32 + Math.sin(a) * rr]);
  }
  g.shadowColor = light;
  g.shadowBlur = 9;
  poly(g, pts, dark, "#d8f7ef", 2);
  g.shadowBlur = 0;
  const inner = pts.map(([x, y]) => [
    32 + (x - 32) * 0.63,
    32 + (y - 32) * 0.63,
  ]);
  for (let i = 0; i < sides; i++) {
    poly(
      g,
      [[32, 32], inner[i], inner[(i + 1) % sides]],
      i % 2 ? light : dark,
      "#ffffff35",
      0.6,
    );
    poly(
      g,
      [inner[i], pts[i], pts[(i + 1) % sides], inner[(i + 1) % sides]],
      i % 2 ? dark : light,
      "#ffffff60",
      0.8,
    );
  }
  g.globalAlpha = 0.45;
  poly(
    g,
    [
      [32, 17],
      [42, 30],
      [34, 39],
      [23, 30],
    ],
    "#ffffff",
    "#ffffff30",
  );
  g.globalAlpha = 1;
  g.strokeStyle = "#f8fff8";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(17, 17);
  g.lineTo(26, 11);
  g.stroke();
  if (strain) {
    g.lineCap = "round";
    g.strokeStyle = strain === 3 ? "#ffeded" : "#321b37";
    g.lineWidth = strain === 3 ? 3 : 1.5;
    g.beginPath();
    g.moveTo(18, 17);
    g.lineTo(27, 26);
    g.lineTo(22, 35);
    if (strain >= 2) {
      g.moveTo(27, 26);
      g.lineTo(37, 24);
      g.lineTo(44, 34);
    }
    if (strain >= 3) {
      g.moveTo(22, 35);
      g.lineTo(28, 46);
      g.moveTo(37, 24);
      g.lineTo(37, 14);
      g.moveTo(36, 34);
      g.lineTo(48, 45);
    }
    g.stroke();
    if (strain === 3) {
      g.strokeStyle = "#ff7f8c";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(32, 32, 29, 0, Math.PI * 2);
      g.stroke();
    }
  }
  return c;
}
for (const [kind, light, dark] of colors)
  for (let strain = 0; strain < 4; strain++)
    save(gem(kind, light, dark, strain), `${root}/gems/${kind}-${strain}.png`);
for (let strain = 0; strain < 4; strain++) {
  const [c, g] = canvas();
  const hues = [
    "#ee6c87",
    "#f8dd78",
    "#7aebce",
    "#8cb8fc",
    "#d0a0fc",
    "#f7e8ef",
  ];
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI) / 3;
    poly(
      g,
      [
        [32, 32],
        [32 + 29 * Math.cos(a), 32 + 29 * Math.sin(a)],
        [
          32 + 29 * Math.cos(a + Math.PI / 3),
          32 + 29 * Math.sin(a + Math.PI / 3),
        ],
      ],
      hues[j],
      "#e6fafa",
      1,
    );
  }
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(32, 32, 9, 0, Math.PI * 2);
  g.fill();
  if (strain) {
    g.strokeStyle = strain === 3 ? "#ff576e" : "#243353";
    g.lineWidth = strain === 3 ? 3 : 2;
    g.beginPath();
    g.moveTo(18, 16);
    g.lineTo(31, 31);
    g.lineTo(24, 43);
    if (strain >= 2) {
      g.moveTo(31, 31);
      g.lineTo(44, 24);
    }
    if (strain >= 3) {
      g.moveTo(31, 31);
      g.lineTo(47, 48);
    }
    g.stroke();
  }
  save(c, `${root}/gems/prism-${strain}.png`);
}
for (const cut of ["brilliant", "star"]) {
  const [c, g] = canvas();
  g.strokeStyle = cut === "star" ? "#fff4b6" : "#fafffa";
  g.lineWidth = 3;
  g.shadowColor = "#fff3ab";
  g.shadowBlur = 7;
  g.beginPath();
  if (cut === "star") {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      g.moveTo(32 + 18 * Math.cos(a), 32 + 18 * Math.sin(a));
      g.lineTo(32 + 31 * Math.cos(a), 32 + 31 * Math.sin(a));
    }
  } else {
    g.arc(32, 32, 25, 0, Math.PI * 2);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      g.moveTo(32 + 22 * Math.cos(a), 32 + 22 * Math.sin(a));
      g.lineTo(32 + 30 * Math.cos(a), 32 + 30 * Math.sin(a));
    }
  }
  g.stroke();
  save(c, `${root}/gems/${cut}.png`);
}
for (const [kind, light, dark] of [...colors, ["prism", "#f4e5ff", "#668cb3"]])
  for (let f = 0; f < 6; f++) {
    const [c, g] = canvas();
    const offsets = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    for (let i = 0; i < 4; i++) {
      const [dx, dy] = offsets[i];
      g.save();
      g.translate(32 + dx * (f * 3 + 2), 32 + dy * (f * 3 + 2));
      g.rotate(dx * dy * f * 0.14);
      g.globalAlpha = 1 - f / 7;
      poly(
        g,
        [
          [-11, -12],
          [8, -9],
          [10, 6],
          [-7, 12],
        ],
        i % 2 ? light : dark,
        "#ffefda",
        1,
      );
      g.restore();
    }
    save(c, `${root}/gems/break/${kind}/${f}.png`);
  }
for (let f = 0; f < 6; f++) {
  const [c, g] = canvas();
  g.translate(32, 32);
  g.rotate((f * Math.PI) / 18);
  for (let j = 0; j < 6; j++) {
    const a = (j * Math.PI) / 3;
    poly(
      g,
      [
        [0, 0],
        [29 * Math.cos(a), 29 * Math.sin(a)],
        [29 * Math.cos(a + Math.PI / 3), 29 * Math.sin(a + Math.PI / 3)],
      ],
      ["#ee6c87", "#f8dd78", "#7aebce", "#8cb8fc", "#d0a0fc", "#f7e8ef"][j],
      "#f5fffb",
      1,
    );
  }
  g.beginPath();
  g.fillStyle = "#fff";
  g.arc(0, 0, 7, 0, Math.PI * 2);
  g.fill();
  save(c, `${root}/gems/prism-turn/${f}.png`);
}
const [board, g] = canvas(612, 612);
g.fillStyle = "#0e2331";
g.fillRect(0, 0, 612, 612);
g.strokeStyle = "#977f5b";
g.lineWidth = 14;
g.strokeRect(7, 7, 598, 598);
g.strokeStyle = "#d4be8a";
g.lineWidth = 3;
g.strokeRect(17, 17, 578, 578);
for (let i = 0; i < 8; i++) {
  g.fillStyle = i % 2 ? "#c2aa78" : "#786346";
  g.fillRect(26 + i * 72, 12, 32, 4);
  g.fillRect(26 + i * 72, 596, 32, 4);
}
for (const x of [18, 594])
  for (const y of [18, 594]) {
    g.fillStyle = "#e6d4a9";
    g.beginPath();
    g.arc(x, y, 7, 0, Math.PI * 2);
    g.fill();
  }
save(board, `${root}/board/frame.png`);
