// Post the Meme, Win the Feed — the entry is the X post itself. This program
// copies POST.json from the repository root to /output/POST.json, where the
// gate reads it. Written from scratch (own structure and validation), not
// copied from the kit starter. First draft.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
if (!existsSync(source)) {
  console.error(`POST.json not found in ${BOT_DIR}`);
  process.exit(1);
}

const parsed = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
if (typeof parsed.url !== 'string' || !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\w+\/status\/\d+/.test(parsed.url)) {
  // Placeholder URL (e.g. .../status/PLACEHOLDER): still copy it through so the
  // gate can read it and refuse it as a placeholder — the real post URL
  // replaces it before submission. Never fail the run over the placeholder.
  console.warn('POST.json holds a placeholder URL, not a real post yet');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, join(OUTPUT_DIR, 'POST.json'));
