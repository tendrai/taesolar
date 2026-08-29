/* ==========================================================================
   TAE SOLAR — Site behaviour: nav, reveal, calculator, lead forms
   ========================================================================== */

/* --------------------------------------------------------------------------
   CALCULATOR ASSUMPTIONS  ***EDIT THESE IN ONE PLACE***
   All figures researched Aug 2026 — review quarterly, tariffs change.
   -------------------------------------------------------------------------- */
const SOLAR = {
  // Blended residential tariff incl. Ft + VAT (THB/kWh).
  // Thailand residential avg ~3.95 THB/kWh before VAT; ~4.2 blended incl. VAT.
  tariffResidential: 4.20,
  // Small-business / commercial blended rate (varies widely by tariff class).
  tariffCommercial: 4.40,

  // PEA/MEA household rooftop buyback scheme 2026: 2.20 THB/kWh, ≤5 kW AC.
  exportRate: 2.20,
  exportMaxKw: 5,

  // Specific yield, kWh per kWp per year.
  // Thailand 1,300–1,500. Southern Thailand sits LOWER due to heavy rainfall,
  // so we use a deliberately conservative figure for Phuket.
  yield: 1350,

  // Installed cost anchor points [kWp, THB] — piecewise linear between them.
  costAnchors: [[3,120000],[5,175000],[10,310000],[20,520000],[50,1150000],[100,2200000]],

  // Battery storage adds roughly this much per kWp of system size (THB).
  batteryPerKw: 24000,

  // Ground-mounted arrays cost more than the same kWp on a roof: frames and
  // foundations instead of using the building's structure, groundworks, longer
  // cable runs back to the house, and usually fencing. The cost anchors above
  // are rooftop figures, so a garden or land install is scaled by this.
  // ESTIMATE — check it against your own ground-mount jobs.
  groundCostFactor: 1.15,

  // Share of TOTAL household/business consumption that happens during solar
  // hours. This is the figure that actually governs how much of your own
  // generation you can use — and therefore how big a system is worth building.
  daytimeLoadShare: { day:0.55, mixed:0.40, night:0.25 },
  batteryLoadUplift: 0.30, // a battery lets you shift evening load onto solar
  maxLoadShare: 0.90,      // you can never realistically cover 100% from solar

  panelDegradation: 0.005, // 0.5% output loss per year
  tariffInflation: 0.025,  // assumed annual electricity price rise
  horizonYears: 25
};

function costForSize(kw){
  const a = SOLAR.costAnchors;
  if(kw <= a[0][0]) return Math.round(kw * (a[0][1]/a[0][0]));
  for(let i=0;i<a.length-1;i++){
    const [x1,y1]=a[i], [x2,y2]=a[i+1];
    if(kw<=x2){ return Math.round(y1 + (kw-x1)*(y2-y1)/(x2-x1)); }
  }
  const last=a[a.length-1];
  return Math.round(kw * (last[1]/last[0]));
}

/* --------------------------------------------------------------------------
   CURRENCY  ***EDIT THESE IN ONE PLACE***
   --------------------------------------------------------------------------
   Phuket has a large expat and second-home market, so the figures need to be
   readable in the money people actually think in. Everything is computed in
   baht and converted only for display — quotes are still issued in THB, and
   the panel says so.
   -------------------------------------------------------------------------- */
const CURRENCY = {
  list: ['THB','USD','EUR','GBP','RUB','CNY','AUD','SGD','SEK'],
  symbol: { THB:'฿', USD:'$', EUR:'€', GBP:'£', RUB:'₽', CNY:'¥', AUD:'A$', SGD:'S$', SEK:'kr ' },

  // 1 THB = X. Live rates are fetched once and cached; this table is the
  // fallback so the page still works if that call fails or the visitor is
  // offline. Snapshot taken 29 Aug 2026 — refresh it occasionally.
  fallback: { THB:1, USD:0.030281, EUR:0.02608, GBP:0.022347, RUB:2.610969,
              CNY:0.204521, AUD:0.042212, SGD:0.038563, SEK:0.289562 },

  api: 'https://open.er-api.com/v6/latest/THB',
  storeKey: 'tae.currency',
  cacheKey: 'tae.fx',
  cacheHours: 12
};

const Money = (() => {
  let current = 'THB';
  let rates = Object.assign({}, CURRENCY.fallback);
  let isLive = false;

  // localStorage throws in some privacy modes — never let that break the page.
  function store(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  function read(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }

  function apply(json){
    if(!json || !json.rates) return false;
    CURRENCY.list.forEach(c => { if(typeof json.rates[c] === 'number') rates[c] = json.rates[c]; });
    isLive = true;
    return true;
  }

  async function refresh(){
    const cached = read(CURRENCY.cacheKey);
    if(cached){
      try {
        const j = JSON.parse(cached);
        if(Date.now() - j.at < CURRENCY.cacheHours * 3600e3 && apply(j.data)) return;
      } catch(e){}
    }
    try {
      const res = await fetch(CURRENCY.api);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if(apply(data)){
        store(CURRENCY.cacheKey, JSON.stringify({ at: Date.now(), data: { rates: data.rates } }));
        document.dispatchEvent(new CustomEvent('currencychange'));
      }
    } catch(e){
      // Keep the fallback table. Nothing to tell the visitor — the numbers
      // are still right to within a few percent.
    }
  }

  function set(c){
    if(!CURRENCY.list.includes(c)) return;
    current = c;
    store(CURRENCY.storeKey, c);
    document.dispatchEvent(new CustomEvent('currencychange'));
  }

  function fmt(thb){
    const v = thb * (rates[current] || 1);
    // Sub-unit precision is noise on a system price; keep whole units.
    return (CURRENCY.symbol[current] || '') + Math.round(v).toLocaleString('en-US');
  }

  function init(){
    const saved = read(CURRENCY.storeKey);
    if(saved && CURRENCY.list.includes(saved)) current = saved;
    refresh();
  }

  return { init, set, fmt, get code(){ return current; }, get live(){ return isLive; } };
})();

function fmtTHB(n){ return Money.fmt(n); }

// Always baht, whatever the visitor is viewing in — this is what goes to
// sales, and a quote denominated in pounds would be wrong.
function fmtBaht(n){ return '฿' + Math.round(n).toLocaleString('en-US'); }
function fmtNum(n, dp){
  return Number(n).toLocaleString('en-US', {minimumFractionDigits:dp||0, maximumFractionDigits:dp||0});
}

/* Translate and interpolate. Replaces EVERY occurrence of each placeholder —
   String.replace with a string pattern only swaps the first, which silently
   leaves a raw {token} on screen when a message uses one twice. */
function tf(key, vars){
  let s = I18n.t(key);
  for(const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}

/* --- Calculator ----------------------------------------------------------- */
function initCalculator(){
  const root = document.getElementById('calc');
  if(!root) return;

  const el = id => root.querySelector('#'+id);
  const state = { type:'res', bill:4000, size:5, usage:'mixed', battery:false, sizeTouched:false,
                  roofLimit:null };

  const billEl = el('c-bill'), sizeEl = el('c-size'), batteryEl = el('c-battery');

  // How much of your own consumption solar can realistically displace.
  function usableLoadKwh(){
    const tariff = state.type==='res' ? SOLAR.tariffResidential : SOLAR.tariffCommercial;
    const annualKwh = (state.bill*12)/tariff;
    let share = SOLAR.daytimeLoadShare[state.usage];
    if(state.battery) share += SOLAR.batteryLoadUplift;
    return annualKwh * Math.min(share, SOLAR.maxLoadShare);
  }

  // Right-size to the load you can actually use, not to the biggest array
  // that fits — oversizing beyond your own daytime demand earns little back.
  function loadDrivenSize(){
    const ideal = usableLoadKwh() / SOLAR.yield;
    return Math.min(Math.max(Math.round(ideal*2)/2, 1), state.type==='res' ? 20 : 100);
  }

  // Two independent ceilings: what your usage justifies, and what your roof
  // physically holds. The honest recommendation is the smaller of the two —
  // and when the roof is the binding one, say so rather than quietly shrinking
  // the number (see the note rendered below the results).
  function recommendedSize(){
    let size = loadDrivenSize();
    if(state.roofLimit) size = Math.min(size, state.roofLimit.kwp);
    return Math.max(size, 1);
  }

  // Takes a size so we can price alternatives (e.g. "what would 5 kWp do?")
  // without disturbing the visitor's current selection.
  function compute(sizeOverride){
    const tariff = state.type==='res' ? SOLAR.tariffResidential : SOLAR.tariffCommercial;
    const size = sizeOverride === undefined ? state.size : sizeOverride;
    const gen = size * SOLAR.yield;   // kWh/yr

    // You can only save money on power you would otherwise have bought.
    const selfKwh = Math.min(gen, usableLoadKwh());
    const exportKwh = Math.max(gen - selfKwh, 0);

    // Export payment only under the residential rooftop scheme (≤5 kW).
    const eligibleExport = (state.type==='res' && size <= SOLAR.exportMaxKw) ? exportKwh : 0;

    let cost = costForSize(size);
    // Traced a garden or a plot rather than a roof? It costs more to build.
    if(state.roofLimit && state.roofLimit.kind === 'ground') cost *= SOLAR.groundCostFactor;
    if(state.battery) cost += size * SOLAR.batteryPerKw;

    const yr1 = selfKwh*tariff + eligibleExport*SOLAR.exportRate;
    const payback = yr1 > 0 ? cost/yr1 : 0;

    // 25-year total with degradation + tariff inflation
    let total = 0;
    for(let y=0;y<SOLAR.horizonYears;y++){
      const deg = Math.pow(1-SOLAR.panelDegradation, y);
      const inf = Math.pow(1+SOLAR.tariffInflation, y);
      total += (selfKwh*tariff*inf + eligibleExport*SOLAR.exportRate*inf) * deg;
    }

    const oldMonthly = state.bill;
    const newMonthly = Math.max(oldMonthly - (selfKwh*tariff)/12, 0);

    // Units that earn nothing: generated, not self-consumed, not paid for.
    const wasted = Math.max(gen - selfKwh - eligibleExport, 0);

    return { gen, cost, yr1, payback, total, newMonthly, size, selfKwh, exportKwh,
             eligibleExport, wasted };
  }

  function render(){
    const r = compute();
    el('r-saving').textContent  = fmtTHB(r.yr1);
    el('r-cost').textContent    = fmtTHB(r.cost);
    el('r-payback').textContent = r.payback>0 ? fmtNum(r.payback,1)+' '+I18n.t('calc.r.years') : '—';
    el('r-gen').textContent     = fmtNum(r.gen)+' kWh';
    el('r-bill').textContent    = fmtTHB(r.newMonthly);
    el('r-25').textContent      = fmtTHB(r.total);

    el('v-bill').textContent = fmtTHB(state.bill);
    el('v-size').textContent = fmtNum(state.size,1).replace('.0','')+' kWp';

    /* --- Is this a system we would actually sell them? -------------------
       The maths above will happily price an array four times bigger than the
       customer's demand and report a 40-year payback with a straight face.
       That is technically correct and commercially useless, so say what has
       gone wrong and offer the size we would really quote. */
    const rec  = recommendedSize();
    const warn = el('calc-warn');
    let warnShown = false;
    if(warn){
      const kwp = n => fmtNum(n,1).replace('.0','') + ' kWp';
      let msg = null, fixTo = null;

      // The 5 kW cliff first — it is the more specific and more costly error.
      // Crossing it doesn't taper the export payment, it removes it entirely,
      // so a bigger array can be worth dramatically LESS.
      if(state.type === 'res' && state.size > SOLAR.exportMaxKw && r.wasted > 0){
        const alt = compute(SOLAR.exportMaxKw);
        if(alt.yr1 > r.yr1){
          msg = tf('calc.warn.cliff', {
            cap: kwp(SOLAR.exportMaxKw), wasted: fmtNum(r.wasted),
            altSave: fmtTHB(alt.yr1),  save: fmtTHB(r.yr1),
            altCost: fmtTHB(alt.cost), cost: fmtTHB(r.cost)
          });
          fixTo = SOLAR.exportMaxKw;
        }
      }
      // Otherwise: generating far more than they can use or be paid for.
      if(!msg && r.gen > 0 && r.wasted / r.gen > 0.25){
        msg = tf('calc.warn.oversized', {
          gen: fmtNum(r.gen), self: fmtNum(r.selfKwh),
          wasted: fmtNum(r.wasted), rec: kwp(rec)
        });
        fixTo = rec;
      }

      warn.hidden = !msg;
      warnShown = !!msg;
      if(msg){
        warn.querySelector('.calc-warn-text').textContent = msg;
        const btn = warn.querySelector('button');
        btn.textContent = tf('calc.warn.fix', {size: kwp(fixTo)});
        btn.onclick = () => {
          state.size = fixTo;
          // Track the recommendation again from here, rather than leaving a
          // stale manual value to drift as the bill changes.
          state.sizeTouched = false;
          sizeEl.value = state.size;
          render();
        };
      }
    }

    // Always show what we'd recommend, so a manually-set size can never sit
    // there looking authoritative after the bill has moved underneath it.
    const recEl = el('v-rec');
    if(recEl){
      // Suppressed while the warning is up: that carries its own, more
      // specific call to action, and two different suggested sizes on screen
      // at once just makes the visitor distrust both.
      const differs = Math.abs(rec - state.size) > 0.01 && !warnShown;
      recEl.hidden = !differs;
      if(differs){
        recEl.querySelector('span').textContent =
          tf('calc.rec', {rec: fmtNum(rec,1).replace('.0','') + ' kWp'});
        recEl.querySelector('button').onclick = () => {
          state.size = rec; state.sizeTouched = false; sizeEl.value = rec; render();
        };
      }
    }

    // Where the roof, not the bill, is the limiting factor — say it plainly.
    const note = document.getElementById('calc-roofnote');
    if(note){
      const rl = state.roofLimit;
      if(rl){
        const load = loadDrivenSize();
        const kwp  = fmtNum(rl.kwp,1).replace('.0','');
        note.hidden = false;
        note.textContent = rl.kwp < load
          ? tf('calc.roof.capped', {load: fmtNum(load,1).replace('.0',''),
                                    roof: kwp, area: fmtNum(rl.area)})
          : tf('calc.roof.fits',   {roof: kwp, area: fmtNum(rl.area)});
      } else {
        note.hidden = true;
      }
    }

    // Carry the estimate into the quote form so sales gets context
    const ctx = document.getElementById('calc-context');
    if(ctx){
      ctx.value = `${state.type==='res'?'Home':'Business'} · bill ~${fmtBaht(state.bill)}/mo · ` +
                  `${fmtNum(state.size,1).replace('.0','')} kWp${state.battery?' + battery':''} · ` +
                  `usage ${state.usage} · est. saving ${fmtBaht(r.yr1)}/yr` +
                  (Money.code !== 'THB' ? ` · viewing in ${Money.code}` : '') +
                  (state.roofLimit
                    ? ` · traced roof ${fmtNum(state.roofLimit.area)} m² (${state.roofLimit.kind}), ` +
                      `fits ~${fmtNum(state.roofLimit.kwp,1).replace('.0','')} kWp`
                    : '');
    }
  }

  // Called by the roof tracing tool (assets/js/roof.js). Pass null to clear.
  window.Calc = {
    setRoofLimit(limit){
      state.roofLimit = limit;
      if(!state.sizeTouched){ state.size = recommendedSize(); sizeEl.value = state.size; }
      // A traced roof is hard information — let it pull an over-ambitious
      // manual size back down rather than leaving an impossible number up.
      else if(limit && state.size > limit.kwp){ state.size = Math.max(limit.kwp,1); sizeEl.value = state.size; }
      render();
    }
  };

  // Segmented controls
  root.querySelectorAll('[data-seg]').forEach(group => {
    group.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        const key = group.dataset.seg;
        state[key] = b.dataset.val;
        if(key === 'type'){
          sizeEl.max = state.type==='res' ? 20 : 100;
          if(!state.sizeTouched){ state.size = recommendedSize(); sizeEl.value = state.size; }
        }
        if(key === 'usage' && !state.sizeTouched){ state.size = recommendedSize(); sizeEl.value = state.size; }
        render();
      });
    });
  });

  billEl.addEventListener('input', () => {
    state.bill = +billEl.value;
    if(!state.sizeTouched){ state.size = recommendedSize(); sizeEl.value = state.size; }
    render();
  });
  sizeEl.addEventListener('input', () => { state.sizeTouched = true; state.size = +sizeEl.value; render(); });
  if(batteryEl) batteryEl.addEventListener('change', () => { state.battery = batteryEl.checked; render(); });

  // Currency picker — display only. Everything is computed in baht.
  const curEl = el('c-currency');
  if(curEl){
    curEl.innerHTML = CURRENCY.list
      .map(c => `<option value="${c}">${c}</option>`).join('');
    curEl.value = Money.code;
    curEl.addEventListener('change', () => Money.set(curEl.value));
  }

  document.addEventListener('langchange', render);
  document.addEventListener('currencychange', () => {
    if(curEl) curEl.value = Money.code;
    const nb = el('calc-fx');
    if(nb) nb.hidden = Money.code === 'THB';
    render();
  });

  const fxNote = el('calc-fx');
  if(fxNote) fxNote.hidden = Money.code === 'THB';

  state.size = recommendedSize(); sizeEl.value = state.size;
  render();
}

/* --- Lead forms ----------------------------------------------------------- */
function initForms(){
  document.querySelectorAll('form.lead-form').forEach(form => {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const d = new FormData(form);
      const note = form.querySelector('.form-note');
      if(!d.get('first') || !d.get('email')){
        if(note){ note.textContent = I18n.t('form.err'); note.style.color = '#b3261e'; }
        return;
      }
      const lines = [
        'New enquiry from taesolar.net', '',
        'Name: ' + (d.get('first')||'') + ' ' + (d.get('last')||''),
        'Email: ' + (d.get('email')||''),
        'Phone / LINE: ' + (d.get('phone')||'—'),
        'Area: ' + (d.get('location')||'—'),
        'Property type: ' + (d.get('ptype')||'—'),
        'Service: ' + (d.get('service')||'—'),
        'Monthly bill: ' + (d.get('bill')||'—'),
        d.get('calccontext') ? 'Calculator estimate: ' + d.get('calccontext') : '',
        '', 'Message:', (d.get('message')||'—'),
        '', 'Page: ' + location.href
      ].filter(Boolean).join('\n');

      const subject = 'Solar enquiry — ' + (d.get('first')||'') + ' ' + (d.get('last')||'');
      window.location.href = 'mailto:info@taesolar.net?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines);

      const ok = form.querySelector('.form-ok');
      if(ok){ ok.hidden = false; ok.textContent = I18n.t('form.ok'); }
    });
  });
}

/* --- Chrome: header, nav, reveal ------------------------------------------ */
function initChrome(){
  const header = document.querySelector('header.site');
  if(header && !header.classList.contains('solid')){
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const scrim = document.getElementById('scrim');
  if(burger && nav && scrim){
    const toggle = open => {
      nav.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      scrim.classList.toggle('show', open);
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => toggle(!nav.classList.contains('open')));
    scrim.addEventListener('click', () => toggle(false));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if(e.key === 'Escape') toggle(false); });
  }

  const els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.08, rootMargin:'0px 0px -6% 0px'});
    els.forEach(el => io.observe(el));
    setTimeout(() => els.forEach(el => el.classList.add('in')), 2500); // safety net
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  const yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  if(typeof I18n !== 'undefined') I18n.init();
  Money.init();
  initChrome();
  initCalculator();
  initForms();
});
