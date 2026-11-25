import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The whole joke lives in one line below. Everything else in this file
// exists only to make sure that line is worth shipping: short enough to
// fit the cap, long enough to say something, and not just blank space
// pretending to be a commit message.
const LINE = "fix: doubled the timeout, deploys now fail twice as slowly";

// The bounty caps the message at one hundred characters. One is the
// floor because an empty string is not a message, it is a shrug.
const SHORTEST_OK = 1;
const LONGEST_OK = 100;

// A character counts as visible when trimming it leaves something
// behind. Spaces, tabs and newlines all trim down to nothing, so a
// string made only of those has no visible glyph at all.
function hasVisibleGlyph(text: string): boolean {
  for (const glyph of text) {
    if (glyph.trim().length > 0) {
      return true;
    }
  }
  return false;
}

// Count the message the slow way, glyph by glyph, so nobody has to
// trust a single built-in property without seeing the arithmetic.
function countGlyphs(text: string): number {
  let tally = 0;
  for (const _glyph of text) {
    tally += 1;
  }
  return tally;
}

// A message passes when it has at least one visible glyph and its
// length sits inside the allowed band. Either failure gets a plain
// error naming the exact count, so a bad line is easy to spot.
function passesLengthBand(text: string): boolean {
  const size = countGlyphs(text);
  if (size < SHORTEST_OK) {
    throw new Error(`message is empty, needs at least ${SHORTEST_OK} character`);
  }
  if (size > LONGEST_OK) {
    throw new Error(`message is ${size} characters, cap is ${LONGEST_OK}`);
  }
  if (!hasVisibleGlyph(text)) {
    throw new Error("message is only whitespace, needs a visible character");
  }
  return true;
}

// Pick the output folder from the environment when the harness sets
// one, otherwise fall back to a plain `out` folder next to this file.
function pickOutputFolder(): string {
  const given = process.env.MAKEFUN_OUTPUT_DIR;
  if (given !== undefined && given.trim().length > 0) {
    return resolve(given);
  }
  return resolve("out");
}

function main(): void {
  passesLengthBand(LINE);
  const folder = pickOutputFolder();
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "entry.txt"), LINE, "utf8");
}

main();
