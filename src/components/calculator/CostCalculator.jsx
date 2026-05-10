import { useState, useEffect } from 'react'
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

  const watts = PRINTER_DATA[printerModel]?.watts || 150
  const filCost = (weight / 1000) * filPrice
  const elecCost = hours * (watts / 1000) * elec
  const amorCost = lifespan > 0 ? (printerCost / lifespan) * hours : 0
  const packCost = parseFloat(boxCost) + parseFloat(packMat)
  const totalCost = filCost + elecCost + amorCost + packCost

  const labor = laborRate * laborHrs
  const base = totalCost + labor
  const price = base / (1 - (margin / 100) - (platFee / 100))
  const feeAmt = price * (platFee / 100)
  const profit = price - base - feeAmt
  const monthlyProfit = profit * unitsDay * daysMonth
  const unitsNeeded = target / Math.max(profit, 0.01)
  const daysNeeded = unitsNeeded / Math.max(unitsDay, 1)
  const barPct = Math.min(100, Math.max(0, Math.round((profit / Math.max(price, 0.01)) * 100)))

  function handlePrinterChange(model) {
    setPrinterModel(model)
    if (PRINTER_DATA[model]?.cost) setPrinterCost(PRINTER_DATA[model].cost)
  }

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
                <div className={`${styles.bRow} ${styles.bTotal}`}><span>Suggested price</span><span style={{color:'var(--accent)',fontSize:'18px'}}>${price.toFixed(2)}</span></div>
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
      </div>
    </div>
  )
}
