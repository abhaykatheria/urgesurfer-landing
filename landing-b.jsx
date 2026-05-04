// landing-b.jsx — Direction B: Bold Conversion
// Dark hero. Massive €9,99. Punchy CTA-first. Comparison front-loaded.

// Palette mirrors proto-b.jsx PB_PALETTES (sand/ink/kelp/coral) so the
// landing site lives in the same world as the app. Variables are set on
// the .lb-root wrapper based on a theme attribute; the toggle flips it.
const LB_PALETTES = {
  light: {
    '--lb-bg':         '#F4EFE6',
    '--lb-bg2':        '#EBE4D5',
    '--lb-surface':    '#FFFFFF',
    '--lb-ink':        '#1F2A2E',
    '--lb-inkDim':     'rgba(31,42,46,0.72)',
    '--lb-inkMute':    'rgba(31,42,46,0.5)',
    '--lb-line':       'rgba(31,42,46,0.1)',
    '--lb-lineStr':    'rgba(31,42,46,0.2)',
    '--lb-coral':      '#2F6E87',
    '--lb-coralAlt':   '#4A8DA8',
    '--lb-coralA10':   'rgba(47,110,135,0.10)',
    '--lb-coralA12':   'rgba(47,110,135,0.12)',
    '--lb-coralA18':   'rgba(47,110,135,0.18)',
    '--lb-coralA20':   'rgba(47,110,135,0.20)',
    '--lb-coralA30':   'rgba(47,110,135,0.30)',
    '--lb-coralA35':   'rgba(47,110,135,0.35)',
    '--lb-kelp':       '#4A6B6E',
    '--lb-sand':       '#F4EFE6',
    '--lb-sandDim':    '#EBE4D5',
    '--lb-ink2':       '#1F2A2E',
    '--lb-navBg':      'rgba(244,239,230,0.85)',
  },
  dark: {
    '--lb-bg':         '#0F1517',
    '--lb-bg2':        '#161E22',
    '--lb-surface':    '#1C2528',
    '--lb-ink':        '#F4EFE6',
    '--lb-inkDim':     'rgba(244,239,230,0.7)',
    '--lb-inkMute':    'rgba(244,239,230,0.45)',
    '--lb-line':       'rgba(244,239,230,0.08)',
    '--lb-lineStr':    'rgba(244,239,230,0.16)',
    '--lb-coral':      '#7BB5D1',
    '--lb-coralAlt':   '#9FCEE6',
    '--lb-coralA10':   'rgba(123,181,209,0.12)',
    '--lb-coralA12':   'rgba(123,181,209,0.14)',
    '--lb-coralA18':   'rgba(123,181,209,0.20)',
    '--lb-coralA20':   'rgba(123,181,209,0.22)',
    '--lb-coralA30':   'rgba(123,181,209,0.32)',
    '--lb-coralA35':   'rgba(123,181,209,0.38)',
    '--lb-kelp':       '#7BA3A6',
    '--lb-sand':       '#F4EFE6',
    '--lb-sandDim':    '#EBE4D5',
    '--lb-ink2':       '#1F2A2E',
    '--lb-navBg':      'rgba(11,20,23,0.85)',
  },
};

function lbApplyTheme(el, theme) {
  if (!el) return;
  const vars = LB_PALETTES[theme] || LB_PALETTES.dark;
  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
  el.setAttribute('data-theme', theme);
}

const LBtheme = {
  bg:          'var(--lb-bg)',
  bg2:         'var(--lb-bg2)',
  surface:     'var(--lb-surface)',
  ink:         'var(--lb-ink)',
  inkDim:      'var(--lb-inkDim)',
  inkMute:     'var(--lb-inkMute)',
  line:        'var(--lb-line)',
  lineStr:     'var(--lb-lineStr)',
  coral:       'var(--lb-coral)',
  coralAlt:    'var(--lb-coralAlt)',
  coralBright: 'var(--lb-coralAlt)',
  coralA10:    'var(--lb-coralA10)',
  coralA12:    'var(--lb-coralA12)',
  coralA18:    'var(--lb-coralA18)',
  coralA20:    'var(--lb-coralA20)',
  coralA30:    'var(--lb-coralA30)',
  coralA35:    'var(--lb-coralA35)',
  kelp:        'var(--lb-kelp)',
  sand:        'var(--lb-sand)',
  sandDim:     'var(--lb-sandDim)',
  ink2:        'var(--lb-ink2)',
  navBg:       'var(--lb-navBg)',
};

const LBdisplay = '"Fraunces", Georgia, serif';
const LBgrotesk = '"Inter Tight", -apple-system, system-ui, sans-serif';
const LBmono    = '"JetBrains Mono", "SF Mono", ui-monospace, monospace';

function LBSection({ children, bg = LBtheme.bg, py = 120, style = {}, ...rest }) {
  return (
    <section className="lb-section" data-py {...rest} style={{ padding: `${py}px 60px`, background: bg, ...style }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function LBTag({ children, color = LBtheme.coral }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: LBtheme.coralA12, color, fontFamily: LBmono, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: color }}/>
      {children}
    </div>
  );
}

// ── Sticky nav ──────────────────────────────────────────────
function LBThemeToggle() {
  const { theme, toggleTheme } = React.useContext(LBThemeCtx);
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="lb-theme-toggle"
      style={{
        width: 36, height: 36, borderRadius: 18,
        background: 'transparent',
        border: `1px solid ${LBtheme.lineStr}`,
        color: LBtheme.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0,
      }}
    >
      <div style={{ position: 'relative', width: 18, height: 18 }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .35s cubic-bezier(.4,.0,.2,1), opacity .25s', transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.6)', opacity: theme === 'light' ? 1 : 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .35s cubic-bezier(.4,.0,.2,1), opacity .25s', transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.6)', opacity: theme === 'dark' ? 1 : 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
      </div>
    </button>
  );
}

function LBNav() {
  return (
    <nav className="lb-nav" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '18px 60px', background: LBtheme.navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${LBtheme.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background .35s ease, border-color .35s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: LBtheme.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="8" viewBox="0 0 60 10" fill="none" stroke={LBtheme.bg} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"><path d="M0 5 Q 7.5 0, 15 5 T 30 5 T 45 5 T 60 5"/></svg>
        </div>
        <div style={{ fontFamily: LBgrotesk, fontSize: 16, fontWeight: 600, color: LBtheme.ink, letterSpacing: -0.3 }}>Urge Surfer</div>
      </div>
      <div className="lb-nav-links" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {['Pricing', 'Privacy', 'How', 'Science', 'FAQ'].map(l => (
          <a key={l} className="lb-nav-link" href={`#${l.toLowerCase()}`} style={{ fontFamily: LBgrotesk, fontSize: 13.5, color: LBtheme.inkDim, textDecoration: 'none', fontWeight: 500 }}>{l}</a>
        ))}
        <a className="lb-nav-github" href="https://github.com/abhaykatheria/urgesurfer" target="_blank" rel="noopener" aria-label="View source on GitHub" style={{ width: 36, height: 36, borderRadius: 18, background: 'transparent', border: `1px solid ${LBtheme.lineStr}`, color: LBtheme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
        </a>
        <LBThemeToggle/>
        <a href="Urge Surfer Prototype.html" style={{ fontFamily: LBgrotesk, fontSize: 13.5, color: LBtheme.inkDim, textDecoration: 'none', fontWeight: 500 }}>Try demo</a>
        <a className="lb-nav-cta" href="#buy" style={{ fontFamily: LBgrotesk, fontSize: 13.5, fontWeight: 600, padding: '10px 18px', background: LBtheme.coral, color: LBtheme.bg, borderRadius: 999, textDecoration: 'none' }}>Get the app</a>
      </div>
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────
function LBHero() {
  const { theme } = React.useContext(LBThemeCtx);
  return (
    <section className="lb-hero-section" style={{ background: LBtheme.bg, padding: '60px 60px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 100, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,181,209,0.18), transparent 65%)', filter: 'blur(40px)' }}/>
      <div className="lb-grid-2" style={{ maxWidth: 1280, margin: '0 auto', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center', minHeight: 600, paddingBottom: 40 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <LBTag>Now on App Store</LBTag>
          <h1 className="lb-hero-h1" style={{
            fontFamily: LBgrotesk, fontSize: 'clamp(56px, 7.5vw, 104px)', fontWeight: 700, lineHeight: 1.0,
            letterSpacing: -3, color: LBtheme.ink, margin: '24px 0 0',
          }}>
            Quit anything<br/>
            <span style={{ background: 'linear-gradient(90deg, var(--lb-coralAlt), var(--lb-coral))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>in 5 minutes.</span>
          </h1>
          <h2 style={{ fontFamily: LBdisplay, fontSize: 28, fontWeight: 300, fontStyle: 'italic', color: LBtheme.kelp, marginTop: 8, letterSpacing: -0.5 }}>
            One wave at a time.
          </h2>
          <p style={{ fontFamily: LBgrotesk, fontSize: 19, lineHeight: 1.5, color: LBtheme.inkDim, maxWidth: 540, marginTop: 36, fontWeight: 400 }}>
            Cigarettes. Coffee. Doomscrolling. Sugar. The science is clear: cravings peak in 3–5 minutes, then fall. Urge Surfer is the smallest possible app to help you sit through them.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <a href="#buy" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '20px 32px', background: LBtheme.coral, color: LBtheme.bg,
              borderRadius: 14, textDecoration: 'none', fontFamily: LBgrotesk,
              fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
              boxShadow: '0 12px 32px var(--lb-coralA35)',
            }}>
              <LBAppleIcon/> Buy on App Store — €9,99
            </a>
            <a href="Urge Surfer Prototype.html" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '19px 26px', background: 'transparent', color: LBtheme.ink,
              border: `1.5px solid ${LBtheme.line}`,
              borderRadius: 14, textDecoration: 'none', fontFamily: LBgrotesk,
              fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
            }}>
              Try the demo <span style={{ fontSize: 18, lineHeight: 1, transform: 'translateY(-1px)' }}>→</span>
            </a>
            <div style={{ fontFamily: LBgrotesk, fontSize: 13, color: LBtheme.inkMute, lineHeight: 1.4 }}>
              One time.<br/>No subscription. Ever.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <LBPhoneSlideshow width={340} theme={theme}/>
        </div>
      </div>

      {/* ticker bar — marquee */}
      <div className="lb-ticker" style={{ marginTop: 80, padding: '24px 0', borderTop: `1px solid ${LBtheme.line}`, borderBottom: `1px solid ${LBtheme.line}`, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 120, background: `linear-gradient(90deg, ${LBtheme.bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 120, background: `linear-gradient(270deg, ${LBtheme.bg}, transparent)`, zIndex: 2, pointerEvents: 'none' }}/>
        <div className="lb-marquee-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="lb-marquee-row" aria-hidden={dup === 1}>
              {[
                '🚬 Cigarettes', '☕ Caffeine', '📱 Doomscrolling', '🍩 Sugar', '🍷 Alcohol',
                '🌿 Cannabis', '🍕 Snacking', '🛒 Shopping', '🎰 Gambling', '🎮 Gaming',
                '📺 Binge-watching', '🍫 Chocolate', '🥤 Soda', '💊 Pills', '🍺 Beer',
                '🍔 Fast food', '🤳 Selfies', '💬 Texting', '🎵 TikTok', '📰 News',
                '🛍️ Online shopping', '☕️ Energy drinks', '🍦 Ice cream', '🍪 Cookies',
                '🥃 Whiskey', '🚗 Driving angry', '😤 Lashing out', '💸 Doomspending',
              ].map(t => (
                <span key={t + dup} style={{ fontFamily: LBgrotesk, fontSize: 16, color: LBtheme.inkDim, fontWeight: 500, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 56 }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Phone Slideshow ─────────────────────────────────────────
function LBPhoneSlideshow({ width = 360, theme }) {
  const slides = [
    { screen: 'home',    label: 'Home',          step: '01' },
    { screen: 'picker',  label: 'Pick your urge', step: '02' },
    { screen: 'timer',   label: 'Surf the wave',  step: '03', remaining: 247 },
    { screen: 'timer',   label: '...keep riding', step: '03', remaining: 92 },
    { screen: 'success', label: 'You outlasted it', step: '04' },
  ];
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 1900);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ position: 'relative', width, height: width * 2.05 }}>
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: i === idx ? 'auto' : 'none',
            }}
          >
            <LSPhone width={width} screen={s.screen} remaining={s.remaining} theme={theme}/>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontFamily: LBmono, fontSize: 11, color: LBtheme.coral, letterSpacing: 1.6, fontWeight: 600 }}>
          {slides[idx].step}
        </div>
        <div style={{ fontFamily: LBgrotesk, fontSize: 13.5, color: LBtheme.ink, fontWeight: 500, minWidth: 160, textAlign: 'left' }}>
          {slides[idx].label}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to step ${i + 1}`}
            style={{
              width: i === idx ? 28 : 8, height: 4, borderRadius: 2,
              background: i === idx ? LBtheme.coral : LBtheme.lineStr,
              border: 'none', padding: 0, cursor: 'pointer',
              transition: 'width 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function LBAppleIcon() {
  return <svg width="18" height="20" viewBox="0 0 16 18" fill="currentColor"><path d="M11.6 9.6c0-2 1.6-2.9 1.7-3-1-1.3-2.4-1.5-2.9-1.5-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7C3.3 5.2 1.9 6 1 7.4c-1.4 2.4-.4 6 1 8 .7.9 1.5 2 2.6 2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.2-2.3-.1 0-2.2-.8-2.2-3.4zM10 3.6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z"/></svg>;
}

// ── Pricing comparison (front-loaded) ───────────────────────
function LBPricing() {
  return (
    <LBSection bg={LBtheme.bg} py={140}>
      <div id="pricing" style={{ textAlign: 'center', marginBottom: 80 }}>
        <LBTag color={LBtheme.kelp}>The deal</LBTag>
        <h2 className="lb-mega-h2" style={{ fontFamily: LBgrotesk, fontSize: 80, fontWeight: 700, letterSpacing: -3, lineHeight: 0.95, color: LBtheme.ink, marginTop: 28 }}>
          €9,99 once.<br/><span style={{ color: LBtheme.coral }}>No subscription. Ever.</span>
        </h2>
        <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.5, color: LBtheme.inkDim, marginTop: 28, maxWidth: 580, margin: '28px auto 0' }}>
          Every wellness app is a subscription now. We refused. Pay once, the app is yours, free updates forever.
        </p>
      </div>

      <div className="lb-pricing-card" style={{ maxWidth: 720, margin: '0 auto', padding: 48, borderRadius: 24, background: 'linear-gradient(180deg, rgba(123,181,209,0.18), var(--lb-coralA10))', border: `1px solid ${LBtheme.coral}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'var(--lb-coralA20)', filter: 'blur(30px)' }}/>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <div className="lb-mega-num" style={{ fontFamily: LBgrotesk, fontSize: 132, fontWeight: 700, color: LBtheme.coral, letterSpacing: -5, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>€9,99</div>
            <div style={{ fontFamily: LBdisplay, fontSize: 38, fontStyle: 'italic', fontWeight: 300, color: LBtheme.kelp }}>once.</div>
          </div>
          <div className="lb-feat-grid-2" style={{ marginTop: 28, gap: 14, textAlign: 'left', maxWidth: 520, margin: '28px auto 0' }}>
            {[
              'All features included',
              'Free updates forever',
              'Works offline',
              'On-device. Nothing leaves your phone.',
              'No ads. No tracking.',
              'No premium tier. Ever.',
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: LBgrotesk, fontSize: 14.5, color: LBtheme.inkDim }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={LBtheme.coral} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5 11-12"/></svg>
                {t}
              </div>
            ))}
          </div>
          <a href="#buy" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 36,
            padding: '20px 36px', background: LBtheme.coral, color: LBtheme.bg,
            borderRadius: 14, textDecoration: 'none', fontFamily: LBgrotesk,
            fontSize: 16, fontWeight: 600, boxShadow: '0 12px 32px var(--lb-coralA30)',
          }}>
            <LBAppleIcon/> Buy on App Store — €9,99
          </a>
        </div>
      </div>
    </LBSection>
  );
}

// ── How ─────────────────────────────────────────────────────
function LBHow() {
  const steps = [
    { n: '01', t: 'Tap what you crave', d: 'Cigarette, scroll, snack — anything. Pick from presets or add your own urge.', emoji: '🚬' },
    { n: '02', t: 'Surf the wave', d: 'A 5-minute timer with breath prompts. Your urge will peak, then fall. Just stay with it.', emoji: '🌊' },
    { n: '03', t: 'Mark the win', d: 'Log it. Take a victory selfie if you want. Watch your streak grow.', emoji: '✓' },
  ];
  return (
    <LBSection id="how" bg={LBtheme.bg2} py={140}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <LBTag color={LBtheme.kelp}>Three taps to ride</LBTag>
        <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 64, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
          Designed to disappear<br/>when you need it most.
        </h2>
      </div>
      <div className="lb-grid-3" style={{ gap: 24 }}>
        {steps.map((step, i) => (
          <div key={i} className="lb-step-card" style={{ padding: 36, borderRadius: 20, background: LBtheme.surface, border: `1px solid ${LBtheme.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: LBmono, fontSize: 12, color: LBtheme.coral, letterSpacing: 1, fontWeight: 600 }}>{step.n}</div>
              <div style={{ fontSize: 28 }}>{step.emoji}</div>
            </div>
            <h3 style={{ fontFamily: LBgrotesk, fontSize: 28, fontWeight: 700, letterSpacing: -1, color: LBtheme.ink, marginTop: 28, marginBottom: 0, lineHeight: 1.1 }}>{step.t}</h3>
            <p style={{ fontFamily: LBgrotesk, fontSize: 15, lineHeight: 1.55, color: LBtheme.inkDim, marginTop: 14 }}>{step.d}</p>
          </div>
        ))}
      </div>
    </LBSection>
  );
}

// ── Science ─────────────────────────────────────────────────
function LBScience() {
  // Build a curve to illustrate craving over time
  return (
    <LBSection id="science" bg={LBtheme.bg} py={140}>
      <div className="lb-grid-2" style={{ gap: 80, alignItems: 'center' }}>
        <div>
          <LBTag color={LBtheme.kelp}>A 40-year-old technique</LBTag>
          <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 64, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
            Urge surfing isn't<br/>a TikTok trend.<br/><span style={{ color: LBtheme.coral }}>It's clinical psychology.</span>
          </h2>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 24 }}>
            In 1985, addiction researcher Alan Marlatt mapped the curve: urges rise sharply, peak in 3–5 minutes, then fall. Forty years and a thousand studies later, the technique still holds — a 2009 follow-up trial showed a <strong style={{ color: LBtheme.ink, fontWeight: 700 }}>40% reduction in smoking urges</strong> for people who learned to ride the wave instead of suppress it.
          </p>
          <div className="lb-stat-grid-2" style={{ marginTop: 36, gap: 12 }}>
            {[
              ['40%', 'fewer smoking urges'],
              ['3–5 min', 'wave duration'],
              ['1985', 'first published'],
              ['1k+', 'studies since'],
            ].map(([k, v], i) => (
              <div key={i} style={{ padding: 18, borderRadius: 12, background: LBtheme.surface, border: `1px solid ${LBtheme.line}` }}>
                <div style={{ fontFamily: LBgrotesk, fontSize: 26, fontWeight: 700, color: LBtheme.coral, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums' }}>{k}</div>
                <div style={{ fontFamily: LBgrotesk, fontSize: 12.5, color: LBtheme.inkMute, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 32, borderRadius: 24, background: LBtheme.surface, border: `1px solid ${LBtheme.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: LBmono, fontSize: 11, color: LBtheme.inkMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>Craving intensity over time</div>
            <div style={{ display: 'flex', gap: 14, fontFamily: LBmono, fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: LBtheme.coral }}><span style={{ width: 10, height: 2, background: LBtheme.coral }}/> The wave</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: LBtheme.kelp }}><span style={{ width: 10, height: 2, background: LBtheme.kelp, borderTop: `2px dashed ${LBtheme.kelp}`, borderTopColor: LBtheme.kelp }}/> You</div>
            </div>
          </div>
          <svg viewBox="0 0 400 240" width="100%" height={280}>
            <defs>
              <linearGradient id="curvegrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={LBtheme.coral} stopOpacity="0.4"/>
                <stop offset="100%" stopColor={LBtheme.coral} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* axes */}
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="40" x2="380" y1={40 + i*40} y2={40 + i*40} stroke={LBtheme.line} strokeWidth="1"/>
            ))}
            <path d="M 40 200 Q 110 200, 140 100 T 240 60 T 380 200" fill="url(#curvegrad)"/>
            <path d="M 40 200 Q 110 200, 140 100 T 240 60 T 380 200" stroke={LBtheme.coral} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* "you" stay flat */}
            <path d="M 40 210 L 380 210" stroke={LBtheme.kelp} strokeWidth="2" strokeDasharray="4 4" fill="none"/>
            {/* peak marker */}
            <circle cx="200" cy="70" r="5" fill={LBtheme.coral}/>
            <line x1="200" y1="70" x2="200" y2="40" stroke={LBtheme.coral} strokeWidth="1" strokeDasharray="2 3"/>
            <text x="200" y="34" textAnchor="middle" fontSize="10" fill={LBtheme.coral} fontFamily={LBmono} fontWeight="600">PEAK · 3:30</text>
            {/* x labels */}
            {[['0:00',40],['2:30',150],['5:00',280],['7:30',380]].map(([t,x],i)=>(
              <text key={i} x={x} y="222" textAnchor="middle" fontSize="10" fill={LBtheme.inkMute} fontFamily={LBmono}>{t}</text>
            ))}
            <text x="40" y="48" fontSize="10" fill={LBtheme.inkMute} fontFamily={LBmono}>HIGH</text>
            <text x="40" y="200" fontSize="10" fill={LBtheme.inkMute} fontFamily={LBmono}>LOW</text>
          </svg>
          <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: LBtheme.bg, fontFamily: LBgrotesk, fontSize: 13, color: LBtheme.inkDim, lineHeight: 1.55, fontStyle: 'italic' }}>
            "The wave will pass on its own. You don't have to do anything but watch." — Marlatt &amp; Gordon, 1985
          </div>
        </div>
      </div>
    </LBSection>
  );
}

// ── Share progress ──────────────────────────────────────────
// Strava-style: after a ridden wave the app lets you pick a photo
// and slap a stats overlay on it. Five overlay styles. Composite is
// rendered on-device, then handed to the system share sheet — never
// transits our servers, so the privacy story still holds.
function LBSharePhone({ width = 340, theme }) {
  const p = LS_PALETTE[theme];
  const scale = width / 402;
  const fs = (n) => n * scale;
  const inkOnPhoto = '#F4EFE6';
  const overlayBg  = '#0F1517';

  // Abstract glyphs for each overlay style. Real overlays in-app
  // would be text; at this rendered size text becomes unreadable,
  // so we suggest each style's character with a simple shape.
  const tiles = [
    { name: 'Minimal',  dark: false, glyph: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs(2) }}>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: fs(20), fontWeight: 300, lineHeight: 1, color: p.ink }}>2d</div>
        <div style={{ width: fs(16), height: 0.5, background: p.lineStr }}/>
      </div>
    )},
    { name: 'Strava',   dark: true,  glyph: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: fs(3), width: '70%' }}>
        {[0.9, 0.65, 0.45].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: fs(3) }}>
            <span style={{ width: fs(2.5), height: fs(2.5), borderRadius: '50%', background: '#7BA3A6', flexShrink: 0 }}/>
            <span style={{ flex: 1, height: fs(1.5), borderRadius: 1, background: p.sand, opacity: 0.85, transform: `scaleX(${w})`, transformOrigin: 'left' }}/>
          </div>
        ))}
      </div>
    )},
    { name: 'Ticker',   dark: true,  selected: true, glyph: (
      <div style={{ width: '85%', display: 'flex', alignItems: 'center', gap: fs(3) }}>
        <span style={{ width: fs(3), height: fs(3), borderRadius: '50%', background: '#7BA3A6', flexShrink: 0 }}/>
        <span style={{ flex: 1, height: fs(1.5), borderRadius: 1, background: p.sand, opacity: 0.85 }}/>
      </div>
    )},
    { name: 'Polaroid', dark: false, glyph: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs(3) }}>
        <svg width={fs(22)} height={fs(8)} viewBox="0 0 60 10" fill="none" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"><path d="M0 5 Q 7.5 0, 15 5 T 30 5 T 45 5 T 60 5"/></svg>
        <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontStyle: 'italic', fontSize: fs(7), color: p.ink, opacity: 0.75 }}>cig-free</div>
      </div>
    )},
    { name: 'Receipt',  dark: false, glyph: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: fs(2.5), width: '78%', alignItems: 'stretch' }}>
        <div style={{ height: fs(1), borderTop: `1px dashed ${p.ink}`, opacity: 0.55 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: fs(3) }}>
          <span style={{ flex: 0.55, height: fs(1.5), background: p.ink, opacity: 0.7, borderRadius: 1 }}/>
          <span style={{ flex: 0.25, height: fs(1.5), background: p.ink, opacity: 0.7, borderRadius: 1 }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: fs(3) }}>
          <span style={{ flex: 0.4, height: fs(1.5), background: p.ink, opacity: 0.7, borderRadius: 1 }}/>
          <span style={{ flex: 0.3, height: fs(1.5), background: p.ink, opacity: 0.7, borderRadius: 1 }}/>
        </div>
        <div style={{ height: fs(1), borderTop: `1px dashed ${p.ink}`, opacity: 0.55 }}/>
      </div>
    )},
  ];

  return (
    <div style={{ width, position: 'relative' }}>
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
          background: p.sand, color: p.ink,
          fontFamily: '-apple-system, system-ui, sans-serif',
        }}>
          <LSStatusBar p={p} scale={scale}/>

          <div style={{ position: 'absolute', top: fs(56), left: fs(18), right: fs(18), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <svg width={fs(20)} height={fs(20)} viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            <div style={{ fontSize: fs(15), fontWeight: 600 }}>Share</div>
            <div style={{ fontSize: fs(14), color: p.kelp, fontWeight: 500 }}>Post</div>
          </div>

          <div style={{ position: 'absolute', top: fs(98), left: fs(18), right: fs(18), height: fs(440), borderRadius: fs(10), overflow: 'hidden' }}>
            <svg viewBox="0 0 100 110" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id={`lb-share-sky-${theme}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFC07A"/>
                  <stop offset="35%" stopColor="#E48864"/>
                  <stop offset="65%" stopColor="#7B6B70"/>
                  <stop offset="100%" stopColor="#2F4A4D"/>
                </linearGradient>
                <radialGradient id={`lb-share-sun-${theme}`} cx="50%" cy="40%" r="22%">
                  <stop offset="0%" stopColor="#FFE9C0" stopOpacity="0.95"/>
                  <stop offset="100%" stopColor="#FFE9C0" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect width="100" height="110" fill={`url(#lb-share-sky-${theme})`}/>
              <circle cx="50" cy="42" r="6.5" fill="#FFE9C0" opacity="0.92"/>
              <rect width="100" height="110" fill={`url(#lb-share-sun-${theme})`}/>
              <path d="M0 78 Q 14 72 28 76 T 56 74 T 84 77 T 100 75 L 100 110 L 0 110 Z" fill="#1F2A2E" opacity="0.7"/>
              <path d="M0 86 Q 18 81 36 84 T 72 83 T 100 86 L 100 110 L 0 110 Z" fill="#0F1517" opacity="0.92"/>
              <path d="M0 94 Q 20 90 40 92 T 80 92 T 100 94 L 100 110 L 0 110 Z" fill="#070C0E"/>
            </svg>
            <div style={{
              position: 'absolute', bottom: fs(14), left: fs(12), right: fs(12),
              padding: `${fs(9)}px ${fs(12)}px`,
              borderRadius: fs(6),
              background: overlayBg, color: inkOnPhoto,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: fs(10), letterSpacing: 0.6, lineHeight: 1.3,
              display: 'flex', alignItems: 'center', gap: fs(7),
            }}>
              <span style={{ width: fs(5), height: fs(5), borderRadius: '50%', background: '#7BA3A6', flexShrink: 0 }}/>
              <span>CIG-FREE 13D · WAVE #35 · RODE 5:00</span>
            </div>
          </div>

          <div style={{ position: 'absolute', top: fs(560), left: fs(20), fontSize: fs(10), letterSpacing: 2.2, color: p.mute, textTransform: 'uppercase', fontWeight: 500 }}>Overlay</div>

          <div style={{ position: 'absolute', top: fs(584), left: fs(18), right: fs(18), display: 'flex', gap: fs(7), justifyContent: 'space-between' }}>
            {tiles.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs(6) }}>
                <div style={{
                  width: '100%', aspectRatio: '1 / 1.05', borderRadius: fs(8),
                  background: t.dark ? p.ink : p.sandDim,
                  border: t.selected ? `1.5px solid ${p.ink}` : `0.5px solid ${p.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: fs(6), boxSizing: 'border-box', overflow: 'hidden',
                }}>
                  {t.glyph}
                </div>
                <div style={{ fontSize: fs(10), color: p.ink, fontWeight: t.selected ? 600 : 400 }}>{t.name}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: fs(38), left: fs(18), right: fs(18), height: fs(54), borderRadius: fs(14), background: p.ink, color: p.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fs(8), fontSize: fs(15), fontWeight: 500 }}>
            <svg width={fs(16)} height={fs(16)} viewBox="0 0 24 24" fill="none" stroke={p.sand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M5 11l7-7 7 7"/><path d="M5 21h14"/></svg>
            Share
          </div>
        </div>

        <div style={{
          position: 'absolute', top: width * 0.04, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.27, height: width * 0.025, borderRadius: width * 0.025, background: '#000', zIndex: 5,
        }}/>
      </div>
    </div>
  );
}

function LBShare() {
  const { theme } = React.useContext(LBThemeCtx);
  const points = [
    { t: 'Pick any photo',      d: 'Selfie, sunset, your dog — anything from your camera roll. Or a clean color block if you want minimal.' },
    { t: 'Five overlay styles', d: 'Minimal, Strava, Ticker, Polaroid, Receipt. Tap to switch. Light or dark. Show or hide any stat.' },
    { t: 'Renders on-device',   d: "The composite is built on your phone. Nothing uploads to us — you drop the finished image into the share sheet yourself." },
    { t: 'Bring people in',     d: 'Group chat, Story, feed, fridge. Public accountability is the fastest streak insurance there is.' },
  ];
  return (
    <LBSection id="share" bg={LBtheme.bg2} py={140}>
      <div className="lb-grid-2" style={{ gap: 80, alignItems: 'center' }}>
        <div>
          <LBTag color={LBtheme.coral}>Share the win</LBTag>
          <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 64, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
            Strava for the things<br/><span style={{ color: LBtheme.coral }}>you didn't do.</span>
          </h2>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 24, maxWidth: 520 }}>
            Pick a photo, slap your stats on it, post. After every wave you ride, Urge Surfer overlays your streak, wave count, and time onto the image of your choice — five overlay styles, all rendered on-device. Public wins make the next wave easier to ride.
          </p>
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {points.map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={LBtheme.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M5 12l4 4 10-10"/>
                </svg>
                <div>
                  <div style={{ fontFamily: LBgrotesk, fontSize: 17, fontWeight: 600, color: LBtheme.ink, letterSpacing: -0.3 }}>{pt.t}</div>
                  <div style={{ fontFamily: LBgrotesk, fontSize: 14.5, color: LBtheme.inkDim, lineHeight: 1.55, marginTop: 4 }}>{pt.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LBSharePhone width={340} theme={theme}/>
        </div>
      </div>
    </LBSection>
  );
}

// ── App preview ─────────────────────────────────────────────
function LBPreview() {
  const { theme } = React.useContext(LBThemeCtx);
  return (
    <LBSection bg={LBtheme.bg2} py={140}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <LBTag>The whole app</LBTag>
        <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 64, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
          Three screens.<br/>That's the whole app.
        </h2>
        <p style={{ fontFamily: LBgrotesk, fontSize: 16, lineHeight: 1.5, color: LBtheme.inkDim, marginTop: 20, maxWidth: 540, margin: '20px auto 0' }}>
          We didn't add a journal. We didn't add an AI coach. We didn't add a community feed. We made it as small as it could be and then we stopped.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <LSPhone width={260} screen="picker" theme={theme}/>
          <div style={{ fontFamily: LBmono, fontSize: 12, color: LBtheme.inkMute, marginTop: 20, letterSpacing: 1 }}>01 · PICK</div>
        </div>
        <div style={{ textAlign: 'center', marginTop: -30 }}>
          <LSPhone width={300} screen="timer" remaining={163} theme={theme}/>
          <div style={{ fontFamily: LBmono, fontSize: 12, color: LBtheme.coral, marginTop: 20, letterSpacing: 1, fontWeight: 600 }}>02 · SURF</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <LSPhone width={260} screen="success" theme={theme}/>
          <div style={{ fontFamily: LBmono, fontSize: 12, color: LBtheme.inkMute, marginTop: 20, letterSpacing: 1 }}>03 · WIN</div>
        </div>
      </div>
    </LBSection>
  );
}

// ── Founder note ────────────────────────────────────────────
function LBFounder() {
  return (
    <LBSection bg={LBtheme.bg} py={140}>
      <div className="lb-grid-2" style={{ gap: 60, alignItems: 'start' }}>
        <div>
          <LBTag color={LBtheme.kelp}>Made by one person</LBTag>
          <div style={{ marginTop: 28, padding: 28, borderRadius: 20, background: LBtheme.surface, border: `1px solid ${LBtheme.line}` }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: 'linear-gradient(135deg, var(--lb-coralAlt), #7BA3A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LBgrotesk, fontSize: 30, fontWeight: 700, color: LBtheme.bg }}>A</div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: LBgrotesk, fontSize: 18, fontWeight: 600, color: LBtheme.ink }}>Abhay</div>
              <div style={{ fontFamily: LBgrotesk, fontSize: 13, color: LBtheme.inkMute, marginTop: 4 }}>Engineer · Barcelona</div>
              <div style={{ fontFamily: LBgrotesk, fontSize: 13, color: LBtheme.inkMute, marginTop: 4 }}>Smoke-free since 2023</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="lb-quote-h2" style={{ fontFamily: LBgrotesk, fontSize: 48, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1.05, color: LBtheme.ink, margin: 0 }}>
            "I quit smoking because<br/>my therapist made me<br/>set a 5-minute timer."
          </h2>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 28 }}>
            That timer worked when nothing else had. So I built one that doesn't look like a kitchen appliance — and that doesn't bill me €70 a year for the privilege of using it.
          </p>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 16 }}>
            €9,99 covers a few coffees. That feels right for a tool that helped me get my life back.
          </p>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 16 }}>
            And I open-sourced the whole thing. <a href="https://github.com/abhaykatheria/urgesurfer" target="_blank" rel="noopener" style={{ color: LBtheme.coral, textDecoration: 'none', borderBottom: `1px solid ${LBtheme.coralA35}` }}>github.com/abhaykatheria/urgesurfer</a> — fork it, improve it, ship your own version. This is for the community, not a moat.
          </p>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 16, fontStyle: 'italic' }}>
            — Abhay
          </p>
        </div>
      </div>
    </LBSection>
  );
}

// ── Privacy ─────────────────────────────────────────────────
function LBPrivacy() {
  const points = [
    { t: 'No accounts.',       d: "No email. No password. No \"sign in with Apple.\" Open the app, you're in." },
    { t: 'No cloud.',          d: "Your urges, your timers, your selfies — every byte stays on your iPhone. We never see it because there's no server to see it from." },
    { t: 'No analytics.',      d: "No Mixpanel. No Amplitude. No Segment. No Firebase. No tracking pixel. We don't know if you opened the app today, and we like it that way." },
    { t: 'No third parties.',  d: 'Zero SDKs from advertisers, data brokers, or AI companies. The app talks to Apple for the receipt and nothing else.' },
  ];
  return (
    <LBSection id="privacy" bg={LBtheme.bg2} py={140}>
      <div className="lb-grid-2" style={{ gap: 80, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'relative', aspectRatio: '1 / 1', maxWidth: 460, margin: '0 auto',
            borderRadius: 28, background: LBtheme.surface, border: `1px solid ${LBtheme.line}`,
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'absolute', top: '-30%', left: '-30%', width: '160%', height: '160%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,163,166,0.18), transparent 60%)' }}/>
            <svg width="62%" viewBox="0 0 200 240" fill="none">
              <rect x="30" y="10" width="140" height="220" rx="24" stroke={LBtheme.kelp} strokeWidth="1.5" opacity="0.4"/>
              <rect x="40" y="24" width="120" height="192" rx="14" fill={LBtheme.bg} stroke={LBtheme.line} strokeWidth="1"/>
              <g transform="translate(100, 118)">
                <path d="M0 -50 L36 -36 L36 6 Q36 36, 0 50 Q-36 36, -36 6 L-36 -36 Z" fill="none" stroke={LBtheme.coral} strokeWidth="2" strokeLinejoin="round"/>
                <path d="M-14 -2 L-4 10 L18 -16" fill="none" stroke={LBtheme.coral} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <text x="100" y="200" textAnchor="middle" fontFamily={LBmono} fontSize="7" fill={LBtheme.kelp} letterSpacing="1.4">ON-DEVICE ONLY</text>
            </svg>
            {[
              { top: 18,    left: 18,   txt: 'no accounts'  },
              { bottom: 18, left: 18,   txt: 'no cloud'     },
              { top: 18,    right: 18,  txt: 'no tracking'  },
              { bottom: 18, right: 18,  txt: 'no ads'       },
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', ...p,
                fontFamily: LBmono, fontSize: 10, color: LBtheme.inkMute, letterSpacing: 1.4, textTransform: 'uppercase',
                padding: '5px 11px', borderRadius: 999, background: 'rgba(0,0,0,0.35)', border: `1px solid ${LBtheme.line}`,
              }}>{p.txt}</div>
            ))}
          </div>
        </div>

        <div>
          <LBTag color={LBtheme.kelp}>Privacy first — not as a feature, as the default</LBTag>
          <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 64, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
            Your data never<br/>leaves your <span style={{ color: LBtheme.coral, fontStyle: 'italic', fontFamily: LBdisplay, fontWeight: 300 }}>phone.</span>
          </h2>
          <p style={{ fontFamily: LBgrotesk, fontSize: 17.5, lineHeight: 1.6, color: LBtheme.inkDim, marginTop: 24, maxWidth: 520 }}>
            Quitting things is intimate. The last thing you need is your craving log being logged by someone else. So we don't. We can't.
          </p>
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {points.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={LBtheme.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M5 12l4 4 10-10"/>
                </svg>
                <div>
                  <div style={{ fontFamily: LBgrotesk, fontSize: 17, fontWeight: 600, color: LBtheme.ink, letterSpacing: -0.3 }}>{p.t}</div>
                  <div style={{ fontFamily: LBgrotesk, fontSize: 14.5, color: LBtheme.inkDim, lineHeight: 1.55, marginTop: 4 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 36, padding: '20px 24px', borderRadius: 16,
            background: 'rgba(123,163,166,0.08)', border: `1px solid ${LBtheme.line}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={LBtheme.kelp} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="4" y="11" width="16" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
            <div>
              <div style={{ fontFamily: LBmono, fontSize: 11, color: LBtheme.kelp, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Delete the app</div>
              <div style={{ fontFamily: LBgrotesk, fontSize: 14.5, color: LBtheme.inkDim, marginTop: 4, lineHeight: 1.5 }}>… and your data is genuinely gone. Not deactivated. Not "deleted within 90 days." Gone.</div>
            </div>
          </div>
        </div>
      </div>
    </LBSection>
  );
}

// ── FAQ ─────────────────────────────────────────────────────
function LBFAQ() {
  const items = [
    { q: 'Wait, really, no subscription?', a: 'No subscription. No ads. No premium tier. €9,99 in the App Store, the app is yours, free updates forever.' },
    { q: 'How does this compare to Quitter / Smoke Free / etc.?', a: "Those are great if you want stats and streaks for one specific addiction. Urge Surfer is a generalized urge-management tool — it works for any craving, in any moment. Smaller surface, smaller scope." },
    { q: 'Will this cure my addiction?', a: "No app cures an addiction. Urge Surfer is a tool. It pairs well with therapy, AA, NRT, SMART recovery — anything that's already supporting you. Not a replacement for professional help." },
    { q: 'What about my data?', a: 'On-device only. No accounts, no cloud, no analytics, no third-party SDKs. If you delete the app, your data is gone. We literally cannot see it — see the Privacy section above.' },
    { q: 'Android? Web?', a: "iPhone-only at launch. Android when we can do it well — sign up at urgesurfer.app/android to be told. Or, since the whole thing is open source, build it yourself: github.com/abhaykatheria/urgesurfer." },
    { q: 'Wait, this is open source?', a: 'Yes. The whole codebase lives at github.com/abhaykatheria/urgesurfer. Fork it, improve it, ship your own. Pull requests welcome — this is for the community, not a moat.' },
    { q: "Can I gift it?", a: 'Yes. Apple now supports gifting in-app purchases — buy one for someone trying to quit. €9,99 is the easiest "I see you" you can send.' },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <LBSection id="faq" bg={LBtheme.bg2} py={140}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <LBTag color={LBtheme.kelp}>Questions</LBTag>
        <h2 className="lb-section-h2" style={{ fontFamily: LBgrotesk, fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: LBtheme.ink, marginTop: 24 }}>
          You probably want to know:
        </h2>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '24px 28px', background: LBtheme.surface, borderRadius: 14,
                border: `1px solid ${isOpen ? LBtheme.coral : LBtheme.line}`, textAlign: 'left',
                cursor: 'pointer', fontFamily: LBgrotesk, fontSize: 17, fontWeight: 600,
                color: LBtheme.ink, transition: 'border-color .2s',
              }}>
                <span>{it.q}</span>
                <span style={{ fontSize: 22, color: LBtheme.coral, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .25s', lineHeight: 1 }}>+</span>
              </button>
              {isOpen && (
                <div style={{ padding: '20px 28px', fontFamily: LBgrotesk, fontSize: 15, lineHeight: 1.65, color: LBtheme.inkDim }}>{it.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </LBSection>
  );
}

// ── Final CTA ───────────────────────────────────────────────
function LBCTA() {
  return (
    <section id="buy" className="lb-cta-section" style={{ padding: '160px 60px', background: LBtheme.coral, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', filter: 'blur(40px)' }}/>
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <h2 className="lb-cta-h2" style={{ fontFamily: LBgrotesk, fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 0.92, color: LBtheme.bg }}>
          Ride the wave.<br/><span style={{ fontFamily: LBdisplay, fontStyle: 'italic', fontWeight: 300, color: 'rgba(15,21,23,0.7)' }}>On your phone, only.</span>
        </h2>
        <p style={{ fontFamily: LBgrotesk, fontSize: 19, lineHeight: 1.5, color: 'rgba(15,21,23,0.75)', marginTop: 36, maxWidth: 540, margin: '36px auto 0', fontWeight: 500 }}>
          One purchase. No accounts, no cloud, no tracking. The next wave is coming — be ready for it.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', marginTop: 48, flexWrap: 'wrap' }}>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '24px 40px', background: LBtheme.bg, color: LBtheme.coral,
            borderRadius: 16, textDecoration: 'none', fontFamily: LBgrotesk,
            fontSize: 18, fontWeight: 700, letterSpacing: -0.3,
          }}>
            <LBAppleIcon/> Get on App Store
          </a>
          <a href="Urge Surfer Prototype.html" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '23px 30px', background: 'transparent', color: LBtheme.bg,
            border: `1.5px solid rgba(15,21,23,0.35)`,
            borderRadius: 16, textDecoration: 'none', fontFamily: LBgrotesk,
            fontSize: 17, fontWeight: 600, letterSpacing: -0.2,
          }}>
            Try the demo <span style={{ fontSize: 19, lineHeight: 1, transform: 'translateY(-1px)' }}>→</span>
          </a>
        </div>
        <div style={{ marginTop: 18, fontFamily: LBmono, fontSize: 12, color: 'rgba(15,21,23,0.6)', letterSpacing: 0.6 }}>
          IPHONE · IOS 16+ · 18 MB · 4.9★ ON THE APP STORE
        </div>
      </div>
    </section>
  );
}

function LBFooter() {
  return (
    <footer className="lb-footer" style={{ padding: '40px 60px', background: LBtheme.bg, borderTop: `1px solid ${LBtheme.line}` }}>
      <div className="lb-footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: LBgrotesk, fontSize: 13, color: LBtheme.inkMute }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: LBtheme.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="6" viewBox="0 0 60 10" fill="none" stroke={LBtheme.bg} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"><path d="M0 5 Q 7.5 0, 15 5 T 30 5 T 45 5 T 60 5"/></svg>
          </div>
          <div style={{ color: LBtheme.ink, fontWeight: 600 }}>Urge Surfer</div>
          <div style={{ marginLeft: 12 }}>© 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Press</a>
          <a href="https://github.com/abhaykatheria/urgesurfer" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
            GitHub
          </a>        </div>
      </div>
    </footer>
  );
}

const LBThemeCtx = React.createContext({ theme: 'dark', toggleTheme: () => {} });

function LandingB() {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('lb-theme') || 'dark'; } catch { return 'dark'; }
  });
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (rootRef.current) lbApplyTheme(rootRef.current, theme);
    try { localStorage.setItem('lb-theme', theme); } catch {}
  }, [theme]);
  const toggleTheme = React.useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);
  return (
    <LBThemeCtx.Provider value={{ theme, toggleTheme }}>
      <div ref={rootRef} className="lb-root" style={{ background: LBtheme.bg, color: LBtheme.ink, fontFamily: LBgrotesk, minHeight: '100vh', transition: 'background .35s ease, color .35s ease' }}>
        <LBNav/>
        <LBHero/>
        <LBPricing/>
        <LBPrivacy/>
        <LBHow/>
        <LBScience/>
        <LBShare/>
        <LBFounder/>
        <LBFAQ/>
        <LBCTA/>
        <LBFooter/>
      </div>
    </LBThemeCtx.Provider>
  );
}

Object.assign(window, { LandingB });
