// Textos para los enums del backend
export const INTERACTION_METHOD_LABELS = {
  MANUAL: 'Manual',
  QR: 'Código QR',
  PROXIMITY: 'Proximidad',
}

export const INTERACTION_STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  EXPIRED: 'Vencida',
  REJECTED: 'Rechazada',
}

export const INVITATION_STATUS_LABELS = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  CANCELED: 'Cancelada',
}

export const STREAK_END_REASON_LABELS = {
  MISSED_DAY: 'Faltó un día',
  UNFOLLOW: 'Dejaron de seguirse',
  BLOCK: 'Bloqueo',
  ACCOUNT_DELETED: 'Cuenta eliminada',
}

export const QR_REFRESH_MS = 25_000
