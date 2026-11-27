/* ==========================================================================
   JICO RANCH — main.js
   No build step, no dependencies. Just edit and save.
   ========================================================================== */

/* ==========================================================================
   ★★★  EDIT THIS BLOCK  ★★★
   Everything you'll change week to week lives between here and "END EDIT".
   You never need to touch the code below it.
   ========================================================================== */

/* --- The strip under the hero + the hours table -------------------------- */
const RANCH = {

  /* ===== MASTER SWITCH =================================================
     false = PRE-OPENING. The strip under the hero shows build progress,
             and the Visit section shows a "not open yet" panel instead
             of an hours table.
     true  = OPEN. The strip shows today's hours, what's ready to pick and
             what's at the stand, and the hours table drives itself.
     Flip this one value on opening day, then keep the fields below current.
     ===================================================================== */
  openToPublic: false,

  /* ---- shown while openToPublic is false ---- */
  build: {
    status  : "Building out",
    acreage : "145 acres",
    phase   : "Clearing, fencing and water lines",
    // TODO: put a real target here when you know it, e.g. "Spring 2027".
    opening : "To be announced"
  },

  /* ---- shown once openToPublic is true ---- */
  // What's ready to pick and what's on the stand right now.
  picking : "Tomatoes, okra, peppers",
  stand   : "Eggs, honey, squash",

  // Set to a message to force a CLOSED banner (weather, private event).
  notice  : "",

  // 0 = Sunday … 6 = Saturday.  Use null for a closed day.
  hours: [
    { day:"Sunday",    open:"12:00pm", close:"5:00pm" },
    { day:"Monday",    open:null,      close:null, note:"Closed" },
    { day:"Tuesday",   open:null,      close:null, note:"Closed" },
    { day:"Wednesday", open:null,      close:null, note:"Closed" },
    { day:"Thursday",  open:"10:00am", close:"5:00pm" },
    { day:"Friday",    open:"10:00am", close:"5:00pm" },
    { day:"Saturday",  open:"9:00am",  close:"5:00pm" }
  ]
};

/* --- Hero video clips ----------------------------------------------------
   Drop .mp4 files in assets/video/ and list their filenames here. They'll
   crossfade behind the headline. Leave the array empty to use the still photo. */
const HERO_CLIPS = [
  // "hero-pasture.mp4",
  // "hero-garden-rows.mp4",
  // "hero-barnyard.mp4"
];

/* --- The animal roster ---------------------------------------------------
   photo files live in assets/img/. Add, remove or reorder freely. */
const ANIMALS = [
  { name:"The Goat Crew", species:"Nigerian dwarf goats", img:"animal-goats.svg",
    fact:"First to the fence and shameless about it. They'll check every pocket you own." },
  { name:"The Herd",      species:"Cattle",               img:"animal-cattle.svg",
    fact:"Out on the back pasture. Visited from the fence line or on a guided walk." },
  { name:"The Flock",     species:"Laying hens & ducks",  img:"animal-chickens.svg",
    fact:"Between them they lay most of what ends up at the stand each morning." },
  { name:"The Horses",    species:"Saddle horses",        img:"animal-horses.svg",
    fact:"Retired from real work and enjoying it. Say hello, but feeding is staff-only." },
  { name:"The Pigs",      species:"Pasture-raised hogs",  img:"animal-pigs.svg",
    fact:"Rotated through the paddocks — they turn ground over better than any tiller." },
  { name:"The Sheep",     species:"Sheep",                img:"animal-sheep.svg",
    fact:"Quietly the best grazers here. They keep the field edges honest." },
  { name:"The Rabbits",   species:"Rabbits",              img:"animal-rabbits.svg",
    fact:"The hutch is the softest landing for a nervous first-time visitor." },
  { name:"The Donkeys",   species:"Donkeys",              img:"animal-donkey.svg",
    fact:"They're the security team. Nothing gets near the small stock on their watch." }
];

/* --- Upcoming events -----------------------------------------------------
   date is YYYY-MM-DD. Past events drop off the list automatically. */
const EVENTS = [
  { date:"2026-09-19", title:"Fall Harvest Day",        tag:"Walk-in",
    text:"Wagon rides, the last of the summer rows, and cider pressing in the barn." },
  { date:"2026-10-03", title:"Canning & Putting Up",    tag:"Reserved",
    text:"Three-hour workshop. You leave with jars you filled yourself. 12 seats." },
  { date:"2026-10-18", title:"Pumpkin Patch Opens",     tag:"Walk-in",
    text:"Pick from the field through the end of the month, weather depending." },
  { date:"2026-11-07", title:"Backyard Chickens 101",   tag:"Reserved",
    text:"Coop setup, feed, predators and the honest cost of a home egg. 16 seats." }
];

/* --- From the Ground Up — the monthly entry ------------------------------
   Runs as a build journal now and becomes "Harvest of the Month" once there
   are crops: set kind to "Harvest" and the label on the page follows.
   Newest entry FIRST — that's the one shown large. `facts` is 2-4 pairs; for
   a harvest entry use things like ["Sown","Mar 2"], ["Picked","May 18"],
   ["Days to harvest","77"]. */
const JOURNAL = [
  {
    kind  : "Build",
    month : "November 2026",
    title : "We closed on 145 acres",
    img   : "journal-1.svg",
    body  : "The paperwork is done and the land is ours. It came out of a larger " +
            "parcel on Highway 66, which is why we have a brand new address. First " +
            "job is the perimeter: clearing the fence line, setting corners, and " +
            "getting water run before anything with four legs shows up.",
    facts : [["Acres", "145"], ["County", "Horry"], ["First job", "Fencing"]]
  },
  {
    kind  : "Build",
    month : "December 2026",
    title : "Fence line and water",
    img   : "journal-2.svg",
    body  : "Placeholder for the next entry — swap this for what actually happened.",
    facts : [["Posts set", "—"], ["Acres fenced", "—"]]
  }
];

/* --- Season calendar -----------------------------------------------------
   12 numbers per crop, Jan → Dec.   0 = not available   1 = available   2 = peak */
const SEASON = [
  { crop:"Leafy greens",      months:[2,2,2,1,1,0,0,0,1,2,2,2] },
  { crop:"Strawberries",      months:[0,0,0,1,2,1,0,0,0,0,0,0] },
  { crop:"Squash & zucchini", months:[0,0,0,1,2,2,2,1,1,0,0,0] },
  { crop:"Tomatoes",          months:[0,0,0,0,1,2,2,2,1,0,0,0] },
  { crop:"Cucumbers",         months:[0,0,0,0,1,2,2,1,1,0,0,0] },
  { crop:"Peppers",           months:[0,0,0,0,1,1,2,2,2,1,0,0] },
  { crop:"Okra",              months:[0,0,0,0,0,1,2,2,2,1,0,0] },
  { crop:"Blueberries",       months:[0,0,0,0,1,2,2,0,0,0,0,0] },
  { crop:"Melons",            months:[0,0,0,0,0,1,2,2,1,0,0,0] },
  { crop:"Pumpkins & gourds", months:[0,0,0,0,0,0,0,0,1,2,1,0] },
  { crop:"Cut flowers",       months:[0,0,0,1,2,2,2,2,2,1,0,0] },
  { crop:"Eggs",              months:[1,2,2,2,2,2,2,2,2,2,1,1] }
];

/* ★★★  END EDIT — code below runs the site  ★★★ */


/* ==========================================================================
   helpers
   ========================================================================== */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ==========================================================================
   nav — mobile toggle, sticky shadow, active section
   ========================================================================== */
(function nav(){
  const burger = $('#hamburger'), menu = $('#nav'), header = $('#header');
  if (burger && menu){
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.addEventListener('click', e => {
      if (e.target.tagName === 'A'){
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  if (header){
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  // highlight the nav link for whichever section is on screen
  const links = $$('.nav a[href^="#"]').filter(a => a.getAttribute('href').length > 1);
  const map = new Map();
  links.forEach(a => {
    const sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) map.set(sec, a);
  });
  if (map.size && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting){
          links.forEach(l => l.classList.remove('is-active'));
          map.get(en.target)?.classList.add('is-active');
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px' });
    map.forEach((_, sec) => io.observe(sec));
  }
})();

/* ==========================================================================
   hero montage — crossfading muted clips, still photo if none listed
   ========================================================================== */
(function montage(){
  const host = $('#heroMontage');
  if (!host || !HERO_CLIPS.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const vids = HERO_CLIPS.map((src, i) => {
    const v = document.createElement('video');
    v.src = 'assets/video/' + src;
    v.muted = true; v.loop = false; v.playsInline = true;
    v.preload = i === 0 ? 'auto' : 'none';
    host.appendChild(v);
    return v;
  });

  let i = 0;
  const show = n => {
    vids.forEach((v, k) => v.classList.toggle('is-live', k === n));
    const v = vids[n];
    v.currentTime = 0;
    v.play().catch(() => {});
    const next = (n + 1) % vids.length;
    vids[next].preload = 'auto';
  };
  vids.forEach((v, n) => {
    v.addEventListener('ended', () => { i = (n + 1) % vids.length; show(i); });
    // safety net if a clip is very long
    v.addEventListener('timeupdate', () => {
      if (v.duration && v.currentTime > Math.min(v.duration, 9) && v.classList.contains('is-live')){
        v.dispatchEvent(new Event('ended'));
      }
    });
  });
  show(0);
})();

/* ==========================================================================
   today strip + hours table
   ========================================================================== */
(function today(){
  const items = $('.today__items');

  /* ---------- pre-opening: show build progress, not hours ---------- */
  if (!RANCH.openToPublic){
    const b = RANCH.build;
    const dot = $('#statusDot'), text = $('#statusText');
    if (dot)  dot.classList.add('today__dot--building');
    if (text) text.textContent = b.status;

    if (items){
      items.innerHTML = [
        ['The land',   b.acreage],
        ['Right now',  b.phase],
        ['Opening',    b.opening]
      ].map(([k, v]) => `<div class="today__item">
          <span class="today__label">${esc(k)}</span>
          <span class="today__val">${esc(v)}</span>
        </div>`).join('');
    }

    const list = $('#hoursList');
    if (list){
      list.innerHTML = `<div class="notyet">
        <div class="notyet__t">Not open to the public yet</div>
        <p>We're still building the place out, so there's nothing to visit today.
           The quickest way to hear when the gate opens is the list below — or follow
           along on Instagram, where the build gets posted as it happens.</p>
        <div class="notyet__cta">
          <a href="#plan" class="btn btn--primary btn--sm">Tell Me When You Open</a>
          <a href="https://www.instagram.com/jico_ranch/" target="_blank" rel="noopener" class="btn btn--ghost btn--sm">Follow the Build</a>
        </div>
      </div>`;
    }
    return;
  }

  /* ---------- open: today's hours and what's ready ---------- */
  const todayIdx = new Date().getDay();
  const row = RANCH.hours[todayIdx];
  const isOpen = !!(row && row.open) && !RANCH.notice;

  const dot = $('#statusDot'), text = $('#statusText'), hrs = $('#todayHours');
  if (dot) dot.classList.toggle('today__dot--closed', !isOpen);
  if (text) text.textContent = RANCH.notice ? RANCH.notice : (isOpen ? 'Open today' : 'Closed today');
  if (hrs){
    hrs.textContent = isOpen ? `${row.open} – ${row.close}` : nextOpenLabel(todayIdx);
  }
  if ($('#todayPicking')) $('#todayPicking').textContent = RANCH.picking || '—';
  if ($('#todayStand'))   $('#todayStand').textContent   = RANCH.stand   || '—';

  function nextOpenLabel(from){
    for (let n = 1; n <= 7; n++){
      const r = RANCH.hours[(from + n) % 7];
      if (r && r.open) return `Back ${r.day} ${r.open}`;
    }
    return 'See hours';
  }

  const list = $('#hoursList');
  if (list){
    list.innerHTML = RANCH.hours.map((r, idx) => {
      const closed = !r.open;
      return `<div class="hours__row${idx === todayIdx ? ' is-today' : ''}${closed ? ' is-closed' : ''}">
        <span class="hours__day">${esc(r.day)}</span>
        <span class="hours__time">${closed ? esc(r.note || 'Closed') : esc(r.open + ' – ' + r.close)}</span>
      </div>`;
    }).join('');
  }
})();

/* ==========================================================================
   animals grid
   ========================================================================== */
(function animals(){
  const grid = $('#animalGrid');
  if (!grid) return;
  grid.innerHTML = ANIMALS.map(a => `
    <article class="animal reveal" tabindex="0">
      <img src="assets/img/${esc(a.img)}" alt="${esc(a.name)} — ${esc(a.species)}" loading="lazy">
      <div class="animal__in">
        <div class="animal__name">${esc(a.name)}</div>
        <div class="animal__species">${esc(a.species)}</div>
        <p class="animal__fact">${esc(a.fact)}</p>
      </div>
    </article>`).join('');
})();

/* ==========================================================================
   events — drops anything already past
   ========================================================================== */
(function events(){
  const host = $('#eventList');
  if (!host) return;
  const today = new Date(); today.setHours(0,0,0,0);

  const upcoming = EVENTS
    .map(e => ({ ...e, d: new Date(e.date + 'T00:00:00') }))
    .filter(e => !isNaN(e.d) && e.d >= today)
    .sort((a,b) => a.d - b.d);

  // feed the "Next event" slot in the strip under the hero
  const nextSlot = $('#todayEvent');
  if (nextSlot) nextSlot.textContent = upcoming.length
    ? `${upcoming[0].title} · ${MONTHS[upcoming[0].d.getMonth()]} ${upcoming[0].d.getDate()}`
    : 'Dates coming soon';

  if (!upcoming.length){
    host.innerHTML = `<div class="event"><div></div>
      <div><div class="event__t">Dates coming soon</div>
      <div class="event__d">Next season's calendar is being set. Join the list below and you'll hear first.</div></div>
      <a href="#plan" class="btn btn--ghost-light btn--sm">Join the list</a></div>`;
    return;
  }

  host.innerHTML = upcoming.map(e => `
    <article class="event">
      <div class="event__date">
        <div class="event__mon">${MONTHS[e.d.getMonth()]}</div>
        <div class="event__day">${e.d.getDate()}</div>
      </div>
      <div>
        <div class="event__t">${esc(e.title)}</div>
        <div class="event__d">${esc(e.text)}</div>
      </div>
      <a href="${e.tag === 'Reserved' ? '#contact' : '#plan'}" class="btn btn--ghost-light btn--sm">
        ${e.tag === 'Reserved' ? 'Reserve' : 'Details'}
      </a>
    </article>`).join('');
})();

/* ==========================================================================
   season calendar
   ========================================================================== */
(function season(){
  const table = $('#seasonTable');
  if (!table) return;
  const now = new Date().getMonth();

  const head = `<thead><tr><th>Crop</th>${
    MONTHS.map((m,i) => `<th class="${i === now ? 'is-now' : ''}" scope="col">${m}</th>`).join('')
  }</tr></thead>`;

  const body = `<tbody>${
    SEASON.map(r => `<tr><th scope="row">${esc(r.crop)}</th>${
      r.months.map(v => {
        const cls = v === 2 ? 'season__bar on peak' : v === 1 ? 'season__bar on' : 'season__bar';
        const label = v === 2 ? 'peak' : v === 1 ? 'available' : 'out of season';
        return `<td><span class="${cls}" title="${label}"></span><span class="sr-only">${label}</span></td>`;
      }).join('')
    }</tr>`).join('')
  }</tbody>`;

  table.insertAdjacentHTML('beforeend', head + body);
})();

/* ==========================================================================
   reveal on scroll + counters
   ========================================================================== */
(function reveal(){
  const items = $$('.reveal');

  // Only now do the reveal styles apply — see the html.js gate in styles.css.
  document.documentElement.classList.add('js');

  const showAll = () => items.forEach(el => {
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
  });

  if (!('IntersectionObserver' in window)){ showAll(); return; }

  let fired = false;
  const io = new IntersectionObserver((entries, obs) => {
    fired = true;
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      obs.unobserve(en.target);
      $$('[data-count]', en.target).forEach(countUp);
    });
  }, { rootMargin:'0px 0px -8% 0px', threshold:.08 });
  items.forEach(el => io.observe(el));

  // Safety net: the observer reports on its first pass in any healthy browser.
  // If it somehow never does, show everything rather than leave a blank page.
  setTimeout(() => { if (!fired) showAll(); }, 2500);

  function countUp(el){
    const target = parseInt(el.dataset.count, 10);
    if (!target) return;                    // leaves "00" placeholders alone
    const dur = 1300, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
})();

/* ==========================================================================
   forms — posts to the action URL if one is set, otherwise opens an email
   ========================================================================== */
(function forms(){
  const EMAIL = 'jicoranch@gmail.com';

  const wire = (formId, okId, subject) => {
    const form = $('#' + formId), ok = $('#' + okId);
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const action = form.getAttribute('action');

      if (action){
        btn.disabled = true;
        const was = btn.textContent;
        btn.textContent = 'Sending…';
        try {
          const res = await fetch(action, { method:'POST', body:data, headers:{ Accept:'application/json' }});
          if (!res.ok) throw new Error(res.status);
          form.reset(); ok?.classList.add('show');
        } catch {
          mailto(data, subject);
        } finally {
          btn.disabled = false; btn.textContent = was;
        }
      } else {
        mailto(data, subject);
        ok?.classList.add('show');
      }
    });
  };

  const mailto = (data, subject) => {
    const body = [...data.entries()].map(([k,v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  wire('contactForm', 'contactOk', 'Website enquiry — JICO Ranch');
  wire('signupForm',  'signupOk',  'Newsletter signup — JICO Ranch');
})();

/* ==========================================================================
   from the ground up — newest entry large, the rest as a strip
   ========================================================================== */
(function journal(){
  const host = $('#journalLatest'), past = $('#journalPast');
  if (!host || !JOURNAL.length) return;

  const [latest, ...rest] = JOURNAL;
  const facts = (latest.facts || []).map(([k, v]) =>
    `<div class="journal__fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

  host.innerHTML = `
    <div class="journal__media">
      <img src="assets/img/${esc(latest.img)}" alt="${esc(latest.title)}" loading="lazy">
    </div>
    <div>
      <span class="journal__kind">${latest.kind === 'Harvest' ? 'Harvest of the month' : 'From the ground up'}</span>
      <div class="journal__month">${esc(latest.month)}</div>
      <h3 class="journal__title">${esc(latest.title)}</h3>
      <p class="journal__body">${esc(latest.body)}</p>
      ${facts ? `<dl class="journal__facts">${facts}</dl>` : ''}
    </div>`;

  if (past){
    past.innerHTML = rest.length
      ? rest.map(e => `<a href="#journal">
            <div class="m">${esc(e.month)}</div>
            <div class="t">${esc(e.title)}</div>
          </a>`).join('')
      : '';
  }
})();

/* ==========================================================================
   misc
   ========================================================================== */
$('#year') && ($('#year').textContent = new Date().getFullYear());
