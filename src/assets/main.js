// Nasaem Al-Ekhaa — progressive enhancements (menu, counters, reveal, gallery, contact form).
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = document.documentElement.dir === 'rtl';

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    const label = btn.querySelector('.sr');
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      label.textContent = open ? btn.dataset.close : btn.dataset.open;
      if (open) nav.querySelector('a')?.focus();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); }
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }

  // Counters and reveal
  const counters = document.querySelectorAll('[data-count]');
  const revealEls = document.querySelectorAll('.section h2, .pcard, .track, .values li, .steps li, .pillars li, .ways li');
  if (!reduce && 'IntersectionObserver' in window) {
    const count = (el) => {
      const target = +el.dataset.count;
      const start = performance.now();
      const dur = 1200;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.dataset.count) count(en.target); else en.target.classList.add('in');
      });
    }, { threshold: 0.2 });
    counters.forEach((c) => { c.textContent = '0'; io.observe(c); });
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal'); io.observe(el); }
    });
  }

  // Gallery: filters, paging and lightbox
  const grid = document.querySelector('[data-gallery]');
  if (grid) {
    const items = [...grid.querySelectorAll('.gal-item')];
    const PAGE = 12;
    let filter = '*';
    let shown = PAGE;
    const moreBtn = document.querySelector('.more-btn');
    const empty = document.querySelector('.empty');
    const visible = () => items.filter((i) => filter === '*' || i.dataset.cat === filter);
    const render = () => {
      const vis = visible();
      items.forEach((i) => { i.hidden = true; });
      vis.slice(0, grid.hasAttribute('data-paged') ? shown : vis.length).forEach((i) => { i.hidden = false; });
      if (moreBtn) moreBtn.hidden = vis.length <= shown || !grid.hasAttribute('data-paged');
      if (empty) empty.hidden = vis.length > 0;
    };
    document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      filter = b.dataset.filter; shown = PAGE; render();
    }));
    moreBtn?.addEventListener('click', () => { shown += PAGE; render(); });
    render();

    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    const ar = rtl;
    dlg.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
      <button type="button" class="lb-btn lb-close" aria-label="${ar ? 'إغلاق' : 'Close'}"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      <button type="button" class="lb-btn lb-prev" aria-label="${ar ? 'السابق' : 'Previous'}"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
      <button type="button" class="lb-btn lb-next" aria-label="${ar ? 'التالي' : 'Next'}"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>`;
    document.body.appendChild(dlg);
    const img = dlg.querySelector('img');
    const cap = dlg.querySelector('figcaption');
    let idx = 0;
    const open = (i) => {
      const vis = items.filter((x) => !x.hidden);
      idx = (i + vis.length) % vis.length;
      img.src = vis[idx].dataset.src;
      img.alt = vis[idx].dataset.caption;
      cap.textContent = vis[idx].dataset.caption;
      if (!dlg.open) dlg.showModal();
    };
    items.forEach((it) => it.addEventListener('click', () => open(items.filter((x) => !x.hidden).indexOf(it))));
    dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
    dlg.querySelector('.lb-prev').addEventListener('click', () => open(idx - 1));
    dlg.querySelector('.lb-next').addEventListener('click', () => open(idx + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') open(rtl ? idx + 1 : idx - 1);
      if (e.key === 'ArrowRight') open(rtl ? idx - 1 : idx + 1);
    });
  }

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    const d = form.dataset;
    const status = form.querySelector('.status');
    const submit = form.querySelector('[type="submit"]');
    const submitText = submit.textContent;
    const setErr = (el, msg) => {
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      document.getElementById('e-' + el.name).textContent = msg || '';
    };
    const validate = () => {
      let first = null;
      form.querySelectorAll('input:not(.hp), textarea').forEach((el) => {
        let msg = '';
        const v = el.value.trim();
        if (el.required && !v) msg = d.msgRequired;
        else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = d.msgEmail;
        else if (el.type === 'tel' && v && !/^[+\d][\d\s-]{6,}$/.test(v)) msg = d.msgPhone;
        setErr(el, msg);
        if (msg && !first) first = el;
      });
      return first;
    };
    form.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('blur', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate();
    }));
    const show = (cls, html) => { status.className = 'status ' + cls; status.innerHTML = html; };
    const text = () => {
      const f = new FormData(form);
      return `${f.get('subject')}\n\n${f.get('message')}\n\n— ${f.get('name')}\n${f.get('phone') || ''}\n${f.get('email')}`;
    };
    const waHref = () => `https://wa.me/${d.wa}?text=${encodeURIComponent(text())}`;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.botcheck.checked) return;
      const bad = validate();
      if (bad) { show('bad', d.msgSummary); bad.focus(); return; }
      const f = new FormData(form);
      if (!d.key) {
        // No form service configured: hand the message to the visitor's email app, with WhatsApp as an alternative.
        const mail = `mailto:${d.email}?subject=${encodeURIComponent(`${d.site} — ${f.get('subject')}`)}&body=${encodeURIComponent(text())}`;
        show('info', `${d.msgFallback} <a href="${waHref()}" target="_blank" rel="noopener noreferrer">${d.msgWa}</a>`);
        window.location.href = mail;
        return;
      }
      submit.disabled = true;
      submit.textContent = d.msgSending;
      try {
        f.append('access_key', d.key);
        f.append('from_name', d.site);
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: f });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        form.reset();
        show('ok', d.msgOk);
      } catch {
        show('bad', `${d.msgFail} <a href="${waHref()}" target="_blank" rel="noopener noreferrer">${d.msgWa}</a> · <a href="mailto:${d.email}">${d.email}</a>`);
      } finally {
        submit.disabled = false;
        submit.textContent = submitText;
      }
    });
  }
})();
