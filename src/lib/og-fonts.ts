import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function ogFonts() {
  const base = join(process.cwd(), "node_modules/@fontsource");
  const [black, body] = await Promise.all([
    readFile(join(base, "archivo-black/files/archivo-black-latin-400-normal.woff")),
    readFile(join(base, "archivo/files/archivo-latin-600-normal.woff")),
  ]);
  return [
    { name: "Archivo Black", data: black, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: body, weight: 600 as const, style: "normal" as const },
  ];
}
