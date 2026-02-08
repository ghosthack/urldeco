import { useState, useEffect } from 'react'

function App() {
  const [decodeInput, setDecodeInput] = useState('')
  const [encodeInput, setEncodeInput] = useState('')
  const [decodeResult, setDecodeResult] = useState('')
  const [encodeResult, setEncodeResult] = useState('')
  const [isDark, setIsDark] = useState(true)
  const [copiedDecode, setCopiedDecode] = useState(false)
  const [copiedEncode, setCopiedEncode] = useState(false)
  const [pastedDecode, setPastedDecode] = useState(false)
  const [pastedEncode, setPastedEncode] = useState(false)
  const [pasteError, setPasteError] = useState<string | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('urldeco-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('urldeco-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(decodeInput)
      setDecodeResult(decoded)
    } catch (e) {
      setDecodeResult('Invalid URL-encoded string')
    }
  }

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(encodeInput)
      setEncodeResult(encoded)
    } catch (e) {
      setEncodeResult('Invalid input')
    }
  }

  const copyToClipboard = async (text: string, type: 'decode' | 'encode') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'decode') {
        setCopiedDecode(true)
        setTimeout(() => setCopiedDecode(false), 2000)
      } else {
        setCopiedEncode(true)
        setTimeout(() => setCopiedEncode(false), 2000)
      }
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  const pasteFromClipboard = async (type: 'decode' | 'encode') => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setPasteError('Clipboard API not supported in this browser')
        setTimeout(() => setPasteError(null), 3000)
        return
      }
      const text = await navigator.clipboard.readText()
      if (type === 'decode') {
        setDecodeInput(text)
        setPastedDecode(true)
        setTimeout(() => setPastedDecode(false), 2000)
      } else {
        setEncodeInput(text)
        setPastedEncode(true)
        setTimeout(() => setPastedEncode(false), 2000)
      }
    } catch (e) {
      console.error('Failed to paste:', e)
      setPasteError('Paste permission denied. Use Ctrl+V / Cmd+V instead.')
      setTimeout(() => setPasteError(null), 3000)
    }
  }

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      {pasteError && (
        <div className="paste-error">
          {pasteError}
        </div>
      )}
      
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-cell input-cell">
            <label htmlFor="decode-input">Decode URL</label>
            <div className="input-container">
              <textarea
                id="decode-input"
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste URL-encoded text here..."
                rows={5}
              />
              <button
                className="paste-btn"
                onClick={() => pasteFromClipboard('decode')}
              >
                {pastedDecode ? 'Pasted!' : 'Paste'}
              </button>
            </div>
          </div>
          <div className="grid-cell input-cell">
            <label htmlFor="encode-input">Encode URL</label>
            <div className="input-container">
              <textarea
                id="encode-input"
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="Paste text to encode here..."
                rows={5}
              />
              <button
                className="paste-btn"
                onClick={() => pasteFromClipboard('encode')}
              >
                {pastedEncode ? 'Pasted!' : 'Paste'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid-row">
          <div className="grid-cell">
            <button className="action-btn decode-btn" onClick={handleDecode}>
              Decode
            </button>
          </div>
          <div className="grid-cell">
            <button className="action-btn encode-btn" onClick={handleEncode}>
              Encode
            </button>
          </div>
        </div>

        <div className="grid-row">
          <div className="grid-cell result-cell">
            <label>Decoded Result</label>
            <div className="result-container">
              <textarea
                value={decodeResult}
                readOnly
                placeholder="Result will appear here..."
                rows={5}
              />
              {decodeResult && (
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(decodeResult, 'decode')}
                >
                  {copiedDecode ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>
          <div className="grid-cell result-cell">
            <label>Encoded Result</label>
            <div className="result-container">
              <textarea
                value={encodeResult}
                readOnly
                placeholder="Result will appear here..."
                rows={5}
              />
              {encodeResult && (
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(encodeResult, 'encode')}
                >
                  {copiedEncode ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
