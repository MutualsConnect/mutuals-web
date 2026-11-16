import { formatNumber, pluralize } from '../../../../utils/format'
import MethodBars from '../MethodBars'
import './WrappedStory.css'
import Icon from '../../../../components/common/Icon'

function StoryCard({ color, kicker, value, caption, icon, children }) {
  return (
    <section className={`story-card story-card--${color}`}>
      {icon && (
        <span className="story-card__icon">
          <Icon name={icon} size={40} />
        </span>
      )}
      {kicker && <span className="story-card__kicker">{kicker}</span>}
      {value != null && <strong className="story-card__value">{value}</strong>}
      {caption && <p className="story-card__caption">{caption}</p>}
      {children}
    </section>
  )
}

// UserWrappedStats en formato de "historia" (tarjetas grandes una debajo de otra)
export default function WrappedStory({ title, stats }) {
  const s = stats ?? {}
  const nothing = !s.interactions && !s.activeDays

  return (
    <div className="wrapped-story">
      <StoryCard color="violet" kicker="Tu Wrapped" value={title} caption="Así conectaste con tus amigos" />

      {nothing ? (
        <StoryCard
          color="blue"
          kicker="Este periodo"
          icon="moon"
          caption="No registraste interacciones. ¡El próximo será tu mes!"
        />
      ) : (
        <>
          <StoryCard
            color="orange"
            icon="handshake"
            kicker="Interacciones confirmadas"
            value={formatNumber(s.interactions)}
            caption={`en ${pluralize(s.activeDays ?? 0, 'día activo', 'días activos')}`}
          />

          <StoryCard
            color="pink"
            icon="flame"
            kicker="Tu racha más larga"
            value={s.longestStreak ?? 0}
            caption={s.longestStreak === 1 ? 'día seguido' : 'días seguidos'}
          />

          {s.topMutualDisplayName && (
            <StoryCard
              color="teal"
              icon="star"
              kicker="Tu mutual #1"
              value={s.topMutualDisplayName}
              caption={`@${s.topMutualUsername} · ${pluralize(s.topMutualInteractions ?? 0, 'interacción', 'interacciones')} juntos`}
            />
          )}

          {s.interactionsByMethod && Object.keys(s.interactionsByMethod).length > 0 && (
            <StoryCard color="blue" kicker="Cómo se encontraron">
              <MethodBars byMethod={s.interactionsByMethod} />
            </StoryCard>
          )}

          <StoryCard color="violet" kicker="Y además">
            <ul className="story-card__facts">
              <li>
                <strong className="icon-text"><Icon name="target" size={22} /> {formatNumber(s.challengesCompleted ?? 0)}</strong> desafíos completados
              </li>
              <li>
                <strong className="icon-text"><Icon name="gem" size={22} /> {formatNumber(s.gemsEarned ?? 0)}</strong> gemas ganadas
              </li>
              <li>
                <strong className="icon-text"><Icon name="gift" size={22} /> {formatNumber(s.shieldsGifted ?? 0)}</strong> escudos regalados
              </li>
              <li>
                <strong className="icon-text"><Icon name="users" size={22} /> {formatNumber(s.newMutuals ?? 0)}</strong> nuevos mutuals
              </li>
            </ul>
          </StoryCard>
        </>
      )}
    </div>
  )
}
