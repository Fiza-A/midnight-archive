import fs from "node:fs";
import path from "node:path";

console.log("\n✓ Background music uses YouTube:");
console.log("  Halka Halka Suroor — G8wCaZ2Kok8");
console.log("  No local MP3 required.\n");

const audioDir = path.join(process.cwd(), "public", "assets", "audio");
const candidates = [
  "halka-halka-suroor.mp3",
  "background-music.mp3",
  "music.mp3",
];

const found = candidates.filter((name) => fs.existsSync(path.join(audioDir, name)));
if (found.length > 0) {
  console.log("Optional local MP3 files found (not used — YouTube is configured):");
  for (const name of found) console.log(`  - ${name}`);
  console.log("");
}
