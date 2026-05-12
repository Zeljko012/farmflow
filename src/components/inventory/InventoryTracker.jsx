import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const MAT_TYPES = ['PLA', 'PLA+', 'PETG', 'ABS', 'ASA', 'TPU', 'Other']
const MAT_COLORS = { 'PLA': '#9FE1CB', 'PLA+': '#5DCAA5', 'PETG': '#85B7EB', 'ABS': '#F5C4B3', 'ASA': '#FAC775', 'TPU': '#CEECF5', 'Other': '#D3D1C7' }
const COLOR_MAP = { white: '#f5f5f5', black: '#2a2a2a', red: '#e24b4a', blue: '#378add', green: '#639922', yellow: '#efce5f', orange: '#d85a30', pink: '#d4537e', purple: '#7f77dd', grey: '#888780', gray: '#888780', silver: '#c8c5b4', gold: '#efce5f', transparent: '#e8f4ff' }

function todayStr() { return new Date().toISOString().split('T')[0] }
function gn(v) { return parseFloat(v) || 0 }
function getColorHex(c) {
  const l = (c || '').toLowerCase()
  for (const k in COLOR_MAP) { if (l.includes(k)) return COLOR_MAP[k] }
  return '#D3D1C7'
}

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
  g5: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', color: 'var(--muted)' },
  input: { padding: '10px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' },
  btn: { padding: '12px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%', fontFamily: 'var(--font)' },
  btnSm: { padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font)' },
  btnDanger: { padding: '5px 10px', background: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#dc2626', fontFamily: 'var(--font)' },
  btnEdit: { padding: '5px 10px', background: 'transparent', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#2563eb', fontFamily: 'var(--font)' },
  btnOrder: { padding: '5px 10px', background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#854F0B', fontFamily: 'var(--font)' },
  tab: (a) => ({ padding: '9px 20px', borderRadius: '10px', border: `1px solid ${a ? 'var(--accent)' : 'var(--border)'}`, background: a ? 'var(--accent)' : 'transparent', color: a ? 'white' : 'var(--muted)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: a ? '500' : '400', position: 'relative' }),
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface2)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', userSelect: 'none' },
  spoolCard: { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' },
  orderItem: (done) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)', opacity: done ? 0.5 : 1 }),
}

export default function InventoryTracker() {
  const { user } = useAuth()
  const [tab, setTab] = useState('inventory')
  const [spools, setSpools] = useState([])
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState({})
  const [modalSpool, setModalSpool] = useState(null)
  const [modalQty, setModalQty] = useState(1)

  const [addType, setAddType] = useState('PLA')
  const [addBrand, setAddBrand] = useState('')
  const [addColor, setAddColor] = useState('')
  const [addWeight, setAddWeight] = useState(1000)
  const [addPrice, setAddPrice] = useState(0)
  const [addDate, setAddDate] = useState(todayStr())

  const [quId, setQuId] = useState('')
  const [quAction, setQuAction] = useState('use')
  const [quAmount, setQuAmount] = useState(0)
  const [quPrice, setQuPrice] = useState(0)
  const [quDate, setQuDate] = useState(todayStr())

  // Load from Supabase
  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const [{ data: sp }, { data: ol }] = await Promise.all([
        supabase.from('spools').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('order_list').select('*').eq('user_id', user.id).order('created_at')
      ])
      setSpools((sp || []).map(mapSpool))
      setOrderList(ol || [])
      setLoading(false)
    }
    load()
  }, [user])

  function mapSpool(r) {
    return {
      id: r.id, type: r.type, brand: r.brand, color: r.color,
      totalWeight: r.total_weight, remaining: r.remaining,
      price: r.price, date: r.purchase_date || '',
      history: r.history || []
    }
  }

  async function addSpool() {
    const w = gn(addWeight) || 1000
    const history = [{ date: addDate || todayStr(), action: 'Purchased', grams: w, price: gn(addPrice) }]
    const row = {
      user_id: user.id, type: addType,
      brand: addBrand || 'Unknown', color: addColor || 'Unknown',
      total_weight: w, remaining: w,
      price: gn(addPrice), purchase_date: addDate || todayStr(),
      history
    }
    const { data, error } = await supabase.from('spools').insert(row).select().single()
    if (!error && data) setSpools(prev => [...prev, mapSpool(data)])
    setAddBrand(''); setAddColor(''); setAddWeight(1000); setAddPrice(0)
  }

  async function removeSpool(id) {
    await supabase.from('spools').delete().eq('id', id)
    setSpools(prev => prev.filter(s => s.id !== id))
  }

  async function applyUpdate() {
    if (!quId) return
    const spool = spools.find(s => s.id === quId)
    if (!spool) return
    const amount = gn(quAmount)
    const today = todayStr()
    let newRem = spool.remaining
    let newTotal = spool.totalWeight
    let newPrice = spool.price
    let historyEntry = {}

    if (quAction === 'use') {
      newRem = Math.max(0, spool.remaining - amount)
      historyEntry = { date: today, action: 'Used', grams: -amount }
    } else if (quAction === 'buy') {
      newRem = spool.remaining + amount
      newTotal = spool.totalWeight + amount
      newPrice = spool.price + gn(quPrice)
      historyEntry = { date: quDate || today, action: 'Purchased', grams: amount, price: gn(quPrice) }
    } else {
      newRem = Math.max(0, amount)
      historyEntry = { date: today, action: 'Manual set', grams: amount }
    }

    const newHistory = [...(spool.history || []), historyEntry]
    const { data, error } = await supabase.from('spools').update({
      remaining: newRem, total_weight: newTotal, price: newPrice, history: newHistory
    }).eq('id', quId).select().single()
    if (!error && data) setSpools(prev => prev.map(s => s.id === quId ? mapSpool(data) : s))
    setQuAmount(0); setQuPrice(0)
  }

  async function confirmOrder() {
    if (!modalSpool) return
    const row = {
      user_id: user.id, spool_id: modalSpool.id,
      type: modalSpool.type, brand: modalSpool.brand, color: modalSpool.color,
      qty: modalQty, done: false,
      added_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    const { data, error } = await supabase.from('order_list').insert(row).select().single()
    if (!error && data) setOrderList(prev => [...prev, data])
    setModalSpool(null)
  }

  async function toggleOrderDone(id, current) {
    const { data } = await supabase.from('order_list').update({ done: !current }).eq('id', id).select().single()
    if (data) setOrderList(prev => prev.map(o => o.id === id ? data : o))
  }

  async function removeOrder(id) {
    await supabase.from('order_list').delete().eq('id', id)
    setOrderList(prev => prev.filter(o => o.id !== id))
  }

  // COMPUTED
  const totalInvested = spools.reduce((a, s) => a + s.price, 0)
  const totalG = spools.reduce((a, s) => a + s.totalWeight, 0)
  const avgPerG = totalG > 0 ? totalInvested / totalG : 0
  const lowCount = spools.filter(s => s.totalWeight > 0 && (s.remaining / s.totalWeight) <= 0.3).length
  const pendingOrders = orderList.filter(o => !o.done).length

  const quSpool = spools.find(s => s.id === quId)
  let previewRem = quSpool ? quSpool.remaining : 0
  if (quSpool) {
    if (quAction === 'use') previewRem = Math.max(0, quSpool.remaining - gn(quAmount))
    else if (quAction === 'buy') previewRem = quSpool.remaining + gn(quAmount)
    else previewRem = Math.max(0, gn(quAmount))
  }
  const previewPct = quSpool && quSpool.totalWeight > 0 ? Math.round((previewRem / quSpool.totalWeight) * 100) : 0

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '13px' }}>Loading...</div>

  return (
    <div style={css.wrap}>
      <div style={css.eyebrow}>Pro Feature</div>
      <h1 style={css.title}>Inventory & Orders</h1>
      <p style={css.sub}>Track your filament stock by type. Get low stock alerts and manage your order list.</p>

      <div style={css.metrics}>
        <div style={css.metric}><div style={css.mLabel}>Total spools</div><div style={css.mVal()}>{spools.length}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Total invested</div><div style={css.mVal('var(--accent)')}>${totalInvested.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Avg $/gram</div><div style={css.mVal()}>${avgPerG.toFixed(3)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Low stock</div><div style={css.mVal(lowCount > 0 ? '#854F0B' : '#3B6D11')}>{lowCount}</div></div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={css.tab(tab === 'inventory')} onClick={() => setTab('inventory')}>🧵 Inventory</button>
        <button style={{ ...css.tab(tab === 'orders'), position: 'relative' }} onClick={() => setTab('orders')}>
          🛒 Order list
          {pendingOrders > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '600' }}>{pendingOrders}</span>}
        </button>
      </div>

      {tab === 'inventory' && <>
        <div style={css.card}>
          <div style={css.cardTitle}>Add filament</div>
          <div style={css.cardSub}>Add a new spool to your inventory</div>
          <div style={css.g5}>
            <div style={css.field}><label style={css.label}>Material</label>
              <select style={css.input} value={addType} onChange={e => setAddType(e.target.value)}>
                {MAT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={css.field}><label style={css.label}>Brand</label><input style={css.input} value={addBrand} onChange={e => setAddBrand(e.target.value)} placeholder="e.g. Bambu" /></div>
            <div style={css.field}><label style={css.label}>Color</label><input style={css.input} value={addColor} onChange={e => setAddColor(e.target.value)} placeholder="e.g. White" /></div>
            <div style={css.field}><label style={css.label}>Weight (g)</label><input style={css.input} type="number" value={addWeight} onChange={e => setAddWeight(e.target.value)} /></div>
            <div style={css.field}><label style={css.label}>Price ($)</label><input style={css.input} type="number" value={addPrice} step="0.01" onChange={e => setAddPrice(e.target.value)} /></div>
          </div>
          <div style={css.g2}>
            <div style={css.field}><label style={css.label}>Purchase date</label><input style={css.input} type="date" value={addDate} onChange={e => setAddDate(e.target.value)} /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}><button style={css.btn} onClick={addSpool}>+ Add to inventory</button></div>
          </div>
        </div>

        <div style={css.card}>
          <div style={css.cardTitle}>Quick update</div>
          <div style={css.cardSub}>Log usage or new purchase for an existing spool</div>
          <div style={css.g3}>
            <div style={css.field}><label style={css.label}>Select spool</label>
              <select style={css.input} value={quId} onChange={e => setQuId(e.target.value)}>
                <option value="">— select —</option>
                {spools.map(s => <option key={s.id} value={s.id}>{s.type} · {s.brand} · {s.color} ({s.remaining.toFixed(0)}g left)</option>)}
              </select>
            </div>
            <div style={css.field}><label style={css.label}>Action</label>
              <select style={css.input} value={quAction} onChange={e => setQuAction(e.target.value)}>
                <option value="use">Used (subtract grams)</option>
                <option value="buy">Bought more (add grams)</option>
                <option value="set">Set remaining manually</option>
              </select>
            </div>
            <div style={css.field}>
              <label style={css.label}>{quAction === 'use' ? 'Amount used (g)' : quAction === 'buy' ? 'Amount purchased (g)' : 'Set remaining to (g)'}</label>
              <input style={css.input} type="number" value={quAmount} min="0" onChange={e => setQuAmount(e.target.value)} />
            </div>
          </div>
          {quAction === 'buy' && (
            <div style={css.g2}>
              <div style={css.field}><label style={css.label}>Price paid ($)</label><input style={css.input} type="number" value={quPrice} step="0.01" onChange={e => setQuPrice(e.target.value)} /></div>
              <div style={css.field}><label style={css.label}>Purchase date</label><input style={css.input} type="date" value={quDate} onChange={e => setQuDate(e.target.value)} /></div>
            </div>
          )}
          {quSpool && (
            <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: 'var(--muted)' }}>
              {quSpool.brand} {quSpool.color} — remaining will be: <strong style={{ color: previewPct > 30 ? '#3B6D11' : previewPct > 10 ? '#854F0B' : '#dc2626' }}>{previewRem.toFixed(0)}g ({previewPct}%)</strong>
            </div>
          )}
          <button style={css.btn} onClick={applyUpdate}>Apply update</button>
        </div>

        {spools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '14px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px' }}>No filament added yet.</div>
        ) : MAT_TYPES.map(type => {
          const group = spools.filter(sp => sp.type === type)
          if (!group.length) return null
          const isCollapsed = collapsed[type]
          const totalRem = group.reduce((a, sp) => a + sp.remaining, 0)
          const lowInGroup = group.filter(sp => sp.totalWeight > 0 && (sp.remaining / sp.totalWeight) <= 0.3).length
          const mc = MAT_COLORS[type] || '#D3D1C7'

          return (
            <div key={type} style={{ marginBottom: '16px' }}>
              <div style={css.sectionHeader} onClick={() => setCollapsed(prev => ({ ...prev, [type]: !prev[type] }))}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: mc, border: '0.5px solid var(--border)', display: 'inline-block' }} />
                  {type}
                  <span style={{ fontWeight: '400', color: 'var(--muted)', fontSize: '13px' }}>({group.length} spool{group.length > 1 ? 's' : ''})</span>
                  {lowInGroup > 0 && <span style={{ background: '#FAEEDA', color: '#854F0B', fontSize: '11px', padding: '2px 8px', borderRadius: '6px' }}>{lowInGroup} low</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{totalRem.toFixed(0)}g remaining</span>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{isCollapsed ? '▼' : '▲'}</span>
                </div>
              </div>

              {!isCollapsed && group.map(sp => {
                const pct = sp.totalWeight > 0 ? Math.round((sp.remaining / sp.totalWeight) * 100) : 0
                const barColor = pct > 30 ? '#639922' : pct > 10 ? '#BA7517' : '#E24B4A'
                const isLow = pct <= 30
                const dotColor = getColorHex(sp.color)
                const perG = sp.totalWeight > 0 && sp.price > 0 ? (sp.price / sp.totalWeight).toFixed(3) : '—'

                return (
                  <div key={sp.id} style={css.spoolCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: dotColor, border: '0.5px solid var(--border)', display: 'inline-block', flexShrink: 0 }} />
                          {sp.brand} — {sp.color}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '3px' }}>Added {sp.date}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {pct > 30 ? <span style={{ background: '#EAF3DE', color: '#3B6D11', fontSize: '11px', padding: '2px 8px', borderRadius: '6px' }}>OK</span>
                          : pct > 10 ? <span style={{ background: '#FAEEDA', color: '#854F0B', fontSize: '11px', padding: '2px 8px', borderRadius: '6px' }}>Low</span>
                          : <span style={{ background: '#FCEBEB', color: '#A32D2D', fontSize: '11px', padding: '2px 8px', borderRadius: '6px' }}>Very low</span>}
                        {isLow && <button style={css.btnOrder} onClick={() => { setModalSpool(sp); setModalQty(1) }}>🛒 Order</button>}
                        <button style={css.btnEdit} onClick={() => setQuId(sp.id)}>Update</button>
                        <button style={css.btnDanger} onClick={() => removeSpool(sp.id)}>Remove</button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '12px' }}>
                      {[['Remaining', sp.remaining.toFixed(0) + 'g'], ['Total bought', sp.totalWeight.toFixed(0) + 'g'], ['Total paid', '$' + sp.price.toFixed(2)], ['Per gram', '$' + perG]].map(([l, v]) => (
                        <div key={l} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>{v}</div>
                          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{l}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: pct + '%', height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '36px', textAlign: 'right' }}>{pct}%</span>
                    </div>

                    {sp.history && sp.history.length > 1 && (
                      <details style={{ marginTop: '10px' }}>
                        <summary style={{ fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>History ({sp.history.length} entries)</summary>
                        <div style={{ marginTop: '8px' }}>
                          {sp.history.slice().reverse().map((h, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
                              <span style={{ color: 'var(--muted)' }}>{h.date}</span>
                              <span>{h.action}</span>
                              <span style={{ color: h.action === 'Used' ? '#dc2626' : '#3B6D11', fontWeight: '500' }}>
                                {h.action === 'Used' ? '-' : '+'}{Math.abs(h.grams).toFixed(0)}g{h.price ? ' · $' + h.price.toFixed(2) : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </>}

      {tab === 'orders' && (
        <div style={css.card}>
          <div style={css.cardTitle}>Order list</div>
          <div style={css.cardSub}>Items added when stock runs low. Check off when ordered.</div>
          {orderList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '14px' }}>No items yet. Items appear here when you click Order on a low-stock spool.</div>
          ) : (
            [...orderList.filter(o => !o.done), ...orderList.filter(o => o.done)].map(order => {
              const dotColor = getColorHex(order.color)
              return (
                <div key={order.id} style={css.orderItem(order.done)}>
                  <input type="checkbox" checked={order.done} onChange={() => toggleOrderDone(order.id, order.done)} style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, border: '0.5px solid var(--border)', display: 'inline-block', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', textDecoration: order.done ? 'line-through' : 'none' }}>{order.type} · {order.brand} · {order.color}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{order.qty}kg · Added {order.added_date}</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: order.done ? '#3B6D11' : '#854F0B' }}>{order.done ? 'Ordered ✓' : 'Pending'}</span>
                  <button style={css.btnDanger} onClick={() => removeOrder(order.id)}>Remove</button>
                </div>
              )
            })
          )}
        </div>
      )}

      {modalSpool && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setModalSpool(null) }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', width: '340px', maxWidth: '90vw' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>Order {modalSpool.type} — {modalSpool.brand} {modalSpool.color}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>Stock is low ({modalSpool.remaining.toFixed(0)}g). How much to order?</div>
            <div style={css.field}>
              <label style={css.label}>Quantity</label>
              <select style={css.input} value={modalQty} onChange={e => setModalQty(parseInt(e.target.value))}>
                <option value={1}>1 kg (1 spool)</option>
                <option value={2}>2 kg (2 spools)</option>
                <option value={3}>3 kg (3 spools)</option>
                <option value={5}>5 kg (5 spools)</option>
                <option value={10}>10 kg (10 spools)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button style={{ ...css.btn, flex: 1 }} onClick={confirmOrder}>🛒 Add to order list</button>
              <button style={{ ...css.btnSm, flex: 0, padding: '10px 16px' }} onClick={() => setModalSpool(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
