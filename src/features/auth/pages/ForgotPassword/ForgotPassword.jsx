import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { validateEmail } from '../../../../utils/validators'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import '../../components/AuthForm.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const emailError = validateEmail(email)
    setError(emailError ?? '')
    if (emailError) return

    setSubmitting(true)
    setServerError('')
    try {
      await authService.requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-form">
        <h2 className="auth-form__title">Revisa tu correo</h2>
        <p className="auth-form__success">
          Si <strong>{email}</strong> está registrado, te enviamos un enlace para restablecer tu
          contraseña.
        </p>
        <p className="auth-form__footer">
          <Link to={ROUTES.LOGIN}>Volver a iniciar sesión</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2 className="auth-form__title">Recupera tu contraseña</h2>
      <p className="auth-form__subtitle">Te enviaremos un enlace a tu correo.</p>
      <ErrorMessage message={serverError} />

      <Input
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <Button type="submit" fullWidth loading={submitting}>
        Enviar enlace
      </Button>

      <p className="auth-form__footer">
        <Link to={ROUTES.LOGIN}>Volver a iniciar sesión</Link>
      </p>
    </form>
  )
}
