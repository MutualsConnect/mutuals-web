import './LikeButton.css'

export default function LikeButton({ liked, count, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`like-button ${liked ? 'like-button--liked' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
    >
      <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}
