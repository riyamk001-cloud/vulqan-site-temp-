// Abstract black-and-blue visuals for the product videos — one motif per script line.
(() => {
const { useComposition, animate, interpolate, Easing, clamp } = window;

const VIZ = {
  overview: [['suite', 0], ['suite', 1], ['suite', 2], ['suite', 3], ['suite', 4], ['suite', 5]],
  datamaia: [['dmv', 0], ['dmv', 1], ['dmv', 6], ['dmv', 7]],
  logic: [['lbv', 0], ['lbv', 2], ['lbv', 5], ['lbv', 6], ['lbv', 7]],
  quality: [['qqv', 0], ['qqv', 5], ['qqv', 3], ['qqv', 4]],
  hub: [['dhv', 6], ['dhv', 7], ['dhv', 4], ['dhv', 5]],
  delivery: [['dsv', 0], ['dsv', 1], ['dsv', 2], ['dsv', 4]],
  ask: [['amv', 0], ['amv', 1], ['amv', 2], ['amv', 3], ['amv', 4]]
};

const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  glide: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  drift: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.linear })
};

const B = { hi: '#1784f1', lo: '#7db3ee', dim: '#2b4a8f', faint: '#13203a', edge: '#1d2d5a', cyan: '#6fe3ff', fill: '#0b1428', ink: '#fafbfc' };
const rnd = (i, s) => { const x = Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
const frac = x => x - Math.floor(x);
const lerp = (a, b, u) => a + (b - a) * u;
const bez = (p0, c, p1, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1]];
// value that glides from its previous-mode value to this mode's value over the line's first beat
const tr = (t, prev, cur) => MOTION.glide(prev, cur, 0.05, 0.9)(t);

function Glyph({ kind, x, y, s = 1, o = 1, hl = 0 }) {
  const col = hl > 0 ? B.cyan : B.lo;
  const sw = 2;
  let body;
  if (kind === 0) body = (
    <g>
      <path d="M-20 -28 H10 L22 -16 V28 H-20 Z" fill={B.fill} stroke={col} strokeWidth={sw}></path>
      <path d="M-10 -8 H12 M-10 4 H12 M-10 16 H4" stroke={B.dim} strokeWidth={3} strokeLinecap="round"></path>
    </g>
  );
  else if (kind === 1) body = (
    <g>
      <circle r={27} fill={B.fill} stroke={col} strokeWidth={sw}></circle>
      <path d="M-6 -10 L-14 0 L-6 10 M6 -10 L14 0 L6 10" fill="none" stroke={B.lo} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"></path>
    </g>
  );
  else body = (
    <g>
      <path d="M-24 -18 V18 A24 8 0 0 0 24 18 V-18" fill={B.fill} stroke={col} strokeWidth={sw}></path>
      <ellipse cx={0} cy={-18} rx={24} ry={8} fill={B.fill} stroke={col} strokeWidth={sw}></ellipse>
      <path d="M-24 0 A24 8 0 0 0 24 0" fill="none" stroke={B.dim} strokeWidth={2}></path>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {hl > 0 ? <circle r={44 + 8 * hl} fill="none" stroke={B.cyan} strokeOpacity={0.35 * hl} strokeWidth={1.5}></circle> : null}
      {body}
    </g>
  );
}

function Stream({ p0, c, p1, T, o, n = 5, speed = 0.32, seed = 0, color = B.hi }) {
  if (o <= 0.01) return null;
  const d = `M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={B.edge} strokeWidth={1.5}></path>
      {Array.from({ length: n }, (_, k) => {
        const u = frac(T * speed + k / n + seed * 0.17);
        const [x, y] = bez(p0, c, p1, u);
        return <circle key={k} cx={x} cy={y} r={3.2} fill={color} opacity={Math.sin(u * Math.PI)}></circle>;
      })}
    </g>
  );
}

function Hub({ x, y, T, o = 1, pulse = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={62} fill="none" stroke={B.dim} strokeWidth={1.5} strokeDasharray="4 10" transform={`rotate(${T * 24})`}></circle>
      <circle r={44} fill={B.fill} stroke={B.hi} strokeWidth={2}></circle>
      <circle r={14 + 3 * Math.sin(T * 2.4)} fill={B.hi}></circle>
      {pulse > 0 ? <circle r={44 + 50 * pulse} fill="none" stroke={B.cyan} strokeOpacity={1 - pulse} strokeWidth={2}></circle> : null}
    </g>
  );
}

// ——— FLOW: sources → engine → destinations
function Flow({ T, a, mode, prev }) {
  const t = T - a;
  const fresh = prev == null;
  const S = [[560, 380], [560, 520], [560, 660]], H = [1000, 520], D = [[1440, 400], [1440, 520], [1440, 640]];
  const srcV = m => (m === 'ship' || m === 'dest' ? 0.3 : 1);
  const dstV = m => (m === 'sources' ? 0 : 1);
  const sv = tr(t, srcV(prev ?? mode), srcV(mode));
  const dv = fresh ? (dstV(mode) ? MOTION.enter(0, 1, 0.6, 1.4)(t) : 0) : tr(t, dstV(prev), dstV(mode));
  const hlCycle = mode === 'sources' ? Math.floor(t / 1.3) % 3 : -1;
  const focus = mode === 'focus' ? MOTION.enter(0, 1, 0.3, 1.1)(t) : 0;
  const dfocus = mode === 'dest' ? MOTION.enter(0, 1, 0.3, 1.1)(t) : 0;
  const shipBoost = mode === 'ship' || mode === 'dest';
  return (
    <g>
      {S.map((p, i) => {
        const inn = fresh ? MOTION.enter(0, 1, 0.1 + i * 0.25, 0.8 + i * 0.25)(t) : 1;
        const o = inn * sv * (focus && i !== 1 ? 1 - 0.6 * focus : 1);
        return (
          <g key={i}>
            <Stream p0={[p[0] + 40, p[1]]} c={[780, p[1]]} p1={[H[0] - 56, H[1]]} T={T} o={o} seed={i}></Stream>
            <Glyph kind={i} x={p[0] - (1 - inn) * 40} y={p[1]} o={o} s={1 + 0.35 * (i === 1 ? focus : 0)} hl={i === hlCycle ? 1 : (i === 1 ? focus * (0.6 + 0.4 * Math.sin(T * 3)) : 0)}></Glyph>
          </g>
        );
      })}
      {focus > 0 ? (
        <g opacity={focus}>
          {[0, 1, 2].map(k => (
            <g key={k} transform={`translate(${404} ${474 + k * 30})`}>
              <circle r={5} fill={k === 2 ? B.cyan : B.hi} opacity={k === 2 ? 0.5 + 0.5 * Math.sin(T * 4) : 1}></circle>
              <rect x={-94} y={-4} width={78 - k * 16} height={8} rx={4} fill={B.dim}></rect>
            </g>
          ))}
        </g>
      ) : null}
      <Hub x={H[0]} y={H[1]} T={T} o={fresh ? MOTION.enter(0, 1, 0, 0.8)(t) : 1}></Hub>
      {D.map((p, i) => {
        const o = dv * (fresh && dstV(mode) ? MOTION.enter(0, 1, 0.6 + i * 0.25, 1.3 + i * 0.25)(t) : 1) * (dfocus && i !== 1 ? 1 - 0.6 * dfocus : 1);
        return (
          <g key={i}>
            <Stream p0={[H[0] + 56, H[1]]} c={[1220, p[1]]} p1={[p[0] - 40, p[1]]} T={T} o={o} seed={i + 3} speed={shipBoost ? 0.45 : 0.32} color={shipBoost ? B.cyan : B.hi}></Stream>
            <Glyph kind={2 - i} x={p[0]} y={p[1]} o={o} s={1 + 0.35 * (i === 1 ? dfocus : 0)} hl={i === 1 ? dfocus * (0.6 + 0.4 * Math.sin(T * 3)) : 0}></Glyph>
          </g>
        );
      })}
    </g>
  );
}

// ——— GRAPH: logical model / knowledge graph
const GN = (() => {
  const n = [[1000, 520, 30]];
  for (let k = 0; k < 6; k++) { const an = (k * 60 - 90) * Math.PI / 180; n.push([1000 + 270 * Math.cos(an), 520 + 180 * Math.sin(an), 19]); }
  [30, 150, 210, 330].forEach(d => { const an = d * Math.PI / 180; n.push([1000 + 420 * Math.cos(an), 520 + 200 * Math.sin(an), 9]); });
  return n;
})();
const GE = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [3, 4], [5, 6], [2, 7], [3, 7], [4, 8], [5, 9], [6, 10], [1, 10]];

function Graph({ T, a, mode, prev }) {
  const t = T - a;
  const fresh = prev == null;
  const form = mode === 'form';
  const edgeFull = m => (m === 'form' ? 0.22 : 1);
  const merge = mode === 'merge' ? MOTION.glide(0, 1, 0.8, 2.2)(t) : 0;
  const drill = mode === 'drill' ? MOTION.glide(0, 1, 0.2, 1.2)(t) : 0;
  const flag = mode === 'flag' ? MOTION.enter(0, 1, 0.6, 1.2)(t) : 0;
  const fixed = mode === 'flag' ? MOTION.glide(0, 1, 3.2, 4)(t) : 0;
  const pos = i => {
    const [x, y] = GN[i];
    if (!form || !fresh && prev !== 'form') return [x, y];
    const sx = 420 + rnd(i, 1) * 1160, sy = 300 + rnd(i, 2) * 440;
    const u = MOTION.glide(0, 1, 0.3 + i * 0.12, 1.9 + i * 0.12)(t);
    return [lerp(sx, x, u), lerp(sy, y, u)];
  };
  const P = GN.map((_, i) => {
    let [x, y] = pos(i);
    if (i === 2 && merge) { x = lerp(x, GN[0][0], merge); y = lerp(y, GN[0][1], merge); }
    return [x, y];
  });
  const eBase = tr(t, edgeFull(prev ?? mode), edgeFull(mode));
  const drawE = j => (mode === 'relate' && prev !== 'relate' ? MOTION.enter(0, 1, 0.2 + j * 0.15, 0.8 + j * 0.15)(t) : 1);
  const dim = i => (drill ? (i === 5 || i === 0 ? 1 : 1 - 0.7 * drill) : 1);
  const lineage = mode === 'drill' ? MOTION.enter(0, 1, 1.1, 2.6)(t) : 0;
  return (
    <g>
      {GE.map(([i, j], k) => {
        const d = drawE(k);
        const o = (form ? MOTION.enter(0, 1, 1.4 + k * 0.08, 2.4 + k * 0.08)(t) * 0.22 : eBase) * Math.min(dim(i), dim(j)) * (i === 2 || j === 2 ? 1 - merge : 1);
        const [x1, y1] = P[i], [x2, y2] = P[j];
        const u = frac(T * 0.5 + k * 0.23);
        return (
          <g key={k} opacity={o}>
            <line x1={x1} y1={y1} x2={lerp(x1, x2, d)} y2={lerp(y1, y2, d)} stroke={B.dim} strokeWidth={1.6}></line>
            {!form && d >= 1 ? <circle cx={lerp(x1, x2, u)} cy={lerp(y1, y2, u)} r={2.8} fill={B.hi} opacity={Math.sin(u * Math.PI)}></circle> : null}
          </g>
        );
      })}
      {lineage > 0 ? (
        <g>
          <path d={`M${GN[5][0]} ${GN[5][1]} C 620 ${GN[5][1]}, 560 520, 420 520`} fill="none" stroke={B.cyan} strokeWidth={1.8} strokeDasharray="6 8" pathLength={100} strokeDashoffset={0} opacity={lineage}></path>
          {[420, 520, 620].map((y, k) => {
            const o = MOTION.enter(0, 1, 1.8 + k * 0.25, 2.4 + k * 0.25)(t);
            return <rect key={k} x={380} y={y - 12} width={24} height={24} rx={4} fill={B.fill} stroke={B.cyan} strokeWidth={1.6} opacity={o}></rect>;
          })}
          <path d="M404 420 C 440 420, 440 520, 420 520 M404 620 C 440 620, 440 520, 420 520" fill="none" stroke={B.cyan} strokeWidth={1.4} opacity={MOTION.enter(0, 1, 2.2, 2.9)(t)}></path>
        </g>
      ) : null}
      {GN.map((n, i) => {
        const [x, y] = P[i];
        let r = n[2];
        if (form && (fresh || prev === 'form')) r *= 0.4 + 0.6 * MOTION.glide(0, 1, 0.3 + i * 0.12, 1.9 + i * 0.12)(t);
        const o = dim(i) * (i === 2 ? 1 - merge * 0.9 : 1);
        const center = i === 0;
        const isFlag = i === 4 && flag > 0;
        const ringCol = isFlag ? (fixed > 0.5 ? B.hi : B.cyan) : (center ? B.hi : B.lo);
        return (
          <g key={i} opacity={o}>
            {isFlag ? <circle cx={x} cy={y} r={r + 14 + 6 * Math.sin(T * 4) * (1 - fixed)} fill="none" stroke={ringCol} strokeWidth={2} opacity={flag}></circle> : null}
            {drill && i === 5 ? [1, 2, 3].map(q => <circle key={q} cx={x} cy={y} r={r + q * 16 * drill} fill="none" stroke={B.cyan} strokeOpacity={0.5 / q} strokeWidth={1.5}></circle>) : null}
            <circle cx={x} cy={y} r={r * (drill && i === 5 ? 1 + 0.6 * drill : 1)} fill={center ? B.hi : B.fill} stroke={ringCol} strokeWidth={2}></circle>
            {center && merge > 0.85 ? <circle cx={x} cy={y} r={r + 60 * (merge - 0.85) / 0.15} fill="none" stroke={B.cyan} strokeWidth={2} opacity={1 - (merge - 0.85) / 0.15}></circle> : null}
          </g>
        );
      })}
    </g>
  );
}

// ——— SCHEMA: object → unified variables
const SW = Array.from({ length: 7 }, (_, i) => 240 + Math.round(rnd(i, 5) * 220));
function Schema({ T, a, mode, prev }) {
  const t = T - a;
  const fresh = prev == null;
  const N = [620, 520], x0 = 800;
  const rows = SW.map((w, i) => [x0, 370 + i * 50, w]);
  const lists = mode === 'lists';
  const clean = mode === 'cleanse' ? MOTION.glide(0, 1, 0.6, 2.4)(t) : 1;
  const scan = mode === 'cleanse' ? MOTION.drift(760, 1400, 0.4, 2.6)(t) : -1;
  return (
    <g>
      <g opacity={fresh ? MOTION.enter(0, 1, 0, 0.7)(t) : 1}>
        <circle cx={N[0]} cy={N[1]} r={70} fill="none" stroke={B.dim} strokeWidth={1.5} strokeDasharray="4 10" transform={`rotate(${T * 20} ${N[0]} ${N[1]})`}></circle>
        <circle cx={N[0]} cy={N[1]} r={50} fill={B.hi}></circle>
        {mode === 'config' ? <Glyph kind={0} x={N[0]} y={N[1]} s={0.9} o={1}></Glyph> : <rect x={N[0] - 16} y={N[1] - 16} width={32} height={32} rx={5} fill="none" stroke={B.ink} strokeWidth={2.4}></rect>}
      </g>
      {rows.map(([x, y, w], i) => {
        const inn = fresh ? MOTION.enter(0, 1, 0.4 + i * 0.18, 1.0 + i * 0.18)(t) : 1;
        const jx = (1 - clean) * (rnd(i, 7) - 0.5) * 180;
        const ww = mode === 'cleanse' ? lerp(w * (0.6 + rnd(i, 8) * 0.8), 300, clean) : w;
        const hl = lists && i === 2 ? MOTION.enter(0, 1, 0.2, 0.7)(t) : (prev === 'lists' && i === 2 ? 1 - MOTION.glide(0, 1, 0, 0.6)(t) : 0);
        const on = mode === 'config' ? MOTION.glide(0, 1, 0.5 + i * 0.3, 0.8 + i * 0.3)(t) : 0;
        return (
          <g key={i} opacity={inn} transform={`translate(${(1 - inn) * 30 + jx} 0)`}>
            <path d={`M${N[0] + 52} ${N[1]} C ${N[0] + 110} ${N[1]}, ${x - 70} ${y}, ${x - 12} ${y}`} fill="none" stroke={B.edge} strokeWidth={1.4}></path>
            <rect x={x - 6} y={y - 6} width={12} height={12} rx={2} fill={hl ? B.cyan : B.lo}></rect>
            <rect x={x + 22} y={y - 6} width={ww} height={12} rx={6} fill={hl ? B.hi : B.dim}></rect>
            <rect x={x + 22 + ww + 16} y={y - 6} width={58} height={12} rx={6} fill={B.faint} stroke={B.edge}></rect>
            {mode === 'config' ? (
              <g transform={`translate(${1420} ${y})`}>
                <rect x={-22} y={-11} width={44} height={22} rx={11} fill={on > 0.5 ? B.hi : B.faint} stroke={B.edge}></rect>
                <circle cx={lerp(-11, 11, on)} r={8} fill={B.ink}></circle>
              </g>
            ) : null}
          </g>
        );
      })}
      {scan > 0 ? <line x1={scan} y1={340} x2={scan} y2={700} stroke={B.cyan} strokeWidth={2} opacity={0.7 * Math.sin(clamp((scan - 760) / 640, 0, 1) * Math.PI)}></line> : null}
      {lists || prev === 'lists' ? (() => {
        const ro = rows[2];
        const ox = lists ? 1 : 1 - MOTION.glide(0, 1, 0, 0.6)(t);
        return (
          <g opacity={ox}>
            {[0, 1, 2, 3].map(j => {
              const o = lists ? MOTION.enter(0, 1, 0.7 + j * 0.3, 1.2 + j * 0.3)(t) : 1;
              const cy = 400 + j * 56;
              return (
                <g key={j} opacity={o}>
                  <path d={`M${ro[0] + 22 + ro[2] + 80} ${ro[1]} C ${1320} ${ro[1]}, ${1340} ${cy}, ${1400} ${cy}`} fill="none" stroke={B.cyan} strokeWidth={1.4} strokeOpacity={0.6}></path>
                  <rect x={1400 + (1 - o) * 20} y={cy - 16} width={170} height={32} rx={16} fill={B.fill} stroke={B.cyan} strokeWidth={1.6}></rect>
                  <rect x={1420 + (1 - o) * 20} y={cy - 4} width={70 + j * 16} height={8} rx={4} fill={B.lo}></rect>
                </g>
              );
            })}
          </g>
        );
      })() : null}
      {mode === 'config' ? (() => {
        const o = MOTION.enter(0, 1, 2.6, 3.3)(t);
        return (
          <g opacity={o}>
            <Stream p0={[1460, 520]} c={[1520, 520]} p1={[1570, 520]} T={T} o={1} n={3} speed={0.6} color={B.cyan}></Stream>
            <Glyph kind={2} x={1620} y={520} o={1}></Glyph>
          </g>
        );
      })() : null}
    </g>
  );
}

// ——— CHAT: Maia conversation + the model it reads
function Chat({ T, a0, a, mode }) {
  const t = T - a0;
  const px = 1120, py = 290, pw = 560, ph = 470;
  const inn = MOTION.enter(0, 1, 0, 0.8)(T - a0);
  const msgs = [];
  for (let k = 0; k < 20; k++) {
    const at = 0.4 + k * 1.45;
    if (at > t) break;
    const user = k % 2 === 0;
    const lines = user ? 1 + (rnd(k, 3) > 0.6 ? 1 : 0) : 2 + (rnd(k, 4) > 0.5 ? 1 : 0);
    const h = 26 + lines * 18;
    const grow = MOTION.enter(0, 1, at, at + 0.45)(t);
    msgs.push({ k, user, lines, h, grow, at });
  }
  let y = py + ph - 64;
  const placed = [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    y -= (m.h + 14) * m.grow;
    placed.push({ ...m, y });
  }
  const last = msgs[msgs.length - 1];
  const typing = msgs.length % 2 === 1 && last && t > last.at + 0.5;
  const reply = msgs.filter(m => !m.user).pop();
  const pulse = reply ? clamp((t - reply.at) / 1.1, 0, 1) : 1;
  const find = mode === 'find';
  const G = [[700, 520, 16], [600, 420, 9], [800, 420, 9], [560, 560, 9], [840, 560, 9], [650, 650, 9], [760, 650, 9]];
  const GEs = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [2, 4], [5, 6]];
  const hot = find ? Math.floor((T - a) / 0.55) % 7 : (pulse < 1 ? 0 : -1);
  return (
    <g opacity={inn}>
      <g>
        {GEs.map(([i, j], k) => <line key={k} x1={G[i][0]} y1={G[i][1]} x2={G[j][0]} y2={G[j][1]} stroke={B.dim} strokeWidth={1.4}></line>)}
        {G.map(([x, yy, r], i) => (
          <g key={i}>
            {i === hot ? <circle cx={x} cy={yy} r={r + 12 + 4 * Math.sin(T * 5)} fill="none" stroke={B.cyan} strokeWidth={1.6} opacity={0.8}></circle> : null}
            <circle cx={x} cy={yy} r={r} fill={i === 0 ? B.hi : B.fill} stroke={i === hot ? B.cyan : B.lo} strokeWidth={2}></circle>
          </g>
        ))}
        {pulse < 1 && reply ? (() => {
          const u = Easing.easeInOutCubic(pulse);
          const x = lerp(px - 8, 716, u), yy = lerp(520, 520, u);
          return <circle cx={x} cy={yy} r={5} fill={B.cyan} opacity={Math.sin(u * Math.PI)}></circle>;
        })() : null}
        <line x1={740} y1={520} x2={px - 8} y2={520} stroke={B.edge} strokeWidth={1.4} strokeDasharray="3 7"></line>
        {find ? <path d={`M${px - 8} 520 L ${G[hot][0]} ${G[hot][1]}`} stroke={B.cyan} strokeWidth={1.4} strokeOpacity={0.55}></path> : null}
      </g>
      <rect x={px} y={py} width={pw} height={ph} rx={10} fill="rgba(11,20,40,.9)" stroke={B.edge} strokeWidth={1.5}></rect>
      <rect x={px + 22} y={py + 22} width={18} height={18} rx={3} fill={B.hi}></rect>
      <rect x={px + 52} y={py + 27} width={110} height={8} rx={4} fill={B.lo}></rect>
      <line x1={px} y1={py + 60} x2={px + pw} y2={py + 60} stroke={B.edge}></line>
      <clipPath id="chatclip"><rect x={px} y={py + 62} width={pw} height={ph - 124}></rect></clipPath>
      <g clipPath="url(#chatclip)">
        {placed.map(m => {
          const w = m.user ? 250 + rnd(m.k, 6) * 80 : 340 + rnd(m.k, 6) * 90;
          const x = m.user ? px + pw - 24 - w : px + 52;
          return (
            <g key={m.k} opacity={m.grow} transform={`translate(0 ${(1 - m.grow) * 12})`}>
              {!m.user ? <rect x={px + 22} y={m.y + 4} width={16} height={16} rx={3} fill={B.hi}></rect> : null}
              <rect x={x} y={m.y} width={w} height={m.h} rx={8} fill={m.user ? B.hi : '#0e1730'} stroke={m.user ? 'none' : B.edge}></rect>
              {Array.from({ length: m.lines }, (_, q) => (
                <rect key={q} x={x + 16} y={m.y + 15 + q * 18} width={(w - 32) * (q === m.lines - 1 ? 0.55 + rnd(m.k + q, 9) * 0.3 : 0.92)} height={7} rx={3.5} fill={m.user ? '#cfe3fb' : B.dim}></rect>
              ))}
            </g>
          );
        })}
        {typing ? [0, 1, 2].map(q => <circle key={q} cx={px + 64 + q * 16} cy={py + ph - 84} r={4} fill={B.lo} opacity={0.35 + 0.65 * Math.abs(Math.sin(T * 4 - q * 0.6))}></circle>) : null}
      </g>
      <rect x={px + 20} y={py + ph - 50} width={pw - 40} height={34} rx={6} fill={B.fill} stroke={B.edge}></rect>
      <rect x={px + 36} y={py + ph - 37} width={140} height={8} rx={4} fill={B.faint}></rect>
    </g>
  );
}

// ——— GRID: records, quality issues, tiles
const GC = 12, GR = 6, CW = 56, CH = 26, GX = 14, GY = 16, G0 = [470, 402];
const FL = [5, 14, 22, 31, 40, 47, 58, 66];
const LANES = [400, 480, 560, 640];
const cellXY = i => [G0[0] + (i % GC) * (CW + GX), G0[1] + Math.floor(i / GC) * (CH + GY)];
const laneXY = j => [1480 + Math.floor(j / 4) * 70, LANES[j % 4] - CH / 2];

function Grid({ T, a, mode, prev }) {
  const t = T - a;
  const fresh = prev == null;
  const inLane = m => m === 'triage' || m === 'filter' || m === 'fix' || m === 'fix2';
  const gDim = m => (inLane(m) ? 0.35 : (m === 'fix' || m === 'fix2' ? 0.2 : 1));
  const tileV = m => (m === 'tiles' ? 1 : 0);
  const gd = tr(t, gDim(prev ?? mode), gDim(mode));
  const tv = fresh ? tileV(mode) : tr(t, tileV(prev), tileV(mode));
  const laneU = fresh ? (inLane(mode) ? 1 : 0) : tr(t, inLane(prev) ? 1 : 0, inLane(mode) ? 1 : 0);
  const flagOn = m => (m === 'issues' || inLane(m) || m === 'bulk');
  const fo = fresh ? (flagOn(mode) ? 1 : 0) : tr(t, flagOn(prev) ? 1 : 0, flagOn(mode) ? 1 : 0);
  const resolved = mode === 'resolve' ? MOTION.glide(0, 1, 0.9, 1.8)(t) : 0;
  const ripple = mode === 'resolve' ? MOTION.drift(0, 1, 1.6, 3)(t) : -1;
  const rowsIn = r => (mode === 'records' && fresh ? MOTION.enter(0, 1, 0.3 + r * 0.25, 0.9 + r * 0.25)(t) : 1);
  const band = mode === 'bulk' ? MOTION.glide(0, 1, 0.4, 1.4)(t) : 0;
  const filt = mode === 'filter' ? MOTION.glide(0, 1, 0.2, 1)(t) : (prev === 'filter' ? 1 - MOTION.glide(0, 1, 0, 0.8)(t) : 0);
  const fixCard = mode === 'fix' ? MOTION.enter(0, 1, 0.8, 1.6)(t) : (mode === 'fix2' ? 1 : 0);
  const newVal = mode === 'fix' ? 0 : (mode === 'fix2' ? MOTION.enter(0, 1, 0.5, 1.4)(t) : 0);
  const check = mode === 'fix2' ? MOTION.enter(0, 1, 1.8, 2.5)(t) : 0;
  const lanesO = laneU * (1 - 0.0);
  return (
    <g>
      <g opacity={(1 - tv) * gd}>
        {band > 0 ? <rect x={G0[0] - 12} y={G0[1] + (CH + GY) - 8} width={(GC * (CW + GX) - GX + 24) * band} height={3 * (CH + GY) - GY + 16} rx={6} fill="rgba(23,132,241,.14)" stroke={B.hi} strokeWidth={1.5}></rect> : null}
        {Array.from({ length: GC * GR }, (_, i) => {
          if (FL.includes(i)) return null;
          const [x, y] = cellXY(i);
          const r = Math.floor(i / GC);
          const o = rowsIn(r);
          const sel = band > 0 && r >= 1 && r <= 3 && (i % GC) / GC < band;
          const rip = ripple >= 0 ? Math.max(0, 1 - Math.abs((i % GC) / GC - ripple) * 6) : 0;
          return <rect key={i} x={x - (1 - o) * 20} y={y} width={CW} height={CH} rx={4} fill={sel ? B.dim : (rip > 0 ? B.hi : B.faint)} fillOpacity={rip > 0 ? 0.3 + 0.7 * rip : 1} opacity={o}></rect>;
        })}
        {mode === 'bulk' ? Array.from({ length: GR }, (_, r) => {
          const y = G0[1] + r * (CH + GY);
          const w = MOTION.enter(0, 1, 0.8 + r * 0.15, 1.6 + r * 0.15)(t) * (20 + rnd(r, 11) * 50);
          return <rect key={r} x={G0[0] + GC * (CW + GX) + 10} y={y + 9} width={w} height={8} rx={4} fill={r >= 1 && r <= 3 ? B.lo : B.dim}></rect>;
        }) : null}
      </g>
      <g opacity={lanesO}>
        {LANES.map((y, j) => {
          const dimL = filt && j !== 0 ? 1 - 0.75 * filt : 1;
          return (
            <g key={j} opacity={dimL}>
              {j === 0 && filt ? <rect x={1400} y={y - 26} width={330} height={52} rx={8} fill="rgba(23,132,241,.12)" stroke={B.hi} strokeOpacity={filt}></rect> : null}
              <line x1={1462} y1={y} x2={1720} y2={y} stroke={B.edge} strokeWidth={1.4}></line>
              {j === 0 ? <rect x={1422} y={y - 9} width={18} height={18} rx={3} fill={B.cyan}></rect> : null}
              {j === 1 ? <rect x={1422} y={y - 9} width={18} height={18} rx={3} fill="none" stroke={B.cyan} strokeWidth={2}></rect> : null}
              {j === 2 ? <rect x={1422} y={y - 9} width={18} height={18} rx={3} fill="none" stroke={B.lo} strokeWidth={2} strokeDasharray="3 3"></rect> : null}
              {j === 3 ? <circle cx={1431} cy={y} r={7} fill={B.lo}></circle> : null}
            </g>
          );
        })}
      </g>
      <g opacity={1 - tv}>
        {FL.map((ci, j) => {
          const [gx, gy] = cellXY(ci);
          const [lx, ly] = laneXY(j);
          const u = MOTION.glide(0, 1, 0, 1)(clamp((laneU - j * 0.04) / (1 - 0.28), 0, 1));
          const x = lerp(gx, lx, u), y = lerp(gy, ly, u);
          const dimL = filt && j % 4 !== 0 ? 1 - 0.75 * filt : 1;
          const hide = fixCard > 0 && j === 0 ? 1 - fixCard : 1;
          const pop = mode === 'issues' && fresh ? MOTION.enter(0, 1, 0.5 + j * 0.2, 0.9 + j * 0.2)(t) : 1;
          const solid = resolved;
          const ring = fo * (1 - solid);
          return (
            <g key={ci} opacity={dimL * hide * (mode === 'records' ? rowsIn(Math.floor(ci / GC)) : 1)}>
              <rect x={x} y={y} width={CW} height={CH} rx={4} fill={solid > 0 ? B.hi : B.faint} fillOpacity={solid > 0 ? solid : 1}></rect>
              {ring > 0 ? <rect x={x - 4} y={y - 4} width={CW + 8} height={CH + 8} rx={6} fill="none" stroke={j % 4 === 2 ? B.lo : B.cyan} strokeWidth={2} strokeDasharray={j % 4 === 2 ? '4 4' : 'none'} opacity={ring * pop * (0.6 + 0.4 * Math.sin(T * 4 + j))}></rect> : null}
            </g>
          );
        })}
      </g>
      {fixCard > 0 ? (
        <g opacity={fixCard} transform={`translate(${lerp(1480, 820, fixCard)} ${lerp(390, 420, fixCard)}) scale(${lerp(0.2, 1, fixCard)})`}>
          <rect x={0} y={0} width={400} height={200} rx={10} fill="#0e1730" stroke={B.cyan} strokeWidth={1.8}></rect>
          <rect x={24} y={24} width={18} height={18} rx={3} fill={B.cyan}></rect>
          <rect x={54} y={29} width={120} height={8} rx={4} fill={B.lo}></rect>
          <rect x={24} y={76} width={150} height={12} rx={6} fill={B.dim} opacity={1 - 0.5 * newVal}></rect>
          <line x1={20} y1={82} x2={20 + 158 * newVal} y2={82} stroke={B.cyan} strokeWidth={2}></line>
          <path d="M196 82 H232 M222 72 L234 82 L222 92" fill="none" stroke={B.lo} strokeWidth={2} opacity={newVal}></path>
          <rect x={250} y={76} width={126 * newVal} height={12} rx={6} fill={B.hi}></rect>
          <rect x={24} y={120} width={250} height={8} rx={4} fill={B.faint}></rect>
          <rect x={24} y={140} width={190} height={8} rx={4} fill={B.faint}></rect>
          <g transform="translate(356 156)" opacity={check}>
            <circle r={20} fill={B.hi}></circle>
            <path d="M-8 0 L-2 6 L9 -6" fill="none" stroke={B.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - check}></path>
          </g>
        </g>
      ) : null}
      {tv > 0 ? (
        <g opacity={tv}>
          {Array.from({ length: 12 }, (_, i) => {
            const c = i % 4, r = Math.floor(i / 4);
            const x = 544 + c * 234, y = 336 + r * 134;
            const o = MOTION.enter(0, 1, 0.3 + i * 0.07, 0.9 + i * 0.07)(t);
            const s = lerp(0.9, 1, o);
            return (
              <g key={i} opacity={mode === 'tiles' ? o : 1} transform={`translate(${x + 105} ${y + 55}) scale(${mode === 'tiles' ? s : 1}) translate(${-105} ${-55})`}>
                <rect width={210} height={110} rx={8} fill="#0e1730" stroke={B.edge}></rect>
                <rect x={18} y={18} width={30} height={30} rx={5} fill={i % 5 === 2 ? B.cyan : B.hi} opacity={0.9}></rect>
                <rect x={60} y={22} width={110} height={8} rx={4} fill={B.lo}></rect>
                <rect x={60} y={38} width={70} height={7} rx={3.5} fill={B.dim}></rect>
                <rect x={18} y={74} width={174} height={6} rx={3} fill={B.faint}></rect>
                <rect x={18} y={74} width={174 * (0.5 + rnd(i, 12) * 0.5)} height={6} rx={3} fill={B.dim}></rect>
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
}

// ——— JOBS: schedule, monitor, status
function Jobs({ T, a, mode, prev }) {
  const t = T - a;
  const ringV = m => (m === 'schedule' ? 1 : 0);
  const rv = prev == null ? ringV(mode) : tr(t, ringV(prev), ringV(mode));
  const rowsV = 1 - rv;
  const C0 = [1000, 520], R = 180;
  const hand = (t * 70 - 90) * Math.PI / 180;
  const marks = [20, 110, 200, 290];
  const handDeg = ((t * 70) % 360 + 360) % 360;
  const status = mode === 'status';
  return (
    <g>
      {rv > 0 ? (
        <g opacity={rv}>
          <circle cx={C0[0]} cy={C0[1]} r={R} fill="none" stroke={B.edge} strokeWidth={1.5}></circle>
          {Array.from({ length: 24 }, (_, k) => {
            const an = k * 15 * Math.PI / 180;
            const r1 = k % 6 === 0 ? R - 18 : R - 9;
            return <line key={k} x1={C0[0] + Math.cos(an) * r1} y1={C0[1] + Math.sin(an) * r1} x2={C0[0] + Math.cos(an) * R} y2={C0[1] + Math.sin(an) * R} stroke={B.dim} strokeWidth={2}></line>;
          })}
          <line x1={C0[0]} y1={C0[1]} x2={C0[0] + Math.cos(hand) * (R - 30)} y2={C0[1] + Math.sin(hand) * (R - 30)} stroke={B.hi} strokeWidth={3} strokeLinecap="round"></line>
          <circle cx={C0[0]} cy={C0[1]} r={10} fill={B.hi}></circle>
          {marks.map((d, k) => {
            const an = (d - 90) * Math.PI / 180;
            const since = ((handDeg - d) % 360 + 360) % 360 / 70;
            const flash = since < 1.2 ? 1 - since / 1.2 : 0;
            const mx = C0[0] + Math.cos(an) * R, my = C0[1] + Math.sin(an) * R;
            return (
              <g key={k}>
                <circle cx={mx} cy={my} r={9 + 4 * flash} fill={flash > 0 ? B.cyan : B.fill} stroke={B.lo} strokeWidth={2}></circle>
                {flash > 0 ? <circle cx={C0[0] + Math.cos(an) * (R + 110 * (1 - flash))} cy={C0[1] + Math.sin(an) * (R + 110 * (1 - flash))} r={4} fill={B.cyan} opacity={flash}></circle> : null}
              </g>
            );
          })}
        </g>
      ) : null}
      {rowsV > 0 ? (
        <g opacity={rowsV}>
          {Array.from({ length: 5 }, (_, i) => {
            const y = 400 + i * 60;
            const sp = 0.35 + rnd(i, 13) * 0.35;
            const p = status ? 1 : clamp((t - 0.3 - i * 0.25) * sp, 0, 1);
            const st = status ? [0, 0, 1, 2, 0][i] : (p >= 1 ? 0 : -1);
            const stIn = status ? MOTION.enter(0, 1, 0.3 + i * 0.25, 0.8 + i * 0.25)(t) : 1;
            const fill = st === 1 ? 0.62 : p;
            return (
              <g key={i}>
                <rect x={660} y={y - 5} width={90} height={10} rx={5} fill={B.dim}></rect>
                <rect x={780} y={y - 4} width={620} height={8} rx={4} fill={B.faint}></rect>
                <rect x={780} y={y - 4} width={620 * fill} height={8} rx={4} fill={st === 1 ? B.dim : B.hi}></rect>
                {st === 1 ? <line x1={780 + 620 * 0.62 + 6} y1={y} x2={1400} y2={y} stroke={B.dim} strokeWidth={2} strokeDasharray="4 6" opacity={stIn}></line> : null}
                <g transform={`translate(630 ${y})`}>
                  {st === -1 ? <circle r={8} fill="none" stroke={B.dim} strokeWidth={2} strokeDasharray="3 3" transform={`rotate(${T * 120})`}></circle> : null}
                  {st === 0 ? <circle r={8} fill={B.hi} opacity={stIn}></circle> : null}
                  {st === 1 ? <circle r={8} fill="none" stroke={B.lo} strokeWidth={2} opacity={stIn}></circle> : null}
                  {st === 2 ? <circle r={8 + 3 * Math.sin(T * 5)} fill="none" stroke={B.cyan} strokeWidth={2.2} opacity={stIn}></circle> : null}
                </g>
                {status && st === 0 ? <Stream p0={[1412, y]} c={[1480, y]} p1={[1520, 520]} T={T} o={stIn} n={3} speed={0.5} seed={i}></Stream> : null}
              </g>
            );
          })}
          {status ? <Glyph kind={2} x={1580} y={520} o={MOTION.enter(0, 1, 1.4, 2)(t)}></Glyph> : null}
        </g>
      ) : null}
    </g>
  );
}

function Field() {
  const { T } = useComposition();
  return (
    <g>
      {Array.from({ length: 80 }, (_, i) => {
        const x = frac(rnd(i, 21) + T * 0.004 * (0.5 + rnd(i, 22))) * 1920;
        const y = rnd(i, 23) * 1080;
        return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 24) * 1.4} fill={B.lo} opacity={0.12 + 0.25 * rnd(i, 25) * (0.6 + 0.4 * Math.sin(T * 0.8 + i))}></circle>;
      })}
    </g>
  );
}


// ——— UI: dark renderings of real Logic Builder screens
const U = { bg: '#0b1428', head: '#101b36', row: '#0d1731', edge: '#1d2d5a', ink: '#e8ebf1', mute: '#8a93a6', lab: '#6f7fa6', hi: '#1784f1', sky: '#7db3ee', cyan: '#6fe3ff', sel: 'rgba(23,132,241,.16)' };
const UF = "'Inter', system-ui, sans-serif", UM = "'Roboto Mono', ui-monospace, monospace";
const fadeUp = (t, s, d = 0.5) => { const o = MOTION.enter(0, 1, s, s + d)(t); return { opacity: o, transform: 'translateY(' + (1 - o) * 10 + 'px)' }; };
const Dot = ({ c, sq }) => <span style={{ width: 8, height: 8, borderRadius: sq ? 1 : 8, background: c, flex: 'none' }}></span>;
const MonoLab = ({ children, style }) => <div style={{ fontFamily: UM, fontSize: 12, letterSpacing: '.14em', color: U.lab, ...style }}>{children}</div>;
const AddBtn = () => <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: U.sky, fontWeight: 600, fontSize: 15 }}><span style={{ width: 22, height: 22, borderRadius: 22, border: '1px solid ' + U.edge, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>+</span>Add</span>;

const DF_SRC = [['g', 'ERP', 'DATABASE · 3'], ['i', 'PRISM_RAY'], ['i', 'SAP_CA'], ['i', 'SAP_PW'], ['g', 'Contracts', 'DATABASE · 2'], ['i', 'ContractDB'], ['i', 'LocalTracker'], ['g', 'SharePoint', 'FILES · 3', 1], ['g', 'Engineering & Programs', 'API · 4'], ['g', 'Market Data', 'API · 2'], ['i', 'ExternalFeed'], ['i', 'RevisedFeed']];
const DF_OBJ = ['Supplier', 'Part', 'Commodity', 'Index', 'Contract', 'Purchase Order', 'Business Unit', 'Owner', 'Model', 'Initiative'];
const DF_DST = [['g', 'Snowflake', 'DATABASE · 2'], ['i', 'Supplier Warehouse'], ['i', 'Parts Warehouse'], ['g', 'SharePoint', 'FILES · 1', 1], ['i', 'Sourcing Initiative Tracker', '', 1]];
const DF_SE = [[1, 0], [1, 1], [2, 1], [2, 2], [3, 3], [5, 4], [6, 5], [7, 6], [8, 7], [8, 8], [10, 3], [11, 9]];
const DF_OD = [[0, 1], [1, 2], [2, 2], [4, 1], [5, 4], [7, 4], [8, 4], [9, 4]];
const TOP = 56, GH = 36, IH = 46, OH = 50;
const ys = rows => { let y = TOP, out = []; rows.forEach(r => { const h = r[0] === 'g' ? GH : IH; out.push(y + h / 2); y += h; }); return out; };
const SY = ys(DF_SRC), DY = ys(DF_DST), OY = DF_OBJ.map((_, i) => TOP + i * OH + OH / 2);

function ColHead({ icon, title, n, extra }) {
  return (
    <div style={{ height: TOP, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '1px solid ' + U.edge }}>
      {icon}
      <span style={{ fontSize: 17, fontWeight: 700, color: U.ink }}>{title}</span>
      <span style={{ fontSize: 16, color: U.mute }}>{n}</span>
      <span style={{ flex: 1 }}></span>
      {extra}
      <AddBtn></AddBtn>
    </div>
  );
}
function ListRows({ rows, t, t0, hot }) {
  return rows.map((r, i) => (
    <div key={i} style={{ height: r[0] === 'g' ? GH : IH, display: 'flex', alignItems: 'center', gap: 10, padding: r[0] === 'g' ? '0 16px' : '0 16px 0 32px',
      background: r[0] === 'g' ? U.head : 'transparent', borderTop: i ? '1px solid ' + U.edge : 'none', fontSize: r[0] === 'g' ? 15 : 16, fontWeight: r[0] === 'g' ? 600 : 500, color: U.ink, ...fadeUp(t, t0 + i * 0.05, 0.4) }}>
      {r[0] === 'g' ? <span style={{ color: U.lab, fontSize: 10 }}>▾</span> : null}
      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{r[1]}</span>
      {r[2] ? <span style={{ fontFamily: UM, fontSize: 11, letterSpacing: '.1em', color: U.lab, whiteSpace: 'nowrap' }}>{r[2]}</span> : null}
      {r[3] ? <Dot c={U.cyan}></Dot> : null}
    </div>
  ));
}

function DataFlowUI({ t, T }) {
  const X = { s: 0, sw: 330, o: 500, ow: 390, d: 1060, dw: 340 };
  const draw = MOTION.glide(0, 1, 1.3, 2.8)(t);
  const hot = t > 3 ? Math.floor((t - 3) / 0.7) % DF_OBJ.length : -1;
  const path = (x1, y1, x2, y2, k, lo, hi) => { const xm = lo + ((k * 37) % (hi - lo)); return 'M' + x1 + ' ' + y1 + ' H' + xm + ' V' + y2 + ' H' + x2; };
  const lines = DF_SE.map(([s, o], k) => ({ d: path(X.s + X.sw, SY[s], X.o - 6, OY[o], k, X.sw + 16, X.o - 16), on: o === hot }))
    .concat(DF_OD.map(([o, d], k) => ({ d: path(X.o + X.ow, OY[o], X.d - 6, DY[d], k + 3, X.o + X.ow + 16, X.d - 16), on: o === hot })));
  const col = (x, w, s, kids) => <div style={{ position: 'absolute', left: x, top: 0, width: w, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 20px 50px rgba(2,4,10,.5)', ...fadeUp(t, s, 0.6) }}>{kids}</div>;
  return (
    <div style={{ position: 'relative', width: 1400, height: 620, fontFamily: UF }}>
      <div style={{ position: 'absolute', left: 0, top: -58, fontSize: 30, fontWeight: 700, color: U.ink, ...fadeUp(t, 0, 0.5) }}>Data Flow</div>
      <svg width={1400} height={620} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {lines.map((l, k) => (
          <g key={k}>
            <path d={l.d} fill="none" stroke={l.on ? U.sky : '#2b4a8f'} strokeWidth={l.on ? 2.2 : 1.6} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw}></path>
            {draw >= 1 ? <path d={l.d} fill="none" stroke={U.cyan} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray="0.025 0.975" strokeDashoffset={-frac(T * 0.28 + k * 0.137)}></path> : null}
          </g>
        ))}
      </svg>
      {col(X.s, X.sw, 0.2, [<ColHead key="h" icon={<Dot c={U.sky} sq></Dot>} title="Sources" n="14"></ColHead>, <ListRows key="r" rows={DF_SRC} t={t} t0={0.4}></ListRows>])}
      {col(X.o, X.ow, 0.5, [
        <ColHead key="h" icon={<span style={{ color: U.sky, fontSize: 14 }}>◆</span>} title="Objects" n="10" extra={<span style={{ display: 'flex', gap: 6, marginRight: 8 }}>{['Merge', 'Split', 'Delete'].map(b => <span key={b} style={{ fontSize: 13, color: U.ink, border: '1px solid ' + U.edge, padding: '4px 8px' }}>{b}</span>)}</span>}></ColHead>,
        ...DF_OBJ.map((o, i) => (
          <div key={o} style={{ height: OH, display: 'flex', alignItems: 'center', padding: '0 16px', borderTop: i ? '1px solid ' + U.edge : 'none', fontSize: 18, fontWeight: 500, color: U.ink,
            background: i === hot ? U.sel : 'transparent', boxShadow: i === hot ? 'inset 3px 0 0 ' + U.hi : 'none', ...fadeUp(t, 0.7 + i * 0.06, 0.4) }}>
            <span style={{ flex: 1 }}>{o}</span>{i === 5 ? <Dot c={U.cyan}></Dot> : (i === 9 ? <Dot c="#3b4c78"></Dot> : null)}
          </div>
        ))
      ])}
      {col(X.d, X.dw, 0.8, [<ColHead key="h" icon={<span style={{ width: 11, height: 11, border: '1.5px solid ' + U.sky }}></span>} title="Destinations" n="3"></ColHead>, <ListRows key="r" rows={DF_DST} t={t} t0={1}></ListRows>])}
    </div>
  );
}

function Field2({ label, children, s, t, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...fadeUp(t, s), ...style }}><MonoLab>{label}</MonoLab>{children}</div>;
}
const Box = ({ children, style }) => <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1px solid ' + U.edge, background: U.row, fontSize: 17, color: U.ink, ...style }}>{children}</div>;
const typed = (s, t, a, d) => s.slice(0, Math.round(s.length * clamp((t - a) / d, 0, 1)));

function AddSourceUI({ t, T }) {
  const kinds = [['F', 'Files'], ['D', 'Databases'], ['A', 'APIs'], ['A', 'Agents']];
  const pick = t < 1.4 ? 1 : (t < 2.1 ? 2 : 0);
  const on = 0;
  const press = t > 4.4 && t < 4.7 ? 1 : 0;
  const name = typed('BU Tracker.xlsx', t, 2.4, 0.9);
  return (
    <div style={{ width: 820, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ padding: '26px 30px 22px', borderBottom: '1px solid ' + U.edge, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}><MonoLab>SOURCES</MonoLab><div style={{ marginTop: 8, fontSize: 30, fontWeight: 600, color: U.ink }}>Add a source</div></div>
        <span style={{ color: U.mute, fontSize: 24 }}>×</span>
      </div>
      <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Field2 label="KIND — SET ONCE, CANNOT BE CHANGED LATER" s={0.3} t={t}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid ' + U.edge }}>
            {kinds.map(([l, k], i) => (
              <div key={k} style={{ height: 78, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, borderLeft: i ? '1px solid ' + U.edge : 'none',
                background: i === pick ? U.sel : 'transparent', boxShadow: i === pick ? 'inset 0 0 0 2px ' + U.hi : 'none' }}>
                <span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: i === pick ? '#fff' : U.ink, background: i === pick ? U.hi : '#24365f' }}>{l}</span>
                <span style={{ fontSize: 17, fontWeight: i === pick ? 700 : 500, color: U.ink }}>{k}</span>
              </div>
            ))}
          </div>
        </Field2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field2 label="CONNECTION" s={0.6} t={t}><Box>SAP<span style={{ flex: 1 }}></span><span style={{ color: U.lab, fontSize: 11 }}>▾</span></Box></Field2>
          <Field2 label="&nbsp;" s={0.7} t={t}><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Box style={{ color: U.sky, fontWeight: 600, background: 'transparent' }}>New connection</Box><span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: U.mute, lineHeight: 1.3 }}><Dot c={U.cyan}></Dot>Connected — shared by 2 sources</span></div></Field2>
          <Field2 label="CONNECTOR" s={0.8} t={t}><Box>Local File<span style={{ flex: 1 }}></span><span style={{ color: U.lab, fontSize: 11 }}>▾</span></Box></Field2>
          <Field2 label="NAME" s={0.9} t={t}><Box style={{ boxShadow: t > 2.3 && t < 3.4 ? 'inset 0 0 0 1px ' + U.hi : 'none' }}>{name}{t > 2.3 && t < 3.4 && frac(T * 2) < 0.5 ? <span style={{ width: 2, height: 20, background: U.sky, marginLeft: 2 }}></span> : null}</Box></Field2>
        </div>
        <div style={{ display: 'none', gridTemplateColumns: '1fr 1fr 1.3fr', gap: 20, alignItems: 'end' }}>
          <Field2 label="DELIMITER" s={1} t={t}><Box>Comma</Box></Field2>
          <Field2 label="FIRST ROW" s={1.1} t={t}>
            <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, color: U.ink }}>
              <span style={{ width: 46, height: 26, borderRadius: 26, background: on > 0.5 ? U.hi : '#24365f', position: 'relative' }}><span style={{ position: 'absolute', top: 3, left: 3 + 20 * on, width: 20, height: 20, borderRadius: 20, background: '#fff' }}></span></span>Column headers
            </div>
          </Field2>
          <Field2 label="TIMEZONE" s={1.2} t={t}><Box>America/New_York<span style={{ flex: 1 }}></span><span style={{ color: U.lab, fontSize: 11 }}>▾</span></Box></Field2>
        </div>
      </div>
      <div style={{ padding: '18px 30px', whiteSpace: 'nowrap', borderTop: '1px solid ' + U.edge, background: U.head, display: 'flex', alignItems: 'center', gap: 14, ...fadeUp(t, 1.3) }}>
        <span style={{ flex: 1, fontSize: 15, color: U.mute }}>Everything except Kind stays editable later.</span>
        <span style={{ padding: '13px 24px', border: '1px solid ' + U.edge, fontSize: 17, fontWeight: 600, color: U.ink }}>Cancel</span>
        <span style={{ padding: '13px 24px', background: press ? U.sky : U.hi, fontSize: 17, fontWeight: 600, color: '#fff', boxShadow: t > 3.9 ? '0 0 0 ' + (4 * Math.abs(Math.sin(T * 3))) + 'px rgba(111,227,255,.35)' : 'none' }}>Add source</span>
      </div>
    </div>
  );
}

const CL_COLS = [['part_number', 170], ['l1_commodity', 230, 1], ['l2_subcommodity', 220, 2], ['uom', 120, 3], ['business_unit', 160], ['country_of_origin', 180, 1]];
const CL_ROWS = [['CPN-00001', 'Forgings', 'Closed Die', 'Each', 'RAY', 'GB'], ['RAY00002', 'Forgings', 'Closed Die', 'EA', 'RAY', 'CA'], ['RAY00003', 'Hardware', 'Fasteners', 'EA', 'RAY', 'US'], ['00005-RAY', 'Electronics', 'Connectors', 'EA', 'RAY', 'MX'], ['CPN-00006', 'Electronics', 'Connectors', 'KG', 'RAY', 'MX'], ['CPN-00007', '•Electronics', 'Titanium', 'Each', 'RAY', 'GB'], ['CPN-00008', 'Electronics', 'Connectors', 'Each', 'RAY', '—']];

function CleanserUI({ t, T }) {
  const colOn = MOTION.glide(0, 1, 1, 1.5)(t);
  const panel = MOTION.glide(0, 1, 1.4, 2.1)(t);
  const fixAt = i => 2.6 + i * 0.35;
  let fixN = 0;
  return (
    <div style={{ width: 1500, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6)', fontFamily: UF, overflow: 'hidden', ...fadeUp(t, 0, 0.6) }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', whiteSpace: 'nowrap', background: U.head, borderBottom: '1px solid ' + U.edge }}>
        <div style={{ display: 'flex', border: '1px solid ' + U.edge }}>
          <span style={{ padding: '10px 18px', fontSize: 16, fontWeight: 600, color: U.ink, background: U.sel }}>Cleansed</span>
          <span style={{ padding: '10px 18px', fontSize: 16, color: U.mute }}>Raw</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: '1px solid rgba(111,227,255,.45)', fontSize: 16, color: U.ink }}><Dot c={U.cyan}></Dot>New data from Quality Queue<b style={{ color: U.cyan }}>Update</b></span>
        <span style={{ padding: '10px 16px', border: '1px solid ' + U.edge, fontSize: 16, fontWeight: 600, color: U.ink }}>Summary</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: '1px solid ' + U.edge, fontSize: 16, fontWeight: 600, color: U.sky }}>+ Add rule for all columns</span>
      </div>
      <div style={{ display: 'flex', position: 'relative' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', height: 52, borderBottom: '1px solid ' + U.edge, background: U.head }}>
            <span style={{ width: 60, flex: 'none' }}></span>
            {CL_COLS.map(([c, w, m], j) => (
              <div key={c} style={{ width: w, flex: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontSize: 16, fontWeight: 500, color: j === 1 ? U.ink : '#c3c9d6',
                background: j === 1 ? 'rgba(23,132,241,' + 0.2 * colOn + ')' : 'transparent', boxShadow: j === 1 ? 'inset 0 -3px 0 rgba(23,132,241,' + colOn + ')' : 'none' }}>
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{c}</span>{m ? <Dot c={m === 1 ? U.cyan : (m === 2 ? U.sky : '#ffffff')} sq={m === 2}></Dot> : null}
              </div>
            ))}
          </div>
          {CL_ROWS.map((r, i) => (
            <div key={i} style={{ display: 'flex', height: 44, borderBottom: '1px solid ' + U.edge, ...fadeUp(t, 0.3 + i * 0.07, 0.4) }}>
              <span style={{ width: 60, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: U.lab }}>{i + 1}</span>
              {r.map((v, j) => {
                const flagged = v[0] === '•';
                const needs = (j === 3 && v === 'Each') || flagged;
                const my = needs ? fixN++ : -1;
                const u = needs ? MOTION.glide(0, 1, fixAt(my), fixAt(my) + 0.4)(t) : 0;
                const txt = flagged ? v.slice(1) : v;
                const next = j === 3 ? 'EA' : txt;
                return (
                  <div key={j} style={{ width: CL_COLS[j][1], flex: 'none', whiteSpace: 'nowrap', position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontSize: 17, color: U.ink, fontFamily: j === 0 ? UM : UF,
                    boxShadow: j === 1 ? 'inset 2px 0 0 rgba(23,132,241,' + colOn + '),inset -2px 0 0 rgba(23,132,241,' + colOn + ')' : 'none', background: u > 0 && u < 1 ? 'rgba(111,227,255,' + 0.18 * Math.sin(u * Math.PI) + ')' : 'transparent' }}>
                    {flagged ? <span style={{ width: 7, height: 7, background: U.sky, opacity: 1 - u, marginRight: -8 + 8 * (1 - u), transform: 'scale(' + (1 - u) + ')' }}></span> : null}
                    {needs && j === 3 ? <span style={{ display: 'grid' }}><span style={{ gridArea: '1/1', opacity: 1 - u }}>{txt}</span><span style={{ gridArea: '1/1', opacity: u, color: U.cyan }}>{next}</span></span> : <span>{txt}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ width: 300 * panel, overflow: 'hidden', borderLeft: '1px solid ' + U.edge, background: U.bg, flex: 'none' }}>
          <div style={{ width: 300, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MonoLab>← RULES</MonoLab>
            <div style={{ fontSize: 26, fontWeight: 700, color: U.ink }}>Add a rule</div>
            <div style={{ fontSize: 15, color: U.mute }}>To <b style={{ color: U.ink }}>l1_commodity</b></div>
            <Box style={{ height: 42, color: U.lab, fontSize: 15 }}>Search rules</Box>
            <MonoLab style={{ marginTop: 6 }}>SUGGESTED FOR THIS COLUMN</MonoLab>
            {[['Replace invalid values', 'Fixes the invalid entries'], ['Replace missing values', 'Fills the empty values']].map(([h, d], k) => (
              <div key={h} style={{ padding: '12px 14px', border: '1px solid ' + U.edge, boxShadow: k === 0 && t > 2.4 ? 'inset 3px 0 0 ' + U.hi : 'none', background: k === 0 && t > 2.4 ? U.sel : 'transparent' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: U.ink, whiteSpace: 'nowrap' }}>{h}</div>
                <div style={{ fontSize: 14, color: U.mute, marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ——— Delivery Station screens
const DST = [['Yardi', '14', [['Post journal', '/journal · POST', ''], ['Update lease', '/lease · PATCH', '2']]], ['S3 › reporting', '12', [['Nightly rent roll', 'rentroll.csv', ''], ['Occupancy extract', 'occupancy.parquet', '']]], ['SFTP › lender', '9', [['Covenant pack', 'covenant.csv', '1'], ['Loan tape', 'loantape.csv', '']]]];
const DFIELDS = ['journal_id', 'property', 'account', 'amount', 'period'];
function DestUI({ t, tl, T, m }) {
  const flat = []; DST.forEach((g, gi) => g[2].forEach((it, ii) => flat.push([gi, ii])));
  const cyc = [1, 4, 3, 0];
  const step = m === 'dest' ? Math.min(3, Math.floor(Math.max(0, t - 1.2) / 0.7)) : 3;
  const cur = flat[cyc[step]];
  const cfg = m === 'dest2' ? MOTION.glide(0, 1, 0.1, 0.8)(tl) : 0;
  return (
    <div style={{ display: 'flex', gap: 36 * cfg, alignItems: 'flex-start', justifyContent: 'center', width: 1136, fontFamily: UF }}>
      <div style={{ width: 460, flex: 'none', background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', ...fadeUp(t, 0, 0.6) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 22, fontWeight: 700, color: U.ink }}>Post journal</div><div style={{ fontSize: 14, color: U.mute, marginTop: 3 }}>Yardi › /journal · no sends yet</div></div>
          <Box style={{ height: 42, gap: 10, fontSize: 16 }}><span style={{ color: U.mute }}>Window</span>7 days<span style={{ color: U.lab, fontSize: 10 }}>▾</span></Box>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px 6px', whiteSpace: 'nowrap' }}>
          <MonoLab style={{ flex: 1 }}>DESTINATIONS</MonoLab><AddBtn></AddBtn>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 18px 12px', fontSize: 18, fontWeight: 700, color: U.sky, borderBottom: '1px solid ' + U.edge }}><span style={{ flex: 1 }}>All destinations</span><span style={{ fontFamily: UM, fontSize: 15, color: U.lab }}>0</span></div>
        {DST.map((g, gi) => (
          <div key={g[0]} style={{ ...fadeUp(t, 0.3 + gi * 0.18, 0.45) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 18px', background: U.head, borderBottom: '1px solid ' + U.edge, fontSize: 17, fontWeight: 700, color: U.ink, whiteSpace: 'nowrap' }}>
              <span style={{ color: U.lab, fontSize: 11 }}>▼</span><span style={{ flex: 1 }}>{g[0]}</span><span style={{ fontFamily: UM, fontSize: 14, color: U.lab }}>{g[1]}</span>
            </div>
            {g[2].map((it, ii) => {
              const on = cur[0] === gi && cur[1] === ii;
              return (
                <div key={it[0]} style={{ display: 'flex', alignItems: 'center', height: 42, padding: '0 14px 0 30px', borderBottom: '1px solid ' + U.edge, background: on ? U.sel : 'transparent', boxShadow: on ? 'inset 4px 0 0 ' + U.hi : 'none', whiteSpace: 'nowrap' }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: on ? 700 : 500, color: on ? U.sky : U.ink }}>{it[0]}</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 1 }}>{it[1]}</div></div>
                  <span style={{ width: 40, textAlign: 'right', fontFamily: UM, fontSize: 15, fontWeight: 700, color: U.cyan }}>{it[2]}</span>
                  <span style={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>{on ? <span style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid ' + U.hi, color: U.sky, fontSize: 11 }}>▶</span> : <span style={{ width: 4, height: 4, borderRadius: 4, background: '#3b4c78' }}></span>}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ width: 640 * cfg, overflow: 'hidden', flex: 'none', opacity: cfg }}>
        <div style={{ width: 640, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6)' }}>
          <div style={{ padding: '22px 26px', borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}><MonoLab>DESTINATION</MonoLab><div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: U.ink }}>Yardi › /journal</div></div>
          <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Field2 label="QUERY" s={0.6} t={tl}><Box>{typed('Journal lines', tl, 0.8, 0.7)}<span style={{ flex: 1 }}></span><span style={{ color: U.lab, fontSize: 11 }}>▾</span></Box></Field2>
              <Field2 label="FORMAT" s={0.8} t={tl}>
                <div style={{ display: 'flex', border: '1px solid ' + U.edge, height: 48 }}>
                  {['JSON', 'CSV', 'XLSX'].map((f, i) => { const sel = (tl < 1.9 ? 1 : 0) === i; return <span key={f} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 16, color: sel ? '#fff' : U.ink, background: sel ? U.hi : 'transparent', borderLeft: i ? '1px solid ' + U.edge : 'none' }}>{f}</span>; })}
                </div>
              </Field2>
            </div>
            <Field2 label="FIELDS TO DELIVER" s={1.1} t={tl}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {DFIELDS.map((f, i) => { const c = MOTION.enter(0, 1, 2.2 + i * 0.3, 2.45 + i * 0.3)(tl); return (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42, padding: '0 12px', border: '1px solid ' + (c > 0.5 ? U.hi : U.edge), background: c > 0.5 ? U.sel : 'transparent', fontFamily: UM, fontSize: 15, color: U.ink }}>
                    <span style={{ width: 16, height: 16, border: '1.5px solid ' + (c > 0.5 ? U.hi : U.lab), background: c > 0.5 ? U.hi : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>{c > 0.5 ? '✓' : ''}</span>{f}
                  </div>); })}
              </div>
            </Field2>
          </div>
          <div style={{ padding: '16px 26px', borderTop: '1px solid ' + U.edge, background: U.head, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...fadeUp(tl, 1.3) }}>
            <span style={{ flex: 1, fontSize: 16, color: U.mute }}><b style={{ fontFamily: UM, color: U.ink }}>{Math.round(4182 * clamp((tl - 2.2) / 1.6, 0, 1)).toLocaleString()}</b> records ready</span>
            <span style={{ padding: '12px 22px', background: U.hi, fontSize: 17, fontWeight: 600, color: '#fff', boxShadow: tl > 4 ? '0 0 0 ' + (4 * Math.abs(Math.sin(T * 3))) + 'px rgba(111,227,255,.35)' : 'none' }}>Save destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DV_COLS = [['Kind', 110], ['Output', 280], ['Went to', 220], ['Format', 110], ['Records', 120, 1], ['When', 190], ['What happened', 330], ['Status', 140]];
const DV_ROWS = [['System', 'Post journal', 'Yardi', 'JSON', '4,182', '08 Aug, 09:40', 'Posted, acknowledged', 'd'], ['People', 'Owner statement — July', '142 owners', 'PDF', '142', '08 Aug, 06:10', 'Emailed, 142 delivered', 'd'], ['System', 'Post journal', 'Yardi', 'CSV', '12,904', '08 Aug, 06:12', 'Gateway timed out, 3 attempts', 'f'], ['System', 'Turn manifest', 'S3 › ops-drop', 'CSV', '214', '07 Aug, 19:00', 'Refused — credentials expired', 'f'], ['System', 'Rent roll extract', 'ops-drop', 'JSON', '318', '08 Aug, 05:00', 'Written to the bucket', 'd'], ['People', 'Trial balance — July', 'Finance group (6)', 'PDF', '1', '08 Aug, 04:35', 'Emailed, 6 delivered', 'd'], ['System', 'Statement reconciliation', 'First Union', 'XLSX', '902', '07 Aug, 22:15', 'Delivered', 'd'], ['People', 'Covenant certificate — Q2', 'Treasury (4)', 'JSON', '66', '07 Aug, 18:00', 'Emailed, 4 delivered', 'd'], ['People', 'Variance pack — July', 'Asset management (9)', 'PDF', '142', '06 Aug, 17:30', 'Emailed, 9 delivered', 'd']];
const NEWROW = ['System', 'Market rents', 'CoStar › /rents', 'JSON', '902', '08 Aug, 09:52', 'Posted, acknowledged', 'd'];
const RH = 44;
function DeliveriesUI({ t, tl, T, m }) {
  const live = m === 'deliveries';
  const ins = live ? MOTION.glide(0, 1, 1.2, 1.8)(tl) : 1;
  const sent = live ? tl > 3.4 : true;
  const bar = m === 'status' ? MOTION.glide(0, 1, 0.2, 0.9)(tl) : 0;
  const focus = m !== 'status' ? '' : (tl < 1.6 ? '' : (tl < 3.9 ? 'f' : (tl < 5.6 ? 'd' : '')));
  const total = sent ? 1254 : 1253;
  const rows = [NEWROW].concat(DV_ROWS);
  const statCol = s => (s === 'f' ? U.cyan : U.sky);
  const chip = (lab, n, sub, key, col) => (
    <span key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '8px 14px', border: '1px solid ' + (focus === key ? U.hi : 'transparent'), background: focus === key ? U.sel : 'transparent', whiteSpace: 'nowrap' }}>
      <b style={{ fontFamily: UM, fontSize: 18, color: col }}>{n}</b><span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{lab}</span><span style={{ fontSize: 14, color: U.lab }}>{sub}</span>
    </span>
  );
  return (
    <div style={{ width: 1500, height: 440, overflow: 'hidden', background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 76, padding: '0 20px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
        <div><div style={{ fontSize: 22, fontWeight: 700, color: U.ink }}>Deliveries</div><div style={{ fontSize: 14, color: U.mute, marginTop: 2 }}>{total.toLocaleString()} sent in the last 7 days</div></div>
        <Box style={{ height: 46, gap: 12 }}><span style={{ fontFamily: UM, fontSize: 13, letterSpacing: '.12em', color: U.lab }}>WINDOW</span>7 days<span style={{ color: U.lab, fontSize: 10 }}>▾</span></Box>
        <div style={{ padding: '6px 18px', border: '2px solid ' + U.hi }}><div style={{ fontSize: 18, color: U.ink }}><b style={{ fontFamily: UM }}>{total.toLocaleString()}</b> All</div><div style={{ fontSize: 13, color: U.lab }}>in window</div></div>
        <div><div style={{ fontSize: 18, color: U.ink }}><b style={{ fontFamily: UM }}>{sent ? '1,082' : '1,081'}</b> Systems</div><div style={{ fontSize: 13, color: U.lab }}>sent to a machine</div></div>
        <div><div style={{ fontSize: 18, color: U.ink }}><b style={{ fontFamily: UM }}>172</b> People</div><div style={{ fontSize: 13, color: U.lab }}>delivered to a person</div></div>
        <span style={{ flex: 1 }}></span>
        <Box style={{ height: 46, width: 260, color: U.lab, fontSize: 16 }}>Search deliveries</Box>
      </div>
      <div style={{ height: 60 * bar, overflow: 'hidden', background: U.head, borderBottom: bar ? '1px solid ' + U.edge : 'none' }}>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', opacity: bar }}>
          <span style={{ padding: '8px 14px', border: '1px solid ' + (focus === '' ? U.hi : U.edge), fontSize: 16, fontWeight: 600, color: U.ink, whiteSpace: 'nowrap' }}>All <b style={{ fontFamily: UM }}>1,254</b></span>
          {chip('delivered', '1,227', '— it reached the other side', 'd', U.sky)}
          {chip('failed', '19', '— refused or never landed', 'f', U.cyan)}
          {chip('partial', '5', '— some of it went, not all', 'p', U.lo)}
          {chip('queued', '3', '— waiting on a window', 'q', U.mute)}
        </div>
      </div>
      <div style={{ display: 'flex', height: RH, background: U.head, borderBottom: '1px solid ' + U.edge }}>
        {DV_COLS.map(([c, w, r]) => <div key={c} style={{ width: w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: r ? 'flex-end' : 'flex-start', padding: '0 14px', fontSize: 16, fontWeight: 600, color: U.ink, whiteSpace: 'nowrap' }}>{c}</div>)}
      </div>
      <div style={{ transform: 'translateY(' + (-RH * (1 - ins)) + 'px)' }}>
        {rows.map((r, i) => {
          const isNew = i === 0;
          const dim = focus && r[7] !== focus ? 0.22 : 1;
          const hl = focus && r[7] === focus;
          return (
            <div key={i} style={{ display: 'flex', height: RH, borderBottom: '1px solid ' + U.edge, opacity: (isNew ? ins : 1) * dim, whiteSpace: 'nowrap',
              background: isNew && live && tl < 4.6 ? 'rgba(23,132,241,' + (0.16 * (1 - clamp((tl - 3.6) / 1, 0, 1))) + ')' : (hl && focus === 'f' ? 'rgba(111,227,255,.08)' : 'transparent'), boxShadow: hl && focus === 'f' ? 'inset 3px 0 0 ' + U.cyan : 'none' }}>
              {r.slice(0, 7).map((c, j) => {
                let txt = c;
                if (isNew && j === 6) txt = sent ? typed(c, tl, 3.5, 0.6) : '';
                return <div key={j} style={{ width: DV_COLS[j][1], flex: 'none', display: 'flex', alignItems: 'center', justifyContent: DV_COLS[j][2] ? 'flex-end' : 'flex-start', padding: '0 14px', fontSize: 17, fontFamily: j === 3 || j === 4 || j === 5 ? UM : UF, fontWeight: j === 1 ? 600 : 400, color: j === 1 || j === 2 || j === 4 ? U.ink : U.mute, overflow: 'hidden' }}>{txt}</div>;
              })}
              <div style={{ width: DV_COLS[7][1], flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', fontSize: 17, fontWeight: 600 }}>
                {isNew && !sent ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: U.lab }}><span style={{ width: 14, height: 14, borderRadius: 14, border: '2px solid ' + U.dim, borderTopColor: U.sky, transform: 'rotate(' + T * 360 + 'deg)' }}></span>Sending</span>
                  : <span style={{ color: statCol(r[7]) }}>{r[7] === 'f' ? 'Failed' : 'Delivered'}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— Quality Queue screens
const EBG = 'rgba(111,227,255,.13)';
const QCOLS = [['Type', 80], ['Arrived', 180], ['Row', 90], ['Commodity ID', 170], ['Part Description', 290], ['City', 110], ['Extended spend', 170, 1], ['Commodity Level 1', 190], ['Supplier ID', 150, 1]];
const QROWS = [
  ['BLK', '02 Aug, 06:00', '1', 'CA00001', 'Titanium Rev A', 'US', '2,262', 'Electronics', 'PW-10317', [3], 1],
  ['BLK', '08 Aug, 06:00', '412', 'CA00001', 'PCB & PCBA Rev C', 'US', '2,262', 'Electronics', 'PW-10317', [3], 0],
  ['BLK', '02 Aug, 06:00', '9', '—', 'INVESTME', 'GB', '1,940', 'Electronics', 'CA-10136', [3], 1],
  ['ERR', '08 Aug, 06:00', '118', '00002-PW', 'Nickel Alloys Rev B', 'GB', '2,262,000', 'Electronics', 'PW-10317', [6], 0],
  ['ERR', '08 Aug, 06:00', '204', 'CPN-00003', 'Nickel Alloys Rev A', 'GBR', '1,712', 'Forgings', 'PW-10334', [5, 8], 0],
  ['ERR', '06 Aug, 06:00', '341', '00005-PW', 'PCB & PCBA Rev B', 'MX', '2,104', 'Raw Matl', 'PW-10351', [7], 0],
  ['ERR', '05 Aug, 06:00', '88', 'CPN-00006', 'Investment Castings Rev B', 'CA', '—', 'Electronics', 'CA-10136', [6], 0]
];
function QTableUI({ t, tl, T, m }) {
  const objs = [['Commodity', '12', '604'], ['Part', '', '168'], ['Contract', '', '70'], ['Supplier', '', '']];
  const obj = m === 'qmove' ? [0, 1, 2, 0][Math.min(3, Math.floor(Math.max(0, tl - 0.8) / 1.1))] : 0;
  const tf = m === 'qmove' ? (tl < 0.6 ? '' : tl < 2 ? 'BLK' : tl < 3.4 ? 'ERR' : '') : '';
  const held = !(m === 'qmove' && tl > 3.6 && tl < 4.6);
  const iss = m === 'qissue';
  const pop = iss ? MOTION.enter(0, 1, 0.6, 1.1)(tl) * (1 - MOTION.glide(0, 1, 3.9, 4.3)(tl)) : 0;
  const fixed = iss && tl > 3.8;
  const flash = iss ? Math.max(0, 1 - Math.abs(tl - 4.1) / 0.5) : 0;
  const btn = (l, hi) => <span key={l} style={{ padding: '9px 14px', border: '1px solid ' + (hi ? U.hi : U.edge), background: hi ? U.sel : 'transparent', fontSize: 15, fontWeight: 500, color: U.ink }}>{l}</span>;
  return (
    <div style={{ position: 'relative', width: 1560, height: 440, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ overflow: 'hidden', height: 438 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 50, padding: '0 16px', background: '#13203a', borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
          {['Imports', 'Exceptions', 'Jobs', 'Issues', 'Activity'].map(n => <span key={n} style={{ padding: '8px 14px', fontSize: 16, fontWeight: n === 'Exceptions' ? 700 : 500, color: n === 'Exceptions' ? '#05080f' : U.sky, background: n === 'Exceptions' ? U.cyan : 'transparent' }}>{n}</span>)}
          <span style={{ flex: 1 }}></span><span style={{ padding: '7px 14px', border: '1px solid ' + U.edge, fontSize: 15, color: U.ink }}>Refresh</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 70, padding: '0 16px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
          <Box style={{ height: 46, gap: 10 }}><span style={{ fontFamily: UM, fontSize: 12, letterSpacing: '.12em', color: U.lab }}>SOURCE</span><b>SAP</b><span style={{ color: U.lab, fontSize: 10 }}>▾</span></Box>
          <div><div style={{ fontSize: 18, fontWeight: 600, color: U.ink }}>part_master_raw · 08 Aug, 06:00</div><div style={{ fontSize: 13, color: U.mute, marginTop: 2 }}>258 held on this feed · 692 across 7 days</div></div>
          {objs.map(([o, b, e], i) => (
            <div key={o} style={{ padding: '5px 14px', border: '2px solid ' + (i === obj ? U.hi : 'transparent'), background: i === obj ? U.sel : 'transparent' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: i === obj ? U.sky : U.ink }}>{o}</div>
              <div style={{ display: 'flex', gap: 8, fontFamily: UM, fontSize: 12, color: e ? U.cyan : U.lab }}>{b ? <span>● {b}</span> : null}{e ? <span>● {e}</span> : <span>clear</span>}</div>
            </div>
          ))}
          <span style={{ flex: 1 }}></span>
          <span style={{ display: 'flex', border: '1px solid ' + U.edge }}><span style={{ padding: '9px 14px', fontSize: 15, fontWeight: 600, color: held ? '#fff' : U.ink, background: held ? U.hi : 'transparent' }}>Held</span><span style={{ padding: '9px 14px', fontSize: 15, color: held ? U.ink : '#fff', background: held ? 'transparent' : U.hi }}>All</span></span>
          {btn('Columns', m === 'qmove' && tl > 4.4)}{btn('Filter', false)}{btn('Bulk edit', false)}
          <span style={{ padding: '10px 16px', background: U.hi, fontSize: 15, fontWeight: 600, color: '#fff' }}>Submit fixes</span>
        </div>
        <div style={{ display: 'flex', height: 42, background: U.head, borderBottom: '1px solid ' + U.edge }}>
          {QCOLS.map(([c, w, r]) => <div key={c} style={{ width: w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: r ? 'flex-end' : 'flex-start', padding: '0 14px', fontSize: 15, fontWeight: 600, color: U.ink, whiteSpace: 'nowrap' }}>{c}</div>)}
        </div>
        {QROWS.map((r, i) => {
          const blk = r[0] === 'BLK';
          const dim = tf && r[0] !== tf ? 0.22 : 1;
          return (
            <div key={i} style={{ display: 'flex', height: 44, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap', opacity: dim, background: blk ? 'rgba(23,132,241,.08)' : 'transparent', boxShadow: blk ? 'inset 3px 0 0 ' + U.hi : 'none', ...fadeUp(t, 0.4 + i * 0.08, 0.4) }}>
              {QCOLS.map(([c, w, rt], j) => {
                const bad = r[9].includes(j) && !(fixed && i === 3 && j === 6);
                const pulse = m === 'qall' && bad ? 0.6 + 0.4 * Math.sin(T * 3 + i) : 1;
                let txt = j === 0 ? r[0] : r[j];
                if (fixed && i === 3 && j === 6) txt = '2,262';
                const sel = iss && i === 3 && j === 6 && tl > 0.3 && tl < 4.3;
                return (
                  <div key={j} style={{ width: w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: rt ? 'flex-end' : 'flex-start', gap: 8, padding: '0 14px', fontSize: 16,
                    fontFamily: j === 0 || j === 1 || j === 3 || j === 6 || j === 8 ? UM : UF, fontWeight: j === 0 || bad ? 700 : 400,
                    color: j === 0 ? (blk ? U.cyan : U.sky) : (bad ? U.cyan : (j === 1 ? U.mute : U.ink)),
                    background: bad ? 'rgba(111,227,255,' + 0.13 * pulse + ')' : (flash && i === 3 && j === 6 ? 'rgba(23,132,241,' + 0.35 * flash + ')' : 'transparent'),
                    boxShadow: sel ? 'inset 0 0 0 2px ' + U.sky : 'none' }}>
                    {j === 1 && r[10] ? <span style={{ width: 6, height: 6, borderRadius: 6, background: U.cyan }}></span> : null}{txt}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {pop > 0 ? (
        <div style={{ position: 'absolute', left: 380, top: 44, width: 520, background: U.bg, border: '1px solid ' + U.hi, boxShadow: '0 30px 70px rgba(2,4,10,.7)', opacity: pop, transform: 'translateY(' + (1 - pop) * 14 + 'px)', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(111,227,255,.10)', borderBottom: '1px solid ' + U.edge, fontSize: 17, fontWeight: 700, color: U.cyan }}><Dot c={U.cyan}></Dot>Error · this variable will not load<span style={{ flex: 1 }}></span><span style={{ color: U.mute, fontWeight: 400 }}>×</span></div>
          <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            <div><MonoLab>VARIABLE</MonoLab><div style={{ marginTop: 4, fontSize: 16, color: U.ink }}>Commodity › Extended Spend</div></div>
            <div><MonoLab>CLASS</MonoLab><div style={{ marginTop: 4, fontSize: 16, color: U.ink }}>Validation</div></div>
            <div style={{ gridColumn: '1 / 3' }}><MonoLab>RULE BROKEN</MonoLab><div style={{ marginTop: 4, fontSize: 16, color: U.ink }}>Range — must be between 200 and 25,000</div></div>
            <div><MonoLab>CAME IN AS</MonoLab><div style={{ marginTop: 4, fontFamily: UM, fontSize: 17, fontWeight: 700, color: U.cyan }}>2,262,000</div></div>
            <div><MonoLab>ARRIVED</MonoLab><div style={{ marginTop: 4, fontFamily: UM, fontSize: 16, color: U.ink }}>08 Aug, row 118</div></div>
            <div style={{ gridColumn: '1 / 3' }}><MonoLab>CORRECTION</MonoLab>
              <Box style={{ marginTop: 6, fontFamily: UM, fontWeight: 700, boxShadow: 'inset 0 0 0 1px ' + U.hi }}>{typed('2,262', tl, 1.6, 0.6)}{tl < 3.3 && frac(T * 2) < 0.5 ? <span style={{ width: 2, height: 20, background: U.sky, marginLeft: 2 }}></span> : null}</Box>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 18px 18px' }}>
            <span style={{ padding: '12px 20px', background: tl > 3.4 && tl < 3.8 ? U.sky : U.hi, fontSize: 16, fontWeight: 600, color: '#fff' }}>Fix and load</span>
            <span style={{ padding: '12px 20px', border: '1px solid ' + U.edge, fontSize: 16, color: U.ink }}>Apply to all 41 like this</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const CV = [['Commodity', 'Identifier', 1], ['Commodity Name', 'Directory', 1], ['Full Part Description', 'Directory', 0], ['Part Description', 'Directory', 1], ['Extended Spend', 'Number', 1], ['Category', 'List', 0]];
const CO = [['Commodity', '', 1], ['Supplier', '1'], ['Part', 'many'], ['Listing', 'many'], ['Contract', 'via Part'], ['Business Unit', 'via Contract']];
function ColsUI({ t, T }) {
  const add = MOTION.enter(0, 1, 1.4, 1.8)(t);
  const add2 = MOTION.enter(0, 1, 2.6, 3)(t);
  const shown = ['Commodity', 'Commodity Name', 'Part Description', 'Extended Spend'];
  if (add > 0.5) shown.push('Category');
  if (add2 > 0.5) shown.push('Full Part Description');
  const hd = (l, n) => <div style={{ display: 'flex', height: 38, alignItems: 'center', padding: '0 16px', background: U.head, borderBottom: '1px solid ' + U.edge }}><MonoLab style={{ flex: 1 }}>{l}</MonoLab><span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{n}</span></div>;
  const row = (kids, k, st) => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, padding: '0 16px', borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap', fontSize: 16, color: U.ink, ...st }}>{kids}</div>;
  return (
    <div style={{ width: 1200, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 58, padding: '0 22px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
        <span style={{ flex: 1, fontSize: 22, fontWeight: 700, color: U.ink }}>Choose columns</span><MonoLab>ANCHOR OBJECT</MonoLab><b style={{ fontSize: 18, color: U.ink }}>Commodity</b><span style={{ color: U.mute, fontSize: 22 }}>×</span>
      </div>
      <div style={{ padding: '12px 22px', borderBottom: '1px solid ' + U.edge }}><Box style={{ height: 44, color: U.lab, fontSize: 16 }}>Search objects and variables</Box></div>
      <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr' }}>
        <div style={{ borderRight: '1px solid ' + U.edge }}>
          {hd('OBJECTS', '')}
          {CO.map(([o, n, sel], i) => row([<span key="d" style={{ color: U.sky, fontSize: 11 }}>◆</span>, <span key="n" style={{ flex: 1, fontWeight: sel ? 700 : 500, color: sel ? U.sky : U.ink }}>{o}</span>, <span key="c" style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{n}</span>], o, { background: sel ? U.sel : 'transparent', boxShadow: sel ? 'inset 3px 0 0 ' + U.hi : 'none', paddingLeft: i ? 30 : 16 }))}
        </div>
        <div style={{ borderRight: '1px solid ' + U.edge }}>
          {hd('VARIABLES ON COMMODITY', '15')}
          {CV.map(([n, k, on], i) => {
            const c = on || (i === 5 ? add > 0.5 : add2 > 0.5);
            const flash = i === 5 ? Math.sin(add * Math.PI) : (i === 2 ? Math.sin(add2 * Math.PI) : 0);
            return row([
              <span key="b" style={{ width: 18, height: 18, border: '1.5px solid ' + (c ? U.hi : U.lab), background: c ? U.hi : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>{c ? '✓' : ''}</span>,
              <span key="n" style={{ flex: 1 }}>{n}</span>, <span key="k" style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{k}</span>], n, { background: 'rgba(111,227,255,' + 0.14 * flash + ')' });
          })}
        </div>
        <div>
          {hd('SHOWN, IN ORDER', String(10 + shown.length - 2))}
          {shown.slice(-6).map((n, i, arr) => {
            const isNew = (n === 'Category' || n === 'Full Part Description');
            const o = n === 'Category' ? add : (n === 'Full Part Description' ? add2 : 1);
            return row([<span key="i" style={{ width: 22, fontFamily: UM, fontSize: 13, color: U.lab }}>{shown.length - arr.length + i + 1}</span>, <span key="n" style={{ flex: 1, color: isNew ? U.cyan : U.ink, fontWeight: isNew ? 600 : 400 }}>{n}</span>, <span key="x" style={{ color: U.lab }}>×</span>], n, { opacity: o, transform: 'translateX(' + (1 - o) * 20 + 'px)' });
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderTop: '1px solid ' + U.edge, background: U.head, whiteSpace: 'nowrap' }}>
        <b style={{ fontSize: 16, color: U.sky }}>Show all</b><b style={{ fontSize: 16, color: U.sky }}>Reset</b>
        <span style={{ flex: 1, fontSize: 15, color: U.mute }}>{add2 > 0.5 ? 14 : add > 0.5 ? 13 : 12} of 15 on Commodity</span>
        <span style={{ padding: '11px 22px', border: '1px solid ' + U.edge, fontSize: 16, color: U.ink }}>Cancel</span>
        <span style={{ padding: '11px 26px', background: U.hi, fontSize: 16, fontWeight: 600, color: '#fff', boxShadow: t > 3.4 ? '0 0 0 ' + (4 * Math.abs(Math.sin(T * 3))) + 'px rgba(111,227,255,.35)' : 'none' }}>Apply</span>
      </div>
    </div>
  );
}

function BulkUI({ t, T }) {
  const V = [['Commodity Level 1', 'Elec · ELEC', 'Electronics'], ['Category', '— missing —', 'Residential'], ['ITAR Controlled', 'No · — missing —', 'Yes']];
  const done = V.map((_, i) => clamp((t - 0.8 - i * 0.8) / 0.5, 0, 1));
  const n = done.filter(d => d >= 1).length;
  const W4 = ['240px', '240px', '50px', '1fr', '110px'];
  const cell = (c, k, st) => <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '0 16px', borderRight: '1px solid ' + U.edge, whiteSpace: 'nowrap', ...st }}>{c}</div>;
  return (
    <div style={{ width: 1000, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 58, padding: '0 24px', borderBottom: '1px solid ' + U.edge }}><span style={{ flex: 1, fontSize: 22, fontWeight: 700, color: U.ink }}>Bulk edit</span><span style={{ color: U.mute, fontSize: 22 }}>×</span></div>
      <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}><span style={{ padding: '9px 16px', border: '1px solid ' + U.edge, fontSize: 16, color: U.ink }}>A whole column</span><span style={{ fontSize: 15, color: U.mute }}>What the three held records hold now sits beside what they become.</span></div>
        <div style={{ border: '1px solid ' + U.edge }}>
          <div style={{ display: 'grid', gridTemplateColumns: W4.join(' '), height: 40, background: U.head, borderBottom: '1px solid ' + U.edge }}>
            {['VARIABLE', 'CURRENT VALUE', '', 'NEW VALUE', 'RECORDS'].map((h, k) => cell(<MonoLab style={{ color: k === 3 ? U.sky : U.lab }}>{h}</MonoLab>, k, { justifyContent: k === 4 ? 'flex-end' : 'flex-start' }))}
          </div>
          {V.map(([a, b, c], i) => (
            <div key={a} style={{ display: 'grid', gridTemplateColumns: W4.join(' '), height: 56, borderBottom: i < 2 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.2 + i * 0.12, 0.4) }}>
              {cell(a, 0, { fontSize: 16, color: U.ink })}
              {cell(b, 1, { fontSize: 16, color: U.mute, textDecoration: done[i] >= 1 ? 'line-through' : 'none', textDecorationColor: U.lab })}
              {cell('→', 2, { color: done[i] > 0 ? U.cyan : U.lab, justifyContent: 'center' })}
              {cell(<Box style={{ height: 40, width: '100%', fontSize: 16, boxShadow: done[i] > 0 && done[i] < 1 ? 'inset 0 0 0 2px ' + U.hi : 'none' }}>{typed(c, t, 0.8 + i * 0.8, 0.45)}<span style={{ flex: 1 }}></span><span style={{ color: U.lab, fontSize: 10 }}>▾</span></Box>, 3, {})}
              {cell(<b style={{ fontFamily: UM, color: U.ink }}>3</b>, 4, { justifyContent: 'flex-end', borderRight: 'none' })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: U.sky }}><span style={{ width: 22, height: 22, borderRadius: 22, border: '1px solid ' + U.edge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>Add a variable</div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 16px', border: '1px solid rgba(111,227,255,.35)', background: 'rgba(111,227,255,.07)', fontSize: 15, lineHeight: 1.4, color: '#c9d4e6', ...fadeUp(t, 3.1) }}><span style={{ marginTop: 6 }}><Dot c={U.cyan}></Dot></span>Two of the three already carry a value for ITAR Controlled. Writing it here counts as the fix: those records load and leave the queue.</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', borderTop: '1px solid ' + U.edge, background: U.head, whiteSpace: 'nowrap' }}>
        <span style={{ flex: 1, fontSize: 15, color: U.mute }}>3 held records · {n} variables · <b style={{ fontFamily: UM, color: U.ink }}>{n * 3}</b> values written</span>
        <span style={{ padding: '11px 20px', border: '1px solid ' + U.edge, fontSize: 16, color: U.ink }}>Save</span>
        <span style={{ padding: '11px 20px', background: U.hi, fontSize: 16, fontWeight: 600, color: '#fff', boxShadow: t > 3.6 ? '0 0 0 ' + (4 * Math.abs(Math.sin(T * 3))) + 'px rgba(111,227,255,.35)' : 'none' }}>Submit</span>
        <span style={{ padding: '11px 20px', border: '1px solid ' + U.edge, fontSize: 16, color: U.ink }}>Discard</span>
      </div>
    </div>
  );
}

const DUPV = [['SSN', '541-88-2210', '541-88-2210', '—', 1, 1], ['Passport', 'X4471982', '—', 'X4471982', 2, 1], ['Full Name', 'R. Alvarez-Nuñez', 'Rosa Alvarez', 'Rosa Alvarez-Nuñez', 2], ['Date of Birth', '14 Mar 1981', '14 Mar 1981', '14 Mar 1981', 1], ['Part Description', 'Titanium Rev A', 'PCB & PCBA Rev C', 'Closed Die Rev C', 2], ['Supplier ID', 'PW-10317', 'PW-10317', 'PW-10334', 1]];
function DupUI({ t, T }) {
  const G = '200px 300px 1fr 1fr 290px';
  const pickAt = i => 0.9 + i * 0.55;
  const cell = (k, kids, st) => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', whiteSpace: 'nowrap', borderRight: '1px solid ' + U.edge, ...st }}>{kids}</div>;
  const cb = (on, k) => <span key={k} style={{ width: 18, height: 18, flex: 'none', border: '1.5px solid ' + (on ? U.hi : U.lab), background: on ? U.hi : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>{on ? '✓' : ''}</span>;
  return (
    <div style={{ width: 1560, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62, padding: '0 22px', borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
        <span style={{ width: 14, height: 14, background: U.cyan }}></span><span style={{ fontSize: 22, fontWeight: 700, color: U.ink }}>Reconciling potential duplicates</span>
        <span style={{ padding: '5px 10px', border: '1px solid ' + U.edge, fontFamily: UM, fontSize: 15, color: U.ink }}>CA00001</span>
        <span style={{ fontSize: 16, color: U.mute }}>This row matches two records already loaded — one on SSN, the other on Passport.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: G, height: 42, background: U.head, borderBottom: '1px solid ' + U.edge }}>
        {cell(0, '')}{cell(1, [<MonoLab key="a" style={{ color: U.ink }}>INCOMING</MonoLab>, <span key="b" style={{ fontSize: 14, color: U.lab }}>this feed</span>])}
        <div style={{ gridColumn: '3 / 5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRight: '1px solid ' + U.edge, background: 'rgba(23,132,241,.08)' }}><MonoLab style={{ color: U.sky }}>CANDIDATES ALREADY IN DATA HUB</MonoLab><span style={{ fontSize: 14, color: U.lab }}>two records match</span></div>
        {cell(4, <MonoLab style={{ color: U.cyan }}>WHAT LANDS</MonoLab>, { borderRight: 'none' })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: G, height: 56, borderBottom: '1px solid ' + U.edge, background: U.head }}>
        {cell(0, <b style={{ fontSize: 16, color: U.ink }}>Variable</b>)}
        {cell(1, <div><div style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>08 Aug · row 412</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>part_master_raw</div></div>)}
        {cell(2, [cb(false, 'c'), <div key="d"><div style={{ fontFamily: UM, fontSize: 16, fontWeight: 600, color: U.ink }}>CA00001</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>matches on SSN</div></div>])}
        {cell(3, [cb(false, 'c'), <div key="d"><div style={{ fontFamily: UM, fontSize: 16, fontWeight: 600, color: U.ink }}>CA00013</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>matches on Passport</div></div>])}
        {cell(4, <div><div style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>One record</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>the other is released</div></div>, { borderRight: 'none' })}
      </div>
      {DUPV.map(([n, inc, a, b, pick, id], i) => {
        const p = MOTION.enter(0, 1, pickAt(i), pickAt(i) + 0.35)(t);
        const on = p > 0.5;
        const val = pick === 1 ? a : b;
        const cand = (w, v, k) => {
          const sel = on && pick === w;
          return cell(k, [v === '—' ? null : cb(sel, 'b'), <span key="v" style={{ fontSize: 16, fontFamily: id ? UM : UF, fontWeight: sel ? 700 : 400, color: v === '—' ? U.lab : (sel ? U.sky : U.ink) }}>{v}</span>], { background: sel ? U.sel : 'transparent', boxShadow: sel ? 'inset 0 0 0 1.5px ' + U.hi : 'none' });
        };
        return (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: G, height: 46, borderBottom: i < DUPV.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.3 + i * 0.07, 0.4) }}>
            {cell(0, [id ? <span key="i" style={{ padding: '2px 6px', border: '1px solid ' + U.edge, fontFamily: UM, fontSize: 11, color: U.lab }}>ID</span> : null, <b key="n" style={{ fontSize: 16, color: U.ink }}>{n}</b>], { paddingLeft: id ? 16 : 52 })}
            {cell(1, <span style={{ fontSize: 16, fontFamily: id ? UM : UF, fontWeight: id ? 700 : 400, color: id ? U.sky : U.ink }}>{inc}</span>, { background: id ? 'rgba(23,132,241,.08)' : 'transparent' })}
            {cand(1, a, 2)}{cand(2, b, 3)}
            {cell(4, <span style={{ fontSize: 16, fontFamily: id ? UM : UF, fontWeight: id ? 700 : 400, color: id ? U.cyan : U.ink, opacity: p, transform: 'translateX(' + (1 - p) * -16 + 'px)' }}>{val}</span>, { borderRight: 'none', background: id && on ? 'rgba(111,227,255,.08)' : 'transparent' })}
          </div>
        );
      })}
    </div>
  );
}

// ——— Data Hub screens
const HN = [['Supplier', 99, '1,284', 70, 90], ['Commodity', 100, '459', 240, 200], ['Listing', 100, '908', 70, 390], ['Showing', 98, '4,215', 250, 400], ['Part', 97, '3,812', 420, 90], ['Turn', 91, '486', 440, 300], ['Application', 95, '1,733', 590, 400], ['Contract', 92, '2,871', 700, 230], ['Renewal', 98, '612', 820, 70], ['Coverage', 99, '3,104', 980, 110], ['Business Unit', 94, '2,946', 1130, 230], ['Purchase Order', 89, '148,392', 900, 380], ['PO Line', 96, '41,206', 1080, 410], ['Receivable', 97, '38,914', 1260, 410], ['Payment', 99, '36,502', 1420, 130], ['Termination', 100, '74', 1440, 330]];
const HE = [[0, 1], [1, 4], [1, 2], [2, 3], [3, 6], [6, 7], [4, 5], [4, 7], [7, 8, 'Prior Contract'], [7, 9], [9, 10, 'Consumer'], [10, 11, 'Bill To'], [7, 11], [7, 15], [11, 12], [12, 13], [13, 14]];
const HORD = [0, 1, 4, 2, 3, 5, 6, 7, 8, 9, 11, 10, 15, 12, 13, 14];
const scoreCol = s => (s >= 95 ? U.sky : U.cyan);
function HubGraphUI({ t, T }) {
  const nIn = i => MOTION.enter(0, 1, 0.3 + HORD.indexOf(i) * 0.14, 0.75 + HORD.indexOf(i) * 0.14)(t);
  const health = MOTION.enter(0, 1, 2.4, 3)(t);
  const metr = [['Records', 287518, U.hi], ['Variables', 214, U.sky], ['Errors', 720, U.cyan], ['Warnings', 2000, U.lo], ['Missing values', 3698, U.lab]];
  const hot = t > 3.4 ? [11, 7, 10][Math.floor((t - 3.4) / 0.8) % 3] : -1;
  return (
    <div style={{ display: 'flex', gap: 30, fontFamily: UF }}>
      <div style={{ position: 'relative', width: 1500, height: 480, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', ...fadeUp(t, 0, 0.5) }}>
        <svg width={1500} height={480} style={{ position: 'absolute', inset: 0 }}>
          <defs><marker id="harr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#4f6fb0"></path></marker></defs>
          {HE.map(([a, b, lab], k) => {
            const A = HN[a], B = HN[b];
            const dx = B[3] - A[3], dy = B[4] - A[4], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
            const x1 = A[3] + ux * 54, y1 = A[4] + uy * 54, x2 = B[3] - ux * 58, y2 = B[4] - uy * 58;
            const e = MOTION.glide(0, 1, 0.3 + Math.max(HORD.indexOf(a), HORD.indexOf(b)) * 0.14 + 0.2, 0.3 + Math.max(HORD.indexOf(a), HORD.indexOf(b)) * 0.14 + 0.7)(t);
            const on = hot === a || hot === b;
            const u = frac(T * 0.4 + k * 0.17);
            return (
              <g key={k} opacity={e}>
                <line x1={x1} y1={y1} x2={lerp(x1, x2, e)} y2={lerp(y1, y2, e)} stroke={on ? U.sky : '#4f6fb0'} strokeWidth={on ? 2.4 : 1.6} markerEnd={e > 0.95 ? 'url(#harr)' : undefined}></line>
                {e >= 1 ? <circle cx={lerp(x1, x2, u)} cy={lerp(y1, y2, u)} r={3} fill={U.cyan} opacity={Math.sin(u * Math.PI)}></circle> : null}
                {lab ? <g transform={'translate(' + (x1 + x2) / 2 + ' ' + (y1 + y2) / 2 + ')'}><rect x={-58} y={-12} width={116} height={24} fill={U.bg} stroke={U.edge}></rect><text textAnchor="middle" y={5} fontFamily={UM} fontSize={13} fill={U.lab}>{lab}</text></g> : null}
              </g>
            );
          })}
        </svg>
        {HN.map(([n, s, c, x, y], i) => {
          const o = nIn(i), on = hot === i;
          return (
            <div key={n} style={{ position: 'absolute', left: x - 54, top: y - 54, width: 108, height: 108, borderRadius: 108, background: '#0e1730', border: '2px solid ' + (on ? U.cyan : '#3b5fae'), boxShadow: on ? '0 0 0 6px rgba(111,227,255,.14),0 0 40px rgba(111,227,255,.3)' : '0 0 24px rgba(23,132,241,.18)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: o, transform: 'scale(' + (0.6 + 0.4 * o) + ')' }}>
              <b style={{ fontFamily: UM, fontSize: 18, color: scoreCol(s) }}>{Math.round(s * clamp((t - 0.4 - HORD.indexOf(i) * 0.14) / 0.8, 0, 1))}</b>
              <span style={{ fontSize: n.length > 11 ? 14 : 16, fontWeight: 600, color: U.ink, lineHeight: 1.1, maxWidth: 96 }}>{n}</span>
              <span style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 2 }}>{c}</span>
            </div>
          );
        })}
      </div>
      <div style={{ width: 360, height: 480, flex: 'none', background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6)', opacity: health, transform: 'translateX(' + (1 - health) * 20 + 'px)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid ' + U.edge }}>
          <MonoLab>ENGINE HEALTH</MonoLab>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}><b style={{ fontSize: 76, lineHeight: 1, color: U.cyan }}>{Math.round(94 * clamp((t - 2.5) / 1, 0, 1))}</b><span style={{ fontSize: 18, color: U.mute }}>quality score</span></div>
          <div style={{ marginTop: 14, height: 8, background: U.faint }}><div style={{ height: 8, width: 94 * clamp((t - 2.5) / 1, 0, 1) + '%', background: U.hi }}></div></div>
        </div>
        <div style={{ padding: '14px 24px' }}>
          <MonoLab style={{ marginBottom: 6 }}>ACROSS THE ENGINE</MonoLab>
          {metr.map(([l, n, c], k) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, borderBottom: k < 4 ? '1px solid ' + U.edge : 'none' }}>
              <Dot c={c}></Dot><span style={{ flex: 1, fontSize: 18, color: '#c9d0de' }}>{l}</span>
              <b style={{ fontFamily: UM, fontSize: 20, color: U.ink }}>{Math.round(n * Easing.easeOutCubic(clamp((t - 2.7 - k * 0.12) / 1, 0, 1))).toLocaleString()}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HT = [['00017-PW — Nickel Alloys Rev B', 'Nickel Alloys Rev B', 'GB', '2,262', 'Electronics', 97, 0, 1, 1], ['CPN-00024 — Closed Die Rev A', 'Closed Die Rev A', 'GB', '1,914', 'Electronics', 96, 0, 1, 2], ['CA00025 — Titanium Rev B', 'Titanium Rev B', 'GB', '2,048', 'Electronics', 94, 1, 2, 3], ['00020-PW — PCB & PC', 'PCB & PC', 'GB', '1,700', 'Elec', 82, 2, 5, 8], ['CPN-00042 — Titani', 'Titani', 'US', '1,486', '—', 74, 2, 7, 11], ['00041-PW — Titanium Rev A', 'Titanium Rev A', 'CA', '957', 'Duplex', 88, 1, 3, 5]];
const HG = [['1', '2,262.000', '00017-PW — Nickel Alloys Rev B', '2,262', 'MX', 'PW', 'No', '1998'], ['2', '1,568.000', 'CPN-00018 — Titanium Rev C', '1,568', 'MX', 'PW', 'No', '1974'], ['3', '1,666.000', 'CPN-00024 — Closed Die Rev A', '1,666', 'CA', 'CA', 'No', '2004'], ['4', '1,666.000', 'CA00025 — Titanium Rev B', '1,666', 'CA', 'CA', 'Yes', '1989'], ['5', '2,019.000', 'CA00016 — NICKEL A', '2,019', 'GB', 'PW', 'No', '2011'], ['6', '1,300.000', '00038-PW — Complex Machining', '1,300', 'US', 'RAY', 'No', '1962'], ['7', '1,342.000', 'CA00034 — Investment Castings', '1,342', 'US', 'RAY', 'Yes', '1958']];
const HGC = [['', 60], ['#', 60], ['Commodity', 170], ['Commodity Name', 380], ['Extended', 140, 1], ['City', 110], ['Business Unit', 170], ['ITAR Controlled', 170], ['Vintage', 120]];
function HubRecUI({ t, tl, T, m }) {
  const tiles = m === 'hbulk' ? 1 : MOTION.glide(0, 1, 2.8, 3.6)(tl);
  const bar = m === 'hbulk' ? MOTION.glide(0, 1, 0.1, 0.7)(tl) : 0;
  const pick = [3, 4, 5];
  const selN = m === 'hbulk' ? pick.filter((_, k) => tl > 1 + k * 0.45).length : 0;
  const act = m === 'hbulk' ? MOTION.enter(0, 1, 2.3, 2.8)(tl) : 0;
  const applied = m === 'hbulk' ? MOTION.glide(0, 1, 3.6, 4.4)(tl) : 0;
  const q = (s, i) => (pick.includes(i) && applied > 0 ? Math.round(lerp(s, 95 + (i % 2), applied)) : s);
  const rowHot = m === 'hgrid' && tl > 0.8 && tl < 2.8 ? Math.floor((tl - 0.8) / 0.4) % 7 : -1;
  return (
    <div style={{ position: 'relative', width: 1560, height: 480, overflow: 'hidden', background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 60, padding: '0 18px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: U.ink }}>Commodity</span><span style={{ fontFamily: UM, fontSize: 15, color: U.lab }}>459 records</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ display: 'flex', border: '1px solid ' + U.edge }}>{['Grid', 'Tiles'].map((l, k) => { const on = (tiles > 0.5 ? 1 : 0) === k; return <span key={l} style={{ padding: '9px 18px', fontSize: 16, fontWeight: 600, color: on ? '#fff' : U.ink, background: on ? U.hi : 'transparent' }}>{l}</span>; })}</span>
        <Box style={{ height: 42, width: 240, color: U.lab, fontSize: 16 }}>Search records</Box>
      </div>
      <div style={{ height: 56 * bar, overflow: 'hidden', background: '#0c1630', borderBottom: bar ? '1px solid ' + U.edge : 'none' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 26, padding: '0 20px', fontSize: 18, color: '#c9d0de', whiteSpace: 'nowrap', opacity: bar }}>
          <span>Records <b style={{ color: U.ink }}>459</b></span>
          {[['Quality', applied > 0.5 ? 96 : 94, U.hi], ['Errors', applied > 0.5 ? 1 : 6, U.cyan], ['Warnings', applied > 0.5 ? 9 : 21, U.lo], ['Missing', applied > 0.5 ? 24 : 48, U.lab]].map(([l, n, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot c={c}></Dot>{l} <b style={{ color: U.ink }}>{n}</b></span>)}
          <span style={{ flex: 1 }}></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', border: '1px solid ' + U.edge, fontSize: 16 }}>Jobs <b style={{ color: U.ink }}>2</b><span style={{ color: U.lab }}>1 running · 1 queued</span><b style={{ color: U.sky }}>Open in Quality Queue</b></span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1560, opacity: 1 - tiles }}>
          <div style={{ display: 'flex', height: 42, background: U.head, borderBottom: '1px solid ' + U.edge }}>
            {HGC.map(([c, w, r]) => <div key={c + w} style={{ width: w, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: r ? 'flex-end' : 'flex-start', padding: '0 14px', fontSize: 15, fontWeight: 600, color: U.ink, whiteSpace: 'nowrap' }}>{c}{c === 'Extended' ? <span style={{ marginLeft: 6, fontFamily: UM, fontSize: 12, color: U.sky }}>▼2</span> : null}</div>)}
          </div>
          {HG.map((r, i) => (
            <div key={i} style={{ display: 'flex', height: 44, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap', background: i === rowHot ? U.sel : 'transparent', boxShadow: i === rowHot ? 'inset 3px 0 0 ' + U.hi : 'none', ...fadeUp(tl, 0.2 + i * 0.07, 0.4) }}>
              <div style={{ width: 60, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 16, height: 16, border: '1.5px solid ' + U.lab }}></span></div>
              {r.map((c, j) => <div key={j} style={{ width: HGC[j + 1][1], flex: 'none', display: 'flex', alignItems: 'center', justifyContent: HGC[j + 1][2] ? 'flex-end' : 'flex-start', padding: '0 14px', fontSize: 16, fontFamily: j === 1 || j === 3 || j === 7 ? UM : UF, color: j === 0 ? U.lab : U.ink, overflow: 'hidden' }}>{c}</div>)}
            </div>
          ))}
        </div>
        {tiles > 0 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1560, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, opacity: tiles }}>
            {HT.map(([title, pd, city, ext, cl, s, e, w, mi], i) => {
              const sel = m === 'hbulk' && pick.indexOf(i) >= 0 && pick.indexOf(i) < selN;
              const o = m === 'hgrid' ? MOTION.enter(0, 1, 2.9 + i * 0.08, 3.4 + i * 0.08)(tl) : 1;
              const fixCl = pick.includes(i) && applied > 0.5;
              const qs = q(s, i);
              const pulse = m === 'hbulk' && tl < 1 ? 0.5 + 0.5 * Math.sin(T * 4 + i) : 0;
              return (
                <div key={title} style={{ height: 170, background: sel ? 'rgba(23,132,241,.10)' : '#0e1730', border: '1px solid ' + (sel ? U.hi : U.edge), boxShadow: sel ? '0 0 0 1px ' + U.hi : 'none', padding: '14px 16px', display: 'flex', gap: 14, opacity: o, transform: 'scale(' + (0.94 + 0.06 * o) + ')', whiteSpace: 'nowrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 600, color: U.ink }}>
                      {m === 'hbulk' ? <span style={{ width: 18, height: 18, flex: 'none', border: '1.5px solid ' + (sel ? U.hi : U.lab), background: sel ? U.hi : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>{sel ? '✓' : ''}</span> : null}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 6, marginTop: 12, fontSize: 16 }}>
                      {[['Part Description', pd], ['City', city], ['Extended Spend', ext], ['Commodity Level 1', fixCl ? 'Electronics' : cl]].map(([k, val], z) => [
                        <span key={'k' + z} style={{ color: U.lab }}>{k}</span>,
                        <span key={'v' + z} style={{ color: z === 3 && fixCl ? U.cyan : U.ink, fontWeight: z === 3 && fixCl ? 600 : 400 }}>{val}</span>])}
                    </div>
                  </div>
                  <div style={{ width: 138, flex: 'none', border: '1px solid ' + U.edge, padding: '10px 12px', alignSelf: 'flex-start', boxShadow: pulse ? '0 0 0 ' + 2 * pulse + 'px rgba(111,227,255,.3)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}><MonoLab style={{ flex: 1, fontSize: 11 }}>QUALITY</MonoLab><b style={{ fontSize: 24, color: scoreCol(qs) }}>{qs}</b></div>
                    {[['Errors', e], ['Warnings', w], ['Missing', mi]].map(([k, n]) => <div key={k} style={{ display: 'flex', fontSize: 14, color: U.lab, marginTop: 4 }}><span style={{ flex: 1 }}>{k}</span><b style={{ fontFamily: UM, color: U.ink }}>{pick.includes(i) && applied > 0.5 ? Math.floor(n / 3) : n}</b></div>)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {act > 0 ? (
        <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translate(-50%,' + (1 - act) * 30 + 'px)', opacity: act, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 14px 12px 22px', background: '#13203a', border: '1px solid ' + U.hi, boxShadow: '0 20px 50px rgba(2,4,10,.7)', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 17, color: U.ink }}><b style={{ fontFamily: UM }}>3</b> records selected</span>
          <span style={{ fontSize: 16, color: U.mute }}>Commodity Level 1 → <b style={{ color: U.cyan }}>Electronics</b></span>
          <span style={{ padding: '10px 18px', background: tl > 3.3 && tl < 3.7 ? U.sky : U.hi, fontSize: 16, fontWeight: 600, color: '#fff' }}>{applied > 0.5 ? 'Applied' : 'Bulk edit'}</span>
        </div>
      ) : null}
    </div>
  );
}

const HRAIL = [['hub', '360 View'], ['alt_route', 'Data Lineage'], ['schedule', 'Record Timeline'], ['history', 'Variable History'], ['check', 'Approval Details'], ['account_tree', 'Workflow Linkages'], ['receipt_long', 'Action Logs']];
function HubRecordUI({ t, T }) {
  const seq = [0, 1, 2, 4];
  const k = Math.min(3, Math.floor(Math.max(0, t - 0.6) / 1.35));
  const tab = seq[k];
  const tt = t - 0.6 - k * 1.35;
  const tin = MOTION.enter(0, 1, 0, 0.4)(tt);
  let body;
  if (tab === 0) body = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', fontSize: 18 }}>
      {[['Part Description', 'PCB & PC'], ['City', 'GB'], ['Extended Spend', '1,700'], ['Commodity Level 1', 'Electronics'], ['Business Unit', 'CA'], ['ITAR Controlled', 'Yes']].map(([a, b], z) => (
        <div key={a} style={{ display: 'flex', borderBottom: '1px solid ' + U.edge, paddingBottom: 10, ...fadeUp(tt, z * 0.06, 0.3) }}><span style={{ width: 200, color: U.lab }}>{a}</span><span style={{ color: U.ink }}>{b}</span></div>
      ))}
      <div style={{ gridColumn: '1 / 3', display: 'flex', gap: 10, marginTop: 8 }}>{['Supplier · PW-10317', 'Part · 3 linked', 'Contract · CT-2214'].map((c, z) => <span key={c} style={{ padding: '8px 14px', border: '1px solid ' + U.hi, color: U.sky, fontSize: 16, ...fadeUp(tt, 0.4 + z * 0.1, 0.3) }}>{c}</span>)}</div>
    </div>
  );
  else if (tab === 1) body = (
    <svg width={900} height={250}>
      {[['SAP · part_master_raw', 40], ['NetSuite · GL_Detail', 125], ['Sage50 · NominalLedger', 210]].map(([n, y], z) => {
        const e = MOTION.glide(0, 1, 0.2 + z * 0.15, 0.8 + z * 0.15)(tt);
        const d = 'M 300 ' + y + ' C 450 ' + y + ', 520 125, 640 125';
        return (
          <g key={n}>
            <rect x={0} y={y - 26} width={300} height={52} fill="#0e1730" stroke={U.edge}></rect>
            <text x={18} y={y + 6} fontFamily={UM} fontSize={17} fill={U.ink}>{n}</text>
            <path d={d} fill="none" stroke={U.sky} strokeWidth={2} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - e}></path>
            {e >= 1 ? <path d={d} fill="none" stroke={U.cyan} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" strokeDashoffset={-frac(T * 0.5 + z * 0.3)}></path> : null}
          </g>
        );
      })}
      <rect x={640} y={90} width={250} height={70} fill="rgba(23,132,241,.14)" stroke={U.hi} strokeWidth={2}></rect>
      <text x={660} y={122} fontFamily={UM} fontSize={17} fontWeight={700} fill={U.ink}>00020-PW</text>
      <text x={660} y={146} fontSize={15} fill={U.mute}>merged record</text>
    </svg>
  );
  else if (tab === 2) body = (
    <div style={{ position: 'relative', paddingLeft: 30 }}>
      <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: U.edge }}></div>
      {[['07 Aug, 22:14', 'Loaded from SAP · part_master_raw'], ['07 Aug, 22:20', 'Held in Quality Queue — Commodity Level 1 invalid'], ['08 Aug, 05:40', 'Corrected by bulk edit — Elec → Electronics'], ['08 Aug, 05:48', 'Released to Data Hub']].map(([d, e], z) => (
        <div key={d} style={{ position: 'relative', display: 'flex', gap: 24, height: 56, alignItems: 'center', ...fadeUp(tt, z * 0.2, 0.35) }}>
          <span style={{ position: 'absolute', left: -28, width: 14, height: 14, borderRadius: 14, background: z === 3 ? U.cyan : U.hi }}></span>
          <span style={{ width: 150, fontFamily: UM, fontSize: 16, color: U.lab }}>{d}</span><span style={{ fontSize: 18, color: U.ink }}>{e}</span>
        </div>
      ))}
    </div>
  );
  else body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[['Data steward', 'Approved', '08 Aug, 05:44'], ['Commodity owner', 'Approved', '08 Aug, 05:46'], ['Finance review', 'Approved', '08 Aug, 05:48']].map(([r, s, d], z) => {
        const ok = tt > 0.5 + z * 0.4;
        return (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 60, padding: '0 20px', border: '1px solid ' + (ok ? U.hi : U.edge), background: ok ? 'rgba(23,132,241,.08)' : 'transparent' }}>
            <span style={{ width: 26, height: 26, borderRadius: 26, border: '2px solid ' + (ok ? U.hi : U.lab), background: ok ? U.hi : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>{ok ? '✓' : ''}</span>
            <span style={{ flex: 1, fontSize: 18, color: U.ink }}>{r}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: ok ? U.sky : U.lab }}>{ok ? s : 'Pending'}</span>
            <span style={{ width: 150, textAlign: 'right', fontFamily: UM, fontSize: 15, color: U.lab }}>{ok ? d : ''}</span>
          </div>
        );
      })}
    </div>
  );
  return (
    <div style={{ display: 'flex', width: 1300, height: 480, background: U.bg, border: '1px solid ' + U.edge, boxShadow: '0 30px 80px rgba(2,4,10,.6),0 0 60px rgba(23,132,241,.10)', fontFamily: UF, ...fadeUp(t, 0, 0.6) }}>
      <div style={{ width: 120, flex: 'none', borderRight: '1px solid ' + U.edge, background: '#0c1630', paddingTop: 6 }}>
        {HRAIL.map(([ic, l], i) => (
          <div key={l} style={{ height: 66, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textAlign: 'center', color: i === tab ? U.cyan : U.lab, background: i === tab ? U.sel : 'transparent', boxShadow: i === tab ? 'inset 3px 0 0 ' + U.cyan : 'none' }}>
            <span className="material-icons" style={{ fontSize: 22 }}>{ic}</span><span style={{ fontSize: 12, lineHeight: 1.15, maxWidth: 100 }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 86, padding: '0 30px', borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
          <div style={{ flex: 1 }}><MonoLab>COMMODITY · RECORD</MonoLab><div style={{ marginTop: 6, fontSize: 26, fontWeight: 700, color: U.ink }}>00020-PW — PCB & PC</div></div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 18px', border: '1px solid ' + U.edge }}><MonoLab>QUALITY</MonoLab><b style={{ fontSize: 30, color: U.sky }}>96</b></div>
        </div>
        <div style={{ padding: '22px 30px' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: U.sky, marginBottom: 16, opacity: tin }}>{HRAIL[tab][1]}</div>
          <div style={{ opacity: tin, transform: 'translateY(' + (1 - tin) * 10 + 'px)' }}>{body}</div>
        </div>
      </div>
    </div>
  );
}

const UI_PANELS = { dataflow: [DataFlowUI, 1400, 620, 0.62, 322], addsource: [AddSourceUI, 820, 680, 0.58, 310], cleanser: [CleanserUI, 1500, 424, 0.84, 330], dest: [DestUI, 1136, 520, 0.68, 366], dest2: [DestUI, 1136, 520, 0.68, 366], deliveries: [DeliveriesUI, 1500, 440, 0.76, 362], status: [DeliveriesUI, 1500, 440, 0.76, 362], qall: [QTableUI, 1560, 440, 0.78, 364], qmove: [QTableUI, 1560, 440, 0.78, 364], qissue: [QTableUI, 1560, 440, 0.78, 364], qcols: [ColsUI, 1200, 485, 0.72, 364], qbulk: [BulkUI, 1000, 520, 0.68, 364], qdup: [DupUI, 1560, 436, 0.8, 364], hgraph: [HubGraphUI, 1890, 480, 0.7, 366], hgrid: [HubRecUI, 1560, 480, 0.72, 366], hbulk: [HubRecUI, 1560, 480, 0.72, 366], hrecord: [HubRecordUI, 1300, 480, 0.72, 366] };
function Ui({ T, a, a0, mode, prev }) {
  const t = T - a;
  const one = (m, tt, o, key, tl) => {
    const [P, w, h, s, top] = UI_PANELS[m];
    return (
      <div key={key} style={{ position: 'absolute', left: 1000 - (w * s) / 2, top: top, width: w, height: h, transform: 'scale(' + s + ')', transformOrigin: '0 0', opacity: o }}>
        <P t={tt} tl={tl == null ? tt : tl} T={T} m={m}></P>
      </div>
    );
  };
  const fin = prev ? MOTION.glide(0, 1, 0.25, 0.9)(t) : 1;
  if (prev && UI_PANELS[prev][0] === UI_PANELS[mode][0]) return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'relative', width: 1920, height: 1080 }}>{one(mode, T - a0, 1, 'c', t)}</div>
    </foreignObject>
  );
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'relative', width: 1920, height: 1080 }}>
        {prev && fin < 1 ? one(prev, 99, 1 - MOTION.glide(0, 1, 0, 0.45)(t), 'p') : null}
        {one(mode, prev ? t - 0.25 : t, fin, 'c')}
      </div>
    </foreignObject>
  );
}

// ——— Data MAIA: "Your Logical Data Model is ready", with a camera that follows the script
const MSRC = [['savings_headwinds_raw', 'GLData2', '16 cols', 'FILE', U.cyan], ['netsuite', 'PowerSteering_GL_Detail', '12 cols', 'API', U.hi], ['quickbooks', 'SIP_GeneralLedger', '10 cols', 'DATABASE', U.sky], ['sage', 'Sage50_NominalLedger', '11 cols', 'DATABASE', '#4f6fd6']];
const MOBJ = [['General Spend Ledger', '4 sources merged', 14, 'Perfect'], ['Chart of Accounts', '4 sources merged', 4, 'Perfect'], ['Counterparty', '4 sources merged', 1, 'Likely'], ['Legal Entity', '1 source', 1, 'Likely'], ['Department', '1 source', 1, 'Likely'], ['Currency Reference', '2 sources merged', 1, 'Doubtful']];
const MEDGE = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [1, 3], [3, 4], [0, 5], [2, 5]];
const MDST = [['PowerSteering journal', 'API', 'General Spend Ledger, Chart of Accou…'], ['Entity statements', 'File', 'Counterparty, General Spend Ledger · …']];
const MOD = [[0, 0], [1, 1], [2, 1], [3, 2], [4, 2]];
const SY2 = i => 535 + i * 101, OY2 = i => 433 + i * 100, DY2 = i => [433, 533, 618][i];
const MREG = [[0, 380, 1040, 560], [0, 380, 1040, 560], [0, 0, 2120, 1080], [0, 330, 1490, 690], [500, 80, 1040, 930], [500, 80, 1040, 930], [1500, 318, 620, 760], [500, 330, 1000, 690]];
const VB = { x: 660, y: 108, w: 1124, h: 598 };
const stat = s => ({ Perfect: [U.sky, 'rgba(125,179,238,.12)'], Likely: [U.hi, 'rgba(23,132,241,.14)'], Doubtful: [U.cyan, 'rgba(111,227,255,.12)'] }[s]);
const count = (n, t, a, d) => Math.round(n * Easing.easeOutCubic(clamp((t - a) / d, 0, 1)));

const MAIA_OFF = 0;
function Maia({ T, mode }) {
  const { CUES } = useComposition();
  const A = i => CUES['L' + (i + 1 + MAIA_OFF)];
  const L = mode, tl = T - A(L);
  const at = (i, dt = 0) => T - A(i) - dt;
  const reg = k => { const [x, y, w, h] = MREG[k]; const s = Math.min(VB.w / w, VB.h / h); return [x + w / 2, y + h / 2, s]; };
  const u = L > 0 ? MOTION.glide(0, 1, 0, 1.2)(tl) : 1;
  const r0 = reg(Math.max(0, L - 1)), r1 = reg(L);
  const cx = lerp(r0[0], r1[0], u), cy = lerp(r0[1], r1[1], u), s = lerp(r0[2], r1[2], u);
  const vis = MOTION.glide(0, 1, A(0) - 0.6, A(0) + 0.2)(T);
  const ready = L >= 2 && at(2) > 0.2;
  const objIn = i => L >= 3 ? MOTION.enter(0, 1, 0.5 + i * 0.18, 1 + i * 0.18)(at(3)) : 0;
  const edgeIn = L >= 3 ? MOTION.glide(0, 1, 1.2, 2.6)(at(3)) : 0;
  const dstIn = L >= 3 ? MOTION.enter(0, 1, 2.4, 3)(at(3)) : 0;
  const varHot = L === 4 ? Math.floor(Math.max(0, tl - 0.8) / 0.4) : (L > 4 ? 99 : -1);
  const tileHot = L === 4 ? 1 : (L === 5 ? 2 : -1);
  const listO = L === 5 ? MOTION.enter(0, 1, 1, 1.6)(tl) : (L === 6 ? 1 - MOTION.glide(0, 1, 0, 0.5)(tl) : 0);
  const fixU = L === 7 ? MOTION.glide(0, 1, 1.2, 1.6)(tl) : 0;
  const conf = L === 7 ? 87 + count(5, tl, 1.4, 1.4) : 87;
  const chat = i => (L === 6 ? MOTION.enter(0, 1, [0.4, 1.4, 2.6][i], [0.4, 1.4, 2.6][i] + 0.45)(tl) : (L > 6 ? 1 : 0));
  const typing = L === 6 && tl > 1.9 && tl < 2.6;
  const card = { background: '#0e1730', border: '1px solid ' + U.edge };
  const c3 = t => ({ opacity: t, transform: 'translateY(' + (1 - t) * 12 + 'px)' });
  const srcIn = i => L >= 0 ? MOTION.enter(0, 1, 0.3 + i * 0.3, 0.9 + i * 0.3)(at(0)) : 0;
  const kindHot = L === 1 ? Math.floor(Math.max(0, tl - 0.3) / 0.6) : -1;
  const path = (x1, y1, x2, y2) => 'M' + x1 + ' ' + y1 + ' C ' + (x1 + 90) + ' ' + y1 + ', ' + (x2 - 90) + ' ' + y2 + ', ' + x2 + ' ' + y2;
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'absolute', left: VB.x, top: VB.y, width: VB.w, height: VB.h, overflow: 'hidden', opacity: vis, background: U.bg, border: '1px solid ' + U.edge, borderRadius: 6, boxShadow: '0 0 0 1px rgba(125,179,238,.10),0 0 60px rgba(23,132,241,.14),0 30px 80px rgba(2,4,10,.6)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 2120, height: 1080, transformOrigin: '0 0', transform: 'translate(' + (VB.w / 2 - cx * s) + 'px,' + (VB.h / 2 - cy * s) + 'px) scale(' + s + ')', fontFamily: UF, color: U.ink, background: U.bg }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 2120, height: 72, background: U.head, borderBottom: '1px solid ' + U.edge, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {ready ? <span style={{ fontSize: 34, fontWeight: 600, ...c3(MOTION.enter(0, 1, 0.2, 0.7)(at(2))) }}>Your Logical Data Model is ready</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 500, color: U.mute }}><span style={{ width: 22, height: 22, borderRadius: 22, border: '3px solid ' + U.dim, borderTopColor: U.sky, transform: 'rotate(' + T * 360 + 'deg)' }}></span>Data MAIA is reading your sources</span>}
            <span style={{ position: 'absolute', right: 20, padding: '10px 18px', border: '1px solid ' + U.edge, fontSize: 18, fontWeight: 600, color: U.sky }}>Reload</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 72, width: 2120, height: 244, background: '#0c1630', borderBottom: '1px solid ' + U.edge, display: 'grid', gridTemplateColumns: '480px 1fr 470px' }}>
            <div style={{ padding: '18px 38px', borderRight: '1px solid ' + U.edge }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>What Data MAIA read</div>
              <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', columnGap: 16, marginTop: 12, fontSize: 21, lineHeight: '33px' }}>
                {[[4, 'Sources'], [16, 'Tables'], [118, 'Columns'], [47924, 'Rows'], [2, 'Destinations']].map(([n, l], k) => [
                  <b key={'n' + k} style={{ fontFamily: UM, fontSize: 25, textAlign: 'right', fontWeight: 500 }}>{L >= 2 ? count(n, at(2), 0.3 + k * 0.1, 1.3).toLocaleString() : (L >= 0 ? count(n, at(0), 0.4, 6) : 0).toLocaleString()}</b>,
                  <span key={'l' + k} style={{ color: '#c9d0de' }}>{l}</span>])}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18, opacity: L >= 2 ? 1 : 0.18 }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>What it is proposing</div>
              <div style={{ display: 'flex', gap: 22, marginTop: 16 }}>
                {[[6, 'OBJECTS'], [22, 'VARIABLES'], [2, 'LISTS'], [2, 'DESTINATIONS']].map(([n, l], k) => {
                  const o = L >= 2 ? MOTION.enter(0, 1, 0.8 + k * 0.2, 1.3 + k * 0.2)(at(2)) : 0;
                  const hot = k === tileHot;
                  return (
                    <div key={l} style={{ width: 158, height: 112, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, ...card, border: '1px solid ' + (hot ? U.cyan : U.edge), boxShadow: hot ? '0 0 0 3px rgba(111,227,255,.18),0 0 40px rgba(111,227,255,.25)' : 'none', ...c3(o) }}>
                      <b style={{ fontSize: 40, fontWeight: 500, color: hot ? U.cyan : U.ink }}>{L >= 2 ? count(n, at(2), 0.9 + k * 0.2, 0.9) : 0}</b>
                      <span style={{ fontFamily: UM, fontSize: 13, letterSpacing: '.16em', color: U.lab }}>{l}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18, borderLeft: '1px solid ' + U.edge, opacity: L >= 2 ? 1 : 0.18 }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Confidence</div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 32px', borderRadius: 60, border: '1px solid ' + (fixU ? U.cyan : 'rgba(125,179,238,.4)'), background: 'rgba(23,132,241,.10)', boxShadow: fixU ? '0 0 40px rgba(111,227,255,' + 0.25 * fixU + ')' : 'none', ...c3(L >= 2 ? MOTION.enter(0, 1, 1.8, 2.3)(at(2)) : 0) }}>
                <b style={{ fontSize: 50, fontWeight: 500, color: U.sky }}>{L >= 2 ? Math.min(conf, count(87, at(2), 1.8, 1)) : 0}%</b>
                <div><div style={{ fontSize: 24, fontWeight: 600, color: U.sky }}>Likely</div><div style={{ fontSize: 15, color: U.mute }}>overall model confidence</div></div>
              </div>
              <div style={{ marginTop: 20, fontSize: 18, fontWeight: 600, color: U.sky }}>What Maia found</div>
            </div>
          </div>
          <svg width={1500} height={760} style={{ position: 'absolute', left: 0, top: 316, overflow: 'visible' }}>
            {MEDGE.map(([si, oi], k) => {
              const d = path(380, SY2(si) - 316, 555, OY2(oi) - 316);
              const hot = L === 3 && Math.floor(Math.max(0, tl - 2.6) / 0.5) % 6 === oi;
              return (
                <g key={k} opacity={edgeIn}>
                  <path d={d} fill="none" stroke={hot ? U.sky : MSRC[si][4]} strokeOpacity={hot ? 0.95 : 0.45} strokeWidth={hot ? 2.6 : 1.8} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - edgeIn}></path>
                  {edgeIn >= 1 ? <path d={d} fill="none" stroke={U.cyan} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.03 0.97" strokeDashoffset={-frac(T * 0.35 + k * 0.13)}></path> : null}
                </g>
              );
            })}
            {MOD.map(([oi, di], k) => {
              const d = path(1008, OY2(oi) - 316, 1155, DY2(di) - 316);
              return (
                <g key={'d' + k} opacity={dstIn}>
                  <path d={d} fill="none" stroke={U.sky} strokeOpacity={0.45} strokeWidth={1.8}></path>
                  <path d={d} fill="none" stroke={U.cyan} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="0.03 0.97" strokeDashoffset={-frac(T * (L === 7 ? 0.6 : 0.3) + k * 0.2)}></path>
                </g>
              );
            })}
          </svg>
          <div style={{ position: 'absolute', left: 32, top: 452, fontFamily: UM, fontSize: 14, letterSpacing: '.16em', color: U.lab }}>SOURCES</div>
          {MSRC.map(([tag, name, cols, kind, col], i) => {
            const o = srcIn(i), hot = kindHot === i;
            return (
              <div key={name} style={{ position: 'absolute', left: 32, top: SY2(i) - 42, width: 348, height: 84, ...card, boxShadow: 'inset 4px 0 0 ' + col + (hot ? ',0 0 0 2px ' + U.cyan + ',0 0 30px rgba(111,227,255,.25)' : ''), padding: '14px 18px 0 22px', ...c3(o) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ padding: '2px 8px', fontFamily: UM, fontSize: 13, color: col, border: '1px solid ' + col, background: 'rgba(23,132,241,.08)' }}>{tag}</span>
                  <span style={{ flex: 1 }}></span>
                  <span style={{ fontFamily: UM, fontSize: 13, fontWeight: 600, letterSpacing: '.12em', color: hot ? U.cyan : U.lab }}>{L >= 1 ? kind : cols}</span>
                </div>
                <div style={{ marginTop: 10, fontFamily: UM, fontSize: 19 }}>{name}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 32, top: 912, fontSize: 16, color: U.lab, opacity: edgeIn }}>12 further tables carried nothing Maia could place.</div>
          <div style={{ position: 'absolute', left: 555, top: 352, fontFamily: UM, fontSize: 14, letterSpacing: '.16em', color: U.lab, opacity: objIn(0) }}>OBJECTS IN THE MODEL</div>
          {MOBJ.map(([n, src, vars, st], i) => {
            let s2 = st; if (i === 5 && fixU > 0.5) s2 = 'Likely';
            const [sc, sb] = stat(s2);
            const vh = i < varHot || (L === 4 && i === varHot);
            const flash = i === 5 ? Math.sin(fixU * Math.PI) : 0;
            return (
              <div key={n} style={{ position: 'absolute', left: 555, top: OY2(i) - 44, width: 452, height: 88, ...card, boxShadow: 'inset 4px 0 0 ' + sc + (flash ? ',0 0 0 2px rgba(111,227,255,' + flash + ')' : ''), padding: '16px 18px 0 22px', ...c3(objIn(i)) }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: 1, fontSize: 21, fontWeight: 600 }}>{n}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 10px', fontSize: 15, fontWeight: 600, color: sc, background: sb, border: '1px solid ' + sc }}><Dot c={sc}></Dot>{s2}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 17, color: U.mute }}>{src} · <span style={{ color: vh ? U.cyan : U.mute, fontWeight: vh ? 700 : 400 }}>{vars} variable{vars > 1 ? 's' : ''}</span></div>
              </div>
            );
          })}
          {listO > 0 ? (
            <div style={{ position: 'absolute', left: 1030, top: 822, width: 300, ...card, border: '1px solid ' + U.cyan, boxShadow: '0 20px 50px rgba(2,4,10,.6),0 0 30px rgba(111,227,255,.2)', padding: '14px 16px', opacity: listO, transform: 'translateX(' + (1 - listO) * -16 + 'px)' }}>
              <MonoLab style={{ color: U.cyan }}>LIST · RESTRICTED VALUES</MonoLab>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {['USD', 'EUR', 'GBP', 'CAD', 'JPY'].map((c, k) => <span key={c} style={{ padding: '4px 10px', fontFamily: UM, fontSize: 15, border: '1px solid ' + U.edge, color: U.ink, opacity: MOTION.enter(0, 1, 1.3 + k * 0.2, 1.6 + k * 0.2)(tl) }}>{c}</span>)}
              </div>
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 1155, top: 352, fontFamily: UM, fontSize: 14, letterSpacing: '.16em', color: U.lab, opacity: dstIn }}>DESTINATIONS IT FOUND</div>
          {MDST.map(([n, k, sub], i) => (
            <div key={n} style={{ position: 'absolute', left: 1155, top: DY2(i) - 44, width: 314, height: 88, ...card, boxShadow: 'inset 4px 0 0 ' + U.sky, padding: '16px 16px 0 20px', ...c3(dstIn) }}>
              <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ flex: 1, fontSize: 19, fontWeight: 600, whiteSpace: 'nowrap' }}>{n}</span><span style={{ padding: '2px 8px', fontFamily: UM, fontSize: 13, color: U.sky, border: '1px solid ' + U.edge }}>{k}</span></div>
              <div style={{ marginTop: 8, fontSize: 15, color: U.lab, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sub}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 1155, top: 590, width: 314, padding: '10px 12px', border: '1px dashed ' + U.edge, fontSize: 15, color: U.lab, textAlign: 'center', opacity: dstIn }}>Maia proposes what each destination needs, not how it connects</div>
          <div style={{ position: 'absolute', left: 1504, top: 316, width: 616, height: 764, borderLeft: '1px solid ' + U.edge, background: '#0c1630' }}>
            <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid ' + U.edge }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 30, height: 30, background: U.hi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 13, color: '#fff' }}>M</span><span style={{ flex: 1, fontSize: 24, fontWeight: 600 }}>Ask MAIA</span><span style={{ fontSize: 15, fontWeight: 600, color: U.sky }}>History</span></div>
              <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, color: U.mute }}>Nothing here can be edited, so ask rather than instruct. Maia explains what it did and sends you to the tab that owns the change.</div>
            </div>
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ ...c3(chat(0)) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: U.mute }}><span style={{ width: 22, height: 22, background: U.hi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: '#fff' }}>M</span>Maia</div>
                <div style={{ marginTop: 8, padding: '14px 16px', ...card, fontSize: 16, lineHeight: 1.55, color: '#d5dbe8' }}>Four ledger exports describe the same postings under different column names, so I merged them into General Spend Ledger. Two things I would look at before promoting: Currency Reference, and the Sage codes behind Transaction Type.</div>
              </div>
              <div style={{ alignSelf: 'flex-end', padding: '12px 16px', border: '1px solid ' + U.hi, background: 'rgba(23,132,241,.16)', fontSize: 16, color: U.ink, ...c3(chat(1)) }}>{L === 6 ? typed('Why did you merge all four into one object?', tl, 1.2, 0.5) : 'Why did you merge all four into one object?'}</div>
              {typing ? <div style={{ display: 'flex', gap: 6, paddingLeft: 32 }}>{[0, 1, 2].map(q => <span key={q} style={{ width: 8, height: 8, borderRadius: 8, background: U.sky, opacity: 0.35 + 0.65 * Math.abs(Math.sin(T * 4 - q * 0.6)) }}></span>)}</div> : null}
              <div style={{ ...c3(chat(2)) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: U.mute }}><span style={{ width: 22, height: 22, background: U.hi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: '#fff' }}>M</span>Maia</div>
                <div style={{ marginTop: 8, padding: '14px 16px', ...card, fontSize: 16, lineHeight: 1.55, color: '#d5dbe8' }}>Each carries a posting date, a debit or credit amount, a document reference and a free-text memo. The values line up when matched on date, name and amount — 94% of rows found a partner in at least one other source.<div style={{ marginTop: 10, fontWeight: 600, color: U.sky }}>See the merge in Objects →</div></div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18, height: 56, ...card, display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 17, color: U.lab, boxShadow: L === 6 && tl > 0.9 && tl < 1.3 ? 'inset 0 0 0 1px ' + U.hi : 'none' }}><span style={{ flex: 1 }}>Ask about anything on this page</span><span style={{ fontFamily: UM, fontSize: 12, letterSpacing: '.14em' }}>ENTER</span></div>
          </div>
        </div>
      </div>
    </foreignObject>
  );
}

// ——— Suite overview: the six product tabs, highlighted one per line
const OVW = 1440, OVH = 548;
const OWARN = '#f2a65a';
const OCARD = { background: '#0e1730', border: '1px solid ' + U.edge };
const oe = (t, s, d = 0.6) => MOTION.enter(0, 1, s, s + d)(t);
const ocount = (n, t, s, d = 1.1) => Math.round(n * Easing.easeOutCubic(clamp((t - s) / d, 0, 1)));
const ofmt = n => n.toLocaleString('en-US');
const OBadge = ({ c, children, o = 1 }) => <span style={{ padding: '3px 10px', fontFamily: UM, fontSize: 12, letterSpacing: '.06em', color: c, border: '1px solid ' + c, opacity: o, whiteSpace: 'nowrap' }}>{children}</span>;
const curve = (x0, y0, x1, y1) => { const m = (x0 + x1) / 2; return 'M' + x0 + ' ' + y0 + ' C' + m + ' ' + y0 + ' ' + m + ' ' + y1 + ' ' + x1 + ' ' + y1; };

const OPILL = { ...{ background: '#0e1730', border: '1px solid ' + U.edge }, borderRadius: 5 };
const OLab = ({ children, style }) => <div style={{ fontFamily: UM, fontSize: 12, letterSpacing: '.14em', color: U.lab, ...style }}>{children}</div>;
const OFlow = ({ d, o = 1, c = B.lo, T }) => <path d={d} fill="none" stroke={c} strokeOpacity={0.4 * o} strokeWidth={1.3} strokeDasharray="3 7" strokeDashoffset={-T * 24}></path>;

// Data MAIA · Overview
const DM_SRC = [['ERP', 'gl_data', 34], ['Finance system', 'gl_detail', 12], ['Accounting', 'general_ledger', 30], ['Regional books', 'nominal_ledger', 11]];
const DM_N = [['General Ledger', 14, 680, 170, 0], ['Account', 4, 900, 110, 0], ['Counterparty', 1, 610, 330, 1], ['Legal Entity', 1, 830, 300, 1], ['Department', 1, 990, 250, 1], ['Currency', 1, 760, 450, 2]];
const DM_NE = [[0, 1], [0, 2], [0, 3], [3, 4], [1, 4], [0, 5], [2, 5]];
function OvDataMaia({ t, T }) {
  const sy = i => 120 + i * 92, SX = 80, SW = 250;
  const conf = [U.cyan, U.sky, OWARN];
  const g = Easing.easeOutCubic(clamp((t - 2.4) / 1.2, 0, 1));
  const RR = 72, C = 2 * Math.PI * RR;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {DM_SRC.map((s, i) => [0, 2, 3].map(j => <OFlow key={i + '-' + j} T={T} d={curve(SX + SW, sy(i) + 30, DM_N[j][2] - 70, DM_N[j][3])} o={MOTION.glide(0, 1, 0.7 + i * 0.08, 1.5 + i * 0.08)(t)}></OFlow>))}
        {DM_NE.map(([x, y], j) => {
          const A = DM_N[x], Bn = DM_N[y], p = MOTION.glide(0, 1, 1.9 + j * 0.08, 2.5 + j * 0.08)(t);
          return <line key={j} x1={A[2]} y1={A[3]} x2={lerp(A[2], Bn[2], p)} y2={lerp(A[3], Bn[3], p)} stroke={B.lo} strokeOpacity={0.45} strokeWidth={1.2}></line>;
        })}
        <g transform="translate(1250 240)" opacity={oe(t, 2.3, 0.5)}>
          <circle r={RR} fill="none" stroke={U.edge} strokeWidth={6}></circle>
          <circle r={RR} fill="none" stroke={U.cyan} strokeWidth={6} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 0.87 * g)} transform="rotate(-90)"></circle>
          <text y={12} textAnchor="middle" fontFamily={UF} fontSize={38} fontWeight={600} fill={U.ink}>{Math.round(87 * g)}%</text>
        </g>
      </svg>
      <OLab style={{ position: 'absolute', left: SX, top: 80, ...fadeUp(t, 0.1) }}>SOURCES READ</OLab>
      {DM_SRC.map(([s, tb, c], i) => (
        <div key={s} style={{ position: 'absolute', left: SX, top: sy(i), width: SW, height: 60, ...OPILL, boxShadow: 'inset 2px 0 0 ' + U.sky, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, ...fadeUp(t, 0.2 + i * 0.1) }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{s}</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 3 }}>{tb}</div></div>
          <span style={{ fontFamily: UM, fontSize: 13, color: U.mute }}>{c} cols</span>
        </div>
      ))}
      <OLab style={{ position: 'absolute', left: 560, top: 40, ...fadeUp(t, 1.2) }}>PROPOSED LOGICAL MODEL</OLab>
      {DM_N.map(([l, n, x, y, c], i) => {
        const o = oe(t, 1.3 + i * 0.12, 0.5);
        return (
          <div key={l} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) scale(' + lerp(0.85, 1, o) + ')', opacity: o, ...OPILL, background: '#13244a', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: 8, background: conf[c] }}></span>
            <span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{l}</span>
            <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{n} var{n > 1 ? 's' : ''}</span>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 1130, width: 240, top: 336, textAlign: 'center', ...fadeUp(t, 2.6) }}>
        <OLab>MODEL CONFIDENCE</OLab>
        <div style={{ marginTop: 10, fontSize: 15, color: U.mute }}>6 objects · 22 variables · 2 lists</div>
      </div>
    </div>
  );
}

// Logic Builder · Data Flow
const LB_S = [['ERP', 'Database', 3], ['Contracts', 'Database', 2], ['File shares', 'Files', 3], ['Engineering', 'API', 4], ['Market Data', 'API', 2]];
const LB_O = ['Supplier', 'Part', 'Commodity', 'Contract', 'Purchase Order', 'Initiative'];
const LB_D = [['Data warehouse', 'Database'], ['File share', 'Files'], ['Initiative Tracker', 'API']];
const LB_SE = [[0, 0], [0, 1], [0, 4], [1, 3], [2, 1], [3, 1], [3, 2], [4, 2], [4, 5]];
const LB_OE = [[0, 0], [1, 0], [3, 1], [5, 2], [4, 0]];
function OvLogic({ t, T }) {
  const SX = 90, SW = 250, OX = 580, OWd = 260, DX = 1090, DW = 260;
  const sy = i => 110 + i * 82, oy = i => 100 + i * 68, dy = i => 150 + i * 110;
  const col = (x, l, d) => <OLab style={{ position: 'absolute', left: x, top: 56, ...fadeUp(t, d) }}>{l}</OLab>;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {LB_SE.map(([s, o], j) => <OFlow key={'s' + j} T={T} d={curve(SX + SW, sy(s) + 28, OX, oy(o) + 22)} o={MOTION.glide(0, 1, 1.0 + j * 0.06, 1.7 + j * 0.06)(t)}></OFlow>)}
        {LB_OE.map(([o, d], j) => <OFlow key={'o' + j} T={T} c={U.cyan} d={curve(OX + OWd, oy(o) + 22, DX, dy(d) + 28)} o={MOTION.glide(0, 1, 1.7 + j * 0.06, 2.4 + j * 0.06)(t)}></OFlow>)}
      </svg>
      {col(SX, 'SOURCES', 0.1)}{col(OX, 'OBJECTS', 0.5)}{col(DX, 'DESTINATIONS', 0.9)}
      {LB_S.map(([n, k, c], i) => (
        <div key={n} style={{ position: 'absolute', left: SX, top: sy(i), width: SW, height: 56, ...OPILL, boxShadow: 'inset 2px 0 0 ' + U.sky, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 0.2 + i * 0.08) }}>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k.toUpperCase()} · {c}</span>
        </div>
      ))}
      {LB_O.map((n, i) => (
        <div key={n} style={{ position: 'absolute', left: OX, top: oy(i), width: OWd, height: 44, ...OPILL, background: '#13244a', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...fadeUp(t, 0.6 + i * 0.08) }}>
          <span style={{ width: 8, height: 8, background: U.sky, transform: 'rotate(45deg)' }}></span><span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</span>
        </div>
      ))}
      {LB_D.map(([n, k], i) => (
        <div key={n} style={{ position: 'absolute', left: DX, top: dy(i), width: DW, height: 56, ...OPILL, boxShadow: 'inset 2px 0 0 ' + U.cyan, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 1.0 + i * 0.1) }}>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

// Quality Queue · Imports
const QQ_R = [['part_master', 'Part', 1204880, 99, 'l'], ['contracts', 'Contract', 204551, 98, 'x', 302], ['spend_transactions', 'Purchase Order', 681204, 0, 'p'], ['supplier_master', 'Supplier', 4912, 91, 'x', 35], ['bom_composition', 'Part', 3120, 100, 'l']];
function OvQuality({ t, T }) {
  const X = 90, W = 880;
  const st = { x: ['Exceptions', OWARN], p: ['Processing', U.sky], l: ['Loaded', U.cyan] };
  const score = Math.round(97 * Easing.easeOutCubic(clamp((t - 1.8) / 1.2, 0, 1)));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: X, top: 56, ...fadeUp(t, 0.1) }}>INCOMING DATA</OLab>
      {QQ_R.map(([n, o, tot, q, s, err], i) => {
        const d = 0.3 + i * 0.14, p = s === 'p' ? clamp((t - 0.8) / 3.2, 0, 1) : Easing.easeOutCubic(clamp((t - d - 0.3) / 0.9, 0, 1));
        const S = s === 'p' && p >= 1 ? ['Loaded', U.cyan] : st[s];
        const qv = s === 'p' ? Math.round(96 * p) : q;
        const qc = qv >= 97 ? U.cyan : qv >= 93 ? U.sky : OWARN;
        return (
          <div key={i} style={{ position: 'absolute', left: X, top: 96 + i * 76, width: W, height: 60, ...OPILL, display: 'grid', gridTemplateColumns: '240px 1fr 70px 150px', alignItems: 'center', gap: 20, padding: '0 20px', ...fadeUp(t, d) }}>
            <div><div style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{n}</div><div style={{ fontSize: 13, color: U.lab, marginTop: 3 }}>into {o}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 4, background: U.edge }}><div style={{ height: 4, width: (p * 100) + '%', background: qc }}></div></div>
              <span style={{ width: 90, textAlign: 'right', fontFamily: UM, fontSize: 13, color: U.mute }}>{ofmt(Math.round(tot * p))}</span>
            </div>
            <b style={{ textAlign: 'right', fontFamily: UM, fontSize: 17, fontWeight: 600, color: qv ? qc : U.lab }}>{qv || '—'}</b>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: U.ink, opacity: s === 'p' && p < 1 ? 0.55 + 0.45 * Math.abs(Math.sin(T * 3)) : 1 }}><Dot c={S[1]}></Dot>{S[0]}{err ? <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{err}</span> : null}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 1060, top: 96, width: 290, ...fadeUp(t, 1.6) }}>
        <OLab>QUALITY SCORE</OLab>
        <div style={{ marginTop: 10, fontSize: 72, lineHeight: 1, fontWeight: 600, color: U.ink }}>{score}</div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Records loaded', '2.1M', U.cyan], ['Held for review', '337', OWARN], ['Auto-transformed', '18,402', U.sky]].map(([l, n, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: U.mute, paddingBottom: 12, borderBottom: '1px solid ' + U.edge }}><Dot c={c}></Dot><span style={{ flex: 1 }}>{l}</span><b style={{ fontFamily: UM, fontWeight: 600, color: U.ink }}>{n}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Data Hub · Graph
const DH_N = [['Supplier', 99, '1,284', 200, 170], ['Commodity', 100, '659', 400, 110], ['Part', 97, '3,812', 420, 290], ['Contract', 92, '2,871', 640, 190], ['Business Unit', 94, '2,946', 860, 120], ['Purchase Order', 89, '148,392', 700, 390], ['Payment', 99, '36,502', 940, 330]];
const DH_E = [[0, 1], [0, 2], [1, 2], [2, 3], [0, 3], [3, 4], [3, 5], [5, 6], [4, 6]];
function OvHub({ t, T }) {
  const R = 44, qc = q => q >= 97 ? U.cyan : q >= 90 ? U.sky : OWARN;
  const hs = Math.round(94 * Easing.easeOutCubic(clamp((t - 1.6) / 1.1, 0, 1)));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={1100} height={OVH} style={{ position: 'absolute', left: 0, top: 0 }}>
        {DH_E.map(([x, y], j) => {
          const A = DH_N[x], Bn = DH_N[y], p = MOTION.glide(0, 1, 1.0 + j * 0.07, 1.6 + j * 0.07)(t);
          return <line key={j} x1={A[3]} y1={A[4]} x2={lerp(A[3], Bn[3], p)} y2={lerp(A[4], Bn[4], p)} stroke={B.lo} strokeOpacity={0.45} strokeWidth={1.2}></line>;
        })}
        {DH_N.map(([n, q, c, x, y], i) => {
          const o = oe(t, 0.2 + i * 0.1, 0.5), s = lerp(0.8, 1, o);
          return (
            <g key={n} opacity={o} transform={'translate(' + x + ' ' + y + ') scale(' + s + ')'}>
              <circle r={R} fill="#13244a" stroke={qc(q)} strokeWidth={1.6}></circle>
              <text y={6} textAnchor="middle" fontFamily={UM} fontSize={18} fontWeight={600} fill={qc(q)}>{q}</text>
              <text y={R + 24} textAnchor="middle" fontFamily={UF} fontSize={16} fontWeight={600} fill={U.ink}>{n}</text>
              <text y={R + 42} textAnchor="middle" fontFamily={UM} fontSize={12} fill={U.lab}>{c}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: 'absolute', left: 1120, top: 96, width: 240, ...fadeUp(t, 1.4) }}>
        <OLab>ENGINE HEALTH</OLab>
        <div style={{ marginTop: 10, fontSize: 72, lineHeight: 1, fontWeight: 600, color: U.ink }}>{hs}</div>
        <div style={{ marginTop: 16, height: 4, background: U.edge }}><div style={{ height: 4, width: hs + '%', background: U.sky }}></div></div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Records', '287,518'], ['Objects', '7'], ['Relationships', '9']].map(([l, n]) => <div key={l} style={{ display: 'flex', fontSize: 15, color: U.mute, paddingBottom: 12, borderBottom: '1px solid ' + U.edge }}><span style={{ flex: 1 }}>{l}</span><b style={{ fontFamily: UM, fontWeight: 600, color: U.ink }}>{n}</b></div>)}
        </div>
      </div>
    </div>
  );
}

// Delivery Station · Excel report
const DS_X = [['Supplier', 'Spend', 'On-time', 'Quality'], ['Supplier A', '4.21M', '96%', '98'], ['Supplier B', '2.87M', '91%', '94'], ['Supplier C', '1.95M', '99%', '97'], ['Supplier D', '1.12M', '88%', '90'], ['Supplier E', '0.84M', '94%', '95']];
function OvDelivery({ t, T }) {
  const XG = '36px 230px repeat(3, 1fr)';
  const out = [['Excel report', 'XLSX', 'Supplier scorecard', 1.9], ['File drop', 'CSV', 'Shared drive', 2.3], ['API', 'REST', 'Initiative Tracker', 2.7]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 56, ...fadeUp(t, 0.1) }}>SUPPLIER SCORECARD · JULY</OLab>
      <div style={{ position: 'absolute', left: 90, top: 92, width: 760, ...OPILL, overflow: 'hidden', ...fadeUp(t, 0.2) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 16px', borderBottom: '1px solid ' + U.edge, background: U.head }}>
          <span style={{ padding: '2px 8px', fontFamily: UM, fontSize: 11, color: U.cyan, border: '1px solid ' + U.cyan, borderRadius: 3 }}>XLSX</span>
          <span style={{ fontFamily: UM, fontSize: 13, color: U.mute }}>supplier_scorecard_july.xlsx</span><span style={{ flex: 1 }}></span>
          <span style={{ fontSize: 13, color: U.lab }}>Vulqan add-in · live</span><Dot c={U.cyan}></Dot>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: XG, borderBottom: '1px solid ' + U.edge }}>{['', 'A', 'B', 'C', 'D'].map((l, k) => <span key={k} style={{ padding: '6px 10px', fontFamily: UM, fontSize: 11, color: U.lab, textAlign: 'center', borderRight: '1px solid ' + U.edge }}>{l}</span>)}</div>
        {DS_X.map((row, r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: XG, height: 48, alignItems: 'stretch', borderBottom: '1px solid ' + U.edge }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab, borderRight: '1px solid ' + U.edge }}>{r + 1}</span>
            {row.map((c, k) => {
              const o = r === 0 ? oe(t, 0.5, 0.4) : oe(t, 0.8 + r * 0.14 + k * 0.05, 0.35);
              return <span key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: k ? 'flex-end' : 'flex-start', padding: '0 14px', borderRight: '1px solid ' + U.edge, fontSize: 15, color: r === 0 ? U.lab : U.ink, fontFamily: k ? UM : UF, fontWeight: r === 0 ? 600 : 400, opacity: o, background: r > 0 && o < 1 && o > 0 ? 'rgba(111,227,255,' + 0.12 * (1 - o) + ')' : 'transparent' }}>{c}</span>;
            })}
          </div>
        ))}
      </div>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {out.map((o, i) => <OFlow key={i} T={T} c={U.cyan} d={curve(850, 250, 1060, 130 + i * 130)} o={MOTION.glide(0, 1, o[3] - 0.3, o[3])(t)}></OFlow>)}
      </svg>
      <OLab style={{ position: 'absolute', left: 1060, top: 56, ...fadeUp(t, 1.7) }}>DELIVERED TO</OLab>
      {out.map(([n, k, d, at], i) => (
        <div key={n} style={{ position: 'absolute', left: 1060, top: 100 + i * 130, width: 290, height: 64, ...OPILL, boxShadow: 'inset 2px 0 0 ' + U.cyan, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...fadeUp(t, at) }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</div><div style={{ fontSize: 13, color: U.lab, marginTop: 3 }}>{d}</div></div>
          <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k}</span>
        </div>
      ))}
    </div>
  );
}

// Ask MAIA · chart + conversation
const AM_B = [['Arizona', 9.8], ['Carolinas', 8.9], ['Texas', 8.4], ['Florida', 8.1], ['Georgia', 6.7], ['Nevada', 5.2], ['Utah', 4.1]];
function OvAsk({ t, T }) {
  const q = 'Which initiatives have the worst uncovered parts?';
  const tq = typed(q, t, 0.2, 0.9);
  const sent = t > 1.1, rep = oe(t, 1.5, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, top: 56, width: 470, bottom: 50, display: 'flex', flexDirection: 'column' }}>
        <OLab style={{ display: 'flex', alignItems: 'center', gap: 10 }}>ASK MAIA<span style={{ flex: 1 }}></span><span style={{ letterSpacing: '.06em', color: U.mute }}>Your LLM</span></OLab>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 16, paddingBottom: 16 }}>
          {sent ? <div style={{ alignSelf: 'flex-end', maxWidth: '86%', padding: '12px 16px', borderRadius: 5, fontSize: 17, lineHeight: 1.45, color: U.ink, background: 'rgba(23,132,241,.16)', border: '1px solid ' + U.hi }}>{q}</div> : null}
          {sent && t < 1.6 ? <div style={{ display: 'flex', gap: 8, paddingLeft: 4 }}>{[0, 1, 2].map(k => <span key={k} style={{ width: 8, height: 8, borderRadius: 8, background: U.sky, opacity: 0.35 + 0.65 * Math.abs(Math.sin(T * 4 - k * 0.6)) }}></span>)}</div> : null}
          {rep > 0 ? <div style={{ maxWidth: '92%', padding: '12px 16px', borderRadius: 5, fontSize: 17, lineHeight: 1.45, color: U.ink, background: '#0e1730', border: '1px solid ' + U.edge, opacity: rep, transform: 'translateY(' + (1 - rep) * 8 + 'px)' }}>Arizona is highest at <b style={{ color: U.cyan, fontWeight: 600 }}>9.8%</b>. Four initiatives sit above 8%.</div> : null}
        </div>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 16px', ...OPILL, border: '1px solid ' + (sent ? U.edge : U.hi) }}>
          <span style={{ flex: 1, fontSize: 16, color: sent || !tq ? U.lab : U.ink, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sent || !tq ? 'Ask a question' : tq}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 660, top: 56, right: 90 }}>
        <OLab style={fadeUp(t, 1.7)}>UNCOVERED PARTS BY INITIATIVE · %</OLab>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {AM_B.map(([n, val], i) => {
            const g = Easing.easeOutCubic(clamp((t - 1.9 - i * 0.07) / 0.7, 0, 1)), hot = val >= 8;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 32 }}>
                <span style={{ width: 100, textAlign: 'right', fontSize: 15, color: U.mute, opacity: oe(t, 1.8, 0.4) }}>{n}</span>
                <span style={{ height: 12, borderRadius: 2, width: 470 * (val / 10) * g, background: hot ? U.cyan : U.hi }}></span>
                <span style={{ fontFamily: UM, fontSize: 14, color: hot ? U.cyan : U.ink, opacity: g }}>{val.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ——— Data MAIA video: abstracted screens, one per line
const DV_KINDS = [['Files', 'XLSX · CSV · PDF', 3], ['Databases', 'SQL · Warehouse · NoSQL', 0], ['APIs', 'REST · GraphQL · SOAP', 0], ['Cloud storage', 'Drives · Buckets · Shares', 1]];
const DV_CONN = [['ERP', 'gl_data', 'Database'], ['Finance system', 'gl_detail', 'API'], ['Accounting', 'general_ledger', 'API'], ['Regional books', 'nominal_ledger', 'File']];
function DvConnect({ t, T }) {
  const pick = t < 1.0 ? -1 : t < 1.7 ? 0 : 1;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 50, ...fadeUp(t, 0.05) }}>CONNECT A SOURCE</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 86, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {DV_KINDS.map(([n, ex], i) => {
          const on = i === pick || (pick === 1 && i === 1) || (t > 1.7 && i === 0);
          return (
            <div key={n} style={{ height: 124, ...OPILL, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid ' + (on ? U.hi : U.edge), background: on ? 'rgba(23,132,241,.10)' : '#0e1730', ...fadeUp(t, 0.15 + i * 0.1) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 22, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ flex: 1 }}></span>{on ? <Dot c={U.cyan}></Dot> : null}</div>
              <span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{ex}</span>
            </div>
          );
        })}
      </div>
      <OLab style={{ position: 'absolute', left: 90, top: 250, ...fadeUp(t, 1.1) }}>CONNECTED</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 284, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DV_CONN.map(([n, tb, k], i) => {
          const at = 1.3 + i * 0.35, p = Easing.easeOutCubic(clamp((t - at) / 0.6, 0, 1));
          return (
            <div key={n} style={{ height: 50, ...OPILL, display: 'grid', gridTemplateColumns: '200px 240px 1fr 140px', alignItems: 'center', gap: 20, padding: '0 20px', ...fadeUp(t, at - 0.1, 0.4) }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span>
              <span style={{ fontFamily: UM, fontSize: 13, color: U.mute }}>{tb}</span>
              <div style={{ height: 3, background: U.edge }}><div style={{ height: 3, width: p * 100 + '%', background: U.sky }}></div></div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: p >= 1 ? U.ink : U.lab }}><Dot c={p >= 1 ? U.cyan : U.sky}></Dot>{p >= 1 ? 'Connected' : 'Reading'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DvFound({ t, T }) {
  const read = [[4, 'sources'], [16, 'tables'], [118, 'columns'], [47924, 'rows']];
  const found = [[6, 'objects'], [11, 'relationships'], [22, 'variables'], [2, 'lists']];
  const big = (arr, d, hi) => arr.map(([n, l], i) => (
    <div key={l} style={{ ...fadeUp(t, d + i * 0.12) }}>
      <div style={{ fontSize: hi ? 64 : 40, lineHeight: 1, fontWeight: 600, color: hi ? U.ink : U.mute }}>{ofmt(ocount(n, t, d + i * 0.12, 1))}</div>
      <div style={{ marginTop: 10, fontSize: 16, color: hi ? U.sky : U.lab }}>{l}</div>
    </div>
  ));
  const g = Easing.easeOutCubic(clamp((t - 2.2) / 1.2, 0, 1)), RR = 58, C = 2 * Math.PI * RR;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 50, ...fadeUp(t, 0.05) }}>WHAT DATA MAIA READ</OLab>
      <div style={{ position: 'absolute', left: 90, top: 86, width: 780, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>{big(read, 0.1, false)}</div>
      <div style={{ position: 'absolute', left: 90, top: 212, width: 780, height: 1, background: U.edge, ...fadeUp(t, 0.9) }}></div>
      <OLab style={{ position: 'absolute', left: 90, top: 250, color: U.cyan, ...fadeUp(t, 0.9) }}>WHAT IT FOUND</OLab>
      <div style={{ position: 'absolute', left: 90, top: 290, width: 780, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>{big(found, 1.0, true)}</div>
      <div style={{ position: 'absolute', left: 1000, top: 86, width: 350, bottom: 60, ...OPILL, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, ...fadeUp(t, 1.9) }}>
        <svg width={150} height={150}><g transform="translate(75 75)"><circle r={RR} fill="none" stroke={U.edge} strokeWidth={6}></circle><circle r={RR} fill="none" stroke={U.cyan} strokeWidth={6} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 0.87 * g)} transform="rotate(-90)"></circle><text y={11} textAnchor="middle" fontFamily={UF} fontSize={32} fontWeight={600} fill={U.ink}>{Math.round(87 * g)}%</text></g></svg>
        <OLab>MODEL CONFIDENCE</OLab>
        <div style={{ display: 'flex', gap: 16, fontSize: 14, color: U.mute }}>{[['Perfect', 2, U.cyan], ['Likely', 3, U.sky], ['Doubtful', 1, OWARN]].map(([l, n, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Dot c={c}></Dot>{n} {l}</span>)}</div>
      </div>
    </div>
  );
}

const DV_N = [['General Ledger', 14, 520, 210, 0], ['Account', 4, 250, 110, 0], ['Counterparty', 1, 250, 330, 1], ['Legal Entity', 1, 800, 110, 1], ['Department', 1, 1080, 210, 1], ['Currency', 1, 800, 400, 2]];
const DV_E = [[0, 1, 'posts to'], [0, 2, 'paid to'], [0, 3, 'booked by'], [3, 4, 'contains'], [0, 5, 'valued in'], [2, 5, 'trades in']];
function DvGraph({ t, T, dim = 0, split = 0 }) {
  const conf = [U.cyan, U.sky, OWARN];
  const nodes = DV_N.map(n => n.slice());
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - dim * 0.55 }}>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {DV_E.map(([x, y, l], j) => {
          const A = nodes[x], Bn = nodes[y], p = MOTION.glide(0, 1, 0.9 + j * 0.1, 1.5 + j * 0.1)(t);
          const mx = (A[2] + Bn[2]) / 2, my = (A[3] + Bn[3]) / 2;
          return (
            <g key={j}>
              <line x1={A[2]} y1={A[3] + 40} x2={lerp(A[2], Bn[2], p)} y2={lerp(A[3], Bn[3], p) + 40} stroke={B.lo} strokeOpacity={0.45} strokeWidth={1.2}></line>
              <text x={mx} y={my + 34} textAnchor="middle" fontFamily={UM} fontSize={12} fill={U.lab} opacity={oe(t, 1.6 + j * 0.1, 0.4)}>{l}</text>
            </g>
          );
        })}
      </svg>
      <OLab style={{ position: 'absolute', left: 90, top: 30, ...fadeUp(t, 0.05) }}>OBJECTS AND RELATIONSHIPS</OLab>
      {nodes.map(([l, n, x, y, c], i) => {
        const o = oe(t, 0.15 + i * 0.1, 0.5);
        const isSplit = split > 0 && l === 'Counterparty';
        const pill = (lab, dx, op, key) => (
          <div key={key} style={{ position: 'absolute', left: x + dx, top: y + 40, transform: 'translate(-50%,-50%) scale(' + lerp(0.85, 1, o) + ')', opacity: o * op, ...OPILL, background: '#13244a', border: '1px solid ' + (isSplit && dx ? U.cyan : U.edge), display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: 8, background: isSplit && dx ? U.cyan : conf[c] }}></span>
            <span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{lab}</span>
            <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{isSplit && dx ? 'new' : n + ' var' + (n > 1 ? 's' : '')}</span>
          </div>
        );
        if (!isSplit) return pill(l, 0, 1, l);
        return [pill(l, 0, 1 - split, l), pill('Supplier', -40 * split, split, 'sp'), pill('Customer', 110 * split, split, 'cu')].map((e, k) => k === 2 ? React.cloneElement(e, { style: { ...e.props.style, top: y + 40 + 70 * split } }) : e);
      })}
    </div>
  );
}

const DV_V = [['gl_data.acct_no', 'Trim · pad to 6', 'Account ID', 'Identifier'], ['gl_detail.txn_dt', 'Parse date', 'Posting Date', 'Date'], ['general_ledger.amt', 'Currency to USD', 'Amount', 'Money'], ['nominal_ledger.dept', 'Map to list', 'Department', 'List'], ['gl_data.vendor', 'Match entity', 'Counterparty', 'Reference']];
function DvVars({ t, T }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 50, ...fadeUp(t, 0.05) }}>GENERAL LEDGER · VARIABLES</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 86, display: 'grid', gridTemplateColumns: '1fr 60px 220px 60px 1fr 140px', padding: '0 20px', ...fadeUp(t, 0.1) }}>
        {['SOURCE COLUMN', '', 'TRANSFORM', '', 'VARIABLE', 'TYPE'].map((h, k) => <OLab key={k} style={{ fontSize: 11 }}>{h}</OLab>)}
      </div>
      {DV_V.map(([s, tr2, vv, ty], i) => {
        const at = 0.3 + i * 0.3, p = MOTION.glide(0, 1, at + 0.2, at + 0.8)(t);
        return (
          <div key={vv} style={{ position: 'absolute', left: 90, right: 90, top: 116 + i * 74, height: 58, ...OPILL, display: 'grid', gridTemplateColumns: '1fr 60px 220px 60px 1fr 140px', alignItems: 'center', padding: '0 20px', ...fadeUp(t, at, 0.4) }}>
            <span style={{ fontFamily: UM, fontSize: 14, color: U.mute }}>{s}</span>
            <span style={{ height: 1, background: U.sky, opacity: 0.6, transformOrigin: '0 50%', transform: 'scaleX(' + p + ')' }}></span>
            <span style={{ justifySelf: 'start', padding: '5px 12px', borderRadius: 3, fontFamily: UM, fontSize: 13, color: U.sky, border: '1px solid ' + U.hi, background: 'rgba(23,132,241,.10)', opacity: p }}>{tr2}</span>
            <span style={{ height: 1, background: U.cyan, opacity: 0.6, transformOrigin: '0 50%', transform: 'scaleX(' + MOTION.glide(0, 1, at + 0.6, at + 1.1)(t) + ')' }}></span>
            <span style={{ fontSize: 17, fontWeight: 600, color: U.ink, opacity: oe(t, at + 0.8, 0.4) }}>{vv}</span>
            <span style={{ fontFamily: UM, fontSize: 13, color: U.lab, opacity: oe(t, at + 0.9, 0.4) }}>{ty}</span>
          </div>
        );
      })}
    </div>
  );
}

function DvChat({ t, T }) {
  const q = 'Split Counterparty into Supplier and Customer';
  const tq = typed(q, t, 0.3, 1.0), sent = t > 1.4, rep = oe(t, 1.9, 0.5);
  const split = MOTION.glide(0, 1, 2.3, 3.1)(t);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: -60, top: 0, width: 1000, height: OVH, transform: 'scale(.82)', transformOrigin: '0 20%' }}><DvGraph t={99} T={T} dim={0.3 * (1 - split)} split={split}></DvGraph></div>
      <div style={{ position: 'absolute', left: 930, top: 30, right: 40, bottom: 30, ...OPILL, background: '#0c1630', display: 'flex', flexDirection: 'column', padding: 20, ...fadeUp(t, 0.05) }}>
        <OLab>CHAT WITH MAIA</OLab>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14, paddingBottom: 14 }}>
          {sent ? <div style={{ alignSelf: 'flex-end', maxWidth: '88%', padding: '11px 14px', borderRadius: 5, fontSize: 16, lineHeight: 1.45, color: U.ink, background: 'rgba(23,132,241,.16)', border: '1px solid ' + U.hi }}>{q}</div> : null}
          {sent && t < 1.9 ? <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2].map(k => <span key={k} style={{ width: 8, height: 8, borderRadius: 8, background: U.sky, opacity: 0.35 + 0.65 * Math.abs(Math.sin(T * 4 - k * 0.6)) }}></span>)}</div> : null}
          {rep > 0 ? <div style={{ maxWidth: '92%', padding: '11px 14px', borderRadius: 5, fontSize: 16, lineHeight: 1.45, color: U.ink, background: '#0e1730', border: '1px solid ' + U.edge, opacity: rep }}>Done. Counterparty is now <b style={{ color: U.cyan, fontWeight: 600 }}>Supplier</b> and <b style={{ color: U.cyan, fontWeight: 600 }}>Customer</b>, each linked to General Ledger.</div> : null}
        </div>
        <div style={{ height: 46, display: 'flex', alignItems: 'center', padding: '0 14px', ...OPILL, border: '1px solid ' + (sent ? U.edge : U.hi) }}><span style={{ fontSize: 15, color: sent || !tq ? U.lab : U.ink, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sent || !tq ? 'Ask MAIA to change the model' : tq}</span></div>
      </div>
    </div>
  );
}

function DvPromote({ t, T }) {
  const glow = oe(t, 0.6, 0.6), press = t > 1.7 && t < 1.95, done = t > 1.95;
  const toast = oe(t, 2.1, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderBottom: '1px solid ' + U.edge, background: '#0c1630' }}>
        <b style={{ fontSize: 20, fontWeight: 600, color: U.ink }}>Your logical data model is ready</b>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: U.mute }}><Dot c={U.cyan}></Dot>87% confidence · 7 objects · 24 variables</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ padding: '10px 24px', borderRadius: 4, fontSize: 17, fontWeight: 600, color: done ? '#0b1428' : '#fff', background: done ? U.cyan : U.hi, boxShadow: done ? 'none' : '0 0 0 ' + (6 * glow * Math.abs(Math.sin(T * 3))) + 'px rgba(23,132,241,.35)', transform: 'scale(' + (press ? 0.95 : 1) + ')' }}>{done ? 'Promoted' : 'Promote'}</span>
      </div>
      <div style={{ position: 'absolute', left: -60, top: 30, width: 1100, height: OVH, transform: 'scale(.8)', transformOrigin: '0 20%', opacity: 0.85 }}><DvGraph t={99} T={T} split={1}></DvGraph></div>
      <div style={{ position: 'absolute', right: 28, top: 84, width: 360, ...OPILL, border: '1px solid ' + U.cyan, padding: '18px 20px', opacity: toast, transform: 'translateY(' + (1 - toast) * -8 + 'px)', boxShadow: '0 20px 50px rgba(2,4,10,.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 600, color: U.ink }}><Dot c={U.cyan}></Dot>Promoted to Logic Builder</div>
        <div style={{ marginTop: 8, fontSize: 15, color: U.mute }}>Now part of your Logical Intelligence Foundation · v1</div>
      </div>
    </div>
  );
}

const dvPair = (A, Bc, at) => ({ t, T }) => t < at ? <A t={t} T={T}></A> : <div style={{ position: 'absolute', inset: 0, opacity: MOTION.glide(0, 1, at, at + 0.4)(t) }}><Bc t={t - at} T={T}></Bc></div>;
const DvGraphVars = dvPair(DvGraph, DvVars, 2.6);
const DvChatPromote = dvPair(DvChat, DvPromote, 3.4);
const DV_SCREENS = [DvConnect, DvFound, DvGraph, DvVars, DvChat, DvPromote, DvGraphVars, DvChatPromote];
function DmVid({ T, a, a0, mode }) {
  const tl = T - a, Scr = DV_SCREENS[mode] || DvConnect;
  const vis = MOTION.glide(0, 1, a0 - 0.6, a0 + 0.2)(T);
  const sw = MOTION.glide(0, 1, 0, 0.45)(tl);
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'absolute', left: 240, top: 84, width: 1440, height: 624, overflow: 'hidden', opacity: vis, background: U.bg, border: '1px solid ' + U.edge, borderRadius: 6, boxShadow: '0 0 0 1px rgba(125,179,238,.10),0 0 60px rgba(23,132,241,.14),0 30px 80px rgba(2,4,10,.6)', fontFamily: UF }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 76, padding: '0 28px', background: '#13203a', borderBottom: '1px solid ' + U.edge }}>
          <img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 28, width: 'auto', filter: 'drop-shadow(0 0 .8px #9cc7f5) drop-shadow(0 0 .8px #9cc7f5)' }}></img>
          <span style={{ width: 1, height: 26, background: U.edge }}></span>
          <b style={{ fontSize: 19, fontWeight: 600, color: U.ink }}>Data MAIA</b>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 76, width: OVW, height: OVH, opacity: sw, transform: 'translateY(' + (1 - sw) * 8 + 'px)' }}><Scr t={tl} T={T}></Scr></div>
      </div>
    </foreignObject>
  );
}

// ——— Logic Builder video: digital, orthogonal screens
const DP = { background: '#0e1730', border: '1px solid ' + U.edge, borderRadius: 2 };
const elbow = (x0, y0, x1, y1, mx) => { const m = mx != null ? mx : (x0 + x1) / 2; return 'M' + x0 + ' ' + y0 + ' H' + m + ' V' + y1 + ' H' + x1; };
const DGrid = () => <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}><defs><pattern id="lbgrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0 H0 V24" fill="none" stroke={U.edge} strokeOpacity={0.35} strokeWidth={1}></path></pattern></defs><rect width={OVW} height={OVH} fill="url(#lbgrid)"></rect></svg>;
function Packet({ d, T, off = 0, c = U.cyan, o = 1 }) {
  return <path d={d} fill="none" stroke={c} strokeWidth={3} strokeOpacity={o} pathLength={100} strokeDasharray="3 97" strokeDashoffset={-(((T * 40 + off) % 100))}></path>;
}
const LV_S = [['ERP', 'DB', 3], ['Contracts', 'DB', 2], ['File shares', 'FILE', 3], ['Engineering', 'API', 4], ['Market Data', 'API', 2]];
const LV_O = ['Supplier', 'Part', 'Commodity', 'Contract', 'Purchase Order', 'Initiative'];
const LV_D = [['Data warehouse', 'DB'], ['File share', 'FILE'], ['Initiative Tracker', 'API']];
const LV_SE = [[0, 0], [0, 1], [0, 4], [1, 3], [2, 1], [3, 1], [3, 2], [4, 2], [4, 5]];
const LV_OE = [[0, 0], [1, 0], [3, 1], [5, 2], [4, 0]];
function LvFlow({ t, T }) {
  const SX = 90, SW = 250, OX = 590, OWd = 250, DX = 1090, DW = 260;
  const sy = i => 110 + i * 82, oy = i => 100 + i * 68, dy = i => 150 + i * 110;
  const lab = (x, l, d) => <OLab style={{ position: 'absolute', left: x, top: 60, ...fadeUp(t, d) }}>{l}</OLab>;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {LV_SE.map(([s, o], j) => { const d = elbow(SX + SW, sy(s) + 28, OX, oy(o) + 22, SX + SW + 60 + (j % 4) * 30); const p = oe(t, 0.9 + j * 0.05, 0.4); return <g key={'s' + j} opacity={p}><path d={d} fill="none" stroke={B.lo} strokeOpacity={0.35} strokeWidth={1}></path><Packet d={d} T={T} off={j * 23} c={U.sky}></Packet></g>; })}
        {LV_OE.map(([o, d0], j) => { const d = elbow(OX + OWd, oy(o) + 22, DX, dy(d0) + 28, OX + OWd + 70 + j * 30); const p = oe(t, 1.5 + j * 0.06, 0.4); return <g key={'o' + j} opacity={p}><path d={d} fill="none" stroke={U.cyan} strokeOpacity={0.35} strokeWidth={1}></path><Packet d={d} T={T} off={j * 31}></Packet></g>; })}
      </svg>
      {lab(SX, 'SOURCES · 14', 0.1)}{lab(OX, 'OBJECTS · 10', 0.4)}{lab(DX, 'DESTINATIONS · 3', 0.7)}
      {LV_S.map(([n, k, c], i) => <div key={n} style={{ position: 'absolute', left: SX, top: sy(i), width: SW, height: 56, ...DP, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 0.15 + i * 0.07) }}><span style={{ width: 6, height: 24, background: U.sky }}></span><span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k}·{c}</span></div>)}
      {LV_O.map((n, i) => <div key={n} style={{ position: 'absolute', left: OX, top: oy(i), width: OWd, height: 44, ...DP, background: '#13244a', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...fadeUp(t, 0.45 + i * 0.07) }}><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>{String(i + 1).padStart(2, '0')}</span><span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</span></div>)}
      {LV_D.map(([n, k], i) => <div key={n} style={{ position: 'absolute', left: DX, top: dy(i), width: DW, height: 56, ...DP, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 0.8 + i * 0.08) }}><span style={{ width: 6, height: 24, background: U.cyan }}></span><span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k}</span></div>)}
    </div>
  );
}

function LvConn({ t, T }) {
  const ok = t > 2.2;
  const F = [['Type', 'SQL Database'], ['Host', 'erp-db.company.internal'], ['Port', '1521'], ['Service', 'ERP_PROD'], ['Auth', 'Service account · vault'], ['Refresh', 'Every 6 hours']];
  const TB = [['SUPPLIER_MASTER', '4,912'], ['PART_MASTER', '1.20M'], ['CONTRACTS', '204,551'], ['PO_LINES', '681,204']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, borderRight: '1px solid ' + U.edge, background: '#0c1630', padding: '24px 0', ...fadeUp(t, 0.05) }}>
        <OLab style={{ padding: '0 24px 12px' }}>SOURCES</OLab>
        {[['ERP', 1], ['ERP_PROD', 2], ['ERP_FINANCE', 2], ['ERP_PLANT', 2], ['Contracts', 1], ['File shares', 1], ['Market Data', 1]].map(([n, lv], i) => { const on = n === 'ERP_PROD'; return <div key={n} style={{ padding: '11px 24px 11px ' + (lv === 2 ? 44 : 24) + 'px', fontSize: lv === 1 ? 14 : 16, fontWeight: lv === 1 ? 700 : 400, color: on ? U.sky : U.ink, background: on ? U.sel : 'transparent', boxShadow: on ? 'inset 3px 0 0 ' + U.hi : 'none' }}>{n}</div>; })}
      </div>
      <div style={{ position: 'absolute', left: 340, top: 30, right: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...fadeUp(t, 0.15) }}>
          <b style={{ fontSize: 26, fontWeight: 600, color: U.ink }}>ERP_PROD</b><span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>DATABASE · ERP</span><span style={{ flex: 1 }}></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', ...DP, border: '1px solid ' + (ok ? U.cyan : U.hi), fontSize: 15, color: ok ? U.cyan : U.ink }}><Dot c={ok ? U.cyan : U.sky}></Dot>{ok ? 'Connected · 42 ms' : t > 1.5 ? 'Testing…' : 'Test connection'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 26 }}>
          <div style={{ ...DP }}>
            {F.map(([k, val], i) => <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', height: 50, padding: '0 18px', borderBottom: i < F.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.3 + i * 0.1, 0.35) }}><OLab style={{ fontSize: 11 }}>{k.toUpperCase()}</OLab><span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{val}</span></div>)}
          </div>
          <div style={{ ...DP, opacity: ok ? 1 : 0.35 }}>
            <div style={{ display: 'flex', height: 44, alignItems: 'center', padding: '0 18px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1, fontSize: 11 }}>TABLES READ</OLab><OLab style={{ fontSize: 11 }}>ROWS</OLab></div>
            {TB.map(([n, r], i) => <div key={n} style={{ display: 'flex', alignItems: 'center', height: 54, padding: '0 18px', borderBottom: '1px solid ' + U.edge, opacity: ok ? oe(t, 2.3 + i * 0.12, 0.3) : 1 }}><span style={{ flex: 1, fontFamily: UM, fontSize: 15, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 15, color: U.sky }}>{r}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const LV_G = [['Supplier', 180, 120], ['Contract', 520, 120], ['Part', 180, 360], ['Commodity', 520, 360], ['Purchase Order', 860, 240], ['Initiative', 1200, 120], ['Business Unit', 1200, 360]];
const LV_GE = [[0, 1, '1 : n'], [0, 2, 'n : n'], [2, 3, 'n : 1'], [1, 4, '1 : n'], [2, 4, 'n : n'], [4, 5, 'n : 1'], [4, 6, 'n : 1'], [1, 3, 'n : 1']];
function LvGraph({ t, T }) {
  const W = 180, H = 56;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <OLab style={{ position: 'absolute', left: 90, top: 40, ...fadeUp(t, 0.05) }}>OBJECT MODEL · 7 OBJECTS · 8 RELATIONSHIPS</OLab>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {LV_GE.map(([a, b, l], j) => {
          const A = LV_G[a], Bn = LV_G[b], p = MOTION.glide(0, 1, 0.8 + j * 0.1, 1.3 + j * 0.1)(t);
          const d = A[2] === Bn[2] ? 'M' + (A[1] + W / 2) + ' ' + (A[2] + 20) + ' H' + (Bn[1] - W / 2) : A[1] === Bn[1] ? 'M' + A[1] + ' ' + (A[2] + 20 + H / 2) + ' V' + (Bn[2] + 20 - H / 2) : elbow(A[1] + W / 2, A[2] + 20, Bn[1] - W / 2, Bn[2] + 20);
          const mx = (A[1] + Bn[1]) / 2, my = (A[2] + Bn[2]) / 2 + 20;
          return <g key={j}><path d={d} fill="none" stroke={B.lo} strokeOpacity={0.55} strokeWidth={1.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}></path><rect x={mx - 26} y={my - 12} width={52} height={22} fill={U.bg} stroke={U.edge} opacity={oe(t, 1.2 + j * 0.1, 0.3)}></rect><text x={mx} y={my + 4} textAnchor="middle" fontFamily={UM} fontSize={12} fill={U.sky} opacity={oe(t, 1.2 + j * 0.1, 0.3)}>{l}</text></g>;
        })}
      </svg>
      {LV_G.map(([n, x, y], i) => <div key={n} style={{ position: 'absolute', left: x - W / 2, top: y + 20 - H / 2, width: W, height: H, ...DP, background: '#13244a', border: '1px solid ' + B.lo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, color: U.ink, ...fadeUp(t, 0.15 + i * 0.08) }}>{n}</div>)}
    </div>
  );
}

const LV_ID = [['Supplier', 'Unique', ['supplier_id']], ['Part', 'Unique', ['part_no']], ['Contract', 'Composite', ['supplier_id', 'contract_no']], ['PO Line', 'Composite', ['po_no', 'line_no']], ['Supplier → Contract', 'Relationship', ['supplier_id']]];
function LvIds({ t, T }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 50, ...fadeUp(t, 0.05) }}>IDENTIFIERS</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 86, display: 'grid', gridTemplateColumns: '300px 180px 1fr 140px', padding: '0 20px', ...fadeUp(t, 0.1) }}>{['OBJECT', 'ID TYPE', 'KEY', 'MATCHED'].map(h => <OLab key={h} style={{ fontSize: 11 }}>{h}</OLab>)}</div>
      {LV_ID.map(([o, ty, keys], i) => {
        const at = 0.3 + i * 0.3, comp = ty === 'Composite';
        return (
          <div key={o} style={{ position: 'absolute', left: 90, right: 90, top: 116 + i * 74, height: 58, ...DP, display: 'grid', gridTemplateColumns: '300px 180px 1fr 140px', alignItems: 'center', padding: '0 20px', ...fadeUp(t, at, 0.4) }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{o}</span>
            <span style={{ fontFamily: UM, fontSize: 13, color: comp ? U.cyan : ty === 'Relationship' ? OWARN : U.sky }}>{ty.toUpperCase()}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{keys.map((k, j) => [j ? <span key={'p' + j} style={{ fontFamily: UM, fontSize: 15, color: U.lab, opacity: oe(t, at + 0.4 + j * 0.2, 0.3) }}>+</span> : null, <span key={k} style={{ padding: '5px 12px', ...DP, border: '1px solid ' + (comp ? U.cyan : U.hi), fontFamily: UM, fontSize: 14, color: U.ink, opacity: oe(t, at + 0.3 + j * 0.25, 0.3), transform: 'translateX(' + (1 - oe(t, at + 0.3 + j * 0.25, 0.3)) * (j ? 14 : 0) + 'px)' }}>{k}</span>])}</span>
            <span style={{ fontFamily: UM, fontSize: 15, color: U.ink, opacity: oe(t, at + 0.8, 0.3) }}>{['100%', '99.8%', '99.1%', '100%', '98.7%'][i]}</span>
          </div>
        );
      })}
    </div>
  );
}

const LV_V = [['Supplier', 'Supplier Name', 'Text', 'Required'], ['Supplier', 'Rating', 'List', 'A · B · C · D'], ['Part', 'Commodity', 'List', '12 values'], ['Purchase Order', 'Spend', 'Money', '≥ 0 · USD'], ['Supplier', 'On-time Delivery', 'Percent', '0 – 100'], ['Contract', 'Expiry Date', 'Date', 'After start date']];
function LvSchema({ t, T }) {
  const G = '220px 1fr 140px 1fr';
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 40, ...fadeUp(t, 0.05) }}>LOGICAL SCHEMA · 38 VARIABLES</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 76, ...DP, ...fadeUp(t, 0.1) }}>
        <div style={{ display: 'grid', gridTemplateColumns: G, height: 42, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge }}>{['OBJECT', 'VARIABLE', 'TYPE', 'VALIDATION'].map(h => <OLab key={h} style={{ fontSize: 11 }}>{h}</OLab>)}</div>
        {LV_V.map(([o, n, ty, val], i) => <div key={n} style={{ display: 'grid', gridTemplateColumns: G, height: 64, alignItems: 'center', padding: '0 20px', borderBottom: i < LV_V.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.25 + i * 0.14, 0.35) }}><span style={{ fontSize: 15, color: U.mute }}>{o}</span><span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 13, color: U.sky }}>{ty.toUpperCase()}</span><span style={{ justifySelf: 'start', padding: '4px 10px', ...DP, fontFamily: UM, fontSize: 13, color: U.ink, opacity: oe(t, 0.6 + i * 0.14, 0.3) }}>{val}</span></div>)}
      </div>
    </div>
  );
}

const LV_M = [['vendor_no', 'Supplier ID', 'Pad to 10'], ['vendor_name', 'Supplier Name', 'Trim · title case'], ['material_no', 'Part Number', 'Strip prefix'], ['net_value', 'Spend', 'EUR → USD'], ['delivery_dt', 'Delivery Date', 'Parse YYYYMMDD']];
function LvMapper({ t, T }) {
  const LX = 90, LW = 300, RX = 1050, RW = 300, y = i => 110 + i * 80;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <OLab style={{ position: 'absolute', left: LX, top: 60, ...fadeUp(t, 0.05) }}>ERP_FINANCE · SOURCE COLUMNS</OLab>
      <OLab style={{ position: 'absolute', left: RX, top: 60, ...fadeUp(t, 0.2) }}>SUPPLIER · VARIABLES</OLab>
      <OLab style={{ position: 'absolute', left: 620, top: 60, ...fadeUp(t, 0.4) }}>TRANSFORM</OLab>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {LV_M.map((m, i) => { const p = MOTION.glide(0, 1, 0.6 + i * 0.22, 1.2 + i * 0.22)(t); return <g key={i}><path d={'M' + (LX + LW) + ' ' + (y(i) + 26) + ' H' + RX} fill="none" stroke={B.lo} strokeOpacity={0.5} strokeWidth={1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}></path>{p >= 1 ? <Packet d={'M' + (LX + LW) + ' ' + (y(i) + 26) + ' H' + RX} T={T} off={i * 20}></Packet> : null}</g>; })}
      </svg>
      {LV_M.map(([s, d, tr2], i) => [
        <div key={'s' + i} style={{ position: 'absolute', left: LX, top: y(i), width: LW, height: 52, ...DP, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: UM, fontSize: 16, color: U.ink, ...fadeUp(t, 0.15 + i * 0.08) }}>{s}</div>,
        <div key={'t' + i} style={{ position: 'absolute', left: 720, top: y(i) + 12, transform: 'translateX(-50%)', padding: '5px 12px', ...DP, background: U.bg, border: '1px solid ' + U.hi, fontFamily: UM, fontSize: 13, color: U.sky, whiteSpace: 'nowrap', opacity: oe(t, 0.9 + i * 0.22, 0.3) }}>{tr2}</div>,
        <div key={'d' + i} style={{ position: 'absolute', left: RX, top: y(i), width: RW, height: 52, ...DP, background: '#13244a', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 17, fontWeight: 600, color: U.ink, opacity: oe(t, 1.1 + i * 0.22, 0.3) }}>{d}</div>
      ])}
    </div>
  );
}

function LvFlowLogic({ t, T }) {
  const N = [['Import arrives', 90, 220, 'e'], ['Quality score ≥ 95', 420, 220, 'q'], ['Load to Data Hub', 780, 110, 'e'], ['Notify owners', 1110, 110, 'e'], ['Route to Quality Queue', 780, 330, 'w'], ['Steward approval', 1110, 330, 'w']];
  const W = 240, H = 64;
  const E = [[0, 1, ''], [1, 2, 'YES'], [2, 3, ''], [1, 4, 'NO'], [4, 5, ''], [5, 2, '']];
  const pt = (i, side) => { const [, x, y] = N[i]; return side === 'r' ? [x + W, y + H / 2] : side === 'l' ? [x, y + H / 2] : side === 't' ? [x + W / 2, y] : [x + W / 2, y + H]; };
  const paths = [[pt(0, 'r'), pt(1, 'l')], [pt(1, 'r'), pt(2, 'l')], [pt(2, 'r'), pt(3, 'l')], [pt(1, 'r'), pt(4, 'l')], [pt(4, 'r'), pt(5, 'l')], [pt(5, 't'), [pt(2, 'b')[0] + 60, pt(2, 'b')[1]]]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <OLab style={{ position: 'absolute', left: 90, top: 40, ...fadeUp(t, 0.05) }}>WORKFLOW · NIGHTLY SUPPLIER LOAD</OLab>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {paths.map(([[x0, y0], [x1, y1]], j) => {
          const d = j === 5 ? 'M' + x0 + ' ' + y0 + ' V' + (y0 - 50) + ' H' + x1 + ' V' + y1 : elbow(x0, y0, x1, y1, j === 1 || j === 3 ? x0 + 60 : null);
          const p = MOTION.glide(0, 1, 0.5 + j * 0.3, 0.9 + j * 0.3)(t);
          const [lx, ly] = j === 1 ? [x0 + 80, y1 - 10] : j === 3 ? [x0 + 80, y1 - 10] : [0, 0];
          return <g key={j}><path d={d} fill="none" stroke={j >= 3 ? OWARN : B.lo} strokeOpacity={0.6} strokeWidth={1.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}></path>{p >= 1 ? <Packet d={d} T={T} off={j * 17} c={j >= 3 ? OWARN : U.cyan}></Packet> : null}{E[j][2] ? <text x={lx} y={ly} fontFamily={UM} fontSize={12} fill={j === 3 ? OWARN : U.cyan} opacity={p}>{E[j][2]}</text> : null}</g>;
        })}
      </svg>
      {N.map(([l, x, y, k], i) => <div key={l} style={{ position: 'absolute', left: x, top: y, width: W, height: H, ...DP, background: k === 'q' ? 'rgba(23,132,241,.14)' : '#13244a', border: '1px solid ' + (k === 'q' ? U.hi : k === 'w' ? OWARN : B.lo), display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontSize: 16, fontWeight: 600, color: U.ink, ...fadeUp(t, 0.2 + [0, 0.3, 0.6, 0.9, 0.9, 1.2][i]) }}><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>{k === 'q' ? 'IF' : String(i + 1).padStart(2, '0')}</span>{l}</div>)}
    </div>
  );
}

function LvSummary({ t, T }) {
  const K = [[14, 'Sources'], [10, 'Objects'], [3, 'Destinations'], [38, 'Variables'], [8, 'Relationships'], [9, 'Identifiers'], [24, 'Maps'], [6, 'Workflows']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 760, bottom: 0, opacity: 0.35 }}><div style={{ position: 'absolute', left: 0, top: 0, width: OVW, height: OVH, transform: 'scale(.55)', transformOrigin: '0 0' }}><LvFlow t={99} T={T}></LvFlow></div></div>
      <div style={{ position: 'absolute', left: 820, top: 30, right: 40, bottom: 30, ...DP, background: '#0c1630', padding: '26px 28px', ...fadeUp(t, 0.1) }}>
        <OLab>ENGINE</OLab>
        <div style={{ marginTop: 8, fontSize: 26, fontWeight: 600, color: U.ink }}>Sourcing Engine</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginTop: 22, background: U.edge, border: '1px solid ' + U.edge }}>
          {K.map(([n, l], i) => <div key={l} style={{ background: '#0e1730', padding: '14px 14px' }}><div style={{ fontSize: 30, fontWeight: 600, color: U.ink }}>{ocount(n, t, 0.3 + i * 0.08, 0.8)}</div><div style={{ fontSize: 13, color: U.lab, marginTop: 4 }}>{l}</div></div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, ...fadeUp(t, 1.2) }}>
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: U.mute }}><Dot c={U.cyan}></Dot>Live · 12 changes since last publish</span>
          <span style={{ padding: '10px 22px', borderRadius: 4, background: U.hi, color: '#fff', fontWeight: 600, fontSize: 16 }}>Publish</span>
        </div>
      </div>
    </div>
  );
}

const LV_SCREENS = [LvFlow, LvConn, LvGraph, LvIds, LvSchema, LvMapper, LvFlowLogic, LvSummary];
function ModWin({ T, a, a0, title, children }) {
  const tl = T - a;
  const vis = MOTION.glide(0, 1, a0 - 0.6, a0 + 0.2)(T);
  const sw = MOTION.glide(0, 1, 0, 0.45)(tl);
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'absolute', left: 240, top: 84, width: 1440, height: 624, overflow: 'hidden', opacity: vis, background: U.bg, border: '1px solid ' + U.edge, borderRadius: 6, boxShadow: '0 0 0 1px rgba(125,179,238,.10),0 0 60px rgba(23,132,241,.14),0 30px 80px rgba(2,4,10,.6)', fontFamily: UF }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 76, padding: '0 28px', background: '#13203a', borderBottom: '1px solid ' + U.edge }}>
          <img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 28, width: 'auto', filter: 'drop-shadow(0 0 .8px #9cc7f5) drop-shadow(0 0 .8px #9cc7f5)' }}></img>
          <span style={{ width: 1, height: 26, background: U.edge }}></span>
          <b style={{ fontSize: 19, fontWeight: 600, color: U.ink }}>{title}</b>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 76, width: OVW, height: OVH, opacity: sw, transform: 'translateY(' + (1 - sw) * 8 + 'px)' }}>{children(tl)}</div>
      </div>
    </foreignObject>
  );
}
function LbVid({ T, a, a0, mode }) {
  const Scr = LV_SCREENS[mode] || LvFlow;
  return <ModWin T={T} a={a} a0={a0} title="Logic Builder">{tl => <Scr t={tl} T={T}></Scr>}</ModWin>;
}

// ——— Quality Queue video
const QV_SRC = [['ERP', 'part_master'], ['Contracts DB', 'contracts'], ['Finance API', 'spend_txn'], ['File share', 'supplier_list']];
const QV_OBJ = ['Part', 'Contract', 'Purchase Order', 'Supplier'];
function QvIngest({ t, T }) {
  const SX = 90, SW = 280, OX = 1070, OW2 = 280, y = i => 110 + i * 92, GX = 620;
  const cnt = [1204880, 204551, 681204, 4912];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <OLab style={{ position: 'absolute', left: SX, top: 60, ...fadeUp(t, 0.05) }}>INCOMING</OLab>
      <OLab style={{ position: 'absolute', left: GX, top: 60, ...fadeUp(t, 0.3) }}>QUALITY QUEUE</OLab>
      <OLab style={{ position: 'absolute', left: OX, top: 60, ...fadeUp(t, 0.5) }}>LOGICAL CONTEXT</OLab>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {QV_SRC.map((s, i) => { const d1 = elbow(SX + SW, y(i) + 28, GX, 270, SX + SW + 50 + i * 20); const d2 = elbow(GX + 200, 270, OX, y(i) + 28, GX + 260 + i * 20); return <g key={i} opacity={oe(t, 0.6 + i * 0.1, 0.4)}><path d={d1} fill="none" stroke={B.lo} strokeOpacity={0.35}></path><Packet d={d1} T={T} off={i * 25} c={U.sky}></Packet><path d={d2} fill="none" stroke={U.cyan} strokeOpacity={0.35}></path><Packet d={d2} T={T} off={i * 25 + 12}></Packet></g>; })}
      </svg>
      {QV_SRC.map(([n, tb], i) => <div key={n} style={{ position: 'absolute', left: SX, top: y(i), width: SW, height: 56, ...DP, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 0.1 + i * 0.08) }}><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 2 }}>{tb}</div></div><span style={{ fontFamily: UM, fontSize: 13, color: U.sky }}>{ofmt(Math.round(cnt[i] * clamp((t - 0.6) / 3.5, 0, 1)))}</span></div>)}
      <div style={{ position: 'absolute', left: GX, top: 210, width: 200, height: 120, ...DP, background: 'rgba(23,132,241,.12)', border: '1px solid ' + U.hi, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, ...fadeUp(t, 0.35) }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: U.ink }}>Transform</span>
        <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>MAP · CLEANSE · VALIDATE</span>
        <span style={{ display: 'flex', gap: 5, marginTop: 4 }}>{[0, 1, 2, 3, 4].map(k => <span key={k} style={{ width: 6, height: 6, background: U.cyan, opacity: 0.25 + 0.75 * Math.abs(Math.sin(T * 3 - k * 0.5)) }}></span>)}</span>
      </div>
      {QV_OBJ.map((n, i) => <div key={n} style={{ position: 'absolute', left: OX, top: y(i), width: OW2, height: 56, ...DP, background: '#13244a', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...fadeUp(t, 0.55 + i * 0.08) }}><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>{String(i + 1).padStart(2, '0')}</span><span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span></div>)}
    </div>
  );
}

function QvScore({ t, T }) {
  const g = Easing.easeOutCubic(clamp((t - 0.3) / 1.4, 0, 1));
  const live = 96 + Math.sin(T * 1.7) * 0.6 + Math.sin(T * 3.1) * 0.3;
  const sc = lerp(0, live, g);
  const pts = Array.from({ length: 40 }, (_, k) => { const x = k / 39; const val = 93 + 3 * x + Math.sin(k * 0.9 + T * 0.8) * 1.1; return [x, val]; });
  const W = 760, H = 180, vis = clamp((t - 0.6) / 2, 0, 1);
  const d = pts.filter(p => p[0] <= vis).map((p, k) => (k ? 'L' : 'M') + (p[0] * W).toFixed(1) + ' ' + (H - (p[1] - 88) / 12 * H).toFixed(1)).join(' ');
  const R2 = [['part_master', 99], ['contracts', 98], ['spend_txn', 94], ['supplier_list', 91]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, top: 50, width: 340, ...fadeUp(t, 0.05) }}>
        <OLab>QUALITY SCORE · LIVE</OLab>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14 }}><span style={{ fontSize: 120, lineHeight: 1, fontWeight: 600, color: U.ink }}>{sc.toFixed(1)}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 15, color: U.mute }}><span style={{ width: 8, height: 8, borderRadius: 8, background: U.cyan, opacity: 0.5 + 0.5 * Math.abs(Math.sin(T * 2.5)) }}></span>Updating as records arrive</div>
      </div>
      <div style={{ position: 'absolute', left: 520, top: 60, width: W, ...fadeUp(t, 0.3) }}>
        <OLab>LAST 24 HOURS</OLab>
        <svg width={W} height={H + 20} style={{ marginTop: 14, overflow: 'visible' }}>
          {[0, 0.5, 1].map(k => <line key={k} x1={0} x2={W} y1={k * H} y2={k * H} stroke={U.edge}></line>)}
          <path d={d} fill="none" stroke={U.cyan} strokeWidth={2}></path>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 340, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {R2.map(([n, q], i) => { const qc = q >= 97 ? U.cyan : q >= 93 ? U.sky : OWARN; const p = oe(t, 1.2 + i * 0.12, 0.5); return <div key={n} style={{ ...DP, padding: '16px 18px', opacity: p }}><div style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{n}</div><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}><span style={{ fontSize: 30, fontWeight: 600, color: qc }}>{Math.round(q * p)}</span><div style={{ flex: 1, height: 4, background: U.edge }}><div style={{ height: 4, width: q * p + '%', background: qc }}></div></div></div></div>; })}
      </div>
    </div>
  );
}

const QV_I = [['Error', 'Supplier ID missing', 'supplier_list · row 1,482', '#ff8a7a'], ['Error', 'Invalid date 2025-13-02', 'contracts · row 88,210', '#ff8a7a'], ['Warning', 'Spend outside expected range', 'spend_txn · row 402,117', OWARN], ['Missing', 'Commodity not in list', 'part_master · row 9,904', U.sky], ['Warning', 'Possible duplicate supplier', 'supplier_list · row 3,021', OWARN]];
function QvFlags({ t, T }) {
  const C = [['Errors', 1539, '#ff8a7a'], ['Warnings', 271, OWARN], ['Missing values', 612, U.sky]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {C.map(([l, n, c], i) => <div key={l} style={{ ...DP, boxShadow: 'inset 0 3px 0 ' + c, padding: '16px 20px', ...fadeUp(t, 0.05 + i * 0.1) }}><div style={{ fontSize: 34, fontWeight: 600, color: U.ink }}>{ofmt(ocount(n, t, 0.2 + i * 0.1, 1))}</div><div style={{ fontSize: 15, color: U.mute, marginTop: 4 }}>{l}</div></div>)}
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 160, ...DP }}>
        {QV_I.map(([k, d, w, c], i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 280px', alignItems: 'center', height: 64, padding: '0 20px', borderBottom: i < QV_I.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.6 + i * 0.22, 0.3), background: t > 0.6 + i * 0.22 && t < 1.0 + i * 0.22 ? 'rgba(255,138,122,.06)' : 'transparent' }}><span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 13, color: c }}><Dot c={c}></Dot>{k.toUpperCase()}</span><span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{d}</span><span style={{ fontFamily: UM, fontSize: 13, color: U.lab, textAlign: 'right' }}>{w}</span></div>)}
      </div>
    </div>
  );
}

function QvFix({ t, T }) {
  const applied = t > 1.8, pass = MOTION.glide(0, 1, 2.2, 3.2)(t);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, top: 40, width: 700, ...DP, padding: '22px 24px', ...fadeUp(t, 0.05) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 13, color: applied ? U.cyan : '#ff8a7a' }}><Dot c={applied ? U.cyan : '#ff8a7a'}></Dot>{applied ? 'RESOLVED' : 'ERROR'}</span><span style={{ flex: 1 }}></span><span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>contracts · row 88,210</span></div>
        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 600, color: U.ink }}>Invalid date in Contract Start</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <div style={{ ...DP, padding: '14px 16px', border: '1px solid ' + (applied ? U.edge : '#ff8a7a') }}><OLab style={{ fontSize: 11 }}>INCOMING</OLab><div style={{ fontFamily: UM, fontSize: 20, color: applied ? U.lab : U.ink, marginTop: 8, textDecoration: applied ? 'line-through' : 'none' }}>2025-13-02</div></div>
          <div style={{ ...DP, padding: '14px 16px', border: '1px solid ' + (applied ? U.cyan : U.hi), opacity: oe(t, 0.6, 0.4) }}><OLab style={{ fontSize: 11 }}>PROPOSED FIX</OLab><div style={{ fontFamily: UM, fontSize: 20, color: U.ink, marginTop: 8 }}>2025-02-13</div><div style={{ fontSize: 13, color: U.lab, marginTop: 6 }}>Day and month swapped · 97% likely</div></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, opacity: oe(t, 0.9, 0.4) }}>
          <span style={{ padding: '10px 22px', borderRadius: 4, fontSize: 16, fontWeight: 600, color: applied ? '#0b1428' : '#fff', background: applied ? U.cyan : U.hi, transform: 'scale(' + (t > 1.55 && t < 1.8 ? 0.95 : 1) + ')' }}>{applied ? 'Applied' : 'Apply fix'}</span>
          <span style={{ padding: '10px 18px', borderRadius: 4, fontSize: 16, color: U.ink, border: '1px solid ' + U.edge }}>Apply to 41 similar</span>
        </div>
      </div>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}><path d="M790 200 H1000" fill="none" stroke={U.cyan} strokeOpacity={0.35 * pass}></path>{pass > 0 ? <Packet d="M790 200 H1000" T={T} o={pass}></Packet> : null}</svg>
      <div style={{ position: 'absolute', left: 1000, top: 110, width: 350, height: 180, ...DP, border: '1px solid ' + (pass > 0.9 ? U.cyan : U.edge), padding: '22px 24px', opacity: 0.35 + 0.65 * pass }}>
        <OLab>VULQAN DATA STORE</OLab>
        <div style={{ marginTop: 12, fontSize: 20, fontWeight: 600, color: U.ink }}>Only clean data gets in</div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: pass > 0.9 ? U.cyan : U.lab }}><Dot c={pass > 0.9 ? U.cyan : U.lab}></Dot>{pass > 0.9 ? 'Record loaded' : 'Held until fixed'}</div>
      </div>
    </div>
  );
}

function QvReal({ t, T }) {
  const g = Easing.easeOutCubic(clamp((t - 0.4) / 1.6, 0, 1));
  const sc = Math.round(lerp(82, 98, g));
  const K = [['Issues flagged', '2,422'], ['Fixed before load', '2,381'], ['Rules applied', '312'], ['Records loaded', '2.1M']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, top: 60, ...fadeUp(t, 0.05) }}>
        <OLab>QUALITY SCORE</OLab>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 14 }}>
          <span style={{ fontSize: 56, fontWeight: 600, color: U.lab }}>82</span>
          <span style={{ fontFamily: UM, fontSize: 22, color: U.lab }}>→</span>
          <span style={{ fontSize: 140, lineHeight: 1, fontWeight: 600, color: U.cyan }}>{sc}</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 16, color: U.mute }}>Before Vulqan · with Quality Queue</div>
      </div>
      <div style={{ position: 'absolute', left: 820, top: 70, width: 530, ...DP }}>
        {K.map(([l, n], i) => <div key={l} style={{ display: 'flex', alignItems: 'center', height: 76, padding: '0 22px', borderBottom: i < K.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.8 + i * 0.15, 0.4) }}><span style={{ flex: 1, fontSize: 17, color: U.mute }}>{l}</span><span style={{ fontSize: 28, fontWeight: 600, color: U.ink }}>{n}</span></div>)}
      </div>
    </div>
  );
}

const QvScoreFlags = dvPair(QvScore, QvFlags, 2.4);
const QV_SCREENS = [QvIngest, QvScore, QvFlags, QvFix, QvReal, QvScoreFlags];
function QqVid({ T, a, a0, mode }) {
  const Scr = QV_SCREENS[mode] || QvIngest;
  return <ModWin T={T} a={a} a0={a0} title="Quality Queue">{tl => <Scr t={tl} T={T}></Scr>}</ModWin>;
}

// ——— Data Hub video
const DHV_N = [['Supplier', 99, '1,284', 220, 150], ['Commodity', 100, '659', 460, 90], ['Part', 97, '3,812', 470, 300], ['Contract', 92, '2,871', 720, 180], ['Business Unit', 94, '2,946', 980, 100], ['Purchase Order', 89, '148,392', 760, 390], ['Payment', 99, '36,502', 1060, 330], ['Initiative', 96, '212', 1250, 180]];
const DHV_E = [[0, 1], [0, 2], [1, 2], [2, 3], [0, 3], [3, 4], [3, 5], [5, 6], [4, 7], [6, 7], [2, 5]];
function DhvGraph({ t, T, big }) {
  const R = big ? 46 : 42, qc = q => q >= 97 ? U.cyan : q >= 90 ? U.sky : OWARN;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 30, ...fadeUp(t, 0.05) }}>{big ? 'YOUR LOGICAL CONTEXT · LIVE' : 'KNOWLEDGE GRAPH'}</OLab>
      <div style={{ position: 'absolute', right: 90, top: 22, display: 'flex', ...fadeUp(t, 0.1) }}>{['Graph', 'Table', 'Tiles'].map((l, k) => <span key={l} style={{ padding: '6px 14px', fontSize: 14, fontWeight: 600, color: k ? U.ink : '#fff', background: k ? 'transparent' : U.hi, border: '1px solid ' + (k ? U.edge : U.hi) }}>{l}</span>)}</div>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {DHV_E.map(([x, y], j) => {
          const A = DHV_N[x], Bn = DHV_N[y], p = MOTION.glide(0, 1, 0.9 + j * 0.07, 1.5 + j * 0.07)(t);
          return (
            <g key={j}>
              <line x1={A[3]} y1={A[4] + 20} x2={lerp(A[3], Bn[3], p)} y2={lerp(A[4], Bn[4], p) + 20} stroke={B.lo} strokeOpacity={0.45} strokeWidth={1.2}></line>
              {big && p >= 1 ? <line x1={A[3]} y1={A[4] + 20} x2={Bn[3]} y2={Bn[4] + 20} stroke={U.cyan} strokeWidth={2.5} pathLength={100} strokeDasharray="4 96" strokeDashoffset={-((T * 30 + j * 13) % 100)}></line> : null}
            </g>
          );
        })}
        {DHV_N.map(([n, q, c, x, y], i) => {
          const o = oe(t, 0.15 + i * 0.09, 0.5), s = lerp(0.8, 1, o);
          return (
            <g key={n} opacity={o} transform={'translate(' + x + ' ' + (y + 20) + ') scale(' + s + ')'}>
              {big ? <circle r={R + 8} fill="none" stroke={qc(q)} strokeOpacity={0.2 + 0.2 * Math.abs(Math.sin(T * 1.5 + i))}></circle> : null}
              <circle r={R} fill="#13244a" stroke={qc(q)} strokeWidth={1.6}></circle>
              <text y={6} textAnchor="middle" fontFamily={UM} fontSize={17} fontWeight={600} fill={qc(q)}>{q}</text>
              <text y={R + 24} textAnchor="middle" fontFamily={UF} fontSize={16} fontWeight={600} fill={U.ink}>{n}</text>
              <text y={R + 42} textAnchor="middle" fontFamily={UM} fontSize={12} fill={U.lab}>{c}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const DHV_T = [['SUP-0001', 'Supplier A', 'Castings', '4.21M', '96%', 'A', 99], ['SUP-0002', 'Supplier B', 'Fasteners', '2.87M', '91%', 'B', 94], ['SUP-0003', 'Supplier C', 'Alloys', '1.95M', '99%', 'A', 97], ['SUP-0004', 'Supplier D', 'Machining', '1.12M', '88%', 'B', 82], ['SUP-0005', 'Supplier E', 'Castings', '0.84M', '94%', 'A', 95], ['SUP-0006', 'Supplier F', 'Electronics', '0.61M', '97%', 'A', 99], ['SUP-0007', 'Supplier G', 'Alloys', '0.44M', '85%', 'C', 76]];
const DHV_G = '130px 1fr 150px 110px 100px 80px 90px';
function DhvTable({ t, T, sel = [], dim = 0, check = false }) {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - dim }}>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 22, display: 'flex', alignItems: 'center', ...fadeUp(t, 0.05) }}><OLab style={{ flex: 1 }}>SUPPLIER · 1,284 RECORDS</OLab><div style={{ display: 'flex' }}>{['Graph', 'Table', 'Tiles'].map((l, k) => <span key={l} style={{ padding: '6px 14px', fontSize: 14, fontWeight: 600, color: k === 1 ? '#fff' : U.ink, background: k === 1 ? U.hi : 'transparent', border: '1px solid ' + (k === 1 ? U.hi : U.edge) }}>{l}</span>)}</div></div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 66, ...DP, ...fadeUp(t, 0.1) }}>
        <div style={{ display: 'grid', gridTemplateColumns: (check ? '40px ' : '') + DHV_G, height: 42, alignItems: 'center', padding: '0 18px', borderBottom: '1px solid ' + U.edge }}>{(check ? [''] : []).concat(['ID', 'NAME', 'COMMODITY', 'SPEND', 'ON-TIME', 'RATING', 'QUALITY']).map((h, k) => <OLab key={k} style={{ fontSize: 11 }}>{h}</OLab>)}</div>
        {DHV_T.map((r, i) => {
          const on = sel.includes(i), q = r[6], qc = q >= 97 ? U.cyan : q >= 90 ? U.sky : OWARN;
          return (
            <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: (check ? '40px ' : '') + DHV_G, height: 58, alignItems: 'center', padding: '0 18px', borderBottom: i < DHV_T.length - 1 ? '1px solid ' + U.edge : 'none', background: on ? U.sel : 'transparent', boxShadow: on ? 'inset 3px 0 0 ' + U.hi : 'none', ...fadeUp(t, 0.2 + i * 0.08, 0.3) }}>
              {check ? <span style={{ width: 16, height: 16, border: '1px solid ' + (on ? U.hi : U.lab), background: on ? U.hi : 'transparent' }}></span> : null}
              <span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{r[0]}</span><span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{r[1]}</span><span style={{ fontSize: 15, color: U.mute }}>{r[2]}</span>
              <span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{r[3]}</span><span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{r[4]}</span><span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{r[5]}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 15, color: qc }}><Dot c={qc}></Dot>{q}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DhvQuality({ t, T }) {
  const g = Easing.easeOutCubic(clamp((t - 0.4) / 1.2, 0, 1)), RR = 60, C = 2 * Math.PI * RR;
  const V = [['On-time Delivery', 42, 11, '#ff8a7a'], ['Commodity', 18, 26, OWARN], ['Rating', 9, 4, OWARN], ['Spend', 3, 0, U.sky]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(0px)' }}><DhvTable t={99} T={T} dim={0.7}></DhvTable></div>
      <div style={{ position: 'absolute', left: 260, top: 40, width: 920, ...DP, background: '#0c1630', border: '1px solid ' + U.hi, boxShadow: '0 30px 80px rgba(2,4,10,.6)', padding: '24px 28px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 34, ...fadeUp(t, 0.05) }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <OLab>SUPPLIER QUALITY</OLab>
          <svg width={150} height={150}><g transform="translate(75 75)"><circle r={RR} fill="none" stroke={U.edge} strokeWidth={7}></circle><circle r={RR} fill="none" stroke={U.sky} strokeWidth={7} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 0.94 * g)} transform="rotate(-90)"></circle><text y={12} textAnchor="middle" fontFamily={UF} fontSize={36} fontWeight={600} fill={U.ink}>{Math.round(94 * g)}</text></g></svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: U.mute, alignSelf: 'stretch' }}>{[['Errors', 72, '#ff8a7a'], ['Warnings', 41, OWARN], ['Missing', 30, U.sky]].map(([l, n, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot c={c}></Dot><span style={{ flex: 1 }}>{l}</span><b style={{ fontFamily: UM, fontWeight: 600, color: U.ink }}>{n}</b></span>)}</div>
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', height: 34, alignItems: 'center', borderBottom: '1px solid ' + U.edge }}>{['ISSUES BY VARIABLE', 'ERRORS', 'MISSING', ''].map((h, k) => <OLab key={k} style={{ fontSize: 11 }}>{h}</OLab>)}</div>
          {V.map(([n, e, m, c], i) => { const p = oe(t, 0.6 + i * 0.15, 0.4); return (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', height: 62, alignItems: 'center', borderBottom: '1px solid ' + U.edge, opacity: p }}>
              <div><div style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</div><div style={{ marginTop: 6, height: 4, width: 260, background: U.edge }}><div style={{ height: 4, width: Math.min(100, (e + m) * 1.8) * p + '%', background: c }}></div></div></div>
              <span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{e}</span><span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{m}</span>
              <span style={{ justifySelf: 'end', padding: '6px 14px', fontSize: 14, fontWeight: 600, color: U.sky, border: '1px solid ' + U.hi, borderRadius: 4 }}>Fix</span>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

function DhvLineage({ t, T }) {
  const L = [['ERP', 'vendor_master · row 3,021'], ['Mapper', '6 variables mapped'], ['Quality Queue', 'Supplier ID padded'], ['Data Hub', 'Supplier C · v4']];
  const A = [['08 Aug 06:00', 'Loaded from ERP', 'System', U.sky], ['08 Aug 06:01', 'Quality fix applied · Supplier ID', 'Rule QQ-12', U.cyan], ['09 Aug 14:22', 'Rating changed B → A', 'J. Rivera', OWARN], ['09 Aug 15:05', 'Change approved', 'Data owner · M. Chen', U.cyan]];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 30, ...fadeUp(t, 0.05) }}>SUPPLIER C · LINEAGE</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 64, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
        {L.map(([n, d], i) => <div key={n} style={{ position: 'relative', ...DP, padding: '14px 16px', border: '1px solid ' + (i === 3 ? U.cyan : U.edge), ...fadeUp(t, 0.15 + i * 0.18) }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 4 }}>{d}</div>
          {i < 3 ? <span style={{ position: 'absolute', right: -40, top: '50%', width: 40, height: 1, background: U.sky, opacity: oe(t, 0.3 + i * 0.18, 0.3) }}></span> : null}
        </div>)}
      </div>
      <OLab style={{ position: 'absolute', left: 90, top: 178, ...fadeUp(t, 1.0) }}>AUDIT TRAIL</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 212, ...DP }}>
        {A.map(([when, what, who, c], i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '170px 30px 1fr 260px', alignItems: 'center', height: 70, padding: '0 20px', borderBottom: i < A.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 1.1 + i * 0.3, 0.35) }}>
          <span style={{ fontFamily: UM, fontSize: 13, color: U.lab }}>{when}</span><Dot c={c}></Dot><span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{what}</span><span style={{ fontSize: 14, color: U.mute, textAlign: 'right' }}>{who}</span>
        </div>)}
      </div>
    </div>
  );
}

function DhvBulk({ t, T }) {
  const selN = t < 0.6 ? 0 : Math.min(4, Math.floor((t - 0.6) / 0.15) + 1);
  const sel = [1, 3, 4, 6].slice(0, selN);
  const sub = t > 2.4, press = t > 2.15 && t < 2.4;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 920, height: OVH, overflow: 'hidden' }}><div style={{ position: 'absolute', left: -20, top: 10, width: OVW, transform: 'scale(.62)', transformOrigin: '0 0' }}><DhvTable t={99} T={T} sel={sel} check></DhvTable></div></div>
      <div style={{ position: 'absolute', left: 930, top: 30, right: 40, bottom: 30, ...DP, background: '#0c1630', border: '1px solid ' + U.hi, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16, ...fadeUp(t, 0.3) }}>
        <OLab>BULK EDIT · {selN} RECORDS</OLab>
        {[['Variable', 'Rating'], ['Set to', 'A'], ['Reason', 'Annual review']].map(([k, val], i) => <div key={k} style={{ opacity: oe(t, 1.0 + i * 0.2, 0.3) }}><div style={{ fontSize: 13, color: U.lab }}>{k}</div><div style={{ marginTop: 6, height: 42, display: 'flex', alignItems: 'center', padding: '0 12px', ...DP, fontSize: 16, color: U.ink }}>{val}</div></div>)}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: U.mute, opacity: oe(t, 1.7, 0.3) }}><Dot c={OWARN}></Dot>Requires data owner approval</div>
        <span style={{ flex: 1 }}></span>
        <span style={{ alignSelf: 'stretch', textAlign: 'center', padding: '11px 0', borderRadius: 4, fontSize: 16, fontWeight: 600, color: sub ? '#0b1428' : '#fff', background: sub ? U.cyan : U.hi, transform: 'scale(' + (press ? 0.97 : 1) + ')', opacity: oe(t, 1.8, 0.3) }}>{sub ? 'Submitted for approval' : 'Apply to ' + selN + ' records'}</span>
      </div>
    </div>
  );
}

const DHV_SCREENS = [t => <DhvGraph {...t}></DhvGraph>, t => <DhvTable {...t} sel={t.t > 2.4 ? [2] : []}></DhvTable>, t => <DhvQuality {...t}></DhvQuality>, t => <DhvLineage {...t}></DhvLineage>, t => <DhvBulk {...t}></DhvBulk>, t => <DhvGraph {...t} big></DhvGraph>];
const dhPair = (i, j, at) => p => p.t < at ? DHV_SCREENS[i](p) : <div style={{ position: 'absolute', inset: 0, opacity: MOTION.glide(0, 1, at, at + 0.4)(p.t) }}>{DHV_SCREENS[j]({ t: p.t - at, T: p.T })}</div>;
DHV_SCREENS.push(dhPair(0, 1, 2.6), dhPair(2, 3, 2.6));
function DhVid({ T, a, a0, mode }) {
  const Scr = DHV_SCREENS[mode] || DHV_SCREENS[0];
  return <ModWin T={T} a={a} a0={a0} title="Data Hub">{tl => Scr({ t: tl, T })}</ModWin>;
}

// ——— Delivery Station video
const DSV_O = ['Supplier', 'Part', 'Contract', 'Purchase Order'];
const DSV_D = [['Excel reports', 'XLSX · add-in', 'e'], ['Data warehouse', 'DATABASE', 'd'], ['Planning system', 'API', 'a'], ['File share', 'CSV', 'f']];
function DsvFlow({ t, T }) {
  const OX = 90, OW2 = 260, HX = 560, DX = 1050, DW = 300, oy = i => 110 + i * 92, dy = i => 110 + i * 92;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DGrid></DGrid>
      <OLab style={{ position: 'absolute', left: OX, top: 60, ...fadeUp(t, 0.05) }}>LOGICAL CONTEXT</OLab>
      <OLab style={{ position: 'absolute', left: HX, top: 60, ...fadeUp(t, 0.3) }}>DELIVERY STATION</OLab>
      <OLab style={{ position: 'absolute', left: DX, top: 60, ...fadeUp(t, 0.6) }}>DESTINATIONS</OLab>
      <svg width={OVW} height={OVH} style={{ position: 'absolute', inset: 0 }}>
        {DSV_O.map((o, i) => { const d = elbow(OX + OW2, oy(i) + 28, HX, 270, OX + OW2 + 60 + i * 20); return <g key={'o' + i} opacity={oe(t, 0.5 + i * 0.08, 0.4)}><path d={d} fill="none" stroke={B.lo} strokeOpacity={0.35}></path><Packet d={d} T={T} off={i * 23} c={U.sky}></Packet></g>; })}
        {DSV_D.map((o, i) => { const d = elbow(HX + 240, 270, DX, dy(i) + 28, HX + 300 + i * 20); return <g key={'d' + i} opacity={oe(t, 1.1 + i * 0.12, 0.4)}><path d={d} fill="none" stroke={U.cyan} strokeOpacity={0.35}></path><Packet d={d} T={T} off={i * 29}></Packet></g>; })}
      </svg>
      {DSV_O.map((n, i) => <div key={n} style={{ position: 'absolute', left: OX, top: oy(i), width: OW2, height: 56, ...DP, background: '#13244a', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...fadeUp(t, 0.1 + i * 0.08) }}><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>{String(i + 1).padStart(2, '0')}</span><span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span></div>)}
      <div style={{ position: 'absolute', left: HX, top: 210, width: 240, height: 120, ...DP, background: 'rgba(23,132,241,.12)', border: '1px solid ' + U.hi, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, ...fadeUp(t, 0.35) }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: U.ink }}>Deliveries</span>
        <span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>REPORTS · APIS · FILES</span>
      </div>
      {DSV_D.map(([n, k], i) => <div key={n} style={{ position: 'absolute', left: DX, top: dy(i), width: DW, height: 56, ...DP, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', ...fadeUp(t, 1.2 + i * 0.12) }}><span style={{ width: 6, height: 24, background: U.cyan }}></span><span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>{k}</span></div>)}
    </div>
  );
}

const DSV_X = [['Supplier A', 'Castings', 4.21, 0.96, 98, 'A'], ['Supplier B', 'Fasteners', 2.87, 0.91, 94, 'B'], ['Supplier C', 'Alloys', 1.95, 0.99, 97, 'A'], ['Supplier D', 'Machining', 1.12, 0.88, 90, 'B'], ['Supplier E', 'Castings', 0.84, 0.94, 95, 'A'], ['Supplier F', 'Electronics', 0.61, 0.97, 99, 'A']];
function DsvExcel({ t, T }) {
  const XL = { bg: '#0a1224', sheet: '#0d1730', line: '#1a2850', hdr: '#13203a' };
  const W = 1000, RH = 34, CG = '36px 190px 130px 170px 110px 100px 90px';
  const refreshed = t > 1.3, press = t > 1.05 && t < 1.3;
  const cell = (r, k) => oe(t, 1.4 + r * 0.1 + k * 0.03, 0.25);
  const tot = DSV_X.reduce((s, r) => s + r[2], 0);
  const barMax = 4.21;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 40, top: 20, width: W, bottom: 20, background: XL.bg, border: '1px solid ' + U.edge, borderRadius: 4, overflow: 'hidden', ...fadeUp(t, 0.05) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 34, padding: '0 14px', background: XL.hdr, borderBottom: '1px solid ' + XL.line, fontSize: 13, color: U.mute }}>
          {['File', 'Home', 'Insert', 'Data', 'View', 'Vulqan'].map(l => <span key={l} style={{ color: l === 'Vulqan' ? U.cyan : U.mute, fontWeight: l === 'Vulqan' ? 600 : 400, borderBottom: l === 'Vulqan' ? '2px solid ' + U.cyan : 'none', paddingBottom: 2 }}>{l}</span>)}
          <span style={{ flex: 1 }}></span><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>supplier_scorecard.xlsx</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 30, padding: '0 10px', borderBottom: '1px solid ' + XL.line, fontFamily: UM, fontSize: 12 }}>
          <span style={{ width: 50, color: U.lab }}>D9</span><span style={{ color: U.lab }}>fx</span><span style={{ color: U.ink }}>=VULQAN.SUM("Supplier.Spend", "Region=Southeast")</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: CG, height: 24, background: XL.hdr, borderBottom: '1px solid ' + XL.line }}>{['', 'A', 'B', 'C', 'D', 'E', 'F'].map((l, k) => <span key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab, borderRight: '1px solid ' + XL.line }}>{l}</span>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: CG, height: 44 }}><span style={{ borderRight: '1px solid ' + XL.line, background: XL.hdr, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab }}>1</span><span style={{ gridColumn: 'span 6', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 19, fontWeight: 600, color: U.ink }}>Supplier scorecard · Southeast · July</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: CG, height: RH, background: 'rgba(23,132,241,.22)', borderTop: '1px solid ' + XL.line, borderBottom: '1px solid ' + U.hi }}>
          <span style={{ background: XL.hdr, borderRight: '1px solid ' + XL.line, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab }}>2</span>
          {['Supplier', 'Commodity', 'Spend (M)', 'On-time', 'Quality', 'Grade'].map((h, k) => <span key={h} style={{ display: 'flex', alignItems: 'center', justifyContent: k > 1 ? 'flex-end' : 'flex-start', padding: '0 12px', fontSize: 13, fontWeight: 600, color: U.ink, borderRight: '1px solid ' + XL.line }}>{h}</span>)}
        </div>
        {DSV_X.map((r, i) => (
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: CG, height: RH, borderBottom: '1px solid ' + XL.line, background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
            <span style={{ background: XL.hdr, borderRight: '1px solid ' + XL.line, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab }}>{i + 3}</span>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, color: U.ink, borderRight: '1px solid ' + XL.line, opacity: cell(i, 0) }}>{r[0]}</span>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, color: U.mute, borderRight: '1px solid ' + XL.line, opacity: cell(i, 1) }}>{r[1]}</span>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, color: U.ink, borderRight: '1px solid ' + XL.line, opacity: cell(i, 2) }}><span style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: (r[2] / barMax) * 100 * cell(i, 2) + 'px', background: 'rgba(23,132,241,.35)' }}></span><span style={{ position: 'relative' }}>{r[2].toFixed(2)}</span></span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, color: r[3] < 0.9 ? OWARN : U.ink, borderRight: '1px solid ' + XL.line, opacity: cell(i, 3) }}>{Math.round(r[3] * 100)}%</span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, color: U.ink, borderRight: '1px solid ' + XL.line, opacity: cell(i, 4) }}>{r[4]}</span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', borderRight: '1px solid ' + XL.line, opacity: cell(i, 5) }}><span style={{ padding: '1px 8px', fontFamily: UM, fontSize: 12, fontWeight: 600, color: r[5] === 'A' ? '#0b1428' : U.ink, background: r[5] === 'A' ? U.cyan : 'transparent', border: '1px solid ' + (r[5] === 'A' ? U.cyan : U.lab), borderRadius: 2 }}>{r[5]}</span></span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: CG, height: RH, borderTop: '2px solid ' + U.lab, opacity: cell(6, 0) }}>
          <span style={{ background: XL.hdr, borderRight: '1px solid ' + XL.line, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: 11, color: U.lab }}>9</span>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, fontWeight: 600, color: U.ink }}>Total</span><span></span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, fontWeight: 600, color: U.cyan, outline: '2px solid ' + U.hi, outlineOffset: -2 }}>{tot.toFixed(2)}</span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, fontWeight: 600, color: U.ink }}>94%</span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', fontFamily: UM, fontSize: 14, fontWeight: 600, color: U.ink }}>96</span><span></span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 30, display: 'flex', alignItems: 'stretch', background: XL.hdr, borderTop: '1px solid ' + XL.line }}>
          {['Southeast', 'Northeast', 'Midwest', 'West', 'Summary'].map((l, k) => <span key={l} style={{ display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 12, color: k ? U.lab : U.ink, fontWeight: k ? 400 : 600, background: k ? 'transparent' : XL.sheet, borderRight: '1px solid ' + XL.line, borderTop: k ? 'none' : '2px solid ' + U.cyan }}>{l}</span>)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 20, right: 40, bottom: 20, background: '#0c1630', border: '1px solid ' + U.hi, borderRadius: 4, padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 14, ...fadeUp(t, 0.3) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 18, width: 'auto' }}></img><span style={{ flex: 1 }}></span><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>ADD-IN</span></div>
        {[['Object', 'Supplier'], ['Filter', 'Region = Southeast'], ['Period', 'July']].map(([k, val], i) => <div key={k} style={{ opacity: oe(t, 0.4 + i * 0.12, 0.3) }}><div style={{ fontSize: 12, color: U.lab }}>{k}</div><div style={{ marginTop: 4, height: 34, display: 'flex', alignItems: 'center', padding: '0 10px', border: '1px solid ' + U.edge, borderRadius: 2, fontSize: 14, color: U.ink }}>{val}</div></div>)}
        <span style={{ textAlign: 'center', padding: '10px 0', borderRadius: 4, fontSize: 15, fontWeight: 600, color: refreshed ? '#0b1428' : '#fff', background: refreshed ? U.cyan : U.hi, transform: 'scale(' + (press ? 0.96 : 1) + ')', opacity: oe(t, 0.8, 0.3) }}>{refreshed ? 'Refreshed' : 'Refresh data'}</span>
        <span style={{ flex: 1 }}></span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: U.mute, opacity: refreshed ? 1 : 0.4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot c={U.cyan}></Dot>Live from Data Hub</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot c={U.cyan}></Dot>Quality score 97</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot c={U.cyan}></Dot>Permissions applied</span>
        </div>
      </div>
    </div>
  );
}

function DsvApi({ t, T }) {
  const J = ['{', '  "supplier_id": "SUP-0003",', '  "name": "Supplier C",', '  "rating": "A",', '  "on_time": 0.99,', '  "quality": 97', '}'];
  const F = [['Endpoint', 'POST /v1/suppliers'], ['Destination', 'Planning system'], ['Auth', 'OAuth 2.0 · client credentials'], ['Object', 'Supplier · 1,284 records']];
  const ok = t > 2.4;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 90, top: 30, width: 560, ...DP, ...fadeUp(t, 0.05) }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 20px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1 }}>API DELIVERY</OLab><span style={{ padding: '3px 10px', fontFamily: UM, fontSize: 12, color: U.cyan, border: '1px solid ' + U.cyan, borderRadius: 3 }}>REST</span></div>
        {F.map(([k, val], i) => <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', height: 60, padding: '0 20px', borderBottom: '1px solid ' + U.edge, ...fadeUp(t, 0.2 + i * 0.15, 0.3) }}><OLab style={{ fontSize: 11 }}>{k.toUpperCase()}</OLab><span style={{ fontFamily: UM, fontSize: 15, color: U.ink }}>{val}</span></div>)}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 70, padding: '0 20px', opacity: oe(t, 1.0, 0.3) }}>
          <span style={{ padding: '10px 20px', borderRadius: 4, fontSize: 15, fontWeight: 600, color: '#fff', background: U.hi }}>Send test</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 14, color: ok ? U.cyan : U.lab }}><Dot c={ok ? U.cyan : U.sky}></Dot>{ok ? '200 OK · 118 ms' : t > 1.6 ? 'Sending…' : 'Not tested'}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 700, top: 30, right: 90, ...DP, background: '#0a1224', ...fadeUp(t, 0.4) }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 20px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1 }}>PAYLOAD PREVIEW</OLab><span style={{ fontFamily: UM, fontSize: 12, color: U.lab }}>application/json</span></div>
        <div style={{ padding: '18px 22px', fontFamily: UM, fontSize: 17, lineHeight: 1.8 }}>{J.map((l, i) => { const m = l.match(/^(\s*)("[^"]+")(: )(.*)$/); return <div key={i} style={{ whiteSpace: 'pre', color: U.mute, opacity: oe(t, 0.6 + i * 0.1, 0.3) }}>{m ? [m[1], <span key="k" style={{ color: U.sky }}>{m[2]}</span>, m[3], <span key="v" style={{ color: U.cyan }}>{m[4]}</span>] : <span style={{ color: U.mute }}>{l}</span>}</div>; })}</div>
      </div>
    </div>
  );
}

function DsvSched({ t, T }) {
  const D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const J = [['Supplier scorecard', 'Excel', [0], U.cyan, '07:00'], ['Planning system sync', 'API', [0, 1, 2, 3, 4, 5, 6], U.sky, 'Every 6 h'], ['Warehouse load', 'Database', [0, 1, 2, 3, 4], U.hi, '02:00'], ['Month-end pack', 'File', [4], OWARN, 'Last Fri']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 30, ...fadeUp(t, 0.05) }}>SCHEDULE · THIS WEEK</OLab>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 64, ...DP, ...fadeUp(t, 0.1) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 140px repeat(7, 1fr)', height: 44, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge }}>{['DELIVERY', 'WHEN'].concat(D.map(d => d.toUpperCase())).map((h, k) => <OLab key={k} style={{ fontSize: 11, textAlign: k > 1 ? 'center' : 'left' }}>{h}</OLab>)}</div>
        {J.map(([n, k, days, c, when], i) => <div key={n} style={{ display: 'grid', gridTemplateColumns: '300px 140px repeat(7, 1fr)', height: 80, alignItems: 'center', padding: '0 20px', borderBottom: i < J.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.3 + i * 0.2, 0.3) }}>
          <div><div style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</div><div style={{ fontFamily: UM, fontSize: 12, color: U.lab, marginTop: 3 }}>{k.toUpperCase()}</div></div>
          <span style={{ fontFamily: UM, fontSize: 14, color: U.mute }}>{when}</span>
          {D.map((d, j) => { const on = days.includes(j), p = oe(t, 0.6 + i * 0.2 + j * 0.05, 0.25); return <span key={d} style={{ justifySelf: 'center', width: 34, height: 22, borderRadius: 2, background: on ? c : 'transparent', border: '1px solid ' + (on ? c : U.edge), opacity: on ? p : 0.6 }}></span>; })}
        </div>)}
      </div>
    </div>
  );
}

function DsvPerm({ t, T }) {
  const R = [['Finance team', 'All regions', 'Full', U.cyan], ['Regional managers', 'Own region only', 'Filtered', U.sky], ['External planner', 'Supplier · Rating hidden', 'Masked', OWARN], ['Contractors', 'No access', 'Blocked', '#ff8a7a']];
  const chk = MOTION.glide(0, 1, 2.2, 2.8)(t);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <OLab style={{ position: 'absolute', left: 90, top: 30, ...fadeUp(t, 0.05) }}>PERMISSIONS · SUPPLIER SCORECARD</OLab>
      <div style={{ position: 'absolute', left: 90, width: 860, top: 64, ...DP, ...fadeUp(t, 0.1) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', height: 44, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge }}>{['RECIPIENT', 'SEES', 'ACCESS'].map(h => <OLab key={h} style={{ fontSize: 11 }}>{h}</OLab>)}</div>
        {R.map(([n, s, a, c], i) => <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', height: 78, alignItems: 'center', padding: '0 20px', borderBottom: i < R.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.3 + i * 0.2, 0.3) }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontSize: 15, color: U.mute }}>{s}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 13, color: c }}><Dot c={c}></Dot>{a.toUpperCase()}</span>
        </div>)}
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 64, right: 90, ...DP, border: '1px solid ' + (chk > 0.9 ? U.cyan : U.edge), padding: '22px 24px', opacity: 0.4 + 0.6 * chk }}>
        <OLab>ENFORCED ON EVERY DELIVERY</OLab>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>{['Row-level filters', 'Column masking', 'Audit logged'].map((l, i) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: U.ink, opacity: oe(t, 2.3 + i * 0.15, 0.3) }}><Dot c={U.cyan}></Dot>{l}</span>)}</div>
      </div>
    </div>
  );
}

const DSV_SCREENS = [DsvFlow, DsvExcel, DsvApi, DsvSched, DsvPerm];
function DsVid({ T, a, a0, mode }) {
  const Scr = DSV_SCREENS[mode] || DsvFlow;
  return <ModWin T={T} a={a} a0={a0} title="Delivery Station">{tl => <Scr t={tl} T={T}></Scr>}</ModWin>;
}

// ——— Ask MAIA video
const AMV_ROWS = [['Initiative A', 2880, 282, 9.8], ['Initiative B', 1940, 184, 9.5], ['Initiative C', 2210, 190, 8.6], ['Initiative D', 1620, 131, 8.1], ['Initiative E', 2450, 164, 6.7], ['Initiative F', 1310, 68, 5.2]];
const AMV_Q = 'Which initiatives have the most uncovered parts?';
const AMV_A = 'Initiative A is highest at 9.8% uncovered, 282 of 2,880 parts. Four initiatives are above 8%.';
function AmvBubble({ me, children, o = 1 }) {
  return <div style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '12px 16px', borderRadius: 5, fontSize: 17, lineHeight: 1.45, color: U.ink, background: me ? 'rgba(23,132,241,.16)' : '#0e1730', border: '1px solid ' + (me ? U.hi : U.edge), opacity: o, transform: 'translateY(' + (1 - o) * 8 + 'px)' }}>{children}</div>;
}
function AmvDots({ T }) { return <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2].map(k => <span key={k} style={{ width: 8, height: 8, borderRadius: 8, background: U.sky, opacity: 0.35 + 0.65 * Math.abs(Math.sin(T * 4 - k * 0.6)) }}></span>)}</div>; }
function AmvChatPane({ t, T, model = 'Your LLM', menu = 0, hov = -1, typedQ = true, left = 90, width = 1260, extra = null }) {
  const tq = typedQ ? typed(AMV_Q, t, 0.2, 1.0) : AMV_Q;
  const sent = !typedQ || t > 1.2, rep = typedQ ? oe(t, 1.8, 0.5) : 1;
  const M = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral'];
  return (
    <div style={{ position: 'absolute', left, top: 24, width, bottom: 24, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, height: 44, zIndex: 2 }}>
        <OLab style={{ flex: 1 }}>ASK MAIA</OLab>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', ...DP, border: '1px solid ' + (menu > 0.01 ? U.hi : U.edge), fontSize: 16, color: U.ink }}><span style={{ fontFamily: UM, fontSize: 11, letterSpacing: '.12em', color: U.lab }}>LLM</span><b style={{ fontWeight: 600 }}>{model}</b><span style={{ color: U.lab }}>▾</span></span>
        {menu > 0.01 ? <div style={{ position: 'absolute', right: 0, top: 50, width: 260, ...DP, background: '#0c1630', border: '1px solid ' + U.hi, boxShadow: '0 20px 50px rgba(2,4,10,.6)', opacity: menu }}>
          <OLab style={{ padding: '12px 16px', borderBottom: '1px solid ' + U.edge }}>CHOOSE YOUR LLM</OLab>
          {M.map((m, k) => <div key={m} style={{ display: 'flex', alignItems: 'center', height: 46, padding: '0 16px', fontSize: 17, color: k === hov ? U.sky : U.ink, background: k === hov ? U.sel : 'transparent', boxShadow: k === hov ? 'inset 3px 0 0 ' + U.hi : 'none' }}><span style={{ flex: 1 }}>{m}</span>{m === model ? <Dot c={U.cyan}></Dot> : null}</div>)}
        </div> : null}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14, padding: '14px 0' }}>
        {sent ? <AmvBubble me>{AMV_Q}</AmvBubble> : null}
        {sent && rep <= 0 ? <AmvDots T={T}></AmvDots> : null}
        {rep > 0 ? <AmvBubble o={rep}>{AMV_A}</AmvBubble> : null}
        {extra}
      </div>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 16px', ...DP, border: '1px solid ' + (sent ? U.edge : U.hi) }}><span style={{ fontSize: 16, color: sent || !tq ? U.lab : U.ink, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sent || !tq ? 'Ask a question about your data' : tq}</span></div>
    </div>
  );
}
function AmvChat({ t, T }) { return <AmvChatPane t={t} T={T}></AmvChatPane>; }
function AmvLlm({ t, T }) {
  const menu = MOTION.enter(0, 1, 0.3, 0.7)(t) * (1 - MOTION.glide(0, 1, 2.8, 3.2)(t));
  const hov = t < 1.2 ? 0 : 1, model = t > 2.2 ? 'Claude' : 'GPT';
  return <AmvChatPane t={t} T={T} typedQ={false} model={model} menu={menu} hov={hov}></AmvChatPane>;
}
function AmvExplain({ t, T }) {
  const O = [['Initiative', 'grouped by'], ['Part', 'counted'], ['Contract', 'coverage checked'], ['Supplier', 'joined']];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 760, height: OVH, opacity: 0.45 }}><AmvChatPane t={99} T={T} typedQ={false} model="Claude" left={90} width={620}></AmvChatPane></div>
      <div style={{ position: 'absolute', left: 780, top: 24, right: 90, bottom: 24, ...DP, background: '#0c1630', border: '1px solid ' + U.hi, padding: '22px 24px', ...fadeUp(t, 0.1) }}>
        <OLab>HOW THIS WAS ANSWERED</OLab>
        <div style={{ marginTop: 12, fontSize: 17, lineHeight: 1.45, color: U.ink }}>The LLM reads Vulqan's logical model, not raw tables.</div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {O.map(([n, how], i) => <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 46, padding: '0 14px', ...DP, background: '#13244a', opacity: oe(t, 0.5 + i * 0.25, 0.3) }}><span style={{ fontFamily: UM, fontSize: 11, color: U.lab }}>{String(i + 1).padStart(2, '0')}</span><span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ fontFamily: UM, fontSize: 12, color: U.sky }}>{how}</span></div>)}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: U.mute, opacity: oe(t, 1.7, 0.3) }}><Dot c={U.cyan}></Dot>Definitions and relationships from your LIF</div>
      </div>
    </div>
  );
}
function AmvTable({ t, T }) {
  const G = '1fr 140px 140px 140px';
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 30, ...DP, ...fadeUp(t, 0.05) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 20px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1 }}>UNCOVERED PARTS BY INITIATIVE</OLab><div style={{ display: 'flex' }}>{['Table', 'Chart', 'Query'].map((l, k) => <span key={l} style={{ padding: '5px 14px', fontSize: 14, fontWeight: 600, color: k ? U.ink : '#fff', background: k ? 'transparent' : U.hi, border: '1px solid ' + (k ? U.edge : U.hi) }}>{l}</span>)}</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: G, height: 40, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge }}>{['INITIATIVE', 'PARTS', 'UNCOVERED', '%'].map((h, k) => <OLab key={h} style={{ fontSize: 11, textAlign: k ? 'right' : 'left' }}>{h}</OLab>)}</div>
      {AMV_ROWS.map(([n, p, u, pc], i) => <div key={n} style={{ display: 'grid', gridTemplateColumns: G, height: 54, alignItems: 'center', padding: '0 20px', borderBottom: i < AMV_ROWS.length - 1 ? '1px solid ' + U.edge : 'none', ...fadeUp(t, 0.2 + i * 0.08, 0.3) }}><span style={{ fontSize: 16, fontWeight: 600, color: U.ink }}>{n}</span><span style={{ textAlign: 'right', fontFamily: UM, fontSize: 15, color: U.mute }}>{ofmt(p)}</span><span style={{ textAlign: 'right', fontFamily: UM, fontSize: 15, color: U.ink }}>{u}</span><span style={{ textAlign: 'right', fontFamily: UM, fontSize: 15, color: pc >= 8 ? U.cyan : U.ink }}>{pc.toFixed(1)}</span></div>)}
    </div>
  );
}
function AmvChart({ t, T }) {
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 30, bottom: 30, ...DP, padding: '0 0 20px', ...fadeUp(t, 0.05) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 20px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1 }}>UNCOVERED PARTS BY INITIATIVE · %</OLab><div style={{ display: 'flex' }}>{['Table', 'Chart', 'Query'].map((l, k) => <span key={l} style={{ padding: '5px 14px', fontSize: 14, fontWeight: 600, color: k === 1 ? '#fff' : U.ink, background: k === 1 ? U.hi : 'transparent', border: '1px solid ' + (k === 1 ? U.hi : U.edge) }}>{l}</span>)}</div></div>
      <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {AMV_ROWS.map(([n, , , pc], i) => { const g = Easing.easeOutCubic(clamp((t - 0.2 - i * 0.07) / 0.7, 0, 1)), hot = pc >= 8; return <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 30 }}><span style={{ width: 130, fontSize: 15, color: U.mute }}>{n}</span><span style={{ height: 14, borderRadius: 2, width: 840 * (pc / 10) * g, background: hot ? U.cyan : U.hi }}></span><span style={{ fontFamily: UM, fontSize: 15, color: hot ? U.cyan : U.ink, opacity: g }}>{pc.toFixed(1)}</span></div>; })}
      </div>
    </div>
  );
}
function AmvQuery({ t, T }) {
  const Q = ['MATCH (i:Initiative)-[:INCLUDES]->(p:Part)', 'OPTIONAL MATCH (p)-[:COVERED_BY]->(c:Contract)', 'WITH i, count(p) AS parts,', '     sum(CASE WHEN c IS NULL THEN 1 ELSE 0 END) AS uncovered', 'RETURN i.name, parts, uncovered,', '       round(100.0 * uncovered / parts, 1) AS pct', 'ORDER BY pct DESC'];
  const edit = t > 1.6;
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 30, bottom: 30, ...DP, background: '#0a1224', ...fadeUp(t, 0.05) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 20px', borderBottom: '1px solid ' + U.edge }}><OLab style={{ flex: 1 }}>QUERY · EDITABLE</OLab><span style={{ padding: '7px 16px', borderRadius: 4, fontSize: 14, fontWeight: 600, color: '#fff', background: U.hi, opacity: oe(t, 1.2, 0.3) }}>Run again</span></div>
      <div style={{ padding: '20px 24px', fontFamily: UM, fontSize: 18, lineHeight: 1.85 }}>
        {Q.map((l, i) => { const hl = edit && i === 6; return <div key={i} style={{ whiteSpace: 'pre', color: hl ? U.cyan : U.mute, background: hl ? 'rgba(111,227,255,.08)' : 'transparent', opacity: oe(t, 0.15 + i * 0.08, 0.3) }}><span style={{ display: 'inline-block', width: 34, color: U.lab, fontSize: 13 }}>{i + 1}</span>{hl ? 'ORDER BY pct DESC LIMIT 5' : l}</div>; })}
      </div>
    </div>
  );
}
function AmvTcq({ t, T }) {
  const S = [[AmvTable, 0], [AmvChart, 2.0], [AmvQuery, 4.0]];
  let k = 0; S.forEach((s, i) => { if (t >= s[1]) k = i; });
  const [C, at] = S[k];
  return <div style={{ position: 'absolute', inset: 0, opacity: k ? MOTION.glide(0, 1, at, at + 0.35)(t) : 1 }}><C t={t - at} T={T}></C></div>;
}
function AmvFinal({ t, T }) {
  const ex = <div style={{ display: 'flex', gap: 10, opacity: oe(t, 0.4, 0.4) }}>{['Table', 'Chart', 'Query'].map(l => <span key={l} style={{ padding: '6px 12px', ...DP, fontSize: 14, color: U.sky }}>{l}</span>)}</div>;
  return <AmvChatPane t={t} T={T} typedQ={false} model="Claude" extra={ex}></AmvChatPane>;
}
const AMV_SCREENS = [AmvChat, AmvLlm, AmvExplain, AmvTcq, AmvFinal];
function AmVid({ T, a, a0, mode }) {
  const Scr = AMV_SCREENS[mode] || AmvChat;
  return <ModWin T={T} a={a} a0={a0} title="Ask MAIA">{tl => <Scr t={tl} T={T}></Scr>}</ModWin>;
}

const OV_SCREENS = [OvDataMaia, OvLogic, OvQuality, OvHub, OvDelivery, OvAsk];
const SUITE = [['Data MAIA'], ['Logic Builder'], ['Quality Queue'], ['Data Hub'], ['Delivery Station'], ['Ask MAIA']];
function Suite({ T, mode }) {
  const { CUES } = useComposition();
  const VB = { x: 240, y: 84, w: 1440, h: 624 };
  const TW = 200;
  const A = i => CUES['L' + (i + 1)];
  const k = mode, tl = T - A(k);
  const sw = MOTION.glide(0, 1, 0, 0.5)(tl);
  const Scr = OV_SCREENS[k];
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'absolute', left: VB.x, top: VB.y, width: VB.w, height: VB.h, overflow: 'hidden', background: U.bg, border: '1px solid ' + U.edge, borderRadius: 6, boxShadow: '0 0 0 1px rgba(125,179,238,.10),0 0 60px rgba(23,132,241,.14),0 30px 80px rgba(2,4,10,.6)', fontFamily: UF }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 76, padding: '0 22px', background: '#13203a', borderBottom: '1px solid ' + U.edge }}>
          <img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 30, width: 'auto', marginRight: 26, filter: 'drop-shadow(0 0 .8px #9cc7f5) drop-shadow(0 0 .8px #9cc7f5)' }}></img>
          <div style={{ display: 'flex', alignSelf: 'stretch', gap: 4 }}>
            {SUITE.map(([n], i) => {
              const on = i === k;
              return (
                <div key={n} style={{ position: 'relative', width: TW, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ padding: '10px 16px', fontSize: 19, fontWeight: on ? 700 : 500, color: on ? U.ink : U.sky, opacity: on ? 1 : 0.7, whiteSpace: 'nowrap', background: on ? 'rgba(111,227,255,' + 0.12 * sw + ')' : 'transparent', border: '1px solid ' + (on ? 'rgba(111,227,255,' + 0.45 * sw + ')' : 'transparent') }}>{n}</span>
                  {on ? <span style={{ position: 'absolute', left: 12, right: 12, bottom: 0, height: 3, background: U.cyan, boxShadow: '0 0 16px ' + U.cyan, transform: 'scaleX(' + sw + ')' }}></span> : null}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 76, width: OVW, height: OVH, opacity: sw }}>
          <Scr t={tl} T={T}></Scr>
        </div>
      </div>
    </foreignObject>
  );
}

// ——— Ask MAIA: chatbot bookends + the questions / answer / "how this was answered" screen
const AQ = [['Which initiatives have the worst uncovered right now, and how many parts each?', 'just now'], ['Only count parts vacant more than 30 days', 'just now · refined'], ['How many leases expire in the next 90 days?', '11 minutes ago'], ['Average escalation rate by initiative', '24 minutes ago'], ['Which suppliers hold more than five commodities?', 'yesterday'], ['Purchase Orders posted without a matching contract', 'yesterday'], ['Turn cost per part, last four quarters', '2 days ago']];
const AB = [['Arizona', 9.8, '2,880', '282', '1,690', 27, 204], ['Nevada', 9.5, '548', '52', '1,755', 29, 40], ['New Mexico', 8.6, '152', '13', '1,320', 26, 11], ['Arkansas', 8.5, '412', '35', '1,155', 24, 29], ['Louisiana', 8.4, '344', '29', '1,284', 23, 26], ['Colorado', 8.2, '184', '15', '1,966', 25, 14], ['Virginia', 7.5, '226', '17', '1,688', 20, 16], ['North Texas', 7.4, '4,102', '304', '1,845', 21, 188], ['Kentucky', 7.3, '288', '21', '1,176', 21, 19], ['South Carolina', 7.2, '848', '61', '1,512', 20, 44], ['Montana', 7.1, '98', '7', '1,352', 22, 6], ['Nebraska', 6.5, '124', '8', '1,122', 18, 7], ['Oklahoma', 6.4, '610', '39', '1,288', 17, 31], ['Kansas', 6.4, '466', '30', '1,210', 18, 25]];
const AEX = [['Uncovered is not a variable in the model, so it had to be derived.', 'No variable on any object carries it'], ['Counted parts with no active contract as at today.', 'Part, and its relationship to Contract'], ['Excluded parts whose last contract ended less than 30 days ago.', 'Added by the follow-up question'], ['Divided by total parts on each initiative.', 'Initiative › Part Total, already a variable'], ['Grouped by the initiative each commodity belongs to.', 'Commodity → Initiative'], ['Added three columns you did not ask for but usually want.', 'Avg spend, turn days, leases expiring in 90 days']];
const AQP = [['WHERE', [['Commodity is in an active Initiative'], ['Part last Contract ended 30+ days ago', 'from the follow-up']]], ['SELECT VARIABLES', [['Initiative Name']]], ['DEFINE FUNCTIONS', [['Count Part', 'as Parts'], ['Count Part', 'where Part has no active Contract · as Not Covered'], ['Not Covered divided by Parts times 100', 'as Uncovered']]], ['GROUP BY', [['Initiative Name']]], ['SORT BY', [['Uncovered descending']]]];
const ACY = ['MATCH (p:Commodity)-[:BELONGS_TO]->(pf:Initiative)', 'MATCH (p)-[:HAS]->(u:Part)', 'OPTIONAL MATCH (u)-[:HAS]->(l:Contract)', "WHERE l.status = 'Active'", 'WITH pf, u, l, max(l.end_date) AS last_end', 'WHERE l IS NULL AND last_end < date() - duration({days: 30})', 'RETURN pf.name AS initiative,', '       count(u) AS parts,', '       round(100.0 * count(u) / pf.part_total, 1) AS uncovered', 'ORDER BY uncovered DESC'];
const AREG = { q: [0, 0, 1400, 745], how: [600, 0, 1400, 745], pad: [1390, 0, 610, 324] };
const KW = /^(\s*)(OPTIONAL MATCH|MATCH|WHERE|WITH|RETURN|ORDER BY)(.*)$/;
function cyLine(l) {
  const m = l.match(KW);
  if (!m) return <span>{l}</span>;
  return <span>{m[1]}<b style={{ color: U.sky }}>{m[2]}</b>{m[3]}</span>;
}
const MB = s => <span style={{ width: s, height: s, flex: 'none', background: U.hi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UM, fontSize: s * 0.45, color: '#fff' }}>M</span>;

const AMODELS = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral'];
function AskChat({ T, tl, later, llm, model }) {
  const menuO = llm != null ? MOTION.enter(0, 1, 0.3, 0.7)(llm) * (1 - MOTION.glide(0, 1, 2.7, 3.1)(llm)) : 0;
  const hov = llm != null ? (llm < 1.2 ? 0 : 1) : -1;
  const mName = llm != null ? (llm > 2.1 ? 'Claude' : 'GPT') : (model || 'GPT');
  const q1 = AQ[0][0], q2 = 'Why is Arizona so high?';
  const typeQ = later ? typed(q2, tl, 0.2, 0.8) : typed(q1, tl, 0.2, 1.1);
  const sent = later ? tl > 1.1 : tl > 1.4;
  const dots = later ? tl > 1.2 && tl < 1.8 : tl > 1.5 && tl < 2.2;
  const rep = later ? MOTION.enter(0, 1, 1.8, 2.3)(tl) : MOTION.enter(0, 1, 2.2, 2.7)(tl);
  const bubble = (txt, me, o, key) => (
    <div key={key} style={{ alignSelf: me ? 'flex-end' : 'flex-start', display: 'flex', gap: 12, maxWidth: '78%', opacity: o, transform: 'translateY(' + (1 - o) * 10 + 'px)' }}>
      {me ? null : MB(30)}
      <div style={{ padding: '14px 18px', fontSize: 20, lineHeight: 1.45, color: U.ink, background: me ? 'rgba(23,132,241,.18)' : '#0e1730', border: '1px solid ' + (me ? U.hi : U.edge) }}>{txt}</div>
    </div>
  );
  const bars = AB.slice(0, 6);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: U.bg, fontFamily: UF }}>
      <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: 14, height: 68, padding: '0 24px', background: U.head, borderBottom: '1px solid ' + U.edge }}>
        {MB(34)}<span style={{ fontSize: 24, fontWeight: 700, color: U.ink }}>Ask MAIA</span><span style={{ fontSize: 17, color: U.mute }}>Chat with your data</span>
        <span style={{ flex: 1 }}></span>
        <div style={{ position: 'relative' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', border: '1px solid ' + (menuO > 0.01 ? U.hi : U.edge), background: '#0e1730', fontSize: 18, color: U.ink }}><span style={{ fontFamily: UM, fontSize: 12, letterSpacing: '.12em', color: U.lab }}>LLM</span><b style={{ fontWeight: 600 }}>{mName}</b><span style={{ color: U.lab }}>▾</span></span>
          {menuO > 0.01 ? (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 280, background: '#0e1730', border: '1px solid ' + U.hi, boxShadow: '0 20px 50px rgba(2,4,10,.6)', opacity: menuO, transform: 'translateY(' + (1 - menuO) * -8 + 'px)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid ' + U.edge }}><MonoLab>CHOOSE YOUR LLM</MonoLab></div>
              {AMODELS.map((m, k) => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, padding: '0 16px', fontSize: 18, color: k === hov ? U.sky : U.ink, background: k === hov ? U.sel : 'transparent', boxShadow: k === hov ? 'inset 3px 0 0 ' + U.hi : 'none' }}>
                  <span style={{ flex: 1 }}>{m}</span>{m === mName ? <Dot c={U.cyan}></Dot> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: UM, fontSize: 14, letterSpacing: '.12em', color: U.cyan }}><Dot c={U.cyan}></Dot>READING 5 OBJECTS</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 16, padding: '20px 28px', overflow: 'hidden' }}>
        {later ? bubble(q1, true, 1, 'o1') : null}
        {later ? bubble(<span>Arizona is worst at <b style={{ color: U.cyan }}>9.8%</b> — 282 of 2,880 parts. Six initiatives sit at 8% or worse.</span>, false, 1, 'o2') : null}
        {sent ? bubble(later ? q2 : q1, true, 1, 'q') : null}
        {dots ? <div style={{ display: 'flex', gap: 8, paddingLeft: 44 }}>{[0, 1, 2].map(q => <span key={q} style={{ width: 10, height: 10, borderRadius: 10, background: U.sky, opacity: 0.35 + 0.65 * Math.abs(Math.sin(T * 4 - q * 0.6)) }}></span>)}</div> : null}
        {rep > 0 && !later ? bubble(
          <div>
            Arizona is worst at <b style={{ color: U.cyan }}>9.8%</b> — 282 of 2,880 parts. Six initiatives sit at 8% or worse.
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
              {bars.map(([n, val], k) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
                  <span style={{ width: 110, color: U.mute }}>{n}</span>
                  <span style={{ height: 10, width: 300 * (val / 10) * Easing.easeOutCubic(clamp((tl - 2.5 - k * 0.08) / 0.6, 0, 1)), background: U.cyan }}></span>
                  <span style={{ fontFamily: UM, color: U.cyan }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 17, fontWeight: 600, color: U.sky }}>Open the answer →</div>
          </div>, false, rep, 'r') : null}
        {rep > 0 && later ? bubble(
          <div>
            Arizona carries <b style={{ color: U.cyan }}>282</b> parts with no active contract, most under Titanium, whose last contract ended in June.
            <div style={{ marginTop: 14, fontFamily: UM, fontSize: 13, letterSpacing: '.14em', color: U.lab }}>OBJECTS IT READ</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{['Commodity', 'Part', 'Contract', 'Initiative', 'Turn'].map((c, k) => <span key={c} style={{ padding: '5px 12px', fontSize: 16, color: U.sky, border: '1px solid ' + U.hi, background: 'rgba(23,132,241,.1)', opacity: MOTION.enter(0, 1, 2.3 + k * 0.15, 2.6 + k * 0.15)(tl) }}>{c}</span>)}</div>
          </div>, false, rep, 'r2') : null}
      </div>
      <div style={{ margin: '0 24px 22px', height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 0 18px', border: '1px solid ' + (sent ? U.edge : U.hi), background: '#0e1730' }}>
        <span style={{ flex: 1, fontSize: 19, color: sent || !typeQ ? U.lab : U.ink, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sent || !typeQ ? 'Ask a question' : typeQ}{!sent && typeQ && frac(T * 2) < 0.5 ? <span style={{ display: 'inline-block', width: 2, height: 20, background: U.sky, marginLeft: 2, verticalAlign: 'middle' }}></span> : null}</span>
        <span style={{ padding: '10px 20px', background: U.hi, fontSize: 17, fontWeight: 600, color: '#fff' }}>Ask</span>
      </div>
    </div>
  );
}

function AskScreen({ T, L, tl, v }) {
  const grow = L === 1 ? MOTION.glide(0, 1, 0.5, 1.8)(tl) : 1;
  const refine = L === 1 ? MOTION.glide(0, 1, 2.4, 3.2)(tl) : 1;
  const table = v && v.table != null ? v.table : (L === 2 ? MOTION.glide(0, 1, 0.3, 0.8)(tl) : 0);
  const tab = v && v.tab != null ? v.tab : (L === 2 ? (tl < 4.1 ? 0 : tl < 5.9 ? 1 : 2) : 0);
  const tt = v && v.tt != null ? v.tt : (L === 2 ? (tab === 1 ? tl - 4.1 : tab === 2 ? tl - 5.9 : tl) : 0);
  const card = { background: '#0e1730', border: '1px solid ' + U.edge };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 2000, height: 745, background: U.bg, fontFamily: UF, color: U.ink }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 380, height: 745, borderRight: '1px solid ' + U.edge, background: '#0c1630' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 18px', borderBottom: '1px solid ' + U.edge }}><MonoLab style={{ flex: 1 }}>QUESTIONS</MonoLab><span style={{ fontFamily: UM, fontSize: 15, color: U.lab }}>{refine > 0.5 ? 14 : 13}</span></div>
        {AQ.map(([q, w], i) => {
          if (i === 1 && L === 1 && refine <= 0) return null;
          const o = i === 1 && L === 1 ? refine : 1;
          const on = i === 0;
          return (
            <div key={q} style={{ padding: '14px 18px', borderBottom: '1px solid ' + U.edge, background: on ? U.sel : 'transparent', boxShadow: on ? 'inset 3px 0 0 ' + U.hi : 'none', opacity: o, maxHeight: 100 * o + (o < 1 ? 0 : 20), overflow: 'hidden' }}>
              <div style={{ fontSize: 17, lineHeight: 1.4, fontWeight: on ? 600 : 500, color: on ? U.sky : U.ink }}>{q}</div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}><span style={{ flex: 1, fontFamily: UM, fontSize: 13, color: U.lab }}>{w}</span>{on ? <span style={{ padding: '2px 8px', fontFamily: UM, fontSize: 11, letterSpacing: '.1em', color: U.sky, border: '1px solid ' + U.hi }}>QUERY OPEN</span> : null}</div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 0 14px', ...card, border: '1px solid ' + (L === 1 && tl > 1.9 && tl < 2.5 ? U.hi : U.edge) }}>
          <span style={{ flex: 1, fontSize: 16, color: L === 1 && tl > 1.9 && tl < 2.5 ? U.ink : U.lab, whiteSpace: 'nowrap', overflow: 'hidden' }}>{L === 1 && tl > 1.9 && tl < 2.5 ? typed('Only count parts vacant more than 30 days', tl, 1.9, 0.5) : 'Ask a question'}</span>
          <span style={{ padding: '8px 16px', background: U.hi, fontSize: 15, fontWeight: 600, color: '#fff' }}>Ask</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 400, top: 0, width: 980, height: 745, ...card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 60, padding: '0 16px', background: U.head, borderBottom: '1px solid ' + U.edge, whiteSpace: 'nowrap' }}>
          <span style={{ display: 'flex', border: '1px solid ' + U.edge }}>{['Table', 'Chart'].map((l, k) => { const on = (table > 0.5 ? 0 : 1) === k; return <span key={l} style={{ padding: '8px 16px', fontSize: 16, fontWeight: 600, color: on ? '#fff' : U.ink, background: on ? U.hi : 'transparent' }}>{l}</span>; })}</span>
          <span style={{ fontFamily: UM, fontSize: 15, color: U.lab }}>27 of 46 rows · 340ms</span><span style={{ flex: 1 }}></span><span style={{ padding: '8px 16px', border: '1px solid ' + U.edge, fontSize: 16 }}>Export</span>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 980, opacity: 1 - table, padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap' }}><b style={{ fontSize: 20 }}>Uncovered by initiative</b><span style={{ fontSize: 15, color: U.lab }}>parts vacant more than 30 days, as a share of total parts</span><span style={{ flex: 1 }}></span><span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: U.mute }}><span style={{ width: 11, height: 11, background: U.cyan }}></span>8% or worse</span></div>
            <div style={{ marginTop: 14 }}>
              {AB.map(([n, val], i) => {
                const pre = val * (1.1 + ((i * 37) % 7) / 60);
                const cur = lerp(pre, val, refine);
                const g = Easing.easeOutCubic(clamp((grow - i * 0.03) / 0.6, 0, 1));
                const hot = val >= 8;
                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 44, whiteSpace: 'nowrap' }}>
                    <span style={{ width: 150, textAlign: 'right', fontSize: 16, color: U.mute }}>{n}</span>
                    <span style={{ height: 18, width: 640 * Math.min(1.1, cur / 10) * g, background: hot ? U.cyan : U.hi, boxShadow: hot && L === 1 && tl > 3.3 ? '0 0 14px rgba(111,227,255,.45)' : 'none' }}></span>
                    <span style={{ flex: 1 }}></span>
                    <b style={{ width: 50, textAlign: 'right', fontFamily: UM, fontSize: 16, color: hot ? U.cyan : U.ink, opacity: g }}>{cur.toFixed(1)}</b>
                  </div>
                );
              })}
            </div>
          </div>
          {table > 0 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 980, opacity: table }}>
              <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(6, 1fr)', height: 46, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge }}>
                {['INITIATIVE', 'PARTS', 'NOT COVERED', 'UNCOVERED', 'AVG SPEND', 'TURN DAYS', 'EXPIRING 90D'].map((h, k) => <MonoLab key={h} style={{ fontSize: 12, textAlign: k ? 'right' : 'left' }}>{h}</MonoLab>)}
              </div>
              {AB.map(([n, val, p, nc, sp, td, ex], i) => (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: '220px repeat(6, 1fr)', height: 44, alignItems: 'center', padding: '0 20px', borderBottom: '1px solid ' + U.edge, fontSize: 17, background: i === 0 && L === 2 && tl > 1 && tl < 3 ? U.sel : 'transparent' }}>
                  <span>{n}</span>
                  {[p, nc, val.toFixed(1) + '%', sp, td, ex].map((c, k) => <span key={k} style={{ textAlign: 'right', fontFamily: UM, fontWeight: k === 2 ? 700 : 400, color: (k === 2 || k === 4) && val >= 8 ? U.cyan : U.ink }}>{c}</span>)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1400, top: 0, width: 600, height: 745, borderLeft: '1px solid ' + U.edge, background: '#0c1630' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, padding: '0 22px', borderBottom: '1px solid ' + U.edge }}><b style={{ flex: 1, fontSize: 20 }}>How this was answered</b><span style={{ color: U.lab }}>›</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: 52, background: U.head, borderBottom: '1px solid ' + U.edge }}>
          {['Explanation', 'Query pad', 'Cypher', 'SQL'].map((l, k) => <span key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: k === tab ? 700 : 500, color: k === tab ? U.sky : U.mute, background: k === tab ? U.bg : 'transparent', boxShadow: k === tab ? 'inset 0 -3px 0 ' + U.cyan : 'none' }}>{l}</span>)}
        </div>
        <div style={{ padding: '14px 22px' }}>
          {tab === 0 ? (
            <div>
              <MonoLab>WHAT IT DID</MonoLab>
              {AEX.map(([a, b], i) => (
                <div key={a} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid ' + U.edge, ...fadeUp(tt, 0.8 + i * 0.3, 0.35) }}>
                  <span style={{ fontFamily: UM, fontSize: 14, color: U.lab, paddingTop: 2 }}>{i + 1}</span>
                  <div><div style={{ fontSize: 16, lineHeight: 1.4 }}>{a}</div><div style={{ fontSize: 14, color: i === 2 ? U.cyan : U.lab, marginTop: 3 }}>{b}</div></div>
                </div>
              ))}
            </div>
          ) : null}
          {tab === 1 ? AQP.map(([h, items], s) => (
            <div key={h} style={{ ...fadeUp(tt, 0.1 + s * 0.18, 0.3) }}>
              <div style={{ display: 'flex', alignItems: 'center', height: 32, marginTop: s ? 6 : 0 }}><MonoLab style={{ flex: 1 }}>▾ {h}</MonoLab><span style={{ fontSize: 14, fontWeight: 600, color: U.sky }}>+ Add</span></div>
              {items.map(([a, b]) => (
                <div key={a + b} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36, padding: '4px 12px', borderBottom: '1px solid ' + U.edge, background: b === 'from the follow-up' ? 'rgba(111,227,255,.08)' : '#0e1730', whiteSpace: 'nowrap' }}>
                  <span style={{ flex: 1, fontFamily: UM, fontSize: 15 }}>{a}{b && b !== 'from the follow-up' ? <span style={{ display: 'block', fontSize: 12, color: U.lab }}>{b}</span> : null}</span>
                  {b === 'from the follow-up' ? <span style={{ fontSize: 13, color: U.cyan }}>{b}</span> : null}<span style={{ color: U.lab }}>×</span>
                </div>
              ))}
            </div>
          )) : null}
          {tab === 2 ? (
            <div style={{ fontFamily: UM, fontSize: 15, lineHeight: '30px', whiteSpace: 'pre' }}>
              {ACY.map((l, i) => {
                const o = clamp((tt - 0.1 - i * 0.13) / 0.12, 0, 1);
                return <div key={i} style={{ display: 'flex', gap: 14, opacity: o }}><span style={{ width: 20, textAlign: 'right', color: U.lab }}>{i + 1}</span>{cyLine(l)}</div>;
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const ASK_CHAT = { chat: 1, llm: 1, follow: 1, final: 1 };
function askScreenProps(m, tl) {
  if (m === 'explain') return { L: 3, tl: 99, v: { table: 0, tab: 0, tt: tl }, reg: AREG.how };
  if (m === 'table') return { L: 3, tl: 99, v: { table: MOTION.glide(0, 1, 0.3, 0.8)(tl), tab: 0, tt: 99 }, reg: AREG.q };
  if (m === 'query') { const tab = tl < 2.4 ? 1 : 2; return { L: 3, tl: 99, v: { table: 0, tab, tt: tab === 1 ? tl : tl - 2.4 }, reg: AREG.pad }; }
  return { L: 1, tl, v: { table: tl > 50 ? 0 : 1 - MOTION.glide(0, 1, 0.1, 0.6)(tl), tab: 0, tt: 99 }, reg: AREG.q };
}
function askChatProps(m, tl) {
  if (m === 'llm') return { later: false, tl: 99, llm: tl };
  if (m === 'follow') return { later: true, tl, model: 'Claude' };
  if (m === 'final') return { later: true, tl: 99, model: 'Claude' };
  return { later: false, tl, model: 'GPT' };
}
function Ask(p) {
  if (p.mode === 'tcq' || p.prev === 'tcq') {
    const seq = [['table', 0], ['chart', 2.0], ['query', 4.0]];
    if (p.mode === 'tcq') {
      const tl0 = p.T - p.a; let k = 0; for (let i = 0; i < seq.length; i++) if (tl0 >= seq[i][1]) k = i;
      return <AskCore {...p} a={p.a + seq[k][1]} mode={seq[k][0]} prev={k ? seq[k - 1][0] : p.prev}></AskCore>;
    }
    return <AskCore {...p} prev="query"></AskCore>;
  }
  return <AskCore {...p}></AskCore>;
}
function AskCore({ T, a, a0, mode, prev }) {
  const tl = T - a;
  const isChat = m => !!ASK_CHAT[m];
  const curChat = isChat(mode), prevChat = prev != null && isChat(prev);
  const chatO = prev == null || curChat === prevChat ? (curChat ? 1 : 0) : (curChat ? MOTION.glide(0, 1, 0, 0.6)(tl) : 1 - MOTION.glide(0, 1, 0, 0.6)(tl));
  const sm = curChat ? (prev == null || prevChat ? 'explain' : prev) : mode;
  const sp = askScreenProps(sm, curChat ? 99 : tl);
  const cp = askChatProps(curChat ? mode : (prevChat ? prev : 'final'), curChat ? tl : 99);
  const fit = r => { const s = Math.min(VB.w / r[2], VB.h / r[3]); return [r[0] + r[2] / 2, r[1] + r[3] / 2, s]; };
  const r1 = fit(sp.reg);
  const r0 = !curChat && prev != null && !prevChat ? fit(askScreenProps(prev, 99).reg) : r1;
  const u = MOTION.glide(0, 1, 0, 1.2)(tl);
  const cx = lerp(r0[0], r1[0], u), cy = lerp(r0[1], r1[1], u), s = lerp(r0[2], r1[2], u);
  const vis = MOTION.glide(0, 1, a0 - 0.6, a0 + 0.2)(T);
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <div style={{ position: 'absolute', left: VB.x, top: VB.y, width: VB.w, height: VB.h, overflow: 'hidden', opacity: vis, background: U.bg, border: '1px solid ' + U.edge, borderRadius: 6, boxShadow: '0 0 0 1px rgba(125,179,238,.10),0 0 60px rgba(23,132,241,.14),0 30px 80px rgba(2,4,10,.6)' }}>
        {chatO < 1 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 2000, height: 745, transformOrigin: '0 0', transform: 'translate(' + (VB.w / 2 - cx * s) + 'px,' + (VB.h / 2 - cy * s) + 'px) scale(' + s + ')', opacity: 1 - chatO }}>
            <AskScreen T={T} L={sp.L} tl={sp.tl} v={sp.v}></AskScreen>
          </div>
        ) : null}
        {chatO > 0 ? <div style={{ position: 'absolute', inset: 0, opacity: chatO }}><AskChat T={T} tl={cp.tl} later={cp.later} llm={cp.llm} model={cp.model}></AskChat></div> : null}
      </div>
    </foreignObject>
  );
}

const MOTIFS = { flow: Flow, graph: Graph, schema: Schema, chat: Chat, grid: Grid, jobs: Jobs, ui: Ui, maia: Maia, suite: Suite, ask: Ask, dmv: DmVid, lbv: LbVid, qqv: QqVid, dhv: DhVid, dsv: DsVid, amv: AmVid };

function ProductViz({ vid, CUES, n, lineIndex, cueAfter }) {
  const { T } = useComposition();
  const spec = VIZ[vid] || VIZ.datamaia;
  const li = lineIndex(T, CUES, n);
  const A = i => CUES['L' + (i + 1)], Bn = i => cueAfter(CUES, i, n);
  const kb = MOTION.drift(1, 1.03, A(li), Bn(li))(T);
  const out = 1 - MOTION.glide(0, 1, CUES.Outro - 0.2, CUES.Outro + 0.8)(T);
  const layers = Object.keys(MOTIFS).map(kind => {
    let j = -1;
    if (spec[li] && spec[li][0] === kind) j = li;
    else if (li > 0 && spec[li - 1] && spec[li - 1][0] === kind && T < A(li) + 0.5) j = li - 1;
    else if (spec[li + 1] && spec[li + 1][0] === kind && T > Bn(li) - 0.5) j = li + 1;
    if (j < 0) return null;
    const prevSame = j > 0 && spec[j - 1][0] === kind;
    const nextSame = j + 1 < n && spec[j + 1][0] === kind;
    const fin = prevSame ? 1 : MOTION.glide(0, 1, A(j) - 0.45, A(j) + 0.35)(T);
    const fout = nextSame ? 1 : 1 - MOTION.glide(0, 1, Bn(j) - 0.35, Bn(j) + 0.45)(T);
    const op = Math.min(fin, fout);
    if (op <= 0.001) return null;
    let r = j; while (r > 0 && spec[r - 1][0] === kind) r--;
    const M = MOTIFS[kind];
    const sc = 0.96 + 0.04 * fin;
    return (
      <g key={kind} opacity={op} transform={`translate(1000 520) scale(${sc}) translate(-1000 -520)`}>
        <M T={T} a={A(j)} a0={A(r)} mode={spec[j][1]} prev={prevSame ? spec[j - 1][1] : null}></M>
      </g>
    );
  });
  const ox = li % 2 ? '62% 45%' : '40% 55%';
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <Field></Field>
      <g opacity={out} style={{ transform: `scale(${kb})`, transformOrigin: ox }}>{layers}</g>
    </svg>
  );
}

Object.assign(window, { ProductViz, PRODUCT_VIZ: VIZ });
})();
