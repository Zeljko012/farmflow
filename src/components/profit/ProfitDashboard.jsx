import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function todayStr() { return new Date().toISOString().split('T')[0] }
function dateToShort(k) { const d = new Date(k + 'T12:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function dateToLong(k) { const d = new Date(k + 'T12:00:00'); return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
function gn(v) { return parseFloat(v) || 0 }

const css = {
  wrap: { padding: '52px', maxWidth: '900px', margin: '0 auto' },
  eyebrow: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' },
  title: { fontFamily: 'var(--serif)', fontSize: '44px', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' },
  sub: { color: 'var(--muted)', marginBottom: '40px', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px', fontWeight: '300' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' },
  metric: { background: 'var(--surface2)', borderRadius: '12px', padding: '16px' },
  mLabel: { fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' },
  mVal: (c) => ({ fontSize: '22px', fontWeight: '500', color: c || 'var(--text)' }),
  card: { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  cardSub: { fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' },
  g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  g3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' },
  g4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', color: 'var(--muted)' },
  input: { padding: '10px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' },
  btn: { padding: '12px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%', fontFamily: 'var(--font)' },
  btnSm: { padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font)' },
  btnDanger: { padding: '5px 10px', background: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#dc2626', fontFamily: 'var(--font)' },
  btnEdit: { padding: '5px 10px', background: 'transparent', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#2563eb', fontFamily: 'var(--font)' },
  btnGreen: { padding: '9px 18px', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font)' },
  divider: { height: '1px', background: 'var(--border)', margin: '16px 0' },
  chip: { background: 'var(--surface2)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' },
  chipLabel: { fontSize: '10px', color: 'var(--muted)', marginBottom: '3px' },
  chipVal: { fontSize: '13px', fontWeight: '500' },
  entry: { padding: '14px 0', borderBottom: '1px solid var(--border)' },
  preview: { background: 'var(--surface2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px', color: 'var(--muted)' },
  tab: (a) => ({ padding: '9px 20px', borderRadius: '10px', border: `1px solid ${a ? 'var(--accent)' : 'var(--border)'}`, background: a ? 'var(--accent)' : 'transparent', color: a ? 'white' : 'var(--muted)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: a ? '500' : '400' }),
  calDay: (isToday, isSel) => ({ textAlign: 'center', padding: '6px 2px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', minHeight: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: isSel ? 'var(--accent)' : 'transparent', color: isSel ? 'white' : isToday ? 'var(--accent)' : 'var(--text)', border: isToday && !isSel ? '1px solid var(--accent)' : '1px solid transparent' }),
  adRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '14px', gap: '8px' },
}

export default function ProfitDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('today')
  const [sales, setSales] = useState([])
  const [adSpends, setAdSpends] = useState([])
  const [loading, setLoading] = useState(true)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState(null)
  const [editSaleId, setEditSaleId] = useState(null)
  const [editAdId, setEditAdId] = useState(null)
  const [addSaleForDay, setAddSaleForDay] = useState(false)
  const [addAdForDay, setAddAdForDay] = useState(false)
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  const [sName, setSName] = useState('')
  const [sDate, setSDate] = useState(todayStr())
  const [sUnits, setSUnits] = useState(1)
  const [sPrice, setSPrice] = useState(0)
  const [sPrint, setSPrint] = useState(0)
  const [sPack, setSPack] = useState(0)
  const [sShip, setSShip] = useState(0)
  const [sFee, setSFee] = useState(0)
  const [sOther, setSother] = useState(0)
  const [adDate, setAdDate] = useState(todayStr())
  const [adPlatform, setAdPlatform] = useState('')
  const [adAmount, setAdAmount] = useState(0)

  // Load data from Supabase
  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const [{ data: s }, { data: a }] = await Promise.all([
        supabase.from('sales').select('*').eq('user_id', user.id).order('date_key', { ascending: false }),
        supabase.from('ad_spends').select('*').eq('user_id', user.id).order('date_key', { ascending: false })
      ])
      setSales((s || []).map(mapSale))
      setAdSpends(a || [])
      setLoading(false)
    }
    load()
  }, [user])

  function mapSale(r) {
    return {
      id: r.id, name: r.name, units: r.units, price: r.price,
      print: r.print_cost, pack: r.pack_cost, ship: r.ship_cost,
      fee: r.platform_fee, other: r.other_cost,
      rev: r.rev, cost: r.cost, profit: r.profit,
      dateKey: r.date_key
    }
  }

  // METRICS
  const totalRev = sales.reduce((a, s) => a + s.rev, 0)
  const totalSaleCost = sales.reduce((a, s) => a + s.cost, 0)
  const totalAds = adSpends.reduce((a, s) => a + s.amount, 0)
  const totalCost = totalSaleCost + totalAds
  const totalProfit = totalRev - totalCost
  const totalUnits = sales.reduce((a, s) => a + s.units, 0)
  const totalMargin = totalRev > 0 ? Math.round((totalProfit / totalRev) * 100) : 0
  const totalPack = sales.reduce((a, s) => a + s.pack * s.units, 0)
  const totalShip = sales.reduce((a, s) => a + s.ship * s.units, 0)

  const prevRev = gn(sPrice) * gn(sUnits)
  const prevCost = (gn(sPrint) + gn(sPack) + gn(sShip)) * gn(sUnits) + gn(sFee) + gn(sOther)
  const prevProfit = prevRev - prevCost
  const prevMargin = prevRev > 0 ? Math.round((prevProfit / prevRev) * 100) : 0

  async function addSale() {
    const units = gn(sUnits) || 1, price = gn(sPrice), print = gn(sPrint)
    const pack = gn(sPack), ship = gn(sShip), fee = gn(sFee), other = gn(sOther)
    const rev = price * units
    const cost = (print + pack + ship) * units + fee + other
    const row = {
      user_id: user.id, name: sName || 'Product', units, price,
      print_cost: print, pack_cost: pack, ship_cost: ship,
      platform_fee: fee, other_cost: other,
      rev, cost, profit: rev - cost, date_key: sDate || todayStr()
    }
    const { data, error } = await supabase.from('sales').insert(row).select().single()
    if (!error && data) setSales(prev => [mapSale(data), ...prev])
    setSName(''); setSUnits(1); setSPrice(0); setSPrint(0); setSPack(0); setSShip(0); setSFee(0); setSother(0); setSDate(todayStr())
  }

  async function removeSale(id) {
    await supabase.from('sales').delete().eq('id', id)
    setSales(prev => prev.filter(s => s.id !== id))
  }

  async function updateSale(id, updated) {
    const rev = updated.price * updated.units
    const cost = (updated.print + updated.pack + updated.ship) * updated.units + updated.fee + updated.other
    const row = {
      name: updated.name, units: updated.units, price: updated.price,
      print_cost: updated.print, pack_cost: updated.pack, ship_cost: updated.ship,
      platform_fee: updated.fee, other_cost: updated.other,
      rev, cost, profit: rev - cost
    }
    const { data, error } = await supabase.from('sales').update(row).eq('id', id).select().single()
    if (!error && data) setSales(prev => prev.map(s => s.id === id ? mapSale(data) : s))
    setEditSaleId(null)
  }

  async function addAd() {
    if (!gn(adAmount)) return
    const row = { user_id: user.id, platform: adPlatform || 'Ads', amount: gn(adAmount), date_key: adDate || todayStr() }
    const { data, error } = await supabase.from('ad_spends').insert(row).select().single()
    if (!error && data) setAdSpends(prev => [data, ...prev])
    setAdPlatform(''); setAdAmount(0)
  }

  async function removeAd(id) {
    await supabase.from('ad_spends').delete().eq('id', id)
    setAdSpends(prev => prev.filter(a => a.id !== id))
  }

  async function updateAd(id, updated) {
    const { data, error } = await supabase.from('ad_spends').update({ platform: updated.platform, amount: updated.amount }).eq('id', id).select().single()
    if (!error && data) setAdSpends(prev => prev.map(a => a.id === id ? data : a))
    setEditAdId(null)
  }

  async function addSaleForDayFn(name, units, price, print, pack, ship, fee, other) {
    const rev = price * units, cost = (print + pack + ship) * units + fee + other
    const row = { user_id: user.id, name: name || 'Product', units, price, print_cost: print, pack_cost: pack, ship_cost: ship, platform_fee: fee, other_cost: other, rev, cost, profit: rev - cost, date_key: selectedDay }
    const { data, error } = await supabase.from('sales').insert(row).select().single()
    if (!error && data) setSales(prev => [mapSale(data), ...prev])
    setAddSaleForDay(false)
  }

  async function addAdForDayFn(platform, amount) {
    if (!amount) return
    const row = { user_id: user.id, platform: platform || 'Ads', amount, date_key: selectedDay }
    const { data, error } = await supabase.from('ad_spends').insert(row).select().single()
    if (!error && data) setAdSpends(prev => [data, ...prev])
    setAddAdForDay(false)
  }

  // CHART
  useEffect(() => {
    if (tab !== 'today' || !chartRef.current) return
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
    script.onload = renderChart
    if (window.Chart) { renderChart(); return }
    document.head.appendChild(script)
  }, [tab, sales, adSpends])

  function renderChart() {
    if (!chartRef.current || !window.Chart) return
    const days = []
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d) }
    const labels = days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    const keys = days.map(d => d.toISOString().split('T')[0])
    const revD = keys.map(k => Math.round(sales.filter(s => s.dateKey === k).reduce((a, s) => a + s.rev, 0) * 100) / 100)
    const costD = keys.map(k => {
      const sc = sales.filter(s => s.dateKey === k).reduce((a, s) => a + s.cost, 0)
      const ac = adSpends.filter(a => a.date_key === k).reduce((a, s) => a + s.amount, 0)
      return Math.round((sc + ac) * 100) / 100
    })
    const profD = keys.map((_, i) => Math.round((revD[i] - costD[i]) * 100) / 100)
    if (chartInst.current) chartInst.current.destroy()
    chartInst.current = new window.Chart(chartRef.current, {
      type: 'bar',
      data: { labels, datasets: [
        { label: 'Revenue', data: revD, backgroundColor: '#9FE1CB', borderRadius: 4 },
        { label: 'Costs', data: costD, backgroundColor: '#F5C4B3', borderRadius: 4 },
        { label: 'Profit', data: profD, backgroundColor: profD.map(v => v >= 0 ? '#3B6D11' : '#E24B4A'), borderRadius: 4 }
      ]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => '$' + v } }, x: { ticks: { autoSkip: false, maxRotation: 0 } } } }
    })
  }

  // CALENDAR
  function renderCalendar() {
    const first = new Date(calYear, calMonth, 1).getDay()
    const total = new Date(calYear, calMonth + 1, 0).getDate()
    const today = new Date()
    const cells = []
    for (let i = 0; i < first; i++) cells.push(<div key={'e' + i} />)
    for (let d = 1; d <= total; d++) {
      const k = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const hasSales = sales.some(s => s.dateKey === k)
      const hasAds = adSpends.some(a => a.date_key === k)
      const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d
      const isSel = selectedDay === k
      cells.push(
        <div key={k} style={css.calDay(isToday, isSel)} onClick={() => setSelectedDay(k)}>
          <span>{d}</span>
          {(hasSales || hasAds) && (
            <div style={{ display: 'flex', gap: '2px' }}>
              {hasSales && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSel ? 'white' : 'var(--accent)' }} />}
              {hasAds && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSel ? 'white' : '#3B6D11' }} />}
            </div>
          )}
        </div>
      )
    }
    return cells
  }

  const daySales = selectedDay ? sales.filter(s => s.dateKey === selectedDay) : []
  const dayAds = selectedDay ? adSpends.filter(a => a.date_key === selectedDay) : []
  const dayRev = daySales.reduce((a, s) => a + s.rev, 0)
  const dayCost = daySales.reduce((a, s) => a + s.cost, 0) + dayAds.reduce((a, s) => a + s.amount, 0)
  const dayProfit = dayRev - dayCost

  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`
  const monthSales = sales.filter(s => s.dateKey && s.dateKey.startsWith(monthPrefix))
  const monthAds = adSpends.filter(a => a.date_key && a.date_key.startsWith(monthPrefix))
  const monthRev = monthSales.reduce((a, s) => a + s.rev, 0)
  const monthCost = monthSales.reduce((a, s) => a + s.cost, 0) + monthAds.reduce((a, s) => a + s.amount, 0)
  const monthProfit = monthRev - monthCost

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '13px' }}>Loading...</div>

  return (
    <div style={css.wrap}>
      <div style={css.eyebrow}>Starter Feature</div>
      <h1 style={css.title}>Profit Dashboard</h1>
      <p style={css.sub}>Track daily sales, costs and ad spend. See your real profit — not just revenue.</p>

      <div style={css.metrics}>
        <div style={css.metric}><div style={css.mLabel}>Total revenue</div><div style={css.mVal('var(--accent)')}>${totalRev.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Total costs</div><div style={css.mVal('#dc2626')}>${totalCost.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Net profit</div><div style={css.mVal(totalProfit >= 0 ? '#3B6D11' : '#dc2626')}>${totalProfit.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Avg margin</div><div style={css.mVal(totalMargin >= 30 ? '#3B6D11' : totalMargin >= 10 ? '#854F0B' : '#dc2626')}>{totalMargin}%</div></div>
      </div>
      <div style={css.metrics}>
        <div style={css.metric}><div style={css.mLabel}>Units sold</div><div style={css.mVal()}>{totalUnits}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Packaging</div><div style={css.mVal('#854F0B')}>${totalPack.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Ad spend</div><div style={css.mVal('#854F0B')}>${totalAds.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Shipping</div><div style={css.mVal('#854F0B')}>${totalShip.toFixed(2)}</div></div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={css.tab(tab === 'today')} onClick={() => setTab('today')}>📊 Dashboard</button>
        <button style={css.tab(tab === 'history')} onClick={() => setTab('history')}>📅 History</button>
      </div>

      {tab === 'today' && <>
        <div style={css.card}>
          <div style={css.cardTitle}>Add sale</div>
          <div style={css.cardSub}>Packaging and shipping are per unit — multiplied automatically</div>
          <div style={css.g3}>
            <div style={css.field}><label style={css.label}>Date</label><input style={css.input} type="date" value={sDate} onChange={e => setSDate(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Product name</label><input style={css.input} type="text" value={sName} onChange={e => setSName(e.target.value)} placeholder="e.g. Phone stand" /></div>
            <div style={css.field}><label style={css.label}>Units sold</label><input style={css.input} type="number" value={sUnits} min="1" onChange={e => setSUnits(e.target.value)} /></div>
          </div>
          <div style={css.g3}>
            <div style={css.field}><label style={css.label}>Sale price / unit ($)</label><input style={css.input} type="number" value={sPrice} min="0" step="0.01" onChange={e => setSPrice(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Print cost / unit ($)</label><input style={css.input} type="number" value={sPrint} min="0" step="0.01" onChange={e => setSPrint(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Packaging / unit ($)</label><input style={css.input} type="number" value={sPack} min="0" step="0.01" onChange={e => setSPack(e.target.value)} /></div>
          </div>
          <div style={css.g3}>
            <div style={css.field}><label style={css.label}>Shipping / unit ($)</label><input style={css.input} type="number" value={sShip} min="0" step="0.01" onChange={e => setSShip(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Platform fee - total ($)</label><input style={css.input} type="number" value={sFee} min="0" step="0.01" onChange={e => setSFee(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Other costs - total ($)</label><input style={css.input} type="number" value={sOther} min="0" step="0.01" onChange={e => setSother(e.target.value)} /></div>
          </div>
          <div style={css.preview}>
            <span>Revenue: <strong style={{ color: 'var(--text)' }}>${prevRev.toFixed(2)}</strong></span>
            <span>Cost: <strong style={{ color: '#dc2626' }}>${prevCost.toFixed(2)}</strong></span>
            <span>Profit: <strong style={{ color: prevProfit >= 0 ? '#3B6D11' : '#dc2626' }}>${prevProfit.toFixed(2)}</strong></span>
            <span>Margin: <strong style={{ color: prevMargin >= 30 ? '#3B6D11' : prevMargin >= 10 ? '#854F0B' : '#dc2626' }}>{prevMargin}%</strong></span>
          </div>
          <button style={css.btn} onClick={addSale}>+ Add sale</button>
        </div>

        <div style={css.card}>
          <div style={css.cardTitle}>Daily ad spend</div>
          <div style={css.cardSub}>Can be added retroactively for any date</div>
          <div style={css.g3}>
            <div style={css.field}><label style={css.label}>Date</label><input style={css.input} type="date" value={adDate} onChange={e => setAdDate(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Platform</label><input style={css.input} type="text" value={adPlatform} onChange={e => setAdPlatform(e.target.value)} placeholder="Facebook, Etsy Ads..." /></div>
            <div style={css.field}><label style={css.label}>Amount ($)</label><input style={css.input} type="number" value={adAmount} min="0" step="0.01" onChange={e => setAdAmount(e.target.value)} /></div>
          </div>
          <button style={css.btn} onClick={addAd}>+ Add ad spend</button>
          {adSpends.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Total: <strong style={{ color: '#dc2626' }}>${totalAds.toFixed(2)}</strong></div>
              {adSpends.slice(0, 10).map(a => (
                <div key={a.id} style={css.adRow}>
                  <span style={{ fontWeight: '500' }}>{a.platform}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{dateToShort(a.date_key)}</span>
                  <span style={{ color: '#dc2626', fontWeight: '500' }}>-${a.amount.toFixed(2)}</span>
                  <button style={css.btnDanger} onClick={() => removeAd(a.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={css.card}>
          <div style={css.cardTitle}>Sales log</div>
          {sales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '14px' }}>No sales recorded yet.</div>
          ) : sales.slice(0, 20).map(sale => {
            const margin = sale.rev > 0 ? Math.round((sale.profit / sale.rev) * 100) : 0
            return (
              <div key={sale.id} style={css.entry}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '15px' }}>{sale.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{sale.units} unit{sale.units > 1 ? 's' : ''} × ${sale.price.toFixed(2)} · {dateToShort(sale.dateKey)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: sale.profit >= 0 ? '#3B6D11' : '#dc2626' }}>${sale.profit.toFixed(2)}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{margin}% margin</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                      <button style={css.btnDanger} onClick={() => removeSale(sale.id)}>Remove</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px', margin: '10px 0' }}>
                  {[['Revenue', sale.rev], ['Print', sale.print * sale.units], ['Packaging', sale.pack * sale.units], ['Shipping', sale.ship * sale.units], ['Fee+Other', sale.fee + sale.other]].map(([l, v]) => (
                    <div key={l} style={css.chip}><div style={css.chipLabel}>{l}</div><div style={css.chipVal}>${v.toFixed(2)}</div></div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={css.card}>
          <div style={css.cardTitle}>Last 7 days</div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: 'var(--muted)' }}>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#9FE1CB', marginRight: '4px' }}></span>Revenue</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#F5C4B3', marginRight: '4px' }}></span>Costs</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#3B6D11', marginRight: '4px' }}></span>Profit</span>
          </div>
          <div style={{ position: 'relative', height: '200px' }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      </>}

      {tab === 'history' && <>
        <div style={css.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button style={css.btnSm} onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}>← Prev</button>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{MONTHS[calMonth]} {calYear}</div>
            <button style={css.btnSm} onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}>Next →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '8px' }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', padding: '4px 0', fontWeight: '500' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>{renderCalendar()}</div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            <span><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', marginRight: '4px' }}></span>Sales</span>
            <span><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#3B6D11', marginRight: '4px' }}></span>Ad spend</span>
          </div>
        </div>

        <div style={css.card}>
          <div style={css.cardTitle}>{MONTHS[calMonth]} {calYear} — Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '12px' }}>
            <div style={css.metric}><div style={css.mLabel}>Revenue</div><div style={css.mVal('var(--accent)')}>${monthRev.toFixed(2)}</div></div>
            <div style={css.metric}><div style={css.mLabel}>Total costs</div><div style={css.mVal('#dc2626')}>${monthCost.toFixed(2)}</div></div>
            <div style={css.metric}><div style={css.mLabel}>Net profit</div><div style={css.mVal(monthProfit >= 0 ? '#3B6D11' : '#dc2626')}>${monthProfit.toFixed(2)}</div></div>
            <div style={css.metric}><div style={css.mLabel}>Units sold</div><div style={css.mVal()}>{monthSales.reduce((a, s) => a + s.units, 0)}</div></div>
          </div>
        </div>

        {selectedDay && (
          <div style={css.card}>
            <div style={css.cardTitle}>{dateToLong(selectedDay)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={css.metric}><div style={css.mLabel}>Revenue</div><div style={css.mVal('var(--accent)')}>${dayRev.toFixed(2)}</div></div>
              <div style={css.metric}><div style={css.mLabel}>Costs</div><div style={css.mVal('#dc2626')}>${dayCost.toFixed(2)}</div></div>
              <div style={css.metric}><div style={css.mLabel}>Profit</div><div style={css.mVal(dayProfit >= 0 ? '#3B6D11' : '#dc2626')}>${dayProfit.toFixed(2)}</div></div>
              <div style={css.metric}><div style={css.mLabel}>Units</div><div style={css.mVal()}>{daySales.reduce((a, s) => a + s.units, 0)}</div></div>
            </div>

            <div style={{ fontWeight: '600', marginBottom: '12px' }}>Sales</div>
            {daySales.length === 0 && <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>No sales for this day.</div>}
            {daySales.map(sale => {
              const isEditing = editSaleId === sale.id
              const margin = sale.rev > 0 ? Math.round((sale.profit / sale.rev) * 100) : 0
              return (
                <div key={sale.id} style={css.entry}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{ fontWeight: '500' }}>{sale.name}</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>{sale.units} unit{sale.units > 1 ? 's' : ''} × ${sale.price.toFixed(2)}</div></div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '500', color: sale.profit >= 0 ? '#3B6D11' : '#dc2626' }}>${sale.profit.toFixed(2)} ({margin}%)</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                        <button style={css.btnEdit} onClick={() => setEditSaleId(isEditing ? null : sale.id)}>{isEditing ? 'Cancel' : 'Edit'}</button>
                        <button style={css.btnDanger} onClick={() => removeSale(sale.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                  {isEditing && <EditSaleForm sale={sale} onSave={(u) => updateSale(sale.id, u)} onCancel={() => setEditSaleId(null)} />}
                </div>
              )
            })}
            {!addSaleForDay && <button style={{ ...css.btnSm, marginTop: '10px', marginBottom: '16px' }} onClick={() => setAddSaleForDay(true)}>+ Add sale for this day</button>}
            {addSaleForDay && <AddSaleInline dateKey={selectedDay} onSave={addSaleForDayFn} onCancel={() => setAddSaleForDay(false)} />}

            <div style={css.divider} />

            <div style={{ fontWeight: '600', marginBottom: '12px' }}>Ad spend</div>
            {dayAds.length === 0 && <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>No ad spend for this day.</div>}
            {dayAds.map(a => {
              const isEditing = editAdId === a.id
              return (
                <div key={a.id}>
                  <div style={css.adRow}>
                    <span style={{ fontWeight: '500' }}>{a.platform}</span>
                    <span style={{ color: '#dc2626', fontWeight: '500' }}>-${a.amount.toFixed(2)}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={css.btnEdit} onClick={() => setEditAdId(isEditing ? null : a.id)}>{isEditing ? 'Cancel' : 'Edit'}</button>
                      <button style={css.btnDanger} onClick={() => removeAd(a.id)}>Remove</button>
                    </div>
                  </div>
                  {isEditing && <EditAdForm ad={a} onSave={(u) => updateAd(a.id, u)} onCancel={() => setEditAdId(null)} />}
                </div>
              )
            })}
            {!addAdForDay && <button style={{ ...css.btnSm, marginTop: '10px' }} onClick={() => setAddAdForDay(true)}>+ Add ad spend for this day</button>}
            {addAdForDay && <AddAdInline onSave={addAdForDayFn} onCancel={() => setAddAdForDay(false)} />}
          </div>
        )}
      </>}
    </div>
  )
}

function EditSaleForm({ sale, onSave, onCancel }) {
  const [name, setName] = useState(sale.name)
  const [units, setUnits] = useState(sale.units)
  const [price, setPrice] = useState(sale.price)
  const [print, setPrint] = useState(sale.print)
  const [pack, setPack] = useState(sale.pack)
  const [ship, setShip] = useState(sale.ship)
  const inp = { padding: '8px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' }
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginTop: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Product</div><input style={inp} value={name} onChange={e => setName(e.target.value)} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Units</div><input style={inp} type="number" value={units} onChange={e => setUnits(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Price/unit ($)</div><input style={inp} type="number" value={price} step="0.01" onChange={e => setPrice(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Print/unit ($)</div><input style={inp} type="number" value={print} step="0.01" onChange={e => setPrint(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Pack/unit ($)</div><input style={inp} type="number" value={pack} step="0.01" onChange={e => setPack(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Ship/unit ($)</div><input style={inp} type="number" value={ship} step="0.01" onChange={e => setShip(gn(e.target.value))} /></div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '8px 16px', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }} onClick={() => onSave({ name, units: gn(units) || 1, price: gn(price), print: gn(print), pack: gn(pack), ship: gn(ship), fee: sale.fee, other: sale.other })}>Save changes</button>
        <button style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--muted)' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function EditAdForm({ ad, onSave, onCancel }) {
  const [platform, setPlatform] = useState(ad.platform)
  const [amount, setAmount] = useState(ad.amount)
  const inp = { padding: '8px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' }
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginTop: '6px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Platform</div><input style={inp} value={platform} onChange={e => setPlatform(e.target.value)} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Amount ($)</div><input style={inp} type="number" value={amount} step="0.01" onChange={e => setAmount(e.target.value)} /></div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '8px 16px', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }} onClick={() => onSave({ platform, amount: gn(amount) })}>Save</button>
        <button style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--muted)' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function AddSaleInline({ dateKey, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [units, setUnits] = useState(1)
  const [price, setPrice] = useState(0)
  const [print, setPrint] = useState(0)
  const [pack, setPack] = useState(0)
  const [ship, setShip] = useState(0)
  const inp = { padding: '8px 10px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' }
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>New sale</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Product</div><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Product name" /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Units</div><input style={inp} type="number" value={units} min="1" onChange={e => setUnits(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Price/unit ($)</div><input style={inp} type="number" value={price} step="0.01" onChange={e => setPrice(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Print/unit ($)</div><input style={inp} type="number" value={print} step="0.01" onChange={e => setPrint(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Pack/unit ($)</div><input style={inp} type="number" value={pack} step="0.01" onChange={e => setPack(gn(e.target.value))} /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Ship/unit ($)</div><input style={inp} type="number" value={ship} step="0.01" onChange={e => setShip(gn(e.target.value))} /></div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '9px 18px', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', flex: 1 }} onClick={() => onSave(name, gn(units) || 1, gn(price), gn(print), gn(pack), gn(ship), 0, 0)}>Save sale</button>
        <button style={{ padding: '9px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', color: 'var(--muted)' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function AddAdInline({ onSave, onCancel }) {
  const [platform, setPlatform] = useState('')
  const [amount, setAmount] = useState(0)
  const inp = { padding: '8px 10px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' }
  return (
    <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginTop: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Platform</div><input style={inp} value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Facebook, Etsy..." /></div>
        <div><div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Amount ($)</div><input style={inp} type="number" value={amount} step="0.01" onChange={e => setAmount(gn(e.target.value))} /></div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '9px 18px', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', flex: 1 }} onClick={() => onSave(platform, gn(amount))}>Save</button>
        <button style={{ padding: '9px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', color: 'var(--muted)' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
