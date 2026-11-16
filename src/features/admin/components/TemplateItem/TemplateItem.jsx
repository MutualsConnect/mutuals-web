import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import { CHALLENGE_TYPES } from '../../../challenges/constants'
import Icon from '../../../../components/common/Icon'

// ChallengeTemplateResponse
export default function TemplateItem({ template, onEdit, onDeactivate, busy }) {
  const type = CHALLENGE_TYPES[template.type]
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: template.active ? 1 : 0.6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ fontSize: '1.05rem' }}>{template.title}</strong>
        <Badge tone={template.active ? 'success' : 'neutral'}>{template.active ? 'Activa' : 'Inactiva'}</Badge>
      </div>
      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{template.prompt}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {type && (
          <Badge>
            <Icon name={type.icon} size={12} /> {type.label}
          </Badge>
        )}
        <Badge tone="primary"><Icon name="gem" size={12} /> {template.rewardGems}</Badge>
        {template.requiresPresence && <Badge tone="warning"><Icon name="pin" size={12} /> Presencial</Badge>}
        {template.requiresPhoto && <Badge tone="warning"><Icon name="camera" size={12} /> Foto</Badge>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => onEdit(template)}>
          Editar
        </Button>
        {template.active && (
          <Button size="sm" variant="ghost" loading={busy} onClick={() => onDeactivate(template)}>
            Desactivar
          </Button>
        )}
      </div>
    </Card>
  )
}
