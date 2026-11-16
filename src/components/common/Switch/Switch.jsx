import { useId } from 'react'
import './Switch.css'

export default function Switch({ label, description, checked, onChange, disabled = false }) {
  const id = useId()
  return (
    <label htmlFor={id} className={`switch ${disabled ? 'switch--disabled' : ''}`}>
      <span className="switch__text">
        <span className="switch__label">{label}</span>
        {description && <span className="switch__description">{description}</span>}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch__track" aria-hidden>
        <span className="switch__thumb" />
      </span>
    </label>
  )
}
