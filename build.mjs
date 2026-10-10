// Static site generator for the Nasaem Al-Ekhaa website (no dependencies).
// Usage: node build.mjs  → writes the complete site into dist/
import { mkdirSync, writeFileSync, cpSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { site, stats, waLink } from './src/data/site.mjs';
import { programs, developmentProjects, facilities, gallery, photos } from './src/data/programs.mjs';
const sizes = JSON.parse(readFileSync('src/data/image-sizes.json', 'utf8'));
import { t } from './src/i18n.mjs';

const OUT = 'dist';
const LANGS = ['ar', 'en'];
const BASE = site.base;
const ABS = site.url + BASE;
const year = new Date().getFullYear();
const pages = []; // for sitemap: { path } relative to lang root

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const u = (lang, p = '') => `${BASE}${lang}/${p}`;
const asset = (p) => `${BASE}${p}`;
const ext = 'target="_blank" rel="noopener noreferrer"';
const hasGallery = gallery.length > 0;

// Responsive photo from the catalog (public/images/<key>.webp + <key>-sm.webp).
const alt = (key, lang) => photos[key][lang === 'ar' ? 1 : 2];
function img(key, lang, { cls = '', sizesAttr = '(min-width: 900px) 50vw, 100vw', eager = false, decorative = false } = {}) {
  const [w, h] = sizes[key];
  return `<img class="${cls}" src="${asset(`images/${key}.webp`)}" srcset="${asset(`images/${key}-sm.webp`)} 800w, ${asset(`images/${key}.webp`)} ${w}w" sizes="${sizesAttr}" width="${w}" height="${h}" alt="${decorative ? '' : esc(alt(key, lang))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

// Lucide icons (ISC license), inlined.
const P = {
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
  heartPulse: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  heartHand: '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
  building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  graduation: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${n === 'arrow' ? 'ic-dir ' : ''}${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n]}</svg>`;

const statById = Object.fromEntries(stats.map((s) => [s.id, s]));

// ---------- layout ----------
function header(lang, key, path) {
  const L = t[lang];
  const items = [
    ['home', ''], ['about', 'about/'], ['programs', 'programs/'], ['development', 'development/'],
    ['impact', 'impact/'], ['facilities', 'facilities/'], ...(hasGallery ? [['gallery', 'gallery/']] : []), ['contact', 'contact/'],
  ];
  const nav = items.map(([k, p]) => `<li><a href="${u(lang, p)}"${k === key ? ' aria-current="page"' : ''}>${L.nav[k]}</a></li>`).join('');
  return `<header class="site-header">
  <div class="container hdr">
    <a class="brand" href="${u(lang)}"><img src="${asset('assets/logo.png')}" alt="${esc(site.name[lang])}" width="531" height="316"></a>
    <nav class="nav" id="site-nav" aria-label="${lang === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'}">
      <ul>${nav}</ul>
      <div class="nav-actions">
        <a class="lang" href="${u(L.other, path)}" lang="${L.other}" hreflang="${L.other}">${icon('globe')}<span>${L.otherLabel}</span></a>
        <a class="btn btn-accent btn-sm" href="${u(lang, 'get-involved/')}"${key === 'involved' ? ' aria-current="page"' : ''}>${L.nav.involved}</a>
      </div>
    </nav>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-open="${L.menu}" data-close="${L.close}"><span class="sr">${L.menu}</span>${icon('menu', 'i-open')}${icon('x', 'i-close')}</button>
  </div>
</header>`;
}

function footer(lang) {
  const L = t[lang];
  return `<footer class="site-footer">
  <div class="container ftr">
    <div class="ftr-brand">
      <img src="${asset('assets/logo.png')}" alt="${esc(site.name[lang])}" width="531" height="316" loading="lazy">
      <p>${L.footer.desc}</p>
      <p class="legal">${L.footer.legal}</p>
    </div>
    <nav aria-label="${L.footer.quick}"><h2>${L.footer.quick}</h2><ul>
      <li><a href="${u(lang, 'about/')}">${L.nav.about}</a></li>
      <li><a href="${u(lang, 'development/')}">${L.nav.development}</a></li>
      <li><a href="${u(lang, 'impact/')}">${L.nav.impact}</a></li>
      <li><a href="${u(lang, 'facilities/')}">${L.nav.facilities}</a></li>
      ${hasGallery ? `<li><a href="${u(lang, 'gallery/')}">${L.nav.gallery}</a></li>` : ''}
      <li><a href="${u(lang, 'get-involved/')}">${L.nav.involved}</a></li>
    </ul></nav>
    <nav aria-label="${L.footer.programs}"><h2>${L.footer.programs}</h2><ul>
      ${programs.map((p) => `<li><a href="${u(lang, `programs/${p.slug}/`)}">${p.title[lang]}</a></li>`).join('')}
    </ul></nav>
    <div><h2>${L.footer.contact}</h2><ul class="ftr-contact">
      <li><a href="tel:${site.phoneIntl}">${icon('phone')}<span dir="ltr">${site.phoneLocal}</span></a></li>
      <li><a href="mailto:${site.email}">${icon('mail')}<span dir="ltr">${site.email}</span></a></li>
      <li><a href="${waLink(lang)}" ${ext}>${icon('chat')}<span>${L.contact.whatsapp}</span></a></li>
      <li><a href="${site.facebook}" ${ext}>${icon('facebook')}<span>${L.contact.facebook}</span></a></li>
      <li><a href="${site.mapUrl}" ${ext}>${icon('mapPin')}<span>${site.address[lang]}</span></a></li>
    </ul></div>
  </div>
  <div class="container copy"><p>© <span data-year>${year}</span> ${site.name[lang]}. ${L.footer.rights}</p></div>
</footer>
<a class="wa-float" href="${waLink(lang)}" ${ext} aria-label="${L.cta.waLong}">${icon('chat')}<span>${L.contact.whatsapp}</span></a>`;
}

function page({ lang, key, path, title, desc, body, crumbs = [], noindex = false }) {
  const L = t[lang];
  const fullTitle = key === 'home' ? title : `${title} | ${site.name[lang]}`;
  const canonical = ABS + `${lang}/${path}`;
  const crumbLd = crumbs.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [[L.breadcrumbHome, ''], ...crumbs].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ABS + `${lang}/${p}` })),
  })}</script>` : '';
  const orgLd = key === 'home' ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'NGO', name: site.name.en, alternateName: site.name.ar,
    url: ABS, logo: ABS + 'assets/logo.png', foundingDate: site.founded.iso, email: site.email, telephone: site.phoneIntl,
    address: { '@type': 'PostalAddress', streetAddress: site.address.en, addressLocality: 'Hisban', addressCountry: 'JO' },
    sameAs: [site.facebook],
  })}</script>` : '';
  if (!noindex) pages.push(path);
  return `<!doctype html>
<html lang="${lang}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${ABS}ar/${path}">
<link rel="alternate" hreflang="en" href="${ABS}en/${path}">
<link rel="alternate" hreflang="x-default" href="${ABS}ar/${path}">`}
<meta name="theme-color" content="#176031">
<link rel="icon" href="${asset('favicon.ico')}" sizes="32x32">
<link rel="icon" type="image/png" href="${asset('assets/icon-192.png')}" sizes="192x192">
<link rel="apple-touch-icon" href="${asset('assets/icon-180.png')}">
<link rel="manifest" href="${asset('site.webmanifest')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name[lang])}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ABS}assets/og-image.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_JO' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;1,600&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${asset('assets/style.css')}">
${orgLd}${crumbLd}
</head>
<body>
<a class="skip" href="#main">${L.skip}</a>
${header(lang, key, path)}
<main id="main" tabindex="-1">
${crumbs.length ? breadcrumbs(lang, crumbs) : ''}
${body}
</main>
${footer(lang)}
<script src="${asset('assets/main.js')}" defer></script>
</body>
</html>`;
}

function breadcrumbs(lang, crumbs) {
  const L = t[lang];
  const all = [[L.breadcrumbHome, ''], ...crumbs];
  return `<nav class="crumbs container" aria-label="${lang === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}"><ol>${all.map(([n, p], i) =>
    i === all.length - 1 ? `<li><span aria-current="page">${n}</span></li>` : `<li><a href="${u(lang, p)}">${n}</a></li>`).join('')}</ol></nav>`;
}

const pageHead = (eyebrow, title, lead, extra = '') => `<section class="page-head"><div class="container">
  ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></section>`;

// ---------- reusable blocks ----------
const statsBlock = (lang, dark = true) => `<ul class="stats ${dark ? 'stats-dark' : ''}">${stats.map((s) => `<li>
  <a href="${u(lang, `programs/${s.program}/`)}"><span class="num"><span data-count="${s.value}">${s.value}</span>+</span><span class="lbl">${s[lang]}</span></a></li>`).join('')}</ul>`;

const programCard = (lang, p, big = false) => {
  const s = p.stat && statById[p.stat];
  const cover = p.images?.[0];
  return `<article class="pcard${big ? ' pcard-big' : ''}${cover ? ' has-img' : ''}">
  ${cover ? `<div class="pcard-img">${img(cover, lang, { sizesAttr: '(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw', decorative: true })}</div>` : ''}
  <span class="pcard-ic">${icon(p.icon)}</span>
  <h3><a href="${u(lang, `programs/${p.slug}/`)}" class="stretch">${p.title[lang]}</a></h3>
  <p class="tag">${p.tagline[lang]}</p>
  ${big ? `<p>${p.summary[lang]}</p>` : ''}
  <div class="pcard-foot">${s ? `<span class="pstat"><b>${s.value}+</b> ${s[lang]}</span>` : '<span></span>'}<span class="more">${t[lang].learnMore} ${icon('arrow')}</span></div>
</article>`;
};

const ctaBand = (lang) => {
  const C = t[lang].cta;
  return `<section class="cta-band"><div class="container cta-inner">
  <div><h2>${C.title}</h2><p>${C.text}</p></div>
  <div class="cta-actions">
    <a class="btn btn-accent" href="${u(lang, 'contact/')}">${C.contribute}</a>
    <a class="btn btn-light" href="${waLink(lang)}" ${ext}>${icon('chat')} ${C.whatsapp}</a>
  </div></div></section>`;
};

const contactCards = (lang) => {
  const C = t[lang].contact;
  const card = (ic, label, val, href, ltr, external) => `<li><a class="ccard" href="${href}"${external ? ' ' + ext : ''}>
    <span class="ccard-ic">${icon(ic)}</span><span><span class="ccard-l">${label}</span><span class="ccard-v"${ltr ? ' dir="ltr"' : ''}>${val}</span></span></a></li>`;
  return `<ul class="ccards">
  ${card('phone', C.phone, site.phoneLocal, `tel:${site.phoneIntl}`, true)}
  ${card('chat', C.whatsapp, site.phoneIntl, waLink(lang), true, true)}
  ${card('mail', C.email, site.email, `mailto:${site.email}`, true)}
  ${card('facebook', C.facebook, C.fbLabel, site.facebook, false, true)}
  ${card('mapPin', C.address, site.address[lang], site.mapUrl, false, true)}
</ul>`;
};

// ---------- pages ----------
function home(lang) {
  const L = t[lang];
  const [first, ...rest] = programs;
  const body = `
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="badge">${icon('check')} ${L.licenseLine}</p>
      <h1>${L.hero.title}</h1>
      <p class="lead">${L.hero.lead}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${u(lang, 'programs/')}">${L.hero.cta1} ${icon('arrow')}</a>
        <a class="btn btn-outline" href="${u(lang, 'get-involved/')}">${L.hero.cta2}</a>
      </div>
    </div>
    <div class="hero-art">
      ${img('relief-3', lang, { cls: 'hero-photo', eager: true, sizesAttr: '(min-width: 900px) 45vw, 100vw' })}
      <span class="since">${L.since}</span>
    </div>
  </div>
</section>

<section class="impact-sec" aria-labelledby="impact-h">
  <div class="container">
    <div class="impact-head"><h2 id="impact-h">${L.impact.title}</h2><p>${L.impact.lead}</p></div>
    ${statsBlock(lang)}
  </div>
</section>

<section class="section about-prev">
  <div class="container split">
    <div>
      <p class="eyebrow">${L.about.eyebrow}</p>
      <h2>${L.about.title}</h2>
      <p>${L.about.p1}</p>
      <a class="link-arrow" href="${u(lang, 'about/')}">${L.learnMore} ${icon('arrow')}</a>
    </div>
    <dl class="facts">${L.about.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="section tracks-sec">
  <div class="container">
    <h2 class="sec-title">${L.tracks.title}</h2>
    <p class="sec-lead">${L.tracks.lead}</p>
    <div class="tracks">
      <a class="track track-relief" href="${u(lang, 'programs/')}">${icon('heartHand')}<h3>${L.tracks.relief}</h3><p>${L.tracks.reliefT}</p><span class="more">${L.learnMore} ${icon('arrow')}</span></a>
      <a class="track track-dev" href="${u(lang, 'development/')}">${icon('sprout')}<h3>${L.tracks.dev}</h3><p>${L.tracks.devT}</p><span class="more">${L.learnMore} ${icon('arrow')}</span></a>
    </div>
  </div>
</section>

<section class="section programs-sec">
  <div class="container">
    <div class="sec-row"><div><p class="eyebrow">${L.nav.programs}</p><h2 class="sec-title">${L.programsSec.title}</h2></div>
      <a class="link-arrow" href="${u(lang, 'programs/')}">${L.programsSec.all} ${icon('arrow')}</a></div>
    <p class="sec-lead">${L.programsSec.lead}</p>
    <div class="pgrid">${programCard(lang, first, true)}${rest.map((p) => programCard(lang, p)).join('')}</div>
  </div>
</section>

<section class="section field-sec">
  <div class="container">
    <div class="sec-row"><h2 class="sec-title">${lang === 'ar' ? 'من الميدان' : 'From the field'}</h2>
      <a class="link-arrow" href="${u(lang, 'gallery/')}">${L.nav.gallery} ${icon('arrow')}</a></div>
    <div class="mosaic">${['home-2', 'food-1', 'relief-4', 'health-1', 'relief-1'].map((k) => `<a href="${u(lang, `programs/${photos[k][0]}/`)}">${img(k, lang, { sizesAttr: '(min-width: 900px) 33vw, 50vw' })}</a>`).join('')}</div>
  </div>
</section>

<section class="section values-sec">
  <div class="container">
    <p class="eyebrow">${L.about.values}</p>
    <ol class="values">${L.values.map(([h, d]) => `<li><h3>${h}</h3><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section fac-prev">
  <div class="container split">
    <div><p class="eyebrow">${L.nav.facilities}</p><h2>${L.fac.tagline}</h2><p>${L.fac.lead}</p>
      <a class="link-arrow" href="${u(lang, 'facilities/')}">${lang === 'ar' ? 'استكشف عقارات ومرافق الجمعية' : 'Explore our properties & facilities'} ${icon('arrow')}</a></div>
    <div class="fac-mini">${icon('building')}<div><strong>${facilities[0].title[lang]}</strong><span>${site.address[lang]}</span></div></div>
  </div>
</section>

${ctaBand(lang)}

<section class="section contact-prev">
  <div class="container">
    <h2 class="sec-title">${L.contact.title}</h2>
    <p class="sec-lead">${L.contact.lead}</p>
    ${contactCards(lang)}
  </div>
</section>`;
  return page({ lang, key: 'home', path: '', title: L.meta.home[0], desc: L.meta.home[1], body });
}

function about(lang) {
  const L = t[lang], A = L.about;
  const body = `${pageHead(A.eyebrow, A.title, '')}
<section class="section"><div class="container split split-wide">
  <div class="prose"><p class="lead-p">${A.p1}</p><p>${A.p2}</p><p>${A.p3}</p></div>
  <aside><dl class="facts">${A.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></aside>
</div></section>
<section class="section vm"><div class="container vm-grid">
  <div class="vm-item"><p class="eyebrow">${A.vision}</p><blockquote>${A.visionT}</blockquote></div>
  <div class="vm-item"><p class="eyebrow">${A.mission}</p><blockquote>${A.missionT}</blockquote></div>
</div></section>
<section class="section values-sec"><div class="container">
  <h2 class="sec-title">${A.values}</h2>
  <ol class="values">${L.values.map(([h, d]) => `<li><h3>${h}</h3><p>${d}</p></li>`).join('')}</ol>
</div></section>
<section class="section"><div class="container">
  <h2 class="sec-title">${A.areas}</h2>
  <ul class="chips">${A.areasList.map((a) => `<li>${a}</li>`).join('')}</ul>
</div></section>
${ctaBand(lang)}`;
  return page({ lang, key: 'about', path: 'about/', title: L.meta.about[0], desc: L.meta.about[1], body, crumbs: [[L.nav.about, 'about/']] });
}

function programsIndex(lang) {
  const L = t[lang], S = L.programsSec;
  const body = `${pageHead(L.nav.programs, S.title, S.lead)}
<section class="section"><div class="container">
  <div class="sec-row"><div><h2 class="sec-title">${S.relief}</h2><p class="sec-lead">${S.reliefLead}</p></div></div>
  <div class="plist">${programs.map((p) => programCard(lang, p, true)).join('')}</div>
</div></section>
<section class="section"><div class="container">
  <a class="track track-dev track-wide" href="${u(lang, 'development/')}">${icon('sprout')}<div><h2>${L.tracks.dev}</h2><p>${L.tracks.devT}</p></div><span class="more">${L.learnMore} ${icon('arrow')}</span></a>
</div></section>
${ctaBand(lang)}`;
  return page({ lang, key: 'programs', path: 'programs/', title: L.meta.programs[0], desc: L.meta.programs[1], body, crumbs: [[L.nav.programs, 'programs/']] });
}

const galItem = (key, lang) => `<button type="button" class="gal-item" data-cat="${photos[key][0]}" data-src="${asset(`images/${key}.webp`)}" data-caption="${esc(alt(key, lang))}">
    ${img(key, lang, { sizesAttr: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw' })}</button>`;
function galleryStrip(lang, images) {
  if (!images.length) return '';
  return `<div class="gal-grid" data-gallery>${images.map((k) => galItem(k, lang)).join('')}</div>`;
}

function programPage(lang, p) {
  const L = t[lang], G = L.program;
  const s = p.stat && statById[p.stat];
  const others = programs.filter((x) => x.slug !== p.slug);
  const path = `programs/${p.slug}/`;
  const body = `<section class="page-head prog-head"><div class="container">
  <span class="pcard-ic big">${icon(p.icon)}</span>
  <p class="eyebrow">${L.programsSec.relief}</p><h1>${p.title[lang]}</h1><p class="lead tagline">${p.tagline[lang]}</p></div></section>
${p.images.length ? `<div class="container page-photo">${img(p.images[0], lang, { eager: true, sizesAttr: '(min-width: 1200px) 1150px, 100vw' })}</div>` : ''}
<section class="section"><div class="container split split-wide">
  <div class="prose"><h2>${G.overview}</h2>${p.body[lang].map((x) => `<p>${x}</p>`).join('')}
    <h2>${G.activities}</h2><ul class="ticks">${p.activities[lang].map((a) => `<li>${icon('check')}<span>${a}</span></li>`).join('')}</ul>
    ${p.images.length > 1 ? `<h2>${lang === 'ar' ? 'من الميدان' : 'From the field'}</h2>${galleryStrip(lang, p.images.slice(1))}` : ''}
  </div>
  <aside class="side">
    ${s ? `<div class="side-stat"><p class="eyebrow">${G.impact}</p><span class="num"><span data-count="${s.value}">${s.value}</span>+</span><span class="lbl">${s[lang]}</span></div>` : ''}
    <div class="side-cta"><h2>${G.support}</h2><p>${G.supportT}</p>
      <a class="btn btn-accent btn-block" href="${u(lang, 'contact/')}">${L.cta.contribute}</a>
      <a class="btn btn-outline btn-block" href="${waLink(lang)}" ${ext}>${icon('chat')} ${L.cta.waLong}</a></div>
  </aside>
</div></section>
<section class="section related"><div class="container"><h2 class="sec-title">${G.related}</h2>
  <div class="pgrid pgrid-4">${others.map((o) => programCard(lang, o)).join('')}</div></div></section>`;
  return page({ lang, key: 'programs', path, title: p.title[lang], desc: `${p.tagline[lang]} ${p.summary[lang]}`, body,
    crumbs: [[L.nav.programs, 'programs/'], [p.title[lang], path]] });
}

function development(lang) {
  const L = t[lang], D = L.dev;
  const pillarIcons = ['graduation', 'heartHand', 'sprout'];
  const projects = developmentProjects.length ? `<section class="section"><div class="container"><h2 class="sec-title">${D.projects}</h2>
    <div class="pgrid">${developmentProjects.map((p) => `<article class="pcard has-img">${p.images?.[0] ? `<div class="pcard-img">${img(p.images[0], lang, { decorative: true })}</div>` : ''}<span class="pcard-ic">${icon('sprout')}</span>
      <h3><a class="stretch" href="${u(lang, `development/${p.slug}/`)}">${p.title[lang]}</a></h3><p class="tag">${p.tagline[lang]}</p><p>${p.summary[lang]}</p>
      <div class="pcard-foot"><span></span><span class="more">${L.learnMore} ${icon('arrow')}</span></div></article>`).join('')}</div></div></section>` : '';
  const body = `${pageHead(L.tracks.dev, D.title, D.lead, `<p class="tagline">${D.tagline}</p>`)}
<section class="section"><div class="container">
  <ol class="pillars">${D.pillars.map(([h, d], i) => `<li>${icon(pillarIcons[i])}<h2>${h}</h2><p>${d}</p></li>`).join('')}</ol>
</div></section>
${projects}
<section class="section"><div class="container split">
  <div><h2>${D.partnerTitle}</h2><p>${D.partnerT}</p></div>
  <div class="actions"><a class="btn btn-primary" href="${u(lang, 'contact/')}">${L.nav.contact}</a>
  <a class="btn btn-outline" href="${waLink(lang)}" ${ext}>${icon('chat')} ${L.cta.whatsapp}</a></div>
</div></section>
${ctaBand(lang)}`;
  return page({ lang, key: 'development', path: 'development/', title: L.meta.development[0], desc: L.meta.development[1], body, crumbs: [[L.nav.development, 'development/']] });
}

function devProjectPage(lang, p) {
  const L = t[lang];
  const path = `development/${p.slug}/`;
  const body = `${pageHead(L.tracks.dev, p.title[lang], p.tagline[lang])}
${p.images?.length ? `<div class="container page-photo">${img(p.images[0], lang, { eager: true, sizesAttr: '(min-width: 1200px) 1150px, 100vw' })}</div>` : ''}
<section class="section"><div class="container prose">${(p.body?.[lang] || []).map((x) => `<p>${x}</p>`).join('')}
${p.activities ? `<ul class="ticks">${p.activities[lang].map((a) => `<li>${icon('check')}<span>${a}</span></li>`).join('')}</ul>` : ''}
${galleryStrip(lang, (p.images || []).slice(1))}<p><a class="link-arrow" href="${u(lang, 'programs/relieving-distress/')}">${programs.find((x) => x.slug === 'relieving-distress').title[lang]} ${icon('arrow')}</a></p></div></section>${ctaBand(lang)}`;
  return page({ lang, key: 'development', path, title: p.title[lang], desc: p.tagline[lang], body, crumbs: [[L.nav.development, 'development/'], [p.title[lang], path]] });
}

function impact(lang) {
  const L = t[lang], I = L.impactPage;
  const body = `${pageHead(L.nav.impact, I.title, I.lead)}
<section class="impact-sec"><div class="container">${statsBlock(lang)}</div></section>
<section class="section"><div class="container">
  <h2 class="sec-title">${I.byProgram}</h2>
  <ul class="impact-list">${stats.map((s) => { const p = programs.find((x) => x.slug === s.program); return `<li>
    <span class="num">${s.value}+</span><div><h3><a href="${u(lang, `programs/${p.slug}/`)}">${p.title[lang]}</a></h3><p>${s[lang]} — ${p.tagline[lang]}</p></div></li>`; }).join('')}</ul>
</div></section>
<section class="section values-sec"><div class="container">
  <h2 class="sec-title">${I.how}</h2>
  <ol class="steps">${I.steps.map(([h, d]) => `<li><h3>${h}</h3><p>${d}</p></li>`).join('')}</ol>
</div></section>
${ctaBand(lang)}`;
  return page({ lang, key: 'impact', path: 'impact/', title: L.meta.impact[0], desc: L.meta.impact[1], body, crumbs: [[L.nav.impact, 'impact/']] });
}

function facilitiesPage(lang) {
  const L = t[lang], F = L.fac;
  const body = `${pageHead(F.tagline, F.title, F.lead)}
<section class="section"><div class="container">
  <div class="fac-list">${facilities.map((f) => `<article class="fac-card">
    <span class="pcard-ic big">${icon(f.icon)}</span>
    <div><p class="eyebrow">${f.category[lang]}</p><h2>${f.title[lang]}</h2><p>${f.summary[lang]}</p>
    <dl class="facts compact"><div><dt>${F.address}</dt><dd>${site.address[lang]}</dd></div></dl>
    <div class="actions"><a class="btn btn-primary" href="${site.mapUrl}" ${ext}>${icon('mapPin')} ${F.directions}</a>
    <a class="btn btn-outline" href="${u(lang, 'contact/')}">${L.nav.contact}</a></div></div>
  </article>`).join('')}</div>
</div></section>
${ctaBand(lang)}`;
  return page({ lang, key: 'facilities', path: 'facilities/', title: L.meta.facilities[0], desc: L.meta.facilities[1], body, crumbs: [[L.nav.facilities, 'facilities/']] });
}

function galleryPage(lang) {
  const L = t[lang], G = L.gallery;
  const cats = [...new Set(gallery.map((k) => photos[k][0]))];
  const catLabel = (c) => [...programs, ...developmentProjects].find((p) => p.slug === c)?.title[lang] || c;
  const body = `${pageHead('', G.title, G.lead)}
<section class="section"><div class="container">
  <div class="filters" role="group" aria-label="${G.title}"><button type="button" aria-pressed="true" data-filter="*">${G.all}</button>
  ${cats.map((c) => `<button type="button" aria-pressed="false" data-filter="${c}">${catLabel(c)}</button>`).join('')}</div>
  <div class="gal-grid" data-gallery data-paged>${gallery.map((k) => galItem(k, lang)).join('')}</div>
  <p class="empty" hidden>${G.empty}</p>
  <button type="button" class="btn btn-outline more-btn" hidden>${G.more}</button>
</div></section>`;
  return page({ lang, key: 'gallery', path: 'gallery/', title: L.meta.gallery[0], desc: L.meta.gallery[1], body, crumbs: [[L.nav.gallery, 'gallery/']] });
}

function involved(lang) {
  const L = t[lang], V = L.involved;
  const icons = ['heartHand', 'users', 'handshake', 'share'];
  const body = `${pageHead(L.nav.involved, V.title, V.lead)}
<section class="section"><div class="container">
  <h2 class="sec-title">${V.ways}</h2>
  <ul class="ways">${V.list.map(([h, d], i) => `<li>${icon(icons[i])}<h3>${h}</h3><p>${d}</p></li>`).join('')}</ul>
  <div class="contact-actions">
    <a class="btn btn-primary" href="${u(lang, 'contact/')}">${L.nav.contact}</a>
    <a class="btn btn-outline" href="${waLink(lang)}" ${ext}>${icon('chat')} ${L.cta.waLong}</a>
    <a class="btn btn-outline" href="tel:${site.phoneIntl}">${icon('phone')} ${L.cta.call}</a>
    <a class="btn btn-outline" href="mailto:${site.email}">${icon('mail')} ${L.cta.email}</a>
  </div>
  <p class="note">${V.note}</p>
</div></section>
<section class="section"><div class="container">
  <h2 class="sec-title">${V.pick}</h2>
  <div class="pgrid">${programs.map((p) => programCard(lang, p)).join('')}</div>
</div></section>`;
  return page({ lang, key: 'involved', path: 'get-involved/', title: L.meta.involved[0], desc: L.meta.involved[1], body, crumbs: [[L.nav.involved, 'get-involved/']] });
}

function contact(lang) {
  const L = t[lang], C = L.contact, F = C.f;
  const field = (name, label, type, opts = {}) => `<div class="field">
    <label for="f-${name}">${label}${opts.optional ? ` <span class="opt">${F.optional}</span>` : ''}</label>
    ${type === 'textarea' ? `<textarea id="f-${name}" name="${name}" rows="5" ${opts.optional ? '' : 'required'} aria-describedby="e-${name}"></textarea>`
      : type === 'select' ? `<select id="f-${name}" name="${name}">${C.subjects.map((s) => `<option>${s}</option>`).join('')}</select>`
      : `<input id="f-${name}" name="${name}" type="${type}" ${opts.optional ? '' : 'required'} ${opts.ac ? `autocomplete="${opts.ac}"` : ''} ${opts.ltr ? 'dir="ltr"' : ''} aria-describedby="e-${name}">`}
    <p class="err" id="e-${name}"></p></div>`;
  const body = `${pageHead('', C.title, C.lead)}
<section class="section"><div class="container contact-grid">
  <div>${contactCards(lang)}</div>
  <form class="form" id="contact-form" novalidate data-key="${site.web3formsKey}" data-email="${site.email}" data-wa="${site.whatsapp}"
    data-msg-required="${esc(C.err.required)}" data-msg-email="${esc(C.err.email)}" data-msg-phone="${esc(C.err.phone)}" data-msg-summary="${esc(C.err.summary)}"
    data-msg-ok="${esc(C.ok)}" data-msg-fail="${esc(C.fail)}" data-msg-fallback="${esc(C.fallback)}" data-msg-wa="${esc(C.sendWa)}" data-msg-sending="${esc(F.sending)}"
    data-site="${esc(site.name[lang])}">
    <h2>${C.formTitle}</h2>
    ${field('name', F.name, 'text', { ac: 'name' })}
    <div class="row2">${field('phone', F.phone, 'tel', { ac: 'tel', ltr: true, optional: true })}${field('email', F.email, 'email', { ac: 'email', ltr: true })}</div>
    ${field('subject', F.subject, 'select')}
    ${field('message', F.message, 'textarea')}
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn btn-primary" type="submit">${F.send}</button>
    <div class="status" role="status" aria-live="polite"></div>
  </form>
</div></section>`;
  return page({ lang, key: 'contact', path: 'contact/', title: L.meta.contact[0], desc: L.meta.contact[1], body, crumbs: [[L.nav.contact, 'contact/']] });
}

function notFound() {
  const blk = (lang) => {
    const L = t[lang];
    return `<div lang="${lang}" dir="${L.dir}" class="nf-block"><h${lang === 'ar' ? 1 : 2}>${L.nf.title}</h${lang === 'ar' ? 1 : 2}><p>${L.nf.lead}</p>
    <div class="actions"><a class="btn btn-primary" href="${u(lang)}">${L.nav.home}</a><a class="btn btn-outline" href="${u(lang, 'programs/')}">${L.nav.programs}</a><a class="btn btn-outline" href="${u(lang, 'contact/')}">${L.nav.contact}</a></div></div>`;
  };
  const body = `<section class="section nf"><div class="container"><p class="nf-code" aria-hidden="true">404</p>${blk('ar')}${blk('en')}</div></section>`;
  return page({ lang: 'ar', key: '404', path: '', title: '404', desc: t.ar.nf.lead, body, noindex: true });
}

// ---------- write ----------
function write(file, content) {
  const f = join(OUT, file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
}

rmSync(OUT, { recursive: true, force: true });
cpSync('public', OUT, { recursive: true });
cpSync('src/assets', join(OUT, 'assets'), { recursive: true });

for (const lang of LANGS) {
  write(`${lang}/index.html`, home(lang));
  write(`${lang}/about/index.html`, about(lang));
  write(`${lang}/programs/index.html`, programsIndex(lang));
  for (const p of programs) write(`${lang}/programs/${p.slug}/index.html`, programPage(lang, p));
  write(`${lang}/development/index.html`, development(lang));
  for (const p of developmentProjects) write(`${lang}/development/${p.slug}/index.html`, devProjectPage(lang, p));
  write(`${lang}/impact/index.html`, impact(lang));
  write(`${lang}/facilities/index.html`, facilitiesPage(lang));
  if (hasGallery) write(`${lang}/gallery/index.html`, galleryPage(lang));
  write(`${lang}/get-involved/index.html`, involved(lang));
  write(`${lang}/contact/index.html`, contact(lang));
}
write('404.html', notFound());

// Root: Arabic is the default language.
write('index.html', `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<title>${site.name.ar} | ${site.name.en}</title><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${ABS}ar/"><meta http-equiv="refresh" content="0; url=${u('ar')}">
<link rel="alternate" hreflang="ar" href="${ABS}ar/"><link rel="alternate" hreflang="en" href="${ABS}en/"><link rel="alternate" hreflang="x-default" href="${ABS}ar/">
<link rel="icon" href="${asset('favicon.ico')}"></head>
<body><p><a href="${u('ar')}">${site.name.ar}</a> — <a href="${u('en')}" lang="en">${site.name.en}</a></p></body></html>`);

const uniq = [...new Set(pages)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniq.flatMap((p) => LANGS.map((l) => `<url><loc>${ABS}${l}/${p}</loc>${LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${ABS}${x}/${p}"/>`).join('')}</url>`)).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ABS}sitemap.xml\n`);
write('site.webmanifest', JSON.stringify({
  name: site.name.ar, short_name: site.shortName.ar, lang: 'ar', dir: 'rtl', start_url: u('ar'), scope: BASE,
  display: 'standalone', background_color: '#FBF8F1', theme_color: '#176031',
  icons: [{ src: asset('assets/icon-192.png'), sizes: '192x192', type: 'image/png' }, { src: asset('assets/icon-512.png'), sizes: '512x512', type: 'image/png' }],
}, null, 2));
write('.nojekyll', '');

console.log(`Built ${uniq.length * LANGS.length} pages into ${OUT}/`);
