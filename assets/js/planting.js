/* =========================================================================
   WHAT TO PLANT NOW — Horry County, SC
   =========================================================================

   The data below is Clemson Cooperative Extension's planting chart for the
   COASTAL region of South Carolina, which is the region Horry County sits in
   (HGIC 1256 "Planning a Garden", revised 12 Feb 2021). The windows are
   transcribed verbatim from that chart. Do not adjust them by feel -- if a
   date looks wrong, check it against hgic.clemson.edu and change it here with
   a note, so the page never drifts away from the source it cites.

   Two flags come straight off the chart's own footnotes:
     tp  footnote 1, "From Transplants" -- the window is when the transplant
         goes in the ground, not when you start the seed.
     seq footnote 2, "Sequentially plant to extend the cropping season" --
         sow a short row every couple of weeks rather than all at once.

   Dates are "MM-DD" with no year, because the chart is the same every year.
   A null window means Clemson marks the crop "Not recommended" for that
   season in this region, which is a real answer and gets shown as one.
   ========================================================================= */

const REGION = {
  county : "Horry County",
  region : "Coastal Plain",
  zone   : "USDA zone 8b",
  source : "Clemson Cooperative Extension, HGIC 1256 “Planning a Garden”",
  url    : "https://hgic.clemson.edu/factsheet/planning-a-garden/",
  revised: "revised 12 February 2021"
};

const CROPS = [
  { crop:"Asparagus",          spring:["02-01","03-15"], fall:null },
  { crop:"Beans, snap",        spring:["04-01","06-01"], fall:["08-01","09-01"] },
  { crop:"Beans, pole",        spring:["04-01","06-01"], fall:["08-01","09-01"] },
  { crop:"Beans, half-runner", spring:["04-01","06-01"], fall:["08-01","09-01"] },
  { crop:"Beans, lima",        spring:["04-15","06-01"], fall:["07-15","08-01"] },
  { crop:"Beans, pole lima",   spring:["04-15","06-01"], fall:["07-15","08-01"] },
  { crop:"Beans, edible soy",  spring:["04-15","06-01"], fall:["07-15","08-01"] },
  { crop:"Beets",              spring:["02-15","03-31"], fall:["08-15","09-30"] },
  { crop:"Broccoli",           spring:["03-01","04-10"], fall:["09-01","09-30"], tp:true },
  { crop:"Brussels sprouts",   spring:null,              fall:["09-15","10-15"] },
  { crop:"Cabbage",            spring:["02-01","03-31"], fall:["08-15","09-30"], tp:true },
  { crop:"Cantaloupe",         spring:["03-15","05-15"], fall:["07-01","07-30"] },
  { crop:"Carrots",            spring:["02-01","03-15"], fall:["09-01","09-15"] },
  { crop:"Cauliflower",        spring:["03-01","04-10"], fall:["08-15","08-30"], tp:true },
  { crop:"Collards",           spring:["02-01","06-15"], fall:["08-01","10-30"] },
  { crop:"Cucumber",           spring:["03-15","05-15"], fall:["08-01","08-30"] },
  { crop:"Eggplant",           spring:["04-01","04-30"], fall:["08-01","08-31"], tp:true },
  { crop:"Garlic",             spring:null,              fall:["10-01","11-30"] },
  { crop:"Honeydew",           spring:["03-15","05-15"], fall:["07-01","07-30"] },
  { crop:"Kale",               spring:["02-01","06-15"], fall:["08-01","10-30"] },
  { crop:"Leeks",              spring:["02-01","06-15"], fall:null },
  { crop:"Lettuce",            spring:["02-01","04-15"], fall:["09-05","11-01"], seq:true },
  { crop:"Mustard",            spring:["02-01","06-15"], fall:["08-01","10-15"], seq:true },
  { crop:"Okra",               spring:["05-01","06-30"], fall:null },
  { crop:"Onion, sets",        spring:["02-01","03-15"], fall:["09-15","11-15"] },
  { crop:"Onion, plants",      spring:null,              fall:["10-01","11-15"] },
  { crop:"Onion, seeds",       spring:null,              fall:["09-15","10-30"] },
  { crop:"Peanuts",            spring:["04-01","05-31"], fall:null },
  { crop:"Peas, garden",       spring:["02-01","03-15"], fall:["08-15","11-30"] },
  { crop:"Peas, southern",     spring:["04-01","06-15"], fall:["07-15","08-01"] },
  { crop:"Pepper",             spring:["04-01","05-15"], fall:["07-10","08-10"], tp:true },
  { crop:"Potatoes, Irish",    spring:["02-01","03-31"], fall:null },
  { crop:"Potatoes, sweet",    spring:["04-15","06-15"], fall:null },
  { crop:"Pumpkins",           spring:null,              fall:["06-01","06-30"] },
  { crop:"Radish",             spring:["02-01","06-15"], fall:["08-01","09-30"], seq:true },
  { crop:"Rutabaga",           spring:["02-01","03-31"], fall:["08-15","10-15"] },
  { crop:"Spinach",            spring:["02-01","04-01"], fall:["08-15","10-15"], seq:true },
  { crop:"Squash, summer",     spring:["03-15","07-31"], fall:["08-01","08-31"] },
  { crop:"Squash, winter",     spring:["03-20","05-01"], fall:["08-01","08-31"] },
  { crop:"Sweet corn",         spring:["03-01","04-15"], fall:null, seq:true },
  { crop:"Tomato",             spring:["03-01","04-30"], fall:["07-01","07-31"], tp:true },
  { crop:"Turnips",            spring:["02-01","04-01"], fall:["08-01","09-30"], seq:true },
  { crop:"Watermelon",         spring:["04-01","04-30"], fall:null, tp:true }
];

/* ---------------------------------------------------------------- dates -- */
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const SHORT  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Everything compares as a day-of-year number so the year never matters, and
// a window that runs across New Year would still work if one ever appeared.
const dayOf = (m, d) => {
  const cum = [0,31,59,90,120,151,181,212,243,273,304,334];
  return cum[m - 1] + d;
};
const parse = md => { const [m, d] = md.split('-').map(Number); return dayOf(m, d); };
const label = md => { const [m, d] = md.split('-').map(Number); return SHORT[m-1] + ' ' + d; };

function windowState(w, today){
  if (!w) return null;
  const a = parse(w[0]), b = parse(w[1]);
  const open  = a <= b ? (today >= a && today <= b) : (today >= a || today <= b);
  // days until it opens / days until it shuts, whichever applies
  const until = a >= today ? a - today : a + 365 - today;
  const left  = b >= today ? b - today : b + 365 - today;
  return { open, until, left, from: label(w[0]), to: label(w[1]) };
}

// Is a day-of-year inside a window? Pulled out so the week scan can reuse it.
const dayInWindow = (w, doy) => {
  if (!w) return false;
  const a = parse(w[0]), b = parse(w[1]);
  return a <= b ? (doy >= a && doy <= b) : (doy >= a || doy <= b);
};

/* ---------------------------------------------------------------- render -- */
(function plantNow(){
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const now   = new Date();
  const today = dayOf(now.getMonth() + 1, now.getDate());

  /* ---- which seven days the page answers for ----
     'rolling'  today and the next six days
     'sunday'   the Sunday-to-Saturday week today falls in

     Rolling is the default, and on purpose. A Sunday-start week read on a
     Saturday is six-sevenths expired: the page would have said "Week of
     Nov 22-28" while the only thing worth knowing was that garlic closes on
     Nov 30. A planting window you have already missed is not useful. Rolling
     is always forward-looking and still names exact dates. Switch to 'sunday'
     here if a fixed calendar week ever matters more than being actionable.

     Built as seven real Date objects rather than arithmetic on day-of-year
     numbers: a week can straddle the end of the year, and iterating actual
     dates sidesteps every wrap-around bug that would otherwise need handling. */
  const WEEK_MODE = 'rolling';

  const weekStart = new Date(now);
  weekStart.setHours(0,0,0,0);
  if (WEEK_MODE === 'sunday') weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const week = [];
  for (let i = 0; i < 7; i++){
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    week.push({ date: d, doy: dayOf(d.getMonth() + 1, d.getDate()), dow: d.getDay() });
  }
  const wA = week[0].date, wB = week[6].date;

  // "November 22-28, 2026", or "November 29 - December 5, 2026" across a month
  const weekLabel = (wA.getMonth() === wB.getMonth())
    ? MONTHS[wA.getMonth()] + ' ' + wA.getDate() + '–' + wB.getDate() + ', ' + wB.getFullYear()
    : MONTHS[wA.getMonth()] + ' ' + wA.getDate() + ' – ' +
      MONTHS[wB.getMonth()] + ' ' + wB.getDate() + ', ' + wB.getFullYear();

  const rows = CROPS.map(c => {
    const s = windowState(c.spring, today);
    const f = windowState(c.fall, today);
    const states = [
      s && {...s, season:'Spring', win:c.spring},
      f && {...f, season:'Fall',   win:c.fall}
    ].filter(Boolean);

    // A crop counts for this week if its window covers ANY day of the week,
    // not only today -- that is what "this week" has to mean on a page people
    // read on a Tuesday to plan their Saturday.
    states.forEach(st => {
      const days = week.filter(d => dayInWindow(st.win, d.doy));
      st.daysThisWeek = days.length;
      st.opensOn = (!st.open && days.length) ? days[0] : null;   // opens later this week
    });

    const openNow = states.find(x => x.open)
                 || states.find(x => x.daysThisWeek > 0)
                 || null;
    const next = states.filter(x => !x.daysThisWeek).sort((a, b) => a.until - b.until)[0] || null;
    return { ...c, openNow, next, states };
  });

  const nowList   = rows.filter(r => r.openNow)
                      .sort((a, b) => (a.openNow.open ? 0 : 1) - (b.openNow.open ? 0 : 1)
                                   || a.openNow.left - b.openNow.left);
  // Always show what is coming, however far off. A hard 45-day cutoff left
  // this section empty every winter, which is exactly when a gardener is
  // sitting indoors planning next year.
  const soonList  = rows.filter(r => !r.openNow && r.next)
                        .sort((a, b) => a.next.until - b.next.until)
                        .slice(0, 8);

  const el = id => document.getElementById(id);
  const tag = r => [
    r.tp  ? '<span class="pz-tag" title="Clemson lists this window for setting out transplants, not sowing seed">from transplants</span>' : '',
    r.seq ? '<span class="pz-tag" title="Sow a short row every couple of weeks to stretch the picking">plant in succession</span>' : ''
  ].join('');

  /* ---- the date line ---- */
  el('pzDate').textContent = (WEEK_MODE === 'sunday' ? 'Week of ' : 'The week ahead: ') + weekLabel + '.';

  /* ---- in the ground now ---- */
  if (!nowList.length){
    el('pzNow').innerHTML = '<p class="pz-empty">Nothing on Clemson’s coastal chart goes in the ground this week. ' +
      'The next windows open below — and a quiet week in the dirt is a good week for soil tests, ' +
      'cover crop and fence repair.</p>';
  } else {
    el('pzNow').innerHTML = nowList.map(r => {
      const w = r.openNow;
      const urgent = w.open && w.left <= 14;
      const status = w.opensOn
        ? 'Opens ' + DAYS[w.opensOn.dow]
        : w.left === 0 ? 'Last day of the window'
        : w.left === 1 ? '1 day left'
        : w.left + ' days left';
      return `<article class="pz-card${urgent ? ' pz-card--urgent' : ''}${w.opensOn ? ' pz-card--later' : ''}">
        <div class="pz-card__top">
          <h3>${r.crop}</h3>
          <span class="pz-season">${w.season}</span>
        </div>
        <div class="pz-win">${w.from} – ${w.to}</div>
        <div class="pz-left">${status}</div>
        ${tag(r) ? `<div class="pz-tags">${tag(r)}</div>` : ''}
      </article>`;
    }).join('');
  }
  el('pzNowCount').textContent = nowList.length;

  /* ---- opening soon ---- */
  el('pzSoon').innerHTML = soonList.length
    ? soonList.map(r => `<li>
        <span class="pz-soon__crop">${r.crop}</span>
        <span class="pz-soon__when">opens ${r.next.from}</span>
        <span class="pz-soon__in">in ${r.next.until} day${r.next.until === 1 ? '' : 's'}</span>
      </li>`).join('')
    : '<li class="pz-empty">Nothing further to open this year.</li>';

  /* ---- the whole year ---- */
  el('pzTable').innerHTML =
    `<thead><tr><th>Crop</th><th>Spring planting</th><th>Fall planting</th></tr></thead><tbody>` +
    rows.map(r => {
      const cell = (w, st) => !w
        ? '<td class="pz-no">Not recommended</td>'
        : `<td class="${st && st.open ? 'pz-open' : ''}">${label(w[0])} – ${label(w[1])}</td>`;
      const s = windowState(r.spring, today), f = windowState(r.fall, today);
      return `<tr${r.openNow ? ' class="pz-row--open"' : ''}>
        <th scope="row">${r.crop}${tag(r)}</th>
        ${cell(r.spring, s)}${cell(r.fall, f)}
      </tr>`;
    }).join('') + '</tbody>';

  /* ---- source line ---- */
  el('pzSource').innerHTML =
    `Dates from <a href="${REGION.url}" target="_blank" rel="noopener">${REGION.source}</a>, ${REGION.revised}, ` +
    `for the ${REGION.region} region — the region ${REGION.county} belongs to. ` +
    `Planting dates are regional guidance, not a forecast: a cold snap or a wet spring moves them, ` +
    `and your own ground is the final word.`;

  /* ---- show the full chart ---- */
  const btn = el('pzToggle'), chart = el('pzChart');
  btn.addEventListener('click', () => {
    const open = chart.hasAttribute('hidden');
    if (open) chart.removeAttribute('hidden'); else chart.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Hide the full-year chart' : 'See the full-year chart';
  });
})();
