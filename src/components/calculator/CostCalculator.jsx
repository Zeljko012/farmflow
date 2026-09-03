import { useState } from 'react'
import styles from './CostCalculator.module.css'

const PRINTER_DATA = {
  custom:  { cost: 300,  watts: 150 },
  a1mini:  { cost: 299,  watts: 120 },
  a1:      { cost: 449,  watts: 150 },
  p1s:     { cost: 699,  watts: 200 },
  x1c:     { cost: 999,  watts: 220 },
}

export default function CostCalculator() {
  const [tab, setTab] = useState('cost')

  // Cost inputs
  const [weight, setWeight] = useState(85)
  const [filPrice, setFilPrice] = useState(22)
  const [hours, setHours] = useState(3)
  const [elec, setElec] = useState(0.12)
  const [printerModel, setPrinterModel] = useState('a1mini')
  const [printerCost, setPrinterCost] = useState(299)
  const [lifespan, setLifespan] = useState(5000)
  const [boxCost, setBoxCost] = useState(0.50)
  const [packMat, setPackMat] = useState(0.20)

  // Sale inputs
  const [laborRate, setLaborRate] = useState(15)
  const [laborHrs, setLaborHrs] = useState(0.5)
  const [platFee, setPlatFee] = useState(6.5)
  const [margin, setMargin] = useState(40)
  const [unitsDay, setUnitsDay] = useState(8)
  const [daysMonth, setDaysMonth] = useState(25)
  const [target, setTarget] = useState(500)

  // What-if slider
  const [whatIfPrice, setWhatIfPrice] = useState(null)

  const watts = PRINTER_DATA[printerModel]?.watts || 150
  const filCost = (weight / 1000) * filPrice
  const elecCost = hours * (watts / 1000) * elec
  const amorCost = lifespan > 0 ? (printerCost / lifespan) * hours : 0
  const packCost = parseFloat(boxCost) + parseFloat(packMat)
  const totalCost = filCost + elecCost + amorCost + packCost

  const labor = laborRate * laborHrs
  const base = totalCost + labor
  const suggestedPrice = base / (1 - (margin / 100) - (platFee / 100))
  const feeAmt = suggestedPrice * (platFee / 100)
  const profit = suggestedPrice - base - feeAmt
  const monthlyProfit = profit * unitsDay * daysMonth
  const unitsNeeded = target / Math.max(profit, 0.01)
  const daysNeeded = unitsNeeded / Math.max(unitsDay, 1)
  const barPct = Math.min(100, Math.max(0, Math.round((profit / Math.max(suggestedPrice, 0.01)) * 100)))

  // What-if calculations
  const sliderMin = Math.max(0.01, parseFloat((base * 0.5).toFixed(2)))
  const sliderMax = parseFloat((base * 4).toFixed(2))
  const activePrice = whatIfPrice !== null ? whatIfPrice : suggestedPrice
  const wiFeePct = platFee / 100
  const wiFeeAmt = activePrice * wiFeePct
  const wiProfit = activePrice - base - wiFeeAmt
  const wiMargin = activePrice > 0 ? Math.round((wiProfit / activePrice) * 100) : 0
  const wiMonthly = wiProfit * unitsDay * daysMonth
  const wiBarPct = Math.min(100, Math.max(0, Math.round((wiProfit / Math.max(activePrice, 0.01)) * 100)))

  // Min price for 60% margin
  const priceFor60 = base / (1 - 0.60 - wiFeePct)

  function handlePrinterChange(model) {
    setPrinterModel(model)
    if (PRINTER_DATA[model]?.cost) setPrinterCost(PRINTER_DATA[model].cost)
  }

  function initSlider() {
    if (whatIfPrice === null) setWhatIfPrice(parseFloat(suggestedPrice.toFixed(2)))
  }

  const profitColor = (p) => p > 0 ? (p / activePrice >= 0.35 ? '#3B6D11' : '#854F0B') : '#dc2626'

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Profit Tools</div>
        <h1 className={styles.title}>Cost & Sale Calculator</h1>
        <p className={styles.sub}>Know exactly what every print costs and what to charge to hit your profit goals.</p>
      </div>

      <div className={styles.shell}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'cost' ? styles.active : ''}`} onClick={() => setTab('cost')}>
            💰 Cost calculator
          </button>
          <button className={`${styles.tab} ${tab === 'sale' ? styles.active : ''}`} onClick={() => setTab('sale')}>
            📈 Sale price
          </button>
          <button className={`${styles.tab} ${tab === 'whatif' ? styles.active : ''}`} onClick={() => { setTab('whatif'); initSlider() }}>
            🎯 What-if pricing
          </button>
        </div>

        {/* COST TAB */}
        {tab === 'cost' && (
          <div className={styles.body}>
            <div className={styles.sectionLabel}>Print details</div>
            <div className={styles.grid2}>
              <div className={styles.field}><label>Filament weight (g)</label><input type="number" value={weight} min="1" onChange={e => setWeight(e.target.value)} /></div>
              <div className={styles.field}><label>Filament price ($/kg)</label><input type="number" value={filPrice} min="1" step="0.5" onChange={e => setFilPrice(e.target.value)} /></div>
              <div className={styles.field}><label>Print time (hours)</label><input type="number" value={hours} min="0.1" step="0.1" onChange={e => setHours(e.target.value)} /></div>
              <div className={styles.field}><label>Electricity rate ($/kWh)</label><input type="number" value={elec} min="0.01" step="0.01" onChange={e => setElec(e.target.value)} /></div>
            </div>

            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Printer amortization</div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Printer model</label>
                <select value={printerModel} onChange={e => handlePrinterChange(e.target.value)}>
                  <option value="custom">Custom</option>
                  <option value="a1mini">Bambu A1 Mini</option>
                  <option value="a1">Bambu A1</option>
                  <option value="p1s">Bambu P1S</option>
                  <option value="x1c">Bambu X1C</option>
                </select>
              </div>
              <div className={styles.field}><label>Printer cost ($)</label><input type="number" value={printerCost} min="1" onChange={e => setPrinterCost(e.target.value)} /></div>
              <div className={styles.field}><label>Lifespan (hrs)</label><input type="number" value={lifespan} min="100" step="100" onChange={e => setLifespan(e.target.value)} /></div>
            </div>

            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Packaging costs</div>
            <div className={styles.grid2}>
              <div className={styles.field}><label>Box / packaging ($)</label><input type="number" value={boxCost} min="0" step="0.05" onChange={e => setBoxCost(e.target.value)} /></div>
              <div className={styles.field}><label>Packaging material ($)</label><input type="number" value={packMat} min="0" step="0.05" onChange={e => setPackMat(e.target.value)} /></div>
            </div>

            <div className={styles.results}>
              <div className={styles.resultCard}><div className={styles.rl}>Filament</div><div className={styles.rv}>${filCost.toFixed(2)}</div></div>
              <div className={styles.resultCard}><div className={styles.rl}>Electricity</div><div className={styles.rv}>${elecCost.toFixed(2)}</div></div>
              <div className={styles.resultCard}><div className={styles.rl}>Amortization</div><div className={styles.rv}>${amorCost.toFixed(2)}</div></div>
              <div className={styles.resultCard}><div className={styles.rl}>Packaging</div><div className={styles.rv}>${packCost.toFixed(2)}</div></div>
              <div className={`${styles.resultCard} ${styles.highlight}`}><div className={styles.rl}>Total cost</div><div className={styles.rv}>${totalCost.toFixed(2)}</div></div>
            </div>
          </div>
        )}

        {/* SALE TAB */}
        {tab === 'sale' && (
          <div className={styles.body}>
            <div className={styles.sectionLabel}>Pricing inputs</div>
            <div className={styles.grid2}>
              <div className={styles.field}><label>Labor rate ($/hr)</label><input type="number" value={laborRate} min="0" onChange={e => setLaborRate(e.target.value)} /></div>
              <div className={styles.field}><label>Labor time (hrs)</label><input type="number" value={laborHrs} min="0" step="0.1" onChange={e => setLaborHrs(e.target.value)} /></div>
              <div className={styles.field}><label>Platform fee (%)</label><input type="number" value={platFee} min="0" max="50" step="0.5" onChange={e => setPlatFee(e.target.value)} /></div>
              <div className={styles.field}><label>Desired margin (%)</label><input type="number" value={margin} min="5" max="90" step="5" onChange={e => setMargin(e.target.value)} /></div>
            </div>

            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Monthly profit simulator</div>
            <div className={styles.grid3}>
              <div className={styles.field}><label>Units per day</label><input type="number" value={unitsDay} min="1" onChange={e => setUnitsDay(e.target.value)} /></div>
              <div className={styles.field}><label>Days per month</label><input type="number" value={daysMonth} min="1" max="31" onChange={e => setDaysMonth(e.target.value)} /></div>
              <div className={styles.field}><label>Monthly target ($)</label><input type="number" value={target} min="1" step="50" onChange={e => setTarget(e.target.value)} /></div>
            </div>

            <div className={styles.saleResults}>
              <div className={styles.breakdown}>
                <div className={styles.breakdownTitle}>Price breakdown</div>
                <div className={styles.bRow}><span>Print cost</span><span>${(filCost+elecCost+amorCost).toFixed(2)}</span></div>
                <div className={styles.bRow}><span>Packaging</span><span>${packCost.toFixed(2)}</span></div>
                <div className={styles.bRow}><span>Labor</span><span>${labor.toFixed(2)}</span></div>
                <div className={styles.bRow}><span>Platform fee</span><span>${feeAmt.toFixed(2)}</span></div>
                <div className={styles.bRow}><span>Your profit/unit</span><span>${profit.toFixed(2)}</span></div>
                <div className={`${styles.bRow} ${styles.bTotal}`}><span>Suggested price</span><span style={{color:'var(--accent)',fontSize:'18px'}}>${suggestedPrice.toFixed(2)}</span></div>
                <div className={styles.barWrap}>
                  <div className={styles.barLabel}><span>Margin</span><span>{barPct}%</span></div>
                  <div className={styles.barBg}><div className={styles.barFill} style={{width:`${barPct}%`, background: barPct < 20 ? '#E24B4A' : barPct < 35 ? '#BA7517' : '#2d7a3a'}} /></div>
                </div>
              </div>
              <div className={styles.simulator}>
                <div className={styles.simTitle}>To reach your ${Math.round(target)}/month goal</div>
                <div className={styles.simGrid}>
                  <div className={styles.simItem}><div className={styles.simVal}>{Math.ceil(unitsNeeded)}</div><div className={styles.simLbl}>units needed</div></div>
                  <div className={styles.simItem}><div className={styles.simVal}>{Math.ceil(daysNeeded)}</div><div className={styles.simLbl}>days at your rate</div></div>
                  <div className={styles.simItem}><div className={styles.simVal}>${Math.round(monthlyProfit).toLocaleString()}</div><div className={styles.simLbl}>actual monthly profit</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WHAT-IF TAB */}
        {tab === 'whatif' && (
          <div className={styles.body}>
            <div className={styles.sectionLabel}>What-if pricing</div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.65 }}>
              Move the slider to see how different sale prices affect your profit, margin and monthly earnings in real time.
            </p>

            {/* SLIDER */}
            <div className={styles.wiSliderWrap}>
              <div className={styles.wiSliderTop}>
                <div>
                  <div className={styles.wiSliderLabel}>Sale price</div>
                  <div className={styles.wiSliderPrice}>${parseFloat(activePrice).toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.wiSliderLabel}>True cost</div>
                  <div className={styles.wiSliderCost}>${base.toFixed(2)}</div>
                </div>
              </div>
              <input
                type="range"
                className={styles.wiSlider}
                min={sliderMin}
                max={sliderMax}
                step="0.01"
                value={activePrice}
                onChange={e => setWhatIfPrice(parseFloat(e.target.value))}
              />
              <div className={styles.wiSliderRange}>
                <span>${sliderMin.toFixed(2)}</span>
                <span style={{ color: 'var(--accent)', fontSize: '12px' }}>
                  Suggested: ${suggestedPrice.toFixed(2)}
                </span>
                <span>${sliderMax.toFixed(2)}</span>
              </div>
            </div>

            {/* LIVE RESULTS */}
            <div className={styles.wiResults}>
              <div className={styles.wiResultCard} style={{ borderColor: profitColor(wiProfit) + '40' }}>
                <div className={styles.wiResultLabel}>Profit per unit</div>
                <div className={styles.wiResultValue} style={{ color: profitColor(wiProfit) }}>
                  {wiProfit >= 0 ? '+' : ''}{wiProfit.toFixed(2)}$
                </div>
              </div>
              <div className={styles.wiResultCard}>
                <div className={styles.wiResultLabel}>Margin</div>
                <div className={styles.wiResultValue} style={{ color: wiMargin >= 35 ? '#3B6D11' : wiMargin >= 20 ? '#854F0B' : '#dc2626' }}>
                  {wiMargin}%
                </div>
              </div>
              <div className={styles.wiResultCard}>
                <div className={styles.wiResultLabel}>Platform fee</div>
                <div className={styles.wiResultValue} style={{ color: '#854F0B' }}>
                  ${wiFeeAmt.toFixed(2)}
                </div>
              </div>
              <div className={styles.wiResultCard}>
                <div className={styles.wiResultLabel}>Monthly ({unitsDay}u × {daysMonth}d)</div>
                <div className={styles.wiResultValue} style={{ color: wiProfit >= 0 ? '#3B6D11' : '#dc2626' }}>
                  ${Math.round(wiMonthly).toLocaleString()}
                </div>
              </div>
            </div>

            {/* MARGIN BAR */}
            <div className={styles.wiMarginBar}>
              <div className={styles.wiMarginBarInner}>
                <div className={styles.wiMarginFill} style={{
                  width: `${wiBarPct}%`,
                  background: wiBarPct < 20 ? '#E24B4A' : wiBarPct < 35 ? '#BA7517' : '#2d7a3a'
                }} />
                {/* Cost marker */}
                <div className={styles.wiMarker} style={{ left: '0%' }}>
                  <div className={styles.wiMarkerLine} />
                  <div className={styles.wiMarkerLabel}>Cost</div>
                </div>
                {/* Suggested marker */}
                <div className={styles.wiMarker} style={{ left: `${Math.min(98, Math.round((suggestedPrice / sliderMax) * 100))}%` }}>
                  <div className={styles.wiMarkerLine} style={{ background: 'var(--accent)' }} />
                  <div className={styles.wiMarkerLabel} style={{ color: 'var(--accent)' }}>Suggested</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>0% margin</span>
                <span style={{ color: wiBarPct >= 35 ? '#3B6D11' : 'var(--muted)' }}>Margin: {wiBarPct}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* SMART INSIGHT */}
            <div className={styles.wiInsight}>
              {wiProfit < 0 && (
                <div className={styles.wiInsightDanger}>
                  ⚠️ At ${activePrice.toFixed(2)} you are losing ${Math.abs(wiProfit).toFixed(2)} per unit. Raise your price to at least ${(base / (1 - wiFeePct)).toFixed(2)} to break even.
                </div>
              )}
              {wiProfit >= 0 && wiMargin < 20 && (
                <div className={styles.wiInsightWarn}>
                  ⚠️ Margin is low at {wiMargin}%. To reach 35% margin, charge at least ${(base / (1 - 0.35 - wiFeePct)).toFixed(2)}.
                </div>
              )}
              {wiMargin >= 20 && wiMargin < 35 && (
                <div className={styles.wiInsightWarn}>
                  💡 Good margin. To reach a strong 60% margin, charge ${priceFor60.toFixed(2)}. Monthly profit would be ${Math.round((priceFor60 - base - priceFor60 * wiFeePct) * unitsDay * daysMonth).toLocaleString()}.
                </div>
              )}
              {wiMargin >= 35 && (
                <div className={styles.wiInsightOk}>
                  ✅ Strong margin at {wiMargin}%. At ${activePrice.toFixed(2)} you earn ${Math.round(wiMonthly).toLocaleString()}/month selling {unitsDay} units/day.
                </div>
              )}
            </div>

            {/* COMPARISON TABLE */}
            <div className={styles.divider} />
            <div className={styles.sectionLabel}>Price comparison</div>
            <div className={styles.wiTable}>
              <div className={styles.wiTableHeader}>
                <span>Price</span>
                <span>Profit/unit</span>
                <span>Margin</span>
                <span>Monthly</span>
              </div>
              {[
                { label: 'Break-even', price: base / (1 - wiFeePct) },
                { label: '20% margin', price: base / (1 - 0.20 - wiFeePct) },
                { label: '35% margin', price: base / (1 - 0.35 - wiFeePct) },
                { label: '60% margin', price: base / (1 - 0.60 - wiFeePct) },
                { label: 'Your price', price: activePrice, highlight: true },
              ].map(row => {
                const rFee = row.price * wiFeePct
                const rProfit = row.price - base - rFee
                const rMargin = Math.round((rProfit / row.price) * 100)
                const rMonthly = Math.round(rProfit * unitsDay * daysMonth)
                return (
                  <div key={row.label} className={`${styles.wiTableRow} ${row.highlight ? styles.wiTableRowActive : ''}`}>
                    <span style={{ fontWeight: row.highlight ? '600' : '400' }}>{row.label} — ${row.price.toFixed(2)}</span>
                    <span style={{ color: rProfit >= 0 ? '#3B6D11' : '#dc2626' }}>${rProfit.toFixed(2)}</span>
                    <span style={{ color: rMargin >= 35 ? '#3B6D11' : rMargin >= 20 ? '#854F0B' : '#dc2626' }}>{rMargin}%</span>
                    <span style={{ color: rMonthly >= 0 ? 'var(--text)' : '#dc2626' }}>${rMonthly.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
