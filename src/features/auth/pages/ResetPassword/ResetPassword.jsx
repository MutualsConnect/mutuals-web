import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/authService'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import {
  PASSWORD_HINT,
  collectErrors,
  validateStrongPassword,
} from '../../../../utils/validators'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import '../../components/AuthForm.css'

// Se abre desde el correo: /reset-password?token=...
export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = collectErrors({
      password: validateStrongPassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? null : 'Las contraseñas no coinciden',
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    setServerError('')
    try {
      await authService.confirmPasswordReset(token, form.password)
      setDone(true)
    } catch (err) {
      setServerError(getErrorMessage(err, 'El enlace no es válido o ya expiró'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-form">
        <h2 className="auth-form__title">Enlace no válido</h2>
        <ErrorMessage message="Falta el token de recuperación. Vuelve a solicitar el enlace." />
        <p className="auth-form__footer">
          <Link to={ROUTES.FORGOT_PASSWORD}>Solicitar un nuevo enlace</Link>
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="auth-form">
        <h2 className="auth-form__title">¡Listo!</h2>
        <p className="auth-form__success">Tu contraseña fue actualizada.</p>
        <p className="auth-form__footer">
          <Link to={ROUTES.LOGIN}>Iniciar sesión</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2 className="auth-form__title">Nueva contraseña</h2>
      <ErrorMessage message={serverError} />

      <Input
        label="Nueva contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={onChange}
        error={errors.password}
        hint={PASSWORD_HINT}
      />
      <Input
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
      />

      <Button type="submit" fullWidth loading={submitting}>
        Guardar contraseña
      </Button>
    </form>
  )
}
