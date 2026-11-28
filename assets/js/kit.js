/* =========================================================================
   THE KIT — what we actually use
   =========================================================================

   The one page on this site carrying affiliate links. Deliberately one page:
   kept off the animal pages and well away from the sponsorship pages, where
   "support this goat" sitting next to "buy its feed through our link" would
   read badly and cost more trust than the links could ever earn.

   THE RULE, and it is the only thing protecting the value of this page:
   never let the affiliate program decide what gets listed. List what we
   actually bought and actually use. If we switch away from something,
   the entry says so and stays, because the switches are the useful part.
   A page of recommendations we do not personally stand behind is worth
   less than no page at all -- the commission is rounding error next to
   being the farm people believe.

   TO GO LIVE this needs two things:
     1. AFFILIATE.amazonTag below — your Amazon Associates tracking ID.
        Until it is filled in, items render as plain text with no link, so
        nothing is broken and no untagged traffic is sent to Amazon.
     2. Real entries in KIT. It ships empty on purpose. Inventing a gear
        list would be fabricating endorsements for products nobody here has
        touched, which is the exact thing this page exists not to do.
   ========================================================================= */

const AFFILIATE = {
  amazonTag : "",                       // e.g. "jicoranch-20". Empty = no links.
  // Shown above the list. FTC requires this to be clear, plain and near the
  // links, and the Associates agreement requires it to be present at all.
  disclosure: "Some links below go to Amazon, and if you buy through one we " +
              "earn a small commission at no extra cost to you. It does not " +
              "influence what is on this list — everything here is gear we " +
              "bought with our own money and use on the place. Links marked " +
              "“no commission” earn us nothing; they are here because the " +
              "product is the right answer."
};

/* Areas render in this order. Anything in KIT with an area not listed here
   still shows, at the bottom, so a typo loses nothing. */
const KIT_AREAS = [
  { key:"ducks",    title:"Ducks",             blurb:"" },
  { key:"layers",   title:"Laying hens",       blurb:"" },
  { key:"goats",    title:"Goats",             blurb:"" },
  { key:"equine",   title:"Horses & donkeys",  blurb:"" },
  { key:"pigs",     title:"Pigs",              blurb:"" },
  { key:"bees",     title:"The bee yard",      blurb:"" },
  { key:"garden",   title:"The garden",        blurb:"" },
  { key:"orchard",  title:"The orchard",       blurb:"" },
  { key:"fencing",  title:"Fencing & water",   blurb:"The first thing that went in, and the thing everything else waits on." },
  { key:"tools",    title:"Tools that earn their keep", blurb:"" }
];

/* -------------------------------------------------------------------------
   Entry shape:
     area    one of the keys above
     item    what it is, in our words
     brand   make and model, specific enough to actually buy
     what    the spec that matters
     why     why this one and not the cheaper one
     cadence how often we do it -- "refilled twice a day", "wormed every 8
             weeks", "side-dressed at 3 and 6 weeks". Half of what people
             came to read is the schedule, not the product.
     note    how it is holding up. DATE IT. This is the other half.
     price   what WE paid and WHEN, or a cost-per-use figure. Never a current
             Amazon price: the Associates agreement forbids displaying their
             pricing unless it comes from their API and is refreshed every 24
             hours, and a stale price is a policy violation. "$22 a bag, Nov
             2026" is our own purchase record, not their price. Better still,
             "about 55c a day for 14 ducks" -- not a price at all, and a more
             useful number to somebody deciding whether to keep ducks.
     asin    Amazon ASIN -> becomes a tagged affiliate link
     url     anything else (Tractor Supply, a co-op) -> plain link, no commission
     dropped true if we stopped using it. Keep the entry. Say why in `note`.
   ------------------------------------------------------------------------- */
const KIT = [
  /* TODO CONFIRM BEFORE THIS PAGE GOES PUBLIC
     Amazon blocks automated reading of its product pages, so the ASINs below
     are certain (they came straight from Chris's links) but the product names
     are read off the URL slug and the search terms he used. Both need checking
     against the actual listing, and neither has a price, a schedule or a
     verdict yet -- those are his to give. Until then this is a draft. */
  {
    area  : "ducks",
    item  : "Duck feed",
    brand : "Purina Duck Feed for All Life-Stages",   // confirmed from the listing
    what  : "19% protein pellets, 40 lb bag. Purina also lists elevated niacin " +
            "and added pre/probiotics on the label.",
    asin  : "B07VF8PQ8G"
    // why     : TODO -- why this over the cheaper bag. Did you try another first?
    // cadence : TODO -- how long a 40 lb bag lasts, and for how many birds
    // note    : TODO -- how it is going. Needs the birds first.
    // price   : TODO -- what YOU paid and where. Not Amazon's number:
    //            their listing is flagged "High price" and the 40 lb has no
    //            featured offer, so a farm store is likely cheaper anyway.
  },
  {
    area  : "ducks",
    item  : "Brewer's yeast",
    brand : "Brewer's yeast poultry supplement",    // TODO confirm exact title
    what  : "Niacin supplement, resealable foil pouch",
    why   : "Ducklings need far more niacin than chicks do, and a standard " +
            "poultry feed does not carry enough of it. Short it and you get " +
            "bowed legs you cannot undo. Brewer's yeast over the feed is the " +
            "cheap insurance against a permanent problem.",
    asin  : "B0D1W24CY7"
    // cadence : TODO -- how much per bird, how often, and for how long
    // note    : TODO -- how it is going, dated
    // price   : TODO -- what you pay
  }
];

/* -------------------------------------------------------------------------
   A worked entry, for when there is something real to put here:

const KIT_EXAMPLE = {
  area  : "fencing",
  item  : "Fence post driver",
  brand : "Rhino 2-handle manual post driver",
  what  : "17 lb, fits up to 2 3/8\" pipe",
  cadence: "In the truck year round; heaviest use Sept-Dec on the perimeter",
  why   : "Rented a hydraulic driver for the first stretch and it was overkill " +
          "for T-posts. This does a post in about eight strikes and lives in " +
          "the truck instead of on a trailer.",
  note  : "Nov 2026 — roughly 400 posts in, no play in the handles yet.",
  price : "$78 (Oct 2026)",
  asin  : "B000XXXXXX"
};
   ------------------------------------------------------------------------- */

(function kit(){
  const host = document.getElementById('kitList');
  const empty = document.getElementById('kitEmpty');
  const disc = document.getElementById('kitDisclosure');
  if (!host) return;

  const esc = t => String(t == null ? '' : t)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  if (disc) disc.textContent = AFFILIATE.disclosure;

  if (!KIT.length){
    if (empty) empty.hidden = false;
    if (disc && disc.parentElement) disc.parentElement.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;

  // rel="sponsored" is what Google asks for on paid links; without it a page
  // of affiliate links looks like an attempt to pass link equity around.
  const link = e => {
    if (e.asin && AFFILIATE.amazonTag){
      return { href: 'https://www.amazon.com/dp/' + encodeURIComponent(e.asin) +
                     '?tag=' + encodeURIComponent(AFFILIATE.amazonTag),
               rel: 'sponsored nofollow noopener', paid: true };
    }
    if (e.url) return { href: e.url, rel: 'nofollow noopener', paid: false };
    return null;
  };

  const known = KIT_AREAS.map(a => a.key);
  const extra = [...new Set(KIT.map(e => e.area).filter(a => !known.includes(a)))]
                  .map(k => ({ key:k, title:k, blurb:'' }));

  host.innerHTML = [...KIT_AREAS, ...extra].map(area => {
    const items = KIT.filter(e => e.area === area.key);
    if (!items.length) return '';
    return `<section class="kit-area">
      <h2 class="kit-area__t">${esc(area.title)}</h2>
      ${area.blurb ? `<p class="kit-area__b">${esc(area.blurb)}</p>` : ''}
      <div class="kit-grid">${items.map(e => {
        const l = link(e);
        const name = `${esc(e.brand || e.item)}`;
        return `<article class="kit-card${e.dropped ? ' kit-card--dropped' : ''}">
          <div class="kit-card__h">
            <h3>${esc(e.item)}</h3>
            ${e.dropped ? '<span class="kit-flag">no longer using</span>' : ''}
          </div>
          <div class="kit-brand">${l ? `<a href="${l.href}" rel="${l.rel}" target="_blank">${name}</a>` : name}${
            l ? `<span class="kit-paid">${l.paid ? 'affiliate link' : 'no commission'}</span>` : ''}</div>
          ${e.what  ? `<div class="kit-spec">${esc(e.what)}</div>` : ''}
          ${e.cadence ? `<div class="kit-cadence"><span>How often</span>${esc(e.cadence)}</div>` : ''}
          ${e.why   ? `<p class="kit-why"><strong>Why this one.</strong> ${esc(e.why)}</p>` : ''}
          ${e.note  ? `<p class="kit-note">${esc(e.note)}</p>` : ''}
          ${e.price ? `<div class="kit-price">${esc(e.price)}</div>` : ''}
        </article>`;
      }).join('')}</div>
    </section>`;
  }).join('');
})();
