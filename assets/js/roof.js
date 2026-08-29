/* ==========================================================================
   TAE SOLAR — Roof tracing tool
   --------------------------------------------------------------------------
   Satellite view + tap-to-trace polygon -> real roof area -> how much array
   that roof can physically carry.

   DESIGN NOTE, deliberately: this measures the roof, it does not guess it.
   The area comes from coordinates the customer traced themselves, not from a
   model's opinion about a photograph. That keeps it in the same register as
   the savings calculator — conservative, checkable, and honest about what it
   does not know. Everything it cannot see (shading, obstructions, roof
   condition, which faces point where) stays flagged as a survey question.
   ========================================================================== */

/* --------------------------------------------------------------------------
   ROOF ASSUMPTIONS  ***EDIT THESE IN ONE PLACE***
   -------------------------------------------------------------------------- */
const ROOF = {
  // A typical modern mono panel. 1.134 x 1.722 m ≈ 1.95 m², 550 W.
  panelW: 1.134,
  panelH: 1.722,
  panelWatts: 550,

  // What share of the traced footprint can actually carry panels.
  //
  // Pitched (0.55): at 8°N the orientation penalty is small — a low-tilt
  // array on a north-facing pitch still returns within about 10% of a
  // south-facing one, so unlike in Europe you are not writing off half the
  // roof on aspect alone. What you do lose is edge setbacks, ridge and valley
  // clearance, vents, and the water tank almost every Thai house carries.
  //
  // Flat (0.70): low tilt also means rows self-shade less and can be packed
  // tighter than they could further north — but you still need walkway and
  // maintenance access, plus plant and parapet clearance.
  //
  // Ground (0.45): a garden or plot is the loosest packing of the three. Rows
  // have to be spaced so they don't shade each other, with access between them
  // for cleaning and maintenance, boundary setbacks, and somewhere to put the
  // inverters and switchgear. Low tilt near the equator lets rows sit closer
  // than they could in Europe, but on a domestic-sized garden — irregular
  // shape, trees, the house itself — under half the plot is the honest figure.
  // A large open field would do better than this; a survey will say.
  usableFraction: { pitched: 0.55, flat: 0.70, ground: 0.45 },

  // Kathu, Phuket — the TAE Solar office. Sensible place to open the map.
  defaultCenter: [7.9109, 98.3381],
  defaultZoom: 18,
  minZoom: 11,
  maxZoom: 21,

  // Below this the trace is almost certainly a mis-tap, not a roof.
  minAreaM2: 8
};

/* --------------------------------------------------------------------------
   ADDRESS SEARCH  ***EDIT THESE IN ONE PLACE***
   -------------------------------------------------------------------------- */
const GEOCODE = {
  // 'nominatim' needs no key and works today. 'google' and 'mapbox' need a
  // key and a billing account — set `provider` and `key` and nothing else has
  // to change. See README §4b before switching.
  provider: 'nominatim',
  key: '',

  countryCodes: 'th',   // customers are searching Thai addresses
  limit: 5,
  zoomOnPick: 20,

  // Nominatim's usage policy caps you at one request per second. We only ever
  // search on submit — never as-you-type, which their policy forbids outright
  // — so this is a backstop rather than something a visitor will hit.
  minInterval: 1100
};

const GEOCODERS = {
  nominatim: {
    credit: 'OpenStreetMap / Nominatim',
    url(q, lang){
      return 'https://nominatim.openstreetmap.org/search?format=json&limit=' + GEOCODE.limit +
             '&countrycodes=' + GEOCODE.countryCodes +
             '&accept-language=' + encodeURIComponent(lang) +
             '&q=' + encodeURIComponent(q);
    },
    parse(j){
      return (j || []).map(r => ({ label: r.display_name, lat: +r.lat, lon: +r.lon }));
    }
  },
  google: {
    credit: 'Google',
    url(q, lang){
      return 'https://maps.googleapis.com/maps/api/geocode/json?key=' + GEOCODE.key +
             '&components=country:' + GEOCODE.countryCodes +
             '&language=' + encodeURIComponent(lang) +
             '&address=' + encodeURIComponent(q);
    },
    parse(j){
      return ((j && j.results) || []).slice(0, GEOCODE.limit).map(r => ({
        label: r.formatted_address,
        lat: r.geometry.location.lat,
        lon: r.geometry.location.lng
      }));
    }
  },
  mapbox: {
    credit: 'Mapbox',
    url(q, lang){
      return 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(q) +
             '.json?access_token=' + GEOCODE.key +
             '&country=' + GEOCODE.countryCodes +
             '&limit=' + GEOCODE.limit +
             '&language=' + encodeURIComponent(lang);
    },
    parse(j){
      return ((j && j.features) || []).map(f => ({
        label: f.place_name, lat: f.center[1], lon: f.center[0]
      }));
    }
  }
};

/* --------------------------------------------------------------------------
   Geometry
   -------------------------------------------------------------------------- */

/* Planar area of a lat/lng ring, in m².
   Projects onto a local equirectangular plane centred on the ring, then runs
   the shoelace formula. At building scale (tens of metres) the error from
   ignoring curvature is far below the error in the customer's tracing, so the
   extra machinery of a proper geodesic area buys nothing here. */
function polygonAreaM2(ring){
  if(!ring || ring.length < 3) return 0;
  const R = 6378137; // WGS-84 equatorial radius
  const rad = Math.PI / 180;
  const lat0 = ring.reduce((s,p) => s + p.lat, 0) / ring.length;
  const cos0 = Math.cos(lat0 * rad);

  const pts = ring.map(p => [R * p.lng * rad * cos0, R * p.lat * rad]);
  let a = 0;
  for(let i = 0, n = pts.length; i < n; i++){
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

/* Footprint -> what the roof can carry.
   Panel count is floored, because you cannot install two thirds of a panel. */
function roofCapacity(areaM2, kind){
  const frac = ROOF.usableFraction[kind] || ROOF.usableFraction.pitched;
  const usable = areaM2 * frac;
  const panelArea = ROOF.panelW * ROOF.panelH;
  const panels = Math.floor(usable / panelArea);
  const kwp = Math.round((panels * ROOF.panelWatts / 1000) * 2) / 2; // to 0.5 kWp
  return { usable, panels, kwp, frac };
}

/* --------------------------------------------------------------------------
   The tool
   -------------------------------------------------------------------------- */
function initRoof(){
  const root = document.getElementById('roof');
  if(!root || typeof L === 'undefined') return;

  const el = id => root.querySelector('#' + id);
  const mapEl = el('roof-map');
  if(!mapEl) return;

  const state = { points: [], kind: 'pitched' };

  const map = L.map(mapEl, {
    center: ROOF.defaultCenter,
    zoom: ROOF.defaultZoom,
    minZoom: ROOF.minZoom,
    maxZoom: ROOF.maxZoom,
    zoomControl: true,
    // The map is tall and sits mid-page, so a plain wheel scroll must keep
    // scrolling the page. Left on, the wheel silently zooms instead and the
    // visitor's view jumps away from the roof they were tracing.
    scrollWheelZoom: false,
    // Tracing means tapping corners in quick succession, and two quick taps
    // near each other are a normal part of that — not a request to zoom.
    // Left on, the second corner is swallowed and the map jumps a level.
    doubleClickZoom: false
  });

  // Cooperative gesture: ctrl/⌘ + wheel zooms, plain wheel scrolls the page
  // and shows a one-off hint explaining why nothing zoomed.
  const hint = document.createElement('div');
  hint.className = 'roof-hint';
  hint.setAttribute('aria-hidden', 'true');
  mapEl.appendChild(hint);
  let hintTimer = null;

  mapEl.addEventListener('wheel', e => {
    if(e.ctrlKey || e.metaKey){
      e.preventDefault();
      map.setZoomAround(
        map.mouseEventToContainerPoint(e),
        map.getZoom() - Math.sign(e.deltaY)
      );
      return;
    }
    hint.textContent = I18n.t('roof.hint.zoom');
    hint.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.remove('show'), 1600);
  }, { passive: false });

  // Esri World Imagery: high-resolution satellite basemap that needs no API
  // key or billing account, so this ships today. Attribution is required by
  // their terms and is rendered bottom-right — do not remove it.
  // If you later move to Google or Mapbox tiles, this is the only line to
  // change (plus the attribution).
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: ROOF.maxZoom,
    maxNativeZoom: 19,
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
  }).addTo(map);

  const poly = L.polygon([], {
    color: '#FFC220', weight: 3, opacity: 1,
    fillColor: '#FFC220', fillOpacity: 0.25
  }).addTo(map);

  const handleIcon = L.divIcon({ className: 'roof-handle', iconSize: [16, 16] });
  let handles = [];

  function redraw(){
    poly.setLatLngs(state.points);

    handles.forEach(h => map.removeLayer(h));
    handles = state.points.map((pt, i) => {
      const m = L.marker(pt, { icon: handleIcon, draggable: true, keyboard: false });
      m.on('drag',    e => { state.points[i] = e.target.getLatLng(); poly.setLatLngs(state.points); });
      m.on('dragend', render);
      // Tapping a handle removes it — the quickest way to fix an overshoot.
      m.on('click', ev => {
        L.DomEvent.stop(ev);
        state.points.splice(i, 1);
        redraw(); render();
      });
      return m.addTo(map);
    });
  }

  function render(){
    const area = polygonAreaM2(state.points);
    const valid = state.points.length >= 3 && area >= ROOF.minAreaM2;
    const cap = roofCapacity(area, state.kind);

    root.classList.toggle('has-trace', valid);
    el('roof-empty').hidden = valid;
    el('roof-out').hidden = !valid;

    el('r-area').textContent   = fmtNum(area) + ' m²';
    el('r-usable').textContent = fmtNum(cap.usable) + ' m²';
    el('r-panels').textContent = fmtNum(cap.panels);
    el('r-kwp').textContent    = fmtNum(cap.kwp, 1).replace('.0', '') + ' kWp';

    el('roof-undo').disabled  = state.points.length === 0;
    el('roof-clear').disabled = state.points.length === 0;

    // Hand the ceiling to the calculator below, which sizes to the bill.
    // Whichever of the two is smaller is the real answer.
    if(window.Calc && typeof window.Calc.setRoofLimit === 'function'){
      window.Calc.setRoofLimit(valid ? { kwp: cap.kwp, area: area, kind: state.kind } : null);
    }
  }

  map.on('click', e => {
    state.points.push(e.latlng);
    redraw(); render();
  });

  el('roof-undo').addEventListener('click', () => {
    state.points.pop(); redraw(); render();
  });
  el('roof-clear').addEventListener('click', () => {
    state.points = []; redraw(); render();
  });

  root.querySelectorAll('[data-seg="roofkind"] button').forEach(b => {
    b.addEventListener('click', () => {
      root.querySelectorAll('[data-seg="roofkind"] button')
          .forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      state.kind = b.dataset.val;
      render();
    });
  });

  /* --- Address search ----------------------------------------------------
     Search on submit only, never as-you-type: Nominatim's usage policy
     forbids client-side autocomplete against it, and typing "12 Thalang
     Road" would fire a dozen requests to answer one question. */
  const qEl    = el('roof-q');
  const qBtn   = el('roof-qbtn');
  const qList  = el('roof-results');
  const qNote  = el('roof-qnote');

  if(qEl && qBtn && qList){
    let lastCall = 0, inflight = null, results = [], active = -1;

    function closeResults(){
      qList.hidden = true; qList.innerHTML = ''; results = []; active = -1;
      qEl.setAttribute('aria-expanded', 'false');
    }

    function highlight(i){
      const items = qList.querySelectorAll('button');
      if(!items.length) return;
      active = (i + items.length) % items.length;
      items.forEach((b, n) => b.classList.toggle('on', n === active));
      items[active].scrollIntoView({ block: 'nearest' });
    }

    function pick(r){
      map.setView([r.lat, r.lon], GEOCODE.zoomOnPick);
      closeResults();
      qNote.textContent = '';
    }

    function showResults(list){
      results = list;
      qList.innerHTML = '';
      list.forEach(r => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = r.label;
        b.addEventListener('click', () => pick(r));
        qList.appendChild(b);
      });
      const credit = document.createElement('span');
      credit.className = 'roof-credit';
      credit.textContent = (GEOCODERS[GEOCODE.provider] || {}).credit || '';
      qList.appendChild(credit);
      qList.hidden = false;
      qEl.setAttribute('aria-expanded', 'true');
      active = -1;
    }

    async function search(){
      const q = qEl.value.trim();
      if(q.length < 3){ qNote.textContent = I18n.t('roof.search.short'); return; }

      const wait = GEOCODE.minInterval - (Date.now() - lastCall);
      if(wait > 0) await new Promise(r => setTimeout(r, wait));
      lastCall = Date.now();

      const impl = GEOCODERS[GEOCODE.provider];
      if(!impl){ qNote.textContent = I18n.t('roof.search.error'); return; }

      if(inflight) inflight.abort();
      inflight = new AbortController();

      closeResults();
      qBtn.disabled = true;
      qNote.textContent = I18n.t('roof.search.searching');
      try {
        const res = await fetch(impl.url(q, I18n.lang), { signal: inflight.signal });
        if(!res.ok) throw new Error('HTTP ' + res.status);
        // Geocoders routinely return the same place twice (e.g. the village
        // and its administrative boundary). Two identical-looking rows just
        // make the visitor hesitate, so keep the first of each.
        const seen = new Set();
        const list = impl.parse(await res.json()).filter(r => {
          const key = r.label.toLowerCase();
          if(seen.has(key)) return false;
          seen.add(key); return true;
        });
        if(!list.length){ qNote.textContent = I18n.t('roof.search.none'); return; }
        qNote.textContent = '';
        showResults(list);
      } catch(err){
        if(err.name !== 'AbortError') qNote.textContent = I18n.t('roof.search.error');
      } finally {
        qBtn.disabled = false;
        inflight = null;
      }
    }

    qBtn.addEventListener('click', search);
    qEl.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        e.preventDefault();
        if(active >= 0 && results[active]) pick(results[active]); else search();
      }
      else if(e.key === 'ArrowDown'){ e.preventDefault(); highlight(active + 1); }
      else if(e.key === 'ArrowUp'){   e.preventDefault(); highlight(active - 1); }
      else if(e.key === 'Escape'){    closeResults(); }
    });
    document.addEventListener('click', e => {
      if(!qList.hidden && !qList.contains(e.target) && e.target !== qEl) closeResults();
    });
  }

  // Geolocation as well as search: no key needed, and most people filling
  // this in are at the property or live there.
  const locBtn = el('roof-locate');
  if(locBtn){
    locBtn.addEventListener('click', () => {
      const note = el('roof-locnote');
      if(!navigator.geolocation){
        if(note) note.textContent = I18n.t('roof.loc.unsupported');
        return;
      }
      locBtn.disabled = true;
      if(note) note.textContent = I18n.t('roof.loc.finding');
      navigator.geolocation.getCurrentPosition(
        pos => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 20);
          locBtn.disabled = false;
          if(note) note.textContent = '';
        },
        () => {
          locBtn.disabled = false;
          if(note) note.textContent = I18n.t('roof.loc.failed');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  document.addEventListener('langchange', render);

  // Leaflet needs a nudge when it is laid out inside a container that was
  // still settling (fonts, reveal animation) at construction time.
  setTimeout(() => map.invalidateSize(), 200);

  render();
}

document.addEventListener('DOMContentLoaded', initRoof);
