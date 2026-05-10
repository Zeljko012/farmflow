import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './Pricing.module.css'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 9.99,
    yearly: 6.66,
    yearlyTotal: 79,
    features: ['Cost & sale calculator', 'G-Code Generator', 'Unlimited loops', 'Auto-eject optimization', 'All Bambu Lab printers'],
    locked: ['Video lessons', 'Live support'],
    cta: 'Get started',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 19.99,
    yearly: 13.33,
    yearlyTotal: 159,
    popular: true,
    features: ['Everything in Starter', 'Full video lesson library', 'Business & pricing guides', 'Community access'],
    locked: ['Live 1-on-1 support'],
    cta: 'Get started',
  },
  {
    id: 'expert',
    name: 'Expert',
    monthly: 49.99,
    yearly: 33.33,
    yearlyTotal: 399,
    features: ['Everything in Pro', 'Live 1-on-1 support sessions', 'Priority email response', 'Private community channel', 'Limited to 20 members', 'Direct founder access'],
    locked: [],
    cta: 'Apply for access',
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoMark}>⚡</div>
          <span>Farm<em>Flow</em></span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className={styles.navCta}>Get started</Link>
        </div>
      </nav>

      <div className={styles.header}>
        <div className={styles.eyebrow}>Simple pricing</div>
        <h1 className={styles.title}>One subscription.<br /><strong>Everything included.</strong></h1>

        <div className={styles.toggle}>
          <button className={!yearly ? styles.toggleActive : ''} onClick={() => setYearly(false)}>Monthly</button>
          <button className={yearly ? styles.toggleActive : ''} onClick={() => setYearly(true)}>
            Yearly <span className={styles.saveBadge}>save 33%</span>
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {PLANS.map(plan => (
          <div key={plan.id} className={`${styles.card} ${plan.popular ? styles.popular : ''}`}>
            {plan.popular && <div className={styles.popularBadge}>Most popular</div>}
            <div className={styles.planName}>{plan.name}</div>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{yearly ? Math.floor(plan.yearly) : Math.floor(plan.monthly)}</span>
              <span className={styles.period}>.{yearly ? (plan.yearly % 1).toFixed(2).slice(2) : (plan.monthly % 1).toFixed(2).slice(2)} / mo</span>
            </div>
            {yearly && <div className={styles.yearlyNote}>Billed ${plan.yearlyTotal}/year</div>}
            {!yearly && <div className={styles.yearlyNote}>&nbsp;</div>}

            <div className={styles.divider} />

            <ul className={styles.features}>
              {plan.features.map(f => (
                <li key={f}><span className={styles.check}>✓</span>{f}</li>
              ))}
              {plan.locked.map(f => (
                <li key={f} className={styles.lockedFeat}><span className={styles.dash}>—</span>{f}</li>
              ))}
            </ul>

            <Link to="/register" className={`${styles.cta} ${plan.popular ? styles.ctaPrimary : ''}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <Link to="/">← Back to home</Link>
      </div>
    </div>
  )
}
