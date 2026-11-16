import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { challengeService } from '../../services/challengeService'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { CONTENT_MAX_LENGTH, PHOTO_ACCEPTED_TYPES, validatePhoto } from '../../constants'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Textarea from '../../../../components/common/Textarea'
import './SubmitChallengeForm.css'

export default function SubmitChallengeForm({ challenge, onSubmitted }) {
  const { template } = challenge
  const fileRef = useRef(null)
  const [content, setContent] = useState('')
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Vista previa de la foto elegida (se libera la URL al cambiarla)
  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!file) return
    const photoError = validatePhoto(file)
    if (photoError) {
      setError(photoError)
      return
    }
    setError('')
    setPhoto(file)
  }

  const removePhoto = () => setPhoto(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (template.requiresPhoto && !photo) return setError('Este desafío necesita una foto')
    if (!content.trim() && !photo) return setError('Escribe tu respuesta o agrega una foto')

    setSubmitting(true)
    setError('')
    try {
      const updated = await challengeService.submit(challenge.id, { content, photo })
      onSubmitted(updated)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo enviar tu respuesta'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="submit-challenge" onSubmit={onSubmit}>
      <h2 className="submit-challenge__title">Tu respuesta</h2>

      {template.requiresPresence && (
        <p className="submit-challenge__notice">
          📍 Este desafío es en persona: antes de responder, hagan un{' '}
          <Link to={ROUTES.STREAKS_CHECK_IN}>check-in juntos</Link> hoy.
        </p>
      )}

      <ErrorMessage message={error} />

      <Textarea
        label={template.requiresPhoto ? 'Comentario (opcional)' : 'Escribe tu respuesta'}
        value={content}
        maxLength={CONTENT_MAX_LENGTH}
        rows={4}
        onChange={(e) => setContent(e.target.value)}
        placeholder={template.prompt}
      />

      {preview ? (
        <div className="submit-challenge__preview">
          <img src={preview} alt="Vista previa de tu foto" />
          <Button size="sm" variant="secondary" onClick={removePhoto}>
            Quitar foto
          </Button>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          📷 {template.requiresPhoto ? 'Agregar foto (obligatoria)' : 'Agregar foto (opcional)'}
        </Button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={PHOTO_ACCEPTED_TYPES.join(',')}
        onChange={onPickPhoto}
        hidden
      />
      <p className="submit-challenge__hint">JPEG, PNG o WEBP de hasta 5 MB.</p>

      <Button type="submit" fullWidth loading={submitting}>
        Enviar respuesta
      </Button>
      <p className="submit-challenge__hint">
        Tu amigo no verá tu respuesta hasta que envíe la suya (y tú tampoco la de él).
      </p>
    </form>
  )
}
