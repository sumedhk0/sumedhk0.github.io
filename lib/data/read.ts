import fs from "node:fs";
import path from "node:path";

// Build-time readers for chart data committed under content/data/.
const ROOT = path.join(process.cwd(), "content", "data");

function splitRow(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim() !== "");
  const [head, ...rows] = lines;
  const keys = splitRow(head);
  return rows.map((line) => {
    const cells = splitRow(line);
    return Object.fromEntries(keys.map((k, i) => [k, cells[i] ?? ""]));
  });
}

export function readCsv(relPath: string): Record<string, string>[] {
  return parseCsv(fs.readFileSync(path.join(ROOT, relPath), "utf8"));
}

export function readJson<T>(relPath: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf8")) as T;
}
