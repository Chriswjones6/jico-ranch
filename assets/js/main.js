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
    // Ducks were bought and are arriving mid-December 2026. Change this to
    // "Fencing, water lines, and the first ducks" the day they land.
    phase   : "Fencing, water lines, first ducks this month",
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

/* --- The hero ------------------------------------------------------------
   Two ways to put motion behind the headline, and video wins if it is there.

   HERO_CLIPS  real footage. Drop .mp4 files in assets/video/ and list the
               filenames. They crossfade, muted, and loop round.

   HERO_STILLS photographs that crossfade with a slow drift across them.
               This is the fallback until there is real footage, and it is
               what is running now. Order tells a small story: the horses,
               then the goats, then something coming out of the garden.

   Either list can be emptied. With both empty the hero is just the still
   background image set on .hero__bg in index.html.
   ------------------------------------------------------------------------ */
const HERO_CLIPS = [
  // "hero-pasture.mp4",
  // "hero-barnyard.mp4",
  // "hero-garden-rows.mp4"
];

const HERO_STILLS = [
  "hero-ranch.jpg",       // horses out in the pasture at golden hour
  "hero-2-goats.jpg",     // a goat at the fence
  "hero-3-picking.jpg",   // cutting greens off the row
  "hero-4-donkey.jpg"     // the donkey in the sun
];

/* --- The animal roster ---------------------------------------------------
   photo files live in assets/img/. Add, remove or reorder freely. */
const ANIMALS = [
  { name:"The Goat Crew", species:"Nigerian dwarf goats", img:"animal-goats.jpg",
    fact:"First to the fence and shameless about it. They'll check every pocket you own." },
  { name:"The Herd",      species:"Cattle",               img:"animal-cattle.jpg",
    fact:"Out on the back pasture. Visited from the fence line or on a guided walk." },
  { name:"The Flock",     species:"Laying hens & ducks",  img:"animal-chickens.jpg",
    fact:"Between them they lay most of what ends up at the stand each morning." },
  { name:"The Horses",    species:"Saddle horses",        img:"animal-horses.jpg",
    fact:"Retired from real work and enjoying it. Say hello, but feeding is staff-only." },
  { name:"The Pigs",      species:"Pasture-raised hogs",  img:"animal-pigs.jpg",
    fact:"Rotated through the paddocks — they turn ground over better than any tiller." },
  { name:"The Sheep",     species:"Sheep",                img:"animal-sheep.jpg",
    fact:"Quietly the best grazers here. They keep the field edges honest." },
  { name:"The Rabbits",   species:"Rabbits",              img:"animal-rabbits.jpg",
    fact:"The hutch is the softest landing for a nervous first-time visitor." },
  { name:"The Donkeys",   species:"Donkeys",              img:"animal-donkey.jpg",
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

/* --- Weather at the ranch ------------------------------------------------
   National Weather Service, for the grid cell that covers 2407 Highway 66.
   Public-domain US government data: no API key, no account, no usage limit
   and nothing to renew or pay for. The grid cell is about 2.5km square, so
   this is the forecast for the ranch itself rather than a city 20 miles off.

   To move it, open https://api.weather.gov/points/<lat>,<lon> and copy the
   two URLs out of the response. Current cell = ILM 56,63 (34.0563,-78.8903).
   ------------------------------------------------------------------------ */
const WEATHER = {
  hourly : "https://api.weather.gov/gridpoints/ILM/56,63/forecast/hourly",
  daily  : "https://api.weather.gov/gridpoints/ILM/56,63/forecast"
};

/* --- Harvest of the Month ------------------------------------------------
   One crop a month, NEWEST FIRST. Empty is fine: while this array has no
   entries the "starts with the first crop" panel shows in its place, and it
   hides itself the moment you add one.

   Each entry needs:
     month     "June 2027"
     crop      what it is, used as the headline
     variety   the specific variety, small caps under the headline
     img       a photo in assets/img/
     body      a paragraph about it
     timeline  { sown, planted, firstPick } as "YYYY-MM-DD".
               `planted` (the transplant date) is optional -- leave it out for
               anything direct-sown. Days to harvest is CALCULATED from sown to
               firstPick, so never type that number in by hand.
     yield     what came off it
     window    how long picking lasts
     grown     how it was grown
     use       what to do with it once you get it home

   A filled-in example sits at the bottom of this file under HARVEST_EXAMPLE --
   copy it to the top of this array when the first crop comes in.
   ------------------------------------------------------------------------ */
const HARVESTS = [
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
  if (!host) return;
  // A still hero is the honest default when someone has asked for less motion.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------- real footage, if we have any ---------- */
  if (HERO_CLIPS.length){
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
      vids[(n + 1) % vids.length].preload = 'auto';
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
    return;
  }

  /* ---------- otherwise, crossfade the stills ---------- */
  if (HERO_STILLS.length < 2) return;

  const HOLD = 6000;   // ms each photo is held, before a 1.6s CSS crossfade

  // The first frame is the same photo as the CSS background, so the swap to
  // the montage layer is invisible and nothing flashes on load.
  const imgs = HERO_STILLS.map((src, i) => {
    const im = new Image();
    im.src = 'assets/img/' + src;
    im.alt = '';
    im.decoding = 'async';
    // Only the first is wanted immediately; the rest can wait for idle time
    // rather than competing with the headline and the rest of the page.
    if (i) im.loading = 'lazy';
    if (i % 2) im.classList.add('is-alt');   // alternate the drift direction
    host.appendChild(im);
    return im;
  });

  let i = 0;
  imgs[0].classList.add('is-live');

  const tick = () => {
    const next = (i + 1) % imgs.length;
    imgs[i].classList.remove('is-live');
    imgs[next].classList.add('is-live');
    i = next;
  };

  let timer = setInterval(tick, HOLD);
  // Nothing to animate while the tab is in the background, and leaving it
  // running means coming back to a pile of queued transitions.
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (!document.hidden) timer = setInterval(tick, HOLD);
  });
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
   weather at the ranch — appended to the today strip
   ==========================================================================
   Appended rather than written into index.html because the strip rebuilds
   itself for pre-opening vs open, and anything sitting in the markup gets
   overwritten. Fails silently: if NWS is down the item simply never appears,
   which is better than a live-looking widget showing a stale or empty number.
   ========================================================================== */
(function weather(){
  const items = $('.today__items');
  if (!items || !WEATHER.hourly) return;

  const CACHE_KEY = 'jr-wx', CACHE_MS = 15 * 60 * 1000;

  // Five shapes is enough to read at this size. Anything not matched gets the
  // cloud, which is the safest wrong answer.
  const ICONS = {
    sun  : '<circle cx="12" cy="12" r="4.4"/><g stroke-width="1.7" stroke-linecap="round"><path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9"/></g>',
    cloud: '<path d="M7 18h10.2a3.8 3.8 0 0 0 .4-7.6A5.6 5.6 0 0 0 6.9 11 3.5 3.5 0 0 0 7 18Z"/>',
    rain : '<path d="M7.4 15h9.8a3.5 3.5 0 0 0 .3-7A5.2 5.2 0 0 0 7.3 8.4 3.3 3.3 0 0 0 7.4 15Z"/><g stroke-width="1.8" stroke-linecap="round"><path d="M9 18.2l-.8 2.2M13 18.2l-.8 2.2M17 18.2l-.8 2.2"/></g>',
    snow : '<path d="M7.4 15h9.8a3.5 3.5 0 0 0 .3-7A5.2 5.2 0 0 0 7.3 8.4 3.3 3.3 0 0 0 7.4 15Z"/><g stroke-width="1.8" stroke-linecap="round"><path d="M9 19h.01M13 20h.01M17 19h.01"/></g>',
    fog  : '<g stroke-width="1.8" stroke-linecap="round"><path d="M4 9h16M6 13h14M4 17h12"/></g>'
  };
  const pick = (sky, isDay) => {
    const t = (sky || '').toLowerCase();
    if (/snow|sleet|ice|wintry/.test(t))              return 'snow';
    if (/rain|shower|storm|thunder|drizzle/.test(t))  return 'rain';
    if (/fog|haze|mist|smoke/.test(t))                return 'fog';
    if (/cloud|overcast/.test(t))                     return 'cloud';
    return isDay ? 'sun' : 'cloud';
  };
  const svg = k => `<svg class="wx__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

  function paint(d){
    const el = document.createElement('div');
    el.className = 'today__item today__item--wx';
    const extra = [
      d.pop != null && d.pop > 0 ? d.pop + '% rain' : null,
      d.wind ? d.wind + ' ' + (d.dir || '') : null
    ].filter(Boolean).join(' · ');
    el.innerHTML = `<span class="today__label">At the ranch</span>
      <span class="today__val wx">${svg(pick(d.sky, d.isDay))}
        <span class="wx__t">${esc(String(d.temp))}°</span>
        <span class="wx__s">${esc(d.sky)}</span>
        ${d.hi != null || d.lo != null ? `<span class="wx__hl">${
          d.hi != null ? 'H ' + d.hi + '°' : ''}${d.hi != null && d.lo != null ? ' / ' : ''}${
          d.lo != null ? 'L ' + d.lo + '°' : ''}</span>` : ''}
      </span>`;
    if (extra) el.title = extra;
    items.appendChild(el);
  }

  function cached(){
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const o = JSON.parse(raw);
      return (Date.now() - o.at < CACHE_MS) ? o.d : null;
    } catch (e){ return null; }
  }

  const hit = cached();
  if (hit){ paint(hit); return; }

  const get = u => fetch(u).then(r => r.ok ? r.json() : Promise.reject(r.status));

  Promise.all([
    get(WEATHER.hourly),
    WEATHER.daily ? get(WEATHER.daily).catch(() => null) : Promise.resolve(null)
  ]).then(([h, day]) => {
    const p = h && h.properties && h.properties.periods && h.properties.periods[0];
    if (!p) return;

    // The daily feed alternates day and night periods. Take the first of each
    // kind rather than periods[0]/[1], which flip over through the evening.
    let hi = null, lo = null;
    const dp = day && day.properties && day.properties.periods || [];
    for (const q of dp.slice(0, 3)){
      if (q.isDaytime && hi == null) hi = q.temperature;
      if (!q.isDaytime && lo == null) lo = q.temperature;
    }

    const d = {
      temp : p.temperature,
      sky  : p.shortForecast,
      isDay: p.isDaytime,
      wind : p.windSpeed,
      dir  : p.windDirection,
      pop  : p.probabilityOfPrecipitation && p.probabilityOfPrecipitation.value,
      hi, lo
    };
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), d })); } catch (e){}
    paint(d);
  }).catch(() => {});
})();

/* ==========================================================================
   harvest of the month — the newest crop, in full
   ========================================================================== */
(function harvest(){
  const host = $('#journalLatest'), soon = $('#harvestSoon');
  if (!host) return;

  const latest = HARVESTS[0];
  // Nothing picked yet: say what will go here rather than hide the idea.
  if (soon) soon.hidden = !!latest;
  if (!latest) return;

  // local-date parse: "2027-03-28" must not drift a day on a UTC parse
  const d = iso => { const [y,m,day] = iso.split('-').map(Number); return new Date(y, m-1, day); };
  const fmt = dt => dt.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const days = (a1, b1) => Math.round((d(b1) - d(a1)) / 86400000);

  function timeline(t){
    // markers sit at their true proportional position, so a 54-day radish and
    // a 110-day melon visibly differ
    const pts = [['Sown', t.sown], t.planted && ['Planted out', t.planted], ['First pick', t.firstPick]]
      .filter(Boolean);
    const span = days(t.sown, t.firstPick) || 1;
    const marks = pts.map(([k, iso], i) => {
      const pct = Math.min(100, Math.max(0, (days(t.sown, iso) / span) * 100));
      return `<div class="timeline__pt${i === pts.length - 1 ? ' timeline__pt--last' : ''}" style="left:${pct}%">
          <div class="timeline__lab"><div class="timeline__k">${esc(k)}</div>
          <div class="timeline__d">${esc(fmt(d(iso)))}</div></div>
          <div class="timeline__dot"></div>
        </div>`;
    }).join('');
    return `<div class="timeline">
        <div class="timeline__track">${marks}</div>
        <div class="timeline__total"><strong>${span} days</strong> from seed to basket.</div>
      </div>`;
  }

  // days-to-harvest is on the timeline and the variety sits under the crop
  // name, so neither gets repeated down here
  const facts = [
    latest.yield  && ['Yield', latest.yield],
    latest.window && ['Picking window', latest.window]
  ].filter(Boolean);

  host.innerHTML = `
    <div class="journal__media">
      <img src="assets/img/${esc(latest.img)}" alt="${esc(latest.crop)}" loading="lazy">
    </div>
    <div>
      <span class="journal__kind">Harvest of the month</span>
      <div class="journal__month">${esc(latest.month)}</div>
      <h3 class="journal__title">${esc(latest.crop)}</h3>
      ${latest.variety ? `<div class="harvest__variety">${esc(latest.variety)}</div>` : ''}
      <p class="journal__body">${esc(latest.body || '')}</p>
      ${latest.timeline ? timeline(latest.timeline) : ''}
      ${facts.length ? `<dl class="journal__facts">${facts.map(([k,v]) =>
        `<div class="journal__fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${(latest.grown || latest.use) ? `<div class="harvest__cols">
        ${latest.grown ? `<div class="harvest__col"><h4>How we grew it</h4><p>${esc(latest.grown)}</p></div>` : ''}
        ${latest.use   ? `<div class="harvest__col"><h4>What to do with it</h4><p>${esc(latest.use)}</p></div>` : ''}
      </div>` : ''}
    </div>`;
})();

/* ==========================================================================
   misc
   ========================================================================== */
$('#year') && ($('#year').textContent = new Date().getFullYear());


/* ==========================================================================
   HARVEST_EXAMPLE — a filled-in harvest entry.
   Copy this object to the TOP of the HARVESTS array when the first crop comes
   in, delete this block, and the section switches itself over. Nothing below
   runs; it is here purely as a template.
   ==========================================================================
const HARVEST_EXAMPLE = {
  month   : "June 2027",
  crop    : "Sweet Corn",
  variety : "Silver Queen",
  img     : "harvest-corn.svg",
  body    : "The first real crop off the new ground. Silver Queen is a slow, " +
            "old-fashioned white corn that most commercial growers gave up on " +
            "because it does not ship. It does not have to ship ten feet to the " +
            "farm stand.",
  timeline: { sown: "2027-03-28", planted: "2027-04-18", firstPick: "2027-06-14" },
  yield   : "About 900 ears off a quarter acre",
  window  : "Mid-June into July",
  grown   : "Direct-sown in four successions two weeks apart so it does not all " +
            "come ripe at once. Compost from our own animals, drip irrigation, no spray.",
  use     : "Eat it the day you buy it. Boil six minutes, or shuck it and put it " +
            "straight on the grill in the husk. Anything left over cuts off the cob and freezes."
};
*/
