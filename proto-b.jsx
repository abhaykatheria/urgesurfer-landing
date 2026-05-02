// proto-b.jsx — Interactive Direction B prototype
// Full state machine + live timer + transitions + light/dark theming via CSS vars.

// Theme is applied via CSS custom properties on a .pb-root wrapper.
// Swapping `data-theme` on the wrapper repaints instantly.
const PB = {
  // CSS var refs — used everywhere instead of literal colors.
  sand:    'var(--pb-sand)',    sandDim: 'var(--pb-sand-dim)', sandDk:  'var(--pb-sand-dk)',
  ink:     'var(--pb-ink)',     inkSoft: 'var(--pb-ink-soft)',
  kelp:    'var(--pb-kelp)',    kelpDk:  'var(--pb-kelp-dk)',
  coral:   'var(--pb-coral)',
  mute:    'var(--pb-mute)',    muteLo:  'var(--pb-mute-lo)',
  line:    'var(--pb-line)',    lineStr: 'var(--pb-line-str)',
  display: '"Fraunces", Georgia, serif',
  body:    '-apple-system, "SF Pro Text", system-ui, sans-serif',
};

// Palette values for light vs dark. Canvas wrapper sets one or the other.
const PB_PALETTES = {
  light: {
    '--pb-sand': '#F4EFE6', '--pb-sand-dim': '#EBE4D5', '--pb-sand-dk': '#E0D7C3',
    '--pb-ink':  '#1F2A2E', '--pb-ink-soft': '#3D4A50',
    '--pb-kelp': '#4A6B6E', '--pb-kelp-dk': '#2F4A4D',
    '--pb-coral':'#C96442',
    '--pb-mute': 'rgba(31,42,46,0.55)', '--pb-mute-lo': 'rgba(31,42,46,0.35)',
    '--pb-line': 'rgba(31,42,46,0.1)',  '--pb-line-str': 'rgba(31,42,46,0.2)',
    '--pb-status': '#1F2A2E', // iOS status bar ink
  },
  dark: {
    '--pb-sand': '#1A1815', '--pb-sand-dim': '#242220', '--pb-sand-dk': '#2E2C29',
    '--pb-ink':  '#F4EFE6', '--pb-ink-soft': '#C4BEB2',
    '--pb-kelp': '#7BA3A6', '--pb-kelp-dk': '#9FC4C7',
    '--pb-coral':'#E48864',
    '--pb-mute': 'rgba(244,239,230,0.55)', '--pb-mute-lo': 'rgba(244,239,230,0.3)',
    '--pb-line': 'rgba(244,239,230,0.08)',  '--pb-line-str': 'rgba(244,239,230,0.15)',
    '--pb-status': '#F4EFE6',
  }
};

function pbApplyTheme(el, theme) {
  const p = PB_PALETTES[theme] || PB_PALETTES.light;
  Object.entries(p).forEach(([k,v]) => el.style.setProperty(k, v));
}

const PBCtx = React.createContext(null);
function pbUsePB() { return React.useContext(PBCtx); }

// All possible urges users can choose from in onboarding/profile.
// Note: this is the SEED catalog. The actual live catalog lives on s.catalog
// so users can append their own custom urges. Always prefer s.catalog over
// URGE_CATALOG when reading at runtime.
const URGE_CATALOG = [
  { id: 'cig',    label: 'Cigarette', emoji: '🚬' },
  { id: 'vape',   label: 'Vape',      emoji: '💨' },
  { id: 'booze',  label: 'Alcohol',   emoji: '🍷' },
  { id: 'coffee', label: 'Coffee',    emoji: '☕' },
  { id: 'sugar',  label: 'Sugar',     emoji: '🍩' },
  { id: 'weed',   label: 'Weed',      emoji: '🌿' },
  { id: 'phone',  label: 'Social',    emoji: '📱' },
  { id: 'shop',   label: 'Shopping',  emoji: '🛍️' },
  { id: 'porn',   label: 'Porn',      emoji: '🔞' },
  { id: 'gamble', label: 'Gambling',  emoji: '🎰' },
  { id: 'snack',  label: 'Snacking',  emoji: '🍿' },
  { id: 'bite',   label: 'Nail bite', emoji: '💅' },
];

// Emoji palette for the custom-urge creator.
const PB_CUSTOM_EMOJIS = ['✨', '🎯', '🔥', '💪', '🧘', '🌱', '📚', '🎮', '🎨', '🎵', '⏰', '🏃', '🍴', '🥤', '🍫', '💼', '💕', '💊'];

// Legacy alias retained for screens that still iterate everything (Stats tabs, History filter).
const URGE_LIST = URGE_CATALOG;
function pbTrackedUrges(s) {
  const set = new Set(s.tracked);
  const cat = s.catalog || URGE_CATALOG;
  return cat.filter(u => set.has(u.id));
}
function pbAllUrges(s) {
  return s.catalog || URGE_CATALOG;
}
function pbFindUrge(s, id) {
  return pbAllUrges(s).find(u => u.id === id);
}

function pbInitialState() {
  return {
    // 'onboarding' shows the welcome flow on first run.
    // Switch to 'home' here once you'd rather start logged-in.
    screen: 'onboarding',
    name: '',
    catalog: URGE_CATALOG.slice(),
    tracked: ['cig', 'coffee', 'phone'],
    urgeId: 'cig',
    duration: 300,
    remaining: 300,
    running: false,
    caveTime: 0,
    intensity: 7,
    trigger: null,
    streaks: { cig: 12, vape: 4, booze: 3, coffee: 6, sugar: 2, weed: 8, phone: 5, shop: 7 },
    counts:  { cig: 34, vape: 18, booze: 9, coffee: 22, sugar: 14, weed: 19, phone: 28, shop: 11 },
    rides:   { cig: 30, vape: 13, booze: 6, coffee: 17, sugar: 8,  weed: 15, phone: 19, shop: 9 },
    log: [
      { date: '2026-04-24', t: '09:40', u: 'cig',    r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 6, trigger: 'After meal' },
      { date: '2026-04-24', t: '08:12', u: 'coffee', r: 'Rode 3:00',  dur: 180, ok: true,  intensity: 4, trigger: 'Habit' },
      { date: '2026-04-23', t: '21:04', u: 'phone',  r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 7, trigger: 'Boredom' },
      { date: '2026-04-23', t: '15:22', u: 'coffee', r: 'Caved 1:42', dur: 102, ok: false, intensity: 8, trigger: 'Stress' },
      { date: '2026-04-23', t: '11:08', u: 'cig',    r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 5, trigger: 'After meal' },
      { date: '2026-04-22', t: '18:45', u: 'booze',  r: 'Rode 10:00', dur: 600, ok: true,  intensity: 9, trigger: 'Social' },
      { date: '2026-04-22', t: '14:30', u: 'sugar',  r: 'Caved 0:48', dur: 48,  ok: false, intensity: 7, trigger: 'Stress' },
      { date: '2026-04-22', t: '09:15', u: 'cig',    r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 6, trigger: 'After meal' },
      { date: '2026-04-21', t: '22:10', u: 'phone',  r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 5, trigger: 'Boredom' },
      { date: '2026-04-21', t: '16:02', u: 'weed',   r: 'Rode 15:00', dur: 900, ok: true,  intensity: 8, trigger: 'Reward' },
      { date: '2026-04-20', t: '20:22', u: 'shop',   r: 'Rode 5:00',  dur: 300, ok: true,  intensity: 6, trigger: 'Boredom' },
      { date: '2026-04-20', t: '10:40', u: 'cig',    r: 'Caved 2:15', dur: 135, ok: false, intensity: 9, trigger: 'Anger' },
    ],
  };
}

function pbToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function pbNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function pbFormatDate(iso) {
  const today = pbToday();
  const d = new Date(iso + 'T00:00:00');
  const now = new Date();
  const yIso = new Date(now.getTime() - 86400000).toISOString().slice(0,10);
  if (iso === today) return 'Today';
  if (iso === yIso) return 'Yesterday';
  const diff = Math.floor((new Date(today) - d) / 86400000);
  const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
  if (diff < 7) return weekday;
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return `${mo} ${d.getDate()}`;
}

const monoStyle = { fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontVariantNumeric: 'tabular-nums' };

function PBPress({ children, onClick, style }) {
  const [pressed, setP] = React.useState(false);
  return (
    <div
      onPointerDown={() => setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => setP(false)}
      onClick={onClick}
      style={{ ...style, transition: 'transform .08s', transform: pressed ? 'scale(0.97)' : 'scale(1)', cursor: 'pointer' }}>
      {children}
    </div>
  );
}

function PBFade({ k, children }) {
  return (
    <div key={k} style={{ position: 'absolute', inset: 0, animation: 'pb-fade .3s ease-out both' }}>{children}</div>
  );
}

function PBShell({ children }) {
  const { theme } = pbUsePB();
  return (
    <div style={{ position: 'absolute', inset: 0, background: PB.sand, color: PB.ink, fontFamily: PB.body, overflow: 'hidden' }}>
      {children}
      <IOSStatusBar dark={theme === 'light'} />
    </div>
  );
}

function PBPrimary({ children, onClick, icon, kind = 'dark', style, disabled }) {
  const bg = disabled ? PB.sandDk : kind === 'kelp' ? PB.kelp : PB.ink;
  return (
    <PBPress onClick={disabled ? undefined : onClick} style={{
      width: '100%', height: 54, borderRadius: 14, background: bg, color: PB.sand,
      fontFamily: PB.body, fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      border: 'none', opacity: disabled ? 0.5 : 1, ...style
    }}>{icon}{children}</PBPress>
  );
}
function PBGhost({ children, onClick, style }) {
  return (
    <PBPress onClick={onClick} style={{
      width: '100%', height: 52, borderRadius: 14, background: 'transparent', color: PB.ink,
      border: `0.5px solid ${PB.lineStr}`,
      fontFamily: PB.body, fontSize: 15.5, fontWeight: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style
    }}>{children}</PBPress>
  );
}

// ── Home ────────────────────────────────────────────────────
function PBHome() {
  const { s, set, theme, toggleTheme } = pbUsePB();
  const urge = pbFindUrge(s, s.urgeId);
  const totalCount = Object.values(s.counts).reduce((a,b)=>a+b,0);
  const totalRides = Object.values(s.rides).reduce((a,b)=>a+b,0);
  const successPct = Math.round((totalRides / totalCount) * 100);
  const hr = new Date().getHours();
  const greeting = hr < 5 ? 'Hey' : hr < 12 ? 'Morning' : hr < 17 ? 'Afternoon' : hr < 22 ? 'Evening' : 'Hey';
  const firstName = (s.name || 'friend').split(' ')[0];

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 62, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2.4, color: PB.mute, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Urge Surfer</div>
          <div style={{ fontFamily: PB.display, fontSize: 28, fontWeight: 300, letterSpacing: -0.6, lineHeight: 1.05 }}>
            {greeting}, <em style={{ fontStyle: 'italic', color: PB.kelp }}>{firstName}.</em>
          </div>
        </div>
        <PBPress onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 17, background: PB.sandDk, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 4 }}>
          <div style={{ position: 'relative', width: 18, height: 18 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .35s cubic-bezier(.4,.0,.2,1), opacity .25s', transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.6)', opacity: theme === 'light' ? 1 : 0 }}>
              <Icon.Sun s={16} c="var(--pb-ink)"/>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .35s cubic-bezier(.4,.0,.2,1), opacity .25s', transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.6)', opacity: theme === 'dark' ? 1 : 0 }}>
              <Icon.Moon s={16} c="var(--pb-ink)"/>
            </div>
          </div>
        </PBPress>
      </div>

      <div style={{ position: 'absolute', top: 150, left: 24, right: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase', marginBottom: 12 }}>Today</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontFamily: PB.display, fontSize: 104, lineHeight: 0.9, letterSpacing: -4, fontWeight: 300, ...monoStyle }}>{totalRides}</div>
          <div style={{ fontFamily: PB.display, fontSize: 22, color: PB.inkSoft, fontStyle: 'italic' }}>waves ridden</div>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontFamily: PB.display, fontSize: 26, marginTop: 2, ...monoStyle }}>{s.streaks[s.urgeId]} <span style={{ fontSize: 13, color: PB.mute, fontFamily: PB.body }}>days</span></div>
          </div>
          <div style={{ width: 0.5, background: PB.line }}/>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase' }}>Success</div>
            <div style={{ fontFamily: PB.display, fontSize: 26, marginTop: 2, ...monoStyle }}>{successPct}<span style={{ fontSize: 13, color: PB.mute, fontFamily: PB.body }}>%</span></div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 356, left: 24, right: 24, height: 0.5, background: PB.line }}/>

      <div style={{ position: 'absolute', top: 380, left: 24, right: 24 }}>
        <PBPrimary kind="kelp" onClick={() => set({ screen: 'picker' })}>Start a surf →</PBPrimary>
      </div>

      <div style={{ position: 'absolute', top: 460, left: 24, right: 24, bottom: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase' }}>Recent</div>
          <PBPress onClick={() => set({ screen: 'history' })} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.2, color: PB.kelp, fontWeight: 500 }}>History</div>
            <Icon.ArrowRight s={12} c="var(--pb-kelp)"/>
          </PBPress>
        </div>
        {s.log.slice(0, 4).map((row, i) => {
          const u = pbFindUrge(s, row.u);
          const label = row.date === pbToday() ? (row.t || 'now') : pbFormatDate(row.date);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, alignItems: 'center', padding: '11px 0', borderTop: `0.5px solid ${PB.line}` }}>
              <div style={{ fontSize: 12, color: PB.mute, ...monoStyle }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: row.ok ? 'var(--pb-kelp)' : 'var(--pb-coral)' }}/>
                <div style={{ fontSize: 15 }}>{u ? u.label : row.u}</div>
              </div>
              <div style={{ fontSize: 13, color: PB.mute, ...monoStyle }}>{row.r}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: `0.5px solid ${PB.line}` }}>
        {[
          { I: Icon.Home, l: 'Today', active: 'home' },
          { I: Icon.Chart, l: 'Stats', active: 'stats' },
          { I: Icon.Camera, l: 'Album' },
          { I: Icon.User, l: 'Me', active: 'profile' },
        ].map((tab, i) => (
          <PBPress key={i} onClick={() => tab.active && set({ screen: tab.active })}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: tab.active === s.screen ? 1 : 0.4 }}>
            <tab.I s={20} c="var(--pb-ink)"/>
            <div style={{ fontSize: 10, letterSpacing: 0.5 }}>{tab.l}</div>
          </PBPress>
        ))}
      </div>
    </PBShell>
  );
}

// ── Picker ──────────────────────────────────────────────────
function PBPicker() {
  const { s, set } = pbUsePB();
  const [selected, setSel] = React.useState(s.urgeId);
  const [dur, setDur] = React.useState(s.duration);
  const fmt = (sec) => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;

  return (
    <PBShell>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}/>
      <PBPress onClick={() => set({ screen: 'home' })} style={{ position: 'absolute', inset: 0 }}/>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 110,
        background: PB.sand, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '10px 24px 30px', display: 'flex', flexDirection: 'column',
        animation: 'pb-sheet .32s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ width: 34, height: 3, borderRadius: 2, background: PB.muteLo, alignSelf: 'center', marginBottom: 20 }}/>
        <div style={{ fontFamily: PB.display, fontSize: 32, letterSpacing: -0.8, fontWeight: 300 }}>What's rising?</div>
        <div style={{ fontSize: 13, color: PB.mute, marginTop: 4, marginBottom: 22 }}>Name it to ride it.</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {pbTrackedUrges(s).map(u => {
            const on = u.id === selected;
            return (
              <PBPress key={u.id} onClick={() => setSel(u.id)} style={{
                display: 'flex', alignItems: 'center', padding: '14px 14px',
                borderRadius: 12, gap: 12,
                background: on ? PB.ink : PB.sandDim,
                color: on ? PB.sand : PB.ink,
              }}>
                <div style={{ fontSize: 22 }}>{u.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{u.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.55, ...monoStyle }}>{s.streaks[u.id]}d streak</div>
                </div>
              </PBPress>
            );
          })}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase' }}>Duration</div>
            <div style={{ fontFamily: PB.display, fontSize: 20, ...monoStyle }}>{fmt(dur)}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[60, 180, 300, 600, 900].map(sec => {
              const on = dur === sec;
              return (
                <PBPress key={sec} onClick={() => setDur(sec)} style={{
                  flex: 1, padding: '10px 0', textAlign: 'center',
                  borderRadius: 10, background: on ? PB.ink : PB.sandDim,
                  color: on ? PB.sand : PB.ink, fontSize: 14, ...monoStyle,
                }}>{sec/60}<span style={{ fontSize: 10, opacity: 0.6 }}>m</span></PBPress>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <PBPrimary onClick={() => set({ urgeId: selected, duration: dur, remaining: dur, running: true, screen: 'timer' })}>Begin</PBPrimary>
      </div>
    </PBShell>
  );
}

// ── Timer ───────────────────────────────────────────────────
function PBTimer() {
  const { s, set } = pbUsePB();
  const urge = pbFindUrge(s, s.urgeId);
  const progress = 1 - (s.remaining / s.duration);
  const R = 140, C = 2 * Math.PI * R;

  React.useEffect(() => {
    if (!s.running) return;
    const id = setInterval(() => {
      set(prev => {
        if (prev.remaining <= 1) return { ...prev, remaining: 0, running: false, screen: 'success' };
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [s.running]);

  const [phase, setPhase] = React.useState('Breathe in — 4');
  React.useEffect(() => {
    const cycle = () => {
      const t = (Date.now() / 1000) % 12;
      if (t < 4) setPhase('Breathe in — ' + Math.ceil(4 - t));
      else if (t < 7) setPhase('Hold — ' + Math.ceil(7 - t));
      else setPhase('Breathe out — ' + Math.ceil(12 - t));
    };
    cycle();
    const id = setInterval(cycle, 500);
    return () => clearInterval(id);
  }, []);

  const fmt = (sec) => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
  const elapsed = s.duration - s.remaining;

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 62, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PBPress onClick={() => set({ running: false, screen: 'home' })}>
          <Icon.Close s={22} c="var(--pb-mute)"/>
        </PBPress>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase' }}>
          {urge.emoji} {urge.label} · surfing
        </div>
        <div style={{ width: 22 }}/>
      </div>

      <div style={{ position: 'absolute', top: 130, left: 0, right: 0, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="140" fill="none" stroke="var(--pb-kelp)" strokeWidth="0.5" opacity="0.2"/>
          <circle cx="150" cy="150" r="110" fill="none" stroke="var(--pb-kelp)" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="150" cy="150" r="82" fill="var(--pb-kelp)" opacity="0.12"
            style={{ animation: 'pb-breathe 12s ease-in-out infinite', transformOrigin: '150px 150px' }}/>
          <circle cx="150" cy="150" r={R} fill="none" stroke="var(--pb-kelp)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${C * progress} ${C}`}
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dasharray .5s linear' }}/>
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase', marginBottom: 6 }}>Remaining</div>
          <div style={{ fontFamily: PB.display, fontSize: 88, letterSpacing: -3, lineHeight: 1, fontWeight: 300, ...monoStyle }}>{fmt(s.remaining)}</div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 494, left: 32, right: 32, textAlign: 'center' }}>
        <div style={{ fontFamily: PB.display, fontSize: 22, fontStyle: 'italic', color: PB.kelpDk, letterSpacing: -0.3 }}>{phase}</div>
        <div style={{ fontSize: 13.5, color: PB.inkSoft, marginTop: 10, lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          This craving is borrowing your attention. It gives it back, always.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 128, left: 24, right: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase' }}>Intensity</div>
          <div style={{ fontSize: 12, color: PB.inkSoft, ...monoStyle }}>{s.intensity} / 10</div>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <PBPress key={i} onClick={() => set({ intensity: i + 1 })} style={{ flex: 1, height: 14, borderRadius: 1, background: i < s.intensity ? 'var(--pb-kelp)' : 'var(--pb-sand-dk)', padding: 0 }}/>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 24, right: 24, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <PBGhost onClick={() => set({ running: false, caveTime: elapsed, screen: 'caved' })} style={{ height: 46, fontSize: 14, color: PB.mute }}>I caved</PBGhost>
        </div>
        <div style={{ flex: 1.3 }}>
          <PBPrimary onClick={() => set(prev => {
            const u = prev.urgeId;
            return {
              ...prev, running: false, screen: 'success',
              counts: { ...prev.counts, [u]: prev.counts[u] + 1 },
              rides:  { ...prev.rides,  [u]: prev.rides[u]  + 1 },
            };
          })} icon={<Icon.Check s={16} c="var(--pb-sand)"/>} style={{ height: 46, fontSize: 14 }}>Surfed it</PBPrimary>
        </div>
      </div>
    </PBShell>
  );
}

// ── Caved ───────────────────────────────────────────────────
function PBCaved() {
  const { s, set } = pbUsePB();
  const [trigger, setTrigger] = React.useState(null);
  const urge = pbFindUrge(s, s.urgeId);
  const fmt = (sec) => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
  return (
    <PBShell>
      <PBPress onClick={() => set({ screen: 'home' })} style={{ position: 'absolute', top: 60, left: 18, width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Back s={20} c="var(--pb-mute)"/>
      </PBPress>

      <div style={{ position: 'absolute', top: 120, left: 32, right: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: PB.mute, textTransform: 'uppercase' }}>No shame</div>
        <div style={{ fontFamily: PB.display, fontSize: 48, lineHeight: 1.02, letterSpacing: -1.2, fontWeight: 300, marginTop: 14 }}>Noticing counts.</div>
        <div style={{ fontSize: 15, color: PB.inkSoft, marginTop: 18, lineHeight: 1.55 }}>
          You surfed <span style={{ color: PB.ink, fontWeight: 500, ...monoStyle }}>{fmt(s.caveTime)}</span> before the {urge.label.toLowerCase()} wave caught you. That's awareness you didn't have last week.
        </div>
      </div>

      <div style={{ position: 'absolute', top: 360, left: 24, right: 24, padding: 16, borderRadius: 16, background: PB.sandDim }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase', marginBottom: 12 }}>What pulled you under?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Stress', 'Boredom', 'Social', 'After meal', 'Habit', 'Alcohol', 'Anger', 'Reward'].map(t => {
            const on = t === trigger;
            return <PBPress key={t} onClick={() => setTrigger(t)} style={{
              padding: '7px 13px', borderRadius: 12,
              background: on ? PB.ink : 'transparent',
              color: on ? PB.sand : PB.inkSoft,
              border: on ? 'none' : `0.5px solid ${PB.lineStr}`,
              fontSize: 13
            }}>{t}</PBPress>;
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 48, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PBPrimary onClick={() => set(prev => {
          const u = prev.urgeId;
          return {
            ...prev, screen: 'home', trigger,
            counts: { ...prev.counts, [u]: prev.counts[u] + 1 },
            log: [{ date: pbToday(), t: pbNow(), u, r: `Caved ${fmt(prev.caveTime)}`, dur: prev.caveTime, ok: false, intensity: prev.intensity, trigger }, ...prev.log].slice(0, 50),
          };
        })}>Log & reset</PBPrimary>
        <PBGhost onClick={() => set({ remaining: s.duration, running: true, screen: 'timer' })}>Try again</PBGhost>
      </div>
    </PBShell>
  );
}

// ── Success ─────────────────────────────────────────────────
function PBSuccess() {
  const { s, set } = pbUsePB();
  const urge = pbFindUrge(s, s.urgeId);
  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 118, left: 32, right: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: PB.kelp, textTransform: 'uppercase' }}>Wave ridden · {Math.floor(s.duration/60)}:00</div>
        <div style={{ fontFamily: PB.display, fontSize: 56, lineHeight: 1.02, letterSpacing: -1.8, fontWeight: 300, marginTop: 16 }}>
          You outlasted<br/>the <em style={{ fontStyle: 'italic', color: PB.kelp }}>{urge.label.toLowerCase()}.</em>
        </div>
        <svg width="80" height="10" viewBox="0 0 120 10" fill="none" stroke="var(--pb-kelp)" strokeWidth="1" opacity="0.6" style={{ marginTop: 20 }}>
          <path d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5" />
        </svg>
      </div>

      <div style={{ position: 'absolute', top: 380, left: 24, right: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { k: `${urge.label} streak`, v: `${s.streaks[s.urgeId] + (s.urgeId === 'cig' ? 1 : 0)}`, u: 'days' },
          { k: 'This wave', v: `${s.duration/60}:00`, u: 'min' },
          { k: 'Intensity rode', v: `${s.intensity}`, u: '/10' },
          { k: 'Total surfed', v: `${s.rides[s.urgeId] + 1}`, u: '' },
        ].map((x, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: PB.sandDim }}>
            <div style={{ fontSize: 10, letterSpacing: 1.8, color: PB.mute, textTransform: 'uppercase' }}>{x.k}</div>
            <div style={{ fontFamily: PB.display, fontSize: 32, lineHeight: 1.1, marginTop: 6, fontWeight: 300, ...monoStyle }}>
              {x.v}<span style={{ fontSize: 14, color: PB.mute, marginLeft: 2 }}>{x.u}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 48, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PBPrimary onClick={() => set({ screen: 'selfie' })} icon={<Icon.Camera s={18} c="var(--pb-sand)"/>}>Victory selfie</PBPrimary>
        <PBGhost onClick={() => set(prev => {
          const fmt = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
          return { ...prev, screen: 'home',
            streaks: { ...prev.streaks, [prev.urgeId]: prev.streaks[prev.urgeId] + 1 },
            log: [{ date: pbToday(), t: pbNow(), u: prev.urgeId, r: `Rode ${fmt(prev.duration)}`, dur: prev.duration, ok: true, intensity: prev.intensity, trigger: null }, ...prev.log].slice(0, 50),
          };
        })}>Done</PBGhost>
      </div>
    </PBShell>
  );
}

// ── Selfie ──────────────────────────────────────────────────
function PBSelfie() {
  const { s, set } = pbUsePB();
  const [captured, setC] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const snap = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    setTimeout(() => setC(true), 200);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', color: '#F4EFE6', fontFamily: PB.body }}>
      <IOSStatusBar dark={false}/>
      <div style={{ position: 'absolute', top: 60, left: 16, right: 16, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PBPress onClick={() => set({ screen: 'success' })}><Icon.Close s={22} c="#F4EFE6"/></PBPress>
        <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase' }}>Victory</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>1:1</div>
      </div>
      <div style={{ position: 'absolute', top: 120, left: 16, right: 16, aspectRatio: '1', borderRadius: 4, overflow: 'hidden', background: '#1a2426' }}>
        <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=800&fit=crop&crop=faces" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: captured ? 'none' : 'brightness(0.92) saturate(0.9)' }}/>
        {!captured && (
          <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
            width: 170, height: 220, border: `1.5px dashed rgba(244,239,230,0.55)`, borderRadius: 100 }}/>
        )}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '33.33% 33.33%' }}/>
        {!captured && (
          <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'ui-monospace, monospace', fontSize: 9, color: 'rgba(244,239,230,0.85)', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#ff3b30', boxShadow: '0 0 6px #ff3b30' }}/>
            LIVE
          </div>
        )}
        {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', animation: 'pb-fade .18s ease-out both' }}/>}
      </div>
      {!captured ? (
        <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(244,239,230,0.1)' }}/>
          <PBPress onClick={snap} style={{ width: 76, height: 76, borderRadius: 38, background: 'transparent', border: `3px solid #F4EFE6`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, background: '#F4EFE6' }}/>
          </PBPress>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(244,239,230,0.1)' }}/>
        </div>
      ) : (
        <div style={{ position: 'absolute', bottom: 46, left: 16, right: 16, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <PBPress onClick={() => setC(false)} style={{ height: 52, borderRadius: 14, background: 'rgba(244,239,230,0.1)', color: '#F4EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>Retake</PBPress>
          </div>
          <div style={{ flex: 1.4 }}>
            <PBPress onClick={() => set({ screen: 'overlay' })} style={{ height: 52, borderRadius: 14, background: '#F4EFE6', color: '#1F2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 500 }}>Add overlay <Icon.ArrowRight s={16} c="#1F2A2E"/></PBPress>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Overlay editor ──────────────────────────────────────────
function PBOverlay() {
  const { s, set } = pbUsePB();
  const [styleName, setStyleName] = React.useState('Minimal');
  const urge = pbFindUrge(s, s.urgeId);
  const waveN = s.counts[s.urgeId];

  const renderOverlay = () => {
    if (styleName === 'Minimal') {
      return (
        <div style={{ padding: '12px 14px', background: 'rgba(244,239,230,0.94)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14, color: '#1F2A2E' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, opacity: 0.55, textTransform: 'uppercase' }}>{urge.label}-free</div>
            <div style={{ fontFamily: PB.display, fontSize: 30, lineHeight: 1, fontWeight: 300, ...monoStyle }}>{s.streaks[s.urgeId] + 1} <span style={{ fontSize: 13, opacity: 0.55 }}>days</span></div>
          </div>
          <div style={{ width: 0.5, height: 36, background: 'rgba(0,0,0,0.15)' }}/>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, opacity: 0.55, textTransform: 'uppercase' }}>Wave</div>
            <div style={{ fontFamily: PB.display, fontSize: 30, lineHeight: 1, fontWeight: 300, ...monoStyle }}>#{waveN}</div>
          </div>
        </div>
      );
    }
    if (styleName === 'Strava') {
      return (
        <div style={{ padding: '12px 14px', background: 'rgba(31,42,46,0.85)', color: '#F4EFE6', borderRadius: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, opacity: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>URGE SURFER · WAVE #{waveN}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div><div style={{ fontSize: 9, opacity: 0.55 }}>{urge.label}-free</div><div style={{ fontFamily: PB.display, fontSize: 22, fontWeight: 300, ...monoStyle }}>{s.streaks[s.urgeId] + 1}d</div></div>
            <div><div style={{ fontSize: 9, opacity: 0.55 }}>Rode</div><div style={{ fontFamily: PB.display, fontSize: 22, fontWeight: 300, ...monoStyle }}>{s.duration/60}:00</div></div>
            <div><div style={{ fontSize: 9, opacity: 0.55 }}>Intensity</div><div style={{ fontFamily: PB.display, fontSize: 22, fontWeight: 300, ...monoStyle }}>{s.intensity}/10</div></div>
          </div>
        </div>
      );
    }
    if (styleName === 'Ticker') {
      return (
        <div style={{ padding: '10px 14px', background: '#1F2A2E', color: '#F4EFE6', borderRadius: 4, fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1 }}>
          ● {urge.label.toUpperCase()}-FREE {s.streaks[s.urgeId] + 1}D · WAVE #{waveN} · RODE {s.duration/60}:00
        </div>
      );
    }
    if (styleName === 'Polaroid') {
      return (
        <div style={{ padding: '8px 10px 14px', background: '#F4EFE6', borderRadius: 2, textAlign: 'center', color: '#1F2A2E' }}>
          <div style={{ fontFamily: PB.display, fontStyle: 'italic', fontSize: 16 }}>{urge.label}-free, {s.streaks[s.urgeId] + 1} days</div>
          <div style={{ fontSize: 10, opacity: 0.55, marginTop: 2, letterSpacing: 1.5 }}>wave #{waveN} · rode {s.duration/60}:00</div>
        </div>
      );
    }
    return (
      <div style={{ padding: 10, background: '#F4EFE6', borderRadius: 2, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#1F2A2E', lineHeight: 1.5 }}>
        <div style={{ textAlign: 'center', fontWeight: 700, letterSpacing: 2, borderBottom: `1px dashed rgba(0,0,0,0.2)`, paddingBottom: 4, marginBottom: 4 }}>URGE SURFER</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{urge.label.toUpperCase()}-FREE</span><span>{s.streaks[s.urgeId] + 1} DAYS</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>WAVE</span><span>#{waveN}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>RODE</span><span>{s.duration/60}:00</span></div>
      </div>
    );
  };

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 60, left: 16, right: 16, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PBPress onClick={() => set({ screen: 'selfie' })}><Icon.Back s={22} c="var(--pb-ink)"/></PBPress>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Share</div>
        <PBPress onClick={() => set(prev => {
          const fmt = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
          return { ...prev, screen: 'home',
            streaks: { ...prev.streaks, [prev.urgeId]: prev.streaks[prev.urgeId] + 1 },
            log: [{ date: pbToday(), t: pbNow(), u: prev.urgeId, r: `Rode ${fmt(prev.duration)} 📸`, dur: prev.duration, ok: true, intensity: prev.intensity, trigger: null }, ...prev.log].slice(0, 50),
          };
        })}><div style={{ fontSize: 15, color: PB.kelp, fontWeight: 500 }}>Post</div></PBPress>
      </div>

      <div style={{ position: 'absolute', top: 118, left: 24, right: 24, aspectRatio: '1',
        borderRadius: 4, overflow: 'hidden', background: '#1a2426' }}>
        <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=800&fit=crop&crop=faces" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>{renderOverlay()}</div>
      </div>

      <div style={{ position: 'absolute', bottom: 140, left: 0, right: 0 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: PB.mute, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 24 }}>Overlay</div>
        <div style={{ display: 'flex', gap: 8, padding: '0 24px', overflowX: 'auto' }}>
          {['Minimal', 'Strava', 'Ticker', 'Polaroid', 'Receipt'].map(name => {
            const on = name === styleName;
            const previews = {
              Minimal: (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ fontFamily: PB.display, fontSize: 13, fontStyle: 'italic', fontWeight: 300, color: PB.ink, lineHeight: 1 }}>2d</div>
                  <div style={{ fontSize: 5, letterSpacing: 0.6, color: PB.mute, textTransform: 'uppercase' }}>cig-free</div>
                </div>
              ),
              Strava: (
                <div style={{ width: '100%', padding: '3px 4px', background: '#1F2A2E', borderRadius: 1, fontFamily: 'ui-monospace, monospace', fontSize: 5, letterSpacing: 0.4, color: '#F4EFE6', textAlign: 'center', lineHeight: 1.3 }}>
                  ● CIG-FREE 2D<br/>WAVE #3
                </div>
              ),
              Ticker: (
                <div style={{ width: '100%', padding: '3px 4px', background: '#1F2A2E', borderRadius: 1, fontFamily: 'ui-monospace, monospace', fontSize: 5, letterSpacing: 0.4, color: '#F4EFE6', textAlign: 'center' }}>
                  ● CIG · 2D · 5:00
                </div>
              ),
              Polaroid: (
                <div style={{ width: '100%', padding: '2px 3px 4px', background: '#F4EFE6', borderRadius: 1, textAlign: 'center', color: '#1F2A2E', border: `0.5px solid ${PB.lineStr}` }}>
                  <div style={{ fontFamily: PB.display, fontStyle: 'italic', fontSize: 6, lineHeight: 1.1 }}>cig-free, 2d</div>
                  <div style={{ fontSize: 4, opacity: 0.55, letterSpacing: 0.5, marginTop: 1 }}>WAVE #3</div>
                </div>
              ),
              Receipt: (
                <div style={{ width: '100%', padding: 3, background: '#F4EFE6', borderRadius: 1, fontFamily: 'ui-monospace, monospace', fontSize: 4.2, color: '#1F2A2E', lineHeight: 1.4, border: `0.5px solid ${PB.lineStr}` }}>
                  <div style={{ textAlign: 'center', fontWeight: 700, letterSpacing: 0.6, borderBottom: `0.5px dashed rgba(0,0,0,0.25)`, paddingBottom: 1, marginBottom: 1 }}>URGE SURFER</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>CIG</span><span>2D</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>WAVE</span><span>#3</span></div>
                </div>
              ),
            };
            return <PBPress key={name} onClick={() => setStyleName(name)} style={{
              flexShrink: 0, width: 66, height: 90, borderRadius: 6,
              border: `1.5px solid ${on ? PB.ink : PB.lineStr}`,
              background: PB.sandDim, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between', padding: 6,
              fontSize: 10, color: on ? PB.ink : PB.inkSoft, fontWeight: on ? 600 : 400
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{previews[name]}</div>
              <div style={{ textAlign: 'left' }}>{name}</div>
            </PBPress>;
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 48, left: 24, right: 24 }}>
        <PBPrimary onClick={() => set(prev => {
          const fmt = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
          return { ...prev, screen: 'home',
            streaks: { ...prev.streaks, [prev.urgeId]: prev.streaks[prev.urgeId] + 1 },
            log: [{ date: pbToday(), t: pbNow(), u: prev.urgeId, r: `Rode ${fmt(prev.duration)} 📸`, dur: prev.duration, ok: true, intensity: prev.intensity, trigger: null }, ...prev.log].slice(0, 50),
          };
        })} icon={<Icon.Share s={16} c="var(--pb-sand)"/>}>Share</PBPrimary>
      </div>
    </PBShell>
  );
}

// ── Stats ───────────────────────────────────────────────────
function PBStats() {
  const { s, set } = pbUsePB();
  const rate = Math.round((s.rides[s.urgeId] / s.counts[s.urgeId]) * 100);
  const heat = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let w = 0; w < 16; w++) {
      const seed = (d * 13 + w * 23 + 7) % 11;
      row.push(seed < 2 ? 0 : seed < 5 ? 1 : seed < 8 ? 2 : seed < 10 ? 3 : 4);
    }
    heat.push(row);
  }
  const hc = v => v === 0 ? 'var(--pb-sand-dk)' : v === 1 ? 'rgba(74,107,110,0.25)' : v === 2 ? 'rgba(74,107,110,0.5)' : v === 3 ? 'rgba(74,107,110,0.75)' : 'var(--pb-kelp)';

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 60, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase' }}>90 days</div>
          <div style={{ fontFamily: PB.display, fontSize: 38, letterSpacing: -1, fontWeight: 300, marginTop: 4 }}>Your patterns.</div>
        </div>
        <PBPress onClick={() => set({ screen: 'history' })} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.2, color: PB.kelp, fontWeight: 500 }}>History</div>
          <Icon.ArrowRight s={12} c="var(--pb-kelp)"/>
        </PBPress>
      </div>

      <div style={{ position: 'absolute', top: 156, left: 24, right: 24, display: 'flex', gap: 6, overflowX: 'auto' }}>
        {pbTrackedUrges(s).slice(0, 6).map(u => {
          const on = u.id === s.urgeId;
          return <PBPress key={u.id} onClick={() => set({ urgeId: u.id })} style={{
            flexShrink: 0, padding: '6px 12px', borderRadius: 14,
            background: on ? PB.ink : 'transparent',
            color: on ? PB.sand : PB.inkSoft,
            border: on ? 'none' : `0.5px solid ${PB.lineStr}`,
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
          }}><span>{u.emoji}</span>{u.label}</PBPress>;
        })}
      </div>

      <div style={{ position: 'absolute', top: 206, left: 24, right: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[{ k: 'Streak', v: s.streaks[s.urgeId], u: 'd' }, { k: 'Ridden', v: `${s.rides[s.urgeId]}/${s.counts[s.urgeId]}`, u: '' }, { k: 'Success', v: rate, u: '%' }].map((x, i) => (
          <div key={i} style={{ paddingBottom: 12, borderBottom: `0.5px solid ${PB.line}` }}>
            <div style={{ fontSize: 10, letterSpacing: 1.8, color: PB.mute, textTransform: 'uppercase' }}>{x.k}</div>
            <div style={{ fontFamily: PB.display, fontSize: 26, lineHeight: 1.1, marginTop: 4, fontWeight: 300, ...monoStyle }}>
              {x.v}{x.u && <span style={{ fontSize: 13, color: PB.mute, marginLeft: 2 }}>{x.u}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 312, left: 24, right: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.8, color: PB.mute, textTransform: 'uppercase' }}>Urge pattern · by hour</div>
          <div style={{ fontSize: 11, color: PB.muteLo, ...monoStyle }}>6a → 10p</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {heat.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <div style={{ width: 16, fontSize: 9, color: PB.mute, ...monoStyle }}>{['M','T','W','T','F','S','S'][r]}</div>
              {row.map((v, c) => <div key={c} style={{ flex: 1, height: 14, borderRadius: 1, background: hc(v) }}/>)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 472, left: 24, right: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.8, color: PB.mute, textTransform: 'uppercase', marginBottom: 10 }}>Top triggers</div>
        {[{ t: 'Stress', pct: 41 }, { t: 'After meal', pct: 24 }, { t: 'Social', pct: 18 }, { t: 'Boredom', pct: 11 }].map((t, i) => (
          <div key={i} style={{ marginBottom: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ fontSize: 13 }}>{t.t}</div>
              <div style={{ fontSize: 12, color: PB.mute, ...monoStyle }}>{t.pct}%</div>
            </div>
            <div style={{ height: 3, borderRadius: 1.5, background: PB.sandDk, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${t.pct * 2}%`, background: PB.kelp, borderRadius: 1.5 }}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: `0.5px solid ${PB.line}` }}>
        {[
          { I: Icon.Home, l: 'Today', active: 'home' },
          { I: Icon.Chart, l: 'Stats', active: 'stats' },
          { I: Icon.Camera, l: 'Album' },
          { I: Icon.User, l: 'Me', active: 'profile' },
        ].map((tab, i) => (
          <PBPress key={i} onClick={() => tab.active && set({ screen: tab.active })}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: tab.active === s.screen ? 1 : 0.4 }}>
            <tab.I s={20} c="var(--pb-ink)"/>
            <div style={{ fontSize: 10, letterSpacing: 0.5 }}>{tab.l}</div>
          </PBPress>
        ))}
      </div>
    </PBShell>
  );
}

// ── History ─────────────────────────────────────────────────
function PBHistory() {
  const { s, set } = pbUsePB();
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? s.log : s.log.filter(r => r.u === filter);

  // Group by date
  const groups = {};
  filtered.forEach(r => { (groups[r.date] = groups[r.date] || []).push(r); });
  const dates = Object.keys(groups).sort().reverse();

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 60, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PBPress onClick={() => set({ screen: 'home' })} style={{ width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Back s={20} c="var(--pb-ink)"/>
        </PBPress>
        <div style={{ fontSize: 15, fontWeight: 500 }}>History</div>
        <div style={{ width: 32 }}/>
      </div>

      <div style={{ position: 'absolute', top: 110, left: 24, right: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: PB.mute, textTransform: 'uppercase' }}>All time</div>
        <div style={{ fontFamily: PB.display, fontSize: 38, letterSpacing: -1, fontWeight: 300, marginTop: 4 }}>{filtered.length} <span style={{ fontStyle: 'italic', fontSize: 22, color: PB.inkSoft }}>urges logged</span></div>
      </div>

      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, paddingLeft: 24, paddingRight: 24, display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[{ id: 'all', label: 'All', emoji: '∞' }, ...pbTrackedUrges(s)].map(u => {
          const on = u.id === filter;
          return <PBPress key={u.id} onClick={() => setFilter(u.id)} style={{
            flexShrink: 0, padding: '6px 12px', borderRadius: 14,
            background: on ? PB.ink : 'transparent',
            color: on ? PB.sand : PB.inkSoft,
            border: on ? 'none' : `0.5px solid ${PB.lineStr}`,
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
          }}><span>{u.emoji}</span>{u.label}</PBPress>;
        })}
      </div>

      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 24px 40px' }}>
        {dates.map(date => {
          const rows = groups[date];
          const ok = rows.filter(r => r.ok).length;
          return (
            <div key={date} style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontFamily: PB.display, fontSize: 20, fontWeight: 400, letterSpacing: -0.3 }}>{pbFormatDate(date)}</div>
                <div style={{ fontSize: 11, color: PB.mute, ...monoStyle }}>{ok}/{rows.length} rode</div>
              </div>
              {rows.map((row, i) => {
                const u = pbFindUrge(s, row.u);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '42px 24px 1fr auto', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: `0.5px solid ${PB.line}` }}>
                    <div style={{ fontSize: 11, color: PB.mute, ...monoStyle }}>{row.t}</div>
                    <div style={{ fontSize: 16 }}>{u?.emoji}</div>
                    <div>
                      <div style={{ fontSize: 14 }}>{u?.label}</div>
                      <div style={{ fontSize: 11, color: PB.mute, marginTop: 1 }}>
                        {row.trigger || '—'} · i{row.intensity}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 3, background: row.ok ? 'var(--pb-kelp)' : 'var(--pb-coral)' }}/>
                      <div style={{ fontSize: 12, color: row.ok ? PB.kelpDk : PB.coral, ...monoStyle }}>{row.r}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </PBShell>
  );
}



// ── Custom-urge creator (modal sheet) ───────────────────────
// Adds a new entry to s.catalog with default zero counters and
// auto-tracks it. Used from onboarding + profile edit.
function PBCustomUrgeSheet({ open, onClose, onCreate }) {
  const [label, setLabel] = React.useState('');
  const [emoji, setEmoji] = React.useState(PB_CUSTOM_EMOJIS[0]);
  React.useEffect(() => {
    if (open) { setLabel(''); setEmoji(PB_CUSTOM_EMOJIS[Math.floor(Math.random() * PB_CUSTOM_EMOJIS.length)]); }
  }, [open]);
  if (!open) return null;
  const trimmed = label.trim();
  const submit = () => {
    if (!trimmed) return;
    onCreate({ label: trimmed.slice(0, 20), emoji });
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, animation: 'pb-fade .2s ease-out both' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--pb-sand)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '16px 24px 32px', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        animation: 'pb-sheet .25s cubic-bezier(.2,.8,.2,1) both',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--pb-line-str)', margin: '4px auto 18px' }}/>
        <div style={{ fontFamily: PB.display, fontSize: 28, fontWeight: 300, letterSpacing: -0.6, color: 'var(--pb-ink)' }}>
          Add your own.
        </div>
        <div style={{ fontSize: 13, color: 'var(--pb-mute)', marginTop: 4 }}>
          Name your pattern. Pick a glyph.
        </div>

        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: 'var(--pb-sand-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0,
          }}>{emoji}</div>
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder="e.g. Late-night scroll"
            maxLength={20}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--pb-line-str)', padding: '10px 0',
              fontFamily: PB.display, fontSize: 22, fontWeight: 300, letterSpacing: -0.4,
              color: 'var(--pb-ink)', outline: 'none',
            }}
          />
        </div>

        <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--pb-mute)', textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Glyph</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 6 }}>
          {PB_CUSTOM_EMOJIS.map(e => {
            const on = e === emoji;
            return (
              <PBPress key={e} onClick={() => setEmoji(e)} style={{
                aspectRatio: '1 / 1', borderRadius: 10,
                background: on ? 'var(--pb-ink)' : 'var(--pb-sand-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>{e}</PBPress>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <div style={{ flex: 1 }}><PBGhost onClick={onClose}>Cancel</PBGhost></div>
          <div style={{ flex: 1.4 }}>
            <PBPrimary disabled={!trimmed} onClick={submit}>Add to surf</PBPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: build a new urge in state. Returns the new id.
function pbAddCustomUrge(set, { label, emoji }) {
  const id = 'cust_' + Date.now().toString(36);
  set(prev => ({
    ...prev,
    catalog: [...prev.catalog, { id, label, emoji, custom: true }],
    streaks: { ...prev.streaks, [id]: 0 },
    counts:  { ...prev.counts,  [id]: 0 },
    rides:   { ...prev.rides,   [id]: 0 },
  }));
  return id;
}

// ── Onboarding ──────────────────────────────────────────────
function PBOnboarding() {
  const { s, set } = pbUsePB();
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(s.name || '');
  const [picked, setPicked] = React.useState(new Set(s.tracked));
  const [customOpen, setCustomOpen] = React.useState(false);

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const finish = () => {
    const arr = pbAllUrges(s).map(u => u.id).filter(id => picked.has(id));
    set({
      name: name.trim() || 'Friend',
      tracked: arr.length ? arr : ['cig'],
      urgeId: arr[0] || 'cig',
      screen: 'home',
    });
  };

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 64, left: 24, right: 24, display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i <= step ? 'var(--pb-kelp)' : 'var(--pb-sandDk)' }}/>
        ))}
      </div>

      {step === 0 && (
        <div style={{ position: 'absolute', top: 130, left: 24, right: 24 }}>
          <svg width="48" height="14" viewBox="0 0 120 18" fill="none" stroke="var(--pb-kelp)" strokeWidth="1.4" opacity="0.7">
            <path d="M0 9 Q 10 2, 20 9 T 40 9 T 60 9 T 80 9 T 100 9 T 120 9"/>
          </svg>
          <div style={{ fontFamily: PB.display, fontSize: 52, lineHeight: 1.04, letterSpacing: -1.6, fontWeight: 300, marginTop: 18, color: 'var(--pb-ink)' }}>
            Welcome to <em style={{ fontStyle: 'italic', color: 'var(--pb-kelp)' }}>Urge Surfer.</em>
          </div>
          <div style={{ fontSize: 15.5, color: 'var(--pb-inkSoft)', marginTop: 18, lineHeight: 1.55 }}>
            Cravings are waves — they rise, peak, and pass. We'll teach you to ride them, not fight them.
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ position: 'absolute', top: 130, left: 24, right: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--pb-mute)', textTransform: 'uppercase' }}>Step 1 of 2</div>
          <div style={{ fontFamily: PB.display, fontSize: 42, lineHeight: 1.05, letterSpacing: -1.2, fontWeight: 300, marginTop: 14, color: 'var(--pb-ink)' }}>
            What should we<br/>call you?
          </div>
          <div style={{ marginTop: 36 }}>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              maxLength={24}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--pb-lineStr)', padding: '12px 0',
                fontFamily: PB.display, fontSize: 28, color: 'var(--pb-ink)', outline: 'none',
                fontWeight: 300, letterSpacing: -0.4,
              }}
            />
            <div style={{ fontSize: 12, color: 'var(--pb-muteLo)', marginTop: 8 }}>Used only on your home screen.</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ position: 'absolute', top: 100, left: 24, right: 24, bottom: 130 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--pb-mute)', textTransform: 'uppercase' }}>Step 2 of 2</div>
          <div style={{ fontFamily: PB.display, fontSize: 36, lineHeight: 1.05, letterSpacing: -1, fontWeight: 300, marginTop: 10, color: 'var(--pb-ink)' }}>
            What do you want<br/>to surf?
          </div>
          <div style={{ fontSize: 13, color: 'var(--pb-mute)', marginTop: 6, marginBottom: 20 }}>Pick any number. You can change this later.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
            {pbAllUrges(s).map(u => {
              const on = picked.has(u.id);
              return (
                <PBPress key={u.id} onClick={() => togglePick(u.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px',
                  borderRadius: 12,
                  background: on ? 'var(--pb-ink)' : 'var(--pb-sandDim)',
                  color: on ? 'var(--pb-sand)' : 'var(--pb-ink)',
                }}>
                  <div style={{ fontSize: 20 }}>{u.emoji}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{u.label}</div>
                  <div style={{
                    width: 16, height: 16, borderRadius: 8,
                    border: `1.5px solid ${on ? 'var(--pb-sand)' : 'var(--pb-lineStr)'}`,
                    background: on ? 'var(--pb-sand)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {on && <Icon.Check s={10} c="var(--pb-ink)"/>}
                  </div>
                </PBPress>
              );
            })}
            <PBPress onClick={() => setCustomOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px dashed var(--pb-line-str)',
              color: 'var(--pb-ink-soft)',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--pb-sand-dim)',
              }}><Icon.Plus s={12} c="var(--pb-ink)"/></div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, fontStyle: 'italic' }}>Add your own</div>
            </PBPress>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 48, left: 24, right: 24, display: 'flex', gap: 8 }}>
        {step > 0 && (
          <div style={{ flex: 1 }}>
            <PBGhost onClick={() => setStep(step - 1)}>Back</PBGhost>
          </div>
        )}
        <div style={{ flex: step > 0 ? 1.5 : 1 }}>
          {step < 2 ? (
            <PBPrimary
              disabled={step === 1 && !name.trim()}
              onClick={() => setStep(step + 1)}>
              {step === 0 ? "Let's begin" : 'Continue'}
            </PBPrimary>
          ) : (
            <PBPrimary
              disabled={picked.size === 0}
              onClick={finish}>
              Start surfing — {picked.size} {picked.size === 1 ? 'pattern' : 'patterns'}
            </PBPrimary>
          )}
        </div>
      </div>

      <PBCustomUrgeSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onCreate={({ label, emoji }) => {
          const id = pbAddCustomUrge(set, { label, emoji });
          setPicked(prev => { const n = new Set(prev); n.add(id); return n; });
          setCustomOpen(false);
        }}
      />
    </PBShell>
  );
}

// ── Profile ─────────────────────────────────────────────────
function PBProfile() {
  const { s, set } = pbUsePB();
  const [name, setName] = React.useState(s.name || '');
  const [picked, setPicked] = React.useState(new Set(s.tracked));
  const [editing, setEditing] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(false);

  React.useEffect(() => {
    if (!editing) {
      setName(s.name || '');
      setPicked(new Set(s.tracked));
    }
  }, [s.name, s.tracked, editing]);

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const save = () => {
    const arr = pbAllUrges(s).map(u => u.id).filter(id => picked.has(id));
    if (arr.length === 0) return;
    set(prev => ({
      ...prev,
      name: name.trim() || prev.name || 'Friend',
      tracked: arr,
      urgeId: arr.includes(prev.urgeId) ? prev.urgeId : arr[0],
    }));
    setEditing(false);
  };

  const reset = () => {
    setName(s.name || '');
    setPicked(new Set(s.tracked));
    setEditing(false);
  };

  const tracked = pbTrackedUrges(s);
  const totalRides = Object.values(s.rides).reduce((a,b)=>a+b,0);
  const totalCount = Object.values(s.counts).reduce((a,b)=>a+b,0);
  const successPct = totalCount ? Math.round((totalRides / totalCount) * 100) : 0;

  return (
    <PBShell>
      <div style={{ position: 'absolute', top: 60, left: 16, right: 16, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PBPress onClick={() => editing ? reset() : set({ screen: 'home' })} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center' }}>
          <Icon.Back s={22} c="var(--pb-ink)"/>
        </PBPress>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Profile</div>
        {editing
          ? <PBPress onClick={save} style={{ padding: '0 4px' }}>
              <div style={{ fontSize: 15, color: picked.size ? 'var(--pb-kelp)' : 'var(--pb-muteLo)', fontWeight: 500 }}>Save</div>
            </PBPress>
          : <PBPress onClick={() => setEditing(true)} style={{ padding: '0 4px' }}>
              <div style={{ fontSize: 15, color: 'var(--pb-kelp)', fontWeight: 500 }}>Edit</div>
            </PBPress>}
      </div>

      <div style={{ position: 'absolute', top: 122, left: 24, right: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--pb-mute)', textTransform: 'uppercase' }}>Hello,</div>
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--pb-lineStr)', padding: '4px 0',
              fontFamily: PB.display, fontSize: 38, color: 'var(--pb-ink)', outline: 'none',
              fontWeight: 300, letterSpacing: -1, marginTop: 4,
            }}
          />
        ) : (
          <div style={{ fontFamily: PB.display, fontSize: 42, fontWeight: 300, letterSpacing: -1, lineHeight: 1.1, marginTop: 4 }}>
            {s.name || 'Friend'}.
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', top: 226, left: 24, right: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { k: 'Patterns', v: s.tracked.length },
          { k: 'Rides',    v: totalRides },
          { k: 'Success',  v: successPct + '%' },
        ].map((x, i) => (
          <div key={i} style={{ paddingBottom: 10, borderBottom: '0.5px solid var(--pb-line)' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.8, color: 'var(--pb-mute)', textTransform: 'uppercase' }}>{x.k}</div>
            <div style={{ fontFamily: PB.display, fontSize: 24, lineHeight: 1.1, marginTop: 4, fontWeight: 300, ...monoStyle }}>{x.v}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 314, left: 24, right: 24, bottom: 110 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'var(--pb-mute)', textTransform: 'uppercase' }}>
            {editing ? 'Tracking' : 'Surfing ' + tracked.length}
          </div>
          {editing && (
            <div style={{ fontSize: 11, color: 'var(--pb-muteLo)' }}>{picked.size} selected</div>
          )}
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 360, paddingRight: 2 }}>
          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {pbAllUrges(s).map(u => {
                const on = picked.has(u.id);
                return (
                  <PBPress key={u.id} onClick={() => togglePick(u.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px',
                    borderRadius: 12,
                    background: on ? 'var(--pb-ink)' : 'var(--pb-sandDim)',
                    color: on ? 'var(--pb-sand)' : 'var(--pb-ink)',
                  }}>
                    <div style={{ fontSize: 18 }}>{u.emoji}</div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{u.label}</div>
                    <div style={{
                      width: 16, height: 16, borderRadius: 8,
                      border: `1.5px solid ${on ? 'var(--pb-sand)' : 'var(--pb-lineStr)'}`,
                      background: on ? 'var(--pb-sand)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {on && <Icon.Check s={10} c="var(--pb-ink)"/>}
                    </div>
                  </PBPress>
                );
              })}
              <PBPress onClick={() => setCustomOpen(true)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px',
                borderRadius: 12,
                background: 'transparent',
                border: '1px dashed var(--pb-line-str)',
                color: 'var(--pb-ink-soft)',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'var(--pb-sand-dim)',
                }}><Icon.Plus s={11} c="var(--pb-ink)"/></div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, fontStyle: 'italic' }}>Add your own</div>
              </PBPress>
            </div>
          ) : (
            <div>
              {tracked.map(u => (
                <div key={u.id} style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12,
                  alignItems: 'center', padding: '14px 0',
                  borderTop: '0.5px solid var(--pb-line)',
                }}>
                  <div style={{ fontSize: 20 }}>{u.emoji}</div>
                  <div>
                    <div style={{ fontSize: 15 }}>{u.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--pb-mute)', ...monoStyle, marginTop: 1 }}>
                      {(s.streaks[u.id] || 0)}d streak · {(s.rides[u.id] || 0)}/{(s.counts[u.id] || 0)} ridden
                    </div>
                  </div>
                  <PBPress onClick={() => set({ urgeId: u.id, screen: 'picker' })} style={{
                    fontSize: 12, color: 'var(--pb-kelp)', fontWeight: 500, padding: '4px 0'
                  }}>Surf →</PBPress>
                </div>
              ))}
              {tracked.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--pb-mute)', fontSize: 14, marginTop: 30 }}>
                  Nothing tracked yet. Tap Edit.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '0.5px solid var(--pb-line)' }}>
        {[
          { I: Icon.Home, l: 'Today', active: 'home' },
          { I: Icon.Chart, l: 'Stats', active: 'stats' },
          { I: Icon.Camera, l: 'Album' },
          { I: Icon.User, l: 'Me', active: 'profile' },
        ].map((tab, i) => (
          <PBPress key={i} onClick={() => tab.active && set({ screen: tab.active })}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: tab.active === s.screen ? 1 : 0.4 }}>
            <tab.I s={20} c="var(--pb-ink)"/>
            <div style={{ fontSize: 10, letterSpacing: 0.5 }}>{tab.l}</div>
          </PBPress>
        ))}
      </div>

      <PBCustomUrgeSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onCreate={({ label, emoji }) => {
          const id = pbAddCustomUrge(set, { label, emoji });
          setPicked(prev => { const n = new Set(prev); n.add(id); return n; });
          setCustomOpen(false);
        }}
      />
    </PBShell>
  );
}


// ── App ─────────────────────────────────────────────────────
function PBApp({ theme: themeProp = 'light' }) {
  const [s, setState] = React.useState(pbInitialState());
  const [theme, setTheme] = React.useState(themeProp);
  const toggleTheme = React.useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);
  const set = React.useCallback((patch) => {
    setState(prev => typeof patch === 'function' ? patch(prev) : { ...prev, ...patch });
  }, []);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (rootRef.current) pbApplyTheme(rootRef.current, theme);
  }, [theme]);

  const Screen =
    s.screen === 'home'    ? PBHome :
    s.screen === 'picker'  ? PBPicker :
    s.screen === 'timer'   ? PBTimer :
    s.screen === 'caved'   ? PBCaved :
    s.screen === 'success' ? PBSuccess :
    s.screen === 'selfie'  ? PBSelfie :
    s.screen === 'overlay' ? PBOverlay :
    s.screen === 'history' ? PBHistory :
    s.screen === 'onboarding' ? PBOnboarding :
    s.screen === 'profile' ? PBProfile :
    s.screen === 'stats'   ? PBStats : PBHome;

  return (
    <div ref={rootRef} className="pb-root" style={{ position: 'absolute', inset: 0 }}>
      <PBCtx.Provider value={{ s, set, theme, toggleTheme }}>
        <PBFade k={s.screen}><Screen/></PBFade>
      </PBCtx.Provider>
    </div>
  );
}

Object.assign(window, { PBApp });
