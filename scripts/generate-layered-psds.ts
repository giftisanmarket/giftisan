/**
 * Builds fully editable, LAYERED Photoshop files from the marketing card SVGs.
 *
 * Every visual element (background, logo, each headline line, each pill, QR, etc.)
 * becomes its own normal, UNLOCKED, transparent pixel layer, organised into
 * folders that mirror the SVG group structure. No "Background" (locked) layer is
 * produced, so everything can be moved, hidden, recoloured or replaced.
 *
 * Usage:  npx tsx scripts/generate-layered-psds.ts
 * (Run scripts/generate-marketing-cards.ts first if the SVGs changed.)
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { writePsdBuffer, type Psd, type Layer } from "ag-psd";

const CARDS_DIR = path.resolve("public/marketing/cards");
const FILES = [
  "giftisan-card-front",
  "giftisan-card-back",
  "giftisan-card-front-ar",
  "giftisan-card-back-ar",
  "giftisan-cards-duo-showcase",
  "giftisan-cards-duo-showcase-ar",
];

// Never split groups deeper than this (keeps the layer panel readable).
const MAX_DEPTH = 3;

// ---------------------------------------------------------------------------
// Minimal SVG tree parser (input is our own well-formed generated SVG)
// ---------------------------------------------------------------------------
type SvgNode =
  | { type: "comment"; text: string }
  | { type: "text"; text: string }
  | { type: "element"; tag: string; openTag: string; attrs: Record<string, string>; children: SvgNode[]; raw: string };

function parseAttrs(openTag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([\w:-]+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(openTag))) attrs[m[1]] = m[2];
  return attrs;
}

function parseSvg(src: string): SvgNode {
  let i = 0;
  function parseNodes(endTag?: string): SvgNode[] {
    const nodes: SvgNode[] = [];
    while (i < src.length) {
      if (src.startsWith("<!--", i)) {
        const end = src.indexOf("-->", i);
        nodes.push({ type: "comment", text: src.slice(i + 4, end).trim() });
        i = end + 3;
      } else if (src.startsWith("</", i)) {
        const end = src.indexOf(">", i);
        const tag = src.slice(i + 2, end).trim();
        if (endTag && tag !== endTag) throw new Error(`Mismatched </${tag}> (expected </${endTag}>)`);
        i = end + 1;
        return nodes;
      } else if (src[i] === "<") {
        const start = i;
        const end = src.indexOf(">", i);
        const openTag = src.slice(i, end + 1);
        const tag = /^<([\w:-]+)/.exec(openTag)![1];
        i = end + 1;
        const selfClosing = openTag.endsWith("/>");
        const children = selfClosing ? [] : parseNodes(tag);
        nodes.push({ type: "element", tag, openTag, attrs: parseAttrs(openTag), children, raw: src.slice(start, i) });
      } else {
        const next = src.indexOf("<", i);
        const stop = next === -1 ? src.length : next;
        nodes.push({ type: "text", text: src.slice(i, stop) });
        i = stop;
      }
    }
    return nodes;
  }
  const roots = parseNodes();
  const svg = roots.find((n) => n.type === "element" && n.tag === "svg");
  if (!svg) throw new Error("No <svg> root found");
  return svg;
}

// ---------------------------------------------------------------------------
// Layer extraction
// ---------------------------------------------------------------------------
type LayerSpec =
  | { kind: "pixel"; name: string; markup: string }
  | { kind: "group"; name: string; children: LayerSpec[] };

const elements = (nodes: SvgNode[]) => nodes.filter((n) => n.type === "element") as Extract<SvgNode, { type: "element" }>[];

function textContent(n: SvgNode): string {
  if (n.type === "text") return n.text;
  if (n.type === "element") return n.children.map(textContent).join("");
  return "";
}

function cleanName(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/[=]{2,}/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/:.*$/, "")
    .trim()
    .slice(0, 60);
}

function describe(el: Extract<SvgNode, { type: "element" }>, comment?: string): string {
  if (comment) return cleanName(comment);
  const txt = cleanName(textContent(el));
  if (el.tag === "text") return txt ? `Text: ${txt}` : "Text";
  if (el.tag === "image") return "Logo Image";
  if (el.tag === "path") return el.attrs.d && el.attrs.d.length > 2000 ? "QR Code" : "Path";
  if (el.tag === "g") return txt ? cleanName(txt) : "Group";
  const map: Record<string, string> = { rect: "Shape", circle: "Circle", line: "Divider Line", ellipse: "Ellipse" };
  return map[el.tag] ?? el.tag;
}

/** A <g> is safe to split if splitting doesn't change rendering (no group-level effects). */
function isSplittable(el: Extract<SvgNode, { type: "element" }>): boolean {
  if (el.tag !== "g") return false;
  const blocking = ["filter", "clip-path", "mask", "opacity"];
  if (blocking.some((a) => a in el.attrs)) return false;
  return elements(el.children).length > 1;
}

function buildSpecs(nodes: SvgNode[], wrappers: string[], depth: number): LayerSpec[] {
  const specs: LayerSpec[] = [];
  let pendingComment: string | undefined;
  const usedNames = new Map<string, number>();
  const uniq = (name: string) => {
    const n = (usedNames.get(name) ?? 0) + 1;
    usedNames.set(name, n);
    return n > 1 ? `${name} ${n}` : name;
  };

  for (const node of nodes) {
    if (node.type === "comment") {
      pendingComment = node.text;
      continue;
    }
    if (node.type !== "element" || node.tag === "defs" || node.tag === "style") continue;

    const name = uniq(describe(node, pendingComment));
    pendingComment = undefined;

    if (depth < MAX_DEPTH && isSplittable(node)) {
      // Re-open this group as a wrapper (keeps transform & inherited attrs like text-anchor)
      const wrapperOpen = node.openTag.replace(/\/>$/, ">");
      const children = buildSpecs(node.children, [...wrappers, wrapperOpen], depth + 1);
      specs.push({ kind: "group", name, children });
    } else {
      const markup = wrappers.join("") + node.raw + "</g>".repeat(wrappers.length);
      specs.push({ kind: "pixel", name, markup });
    }
  }
  return specs;
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------
type Raster = { width: number; height: number; data: Uint8ClampedArray };

async function renderRgba(svg: string): Promise<Raster> {
  const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height, data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.length) };
}

/** Crop to the non-transparent bounding box so the PSD stays small. */
function cropToContent(r: Raster): { top: number; left: number; raster: Raster } | null {
  let minX = r.width, minY = r.height, maxX = -1, maxY = -1;
  for (let y = 0; y < r.height; y++) {
    const row = y * r.width * 4;
    for (let x = 0; x < r.width; x++) {
      if (r.data[row + x * 4 + 3] !== 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const src = ((y + minY) * r.width + minX) * 4;
    out.set(r.data.subarray(src, src + w * 4), y * w * 4);
  }
  return { top: minY, left: minX, raster: { width: w, height: h, data: out } };
}

async function specsToLayers(specs: LayerSpec[], svgOpen: string, defs: string): Promise<Layer[]> {
  const layers: Layer[] = [];
  // SVG paints first → bottom; ag-psd children are ordered bottom → top. Same order.
  for (const spec of specs) {
    if (spec.kind === "group") {
      const children = await specsToLayers(spec.children, svgOpen, defs);
      if (children.length) layers.push({ name: spec.name, opened: false, children });
      continue;
    }
    const raster = await renderRgba(`${svgOpen}${defs}${spec.markup}</svg>`);
    const cropped = cropToContent(raster);
    if (!cropped) continue;
    layers.push({
      name: spec.name,
      top: cropped.top,
      left: cropped.left,
      imageData: cropped.raster as unknown as ImageData,
      protected: { transparency: false, composite: false, position: false },
    });
  }
  return layers;
}

function countLayers(layers: Layer[]): number {
  return layers.reduce((n, l) => n + (l.children ? countLayers(l.children) : 1), 0);
}

// ---------------------------------------------------------------------------
async function buildPsd(base: string) {
  const svgPath = path.join(CARDS_DIR, `${base}.svg`);
  if (!fs.existsSync(svgPath)) {
    console.warn(`⚠ Skipping ${base}: ${base}.svg not found (run generate-marketing-cards.ts first).`);
    return;
  }
  const src = fs.readFileSync(svgPath, "utf8");
  const root = parseSvg(src) as Extract<SvgNode, { type: "element" }>;
  const width = parseInt(root.attrs.width, 10);
  const height = parseInt(root.attrs.height, 10);

  const svgOpen = root.openTag;
  const defs = elements(root.children)
    .filter((e) => e.tag === "defs" || e.tag === "style")
    .map((e) => e.raw)
    .join("");

  const specs = buildSpecs(root.children, [], 0);
  const children = await specsToLayers(specs, svgOpen, defs);
  const composite = await renderRgba(src);

  const psd: Psd = {
    width,
    height,
    channels: 3,
    bitsPerChannel: 8,
    colorMode: 3, // RGB
    imageResources: { resolutionInfo: { horizontalResolution: 300, horizontalResolutionUnit: "PPI", widthUnit: "Inches", verticalResolution: 300, verticalResolutionUnit: "PPI", heightUnit: "Inches" } },
    children,
    imageData: composite as unknown as ImageData,
  };

  const buffer = writePsdBuffer(psd, { generateThumbnail: false });
  const outPath = path.join(CARDS_DIR, `${base}.psd`);
  fs.writeFileSync(outPath, buffer);
  console.log(`✔ ${base}.psd  — ${countLayers(children)} editable layers, ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
}

async function run() {
  console.log("Building layered, unlocked PSDs...");
  for (const f of FILES) await buildPsd(f);
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
