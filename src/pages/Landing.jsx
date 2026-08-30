  import { Link } from 'react-router-dom'
  import styles from './Landing.module.css'

  const FEATURES = [
    {
      id: 'gcode',
      emoji: '⚡',
      plan: 'Starter',
      planColor: '#d4501f',
      title: 'G-Code Auto-Eject Generator',
      headline: 'Your printer runs itself. You do something else.',
      desc: `Most Bambu Lab sellers spend more time standing next to their printer than they think. You hit print, wait, take the part off, hit print again. Repeat. All day.

  FarmFlow generates a custom G-code snippet you paste once into Bambu Studio. From that moment, every single print — no matter what you're printing — ejects automatically when it's done cooling. The plate resets. The printer is ready for the next job.

  You paste the code once. You never touch it again.`,
      bullets: [
        'Works on A1 Mini, A1, P1S and X1C',
        'Configurable cooling time per material',
        'Code stays active for all future prints',
        'Step-by-step install guide included',
      ],
      highlight: 'Set up in under 5 minutes. Runs forever.',
      side: 'left',
    },
    {
      id: 'calculator',
      emoji: '💰',
      plan: 'Free',
      planColor: '#3B6D11',
      title: 'Cost & Sale Calculator',
      headline: 'Find out what your prints actually cost. Most sellers are wrong.',
      desc: `Ask most 3D print sellers how much a print costs and they'll say the filament price. That's it. They forget electricity, printer wear, packaging, their own time.

  The FarmFlow Cost Calculator breaks it down completely — filament per gram, electricity per hour, amortization of the printer, packaging materials, and shipping. Enter your target profit margin and it tells you exactly what to charge.

  It also runs a profit simulator — enter how many units you want to sell and it calculates your monthly revenue, total costs, and net profit. Know your numbers before you set a price, not after.`,
      bullets: [
        'Filament cost by weight and material',
        'Electricity cost per print hour',
        'Printer amortization over expected lifespan',
        'Packaging and shipping included',
        'Profit margin simulator',
        '100% free — no account needed',
      ],
      highlight: 'The only calculator built specifically for Bambu Lab sellers.',
      side: 'right',
    },
    {
      id: 'profit',
      emoji: '📈',
      plan: 'Starter',
      planColor: '#d4501f',
      title: 'Profit Dashboard',
      headline: 'Revenue is vanity. Profit is sanity. Track the right number.',
      desc: `Most sellers track revenue. They know how much money came in. What they don't know is how much went out — and what's left.

  The FarmFlow Profit Dashboard logs every sale with a complete cost breakdown: print cost per unit, packaging, shipping, platform fees, and any other expenses. It calculates your real profit automatically. Not estimated, not approximated — calculated from the numbers you enter.

  You can also log ad spend retroactively for any date. Ran a Facebook campaign last Tuesday? Add it to that day. The dashboard recalculates everything so you always see the full picture.`,
      bullets: [
        'Log sales with full cost breakdown',
        'Packaging and shipping per unit, fees as totals',
        'Ad spend tracking — add to any past date',
        'Real profit after all costs',
        'Average margin across all sales',
        '7-day chart with revenue, cost and profit',
      ],
      highlight: 'Know your real profit after every sale, not at the end of the month.',
      side: 'left',
    },
    {
      id: 'history',
      emoji: '📅',
      plan: 'Starter',
      planColor: '#d4501f',
      title: 'Sales History & Calendar',
      headline: 'Go back to any day. Add, edit, fix. Your records stay accurate.',
      desc: `Sales don't always get logged the moment they happen. A customer pays on Tuesday, the order ships Thursday, you log it Friday. Or a return comes in two weeks later and you need to adjust the numbers for that original sale.

  FarmFlow keeps a full calendar of every day you've made a sale. Click any day to see everything logged on that date — sales and ad spend. Edit any entry. Add a sale to a past date. Remove something that was logged wrong.

  At the top of each month, you get a summary — total revenue, total costs, net profit, and units sold for that calendar month. Clean, accurate, always up to date.`,
      bullets: [
        'Visual calendar with dot markers on active days',
        'Click any day to see full detail',
        'Edit or remove any past sale',
        'Add sales retroactively to any date',
        'Monthly summary — revenue, costs, profit, units',
      ],
      highlight: 'Your records reflect reality, not just what you remembered to log.',
      side: 'right',
    },
    {
      id: 'inventory',
      emoji: '🧵',
      plan: 'Pro',
      planColor: '#2563eb',
      title: 'Filament Inventory Tracker',
      headline: 'Never run out of filament mid-job again.',
      desc: `Running out of filament when you have orders to fill is one of the most avoidable problems in print farming. It happens because nobody tracks it carefully — until FarmFlow.

  The Inventory Tracker keeps every spool organized by material type, brand and color. Each spool shows exactly how much is remaining, the total you've bought, how much you've paid, and the cost per gram. When a spool drops below 30% remaining, it's automatically flagged as low stock.

  When you use filament, log it with a quick update — subtract grams, add a new spool, or set the remaining amount manually. Every entry goes into the spool's history so you can see exactly how it was used over time.`,
      bullets: [
        'Track every spool by type, brand and color',
        'Real-time remaining filament per spool',
        'Cost per gram automatically calculated',
        'Low stock alert at 30% remaining',
        'Full usage history per spool',
        'Grouped by material type — PLA, PETG, ABS, ASA, TPU',
      ],
      highlight: 'Know what you have, what it costs, and when to reorder — before it\'s too late.',
      side: 'left',
    },
    {
      id: 'orders',
      emoji: '🛒',
      plan: 'Pro',
      planColor: '#2563eb',
      title: 'Order List',
      headline: 'One click to add filament to your shopping list when stock runs low.',
      desc: `When a spool hits low stock, FarmFlow shows an Order button right on the spool card. Click it, choose how many kilograms you need — 1, 2, 3, 5, or 10 — and it goes straight to your order list.

  The order list lives in its own tab. You can see everything you need to buy at a glance — material, brand, color, and quantity. When you've placed the order, check it off. It stays in the list with a strikethrough so you remember what was ordered. Remove it when the filament arrives.

  No more trying to remember what you need to order. No sticky notes. No mental list. One place, always up to date.`,
      bullets: [
        'Order button appears automatically on low-stock spools',
        'Choose quantity in kg per order',
        'Dedicated order list tab',
        'Check off when ordered',
        'Badge shows number of pending orders',
      ],
      highlight: 'From low stock alert to order list in one click.',
      side: 'right',
    },
    {
      id: 'shipping',
      emoji: '📦',
      plan: 'Pro',
      planColor: '#2563eb',
      title: 'Order Management & Shipping',
      headline: 'Create shipments, print labels, track every package.',
      desc: `When you're filling multiple orders a week, keeping track of who gets what and what's been sent becomes a real job. Pieces of paper, notes in your phone, messages you have to scroll back to find. It adds up.

  FarmFlow's Order Management gives you a clean system from package to delivery. Create a shipment with the recipient's name, address, postal code, and country. Add a cash-on-delivery amount if they're paying on receipt, or an IBAN if you need to refund electronically. Link it to a recent sale from your Profit Dashboard so everything stays connected.

  When it's ready to send, mark it as sent. Add the tracking number when you have it. When it's delivered — or returned — update the status. Every shipment stays in your history forever.

  And when you need to hand over the details at the post office — print a clean A4 label directly from FarmFlow. Recipient name, address, contents, COD amount, IBAN if applicable. Everything the postal worker needs, formatted and ready.`,
      bullets: [
        'Create shipments with full recipient details',
        'Cash-on-delivery amount and IBAN for refunds',
        'Link shipment to a sale from Profit Dashboard',
        'Status tracking: Pending → Sent → Delivered / Returned',
        'Add tracking number after sending',
        'Print-ready A4 shipping label',
        'Full dispatch history — searchable and permanent',
      ],
      highlight: 'From packed box to delivered — tracked, labeled, and logged.',
      side: 'left',
    },
  ]

  export default function Landing() {
    return (
      <div className={styles.page}>

        {/* NAV */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoMark}>⚡</div>
            <span>Farm<em>Flow</em></span>
          </Link>
          <div className={styles.navLinks}>
            <Link to="/pricing" className={styles.navPricing}>Pricing</Link>
            <Link to="/login" className={styles.navSignIn}>Sign in</Link>
            <Link to="/register" className={styles.navCta}>Get started free</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroEye}>3D Print Farm Automation</div>
          <h1 className={styles.heroTitle}>
            Everything you need<br />
            to run a <em>print farm business.</em>
          </h1>
          <p className={styles.heroSub}>
            FarmFlow is the only tool built specifically for Bambu Lab sellers — auto-eject, cost tracking, profit dashboard, inventory management, and shipping. All in one place. Starting at $9.99/month.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.btnPrimary}>Start for free →</Link>
            <Link to="/pricing" className={styles.btnSecondary}>See all plans</Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>7</div>
              <div className={styles.statLabel}>Tools in one app</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>Free</div>
              <div className={styles.statLabel}>Cost calculator</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>$9.99</div>
              <div className={styles.statLabel}>Starter plan/month</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>A1–X1C</div>
              <div className={styles.statLabel}>All Bambu printers</div>
            </div>
          </div>
        </section>

        {/* QUICK FEATURE STRIP */}
        <section className={styles.strip}>
          {[
            { e: '⚡', t: 'Auto-Eject Generator' },
            { e: '💰', t: 'Cost Calculator' },
            { e: '📈', t: 'Profit Dashboard' },
            { e: '📅', t: 'Sales History' },
            { e: '🧵', t: 'Inventory Tracker' },
            { e: '🛒', t: 'Order List' },
            { e: '📦', t: 'Shipping Management' },
          ].map(f => (
            <div key={f.t} className={styles.stripItem}>
              <span className={styles.stripEmoji}>{f.e}</span>
              <span className={styles.stripLabel}>{f.t}</span>
            </div>
          ))}
        </section>

        {/* 7 FEATURE SECTIONS */}
        {FEATURES.map((f, i) => (
          <section key={f.id} className={`${styles.featureSection} ${i % 2 === 0 ? styles.featureSectionAlt : ''}`}>
            <div className={styles.featureSectionInner}>
              <div className={styles.featureSectionContent}>
                <div className={styles.featureMeta}>
                  <span className={styles.featureEmoji}>{f.emoji}</span>
                  <span className={styles.featurePlanBadge} style={{ background: f.planColor + '18', color: f.planColor, border: `1px solid ${f.planColor}30` }}>
                    {f.plan} plan
                  </span>
                </div>
                <h2 className={styles.featureSectionTitle}>{f.title}</h2>
                <div className={styles.featureSectionHeadline}>{f.headline}</div>
                <div className={styles.featureSectionDesc}>
                  {f.desc.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
                <ul className={styles.featureBullets}>
                  {f.bullets.map(b => (
                    <li key={b}>
                      <span className={styles.bulletCheck}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className={styles.featureHighlight}>{f.highlight}</div>
              </div>

              <div className={styles.featureSectionVisual}>
                <div className={styles.visualCard}>
                  <div className={styles.visualEmoji}>{f.emoji}</div>
                  <div className={styles.visualTitle}>{f.title}</div>
                  <div className={styles.visualDivider} />
                  <div className={styles.visualBullets}>
                    {f.bullets.slice(0, 4).map(b => (
                      <div key={b} className={styles.visualBullet}>
                        <span style={{ color: f.planColor, fontWeight: '600', marginRight: '8px' }}>✓</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/register" className={styles.visualCta} style={{ background: f.planColor }}>
                    Try it free →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* SOCIAL PROOF */}
        <section className={styles.proofSection}>
          <div className={styles.proofInner}>
            <div className={styles.proofEye}>Built for real sellers</div>
            <h2 className={styles.proofTitle}>The problems FarmFlow solves</h2>
            <div className={styles.proofGrid}>
              {[
                { problem: '"I stand next to my printer waiting for prints to finish."', solution: 'Auto-eject handles it. Walk away.' },
                { problem: '"I don\'t know if I\'m actually making money."', solution: 'Profit Dashboard shows real profit after every cost.' },
                { problem: '"I ran out of filament mid-job and didn\'t notice."', solution: 'Low stock alerts and one-click order list.' },
                { problem: '"I have no idea what to charge for my prints."', solution: 'Cost Calculator with profit margin simulator.' },
                { problem: '"Keeping track of shipments is a mess."', solution: 'Order Management from pack to delivery.' },
                { problem: '"I find out my numbers at the end of the month."', solution: 'Real-time dashboard, every day.' },
              ].map((item, i) => (
                <div key={i} className={styles.proofCard}>
                  <div className={styles.proofProblem}>"{item.problem.replace(/^"|"$/g, '')}"</div>
                  <div className={styles.proofArrow}>↓</div>
                  <div className={styles.proofSolution}>{item.solution}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SUMMARY */}
        <section className={styles.pricingStrip}>
          <div className={styles.pricingStripInner}>
            <div className={styles.pricingStripTitle}>Simple pricing. No lock-in. Cancel anytime.</div>
            <div className={styles.pricingStripPlans}>
              {[
                { name: 'Free', price: '$0', desc: 'Cost Calculator', color: '#3B6D11' },
                { name: 'Starter', price: '$9.99/mo', desc: 'G-Code + Profit Dashboard', color: '#d4501f' },
                { name: 'Pro', price: '$19.99/mo', desc: 'Inventory + Shipping + Orders', color: '#2563eb' },
                { name: 'Expert', price: '$49.99/mo', desc: 'Everything + Live Support', color: '#7c3aed' },
              ].map(plan => (
                <div key={plan.name} className={styles.pricingStripPlan}>
                  <div className={styles.pricingStripName} style={{ color: plan.color }}>{plan.name}</div>
                  <div className={styles.pricingStripPrice}>{plan.price}</div>
                  <div className={styles.pricingStripDesc}>{plan.desc}</div>
                </div>
              ))}
            </div>
            <Link to="/pricing" className={styles.pricingStripBtn}>See full comparison →</Link>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaEye}>Ready to start?</div>
            <h2 className={styles.ctaTitle}>
              Your printer should work for you.<br />
              <strong>Not the other way around.</strong>
            </h2>
            <p className={styles.ctaDesc}>
              The Cost Calculator is free forever. No credit card needed to start. Upgrade when you're ready.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/register" className={styles.ctaBtn}>Create free account →</Link>
              <Link to="/pricing" className={styles.ctaBtnSecondary}>View pricing</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerLogo}>
            <div className={styles.footerLogoMark}>⚡</div>
            <span>Farm<em>Flow</em></span>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/pricing">Pricing</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Get started</Link>
          </div>
          <div className={styles.footerCopy}>© 2025 FarmFlow. Built for Bambu Lab sellers.</div>
        </footer>

      </div>
    )
  }
