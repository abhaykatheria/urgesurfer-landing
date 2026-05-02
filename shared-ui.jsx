// shared-ui.jsx — common primitives used by both directions
// Placed on window so Babel scope doesn't collide.

// ──────────────────────────────────────────────────────────
// Icons (minimal stroke; reused across both directions)
// ──────────────────────────────────────────────────────────
const Icon = {
  Wave: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2 0 2-3 5-3s3 3 5 3 2-3 5-3 3 3 5 3" />
      <path d="M2 17c2 0 2-3 5-3s3 3 5 3 2-3 5-3 3 3 5 3" opacity=".5" />
    </svg>
  ),
  Plus: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  Close: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  Camera: ({ s = 22, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>
    </svg>
  ),
  Chart: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
  ),
  Flame: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round"><path d="M12 3c1 3 4 4 4 8a4 4 0 01-8 0c0-2 1-3 1-5 0 1 1 2 3 2 0-2-1-3 0-5z"/></svg>
  ),
  Home: ({ s = 22, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v10H3z"/></svg>
  ),
  User: ({ s = 22, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6" strokeLinecap="round"/></svg>
  ),
  Check: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5 11-12"/></svg>
  ),
  Share: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6"/></svg>
  ),
  Clock: ({ s = 18, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/></svg>
  ),
  Back: ({ s = 22, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4l-8 8 8 8"/></svg>
  ),
  ArrowRight: ({ s = 18, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  ),
  Settings: ({ s = 20, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Zap: ({ s = 16, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M13 2L4 14h7l-2 8 9-12h-7z"/></svg>
  ),
  Sparkle: ({ s = 16, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/></svg>
  ),
  Sun: ({ s = 18, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.6"/>
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/>
    </svg>
  ),
  Moon: ({ s = 18, c = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 14.4A8.5 8.5 0 1 1 9.6 3.5a7 7 0 0 0 10.9 10.9z"/>
    </svg>
  ),
};

// ──────────────────────────────────────────────────────────
// URGE TYPES (data)
// ──────────────────────────────────────────────────────────
const URGES = [
  { id: 'cig',    label: 'Cigarette',     emoji: '🚬', color: '#E07A5F', stat: '$8.40',  unit: 'saved',   streak: 12, rate: 87, count: 34 },
  { id: 'vape',   label: 'Vape',          emoji: '💨', color: '#C38E8E', stat: '210',    unit: 'puffs dodged', streak: 4,  rate: 72, count: 18 },
  { id: 'booze',  label: 'Alcohol',       emoji: '🍷', color: '#8B4A5C', stat: '3',      unit: 'dry days',streak: 3,  rate: 65, count: 9  },
  { id: 'coffee', label: 'Coffee',        emoji: '☕', color: '#8B6F47', stat: '2 hrs',  unit: 'better sleep', streak: 6, rate: 78, count: 22 },
  { id: 'sugar',  label: 'Sugar',         emoji: '🍩', color: '#D9A574', stat: '1.2k',   unit: 'cals dodged', streak: 2,  rate: 58, count: 14 },
  { id: 'weed',   label: 'Weed',          emoji: '🌿', color: '#6B8F5E', stat: '8',      unit: 'clear days',  streak: 8,  rate: 81, count: 19 },
  { id: 'phone',  label: 'Social',        emoji: '📱', color: '#5A7BA8', stat: '4.1h',   unit: 'screen less', streak: 5,  rate: 69, count: 28 },
  { id: 'shop',   label: 'Shopping',      emoji: '🛍️', color: '#B88A8A', stat: '$142',   unit: 'saved',   streak: 7,  rate: 83, count: 11 },
  { id: 'porn',   label: 'Porn',          emoji: '🔞', color: '#7A5F8C', stat: '15',     unit: 'days',    streak: 15, rate: 88, count: 21 },
  { id: 'custom', label: '+ Add your own',emoji: '✳️', color: '#999',    stat: '—',      unit: '',        streak: 0,  rate: 0,  count: 0  },
];

// ──────────────────────────────────────────────────────────
// Animated ocean wave svg — used in Direction A
// Two stacked sines with phase offset, animated via CSS
// ──────────────────────────────────────────────────────────
function OceanWave({ h = 180, colorBack = '#1A3A52', colorFront = '#2A5A7F', amplitude = 12, animate = true }) {
  // build a path from sines
  const w = 390;
  const pts = [];
  for (let x = 0; x <= w; x += 6) {
    const y = h / 2 + Math.sin(x / 40) * amplitude + Math.sin(x / 17) * (amplitude * 0.4);
    pts.push(`${x},${y}`);
  }
  const path = `M0,${h} L0,${pts[0].split(',')[1]} L${pts.join(' L')} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`wg-${colorBack.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={colorFront} stopOpacity="1"/>
          <stop offset="1" stopColor={colorBack} stopOpacity="1"/>
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#wg-${colorBack.replace('#','')})`}>
        {animate && (<>
          <animate attributeName="d" dur="6s" repeatCount="indefinite"
            values={[0, 0.5, 1, 1.5, 2].map(phase => {
              const P = [];
              for (let x = 0; x <= w; x += 6) {
                const y = h / 2 + Math.sin(x / 40 + phase) * amplitude + Math.sin(x / 17 - phase) * (amplitude * 0.4);
                P.push(`${x},${y}`);
              }
              return `M0,${h} L0,${P[0].split(',')[1]} L${P.join(' L')} L${w},${h} Z`;
            }).join(';')} />
        </>)}
      </path>
    </svg>
  );
}

// A simple tabular numbers style
const monoStyle = { fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' };

Object.assign(window, { Icon, URGES, OceanWave, monoStyle });
