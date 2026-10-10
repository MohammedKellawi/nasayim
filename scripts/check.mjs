// Post-build checks: broken internal links/assets, placeholder links, and forbidden financial content.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/nasayim/';
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
walk('dist');

const errors = [];
const forbidden = /\b(KWD|KD|JOD|JD|USD|IBAN)\b|د\.ك|د\.أ|دينار|\$\s?\d|\d\s?\$|1100|تكلفة|budget|price/i;

for (const f of files.filter((x) => /\.(html|xml|json|webmanifest|js|css|txt)$/.test(x))) {
  const src = readFileSync(f, 'utf8');
  const m = src.match(forbidden);
  if (m) errors.push(`${f}: forbidden financial term "${m[0]}"`);
  if (!f.endsWith('.html')) continue;
  if (/href="#"/.test(src)) errors.push(`${f}: placeholder href="#"`);
  for (const [, url] of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/')) continue;
    if (!url.startsWith(BASE)) { errors.push(`${f}: link outside base path ${url}`); continue; }
    const clean = url.split(/[?#]/)[0].slice(BASE.length);
    const target = join('dist', clean);
    const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) errors.push(`${f}: broken link ${url}`);
  }
  for (const [, id] of src.matchAll(/href="#([^"]+)"/g)) if (!src.includes(`id="${id}"`)) errors.push(`${f}: missing anchor #${id}`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${files.length} files: no broken links or financial content.`);
