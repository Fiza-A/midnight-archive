import fs from "node:fs";
import path from "node:path";

const audioDir = path.join(process.cwd(), "public", "assets", "audio");
const candidates = [
  "halka-halka-suroor.mp3",
  "background-music.mp3",
  "music.mp3",
];

const found = candidates.filter((name) => fs.existsSync(path.join(audioDir, name)));

if (found.length === 0) {
  console.error("\n❌ No background music found.\n");
  console.error("Add your MP3 to:");
  console.error(`  ${path.join(audioDir, "halka-halka-suroor.mp3")}\n`);
  console.error("Then refresh the site.\n");
  process.exit(1);
}

for (const name of found) {
  const file = path.join(audioDir, name);
  const sizeMb = (fs.statSync(file).size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Found ${name} (${sizeMb} MB)`);
}
