import { forwardRef, useId } from 'react'
import '../Input/Input.css'
import './Textarea.css'

// Mismo estilo que Input. Si recibe maxLength muestra el contador.
const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, className = '', rows = 3, value, maxLength, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const counter = maxLength != null ? `${value?.length ?? 0}/${maxLength}` : null
  const message = error || hint || counter

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        className={`field__input field__textarea ${error ? 'field__input--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? `${inputId}-msg` : undefined}
        {...props}
      />
      {message && (
        <p id={`${inputId}-msg`} className={error ? 'field__error' : 'field__hint'}>
          {error || [hint, counter].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  )
})

export default Textarea
