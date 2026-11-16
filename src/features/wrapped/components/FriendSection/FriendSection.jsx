import { Link } from 'react-router-dom'
import { profilePath } from '../../../../constants/routes'
import { formatDate, formatNumber } from '../../../../utils/format'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Card from '../../../../components/common/Card'
import MethodBars from '../MethodBars'
import './FriendSection.css'
import Icon from '../../../../components/common/Icon'

// FriendWrappedSection: historia completa con un amigo (o ex amigo)
export default function FriendSection({ section }) {
  const { friend } = section
  return (
    <Card className="friend-section">
      <div className="friend-section__head">
        <Link to={profilePath(friend.username)} className="friend-section__who">
          <Avatar src={friend.avatarUrl} name={friend.displayName} size={44} />
          <span>
            <strong>{friend.displayName}</strong>
            <span className="friend-section__since">
              {section.firstMutualAt
                ? `Mutuals desde ${formatDate(section.firstMutualAt, { month: 'long', year: 'numeric' })}`
                : `@${friend.username}`}
            </span>
          </span>
        </Link>
        {!section.currentlyMutual && <Badge>Ya no son mutuals</Badge>}
      </div>

      <div className="friend-section__stats">
        <div>
          <strong>{formatNumber(section.interactions)}</strong>
          <span>interacciones</span>
        </div>
        <div>
          <strong className="icon-text"><Icon name="flame" size={16} filled /> {section.bestStreak}</strong>
          <span>mejor racha</span>
        </div>
        <div>
          <strong>{section.totalStreaks}</strong>
          <span>rachas</span>
        </div>
        <div>
          <strong className="icon-text"><Icon name="target" size={16} /> {formatNumber(section.challengesCompleted)}</strong>
          <span>desafíos</span>
        </div>
      </div>

      {section.interactionsByMethod && Object.keys(section.interactionsByMethod).length > 0 && (
        <div className="friend-section__methods">
          <MethodBars byMethod={section.interactionsByMethod} />
        </div>
      )}
    </Card>
  )
}
