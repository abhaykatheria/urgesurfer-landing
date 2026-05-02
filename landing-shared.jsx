// landing-shared.jsx — shared primitives for all 3 landing directions

// ── Phone embed ─────────────────────────────────────────────
// Renders the proto-b PBApp inside a clean iPhone bezel.
// Uses pre-set screen states via initialScreen so we can show
// home / timer / success without user interaction.
function LSPhone({ width = 320, screen = 'home', name = 'Sarah', urgeId = 'cig', remaining, theme = 'light', tilt = 0, style = {} }) {
  // Lazy mount: PBApp owns its own router. We just pre-bake state via a wrapper.
  const ref = React.useRef(null);
  return (
    <div style={{ width, transform: `rotate(${tilt}deg)`, transformOrigin: 'center', ...style }}>
      <div style={{
        position: 'relative', width, aspectRatio: '402 / 874',
        borderRadius: width * 0.13,
        background: '#0A0A0A',
        padding: width * 0.022,
        boxShadow: '0 30px 80px rgba(15,30,40,0.18), 0 4px 12px rgba(15,30,40,0.08)',
      }}>
        <div style={{
          position: 'absolute', inset: width * 0.022,
          borderRadius: width * 0.108,
          overflow: 'hidden',
          background: theme === 'dark' ? '#1A1815' : '#F4EFE6',
        }}>
          <LSPhoneScreen screen={screen} name={name} urgeId={urgeId} remaining={remaining} theme={theme} width={width}/>
        </div>
        {/* speaker pill */}
        <div style={{
          position: 'absolute', top: width * 0.04, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.27, height: width * 0.025, borderRadius: width * 0.025, background: '#000', zIndex: 5,
        }}/>
      </div>
    </div>
  );
}

// Frozen, decorative re-renders of key prototype screens at given size.
// We don't mount the real PBApp here because we want clean, deterministic
// hero shots with no live state. The proto file itself remains the truth.
function LSPhoneScreen({ screen, name, urgeId, remaining = 247, theme, width }) {
  // Map a few preset screens to mini-renderers.
  if (screen === 'home') return <LSHomeScreen name={name} theme={theme} width={width}/>;
  if (screen === 'timer') return <LSTimerScreen urgeId={urgeId} remaining={remaining} theme={theme} width={width}/>;
  if (screen === 'success') return <LSSuccessScreen urgeId={urgeId} theme={theme} width={width}/>;
  if (screen === 'picker') return <LSPickerScreen theme={theme} width={width}/>;
  return null;
}

const LS_PALETTE = {
  light: { sand: '#F4EFE6', sandDim: '#EBE4D5', sandDk: '#E0D7C3', ink: '#1F2A2E', inkSoft: '#3D4A50', kelp: '#4A6B6E', coral: '#C96442', mute: 'rgba(31,42,46,0.55)', muteLo: 'rgba(31,42,46,0.35)', line: 'rgba(31,42,46,0.1)', lineStr: 'rgba(31,42,46,0.2)' },
  dark:  { sand: '#1A1815', sandDim: '#242220', sandDk: '#2E2C29', ink: '#F4EFE6', inkSoft: '#C4BEB2', kelp: '#7BA3A6', coral: '#E48864', mute: 'rgba(244,239,230,0.55)', muteLo: 'rgba(244,239,230,0.3)',  line: 'rgba(244,239,230,0.08)', lineStr: 'rgba(244,239,230,0.15)' },
};

const LS_URGES = {
  cig:   { label: 'Cigarette', emoji: '🚬' },
  coffee:{ label: 'Coffee',    emoji: '☕' },
  phone: { label: 'Social',    emoji: '📱' },
  sugar: { label: 'Sugar',     emoji: '🍩' },
};

// scale: scale factor where 320 width = 1
function LSStatusBar({ p, scale }) {
  const now = '9:41';
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44 * scale, padding: `${10*scale}px ${22*scale}px 0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 * scale, fontWeight: 600, color: p.ink, fontFamily: '-apple-system, system-ui, sans-serif', zIndex: 4 }}>
      <div>{now}</div>
      <div style={{ display: 'flex', gap: 4 * scale, alignItems: 'center' }}>
        {/* signal */}
        <div style={{ display: 'flex', gap: 1.5 * scale, alignItems: 'flex-end' }}>
          {[3,5,7,9].map(h => <div key={h} style={{ width: 2.5*scale, height: h*scale, borderRadius: 0.5, background: p.ink }}/>)}
        </div>
        {/* battery */}
        <div style={{ width: 22*scale, height: 11*scale, border: `1px solid ${p.ink}`, borderRadius: 2.5*scale, padding: 1*scale, marginLeft: 2*scale }}>
          <div style={{ width: '85%', height: '100%', background: p.ink, borderRadius: 1*scale }}/>
        </div>
      </div>
    </div>
  );
}

function LSTabBar({ p, scale, active = 'home' }) {
  const fs = n => n * scale;
  const tabs = [
    { id: 'home',    l: 'Today',
      icon: <path d="M3 12l9-9 9 9M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round"/> },
    { id: 'stats',   l: 'Stats',
      icon: <g><line x1="4" y1="20" x2="20" y2="20"/><line x1="7" y1="20" x2="7" y2="13"/><line x1="12" y1="20" x2="12" y2="9"/><line x1="17" y1="20" x2="17" y2="5"/></g> },
    { id: 'album',   l: 'Album',
      icon: <g><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"/></g> },
    { id: 'profile', l: 'Me',
      icon: <g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g> },
  ];
  return (
    <div style={{ position: 'absolute', bottom: fs(28), left: fs(24), right: fs(24), display: 'flex', justifyContent: 'space-between', paddingTop: fs(14), borderTop: `0.5px solid ${p.line}` }}>
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs(3), opacity: isActive ? 1 : 0.4 }}>
            <svg width={fs(20)} height={fs(20)} viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.6">{tab.icon}</svg>
            <div style={{ fontSize: fs(10), letterSpacing: 0.5, color: p.ink }}>{tab.l}</div>
          </div>
        );
      })}
    </div>
  );
}

function LSHomeScreen({ name, theme, width }) {
  const p = LS_PALETTE[theme];
  const scale = width / 402;
  const fs = (n) => n * scale;
  return (
    <div style={{ position: 'absolute', inset: 0, background: p.sand, color: p.ink, fontFamily: '-apple-system, system-ui, sans-serif' }}>
      <LSStatusBar p={p} scale={scale}/>
      <div style={{ position: 'absolute', top: fs(62), left: fs(24), right: fs(24), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: fs(10), letterSpacing: 2.4, color: p.mute, textTransform: 'uppercase', marginBottom: fs(4), fontWeight: 500 }}>Urge Surfer</div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(28), fontWeight: 300, letterSpacing: -0.6, lineHeight: 1.05 }}>
            Morning, <em style={{ fontStyle: 'italic', color: p.kelp }}>{name}.</em>
          </div>
        </div>
        <div style={{ width: fs(34), height: fs(34), borderRadius: fs(17), background: p.sandDk, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={fs(16)} height={fs(16)} viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3.6"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>
        </div>
      </div>

      <div style={{ position: 'absolute', top: fs(170), left: fs(24), right: fs(24) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: fs(8), marginBottom: fs(14) }}>
          <span style={{ fontSize: fs(15) }}>🚬</span>
          <div style={{ fontSize: fs(11), letterSpacing: 2.5, color: p.mute, textTransform: 'uppercase', fontWeight: 500 }}>Cigarette</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: fs(12) }}>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(104), lineHeight: 0.9, letterSpacing: -4, fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>2</div>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(22), color: p.inkSoft, fontStyle: 'italic' }}>waves ridden</div>
        </div>
        <div style={{ display: 'flex', gap: fs(24), marginTop: fs(20) }}>
          {[['Streak','2','days'],['Success','67','%']].map(([k,v,u],i)=>(
            <React.Fragment key={i}>
              {i>0 && <div style={{ width: 0.5, background: p.line }}/>}
              <div>
                <div style={{ fontSize: fs(11), letterSpacing: 2, color: p.mute, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(26), marginTop: fs(2), fontVariantNumeric: 'tabular-nums' }}>{v}<span style={{ fontSize: fs(13), color: p.mute }}>{u}</span></div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* urge selector chips */}
      <div style={{ position: 'absolute', top: fs(440), left: fs(24), right: fs(24), display: 'flex', gap: fs(8), flexWrap: 'wrap' }}>
        {[
          { e: '🚬', l: 'Cigarette', on: true  },
          { e: '☕', l: 'Coffee',    on: false },
          { e: '🔞', l: 'Porn',      on: false },
        ].map((c, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: fs(7),
            padding: `${fs(9)}px ${fs(15)}px`, borderRadius: fs(999),
            background: c.on ? p.ink : 'transparent',
            color: c.on ? p.sand : p.ink,
            border: c.on ? 'none' : `0.5px solid ${p.lineStr}`,
            fontSize: fs(13.5), fontWeight: 500,
          }}>
            <span style={{ fontSize: fs(14) }}>{c.e}</span>
            <span>{c.l}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: fs(510), left: fs(24), right: fs(24), height: fs(54), borderRadius: fs(14), background: p.kelp, color: p.sand, fontSize: fs(16), fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -0.2 }}>Start a surf →</div>

      <div style={{ position: 'absolute', top: fs(590), left: fs(24), right: fs(24) }}>
        <div style={{ fontSize: fs(11), letterSpacing: 2.5, color: p.mute, textTransform: 'uppercase', marginBottom: fs(14) }}>Recent</div>
        {[['09:40','🚬','Rode 5:00'],['Yesterday','☕','Rode 3:00']].map(([t,e,r],i)=>(
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: fs(12), padding: `${fs(11)}px 0`, borderTop: i ? `0.5px solid ${p.line}` : 'none' }}>
            <div style={{ fontSize: fs(11), color: p.mute, width: fs(80), fontVariantNumeric: 'tabular-nums' }}>{t}</div>
            <div style={{ fontSize: fs(20) }}>{e}</div>
            <div style={{ fontSize: fs(13), flex: 1 }}>{r}</div>
            <div style={{ width: fs(6), height: fs(6), borderRadius: fs(3), background: p.kelp }}/>
          </div>
        ))}
      </div>
      <LSTabBar p={p} scale={scale} active="home"/>
    </div>
  );
}

function LSTimerScreen({ urgeId, remaining, theme, width }) {
  const p = LS_PALETTE[theme];
  const u = LS_URGES[urgeId] || LS_URGES.cig;
  const scale = width / 402;
  const fs = (n) => n * scale;
  const total = 300;
  const progress = 1 - (remaining / total);
  const R = 140 * scale, C = 2 * Math.PI * R;
  const m = Math.floor(remaining/60), s = remaining%60;
  return (
    <div style={{ position: 'absolute', inset: 0, background: p.sand, color: p.ink, fontFamily: '-apple-system, system-ui, sans-serif' }}>
      <LSStatusBar p={p} scale={scale}/>
      <div style={{ position: 'absolute', top: fs(62), left: fs(24), right: fs(24), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <svg width={fs(22)} height={fs(22)} viewBox="0 0 24 24" fill="none" stroke={p.mute} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        <div style={{ fontSize: fs(11), letterSpacing: 2.5, color: p.mute, textTransform: 'uppercase' }}>{u.emoji} Surfing</div>
        <div style={{ width: fs(22) }}/>
      </div>
      <div style={{ position: 'absolute', top: fs(140), left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <svg width={(R+10*scale)*2} height={(R+10*scale)*2} style={{ display: 'block' }}>
          <circle cx={R+10*scale} cy={R+10*scale} r={R} fill="none" stroke={p.line} strokeWidth={1*scale}/>
          <circle cx={R+10*scale} cy={R+10*scale} r={R} fill="none" stroke={p.kelp} strokeWidth={2.5*scale} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C*(1-progress)} transform={`rotate(-90 ${R+10*scale} ${R+10*scale})`}/>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(82), fontWeight: 300, letterSpacing: -3, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {m}:{String(s).padStart(2,'0')}
          </div>
          <div style={{ fontSize: fs(11), letterSpacing: 2.5, color: p.mute, textTransform: 'uppercase', marginTop: fs(8) }}>Remaining</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: fs(500), left: fs(24), right: fs(24), textAlign: 'center' }}>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(22), fontStyle: 'italic', color: p.inkSoft, lineHeight: 1.3 }}>
          Breathe in — the wave is cresting.
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: fs(48), left: fs(24), right: fs(24), display: 'flex', flexDirection: 'column', gap: fs(10) }}>
        <div style={{ height: fs(46), borderRadius: fs(12), background: p.ink, color: p.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(14), fontWeight: 500 }}>✓ Surfed it</div>
        <div style={{ height: fs(46), borderRadius: fs(12), border: `0.5px solid ${p.lineStr}`, color: p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(14) }}>I caved</div>
      </div>
    </div>
  );
}

function LSSuccessScreen({ urgeId, theme, width }) {
  const p = LS_PALETTE[theme];
  const u = LS_URGES[urgeId] || LS_URGES.cig;
  const scale = width / 402;
  const fs = (n) => n * scale;
  return (
    <div style={{ position: 'absolute', inset: 0, background: p.sand, color: p.ink, fontFamily: '-apple-system, system-ui, sans-serif' }}>
      <LSStatusBar p={p} scale={scale}/>
      <div style={{ position: 'absolute', top: fs(120), left: fs(24), right: fs(24), textAlign: 'center' }}>
        <div style={{ fontSize: fs(48) }}>{u.emoji}</div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(56), fontWeight: 300, letterSpacing: -1.6, lineHeight: 1, marginTop: fs(20) }}>
          You<br/><em style={{ fontStyle: 'italic', color: p.kelp }}>rode it.</em>
        </div>
        <div style={{ fontSize: fs(15), color: p.inkSoft, marginTop: fs(20), lineHeight: 1.5 }}>
          5:00 of {u.label.toLowerCase()} craving — gone.<br/>That wave will never come again.
        </div>
      </div>
      <div style={{ position: 'absolute', top: fs(420), left: fs(24), right: fs(24), padding: fs(20), borderRadius: fs(14), background: p.sandDim }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: fs(10), letterSpacing: 2, color: p.mute, textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(34), fontWeight: 300, marginTop: fs(2), fontVariantNumeric: 'tabular-nums' }}>13<span style={{ fontSize: fs(15), color: p.mute }}>d</span></div>
          </div>
          <div>
            <div style={{ fontSize: fs(10), letterSpacing: 2, color: p.mute, textTransform: 'uppercase' }}>Wave</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(34), fontWeight: 300, marginTop: fs(2), fontVariantNumeric: 'tabular-nums' }}>#35</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: fs(48), left: fs(24), right: fs(24), display: 'flex', flexDirection: 'column', gap: fs(10) }}>
        <div style={{ height: fs(54), borderRadius: fs(14), background: p.ink, color: p.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 500, gap: fs(8) }}>📷 Victory selfie</div>
        <div style={{ height: fs(52), borderRadius: fs(14), border: `0.5px solid ${p.lineStr}`, color: p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(15) }}>Done</div>
      </div>
    </div>
  );
}

function LSPickerScreen({ theme, width }) {
  const p = LS_PALETTE[theme];
  const scale = width / 402;
  const fs = (n) => n * scale;
  const items = [['🚬','Cigarette',true],['☕','Coffee',false],['📱','Social',false],['🍩','Sugar',false],['🍷','Alcohol',false],['🌿','Weed',false]];
  return (
    <div style={{ position: 'absolute', inset: 0, background: p.sand, color: p.ink, fontFamily: '-apple-system, system-ui, sans-serif' }}>
      <LSStatusBar p={p} scale={scale}/>
      <div style={{ position: 'absolute', top: fs(120), left: fs(24), right: fs(24) }}>
        <div style={{ fontSize: fs(11), letterSpacing: 2.5, color: p.mute, textTransform: 'uppercase' }}>What are you</div>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(42), fontWeight: 300, letterSpacing: -1.2, lineHeight: 1.05, marginTop: fs(8) }}>
          riding<br/><em style={{ fontStyle: 'italic', color: p.kelp }}>right now?</em>
        </div>
      </div>
      <div style={{ position: 'absolute', top: fs(280), left: fs(24), right: fs(24), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: fs(8) }}>
        {items.map(([e,l,on],i)=>(
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: fs(10), padding: `${fs(12)}px ${fs(12)}px`, borderRadius: fs(12), background: on ? p.ink : p.sandDim, color: on ? p.sand : p.ink }}>
            <div style={{ fontSize: fs(20) }}>{e}</div>
            <div style={{ flex: 1, fontSize: fs(14), fontWeight: 500 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: fs(48), left: fs(24), right: fs(24) }}>
        <div style={{ height: fs(54), borderRadius: fs(14), background: p.kelp, color: p.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(16), fontWeight: 500 }}>Begin →</div>
      </div>
    </div>
  );
}

Object.assign(window, { LSPhone, LS_PALETTE });
