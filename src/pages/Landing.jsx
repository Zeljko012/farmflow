import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

export default function Landing() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>⚡</div>
          <span>Farm<em>Flow</em></span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className={styles.navCta}>Get started</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroEye}>Farm Automation</div>
        <h1 className={styles.heroTitle}>
          Your printer works.<br />
          <em>You don't have to.</em>
        </h1>
        <p className={styles.heroSub}>
          FarmFlow automates your Bambu Lab print farm — auto-eject, cost tracking, and profit calculator in one clean tool.
        </p>
        <div className={styles.heroActions}>
          <Link to="/register" className={styles.btnPrimary}>Start for free →</Link>
          <Link to="/pricing" className={styles.btnSecondary}>See pricing</Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}><div className={styles.statNum}>100%</div><div className={styles.statLabel}>Automated eject</div></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><div className={styles.statNum}>Any</div><div className={styles.statLabel}>Printer brand</div></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><div className={styles.statNum}>$9.99</div><div className={styles.statLabel}>Starting price</div></div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3>Auto-eject & looping</h3>
          <p>Paste our G-code once into Bambu Studio — every print ejects automatically and restarts in loop mode.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💰</div>
          <h3>Cost calculator</h3>
          <p>Know exactly what every print costs — filament, electricity, amortization, and packaging included.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📈</div>
          <h3>Sale price optimizer</h3>
          <p>Enter your target margin and FarmFlow tells you exactly what to charge and how many units you need per month.</p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to stop babysitting<br /><strong>your printer?</strong></h2>
        <p>Join the waitlist — early access members get 2 months free.</p>
        <Link to="/register" className={styles.ctaBtn}>Get started free →</Link>
      </section>

      <footer className={styles.footer}>
        <div>© 2025 FarmFlow</div>
        <Link to="/pricing">Pricing</Link>
      </footer>
    </div>
  )
}
