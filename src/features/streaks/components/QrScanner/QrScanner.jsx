import { useEffect, useRef, useState } from 'react'
import { streakService } from '../../services/streakService'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import './QrScanner.css'

// BarcodeDetector existe en Chrome/Edge/Android. En otros navegadores queda el campo manual.
const canScan = typeof window !== 'undefined' && 'BarcodeDetector' in window

export default function QrScanner({ onCheckedIn }) {
  const videoRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (value) => {
    if (!value) return
    setSubmitting(true)
    setError('')
    try {
      const interaction = await streakService.checkInWithQr(value.trim())
      setToken('')
      onCheckedIn?.(interaction)
    } catch (err) {
      setError(getErrorMessage(err, 'El código no es válido o ya venció'))
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!scanning) return
    let stream
    let timer
    let stopped = false

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (stopped) return
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        timer = setInterval(async () => {
          const codes = await detector.detect(videoRef.current).catch(() => [])
          if (codes[0]?.rawValue) {
            setScanning(false)
            submit(codes[0].rawValue)
          }
        }, 400)
      } catch {
        setError('No se pudo abrir la cámara. Revisa los permisos o pega el código.')
        setScanning(false)
      }
    }
    start()

    return () => {
      stopped = true
      clearInterval(timer)
      stream?.getTracks().forEach((t) => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning])

  return (
    <div className="qr-scanner">
      <ErrorMessage message={error} />

      {canScan && (
        <>
          {scanning && <video ref={videoRef} className="qr-scanner__video" muted playsInline />}
          <Button
            variant={scanning ? 'secondary' : 'primary'}
            fullWidth
            onClick={() => setScanning((s) => !s)}
            loading={submitting && !scanning}
          >
            {scanning ? 'Detener cámara' : 'Escanear con la cámara'}
          </Button>
        </>
      )}

      <form
        className="qr-scanner__manual"
        onSubmit={(e) => {
          e.preventDefault()
          submit(token)
        }}
      >
        <Input
          label={canScan ? 'O pega el código' : 'Código del QR'}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          hint={canScan ? undefined : 'Tu navegador no permite escanear: pega el código del QR.'}
        />
        <Button type="submit" variant="secondary" loading={submitting} disabled={!token.trim()}>
          Hacer check-in
        </Button>
      </form>
    </div>
  )
}
