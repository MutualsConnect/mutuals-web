import './Avatar.css'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function Avatar({ src, name, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 }
  return src ? (
    <img className="avatar" src={src} alt={name ?? 'Avatar'} style={style} />
  ) : (
    <span className="avatar avatar--fallback" style={style} aria-label={name}>
      {initials(name) || '?'}
    </span>
  )
}
