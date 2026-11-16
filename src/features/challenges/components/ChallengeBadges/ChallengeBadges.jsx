import Badge from '../../../../components/common/Badge'
import { CHALLENGE_STATUS, CHALLENGE_TYPES } from '../../constants'

export default function ChallengeBadges({ challenge, showStatus = true }) {
  const { template, status } = challenge
  const type = CHALLENGE_TYPES[template.type]
  const statusInfo = CHALLENGE_STATUS[status]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {showStatus && statusInfo && <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>}
      {type && (
        <Badge>
          {type.icon} {type.label}
        </Badge>
      )}
      {template.requiresPresence && <Badge tone="warning">📍 Requiere check-in juntos</Badge>}
      {template.requiresPhoto && <Badge tone="warning">📷 Requiere foto</Badge>}
      {template.rewardGems > 0 && <Badge tone="primary">💎 +{template.rewardGems}</Badge>}
    </div>
  )
}
