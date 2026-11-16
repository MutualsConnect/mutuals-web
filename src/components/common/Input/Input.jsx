import { forwardRef, useId } from 'react'
import './Input.css'

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${inputId}-msg` : undefined}
        {...props}
      />
      {(error || hint) && (
        <p id={`${inputId}-msg`} className={error ? 'field__error' : 'field__hint'}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default Input
