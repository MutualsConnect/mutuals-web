import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { streakService } from '../../services/streakService'
import { getErrorMessage } from '../../../../utils/errors'
import { QR_REFRESH_MS } from '../../constants'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Button from '../../../../components/common/Button'
import './MyQrCode.css'

// Mi QR para que un mutual lo escanee. El token rota cada 30 s en el backend,
// así que se pide uno nuevo cada 25 s.
export default function MyQrCode() {
  const [qr, setQr] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    const load = () =>
      streakService
        .getMyQrCode()
        .then((data) => {
          if (!active) return
          setQr(data)
          setError('')
        })
        .catch((err) => {
          if (active) setError(getErrorMessage(err, 'No se pudo generar tu QR'))
        })

    load()
    const timer = setInterval(load, QR_REFRESH_MS)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [])

  // Para cuando no hay cámara: el mutual pega este código en Escanear → "O pega el código"
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qr.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (error) return <ErrorMessage message={error} />
  if (!qr) return <Loader />

  return (
    <div className="my-qr">
      <div className="my-qr__code">
        <QRCodeSVG value={qr.token} size={220} marginSize={2} />
      </div>
      <Button variant="secondary" size="sm" onClick={copy}>
        {copied ? 'Código copiado' : 'Copiar código'}
      </Button>
      <p className="my-qr__hint">
        Pídele a tu mutual que lo escanee desde <strong>Check-in → Escanear</strong>, o cópiale el
        código para que lo pegue ahí. Se renueva cada 30 segundos.
      </p>
    </div>
  )
}
