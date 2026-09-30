const { useComposition, animate, interpolate, Easing, clamp } = window;

const MODS = [
  { key: 'datamaia', tab: 'Data MAIA', title: 'DATA MAIA', src: 'assets/datamaia-demo-v2.mp4', tag: 'Create logical context for your enterprise data.' },
  { key: 'logic', tab: 'Logic Builder', title: 'LOGIC BUILDER', src: 'assets/logic-builder-demo-v2.mp4', tag: 'Maintain logical context across your data flow.' },
  { key: 'quality', tab: 'Quality Queue', title: 'QUALITY QUEUE', src: 'assets/quality-queue-demo-v3.mp4', tag: 'Manage data quality as it enters your engine.' },
  { key: 'hub', tab: 'Data Hub', title: 'DATA HUB', src: 'assets/data-hub-demo-v3.mp4', tag: 'View and edit your logically curated data.' },
  { key: 'delivery', tab: 'Delivery Station', title: 'DELIVERY STATION', src: 'assets/delivery-station-demo-v2.mp4', tag: 'Send governed data wherever it needs to go.' },
  { key: 'ask', tab: 'Ask MAIA', title: 'ASK MAIA', src: 'assets/ask-maia-demo.mp4', tag: 'Chat directly with your data.' }
];

const SCRIPTS = {
  overview: { label: 'PLATFORM OVERVIEW', title: 'VULQAN', tag: 'Enterprise data unification, end to end.', lines: [
    { m: 0, t: 'Data MAIA reads your sources and proposes a logical data model' },
    { m: 1, t: 'Logic Builder keeps it as your Logical Intelligence Foundation' },
    { m: 2, t: 'Quality Queue catches errors before data lands' },
    { m: 3, t: 'Data Hub gives you one trusted view of your data' },
    { m: 4, t: 'Delivery Station sends it wherever it’s needed' },
    { m: 5, t: 'And Ask MAIA lets you use any LLM to chat with logically curated data' }
  ]},
  datamaia: { m: 0, lines: [
    'Connect any data source to Vulqan',
    'Data MAIA automatically proposes a unified logical data model',
    'It finds the objects, relationships, variables and validations for you',
    'Refine it by chatting with MAIA, then promote it to your LIF'
  ]},
  logic: { m: 1, lines: [
    'Logic Builder is home to your Logical Intelligence Foundation',
    'Connections, ontology, identifiers and schema, in one place',
    'Maps and transforms to and from your logical context',
    'Workflows that manage data the way your business runs',
    'The foundation every Vulqan module builds on'
  ]},
  quality: { m: 2, lines: [
    'Quality Queue continuously ingests data into your logical context',
    'It scores quality in real time and flags every issue',
    'Fix errors before they reach your data store',
    'Data quality, from theory to reality'
  ]},
  hub: { m: 3, lines: [
    'See your data as a knowledge graph, table or tiles',
    'Track quality and lineage for every record',
    'Edit in bulk, with full enterprise controls',
    'Data Hub: a living store of your logical context'
  ]},
  delivery: { m: 4, lines: [
    'Delivery Station ships curated data wherever it needs to go',
    'Straight into Excel reports with the Vulqan add-in',
    'Or to any system through APIs, on the schedule you set',
    'With permissions enforced on every delivery'
  ]},
  ask: { m: 5, lines: [
    'Ask MAIA lets you chat with your enterprise data',
    'Use the LLM of your choice',
    'Vulqan’s logical foundation means it understands your data',
    'Get answers as tables or charts, and inspect the query behind them',
    'Finally, a chatbot that works with enterprise data'
  ]}
};

// End-of-phrase punctuation, per line (lines that run into the next get a comma or ellipsis).
const PUNCT = {
  overview: ['.', '.', '.', '.', '.', '.'],
  datamaia: ['.', '.', '.', '.'],
  logic: ['.', '.', '.', '.', '.'],
  quality: ['.', '.', '.', '.'],
  hub: ['.', '.', '.', '.'],
  delivery: ['.', '.', '.', '.'],
  ask: ['.', '.', '.', '.', '.']
};
Object.keys(PUNCT).forEach(k => {
  SCRIPTS[k].lines = SCRIPTS[k].lines.map((l, i) => {
    const p = PUNCT[k][i] || '.';
    const add = t => (/[.,…!?]$/.test(t) ? t : t + p);
    return typeof l === 'string' ? add(l) : { ...l, t: add(l.t) };
  });
});

const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  glide: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  drift: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.linear })
};

const C = { bg: '#05080f', navy: '#0b1428', panel: '#0e1730', line: '#1d2d5a', blue: '#1784f1', sky: '#7db3ee', cyan: '#6fe3ff', ink: '#fafbfc', mute: '#95989c' };
const SANS = "'Inter', system-ui, sans-serif";
const MONO = "'Roboto Mono', ui-monospace, monospace";
const W = 1920, H = 1080;
const FR = { x: 96, y: 54, w: 1728, h: 972 };

function normalize(vid) {
  const s = SCRIPTS[vid] || SCRIPTS.datamaia;
  if (vid === 'overview') return { ...s, lines: s.lines.map(l => ({ m: l.m, t: l.t })), fixedMod: null };
  const mod = MODS[s.m];
  return { label: '', title: mod.title, tag: mod.tag, lines: s.lines.map(t => ({ m: s.m, t })), fixedMod: s.m };
}

function Backdrop() {
  const { T } = useComposition();
  const a = Math.sin(T * 0.18) * 4, b = Math.cos(T * 0.13) * 5;
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 55% 50% at ${52 + a}% ${48 + b}%,rgba(23,132,241,.10),transparent 70%),radial-gradient(ellipse 45% 50% at ${85 - a}% ${20 - b}%,rgba(125,179,238,.05),transparent 70%),#020409` }}></div>
  );
}

// One demo recording, time-mapped onto [a,b] of the authored clock (clip fraction f0..f1).
function Clip({ src, a, b, f0 = 0, f1 = 1, opacity }) {
  const { T, playing } = useComposition();
  const ref = React.useRef(null);
  const [dur, setDur] = React.useState(0);
  React.useLayoutEffect(() => {
    const v = ref.current; if (!v || !dur) return;
    const p = clamp((T - a) / (b - a), 0, 1);
    const target = Math.min(dur - 0.05, dur * (f0 + (f1 - f0) * p));
    const live = playing && opacity > 0.01 && T > a && T < b;
    if (live) {
      v.playbackRate = clamp((dur * (f1 - f0)) / (b - a), 0.5, 3);
      if (Math.abs(v.currentTime - target) > 0.35) v.currentTime = target;
      if (v.paused) v.play().catch(() => {});
    } else {
      if (!v.paused) v.pause();
      if (Math.abs(v.currentTime - target) > 0.04) v.currentTime = target;
    }
  });
  return (
    <video ref={ref} src={src} muted playsInline preload="auto" onLoadedMetadata={e => setDur(e.currentTarget.duration || 0)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity, background: '#04070d' }}></video>
  );
}

function Screen({ S, CUES, frame }) {
  const { T } = useComposition();
  const n = S.lines.length;
  const start = CUES.L1, end = CUES.Outro;
  const inP = MOTION.glide(0, 1, CUES.Title + 2.4, start + 0.5)(T);
  const outP = MOTION.glide(0, 1, end - 0.1, end + 1.1)(T);
  const full = frame === 'Full bleed';
  const tx = full ? { x: 0, y: 0, w: W, h: H } : FR;
  const s0 = 0.62;
  const scale = interpolate([0, 1], [s0, 1])(inP) * interpolate([0, 1], [1, 0.9])(outP);
  const li = lineIndex(T, CUES, n);
  const kb = MOTION.drift(1, 1.035, CUES['L' + (li + 1)], cueAfter(CUES, li, n))(T);
  const ox = li % 2 ? '70% 40%' : '30% 60%';
  const op = interpolate([0, 1], [0.28, 1])(inP) * (1 - outP);
  const clips = S.fixedMod != null
    ? [<Clip key="c" src={MODS[S.fixedMod].src} a={start} b={end} opacity={1}></Clip>]
    : MODS.map((m, i) => {
        const a = CUES['L' + (i + 1)], b = cueAfter(CUES, i, n);
        const o = Math.min(MOTION.glide(0, 1, a - 0.35, a + 0.15)(T), 1 - MOTION.glide(0, 1, b - 0.35, b + 0.15)(T));
        return <Clip key={m.key} src={m.src} a={a - 0.35} b={b + 0.15} f0={0.2} f1={0.55} opacity={i === 0 ? Math.max(o, T < a ? 1 : 0) : (i === 5 ? Math.max(o, T >= b ? 1 : 0) : o)}></Clip>;
      });
  return (
    <div style={{ position: 'absolute', left: tx.x, top: tx.y, width: tx.w, height: tx.h, transform: `scale(${scale})`, transformOrigin: '50% 50%', opacity: op,
      borderRadius: full ? 0 : 8, overflow: 'hidden', boxShadow: full ? 'none' : '0 0 0 1px rgba(125,179,238,.15),0 0 60px rgba(23,132,241,.17),0 24px 70px rgba(2,4,10,.5)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb})`, transformOrigin: ox }}>{clips}</div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,8,15,0) 55%,rgba(5,8,15,.55) 100%)' }}></div>
    </div>
  );
}

function cueAfter(CUES, i, n) { return i + 1 < n ? CUES['L' + (i + 2)] : CUES.Outro; }

function lineIndex(T, CUES, n) {
  let i = 0;
  for (let k = 0; k < n; k++) if (T >= CUES['L' + (k + 1)] - 0.001) i = k;
  return i;
}

function ContextCard({ S, CUES, vid }) {
  const { T } = useComposition();
  const n = S.lines.length;
  const inP = MOTION.enter(0, 1, 0.15, 1.1)(T);
  const dock = MOTION.glide(0, 1, CUES.Title + 2.6, CUES.L1 + 0.6)(T);
  const gone = (vid === 'datamaia' || vid === 'logic' || vid === 'quality' || vid === 'hub' || vid === 'delivery' || vid === 'ask') ? MOTION.glide(0, 1, CUES.L1 - 0.5, CUES.L1 + 0.2)(T) : MOTION.glide(0, 1, CUES.Outro - 0.2, CUES.Outro + 0.6)(T);
  const li = lineIndex(T, CUES, n);
  const active = S.fixedMod != null ? S.fixedMod : (T >= CUES.L1 + 0.2 ? S.lines[li].m : -1);
  const x = interpolate([0, 1], [200, 136])(dock), y = interpolate([0, 1], [270, 96])(dock);
  const sc = interpolate([0, 1], [1, 0.5])(dock);
  const tagO = 1 - MOTION.glide(0, 1, CUES.Title + 2.4, CUES.Title + 3)(T);
  const title = S.fixedMod == null && active >= 0 ? MODS[active].title : S.title;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 1000, transform: `translateY(${(1 - inP) * 40}px) scale(${sc})`, transformOrigin: '0 0',
      opacity: inP * (1 - gone), background: 'rgba(11,20,40,.94)', border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: '0 30px 80px rgba(2,4,10,.55)', fontFamily: SANS, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '24px 32px', borderBottom: `1px solid ${C.line}` }}>
        <img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 40, width: 'auto', display: 'block', filter: 'drop-shadow(0 0 .8px #9cc7f5) drop-shadow(0 0 .8px #9cc7f5)' }}></img>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 18, letterSpacing: '.14em', color: C.cyan }}>
          <span style={{ width: 9, height: 9, borderRadius: 9, background: C.cyan, opacity: 0.55 + 0.45 * Math.abs(Math.sin(T * 2.2)) }}></span>ACTIVE SESSION
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: '#13203a', borderBottom: `1px solid ${C.line}` }}>
        {MODS.map((m, i) => (
          <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 17, fontWeight: 500, padding: '7px 11px', borderRadius: 4, whiteSpace: 'nowrap',
              color: i === active ? '#05080f' : C.sky, background: i === active ? C.cyan : 'transparent' }}>{m.tab}</span>
            {i < 5 ? <span style={{ color: '#3b4c78', fontSize: 15 }}>—</span> : null}
          </div>
        ))}
      </div>
      <div style={{ padding: '36px 40px 42px' }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '.16em', color: C.cyan }}>{S.label}</div>
        <div style={{ marginTop: 10, fontSize: 104, lineHeight: 1, fontWeight: 800, letterSpacing: '-.01em', color: C.ink }}>{title}</div>
        <div style={{ opacity: tagO, maxHeight: tagO * 140, overflow: 'hidden' }}>
          <div style={{ marginTop: 22, fontSize: 38, lineHeight: 1.3, color: '#c9ccd2', maxWidth: 900, textWrap: 'pretty' }}>{S.tag}</div>
        </div>
      </div>
    </div>
  );
}

function LowerThird({ S, CUES, show }) {
  const { T } = useComposition();
  if (!show) return null;
  const n = S.lines.length;
  const inP = MOTION.enter(0, 1, CUES.L1 + 0.1, CUES.L1 + 0.8)(T);
  const out = MOTION.glide(0, 1, CUES.Outro - 0.3, CUES.Outro + 0.3)(T);
  const li = lineIndex(T, CUES, n);
  return (
    <div style={{ position: 'absolute', left: 136, right: 136, bottom: 104, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0,
      opacity: inP * (1 - out), transform: `translateY(${(1 - inP) * 30}px)`, fontFamily: SANS }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.cyan, color: '#05080f', padding: '10px 18px', fontFamily: MONO, fontSize: 20, fontWeight: 600, letterSpacing: '.14em', whiteSpace: 'nowrap' }}>
        <span>{MODS[S.lines[li].m].title}</span>
        <span style={{ opacity: 0.6 }}>{String(li + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div style={{ display: 'grid', alignSelf: 'stretch', background: 'rgba(11,20,40,.94)', border: `1px solid ${C.line}`, boxShadow: '0 24px 60px rgba(2,4,10,.5)', padding: '26px 34px 30px' }}>
        {S.lines.map((l, i) => {
          const a = CUES['L' + (i + 1)], b = cueAfter(CUES, i, n);
          const o = Math.min(MOTION.enter(0, 1, a + 0.05, a + 0.45)(T), 1 - MOTION.glide(0, 1, b - 0.2, b + 0.05)(T));
          return (
            <div key={i} style={{ gridArea: '1 / 1', fontSize: 46, lineHeight: 1.28, fontWeight: 500, color: C.ink, textWrap: 'pretty',
              opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>{l.t}</div>
          );
        })}
      </div>
    </div>
  );
}

function Outro({ CUES }) {
  const { T } = useComposition();
  const a = MOTION.enter(0, 1, CUES.Outro + 0.5, CUES.Outro + 1.3)(T);
  const b = MOTION.enter(0, 1, CUES.Outro + 1.1, CUES.Outro + 1.9)(T);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34, fontFamily: SANS }}>
      <img src="assets/vulqan-logo.png" alt="Vulqan" style={{ height: 76, width: 'auto', filter: 'drop-shadow(0 0 1px #9cc7f5) drop-shadow(0 0 1px #9cc7f5)', opacity: a, transform: `scale(${0.94 + 0.06 * a})` }}></img>
      <div style={{ fontSize: 58, fontWeight: 700, color: C.blue, whiteSpace: 'nowrap', textAlign: 'center', opacity: b, transform: `translateY(${(1 - b) * 16}px)` }}>Vulqanize your data.</div>
    </div>
  );
}

function pickVoice() {
  const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
  const gb = vs.filter(v => /en[-_]GB/i.test(v.lang));
  return gb.find(v => /UK English Female/i.test(v.name)) || gb.find(v => /female|serena|kate|stephanie|martha|libby|sonia|hazel|susan|fiona|amy|emma/i.test(v.name)) || gb[0] || vs.find(v => /^en/i.test(v.lang)) || null;
}

// Browser voiceover: speaks each line as its cue is reached during live playback.
function useVoiceover(S, CUES, on) {
  const { T, playing } = useComposition();
  const n = S.lines.length;
  const inLines = T >= CUES.L1 && T < CUES.Outro;
  const li = inLines ? lineIndex(T, CUES, n) : -1;
  const last = React.useRef(-2);
  const [armed, setArmed] = React.useState(!!window.__vqVoiceOn);
  React.useEffect(() => {
    const h = () => { setArmed(true); last.current = -2; };
    window.addEventListener('vq-voice-on', h);
    return () => window.removeEventListener('vq-voice-on', h);
  }, []);
  React.useEffect(() => {
    if (!window.speechSynthesis) return;
    if (!on || !playing) { speechSynthesis.cancel(); last.current = -2; return; }
    if (li === last.current) return;
    last.current = li;
    if (li < 0) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(S.lines[li].t.replace(/Vulqan/g, 'Vulkan').replace(/\bAPIs\b/g, 'A P Eyes').replace(/\bLLM\b/g, 'L L M').replace(/MAIA/g, 'Maya').replace(/\bLIF\b/g, 'logical intelligence foundation'));
    const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.rate = 0.98; u.pitch = 1;
    speechSynthesis.speak(u);
  }, [li, playing, on, armed]);
  React.useEffect(() => () => window.speechSynthesis && speechSynthesis.cancel(), []);
}

function Callout({ S, CUES, vid }) {
  const { T } = useComposition();
  if (vid !== 'datamaia') return null;
  const a = CUES.L2 + 0.6, b = CUES.L4 - 0.1;
  const o = Math.min(MOTION.enter(0, 1, a, a + 0.6)(T), 1 - MOTION.glide(0, 1, b - 0.4, b)(T));
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 180, right: 180, top: 300, opacity: o, transform: `translateY(${(1 - o) * 30}px) scale(${0.97 + 0.03 * o})`, transformOrigin: '50% 100%' }}>
      <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', background: C.cyan, color: '#05080f', padding: '10px 18px', fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: '.14em' }}>LOGICAL DATA MODEL</div>
      <div style={{ border: '2px solid ' + C.cyan, background: '#0b1428', boxShadow: '0 0 60px rgba(111,227,255,.18),0 30px 80px rgba(2,4,10,.6)', padding: 8 }}>
        <img src="assets/vids/ldm-ready.png" alt="Your Logical Data Model is ready" style={{ display: 'block', width: '100%', height: 'auto' }}></img>
      </div>
    </div>
  );
}

// Voiceover: each caption line plays its own slice [start, end] of one audio file, so scene edits stay in sync.
function VoTrack({ src, segs, CUES }) {
  const { T, playing: playing0 } = useComposition();
  const ref = React.useRef(null);
  const [blocked, setBlocked] = React.useState(false);
  const [hostOn, setHostOn] = React.useState(true);
  React.useEffect(() => {
    const retry = () => { const v = ref.current; if (v && !v.paused) return; if (v && v.dataset.want === '1') v.play().then(() => setBlocked(false)).catch(() => {}); };
    const h = e => { if (e.data && e.data.type === 'vq-sound') { setHostOn(!!e.data.on); if (e.data.on) retry(); } };
    window.addEventListener('message', h);
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, retry, true));
    return () => { window.removeEventListener('message', h); ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.removeEventListener(ev, retry, true)); };
  }, []);
  const playing = playing0 && hostOn;
  let i = -1;
  for (let k = 0; k < segs.length; k++) if (T >= CUES['L' + (k + 1)]) i = k;
  const pos = i >= 0 ? segs[i][0] + (T - CUES['L' + (i + 1)]) : -1;
  const inSeg = i >= 0 && pos < segs[i][1] && T < CUES.Outro;
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    v.dataset.want = playing && inSeg ? '1' : '0';
    if (playing && inSeg) {
      if (Math.abs(v.currentTime - pos) > 0.25) v.currentTime = pos;
      if (v.paused) v.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
    } else if (!v.paused) v.pause();
  });
  return (
    <React.Fragment>
      <audio ref={ref} src={src} preload="auto"></audio>
      {blocked ? <button onClick={() => { const v = ref.current; v.play().then(() => setBlocked(false)).catch(() => {}); }} style={{ position: 'absolute', top: 28, right: 28, zIndex: 5, padding: '14px 22px', border: '1px solid #1d2d5a', background: '#0b1428', color: '#fafbfc', font: '600 20px Inter,system-ui,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>Click for sound</button> : null}
    </React.Fragment>
  );
}

const VO_SEGS = {"overview":[[0.06,4.26],[4.74,8.46],[8.9,12.2],[12.66,15.76],[16.2,18.8],[19.2,24.36]],"datamaia":[[25,27.16],[27.58,32.06],[32.5,37.42],[37.94,41.86]],"logic":[[42.54,46.14],[46.5,51.26],[51.62,55.42],[55.8,59.26],[59.62,62.3]],"quality":[[62.78,67.18],[67.62,71.36],[71.86,74.36],[74.76,77.62]],"hub":[[78.02,81.58],[82.02,84.72],[85.12,88.04],[88.44,91.92]],"delivery":[[92.34,96.2],[96.56,99.38],[99.7,103.7],[104.02,106.5]],"ask":[[106.96,109.82],[110.22,112.24],[112.62,116.4],[116.86,121.14],[121.52,125.16]]};

function ProductVidPiece(props) {
  const { T, CUES } = useComposition();
  const S = React.useMemo(() => normalize(props.vid || 'datamaia'), [props.vid]);
  const ref = React.useRef(null);
  useVoiceover(S, CUES, false);
  React.useEffect(() => {
    const r = ref.current && ref.current.closest('[data-om-exportable-video-with-duration-secs]');
    if (r) r.setAttribute('data-screen-label', `${props.vid} ${Math.floor(T)}s`);
  }, [Math.floor(T)]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: C.bg }}>
      <Backdrop></Backdrop>
      <window.ProductViz vid={props.vid || 'datamaia'} CUES={CUES} n={S.lines.length} lineIndex={lineIndex} cueAfter={cueAfter}></window.ProductViz>
      {props.vid === 'overview' ? null : <ContextCard S={S} CUES={CUES} vid={props.vid}></ContextCard>}
      <LowerThird S={S} CUES={CUES} show={props.captions !== false}></LowerThird>
      {props.vid === 'overview' || props.vid === 'datamaia' || props.vid === 'logic' || props.vid === 'quality' || props.vid === 'hub' || props.vid === 'delivery' || props.vid === 'ask' ? null : <Outro CUES={CUES}></Outro>}
      {props.voiceover !== false && VO_SEGS[props.vid] ? <VoTrack src="assets/vo-all-3.mp3" segs={VO_SEGS[props.vid]} CUES={CUES}></VoTrack> : null}
    </div>
  );
}

// Scene list builder, used only to author the OM_SCENES literals.
function productVidScenes(vid) {
  const S = normalize(vid);
  const d = t => Math.round(Math.min(7, Math.max(3.6, 2.4 + t.split(/\s+/).length * 0.26)) * 10) / 10;
  return [{ name: 'Title', dur: 4, desc: 'Title card' }]
    .concat(S.lines.map((l, i) => ({ name: 'L' + (i + 1), dur: d(l.t), desc: l.t })))
    .concat([{ name: 'Outro', dur: 3.6, desc: 'Demo recedes; Vulqan logo and Vulqanize your data.' }]);
}

Object.assign(window, { ProductVidPiece, productVidScenes, PRODUCT_VID_SCRIPTS: SCRIPTS });
