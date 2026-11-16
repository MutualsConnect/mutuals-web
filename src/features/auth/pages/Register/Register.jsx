import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import { getErrorMessage, getFieldErrors } from '../../../../utils/errors'
import {
  PASSWORD_HINT,
  collectErrors,
  validateDisplayName,
  validateEmail,
  validateStrongPassword,
  validateUsername,
} from '../../../../utils/validators'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import '../../components/AuthForm.css'

const INITIAL = { displayName: '', username: '', email: '', password: '', confirmPassword: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    // El backend solo acepta usernames en minúscula
    setForm({ ...form, [name]: name === 'username' ? value.toLowerCase() : value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = collectErrors({
      displayName: validateDisplayName(form.displayName),
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validateStrongPassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? null : 'Las contraseñas no coinciden',
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    setServerError('')
    try {
      await register({
        displayName: form.displayName.trim(),
        username: form.username,
        email: form.email.trim(),
        password: form.password,
      })
      navigate(ROUTES.HOME, { replace: true })
    } catch (err) {
      setErrors(getFieldErrors(err))
      setServerError(getErrorMessage(err, 'No se pudo crear la cuenta'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2 className="auth-form__title">Crea tu cuenta</h2>
      <ErrorMessage message={serverError} />

      <Input
        label="Nombre"
        name="displayName"
        autoComplete="name"
        value={form.displayName}
        onChange={onChange}
        error={errors.displayName}
      />
      <Input
        label="Nombre de usuario"
        name="username"
        autoComplete="username"
        value={form.username}
        onChange={onChange}
        error={errors.username}
      />
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
        Crear cuenta
      </Button>

      <p className="auth-form__footer">
        ¿Ya tienes cuenta? <Link to={ROUTES.LOGIN}>Inicia sesión</Link>
      </p>
    </form>
  )
}
