# Nasaem Al-Ekhaa Charity Association — Official Website

Bilingual (Arabic RTL / English LTR) website for **جمعية نسائم الإخاء الخيرية**, published at
**https://mohammedkellawi.github.io/nasayim/**.

## Stack

- A static site generator with no dependencies (`build.mjs`, Node 20+). It writes plain HTML pages into `dist/`. Each page has its own real URL, so links to inner pages and page refreshes work on GitHub Pages.
- Hand-written CSS that uses CSS logical properties, so the same styles work for Arabic and English. Fonts: IBM Plex Sans Arabic for all text, Barlow Condensed for numbers.
- A small vanilla JavaScript file for the mobile menu, number counters, gallery lightbox and contact form.
- Icons from Lucide (ISC license), inlined as SVG.
- Deployed to GitHub Pages by GitHub Actions (`.github/workflows/deploy.yml`).

## Structure

```
build.mjs              page templates + generator
src/data/site.mjs      contact info, approved impact numbers, form key
src/data/programs.mjs  programs, development projects, facilities, gallery
src/i18n.mjs           all Arabic and English interface/page copy
src/assets/            style.css, main.js
public/                copied as-is (logo, icons, images, favicon)
scripts/serve.mjs      local preview at /nasayim/
scripts/check.mjs      link checker + financial-content scan (runs in CI)
```

## Commands

```bash
npm run build   # build into dist/
npm run dev     # build and preview at http://localhost:4321/nasayim/
npm run check   # build, then fail on broken links or financial terms
```

## Deployment

Every push to `main` builds and deploys the site. This needs a one-time setting in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Editing content

| Task | Where |
|---|---|
| Add a relief program | Add an object to `programs` in `src/data/programs.mjs`. Its Arabic and English pages are created automatically. |
| Add a development project | Add an object to `developmentProjects` (same fields as a program). It gets a page at `/development/<slug>/`. |
| Add a property/facility | Add an object to `facilities`. Never include deeds, parcel numbers or prices. |
| Add gallery images | Put optimised `.webp` files in `public/images/…` and add `{ src, category, alt: { ar, en }, w, h }` to `gallery`. The Gallery page and its menu link appear once the list is not empty. Program pages show their own `images`. |
| Edit Arabic/English text | `src/i18n.mjs` (interface/pages) or `src/data/programs.mjs` (program content). |
| Impact numbers | `stats` in `src/data/site.mjs`. Change only with an official decision. |
| Phone, email, WhatsApp, Facebook, address | `site` in `src/data/site.mjs`. |
| Logo / icons | Replace the files in `public/assets/` and keep the same names. |
| Colours | The CSS variables at the top of `src/assets/style.css`. |

Image tip: `cwebp -q 80 -resize 1600 0 in.jpg -o out.webp`. Keep the original photos outside this repository.

## Contact form

GitHub Pages can't run server code, so the form uses **Web3Forms**. It is free and needs no payment card. Until it's activated, the form opens the visitor's email app with their message already filled in and offers a WhatsApp link, so messages still get through.

To activate it:
1. Go to https://web3forms.com, enter `nasayim.aliikha2020@gmail.com`, and confirm the email you receive.
2. Paste the access key into `web3formsKey` in `src/data/site.mjs`, then commit and push. The key is meant to be public, so it's safe in this file.

## Custom domain (later)

1. Buy a domain from any registrar.
2. Repository **Settings → Pages → Custom domain**: enter e.g. `www.example.org` and save.
3. At the registrar, add DNS records. For `www`, add a `CNAME` pointing to `mohammedkellawi.github.io`. For the root domain, add `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
4. Once DNS has propagated, tick **Enforce HTTPS**.
5. In `src/data/site.mjs`, set `url: 'https://www.example.org'` and `base: '/'`, then push. Every link updates automatically.

## Content rules

The site must not show any money amounts, costs or bank details, and must not invent statistics, partners, testimonials or board members. It must not publish personal data about beneficiaries. `npm run check` blocks builds that contain financial terms.
