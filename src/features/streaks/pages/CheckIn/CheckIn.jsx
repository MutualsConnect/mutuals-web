import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../../hooks/useAuth'
import { ROUTES } from '../../../../constants/routes'
import Card from '../../../../components/common/Card'
import Tabs from '../../../../components/common/Tabs'
import MyQrCode from '../../components/MyQrCode'
import QrScanner from '../../components/QrScanner'
import ProximityCheckIn from '../../components/ProximityCheckIn'
import '../../components/StreakPage.css'
import './CheckIn.css'
import Icon from '../../../../components/common/Icon'

const TABS = [
  { value: 'my-qr', label: 'Mi QR' },
  { value: 'scan', label: 'Escanear' },
  { value: 'proximity', label: 'Cerca' },
]

export default function CheckIn() {
  const { refreshUser } = useAuth()
  const [tab, setTab] = useState('my-qr')
  const [success, setSuccess] = useState(null)

  const onCheckedIn = (interaction) => {
    setSuccess(interaction)
    refreshUser().catch(() => {})
  }

  return (
    <section className="streak-page">
      <Link to={ROUTES.STREAKS} className="streak-page__back">
        ← Rachas
      </Link>
      <header>
        <h1 className="streak-page__title">Check-in</h1>
        <p className="streak-page__subtitle">Registra que se vieron en persona: cuenta al instante.</p>
      </header>

      {success && (
        <div className="check-in__success" role="status">
          <Icon name="flame" className="check-in__success-icon" size={30} filled />
          <div>
            <strong>¡Check-in confirmado!</strong>
            {success.streakLength != null && <div>La racha va en {success.streakLength} días.</div>}
          </div>
          {success.streakId && <Link to={`/streaks/${success.streakId}`}>Ver racha</Link>}
        </div>
      )}

      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <Card>
        {tab === 'my-qr' && <MyQrCode />}
        {tab === 'scan' && <QrScanner onCheckedIn={onCheckedIn} />}
        {tab === 'proximity' && <ProximityCheckIn onCheckedIn={onCheckedIn} />}
      </Card>
    </section>
  )
}
