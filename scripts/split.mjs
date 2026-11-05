import sharp from "sharp";
const [file, stepArg] = process.argv.slice(2);
const img = sharp(file); const { width, height } = await img.metadata();
const step = Number(stepArg || (width > 1000 ? 2200 : 1700));
let i = 0;
for (let y = 0; y < height; y += step, i++) {
  await sharp(file).extract({ left: 0, top: y, width, height: Math.min(step, height - y) }).toFile(file.replace(".png", `-p${i}.png`));
}
console.log(file, width, height, i, "partes");
