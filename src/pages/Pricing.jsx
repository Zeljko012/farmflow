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
    checkoutUrl: 'https://farmflow.lemonsqueezy.com/checkout/buy/c9f4ff8e-2c39-4a81-b6d7-d8a8e61a167c',
    color: '#d4501f',
    bg: '#fdf0ec',
    emoji: '⚡',
    tagline: 'For sellers who want to stop babysitting their printer',
    pitch: 'You bought a Bambu Lab printer to make money — not to stand next to it all day. With Starter, you set up auto-eject once and your printer runs itself. Plus you finally know if you\'re actually making a profit.',
    features: [
      { icon: '⚡', title: 'G-Code Auto-Eject Generator', desc: 'Paste our code once into Bambu Studio. Every print — whatever you\'re making — ejects automatically when done. Walk away and come back to finished parts.' },
      { icon: '💰', title: 'Cost & Sale Calculator', desc: 'Calculate the real cost of every print including filament, electricity, amortization and packaging. Never underprice again.' },
      { icon: '📈', title: 'Profit Dashboard', desc: 'Log every sale with a full cost breakdown — print cost, packaging, shipping, platform fees and ad spend. See your actual profit, not just revenue.' },
      { icon: '📅', title: 'Sales History & Calendar', desc: 'Go back to any day and add, edit or remove sales retroactively. Perfect for when a return comes in or an order arrives late.' },
    ],
    cta: 'Start with Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 19.99,
    yearly: 13.33,
    yearlyTotal: 159,
    popular: true,
    checkoutUrl: 'https://farmflow.lemonsqueezy.com/checkout/buy/bf88084c-5bbb-4717-a969-f10f52e4222e',
    color: '#2563eb',
    bg: '#eff6ff',
    emoji: '🚀',
    tagline: 'For serious sellers running a real print business',
    pitch: 'You\'re past the hobbyist stage. You have multiple spools, regular orders and customers waiting. Pro gives you the tools to run your print farm like a business — inventory, shipping, orders, all in one place.',
    features: [
      { icon: '🧵', title: 'Filament Inventory Tracker', desc: 'Track every spool by material, brand and color. See exactly how much is left, what it costs per gram, and get alerts when stock runs low.' },
      { icon: '🛒', title: 'Order List', desc: 'When a spool hits 30% remaining, one click adds it to your order list with the quantity you need. Never run out mid-job again.' },
      { icon: '📦', title: 'Order Management & Shipping', desc: 'Create shipments with recipient details, COD amount and IBAN for refunds. Mark as sent, add tracking numbers and print a ready-to-use A4 shipping label.' },
      { icon: '📋', title: 'Dispatch History', desc: 'Full history of every shipment — who got what, when it was sent, tracking number and status. If something gets lost, you have the paper trail.' },
      { icon: '🎬', title: 'Video Lessons', desc: 'Step-by-step guides for scaling your print business. From setting up automation to pricing for profit. Coming soon.' },
      { icon: '✅', title: 'Everything in Starter', desc: 'All Starter features included — G-Code generator, cost calculator, profit dashboard and full sales history.' },
    ],
    cta: 'Start with Pro',
  },
  {
    id: 'expert',
    name: 'Expert',
    monthly: 49.99,
    yearly: 33.33,
    yearlyTotal: 399,
    checkoutUrl: 'https://farmflow.lemonsqueezy.com/checkout/buy/ccd56926-2843-40f7-b3fc-d9d7f8dfcd55',
    color: '#7c3aed',
    bg: '#f5f3ff',
    emoji: '💬',
    tagline: 'For print farm owners who want direct expert help',
    pitch: 'Sometimes you hit a wall — a print keeps failing, you don\'t know what to charge, or you want to scale but don\'t know how. Expert gives you direct access to the FarmFlow founder to get unstuck fast. Limited to 20 members.',
    features: [
      { icon: '👤', title: 'Direct 1-on-1 Support', desc: 'Book a live video session with the FarmFlow founder. Get real answers to real problems — not generic advice from a forum.' },
      { icon: '📧', title: 'Priority Email Response', desc: 'Send any question by email and get a detailed personal response within 24 hours. No tickets, no bots.' },
      { icon: '🔒', title: 'Private Community Channel', desc: 'Access a private group with other Expert members. Share what\'s working, ask questions and learn from other serious sellers.' },
      { icon: '⚡', title: 'Limited to 20 members', desc: 'To keep quality high, Expert is capped at 20 active members. If it\'s full, you\'ll be added to the waitlist.' },
      { icon: '✅', title: 'Everything in Pro', desc: 'All Pro features included — inventory, order management, shipping labels, video lessons and everything in Starter.' },
    ],
    cta: 'Apply for Expert',
  },
]

const FAQ = [
  { q: 'Do I need any technical knowledge to use FarmFlow?', a: 'No. The G-Code generator gives you a snippet you paste once into Bambu Studio. The rest is a clean dashboard — no coding, no setup, just fill in your numbers.' },
  { q: 'Which Bambu Lab printers are supported?', a: 'FarmFlow supports the A1 Mini, A1, P1S and X1C. The G-code is generated specifically for your printer\'s bed dimensions and power specs.' },
  { q: 'Can I cancel at any time?', a: 'Yes. No contracts, no lock-in. Cancel from your Lemon Squeezy dashboard anytime and you keep access until the end of your billing period.' },
  { q: 'Is my data safe?', a: 'All data is stored in Supabase with Row Level Security enabled — meaning only you can see your sales, inventory and shipments. We never share your data.' },
  { q: 'What if I upgrade later?', a: 'You can upgrade from Starter to Pro or Expert at any time. You\'ll only pay the difference for the remaining period.' },
  { q: 'Is the yearly plan worth it?', a: 'If you\'re using FarmFlow regularly, yes — you save 33% compared to monthly. Starter yearly is $79 instead of $120, Pro is $159 instead of $240.' },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoMark}>⚡</div>
          <span>Farm<em>Flow</em></span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className={styles.navCta}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className={styles.header}>
        <div className={styles.eyebrow}>Simple, transparent pricing</div>
        <h1 className={styles.title}>
          The tools serious<br />
          <strong>3D print sellers use.</strong>
        </h1>
        <p className={styles.headerSub}>
          Auto-eject, profit tracking, inventory management and shipping — all in one place. Cancel anytime.
        </p>
        <div className={styles.toggle}>
          <button className={!yearly ? styles.toggleActive : ''} onClick={() => setYearly(false)}>Monthly</button>
          <button className={yearly ? styles.toggleActive : ''} onClick={() => setYearly(true)}>
            Yearly <span className={styles.saveBadge}>save 33%</span>
          </button>
        </div>
      </div>

      {/* PLAN CARDS */}
      <div className={styles.grid}>
        {PLANS.map(plan => (
          <div key={plan.id} className={`${styles.card} ${plan.popular ? styles.popular : ''}`}>
            {plan.popular && <div className={styles.popularBadge}>Most popular</div>}

            {/* PLAN HEADER */}
            <div className={styles.planHeader} style={{ background: plan.bg }}>
              <div className={styles.planEmoji}>{plan.emoji}</div>
              <div className={styles.planName} style={{ color: plan.color }}>{plan.name}</div>
              <div className={styles.planTagline}>{plan.tagline}</div>
            </div>

            {/* PRICE */}
            <div className={styles.priceRow}>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{yearly ? plan.yearly.toFixed(2).split('.')[0] : plan.monthly.toFixed(2).split('.')[0]}</span>
                <span className={styles.cents}>.{yearly ? plan.yearly.toFixed(2).split('.')[1] : plan.monthly.toFixed(2).split('.')[1]}</span>
                <span className={styles.period}>/ mo</span>
              </div>
              {yearly
                ? <div className={styles.yearlyNote}>Billed ${plan.yearlyTotal}/year</div>
                : <div className={styles.yearlyNote}>&nbsp;</div>
              }
            </div>

            {/* PITCH */}
            <p className={styles.pitch}>{plan.pitch}</p>

            <div className={styles.divider} />

            {/* FEATURES */}
            <div className={styles.featureList}>
              {plan.features.map(f => (
                <div key={f.title} className={styles.featureItem}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <div className={styles.featureText}>
                    <div className={styles.featureTitle}>{f.title}</div>
                    <div className={styles.featureDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={plan.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} ${plan.popular ? styles.ctaPrimary : ''}`}
              style={plan.popular ? {} : { borderColor: plan.color, color: plan.color }}
            >
              {plan.cta} →
            </a>
          </div>
        ))}
      </div>

      {/* FREE PLAN NOTE */}
      <div className={styles.freeNote}>
        <div className={styles.freeNoteInner}>
          <div className={styles.freeNoteIcon}>🆓</div>
          <div>
            <div className={styles.freeNoteTitle}>Start for free — no credit card needed</div>
            <div className={styles.freeNoteDesc}>The Cost & Sale Calculator is completely free. Create an account and use it as long as you want before deciding to upgrade.</div>
          </div>
          <Link to="/register" className={styles.freeNoteCta}>Create free account →</Link>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className={styles.compareWrap}>
        <div className={styles.compareTitle}>Everything compared</div>
        <div className={styles.compareTable}>
          <div className={styles.compareHeader}>
            <div className={styles.compareFeatureCol}>Feature</div>
            <div className={styles.comparePlanCol}>Free</div>
            <div className={styles.comparePlanCol}>Starter</div>
            <div className={styles.comparePlanCol} style={{ color: '#2563eb', fontWeight: '600' }}>Pro</div>
            <div className={styles.comparePlanCol}>Expert</div>
          </div>
          {[
            ['Cost & Sale Calculator', true, true, true, true],
            ['G-Code Auto-Eject Generator', false, true, true, true],
            ['Profit Dashboard', false, true, true, true],
            ['Sales History & Calendar', false, true, true, true],
            ['Ad Spend Tracking', false, true, true, true],
            ['Filament Inventory Tracker', false, false, true, true],
            ['Low Stock Alerts & Order List', false, false, true, true],
            ['Order Management & Shipping', false, false, true, true],
            ['A4 Print-Ready Shipping Labels', false, false, true, true],
            ['Dispatch History', false, false, true, true],
            ['Video Lessons', false, false, true, true],
            ['1-on-1 Live Support', false, false, false, true],
            ['Priority Email Response', false, false, false, true],
            ['Private Community Channel', false, false, false, true],
          ].map(([feature, ...vals]) => (
            <div key={feature} className={styles.compareRow}>
              <div className={styles.compareFeatureCol}>{feature}</div>
              {vals.map((v, i) => (
                <div key={i} className={styles.comparePlanCol}>
                  {v
                    ? <span className={styles.checkYes}>✓</span>
                    : <span className={styles.checkNo}>—</span>
                  }
                </div>
              ))}
            </div>
          ))}
          <div className={styles.compareFooter}>
            <div className={styles.compareFeatureCol}></div>
            <div className={styles.comparePlanCol}><Link to="/register" className={styles.compareBtn}>Free</Link></div>
            <div className={styles.comparePlanCol}><a href="https://farmflow.lemonsqueezy.com/checkout/buy/c9f4ff8e-2c39-4a81-b6d7-d8a8e61a167c" className={styles.compareBtn} target="_blank" rel="noopener noreferrer">$9.99</a></div>
            <div className={styles.comparePlanCol}><a href="https://farmflow.lemonsqueezy.com/checkout/buy/bf88084c-5bbb-4717-a969-f10f52e4222e" className={`${styles.compareBtn} ${styles.compareBtnPrimary}`} target="_blank" rel="noopener noreferrer">$19.99</a></div>
            <div className={styles.comparePlanCol}><a href="https://farmflow.lemonsqueezy.com/checkout/buy/ccd56926-2843-40f7-b3fc-d9d7f8dfcd55" className={styles.compareBtn} target="_blank" rel="noopener noreferrer">$49.99</a></div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faqWrap}>
        <div className={styles.faqTitle}>Frequently asked questions</div>
        <div className={styles.faqList}>
          {FAQ.map((item, i) => (
            <div key={i} className={styles.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className={styles.faqQ}>
                <span>{item.q}</span>
                <span className={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</span>
              </div>
              {openFaq === i && <div className={styles.faqA}>{item.a}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Link to="/">← Back to home</Link>
        <span>·</span>
        <Link to="/register">Create free account</Link>
      </div>
    </div>
  )
}
