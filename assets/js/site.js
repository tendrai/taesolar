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

function fmtTHB(n){
  return '฿' + Math.round(n).toLocaleString('en-US');
}
function fmtNum(n, dp){
  return Number(n).toLocaleString('en-US', {minimumFractionDigits:dp||0, maximumFractionDigits:dp||0});
}

/* --- Calculator ----------------------------------------------------------- */
function initCalculator(){
  const root = document.getElementById('calc');
  if(!root) return;

  const el = id => root.querySelector('#'+id);
  const state = { type:'res', bill:4000, size:5, usage:'mixed', battery:false, sizeTouched:false };

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
  function recommendedSize(){
    const ideal = usableLoadKwh() / SOLAR.yield;
    return Math.min(Math.max(Math.round(ideal*2)/2, 1), state.type==='res' ? 20 : 100);
  }

  function compute(){
    const tariff = state.type==='res' ? SOLAR.tariffResidential : SOLAR.tariffCommercial;
    const size = state.size;
    const gen = size * SOLAR.yield;   // kWh/yr

    // You can only save money on power you would otherwise have bought.
    const selfKwh = Math.min(gen, usableLoadKwh());
    const exportKwh = Math.max(gen - selfKwh, 0);

    // Export payment only under the residential rooftop scheme (≤5 kW).
    const eligibleExport = (state.type==='res' && size <= SOLAR.exportMaxKw) ? exportKwh : 0;

    let cost = costForSize(size);
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

    return { gen, cost, yr1, payback, total, newMonthly, size };
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

    // Carry the estimate into the quote form so sales gets context
    const ctx = document.getElementById('calc-context');
    if(ctx){
      ctx.value = `${state.type==='res'?'Home':'Business'} · bill ~${fmtTHB(state.bill)}/mo · ` +
                  `${fmtNum(state.size,1).replace('.0','')} kWp${state.battery?' + battery':''} · ` +
                  `usage ${state.usage} · est. saving ${fmtTHB(r.yr1)}/yr`;
    }
  }

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

  document.addEventListener('langchange', render);
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
  initChrome();
  initCalculator();
  initForms();
});
