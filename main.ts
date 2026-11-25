import * as fs from 'node:fs';
import * as path from 'node:path';

const LINE = 'fix: doubled the timeout, deploys now fail twice as slowly';

function pickFolder(): string {
  const supplied = process.env.MAKEFUN_OUTPUT_DIR;
  if (supplied !== undefined && supplied !== '') {
    return supplied;
  }
  return path.resolve('out');
}

function main(): void {
  // The gate accepts 1 to 100 characters, and refuses a line that is
  // only whitespace, so check both before writing anything.
  if (LINE.length < 1 || LINE.length > 100 || LINE.trim().length === 0) {
    throw new Error(
      `entry runs ${LINE.length} characters; the gate only accepts 1 to 100`,
    );
  }
  const folder = pickFolder();
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.resolve(folder, 'entry.txt'), LINE, 'utf8');
}

main();
