import './Button.css'

export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md', // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, fullWidth && 'btn--full', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {loading ? <span className="btn__spinner" aria-hidden /> : null}
      <span>{children}</span>
    </button>
  )
}
