export const REPORT_STATUS_TABS = [
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'REVIEWED', label: 'Revisados' },
  { value: 'DISMISSED', label: 'Descartados' },
]

export const REPORT_STATUS = {
  PENDING: { label: 'Pendiente', tone: 'warning' },
  REVIEWED: { label: 'Revisado', tone: 'success' },
  DISMISSED: { label: 'Descartado', tone: 'neutral' },
}

// ChallengeTemplateRequest
export const TEMPLATE_LIMITS = { title: 80, prompt: 500, minGems: 0, maxGems: 100 }
export const EMPTY_TEMPLATE = {
  title: '',
  prompt: '',
  type: 'REMOTE',
  rewardGems: 10,
  requiresPresence: false,
  requiresPhoto: false,
  active: true,
}

export const RESOLUTION_NOTE_MAX = 500
