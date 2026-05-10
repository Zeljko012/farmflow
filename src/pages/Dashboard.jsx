import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import GcodeGenerator from '../components/generator/GcodeGenerator'
import CostCalculator from '../components/calculator/CostCalculator'
import styles from './Dashboard.module.css'

const PLAN_FEATURES = {
  free:    ['calculator'],
  starter: ['calculator', 'generator'],
  pro:     ['calculator', 'generator', 'videos'],
  expert:  ['calculator', 'generator', 'videos', 'support'],
}

const PLAN_LABELS = {
  free: { label: 'Free', color: '#a8a692' },
  starter: { label: 'Starter', color: '#d4501f' },
  pro: { label: 'Pro', color: '#2563eb' },
  expert: { label: 'Expert', color: '#7c3aed' },
}

export default function Dashboard() {
  const { user, profile, plan, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('generator')
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.free

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function hasFeature(f) { return features.includes(f) }

  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free

  return (
    <div className={styles.app}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>⚡</div>
            <span>Farm<em>Flow</em></span>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navLabel}>Tools</div>

            {hasFeature('generator') ? (
              <button
                className={`${styles.navItem} ${activeTab === 'generator' ? styles.active : ''}`}
                onClick={() => setActiveTab('generator')}
              >
                <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                G-Code Generator
              </button>
            ) : (
              <div className={styles.navItemLocked} onClick={() => navigate('/pricing')}>
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                G-Code Generator
                <span className={styles.lockBadge}>Starter+</span>
              </div>
            )}

            <button
              className={`${styles.navItem} ${activeTab === 'calculator' ? styles.active : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Cost Calculator
            </button>

            {hasFeature('videos') ? (
              <button
                className={`${styles.navItem} ${activeTab === 'videos' ? styles.active : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                Video Lessons
              </button>
            ) : (
              <div className={styles.navItemLocked} onClick={() => navigate('/pricing')}>
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Video Lessons
                <span className={styles.lockBadge}>Pro+</span>
              </div>
            )}

            {hasFeature('support') ? (
              <button
                className={`${styles.navItem} ${activeTab === 'support' ? styles.active : ''}`}
                onClick={() => setActiveTab('support')}
              >
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Live Support
              </button>
            ) : (
              <div className={styles.navItemLocked} onClick={() => navigate('/pricing')}>
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Live Support
                <span className={styles.lockBadge}>Expert</span>
              </div>
            )}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          {/* UPGRADE PROMPT */}
          {plan !== 'expert' && (
            <div className={styles.upgradeCard} onClick={() => window.open('https://farmflow-mu.vercel.app/pricing', '_blank')}>
              <div className={styles.upgradeTitle}>Upgrade plan</div>
              <div className={styles.upgradeSub}>Unlock more features</div>
              <div className={styles.upgradeBtn}>View plans →</div>
            </div>
          )}

          {/* USER */}
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{profile?.full_name || 'User'}</div>
              <div className={styles.userPlan} style={{ color: planInfo.color }}>
                {planInfo.label} plan
              </div>
            </div>
            <button className={styles.signOutBtn} onClick={handleSignOut} title="Sign out">
              <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {activeTab === 'generator' && hasFeature('generator') && <GcodeGenerator />}
        {activeTab === 'calculator' && <CostCalculator />}
        {activeTab === 'videos' && hasFeature('videos') && <VideosPage />}
        {activeTab === 'support' && hasFeature('support') && <SupportPage />}
      </main>
    </div>
  )
}

function VideosPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Pro feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontStyle: 'italic', marginBottom: '12px' }}>Video Lessons</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>Step-by-step guides for setting up and optimizing your print farm.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎬</div>
        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: 'var(--text)' }}>Coming soon</div>
        <div style={{ fontSize: '14px' }}>Video lessons are being recorded and will be available shortly.</div>
      </div>
    </div>
  )
}

function SupportPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Expert feature</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontStyle: 'italic', marginBottom: '12px' }}>Live Support</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>Direct access to the FarmFlow founder. Get help with any 3D printing challenge.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Book a support session</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>Send an email to schedule your 1-on-1 session.</div>
        <a href="mailto:proviczeljko@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '9px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
          📧 Contact support
        </a>
      </div>
    </div>
  )
}
