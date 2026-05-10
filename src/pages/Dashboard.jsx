import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import GcodeGenerator from '../components/generator/GcodeGenerator'
import CostCalculator from '../components/calculator/CostCalculator'

const PLAN_FEATURES = {
  free:    ['calculator'],
  starter: ['calculator', 'generator'],
  pro:     ['calculator', 'generator', 'videos'],
  expert:  ['calculator', 'generator', 'videos', 'support'],
}

const PLAN_LABELS = {
  free:    { label: 'Free',    color: '#a8a692', bg: '#f0efe9' },
  starter: { label: 'Starter', color: '#d4501f', bg: '#fdf0ec' },
  pro:     { label: 'Pro',     color: '#2563eb', bg: '#eff6ff' },
  expert:  { label: 'Expert',  color: '#7c3aed', bg: '#f5f3ff' },
}

const TOOLS = [
  {
    id: 'home',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    label: 'Home',
    feature: null,
  },
  {
    id: 'generator',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    label: 'G-Code Generator',
    feature: 'generator',
    plan: 'Starter+',
  },
  {
    id: 'calculator',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    label: 'Cost Calculator',
    feature: 'calculator',
    plan: null,
  },
  {
    id: 'videos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    label: 'Video Lessons',
    feature: 'videos',
    plan: 'Pro+',
  },
  {
    id: 'support',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    label: 'Live Support',
    feature: 'support',
    plan: 'Expert',
  },
]

export default function Dashboard() {
  const { user, profile, plan, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.free
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free
  const hasFeature = (f) => !f || features.includes(f)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{ background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* LOGO */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
            <div>
              <div style={{ fontSize: '19px', fontWeight: '600', color: 'var(--text)', letterSpacing: '-0.3px' }}>Farm<span style={{ color: 'var(--accent)' }}>Flow</span></div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px', fontFamily: 'var(--mono)' }}>3D Print Automation</div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '0 8px', marginBottom: '12px' }}>Menu</div>

          {TOOLS.map(tool => {
            const locked = tool.feature && !hasFeature(tool.feature)
            const isActive = activeTab === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => locked ? navigate('/pricing') : setActiveTab(tool.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : locked ? 'var(--muted2)' : 'var(--text)',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  fontFamily: 'var(--font)',
                  fontSize: '15px',
                  fontWeight: isActive ? '500' : '400',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ width: '22px', height: '22px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.4 : 1 }}>{tool.icon}</span>
                <span style={{ flex: 1 }}>{tool.label}</span>
                {locked && (
                  <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 7px', color: 'var(--muted)', flexShrink: 0 }}>{tool.plan}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* BOTTOM */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          {plan !== 'expert' && (
            <div
              onClick={() => window.open('https://farmflow-mu.vercel.app/pricing', '_blank')}
              style={{ background: 'linear-gradient(135deg, #d4501f 0%, #e8733d 100%)', borderRadius: '12px', padding: '16px', cursor: 'pointer', marginBottom: '12px', color: 'white' }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>🚀 Upgrade plan</div>
              <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '10px' }}>Unlock all features</div>
              <div style={{ fontSize: '12px', fontWeight: '500', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '5px 10px', display: 'inline-block' }}>View plans →</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface2)', borderRadius: '10px' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', flexShrink: 0 }}>
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || user?.email?.split('@')[0] || 'User'}</div>
              <div style={{ fontSize: '11px', color: planInfo.color, fontFamily: 'var(--mono)', fontWeight: '500' }}>{planInfo.label} plan</div>
            </div>
            <button onClick={handleSignOut} title="Sign out" style={{ width: '32px', height: '32px', background: 'none', border: '1px solid var(--border)', borderRadius: '7px', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ overflowY: 'auto', minHeight: '100vh' }}>
        {activeTab === 'home' && <HomePage plan={plan} planInfo={planInfo} features={features} setActiveTab={setActiveTab} navigate={navigate} profile={profile} />}
        {activeTab === 'generator' && hasFeature('generator') && <GcodeGenerator />}
        {activeTab === 'calculator' && <CostCalculator />}
        {activeTab === 'videos' && hasFeature('videos') && <VideosPage />}
        {activeTab === 'support' && hasFeature('support') && <SupportPage />}
      </main>
    </div>
  )
}

function HomePage({ plan, planInfo, features, setActiveTab, navigate, profile }) {
  const hasFeature = (f) => features.includes(f)

  const cards = [
    {
      id: 'calculator',
      emoji: '💰',
      title: 'Cost Calculator',
      desc: 'Calculate exact print costs — filament, electricity, amortization and packaging. Find the perfect sale price with built-in profit simulator.',
      available: true,
      cta: 'Open Calculator',
      color: '#2d7a3a',
      bg: '#edf7ef',
    },
    {
      id: 'generator',
      emoji: '⚡',
      title: 'G-Code Generator',
      desc: 'Generate auto-eject G-code for your Bambu Lab printer. Paste it once into Bambu Studio and every print ejects automatically.',
      available: hasFeature('generator'),
      cta: hasFeature('generator') ? 'Open Generator' : 'Upgrade to Starter',
      color: '#d4501f',
      bg: '#fdf0ec',
      plan: 'Starter+',
    },
    {
      id: 'videos',
      emoji: '🎬',
      title: 'Video Lessons',
      desc: 'Step-by-step video guides for setting up and scaling your 3D print farm. From first print to full automation.',
      available: hasFeature('videos'),
      cta: hasFeature('videos') ? 'Watch Lessons' : 'Upgrade to Pro',
      color: '#2563eb',
      bg: '#eff6ff',
      plan: 'Pro+',
      comingSoon: true,
    },
    {
      id: 'support',
      emoji: '💬',
      title: 'Live Support',
      desc: 'Direct 1-on-1 support from the FarmFlow founder. Get personalized help with any 3D printing or business challenge.',
      available: hasFeature('support'),
      cta: hasFeature('support') ? 'Get Support' : 'Upgrade to Expert',
      color: '#7c3aed',
      bg: '#f5f3ff',
      plan: 'Expert',
    },
  ]

  return (
    <div style={{ padding: '52px 52px', maxWidth: '1000px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '52px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>Dashboard</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontStyle: 'italic', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.05, color: 'var(--text)' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--muted)', fontWeight: '300', maxWidth: '480px', lineHeight: 1.6 }}>
          Your print farm automation hub. Choose a tool to get started.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '9px 18px', background: planInfo.bg, border: `1px solid ${planInfo.color}30`, borderRadius: '100px', fontSize: '13px', color: planInfo.color, fontWeight: '500' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: planInfo.color }} />
          {planInfo.label} plan active
        </div>
      </div>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {cards.map(card => (
          <div key={card.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', position: 'relative', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: card.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                {card.emoji}
              </div>
              {!card.available && card.plan && (
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 9px', color: 'var(--muted)' }}>🔒 {card.plan}</span>
              )}
              {card.comingSoon && card.available && (
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '3px 9px', color: '#2563eb' }}>Soon</span>
              )}
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.4px', marginBottom: '10px', color: 'var(--text)' }}>{card.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.7', marginBottom: '28px', fontWeight: '300' }}>{card.desc}</p>

            <button
              onClick={() => card.available ? setActiveTab(card.id) : navigate('/pricing')}
              style={{ padding: '12px 24px', background: card.available ? card.color : 'var(--surface2)', color: card.available ? 'white' : 'var(--muted)', border: card.available ? 'none' : '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {card.cta} {card.available ? '→' : ''}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideosPage() {
  return (
    <div style={{ padding: '52px', maxWidth: '900px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Pro Feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '44px', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' }}>Video Lessons</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '48px', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px' }}>Step-by-step guides for setting up and optimizing your print farm.</p>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '80px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎬</div>
        <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '10px' }}>Coming soon</div>
        <div style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>Video lessons are being recorded and will be available shortly.</div>
      </div>
    </div>
  )
}

function SupportPage() {
  return (
    <div style={{ padding: '52px', maxWidth: '900px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Expert Feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '44px', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' }}>Live Support</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '48px', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px' }}>Direct access to the FarmFlow founder. Get personalized help with any challenge.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Email Support</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.65 }}>Send your question and get a detailed response within 24 hours.</div>
          <a href="mailto:proviczeljko@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Send email →</a>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📅</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Book a Session</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.65 }}>Schedule a 1-on-1 video call to solve your problem in real time.</div>
          <a href="mailto:proviczeljko@gmail.com?subject=Book Support Session" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--text)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Book session →</a>
        </div>
      </div>
    </div>
  )
}
