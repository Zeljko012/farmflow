import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

function todayStr() { return new Date().toISOString().split('T')[0] }
function gn(v) { return parseFloat(v) || 0 }
function fmtDate(s) { if (!s) return ''; const d = new Date(s); return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) }

const STATUS_LABELS = { pending: 'Pending', sent: 'Sent', delivered: 'Delivered', returned: 'Returned' }
const STATUS_COLORS = {
  pending: { bg: '#FAEEDA', color: '#854F0B' },
  sent: { bg: '#EAF3DE', color: '#3B6D11' },
  delivered: { bg: '#E6F1FB', color: '#185FA5' },
  returned: { bg: '#FCEBEB', color: '#A32D2D' },
}

const css = {
  wrap: { padding: 'clamp(20px, 5vw, 52px)', maxWidth: '900px', margin: '0 auto' },
  eyebrow: { fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' },
  title: { fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 44px)', fontStyle: 'italic', letterSpacing: '-1px', marginBottom: '12px' },
  sub: { color: 'var(--muted)', marginBottom: '40px', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px', fontWeight: '300' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '16px' },
  metric: { background: 'var(--surface2)', borderRadius: '12px', padding: '14px' },
  mLabel: { fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' },
  mVal: (c) => ({ fontSize: '20px', fontWeight: '500', color: c || 'var(--text)' }),
  card: { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)', marginBottom: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  cardSub: { fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' },
  g2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' },
  g3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', color: 'var(--muted)' },
  input: { padding: '11px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)' },
  textarea: { padding: '11px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px', color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'var(--font)', resize: 'vertical', minHeight: '72px' },
  btn: { padding: '13px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%', fontFamily: 'var(--font)' },
  btnSm: { padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font)' },
  btnGreen: { padding: '6px 12px', background: 'transparent', border: '1px solid #3B6D11', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#3B6D11', fontFamily: 'var(--font)' },
  btnBlue: { padding: '6px 12px', background: 'transparent', border: '1px solid #185FA5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#185FA5', fontFamily: 'var(--font)' },
  btnDanger: { padding: '6px 12px', background: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#dc2626', fontFamily: 'var(--font)' },
  btnPurple: { padding: '6px 12px', background: 'transparent', border: '1px solid #7c3aed', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#7c3aed', fontFamily: 'var(--font)' },
  divider: { height: '1px', background: 'var(--border)', margin: '16px 0' },
  tab: (a) => ({ padding: '9px 18px', borderRadius: '10px', border: `1px solid ${a ? 'var(--accent)' : 'var(--border)'}`, background: a ? 'var(--accent)' : 'transparent', color: a ? 'white' : 'var(--muted)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: a ? '500' : '400', position: 'relative' }),
  shipCard: { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: 'clamp(12px, 3vw, 16px)', marginBottom: '12px' },
  badge: (status) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', background: STATUS_COLORS[status]?.bg, color: STATUS_COLORS[status]?.color }),
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' },
}

export default function OrderManagement() {
  const { user } = useAuth()
  const [tab, setTab] = useState('pending')
  const [shipments, setShipments] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [printShipment, setPrintShipment] = useState(null)
  const [trackingId, setTrackingId] = useState(null)
  const [trackingVal, setTrackingVal] = useState('')

  const [fName, setFName] = useState('')
  const [fPhone, setFPhone] = useState('')
  const [fAddr, setFAddr] = useState('')
  const [fCity, setFCity] = useState('')
  const [fPostal, setFPostal] = useState('')
  const [fCountry, setFCountry] = useState('Serbia')
  const [fCod, setFCod] = useState(0)
  const [fIban, setFIban] = useState('')
  const [fContents, setFContents] = useState('')
  const [fWeight, setFWeight] = useState(0)
  const [fNotes, setFNotes] = useState('')
  const [selectedSales, setSelectedSales] = useState([])

  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const [{ data: sh }, { data: sa }] = await Promise.all([
        supabase.from('shipments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('sales').select('*').eq('user_id', user.id).order('date_key', { ascending: false }).limit(20)
      ])
      setShipments(sh || [])
      setRecentSales(sa || [])
      setLoading(false)
    }
    load()
  }, [user])

  async function addShipment() {
    if (!fName.trim() || !fAddr.trim() || !fCity.trim() || !fPostal.trim()) {
      alert('Please fill in: Name, Address, City and Postal code.')
      return
    }
    const saleIds = selectedSales.map(s => s.id)
    const autoContents = selectedSales.map(s => `${s.units}x ${s.name}`).join(', ')
    const contents = fContents.trim() || autoContents || ''
    const row = {
      user_id: user.id,
      recipient_name: fName.trim(),
      phone: fPhone.trim(),
      address: fAddr.trim(),
      city: fCity.trim(),
      postal_code: fPostal.trim(),
      country: fCountry.trim() || 'Serbia',
      cod_amount: gn(fCod),
      refund_iban: fIban.trim(),
      contents,
      sale_ids: saleIds,
      weight_grams: gn(fWeight),
      notes: fNotes.trim(),
      status: 'pending',
    }
    const { data, error } = await supabase.from('shipments').insert(row).select().single()
    if (!error && data) {
      setShipments(prev => [data, ...prev])
      setFName(''); setFPhone(''); setFAddr(''); setFCity(''); setFPostal('')
      setFCountry('Serbia'); setFCod(0); setFIban(''); setFContents('')
      setFWeight(0); setFNotes(''); setSelectedSales([])
      setTab('pending')
    }
  }

  async function updateStatus(id, status) {
    const upd = { status }
    if (status === 'sent') upd.sent_at = new Date().toISOString()
    const { data } = await supabase.from('shipments').update(upd).eq('id', id).select().single()
    if (data) setShipments(prev => prev.map(s => s.id === id ? data : s))
  }

  async function saveTracking(id) {
    const { data } = await supabase.from('shipments').update({ tracking_number: trackingVal }).eq('id', id).select().single()
    if (data) { setShipments(prev => prev.map(s => s.id === id ? data : s)); setTrackingId(null); setTrackingVal('') }
  }

  async function deleteShipment(id) {
    await supabase.from('shipments').delete().eq('id', id)
    setShipments(prev => prev.filter(s => s.id !== id))
  }

  function toggleSale(sale) {
    setSelectedSales(prev => prev.find(s => s.id === sale.id) ? prev.filter(s => s.id !== sale.id) : [...prev, sale])
  }

  const pending = shipments.filter(s => s.status === 'pending')
  const history = shipments.filter(s => s.status !== 'pending')
  const sentCount = shipments.filter(s => s.status === 'sent' || s.status === 'delivered').length
  const codTotal = shipments.filter(s => s.status === 'sent' || s.status === 'delivered').reduce((a, s) => a + (s.cod_amount || 0), 0)
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length

  function ShipmentCard({ s, showHistory }) {
    const isTracking = trackingId === s.id
    return (
      <div style={css.shipCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '3px' }}>{s.recipient_name}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{s.address}, {s.postal_code} {s.city}, {s.country}</div>
            {s.phone && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{s.phone}</div>}
          </div>
          <span style={css.badge(s.status)}>{STATUS_LABELS[s.status]}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '12px' }}>
          {s.contents && (
            <div style={{ ...css.infoRow, gridColumn: '1/-1' }}>
              <span style={{ color: 'var(--muted)' }}>Contents</span>
              <span style={{ textAlign: 'right', maxWidth: '60%' }}>{s.contents}</span>
            </div>
          )}
          {s.cod_amount > 0 && (
            <div style={css.infoRow}>
              <span style={{ color: 'var(--muted)' }}>COD</span>
              <span style={{ fontWeight: '600', color: 'var(--accent)' }}>${s.cod_amount.toFixed(2)}</span>
            </div>
          )}
          {s.refund_iban && (
            <div style={{ ...css.infoRow, gridColumn: '1/-1' }}>
              <span style={{ color: 'var(--muted)' }}>IBAN</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{s.refund_iban}</span>
            </div>
          )}
          {s.tracking_number && (
            <div style={css.infoRow}>
              <span style={{ color: 'var(--muted)' }}>Tracking</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{s.tracking_number}</span>
            </div>
          )}
          {s.notes && (
            <div style={{ ...css.infoRow, gridColumn: '1/-1' }}>
              <span style={{ color: 'var(--muted)' }}>Notes</span>
              <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{s.notes}</span>
            </div>
          )}
          {s.sent_at && (
            <div style={css.infoRow}>
              <span style={{ color: 'var(--muted)' }}>Sent</span>
              <span>{fmtDate(s.sent_at)}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {s.status === 'pending' && (
            <button style={css.btnGreen} onClick={() => updateStatus(s.id, 'sent')}>✓ Mark sent</button>
          )}
          {s.status === 'sent' && <>
            <button style={css.btnBlue} onClick={() => updateStatus(s.id, 'delivered')}>✓ Delivered</button>
            <button style={css.btnDanger} onClick={() => updateStatus(s.id, 'returned')}>↩ Returned</button>
          </>}
          {(s.status === 'sent' || s.status === 'delivered') && (
            <button style={css.btnSm} onClick={() => { setTrackingId(isTracking ? null : s.id); setTrackingVal(s.tracking_number || '') }}>
              {s.tracking_number ? '# ' + s.tracking_number : '+ Add tracking'}
            </button>
          )}
          <button style={css.btnPurple} onClick={() => setPrintShipment(s)}>🖨 Print label</button>
          <button style={css.btnDanger} onClick={() => deleteShipment(s.id)}>Remove</button>
        </div>

        {isTracking && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <input style={{ ...css.input, flex: 1 }} value={trackingVal} onChange={e => setTrackingVal(e.target.value)} placeholder="e.g. CC123456789RS" />
            <button style={{ ...css.btnGreen, padding: '8px 14px' }} onClick={() => saveTracking(s.id)}>Save</button>
            <button style={css.btnSm} onClick={() => setTrackingId(null)}>Cancel</button>
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '13px' }}>Loading...</div>

  return (
    <div style={css.wrap}>
      <div style={css.eyebrow}>Pro Feature</div>
      <h1 style={css.title}>Order Management</h1>
      <p style={css.sub}>Create shipments, track deliveries and print shipping labels — all in one place.</p>

      <div style={css.metrics}>
        <div style={css.metric}><div style={css.mLabel}>Pending</div><div style={css.mVal('#854F0B')}>{pending.length}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Sent</div><div style={css.mVal()}>{sentCount}</div></div>
        <div style={css.metric}><div style={css.mLabel}>COD total</div><div style={css.mVal('var(--accent)')}>${codTotal.toFixed(2)}</div></div>
        <div style={css.metric}><div style={css.mLabel}>Delivered</div><div style={css.mVal('#3B6D11')}>{deliveredCount}</div></div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={css.tab(tab === 'pending')} onClick={() => setTab('pending')}>
          📦 To send {pending.length > 0 && <span style={{ marginLeft: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '0 6px', fontSize: '11px' }}>{pending.length}</span>}
        </button>
        <button style={css.tab(tab === 'new')} onClick={() => setTab('new')}>+ New shipment</button>
        <button style={css.tab(tab === 'history')} onClick={() => setTab('history')}>📋 History</button>
      </div>

      {tab === 'pending' && (
        pending.length === 0
          ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: '14px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px' }}>No pending shipments. Create a new one.</div>
          : pending.map(s => <ShipmentCard key={s.id} s={s} />)
      )}

      {tab === 'new' && (
        <>
          <div style={css.card}>
            <div style={css.cardTitle}>Recipient</div>
            <div style={css.cardSub}>Enter delivery information</div>
            <div style={css.g2}>
              <div style={css.field}><label style={css.label}>Full name *</label><input style={css.input} value={fName} onChange={e => setFName(e.target.value)} placeholder="John Smith" /></div>
              <div style={css.field}><label style={css.label}>Phone</label><input style={css.input} value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="+1 555 123 4567" /></div>
            </div>
            <div style={{ ...css.field, marginBottom: '12px' }}><label style={css.label}>Address *</label><input style={css.input} value={fAddr} onChange={e => setFAddr(e.target.value)} placeholder="Street and number" /></div>
            <div style={css.g3}>
              <div style={css.field}><label style={css.label}>City *</label><input style={css.input} value={fCity} onChange={e => setFCity(e.target.value)} placeholder="New York" /></div>
              <div style={css.field}><label style={css.label}>Postal code *</label><input style={css.input} value={fPostal} onChange={e => setFPostal(e.target.value)} placeholder="10001" /></div>
              <div style={css.field}><label style={css.label}>Country</label><input style={css.input} value={fCountry} onChange={e => setFCountry(e.target.value)} /></div>
            </div>
          </div>

          <div style={css.card}>
            <div style={css.cardTitle}>Payment</div>
            <div style={css.cardSub}>Optional — leave at 0 if not applicable</div>
            <div style={css.g2}>
              <div style={css.field}><label style={css.label}>Cash on delivery ($)</label><input style={css.input} type="number" value={fCod} min="0" step="0.01" onChange={e => setFCod(e.target.value)} /></div>
              <div style={css.field}><label style={css.label}>IBAN for refund</label><input style={css.input} value={fIban} onChange={e => setFIban(e.target.value)} placeholder="GB29 NWBK..." /></div>
            </div>
          </div>

          <div style={css.card}>
            <div style={css.cardTitle}>Package contents</div>
            <div style={css.cardSub}>Select from recent sales or describe manually — both optional</div>

            {recentSales.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Select from recent sales</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {recentSales.slice(0, 10).map(sale => {
                    const isSelected = selectedSales.find(s => s.id === sale.id)
                    return (
                      <button key={sale.id}
                        onClick={() => toggleSale(sale)}
                        style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, background: isSelected ? 'var(--accent-light)' : 'transparent', color: isSelected ? 'var(--accent)' : 'var(--muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {sale.units}x {sale.name}
                      </button>
                    )
                  })}
                </div>
                {selectedSales.length > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Selected: {selectedSales.map(s => `${s.units}x ${s.name}`).join(', ')}</div>
                )}
              </div>
            )}

            <div style={{ ...css.field, marginBottom: '12px' }}>
              <label style={css.label}>Additional description</label>
              <textarea style={css.textarea} value={fContents} onChange={e => setFContents(e.target.value)} placeholder="e.g. 2x Phone stand, 1x Cable holder (optional)" />
            </div>

            <div style={css.g2}>
              <div style={css.field}><label style={css.label}>Weight (grams, optional)</label><input style={css.input} type="number" value={fWeight} min="0" onChange={e => setFWeight(e.target.value)} /></div>
              <div style={css.field}><label style={css.label}>Notes</label><input style={css.input} value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Fragile, urgent..." /></div>
            </div>
            <button style={css.btn} onClick={addShipment}>+ Create shipment</button>
          </div>
        </>
      )}

      {tab === 'history' && (
        history.length === 0
          ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: '14px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px' }}>No sent shipments yet.</div>
          : history.map(s => <ShipmentCard key={s.id} s={s} showHistory />)
      )}

      {/* PRINT MODAL */}
      {printShipment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={e => { if (e.target === e.currentTarget) setPrintShipment(null) }}>
          <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Shipping label</div>
              <button style={css.btnSm} onClick={() => setPrintShipment(null)}>✕ Close</button>
            </div>

            <div id="print-label" style={{ border: '2px solid var(--text)', borderRadius: '10px', padding: '24px', marginBottom: '20px', fontFamily: 'var(--mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>From</div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>FarmFlow Store</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontSize: '13px' }}>{new Date().toLocaleDateString('en-GB')}</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>To</div>
                <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '6px' }}>{printShipment.recipient_name}</div>
                <div style={{ fontSize: '14px', marginBottom: '3px' }}>{printShipment.address}</div>
                <div style={{ fontSize: '14px', marginBottom: '3px' }}>{printShipment.postal_code} {printShipment.city}, {printShipment.country}</div>
                {printShipment.phone && <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{printShipment.phone}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: printShipment.refund_iban || printShipment.tracking_number ? '16px' : '0' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Contents</div>
                  <div style={{ fontSize: '13px' }}>{printShipment.contents || '—'}</div>
                  {printShipment.weight_grams > 0 && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{printShipment.weight_grams}g</div>}
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Cash on delivery</div>
                  <div style={{ fontSize: '20px', fontWeight: '500', color: printShipment.cod_amount > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                    {printShipment.cod_amount > 0 ? `$${printShipment.cod_amount.toFixed(2)}` : 'None'}
                  </div>
                </div>
              </div>

              {printShipment.refund_iban && (
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>IBAN for refund</div>
                  <div style={{ fontSize: '13px' }}>{printShipment.refund_iban}</div>
                </div>
              )}

              {printShipment.tracking_number && (
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Tracking number</div>
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{printShipment.tracking_number}</div>
                </div>
              )}

              {printShipment.notes && (
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Notes</div>
                  <div style={{ fontSize: '13px', fontStyle: 'italic' }}>{printShipment.notes}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...css.btn, flex: 1 }} onClick={() => window.print()}>🖨 Print</button>
              <button style={{ ...css.btnSm, padding: '10px 16px' }} onClick={() => setPrintShipment(null)}>Close</button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>Opens your system print dialog</div>
          </div>
        </div>
      )}
    </div>
  )
}
