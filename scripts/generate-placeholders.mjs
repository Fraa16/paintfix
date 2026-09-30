// Generates placeholder imagery for every media slot, so layouts and parallax can be
// reviewed before the final AI/stock/client images exist.
// Output: src/assets/img/ph/*.{webp,png}. Replace slots via src/content/media.ts, not here.
//
// Usage: npm run assets:placeholders
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = new URL('../src/assets/img/ph/', import.meta.url);
await mkdir(OUT, { recursive: true });
const out = (name) => new URL(name, OUT).pathname;

// ---------- helpers ----------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Render fractal noise (0..1 grayscale) via librsvg feTurbulence. */
async function noise(w, h, fx, fy, octaves, seed) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <filter id="n" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="${octaves}" seed="${seed}"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#n)"/></svg>`;
  const { data } = await sharp(Buffer.from(svg))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) n[i] = data[i * 3] / 255;
  return n;
}

/** Multi-stop vertical gradient sampler. stops: [[pos, '#hex'], ...] */
function gradient(stops) {
  const s = stops.map(([p, c]) => [p, hex(c)]);
  return (t) => {
    for (let i = 0; i < s.length - 1; i++) {
      const [p0, c0] = s[i];
      const [p1, c1] = s[i + 1];
      if (t <= p1) {
        const k = clamp((t - p0) / (p1 - p0));
        return [0, 1, 2].map((j) => mix(c0[j], c1[j], k));
      }
    }
    return s[s.length - 1][1];
  };
}

async function save(buf, w, h, channels, file, blur = 0) {
  let img = sharp(buf, { raw: { width: w, height: h, channels } });
  if (blur) img = img.blur(blur);
  if (file.endsWith('.png')) await img.png({ compressionLevel: 9 }).toFile(out(file));
  else await img.webp({ quality: 88 }).toFile(out(file));
  console.log('  ✓', file);
}

// ---------- aviation: golden-hour sky plate ----------
async function sky(file, w, h, sunX = 0.72, sunY = 0.66) {
  const grad = gradient([
    [0, '#0B1428'],
    [0.28, '#1C2C4E'],
    [0.5, '#5B5E78'],
    [0.64, '#C98A5A'],
    [0.74, '#F2B872'],
    [0.84, '#F8D9A0'],
    [1, '#F3C98B'],
  ]);
  const cirrus = await noise(w, h, 0.0012, 0.012, 4, 11);
  const grain = await noise(w, h, 0.9, 0.9, 1, 5);
  const buf = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let [r, g, b] = grad(y / h);
      // sun glow
      const dx = (x / w - sunX) * (w / h);
      const dy = y / h - sunY;
      const d = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.exp(-d * 5.5) * 0.9 + Math.exp(-d * 22) * 0.6;
      r = mix(r, 255, glow * 0.85);
      g = mix(g, 226, glow * 0.8);
      b = mix(b, 170, glow * 0.6);
      // high cirrus streaks, only in the upper-middle band
      const band = smooth(0.2, 0.45, y / h) * (1 - smooth(0.55, 0.7, y / h));
      const c = smooth(0.52, 0.72, cirrus[i]) * band * 0.35;
      r = mix(r, 250, c);
      g = mix(g, 196, c);
      b = mix(b, 150, c);
      const gn = (grain[i] - 0.5) * 6;
      buf[i * 3] = clamp(r + gn, 0, 255);
      buf[i * 3 + 1] = clamp(g + gn, 0, 255);
      buf[i * 3 + 2] = clamp(b + gn, 0, 255);
    }
  }
  await save(buf, w, h, 3, file);
}

// ---------- aviation: cloud layers (RGBA) ----------
async function clouds(file, w, h, { seed, fx, fy, top, soft, bright, shade, density }) {
  const n = await noise(w, h, fx, fy, 4, seed);
  const buf = Buffer.alloc(w * h * 4);
  const lit = hex(bright);
  const dark = hex(shade);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const v = y / h;
      // clouds live in the lower part; a ragged top edge driven by noise
      const mask = smooth(top - soft, top + soft, v + (n[i] - 0.5) * 0.45);
      const a = clamp(smooth(0.5 - density, 0.62 - density * 0.4, n[i]) * mask * 1.15);
      // lighting: brighter where noise rises towards the top (fake normal)
      const up = y > 3 ? n[i] - n[i - 3 * w] : 0;
      const light = clamp(0.6 + up * 5 - v * 0.3);
      buf[i * 4] = mix(dark[0], lit[0], light);
      buf[i * 4 + 1] = mix(dark[1], lit[1], light);
      buf[i * 4 + 2] = mix(dark[2], lit[2], light);
      buf[i * 4 + 3] = a * 255;
    }
  }
  await save(buf, w, h, 4, file, 2.2);
}

// ---------- aviation: generic business jet (no registration, no livery, no badge) ----------
function jetSvg(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1600 560">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF3DF"/>
      <stop offset="0.18" stop-color="#F4F0EA"/>
      <stop offset="0.55" stop-color="#D9D6D2"/>
      <stop offset="0.85" stop-color="#8F8B87"/>
      <stop offset="1" stop-color="#5E5B59"/>
    </linearGradient>
    <linearGradient id="tail" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF1DA"/>
      <stop offset="1" stop-color="#B9B4AE"/>
    </linearGradient>
    <linearGradient id="nacelle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF6E8"/>
      <stop offset="0.5" stop-color="#DAD6D0"/>
      <stop offset="1" stop-color="#7C7874"/>
    </linearGradient>
    <linearGradient id="wing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#D8D3CC"/>
      <stop offset="1" stop-color="#8A8581"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2A3346"/>
      <stop offset="0.6" stop-color="#101727"/>
      <stop offset="1" stop-color="#E9B97A"/>
    </linearGradient>
  </defs>
  <g transform="rotate(-5 800 300)">
    <!-- far wing (shadowed) -->
    <path d="M880 318 L1000 292 L1040 294 L930 326 Z" fill="#7B7672" opacity="0.8"/>
    <!-- vertical stabiliser -->
    <path d="M430 236 L318 66 L236 66 L262 236 Z" fill="url(#tail)"/>
    <path d="M186 70 L372 58 L376 72 L192 82 Z" fill="#E7E2DA"/>
    <!-- fuselage -->
    <path d="M1512 306 C1470 272 1402 246 1330 238 L1250 232 L460 228 C360 228 290 236 214 252 L176 262
             C186 272 206 280 236 284 L520 334 L1290 340 C1400 340 1470 330 1512 306 Z" fill="url(#body)"/>
    <!-- warm rim light on the crown -->
    <path d="M1330 238 L1250 232 L460 228 C360 228 290 236 214 252" fill="none" stroke="#FFE2B0" stroke-width="3" opacity="0.9"/>
    <!-- subtle cheatline -->
    <path d="M1470 300 C1400 306 1320 308 1250 308 L470 300 C380 298 300 290 230 276" fill="none" stroke="#1B2A4A" stroke-width="5" opacity="0.55"/>
    <!-- cockpit glass -->
    <path d="M1438 262 C1414 250 1392 244 1366 242 L1360 262 Z" fill="url(#glass)"/>
    <!-- cabin windows -->
    ${Array.from({ length: 9 }, (_, k) => `<rect x="${1215 - k * 62}" y="258" width="26" height="30" rx="13" fill="url(#glass)"/>`).join('')}
    <!-- door outline -->
    <path d="M1292 250 L1320 250 L1320 318 L1292 318 Z" fill="none" stroke="#A9A49E" stroke-width="2"/>
    <!-- engine pylon + nacelle -->
    <path d="M470 232 L540 232 L520 250 L480 250 Z" fill="#B7B2AC"/>
    <rect x="330" y="196" width="250" height="58" rx="29" fill="url(#nacelle)"/>
    <ellipse cx="572" cy="225" rx="12" ry="27" fill="#1D2433"/>
    <path d="M340 204 L560 204" stroke="#FFF1DC" stroke-width="3" opacity="0.8"/>
    <!-- near wing -->
    <path d="M960 328 L700 336 L560 404 L596 406 L690 382 L990 340 Z" fill="url(#wing)"/>
    <path d="M566 404 L540 356 L556 356 L594 402 Z" fill="#CFCAC3"/>
    <!-- belly shade -->
    <path d="M520 334 L1290 340 C1400 340 1470 330 1512 306" fill="none" stroke="#4A4745" stroke-width="3" opacity="0.5"/>
  </g>
</svg>`;
}

async function jet(file, w, h) {
  await sharp(Buffer.from(jetSvg(w, h)))
    .png({ compressionLevel: 9 })
    .toFile(out(file));
  console.log('  ✓', file);
}

// ---------- composite: sky + clouds + jet (used for diptych / interstitials) ----------
async function composite(file, w, h, { jetScale = 0.7, jetX = 0.18, jetY = 0.22 } = {}) {
  const skyBuf = await sharp(out('av-sky.webp')).resize(w, h, { fit: 'cover' }).toBuffer();
  const cl = await sharp(out('av-clouds-mid.webp'))
    .resize(w, Math.round(h * 0.55), { fit: 'cover' })
    .toBuffer();
  const cn = await sharp(out('av-clouds-near.webp'))
    .resize(w, Math.round(h * 0.45), { fit: 'cover' })
    .toBuffer();
  const jw = Math.round(w * jetScale);
  const j = await sharp(out('av-jet.png')).resize(jw).toBuffer();
  await sharp(skyBuf)
    .composite([
      { input: cl, top: Math.round(h * 0.45), left: 0 },
      { input: j, top: Math.round(h * jetY), left: Math.round(w * jetX) },
      { input: cn, top: Math.round(h * 0.58), left: 0 },
    ])
    .webp({ quality: 86 })
    .toFile(out(file));
  console.log('  ✓', file);
}

// ---------- labelled photo-slot placeholders ----------
async function slot(file, w, h, { from, to, light = false, label }) {
  const ink = light ? '#1A1D21' : '#F5F3EE';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
      <radialGradient id="v" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
      <linearGradient id="s" x1="0" y1="0" x2="1" y2="0.35"><stop offset="0.35" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.65" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#s)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
    <text x="${Math.round(w * 0.04)}" y="${h - Math.round(h * 0.05)}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${Math.max(16, Math.round(w / 60))}" letter-spacing="2" fill="${ink}" opacity="0.7">PLATZHALTER · ${label.toUpperCase().replace(/&/g, '&amp;')}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(out(file));
  console.log('  ✓', file);
}

console.log('Aviation layers');
await sky('av-sky.webp', 2400, 1400);
await clouds('av-clouds-far.webp', 2400, 700, {
  seed: 21,
  fx: 0.0018,
  fy: 0.006,
  top: 0.35,
  soft: 0.25,
  bright: '#FFDDB0',
  shade: '#8E7D83',
  density: 0.02,
});
await clouds('av-clouds-mid.webp', 2400, 800, {
  seed: 7,
  fx: 0.0024,
  fy: 0.007,
  top: 0.3,
  soft: 0.22,
  bright: '#FFE9C8',
  shade: '#9A8A8C',
  density: 0.05,
});
await clouds('av-clouds-near.webp', 2400, 900, {
  seed: 3,
  fx: 0.0016,
  fy: 0.0045,
  top: 0.25,
  soft: 0.2,
  bright: '#FFF6E6',
  shade: '#A89A98',
  density: 0.08,
});
await jet('av-jet.png', 1600, 560);

console.log('Aviation composites');
await composite('av-diptych.webp', 1400, 1600, { jetScale: 0.9, jetX: 0.05, jetY: 0.2 });
await composite('av-interlude.webp', 2400, 1300, { jetScale: 0.45, jetX: 0.3, jetY: 0.25 });
await composite('av-flyby-sky.webp', 2400, 1200, { jetScale: 0.001, jetX: 0, jetY: 0 });

console.log('Photo slots');
const navy = { from: '#16223F', to: '#0B1122' };
const warm = { from: '#6B4A2E', to: '#1A1410' };
const hangar = { from: '#5C6068', to: '#23262C' };
const studio = { from: '#E9EAEC', to: '#9EA2A8', light: true };
const graphite = { from: '#3A3F46', to: '#15181C' };
const ivory = { from: '#F4F1EA', to: '#CFC8BA', light: true };
await slot('av-cabin.webp', 1600, 1200, { ...warm, label: 'Kabine: Leder & Furnier' });
await slot('av-hangar.webp', 2400, 1400, { ...hangar, label: 'Hangar / Triebwerk, entsättigt' });
await slot('av-ext-wash.webp', 1400, 900, { ...hangar, label: 'Exterior: Hybrid-/Dry-Wash' });
await slot('av-ext-brightwork.webp', 1400, 900, {
  ...ivory,
  label: 'Brightwork: poliertes Aluminium',
});
await slot('av-int-leather.webp', 1400, 900, { ...warm, label: 'Interior: Lederpflege' });
await slot('av-int-carpet.webp', 1400, 900, { ...navy, label: 'Interior: Teppich & Galley' });
await slot('av-interstitial.webp', 2400, 1300, { ...warm, label: 'Mood: Kabinendetail' });
await slot('auto-hero.webp', 2400, 1400, { ...studio, label: 'Alltagsauto im Tageslicht-Studio' });
await slot('auto-diptych.webp', 1400, 1600, { ...studio, label: 'Auto: Glanz & Reflexion' });
await slot('auto-int-1.webp', 1400, 900, { ...graphite, label: 'Innenraum: Sitze & Polster' });
await slot('auto-int-2.webp', 1400, 900, { ...studio, label: 'Innenraum: Cockpit-Detail' });
await slot('auto-ext-1.webp', 1400, 900, { ...studio, label: 'Außen: Handwäsche / Schaum' });
await slot('auto-ext-2.webp', 1400, 900, { ...graphite, label: 'Lack: Politur-Detail' });
await slot('auto-cer-1.webp', 1400, 900, { ...graphite, label: 'Keramik: Abperleffekt' });
await slot('auto-cer-2.webp', 1400, 900, { ...studio, label: 'Keramik: Spiegelglanz' });
await slot('home-owner.webp', 1200, 1500, { ...graphite, label: 'Portrait Inhaber' });
await slot('home-workshop.webp', 1600, 1200, { ...studio, label: 'Werkstatt / Arbeitsplatz' });
console.log('Done.');
