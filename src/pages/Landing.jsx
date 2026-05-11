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
        <div className={styles.heroEye}>3D Print Automation</div>
        <h1 className={styles.heroTitle}>
          Change the code once.<br />
          <em>Print forever, hands-free.</em>
        </h1>
        <p className={styles.heroSub}>
          FarmFlow generates a G-code snippet you paste into Bambu Studio once. From that moment, every print — whatever you're printing — ejects automatically when done. Walk away and come back to finished parts.
        </p>
        <div className={styles.heroActions}>
          <Link to="/register" className={styles.btnPrimary}>Get started free →</Link>
          <Link to="/pricing" className={styles.btnSecondary}>See pricing</Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}><div className={styles.statNum}>Once</div><div className={styles.statLabel}>Setup, forever works</div></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><div className={styles.statNum}>Any</div><div className={styles.statLabel}>Print you send</div></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><div className={styles.statNum}>$9.99</div><div className={styles.statLabel}>Per month</div></div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3>Auto-eject, every time</h3>
          <p>Paste our G-code once into Bambu Studio. Every print — no matter what you're printing — automatically ejects when the cooling is done. No babysitting required.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💰</div>
          <h3>Know your real costs</h3>
          <p>Calculate exact print costs — filament, electricity, amortization, and packaging. Never underprice again.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📈</div>
          <h3>Price to profit</h3>
          <p>Enter your target margin and FarmFlow tells you exactly what to charge and how many units you need to hit your monthly income goal.</p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Set it up once.<br /><strong>Never stand next to your printer again.</strong></h2>
        <p>Join early — first members get 2 months free.</p>
        <Link to="/register" className={styles.ctaBtn}>Get started free →</Link>
      </section>

      <footer className={styles.footer}>
        <div>© 2025 FarmFlow</div>
        <Link to="/pricing">Pricing</Link>
      </footer>
    </div>
  )
}
