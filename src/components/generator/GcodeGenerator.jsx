import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import styles from './GcodeGenerator.module.css'

const PRINTERS = {
  a1mini: { name: 'A1 Mini', bedX: 180, bedY: 180 },
  a1:     { name: 'A1',      bedX: 256, bedY: 256 },
  p1s:    { name: 'P1S',     bedX: 256, bedY: 256 },
  x1c:    { name: 'X1C',     bedX: 256, bedY: 256 },
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
      '; Paste ONCE at the end of Machine end G-code',
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

          <div className={styles.installGuide}>
            <div className={styles.installTitle}>How to install in Bambu Studio</div>
            <ol className={styles.installSteps}>
              <li>Open Bambu Studio and click <strong>Printer Settings</strong></li>
              <li>Find <strong>Machine G-code</strong> and click <strong>Machine end G-code</strong></li>
              <li>Scroll to the <strong>very bottom</strong> and paste the FarmFlow code</li>
              <li>Click <strong>Save</strong> — every future print will auto-eject</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
