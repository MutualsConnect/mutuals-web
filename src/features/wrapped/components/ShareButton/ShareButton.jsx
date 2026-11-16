import { useState } from 'react'
import Button from '../../../../components/common/Button'
import Icon from '../../../../components/common/Icon'

// Comparte un texto con el menú del sistema (móvil) o lo copia al portapapeles
export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El usuario canceló o el navegador no lo permite
    }
  }

  return (
    <Button variant="secondary" onClick={share}>
      {copied ? <><Icon name="check" size={16} /> ¡Copiado!</> : <><Icon name="share" size={16} /> Compartir</>}
    </Button>
  )
}
