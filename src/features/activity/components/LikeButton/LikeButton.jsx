import './LikeButton.css'
import Icon from '../../../../components/common/Icon'

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
      <Icon name="heart" size={16} filled={liked} />
      <span>{count}</span>
    </button>
  )
}
