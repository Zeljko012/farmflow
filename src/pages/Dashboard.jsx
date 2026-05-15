import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import GcodeGenerator from '../components/generator/GcodeGenerator'
import CostCalculator from '../components/calculator/CostCalculator'
import ProfitDashboard from '../components/profit/ProfitDashboard'
import InventoryTracker from '../components/inventory/InventoryTracker'
import OrderManagement from '../components/orders/OrderManagement'

const PLAN_FEATURES = {
  free:    ['calculator'],
  starter: ['calculator', 'generator', 'profit'],
  pro:     ['calculator', 'generator', 'profit', 'inventory', 'orders', 'videos'],
  expert:  ['calculator', 'generator', 'profit', 'inventory', 'orders', 'videos', 'support'],
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
    id: 'profit',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    label: 'Profit Dashboard',
    feature: 'profit',
    plan: 'Starter+',
  },
  {
    id: 'inventory',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    label: 'Inventory & Orders',
    feature: 'inventory',
    plan: 'Pro+',
  },
  {
    id: 'orders',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>,
    label: 'Order Management',
    feature: 'orders',
    plan: 'Pro+',
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
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('farmflow_tab') || 'home'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.free
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free
  const hasFeature = (f) => !f || features.includes(f)

  function handleTabChange(tab) {
    sessionStorage.setItem('farmflow_tab', tab)
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  useEffect(() => {
    const handlePop = () => {
      handleTabChange('home')
      window.history.pushState(null, '', window.location.href)
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* LOGO */}
      <div className="ff-sidebar-logo" style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '19px', fontWeight: '600', color: 'var(--text)', letterSpacing: '-0.3px' }}>Farm<span style={{ color: 'var(--accent)' }}>Flow</span></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px', fontFamily: 'var(--mono)' }}>3D Print Automation</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="mobile-close-btn" style={{ display: 'none', width: '32px', height: '32px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', color: 'var(--muted)', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, padding: '12px 16px', overflowY: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '0 8px', marginBottom: '8px' }}>Menu</div>
        {TOOLS.map(tool => {
          const locked = tool.feature && !hasFeature(tool.feature)
          const isActive = activeTab === tool.id
          return (
            <button
              key={tool.id}
              className="ff-nav-item"
              onClick={() => locked ? navigate('/pricing') : handleTabChange(tool.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px', border: 'none',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent)' : locked ? 'var(--muted2)' : 'var(--text)',
                cursor: 'pointer', marginBottom: '2px', textAlign: 'left',
                transition: 'background 0.15s', fontFamily: 'var(--font)',
                fontSize: '14px', fontWeight: isActive ? '500' : '400',
              }}
            >
              <span style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.4 : 1 }}>{tool.icon}</span>
              <span style={{ flex: 1 }}>{tool.label}</span>
              {locked && <span className="ff-nav-badge" style={{ fontSize: '10px', fontFamily: 'var(--mono)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', color: 'var(--muted)', flexShrink: 0 }}>{tool.plan}</span>}
            </button>
          )
        })}
      </nav>

      {/* BOTTOM */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0, marginTop: 'auto' }}>
        {plan !== 'expert' && (
          <div
            className="ff-upgrade-card"
            onClick={() => { window.open('https://farmflow-mu.vercel.app/pricing', '_blank'); setSidebarOpen(false) }}
            style={{ background: 'linear-gradient(135deg, #d4501f 0%, #e8733d 100%)', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', marginBottom: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>🚀 Upgrade plan</div>
              <div className="ff-upgrade-text" style={{ fontSize: '11px', opacity: 0.85 }}>Unlock all features</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '3px 8px', whiteSpace: 'nowrap' }}>View →</div>
          </div>
        )}
        <div className="ff-user-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--surface2)', borderRadius: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>
            {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || user?.email?.split('@')[0] || 'User'}</div>
            <div style={{ fontSize: '11px', color: planInfo.color, fontFamily: 'var(--mono)', fontWeight: '500' }}>{planInfo.label} plan</div>
            <button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', padding: '2px 0 0', cursor: 'pointer', color: 'var(--muted)', fontSize: '11px', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ff-desktop-sidebar { display: none !important; }
          .ff-mobile-topbar { display: flex !important; }
          .ff-main { padding-top: 56px; }
          .mobile-close-btn { display: flex !important; }
          .ff-sidebar-logo { padding: 12px 18px 10px !important; }
          .ff-nav-item { padding: 7px 12px !important; margin-bottom: 1px !important; font-size: 13px !important; }
          .ff-nav-badge { display: none !important; }
          .ff-upgrade-card { padding: 7px 12px !important; margin-bottom: 7px !important; }
          .ff-upgrade-text { display: none !important; }
          .ff-user-row { padding: 8px 10px !important; }
        }
        @media (min-width: 769px) {
          .ff-mobile-topbar { display: none !important; }
          .ff-mobile-overlay { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* DESKTOP SIDEBAR */}
        <aside className="ff-desktop-sidebar" style={{ width: '280px', background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', flexShrink: 0 }}>
          <SidebarContent />
        </aside>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="ff-mobile-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          />
        )}

        {/* MOBILE SIDEBAR DRAWER */}
        <aside
          className="ff-mobile-overlay"
          style={{
            position: 'fixed', top: 0, left: 0, width: '280px',
            height: '100dvh',
            background: 'var(--white)', zIndex: 100, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease', boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          }}
        >
          <SidebarContent />
        </aside>

        {/* MOBILE TOP BAR */}
        <div className="ff-mobile-topbar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: 'var(--white)', borderBottom: '1px solid var(--border)', zIndex: 50, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '8px' }}
          >
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px' }}></span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '600' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</div>
            Farm<span style={{ color: 'var(--accent)' }}>Flow</span>
          </div>

          {/* Empty spacer to keep logo centered */}
          <div style={{ width: '40px' }} />
        </div>

        {/* MAIN CONTENT */}
        <main className="ff-main" style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
          {activeTab === 'home'      && <HomePage plan={plan} planInfo={planInfo} features={features} setActiveTab={handleTabChange} navigate={navigate} profile={profile} />}
          {activeTab === 'generator' && hasFeature('generator') && <GcodeGenerator />}
          {activeTab === 'calculator' && <CostCalculator />}
          {activeTab === 'profit'    && hasFeature('profit') && <ProfitDashboard />}
          {activeTab === 'inventory' && hasFeature('inventory') && <InventoryTracker />}
          {activeTab === 'orders'    && hasFeature('orders') && <OrderManagement />}
          {activeTab === 'videos'    && hasFeature('videos') && <VideosPage />}
          {activeTab === 'support'   && hasFeature('support') && <SupportPage />}
        </main>
      </div>
    </>
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
      desc: 'Paste our code once into Bambu Studio. Every print ejects automatically when done — whatever you\'re printing.',
      available: hasFeature('generator'),
      cta: hasFeature('generator') ? 'Open Generator' : 'Upgrade to Starter',
      color: '#d4501f',
      bg: '#fdf0ec',
      plan: 'Starter+',
    },
    {
      id: 'profit',
      emoji: '📈',
      title: 'Profit Dashboard',
      desc: 'Track daily sales with full cost breakdown — print, packaging, shipping, platform fees and ad spend. See your real profit per day and month.',
      available: hasFeature('profit'),
      cta: hasFeature('profit') ? 'Open Dashboard' : 'Upgrade to Starter',
      color: '#2563eb',
      bg: '#eff6ff',
      plan: 'Starter+',
    },
    {
      id: 'inventory',
      emoji: '🧵',
      title: 'Inventory & Orders',
      desc: 'Track all your filament spools by type, brand and color. Get low stock alerts and manage your order list in one place.',
      available: hasFeature('inventory'),
      cta: hasFeature('inventory') ? 'Open Inventory' : 'Upgrade to Pro',
      color: '#7c3aed',
      bg: '#f5f3ff',
      plan: 'Pro+',
    },
    {
      id: 'orders',
      emoji: '📦',
      title: 'Order Management',
      desc: 'Create shipments, track deliveries, print shipping labels and manage your entire dispatch workflow in one place.',
      available: hasFeature('orders'),
      cta: hasFeature('orders') ? 'Open Orders' : 'Upgrade to Pro',
      color: '#0891b2',
      bg: '#ecfeff',
      plan: 'Pro+',
    },
    {
      id: 'videos',
      emoji: '🎬',
      title: 'Video Lessons',
      desc: 'Step-by-step video guides for setting up and scaling your 3D print business.',
      available: hasFeature('videos'),
      cta: hasFeature('videos') ? 'Watch Lessons' : 'Upgrade to Pro',
      color: '#0891b2',
      bg: '#ecfeff',
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
    <div style={{ padding: 'clamp(24px, 5vw, 52px)', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>Dashboard</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 6vw, 48px)', fontStyle: 'italic', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.05, color: 'var(--text)' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: '300', maxWidth: '480px', lineHeight: 1.6 }}>
          Your print farm automation hub. Choose a tool to get started.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '9px 18px', background: planInfo.bg, border: `1px solid ${planInfo.color}30`, borderRadius: '100px', fontSize: '13px', color: planInfo.color, fontWeight: '500' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: planInfo.color }} />
          {planInfo.label} plan active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {cards.map(card => (
          <div key={card.id}
            style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', position: 'relative', transition: 'all 0.2s', cursor: 'pointer' }}
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
    <div style={{ padding: 'clamp(24px, 5vw, 52px)', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Pro Feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 44px)', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' }}>Video Lessons</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '48px', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>Step-by-step guides for setting up and optimizing your print farm.</p>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎬</div>
        <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '10px' }}>Coming soon</div>
        <div style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>Video lessons are being recorded and will be available shortly.</div>
      </div>
    </div>
  )
}

function SupportPage() {
  return (
    <div style={{ padding: 'clamp(24px, 5vw, 52px)', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Expert Feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 44px)', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' }}>Live Support</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '48px', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>Direct access to the FarmFlow founder. Get personalized help with any challenge.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Email Support</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.65 }}>Send your question and get a detailed response within 24 hours.</div>
          <a href="mailto:proviczeljko@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Send email →</a>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📅</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Book a Session</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.65 }}>Schedule a 1-on-1 video call to solve your problem in real time.</div>
          <a href="mailto:proviczeljko@gmail.com?subject=Book Support Session" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--text)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Book session →</a>
        </div>
      </div>
    </div>
  )
}
