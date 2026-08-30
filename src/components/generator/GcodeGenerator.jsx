import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import styles from './GcodeGenerator.module.css'

const PRINTERS = {
  a1mini: { name: 'A1 Mini', bedX: 180, bedY: 180 },
  a1:     { name: 'A1',      bedX: 256, bedY: 256 },
  p1s:    { name: 'P1S',     bedX: 256, bedY: 256 },
  x1c:    { name: 'X1C',     bedX: 256, bedY: 256 },
}

const guideS = {
  wrap: { maxWidth: '100%', margin: '0', padding: '28px 0 8px' },
  title: { fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: 'var(--text)' },
  intro: { fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '24px' },
  step: { display: 'flex', gap: '14px', position: 'relative' },
  stepLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 },
  stepNum: (active) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    background: active ? 'var(--accent)' : 'var(--surface2)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '500',
    color: active ? 'white' : 'var(--text)',
    flexShrink: 0, zIndex: 1,
  }),
  stepLine: { width: '1px', background: 'var(--border)', flex: 1, margin: '4px 0', minHeight: '16px' },
  stepContent: { paddingBottom: '22px', flex: 1 },
  stepTitle: { fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', paddingTop: '3px' },
  stepDesc: { fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '10px' },
  note: (type) => {
    const map = {
      info: ['#E6F1FB', '#185FA5'],
      warn: ['#FAEEDA', '#854F0B'],
      ok:   ['#EAF3DE', '#3B6D11'],
    }
    const [bg, color] = map[type]
    return {
      background: bg, border: `0.5px solid ${color}`,
      borderRadius: '8px', padding: '8px 12px',
      fontSize: '12px', color,
      display: 'flex', alignItems: 'flex-start', gap: '6px',
      marginBottom: '8px', lineHeight: 1.55,
    }
  },
  bui: { background: '#1a1a18', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' },
  btopnav: { display: 'flex', gap: '10px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #2a2a28', flexWrap: 'wrap' },
  btopItem: (active) => ({
    fontSize: '11px', color: active ? 'white' : '#555',
    background: active ? '#2d6e2d' : 'transparent',
    padding: active ? '3px 8px' : '3px 0',
    borderRadius: active ? '4px' : '0',
    fontFamily: 'monospace',
  }),
  bsec: { fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontFamily: 'monospace' },
  brow: { display: 'flex', justifyContent: 'space-between', padding: '3px 0' },
  browLabel: { fontSize: '11px', color: '#777', fontFamily: 'monospace' },
  browVal: { fontSize: '11px', color: '#e07040', fontFamily: 'monospace' },
  bcode: {
    background: '#111', border: '1px solid #2a2a28', borderRadius: '4px',
    padding: '10px 12px', fontFamily: 'monospace', fontSize: '11px',
    color: '#9fe1cb', lineHeight: 1.7, marginTop: '8px',
    whiteSpace: 'pre', overflowX: 'auto',
  },
  profile: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px 14px',
    fontFamily: 'monospace', fontSize: '12px', color: 'var(--text)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '10px',
  },
  profileBadge: {
    background: 'var(--accent)', color: 'white', fontSize: '10px',
    padding: '2px 7px', borderRadius: '4px', fontFamily: 'var(--font)', fontWeight: '500',
  },
}

function InstallGuide() {
  return (
    <div style={guideS.wrap}>
      <div style={guideS.title}>How to install in Bambu Studio</div>
      <div style={guideS.intro}>
        Follow these 4 steps once. After that, every print you send — no matter what you are printing — will eject automatically when finished.
      </div>

      {/* STEP 1 */}
      <div style={guideS.step}>
        <div style={guideS.stepLeft}>
          <div style={guideS.stepNum(true)}>1</div>
          <div style={guideS.stepLine} />
        </div>
        <div style={guideS.stepContent}>
          <div style={guideS.stepTitle}>Copy the generated code above</div>
          <div style={guideS.stepDesc}>
            Click the <strong>Copy code</strong> button above. The entire snippet is copied to your clipboard.
          </div>
          <div style={guideS.note('info')}>
            <span style={{ flexShrink: 0 }}>ℹ</span>
            Make sure you copy the full code — it starts with a semicolon comment line and ends with M117.
          </div>
        </div>
      </div>

      {/* STEP 2 */}
      <div style={guideS.step}>
        <div style={guideS.stepLeft}>
          <div style={guideS.stepNum(false)}>2</div>
          <div style={guideS.stepLine} />
        </div>
        <div style={guideS.stepContent}>
          <div style={guideS.stepTitle}>Open Bambu Studio → Prepare → click the edit icon on the printer card</div>
          <div style={guideS.stepDesc}>
            Open Bambu Studio and make sure you are on the <strong>Prepare</strong> tab. On the left side, find your printer card. Click the <strong>small edit icon in the top right corner</strong> of the card — a "Printer settings" window will open.
          </div>
          <div style={guideS.bui}>
            <div style={guideS.btopnav}>
              {['Prepare', 'Preview', 'Device', 'Project', 'Calibration'].map(m => (
                <span key={m} style={guideS.btopItem(m === 'Prepare')}>{m}</span>
              ))}
            </div>
            <div style={guideS.bsec}>Printer card — left panel</div>
            <div style={{
              border: '1px solid #2d6e2d', borderRadius: '6px', padding: '10px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px',
            }}>
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>Bambu Lab A1 mini</span>
              <span style={{ fontSize: '12px', color: '#e07040', border: '1px solid #e07040', borderRadius: '3px', padding: '1px 6px', fontFamily: 'monospace' }}>✎ ← click here</span>
            </div>
          </div>
          <div style={guideS.stepDesc}>
            In the Printer settings window that opens, click the <strong>Machine gcode</strong> tab at the top.
          </div>
          <div style={guideS.bui}>
            <div style={guideS.bsec}>Printer settings window — tabs</div>
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #2a2a28', marginBottom: '8px', flexWrap: 'wrap' }}>
              {['Basic information', 'Machine gcode', 'Motion ability', 'Extruder', 'Notes'].map(t => (
                <span key={t} style={{
                  fontSize: '10px', fontFamily: 'monospace', padding: '5px 8px',
                  color: t === 'Machine gcode' ? 'white' : '#555',
                  borderBottom: t === 'Machine gcode' ? '2px solid #e07040' : 'none',
                  fontWeight: t === 'Machine gcode' ? '600' : '400',
                  whiteSpace: 'nowrap',
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3 */}
      <div style={guideS.step}>
        <div style={guideS.stepLeft}>
          <div style={guideS.stepNum(false)}>3</div>
          <div style={guideS.stepLine} />
        </div>
        <div style={guideS.stepContent}>
          <div style={guideS.stepTitle}>Scroll down to "Machine end G-code" and paste</div>
          <div style={guideS.stepDesc}>
            In the Machine gcode tab you will see two fields. Scroll down to <strong>Machine end G-code</strong>. Click at the <strong>very end of the last line</strong>, press <strong>Enter</strong> to go to a new line, then paste (Ctrl+V).
          </div>
          <div style={guideS.bui}>
            <div style={guideS.bsec}>Machine gcode tab</div>
            <div style={{ fontSize: '11px', color: '#555', fontFamily: 'monospace', marginBottom: '6px' }}>Machine start G-code</div>
            <div style={{ background: '#111', border: '1px solid #2a2a28', borderRadius: '4px', padding: '6px 10px', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', color: '#333', fontFamily: 'monospace' }}>; existing start code...</div>
            </div>
            <div style={{ fontSize: '11px', color: '#3B6D11', fontWeight: '600', fontFamily: 'monospace', marginBottom: '6px' }}>Machine end G-code ← scroll here</div>
            <div style={guideS.bcode}>{`; existing Bambu end code (keep everything)
G392 S0
M400 ; wait for buffer to clear
G90
G1 Z{max_layer_z + 0.4} F900

; FarmFlow Auto-Eject ← paste below last line
M104 S0
M140 S0
M106 S128
G4 S{cooling_seconds}
M106 S0
G90
G1 X{center_x} F9000
G1 Y{max_y} F2000
M117 FarmFlow: Done!`}</div>
          </div>
          <div style={guideS.note('warn')}>
            <span style={{ flexShrink: 0 }}>⚠</span>
            Do not delete the existing Bambu code. Click at the end of the last line, press Enter, then paste the FarmFlow code below it.
          </div>
        </div>
      </div>

      {/* STEP 4 */}
      <div style={guideS.step}>
        <div style={guideS.stepLeft}>
          <div style={guideS.stepNum(false)}>4</div>
        </div>
        <div style={guideS.stepContent}>
          <div style={guideS.stepTitle}>Save the profile</div>
          <div style={guideS.stepDesc}>
            Click <strong>Save</strong> in the settings window. If Bambu Studio asks you to name the profile, give it a recognizable name.
          </div>
          <div style={guideS.profile}>
            <span>A1 Mini — Auto-Eject</span>
            <span style={guideS.profileBadge}>SAVED</span>
          </div>
          <div style={guideS.note('ok')}>
            <span style={{ flexShrink: 0 }}>✓</span>
            Done. Every print you send from now on will auto-eject when the cooling time is complete. You never need to change this again.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GcodeGenerator() {
  const { profile } = useAuth()
  const [printer, setPrinter] = useState(profile?.printer_model || 'a1mini')
  const [material, setMaterial] = useState('PLA')
  const [plate, setPlate] = useState(3)
  const [mins, setMins] = useState(30)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    const p = PRINTERS[printer]
    const secs = mins * 60
    const z = (parseFloat(plate) + 1.0).toFixed(1)
    const cx = Math.round(p.bedX / 2)
    const maxY = p.bedY

    const result = [
      '; ================================================',
      '; FarmFlow Auto-Eject — ' + p.name,
      '; Material: ' + material + ' | Plate: ' + plate + 'mm',
      '; Cooling: ' + mins + ' min | Fan: 50%',
      '; Paste at the END of Machine end G-code in Bambu Studio',
      '; ================================================',
      '',
      'M104 S0',
      'M140 S0',
      'M106 S128',
      '',
      'M117 FarmFlow: Cooling ' + mins + ' min...',
      'G4 S' + secs,
      '',
      'M106 S0',
      '',
      'M117 FarmFlow: Ejecting!',
      'G90',
      'G1 X' + cx + ' F9000',
      'G1 Z' + z + ' F600',
      'G1 Y0 F9000',
      'G1 Y' + maxY + ' F2000',
      '',
      'G1 Z20 F600',
      'G1 X0 Y' + maxY + ' F6000',
      'M117 FarmFlow: Done!',
    ].join('\n')

    setCode(result)
    setCopied(false)
  }

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function colorize(c) {
    return c.split('\n').map(function(line) {
      var t = line.trim()
      if (t.startsWith(';')) return '<span class="gc-comment">' + esc(line) + '</span>'
      if (/^G4/.test(t) || /^M106/.test(t)) return '<span class="gc-hi">' + esc(line) + '</span>'
      if (/^G1 Y/.test(t) && t.indexOf('F2000') >= 0) return '<span class="gc-ok">' + esc(line) + '</span>'
      if (/^M117/.test(t)) return '<span class="gc-str">' + esc(line) + '</span>'
      if (/^[GM]\d/.test(t)) return '<span class="gc-cmd">' + esc(line) + '</span>'
      return '<span>' + esc(line) + '</span>'
    }).join('\n')
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Farm Automation</div>
        <h1 className={styles.title}>G-Code Generator</h1>
        <p className={styles.sub}>
          Configure your printer once, paste the code into Bambu Studio, and every print ejects automatically when done. Whatever you print, whenever you print it.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>Select your printer</div>
        <div className={styles.printerGrid}>
          {Object.entries(PRINTERS).map(function(entry) {
            var key = entry[0]
            var p = entry[1]
            return (
              <button
                key={key}
                className={styles.pc + (printer === key ? ' ' + styles.sel : '')}
                onClick={function() { setPrinter(key) }}
              >
                <span className={styles.pcIcon}>🖨️</span>
                <span className={styles.pcName}>{p.name}</span>
                <span className={styles.pcSpec}>{p.bedX}x{p.bedY}mm</span>
              </button>
            )
          })}
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label>Material</label>
            <select value={material} onChange={function(e) { setMaterial(e.target.value) }}>
              <option>PLA</option>
              <option>PETG</option>
              <option>ABS</option>
              <option>TPU</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Plate thickness (mm)</label>
            <input
              type="number"
              value={plate}
              min="1"
              max="10"
              step="0.5"
              onChange={function(e) { setPlate(e.target.value) }}
            />
          </div>
          <div className={styles.field}>
            <label>Cooling time (minutes)</label>
            <input
              type="number"
              value={mins}
              min="5"
              max="60"
              onChange={function(e) { setMins(e.target.value) }}
            />
          </div>
        </div>

        <button className={styles.genBtn} onClick={generate}>
          Generate G-Code
        </button>
      </div>

      {code && (
        <div className={styles.resultCard}>
          <div className={styles.resultHead}>
            <div>
              <div className={styles.resultTitle}>Your G-code is ready</div>
              <div className={styles.resultSub}>Paste at the end of Machine end G-code in Bambu Studio</div>
            </div>
            <button
              className={styles.copyBtn + (copied ? ' ' + styles.copied : '')}
              onClick={copyCode}
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>

          <div
            className={styles.gcBox}
            dangerouslySetInnerHTML={{ __html: colorize(code) }}
          />

          <InstallGuide />
        </div>
      )}
    </div>
  )
}
