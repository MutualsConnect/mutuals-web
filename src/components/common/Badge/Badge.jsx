import './Badge.css'

// tone: neutral | primary | success | warning | danger
export default function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
