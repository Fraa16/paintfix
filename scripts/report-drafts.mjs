// Lists everything that still needs client confirmation before go-live.
// Usage: npm run content:drafts        (report)
//        STRICT=1 npm run content:drafts (exit 1 if anything is still draft, e.g. for the launch check)
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';

const root = new URL('../', import.meta.url);
const read = (rel) => readFile(new URL(rel, root), 'utf8');
const findings = [];

for (const file of await readdir(new URL('src/content/data/', root))) {
  if (!file.endsWith('.yaml')) continue;
  const entries = parse(await read(`src/content/data/${file}`));
  for (const e of entries) {
    if (e.draft) {
      const label = e.name?.de ?? e.q?.de ?? e.label?.de ?? e.icao ?? e.id;
      findings.push(`${file.padEnd(24)} ${e.id.padEnd(22)} ${label}`);
    }
  }
}

const site = await read('src/content/site.ts');
const drafts = site.match(/drafts: \[([^\]]*)\]/)?.[1];
if (drafts)
  findings.push(
    `site.ts                  NAP/hours              ${drafts.replace(/'/g, '').trim()}`,
  );

for (const f of ['src/i18n/copy/aviation.ts', 'src/views/CarView.astro']) {
  const n = ((await read(f)).match(/draft: true/g) ?? []).length;
  if (n)
    findings.push(
      `${f.split('/').pop().padEnd(24)} copy blocks            ${n} claim(s) marked draft`,
    );
}

const media = await read('src/content/media.ts');
const placeholders = (media.match(/source: 'placeholder'/g) ?? []).length;
if (placeholders)
  findings.push(
    `media.ts                 image slots            ${placeholders} placeholder image(s)`,
  );

findings.push(
  'views                    legal pages            Impressum/Datenschutz marked draft until reviewed',
);

console.log(
  findings.length
    ? `Open items (${findings.length}):\n  ${findings.join('\n  ')}`
    : 'No drafts left.',
);
if (process.env.STRICT === '1' && findings.length) process.exit(1);
