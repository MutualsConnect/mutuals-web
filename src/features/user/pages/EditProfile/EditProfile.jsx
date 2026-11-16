import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../../services/userService'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage, getFieldErrors } from '../../../../utils/errors'
import { collectErrors, validateDisplayName } from '../../../../utils/validators'
import { BIO_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Input from '../../../../components/common/Input'
import Textarea from '../../../../components/common/Textarea'
import '../../components/UserPage.css'

function validateAvatarUrl(url) {
  if (!url) return null
  if (!url.startsWith('https://')) return 'La URL debe empezar con https://'
  if (url.length > 500) return 'Máximo 500 caracteres'
  return null
}

export default function EditProfile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    displayName: user.displayName ?? '',
    bio: user.bio ?? '',
    avatarUrl: user.avatarUrl ?? '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = collectErrors({
      displayName: validateDisplayName(form.displayName),
      bio: form.bio.length > BIO_MAX_LENGTH ? `Máximo ${BIO_MAX_LENGTH} caracteres` : null,
      avatarUrl: validateAvatarUrl(form.avatarUrl.trim()),
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    setServerError('')
    try {
      const updated = await userService.updateMe({
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim() || null,
      })
      setUser(updated)
      navigate(ROUTES.PROFILE)
    } catch (err) {
      setErrors(getFieldErrors(err))
      setServerError(getErrorMessage(err, 'No se pudo guardar'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="user-page">
      <Link to={ROUTES.PROFILE} className="user-page__back">
        ← Mi perfil
      </Link>
      <h1 className="user-page__title">Editar perfil</h1>

      <Card>
        <form className="user-page__form" onSubmit={onSubmit} noValidate>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar src={form.avatarUrl.startsWith('https://') ? form.avatarUrl : null} name={form.displayName} size={88} />
          </div>
          <ErrorMessage message={serverError} />

          <Input
            label="Nombre"
            name="displayName"
            value={form.displayName}
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            onChange={onChange}
            error={errors.displayName}
          />
          <Input label="Nombre de usuario" value={`@${user.username}`} disabled hint="No se puede cambiar" />
          <Textarea
            label="Biografía"
            name="bio"
            value={form.bio}
            maxLength={BIO_MAX_LENGTH}
            onChange={onChange}
            error={errors.bio}
            placeholder="Cuéntale a tus amigos algo de ti"
          />
          <Input
            label="URL de tu foto (opcional)"
            name="avatarUrl"
            type="url"
            placeholder="https://..."
            value={form.avatarUrl}
            onChange={onChange}
            error={errors.avatarUrl}
            hint="Por ahora el backend solo acepta un enlace https a la imagen"
          />

          <div className="user-page__form-actions">
            <Link to={ROUTES.PROFILE} className="btn btn--ghost btn--md">
              Cancelar
            </Link>
            <Button type="submit" loading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
