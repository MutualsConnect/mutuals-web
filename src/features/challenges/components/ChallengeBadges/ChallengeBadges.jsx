import Badge from '../../../../components/common/Badge'
import { CHALLENGE_STATUS, CHALLENGE_TYPES } from '../../constants'
import Icon from '../../../../components/common/Icon'

export default function ChallengeBadges({ challenge, showStatus = true }) {
  const { template, status } = challenge
  const type = CHALLENGE_TYPES[template.type]
  const statusInfo = CHALLENGE_STATUS[status]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {showStatus && statusInfo && <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>}
      {type && (
        <Badge>
          <Icon name={type.icon} size={12} /> {type.label}
        </Badge>
      )}
      {template.requiresPresence && <Badge tone="warning"><Icon name="pin" size={12} /> Requiere check-in juntos</Badge>}
      {template.requiresPhoto && <Badge tone="warning"><Icon name="camera" size={12} /> Requiere foto</Badge>}
      {template.rewardGems > 0 && <Badge tone="primary"><Icon name="gem" size={12} /> +{template.rewardGems}</Badge>}
    </div>
  )
}
