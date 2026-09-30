const { useComposition, animate, interpolate, Easing, clamp } = window;

const TAGS = [
  { y: '1980s', t: 'Data Dictionary', q: 'Document what the data means' },
  { y: '1990s', t: 'Enterprise Data Integration', q: 'Connect the data' },
  { y: '1990s', t: 'Data Transformation', q: 'Transform into the form you need' },
  { y: '2000s', t: 'Master Data Management', q: 'Create the master record' },
  { y: '2000s', t: 'Golden Source', q: 'Establish the authoritative source' },
  { y: '2000s', t: '360° View', q: 'See everything about the entity' },
  { y: '2000s', t: 'Enterprise Taxonomy', q: 'Organize into a common language' },
  { y: '2010s', t: 'Entity Resolution', q: "Determine what's the same" },
  { y: '2010s', t: 'Data Governance', q: 'Control how data is used' },
  { y: '2010s', t: 'Data Catalog', q: 'Know what data you have' },
  { y: '2010s', t: 'Data Quality', q: 'Make the data trustworthy' },
  { y: '2010s', t: 'Data Lineage', q: 'Know where it came from' },
  { y: '2010s', t: 'Data Virtualization', q: 'See it without moving it' },
  { y: '2010s', t: 'Data Fabric', q: 'Connect it wherever it lives' },
  { y: '2010s', t: 'Data Mesh', q: 'Put ownership in the domain' },
  { y: '2010s', t: 'Data Orchestration', q: 'Coordinate how data moves' },
  { y: '2020s', t: 'Data Products', q: 'Package it for consumption' },
  { y: '2020s', t: 'Data Marketplace', q: 'Discover and consume reusable data' },
  { y: '2023', t: 'Semantic Layer', q: 'Translate data into business terms' },
  { y: '2024', t: 'Knowledge Graph', q: 'Connect entities and relationships' },
  { y: '2025', t: 'Ontology', q: 'Model the enterprise' },
  { y: '2026', t: 'Context Layer', q: 'Give AI proper context' }
];

const FRAMES = [
  { id: 'a', text: '30 years of buzzwords' },
  { id: 'b', text: 'The same unsolved problem' },
  { id: 'c', text: 'What does the data mean?' }
];

// deterministic per-tag placement
const rnd = (i, salt) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const MOTION = {
  fly: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInQuad }),
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  out: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutSine })
};

// Every term leaves the exact centre of the frame as a near-point and travels
// out to its own resting cell, where it stays — so by the end all 26 are on
// screen at once, radiating from the middle. Cells come from a 6x5 grid sorted
// by distance from centre, which guarantees they never overlap.
const HOLD = 0;       // no pause at the centre: it appears already moving out

// smootherstep: zero velocity AND zero acceleration at both ends, so a block
// eases off the centre instead of snapping to full speed the way an ease-out does
const ramp = (t, from, dur) => {
  const x = clamp((t - from) / dur, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const CELLS = (() => {
  const COLS = 6, ROWS = 5, CW = 1548 / COLS, CH = 852 / ROWS;
  const out = [];
  for (let r = 0; r < ROWS; r++) {
    // brick-stagger the odd rows so the settled field never reads as a table
    const odd = r % 2 === 1;
    const cols = odd ? COLS - 1 : COLS;
    const shift = odd ? CW / 2 : 0;
    for (let c = 0; c < cols; c++) {
      const n = r * COLS + c;
      // jitter kept inside the slack a 200px block leaves in a 258px cell, so
      // neighbours cannot collide
      const x = (c + 0.5) * CW - 774 + shift + (rnd(n, 31) - 0.5) * 16;
      const y = (r + 0.5) * CH - 426 + (rnd(n, 32) - 0.5) * 58;
      // only the centre box itself is off limits — a resting term must not sit
      // under an arriving one, but everything past that can crowd in
      if (Math.abs(y) < 80 && Math.abs(x) < 215) continue;
      out.push({ x, y, d: Math.hypot(x, y * 1.6) });
    }
  }
  // Keep exactly as many cells as there are terms, dropping the FURTHEST
  // surplus — otherwise the unused cells are the ones nearest the middle and
  // the field ends with an empty ring around Context Layer. Then furthest
  // first, so the field crowds inward.
  const need = TAGS.length - 1;
  return out.sort((p, q) => p.d - q.d).slice(0, need).reverse();
})();

const DMAX = CELLS.length ? CELLS[0].d : 1;
const travelFor = cell => 1.4 + 1.0 * (cell.d / DMAX);

// --- self-timing cadence -------------------------------------------------
// A term leaves the centre the moment the previous one has geometrically
// cleared it, so the stream is continuous instead of paced by a fixed gap.
const CX = 158, CY = 62;          // half-size of a term at centre (1.4 scale)
const invRamp = target => {
  let lo = 0, hi = 1;
  for (let k = 0; k < 22; k++) {
    const m = (lo + hi) / 2;
    (m * m * m * (m * (m * 6 - 15) + 10) < target) ? (lo = m) : (hi = m);
  }
  return (lo + hi) / 2;
};
// bezier(.66,0,.36,1) sampled — barely moves for the first fifth of the flight,
// which is the window in which the term is readable at the centre
const bez = p => {
  const cy = t => 3 * t * (1 - t) * (1 - t) * 0 + 3 * t * t * (1 - t) * 1 + t * t * t;
  const cx = t => 3 * t * (1 - t) * (1 - t) * 0.66 + 3 * t * t * (1 - t) * 0.36 + t * t * t;
  let lo = 0, hi = 1;
  for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; cx(m) < p ? (lo = m) : (hi = m); }
  return cy((lo + hi) / 2);
};
const clearTime = cell => {
  for (let p = 0.02; p <= 1; p += 0.02) {
    const e = bez(p);
    const sc = 1.4 - e * 0.55;
    if (Math.abs(cell.x * e) > 100 * sc + CX || Math.abs(cell.y * e) > 44 * sc + CY) {
      return invRamp(e) * travelFor(cell);
    }
  }
  return travelFor(cell);
};
const STARTS = (() => {
  let acc = 0;
  return TAGS.map((_, i) => {
    const at = acc;
    const cell = i === TAGS.length - 1 ? { x: 0, y: 0 } : CELLS[i];
    // 0.62 of full geometric clearance: the next term starts emerging while the
    // previous is still moving off, which is what keeps the stream continuous
    // spacing between departures — no term pauses, this only sets the cadence
    // cadence accelerates exponentially after the opening term: each gap is
    // ~13% shorter than the last, floored so the tail stays legible
    const accel = i === 0 ? 1 : Math.max(0.2, Math.pow(0.87, i - 1));
    acc += (i === 0 ? 1.15 : 0.12 * accel) + clearTime(cell) * 0.55 * accel;
    return at;
  });
})();


// ---- swarm --------------------------------------------------------------
// The swarm is mounted ONCE and then never re-rendered: every term's whole
// flight (fade in, hold, drift, cool to blue) is authored as a CSS @keyframes
// rule and handed to the compositor. React does no per-frame work here, so the
// motion is interpolated by the browser rather than sampled by the render loop
// — which is what the stutter was: 26 subtrees rebuilt each frame with a new
// inline transform and three fresh rgb() strings apiece.
const FLIGHTS = TAGS.map((tag, i) => {
  const last = i === TAGS.length - 1;
  const cell = last ? { x: 0, y: 0 } : CELLS[i];
  const travel = last ? 2.2 : travelFor(cell);
  return { tag, i, last, cell, travel, start: STARTS[i], total: HOLD + travel };
});

// Transform and fade live on SEPARATE layers. The flight keyframe declares the
// transform at 0% and 100% only, so the browser eases it as ONE uninterrupted
// curve — an intermediate opacity keyframe used to chop that curve in two,
// which is what read as a stutter at the start of every flight.
// white at the point, cooling to blue as it recedes
const COOL = e => {
  const k = clamp(e / 0.55, 0, 1);
  const r = Math.round(255 + (69 - 255) * k);
  const g = Math.round(255 + (123 - 255) * k);
  const b = Math.round(255 + (204 - 255) * k);
  return `rgb(${r},${g},${b})`;
};

// Every flight is evaluated from the timeline clock T in render, so what is on
// screen is a pure function of the playhead — nothing is anchored to a mount
// time, which is what let a scrub or reload blank the field. The slow idle
// float stays a CSS loop (it is phase-only, so it cannot desync).
const SWARM_CSS = FLIGHTS.map(function (f) {
  var ex = f.last ? 0 : f.cell.x, ey = f.last ? 0 : f.cell.y;
  var s1 = 1.15;   // every term rests at the same size, Context Layer included
  return '@keyframes tr' + f.i + '{0%{transform:translate3d(0,0,0) scale(1.4)}100%{transform:translate3d('
    + ex.toFixed(1) + 'px,' + ey.toFixed(1) + 'px,0) scale(' + s1 + ')}}' +
    '\n@keyframes fd' + f.i + '{0%{opacity:0;color:#ffffff}7%{opacity:1;color:#ffffff}20%{color:#ffffff}58%{color:#457bcc}100%{opacity:1;color:#457bcc}}';
}).join('\n') +
'\n@keyframes bzShudder{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(4px,-3px,0)}50%{transform:translate3d(-7px,4px,0)}75%{transform:translate3d(8px,-5px,0)}100%{transform:translate3d(-5px,5px,0)}}' +
'\n@keyframes bzStrobe{0%{filter:none}30%{filter:brightness(1.6) saturate(.35)}60%{filter:brightness(.55)}100%{filter:none}}';

const SWARM_SPAN = FLIGHTS.reduce(function (n, f) { return Math.max(n, f.start + f.total); }, 0);

// The field is built ONCE as a constant element tree: every term's flight is a
// CSS animation with its own delay, so the compositor runs the whole sequence
// and React never touches a term again. Swarm only animates the wrapper's
// opacity, and because FIELD is the same element reference every frame React
// bails out of the subtree entirely — no per-frame reconciliation, no jerk.
const FIELD = (
  <React.Fragment>
    <style dangerouslySetInnerHTML={{ __html: SWARM_CSS }} />
    {FLIGHTS.map(function (f) {
      const delay = f.start.toFixed(2) + 's';
      const dur = f.total.toFixed(2) + 's';
      return (
        <div key={f.i} style={{
          position: 'absolute', left: '50%', top: '50%', whiteSpace: 'nowrap', willChange: 'transform',
          animation: 'tr' + f.i + ' ' + dur + ' cubic-bezier(.66,0,.36,1) both',
          animationDelay: delay
        }}>
          <div style={{
            transform: 'translate(-50%,-50%)', textAlign: 'center', willChange: 'opacity',
            animation: 'fd' + f.i + ' ' + dur + ' linear both',
            animationDelay: delay, color: '#457bcc'
          }}>
            <div style={{
              fontFamily: "'Roboto Mono', ui-monospace, monospace", fontWeight: 400,
              fontSize: '10.5px', letterSpacing: '.16em', lineHeight: 1,
              color: 'inherit', opacity: .5, marginBottom: '5px'
            }}>{f.tag.y}</div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '18px',
              lineHeight: 1.16, color: 'inherit'
            }}>{f.tag.t}</div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '11.5px',
              lineHeight: 1.3, marginTop: '3px', color: 'inherit', opacity: .72
            }}>&ldquo;{f.tag.q}&rdquo;</div>
          </div>
        </div>
      );
    })}
  </React.Fragment>
);

function Swarm({ T, CUES }) {
  // the field is never torn down: it fills, then freezes while the Scrim
  // blackens it and the panels break out of it
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {FIELD}
    </div>
  );
}


// ---- aperture ---------------------------------------------------------
// a small opening at dead centre: the terms are coming out of something
function Hole({ T, CUES }) {
  const on = MOTION.enter(0, 1, CUES.Swarm, CUES.Swarm + 0.8)(T)
    * (1 - MOTION.out(0, 1, CUES.Settle - 0.8, CUES.Settle - 0.2)(T));
  if (on <= 0.001) return null;
  const beat = 0.5 + 0.5 * Math.sin(T * 2.4);
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%', width: '168px', height: '168px',
      marginLeft: '-84px', marginTop: '-84px', opacity: on, pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.11) 0%, rgba(23,132,241,0.07) 34%, rgba(23,132,241,0) 72%)',
        filter: 'blur(7px)', transform: `scale(${(1 + beat * 0.08).toFixed(3)})`
      }}></div>
      <div style={{
        position: 'absolute', left: '51px', top: '51px', width: '66px', height: '66px',
        borderRadius: '50%', background: '#020509',
        border: `1px solid rgba(125,179,238,${(0.16 + beat * 0.14).toFixed(2)})`,
        boxShadow: `inset 0 0 12px rgba(23,132,241,${(0.13 + beat * 0.1).toFixed(2)}), 0 0 ${(9 + beat * 9).toFixed(0)}px rgba(23,132,241,0.15)`
      }}></div>
    </div>
  );
}

function Frames({ T, CUES }) {
  // one burst of neon as a panel breaks out, decaying to a steady low glow —
  // no continuous back-and-forth flicker
  const flash = start => {
    const d = T - start;
    if (d < 0) return 0;
    const strike = Math.exp(-d * 3.1) * (d < 0.3 ? 0.6 + 0.4 * Math.sin(d * 58) : 1);
    return clamp(0.14 + strike, 0, 1);
  };
  const collapse = MOTION.out(1, 0, CUES.Land - 0.1, CUES.Land + 1.2)(T);
  const pull = MOTION.out(0, 1, CUES.Land - 0.1, CUES.Land + 1.2)(T);
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'stretch', justifyContent: 'center',
      gap: '30px', padding: '104px 300px', opacity: collapse
    }}>
      {FRAMES.map((f, i) => {
        const start = CUES.Settle + i * 1.05; // a beat between each panel
        const op = MOTION.enter(0, 1, start, start + 0.4)(T);
        const s = MOTION.enter(0.72, 1, start, start + 0.7)(T);
        const rise = MOTION.enter(26, 0, start, start + 1.3)(T);
        const g = flash(start);
        // a damped swell on impact — the third panel hits hardest
        const imp = Math.max(0, T - (start + 1.2));
        const swell = Math.exp(-imp * 5.2) * Math.sin(imp * 12) * (i === 2 ? 0.06 : 0.03);
        return (
          <div key={f.id} style={{
            flex: '1 1 0', minHeight: 0, width: '100%',
            background: 'rgba(8,13,25,0.72)', borderRadius: '5px',
            border: `1px solid rgba(23,132,241,${(0.22 + g * 0.3).toFixed(3)})`,
            boxShadow: `0 0 ${(8 + g * 14).toFixed(0)}px rgba(23,132,241,${(0.1 + g * 0.16).toFixed(3)})`,
            padding: '18px 32px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            opacity: op,
            transform: `translateY(${rise + pull * 34}px) scale(${s * (1 + swell) * (1 - pull * 0.12)})`
          }}>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '52px',
              lineHeight: 1.2, color: '#fafbfc', whiteSpace: 'pre-line'
            }}>{f.text}</div>
          </div>
        );
      })}
    </div>
  );
}

function Payoff({ T, CUES, authoredTotal }) {
  const LINES = [
    { t: '30 years of buzzwords, the same unsolved problem.', size: 42, w: 1520, nowrap: true },
    { t: 'Enterprise data unification is still at ground zero.', size: 42, w: 1520, nowrap: true, pad: true },
    { t: 'AI cannot work till this problem is solved', size: 42, w: 1580, nowrap: true, tight: true, color: '#1784f1' },
    { t: 'Introducing Vulqan', size: 76, w: 1180, color: '#1784f1' }
  ];
  const rule = MOTION.enter(0, 220, CUES.Settle + RAIN + 5.6, authoredTotal - 0.3)(T);
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '34px'
    }}>
      {LINES.map((l, i) => {
        // an extra beat before line 2 lands, then the same rhythm after it
        const st = CUES.Settle + RAIN + i * 1.05 + (i >= 2 ? 0.7 : 0) - (i >= 3 ? 0.4 : 0);
        const op = MOTION.enter(0, 1, st, st + 1)(T);
        const rise = MOTION.enter(22, 0, st, st + 1.15)(T);
        // emphasis: once it has landed, swell ~8% and settle back over a second
        let sc = 1, glow = 0;
        if (l.swell) {
          const d = clamp((T - (st + 0.7)) / 1.0, 0, 1);
          const k = Math.sin(Math.PI * d) * (d < 1 ? 1 : 0);
          sc = 1 + 0.08 * k; glow = k;
        }
        return (
          <div key={l.t} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600,
            fontSize: `${l.size}px`, maxWidth: `${l.w}px`,
            lineHeight: 1.12, letterSpacing: '-0.005em', color: l.color || '#ffffff', textAlign: 'center',
            textWrap: 'balance', whiteSpace: l.nowrap ? 'nowrap' : undefined,
            marginBottom: l.pad ? '48px' : l.tight ? '-22px' : undefined,
            opacity: op, transform: `translateY(${rise}px) scale(${sc.toFixed(4)})`,
            textShadow: glow > 0.01 ? `0 0 ${(18 * glow).toFixed(1)}px rgba(23,132,241,${(0.55 * glow).toFixed(2)})` : undefined
          }}>{l.t}</div>
        );
      })}
      <div style={{ width: `${rule}px`, height: '1px', background: '#457bcc', marginTop: '10px' }}></div>
    </div>
  );
}

function Scrim({ T, CUES }) {
  const on = MOTION.out(0, 0.97, CUES.Settle - 0.6, CUES.Settle + 0.9)(T);
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#05080f', opacity: on, pointerEvents: 'none'
    }}></div>
  );
}

// ---- background layers -------------------------------------------------
// faint blue haze that hangs behind the jargon and the panels
const BLOBS = [
  { x: 420, y: 300, r: 520, sx: 0.13, sy: 0.09, a: 0.1 },
  { x: 1180, y: 620, r: 600, sx: -0.1, sy: 0.14, a: 0.085 },
  { x: 800, y: 180, r: 460, sx: 0.17, sy: -0.11, a: 0.07 },
  { x: 300, y: 760, r: 420, sx: 0.09, sy: -0.16, a: 0.06 },
  { x: 1420, y: 240, r: 380, sx: -0.15, sy: 0.1, a: 0.05 }
];

function Smoke({ T, CUES }) {
  const inn = MOTION.out(0, 1, 0, 1.6)(T);
  const out = 1 - MOTION.out(0, 1, CUES.Settle - 0.2, CUES.Settle + 1.4)(T);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: inn * out, pointerEvents: 'none' }}>
      {BLOBS.map((b, i) => {
        const dx = Math.sin(T * b.sx + i * 1.7) * 90;
        const dy = Math.cos(T * b.sy + i * 2.3) * 70;
        const pulse = 0.82 + Math.sin(T * 0.31 + i) * 0.18;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${b.x - b.r}px`, top: `${b.y - b.r}px`,
            width: `${b.r * 2}px`, height: `${b.r * 2}px`, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(23,132,241,${b.a}) 0%, rgba(23,132,241,0) 68%)`,
            filter: 'blur(40px)', opacity: pulse,
            transform: `translate(${dx}px, ${dy}px)`
          }}></div>
        );
      })}
    </div>
  );
}


// ---- tangle -------------------------------------------------------------
// Deliberately NOT the finale's language: no lanes, no right angles, no pads.
// Loose curves at arbitrary angles crossing each other, drifting slowly, with a
// few knots where several converge and go nowhere. Order at the end reads as
// order because this has none of its geometry.
const STRANDS = (() => {
  const out = [];
  for (let i = 0; i < 26; i++) {
    // start anywhere off-frame, wander across, leave anywhere else
    const side = Math.floor(rnd(i, 90) * 4);
    const along = rnd(i, 91);
    const P = [
      side === 0 ? [-120, along * 900] : side === 1 ? [along * 1600, -120]
        : side === 2 ? [1720, along * 900] : [along * 1600, 1020]
    ];
    let x = P[0][0], y = P[0][1];
    const segs = 3 + Math.floor(rnd(i, 92) * 3);
    let d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    for (let k = 0; k < segs; k++) {
      const c1 = [x + (rnd(i, 93 + k) - 0.2) * 620, y + (rnd(i, 97 + k) - 0.5) * 700];
      x += (rnd(i, 101 + k) - 0.25) * 560;
      y += (rnd(i, 105 + k) - 0.5) * 620;
      const c2 = [x + (rnd(i, 109 + k) - 0.5) * 400, y + (rnd(i, 113 + k) - 0.5) * 460];
      d += ` C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    out.push({
      d,
      w: 0.9 + rnd(i, 117) * 1.4,
      a: 0.06 + rnd(i, 118) * 0.1,
      drift: 0.06 + rnd(i, 119) * 0.1,
      amp: 10 + rnd(i, 120) * 26,
      phase: rnd(i, 121) * 6.28,
      // a signal that wanders off and never resolves
      pulse: 0.05 + rnd(i, 122) * 0.09,
      len: 70 + rnd(i, 123) * 160
    });
  }
  return out;
})();

// knots: places where the tangle bunches and terminates on itself
const KNOTS = Array.from({ length: 7 }, (_, i) => ({
  x: 120 + rnd(i, 130) * 1360,
  y: 100 + rnd(i, 131) * 700,
  r: 26 + rnd(i, 132) * 44,
  a: 0.1 + rnd(i, 133) * 0.12
}));

const TANGLE_CSS = STRANDS.map((st, i) => `@keyframes tg${i}{
  0%{transform:translate(-${st.amp.toFixed(1)}px,${(st.amp * 0.6).toFixed(1)}px)}
  100%{transform:translate(${st.amp.toFixed(1)}px,-${(st.amp * 0.6).toFixed(1)}px)}
}
@keyframes tf${i}{
  0%{stroke-dashoffset:0}
  100%{stroke-dashoffset:-2600}
}`).join('\n');

function Tangle({ T, CUES, phase }) {
  // one copy behind the jargon, one above the blackout scrim for the panels
  const jumble = 1 - MOTION.out(0, 1, CUES.Settle - 0.4, CUES.Settle + 0.4)(T);
  const panels = MOTION.out(0, 0.85, CUES.Settle, CUES.Settle + 1.1)(T)
    * (1 - MOTION.out(0, 1, CUES.Land - 0.3, CUES.Land + 1)(T));
  const on = phase === 'panels' ? panels : jumble;
  if (on <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: on, pointerEvents: 'none' }}>
      <svg width="1600" height="900" viewBox="0 0 1600 900" style={{ display: 'block' }}>
        <style dangerouslySetInnerHTML={{ __html: TANGLE_CSS }} />
        {STRANDS.map((st, i) => (
          <g key={i} style={{
            animation: `tg${i} ${(1 / st.drift * 0.5).toFixed(1)}s ease-in-out infinite alternate both`,
            animationDelay: `${(-st.phase * 2).toFixed(1)}s`
          }}>
            <path d={st.d} fill="none" stroke={`rgba(125,179,238,${st.a})`} strokeWidth={st.w} />
            <path d={st.d} fill="none" stroke="rgba(125,179,238,0.3)" strokeWidth={st.w}
              strokeDasharray={`${st.len.toFixed(0)} 2500`}
              style={{
                animation: `tf${i} ${(1 / st.pulse).toFixed(1)}s linear infinite both`,
                animationDelay: `${(-i * 1.3).toFixed(1)}s`
              }} />
          </g>
        ))}
      </svg>
    </div>
  );
}

// orthogonal circuit traces, generated once so they never reshuffle
const TRACES = (() => {
  const out = [];
  for (let i = 0; i < 22; i++) {
    const vertical = i % 2 === 0;
    const lane = 60 + Math.floor(rnd(i, 1) * 15) * 100;
    const pts = [];
    if (vertical) {
      let y = -40, x = lane;
      pts.push([x, y]);
      const turns = 2 + Math.floor(rnd(i, 2) * 2);
      for (let k = 0; k < turns; k++) {
        y += 160 + rnd(i, 3 + k) * 220;
        pts.push([x, y]);
        x += (rnd(i, 9 + k) > 0.5 ? 1 : -1) * (80 + rnd(i, 12 + k) * 160);
        pts.push([x, y]);
      }
      pts.push([x, 960]);
    } else {
      let x = -40, y = 50 + Math.floor(rnd(i, 4) * 9) * 100;
      pts.push([x, y]);
      const turns = 2 + Math.floor(rnd(i, 5) * 2);
      for (let k = 0; k < turns; k++) {
        x += 200 + rnd(i, 6 + k) * 280;
        pts.push([x, y]);
        y += (rnd(i, 14 + k) > 0.5 ? 1 : -1) * (70 + rnd(i, 17 + k) * 130);
        pts.push([x, y]);
      }
      pts.push([1660, y]);
    }
    out.push({
      d: pts.map((p, n) => `${n ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' '),
      pads: pts.slice(1, -1),
      speed: 0.045 + rnd(i, 21) * 0.05,
      phase: rnd(i, 22)
    });
  }
  return out;
})();

function Circuit({ T, CUES }) {
  const on = MOTION.out(0.34, 1, CUES.Settle - 0.2, CUES.Settle + 1.6)(T);
  if (on <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: on, pointerEvents: 'none' }}>
      <svg width="1600" height="900" viewBox="0 0 1600 900" style={{ display: 'block' }}>
        {TRACES.map((tr, i) => {
          const off = -(((T * tr.speed + tr.phase) % 1) * 3400);
          return (
            <g key={i}>
              <path d={tr.d} fill="none" stroke="rgba(23,132,241,0.13)" strokeWidth="1.5" />
              <path d={tr.d} fill="none" stroke="rgba(125,179,238,0.62)" strokeWidth="1.5"
                strokeDasharray="90 3310" strokeDashoffset={off} />
            </g>
          );
        })}
        {TRACES.map((tr, i) => tr.pads.map((p, k) => {
          const blink = 0.18 + 0.3 * (0.5 + 0.5 * Math.sin(T * 1.6 + i * 1.3 + k * 2.1));
          return <circle key={i + '-' + k} cx={p[0]} cy={p[1]} r="3.4"
            fill={`rgba(23,132,241,${blink})`} />;
        }))}
      </svg>
    </div>
  );
}

// ---- crawl ----------------------------------------------------------------
// Opening-crawl treatment: the 30 years of buzzwords scroll up a tilted plane
// in date order and recede into the distance. One element moves, driven by T.
const CRAWL_GAP = 176, CRAWL_T0 = 0, CRAWL_OFF0 = 300, CRAWL_SPEED = 402;
function Crawl({ T, CUES }) {
  // slow start, fast through the middle, slowing right down over Ontology and
  // Context Layer, which lands ~380 plane px up exactly as the scrim starts
  const u = clamp((T - CUES.Swarm - CRAWL_T0) / Math.max(0.1, CUES.Settle - 0.25 - CUES.Swarm - CRAWL_T0), 0, 1);
  // Data Dictionary is already on screen at frame one
  const end = (TAGS.length - 1) * CRAWL_GAP + 380;
  // moving from frame one (the ease-out term gives it a gentle initial speed),
  // fast through the middle, easing to a stop on Context Layer
  const ss = u * u * u * (u * (u * 6 - 15) + 10), eo = 1 - (1 - u) * (1 - u);
  const off = CRAWL_OFF0 + (end - CRAWL_OFF0) * (0.82 * ss + 0.18 * eo);
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      perspective: '640px', perspectiveOrigin: '50% 22%',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 4%, #000 42%)',
      maskImage: 'linear-gradient(to bottom, transparent 4%, #000 42%)'
    }}>
      <div style={{
        position: 'absolute', left: '50%', width: '1200px', marginLeft: '-600px', top: 0, bottom: 0,
        transformOrigin: '50% 100%', transform: 'rotateX(30deg)'
      }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', transform: 'translate3d(0,' + (-off).toFixed(1) + 'px,0)' }}>
          {TAGS.map((tag, i) => {
            const p = i * CRAWL_GAP - off;                 // <0 once above the bottom edge
            if (p > 40 || p < -2600) return null;
            const k = clamp(-p / 1500, 0, 1);
            const col = 'rgb(' + Math.round(255 + (69 - 255) * k) + ',' + Math.round(255 + (123 - 255) * k) + ',' + Math.round(255 + (204 - 255) * k) + ')';
            return (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i * CRAWL_GAP) + 'px', textAlign: 'center', color: col }}>
                <div style={{ fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '22px', letterSpacing: '.18em', lineHeight: 1, opacity: .6, marginBottom: '10px' }}>{tag.y}</div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '60px', lineHeight: 1.04, letterSpacing: '-.015em' }}>{tag.t}</div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '28px', lineHeight: 1.3, marginTop: '8px', opacity: .75 }}>&ldquo;{tag.q}&rdquo;</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- fracture -------------------------------------------------------------
// The landed crawl cracks from an impact point on Context Layer, shudders
// frantically, then its shards blow apart just before the blackout.
const IMPACT = [800, 575];
const PERIM = t => {
  t = ((t % 5000) + 5000) % 5000;
  if (t < 1600) return [t, 0];
  if (t < 2500) return [1600, t - 1600];
  if (t < 4100) return [1600 - (t - 2500), 900];
  return [0, 900 - (t - 4100)];
};
const CRACKS = (() => {
  const n = 11, out = [];
  for (let k = 0; k < n; k++) {
    const t = (k + 0.25 + rnd(k, 71) * 0.5) / n * 5000;
    const b = PERIM(t);
    const dx = b[0] - IMPACT[0], dy = b[1] - IMPACT[1], len = Math.hypot(dx, dy);
    const off = (rnd(k, 72) - 0.5) * 120;
    const f = 0.3 + rnd(k, 73) * 0.25;
    const kink = [IMPACT[0] + dx * f - dy / len * off, IMPACT[1] + dy * f + dx / len * off];
    out.push({ t, b, kink });
  }
  return out;
})();
const SHARDS = CRACKS.map((c, k) => {
  const d = CRACKS[(k + 1) % CRACKS.length];
  const t1 = k === CRACKS.length - 1 ? d.t + 5000 : d.t;
  const pts = [IMPACT, c.kink, c.b];
  [0, 1600, 2500, 4100, 5000, 6600, 7500].forEach(ct => { if (ct > c.t && ct < t1) pts.push(PERIM(ct)); });
  pts.push(d.b, d.kink);
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const L = Math.hypot(cx - IMPACT[0], cy - IMPACT[1]) || 1;
  return { clip: 'polygon(' + pts.map(p => p[0].toFixed(0) + 'px ' + p[1].toFixed(0) + 'px').join(',') + ')', dir: [(cx - IMPACT[0]) / L, (cy - IMPACT[1]) / L] };
});

function Fracture({ T, CUES }) {
  const op = 1 - MOTION.out(0, 1, CUES.Settle + SC_IN, CUES.Settle + SC_IN + 0.9)(T);
  if (op <= 0.001) return null;
  return <div style={{ position: 'absolute', inset: 0, opacity: op }}><Crawl T={T} CUES={CUES} /></div>;
}

// ---- scatter ----------------------------------------------------------------
// As the crawl dissolves, every buzzword breaks loose and scatters across the
// whole frame to its own cell (5x5 grid, so none overlap), hangs there long
// enough to register as noise, then fades out under the payoff.
const RAIN = 2.6;              // seconds after Settle before the payoff begins
const SC_IN = -0.7;            // scatter starts this long before Settle
const ORDER = [12, 3, 21, 8, 17, 0, 14, 23, 6, 19, 10, 1, 24, 15, 4, 11, 20, 7, 16, 2, 22, 9, 13, 18, 5];
const SCATTER = TAGS.map((tag, i) => {
  const c = ORDER[i % 25], col = c % 5, row = Math.floor(c / 5);
  const size = 20 + Math.round(rnd(i, 84) * 12);
  // keep centre ± half the estimated width (plus drift) inside the frame
  const half = tag.t.length * 0.3 * size + 24;
  const x = clamp(260 + col * 270 + (rnd(i, 81) - 0.5) * 60, 40 + half, 1560 - half);
  const y = clamp(130 + row * 160 + (rnd(i, 82) - 0.5) * 40, 60, 840);
  return {
    t: tag.t, x, y, size,
    sx: 800 + (rnd(i, 87) - 0.5) * 260,
    sy: 560 + (rnd(i, 88) - 0.5) * 160,
    d: rnd(i, 83) * 0.45,
    white: rnd(i, 86) > 0.6,
    dx: (rnd(i, 89) - 0.5) * 40,
    dy: (rnd(i, 90) - 0.5) * 24
  };
});
function Rain({ T, CUES }) {
  const t = T - CUES.Settle;
  if (t < SC_IN || t > RAIN + 0.4) return null;
  const fade = 1 - MOTION.out(0, 1, RAIN - 0.8, RAIN + 0.2)(t);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: fade }}>
      {SCATTER.map((d, i) => {
        const st = SC_IN + d.d;
        const p = MOTION.enter(0, 1, st, st + 1.5)(t);
        if (t < st) return null;
        const drift = clamp((t - st) / (RAIN - SC_IN), 0, 1);
        const x = d.sx + (d.x - d.sx) * p + d.dx * drift;
        const y = d.sy + (d.y - d.sy) * p + d.dy * drift;
        return (
          <div key={i} style={{
            position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap',
            transform: 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + (0.55 + 0.45 * p).toFixed(3) + ')',
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: d.size + 'px',
            color: d.white ? '#ffffff' : '#457bcc',
            opacity: MOTION.enter(0, 1, st, st + 0.4)(t)
          }}>{d.t}</div>
        );
      })}
    </div>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#05080f', overflow: 'hidden' }}>
      <Circuit T={T} CUES={CUES} />
      <Fracture T={T} CUES={CUES} />
      <Scrim T={T} CUES={CUES} />
      <Rain T={T} CUES={CUES} />
      <Circuit T={T} CUES={CUES} />
      <Payoff T={T} CUES={CUES} authoredTotal={authoredTotal} />
    </div>
  );
}

window.Piece = Piece;
