import { forwardRef, useId } from 'react'
import '../Input/Input.css'

// options: [{ value, label }]
const Select = forwardRef(function Select(
  { label, error, options, placeholder, id, className = '', ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="field__error">{error}</p>}
    </div>
  )
})

export default Select
