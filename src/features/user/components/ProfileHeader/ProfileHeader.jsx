import { Link } from 'react-router-dom'
import { followersPath, followingPath } from '../../../../constants/routes'
import { formatDate, formatNumber } from '../../../../utils/format'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Card from '../../../../components/common/Card'
import StreakFlame from '../../../streaks/components/StreakFlame'
import './ProfileHeader.css'
import Icon from '../../../../components/common/Icon'

// Cabecera de un perfil público (PublicProfileResponse). children: botones de acción.
export default function ProfileHeader({ profile, isMe = false, children }) {
  const isMutual = profile.followedByMe && profile.followsMe

  return (
    <Card className="profile-header">
      <Avatar src={profile.avatarUrl} name={profile.displayName} size={96} />

      <div className="profile-header__names">
        <h1 className="profile-header__name">
          {profile.displayName}
          {profile.premium && (
            <span className="profile-header__plus" title="Mutuals Plus">
              <Icon name="crown" size={12} /> Plus
            </span>
          )}
        </h1>
        <div className="profile-header__username">@{profile.username}</div>
        {!isMe && (
          <div className="profile-header__badges">
            {isMutual ? (
              <Badge tone="primary"><Icon name="handshake" size={12} /> Mutuals</Badge>
            ) : (
              profile.followsMe && <Badge>Te sigue</Badge>
            )}
          </div>
        )}
      </div>

      {profile.bio && <p className="profile-header__bio">{profile.bio}</p>}

      <div className="profile-header__stats">
        <Link to={followersPath(profile.username)} className="profile-header__stat">
          <strong>{formatNumber(profile.followers)}</strong>
          <span>seguidores</span>
        </Link>
        <Link to={followingPath(profile.username)} className="profile-header__stat">
          <strong>{formatNumber(profile.following)}</strong>
          <span>siguiendo</span>
        </Link>
        <a href="#logros" className="profile-header__stat">
          <strong>{formatNumber(profile.achievements)}</strong>
          <span>logros</span>
        </a>
      </div>

      <div className="profile-header__streaks">
        <div>
          <StreakFlame days={profile.personalStreak} />
          <span>racha personal</span>
        </div>
        <div>
          <strong className="icon-text"><Icon name="trophy" size={16} /> {profile.longestPersonalStreak}</strong>
          <span>mejor racha</span>
        </div>
      </div>

      {children && <div className="profile-header__actions">{children}</div>}

      {profile.memberSince && (
        <div className="profile-header__since">
          En Mutuals desde {formatDate(profile.memberSince, { month: 'long', year: 'numeric' })}
        </div>
      )}
    </Card>
  )
}
