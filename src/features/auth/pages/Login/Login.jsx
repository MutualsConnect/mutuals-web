import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { collectErrors, validateEmail } from '../../../../utils/validators'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import GoogleButton from '../../components/GoogleButton'
import '../../components/AuthForm.css'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? ROUTES.HOME

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = collectErrors({
      email: validateEmail(form.email),
      password: form.password ? null : 'Ingresa tu contraseña',
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    setServerError('')
    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'No se pudo iniciar sesión'))
    } finally {
      setSubmitting(false)
    }
  }

  const onGoogle = async (idToken) => {
    setSubmitting(true)
    setServerError('')
    try {
      await loginWithGoogle(idToken)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'No se pudo iniciar sesión con Google'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2 className="auth-form__title">Inicia sesión</h2>
      <ErrorMessage message={serverError} />

      <Input
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={onChange}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={onChange}
        error={errors.password}
      />
      <div className="auth-form__row">
        <Link to={ROUTES.FORGOT_PASSWORD}>¿Olvidaste tu contraseña?</Link>
      </div>

      <Button type="submit" fullWidth loading={submitting}>
        Entrar
      </Button>

      <GoogleButton onCredential={onGoogle} disabled={submitting} />

      <p className="auth-form__footer">
        ¿No tienes cuenta? <Link to={ROUTES.REGISTER}>Regístrate</Link>
      </p>
    </form>
  )
}
