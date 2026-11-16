import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { REPORT_STATUS_TABS } from '../../constants'
import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import ReportItem from '../../components/ReportItem'
import ReviewReportModal from '../../components/ReviewReportModal'
import '../../components/AdminPage.css'

export default function Reports() {
  const [status, setStatus] = useState('PENDING')
  const list = usePaginated((page) => adminService.getReports(status, page), [status])
  const [reviewing, setReviewing] = useState(null)
  const [notice, setNotice] = useState('')

  const onReviewed = (updated) => {
    setReviewing(null)
    // Sale de la pestaña Pendientes
    list.setItems((items) => items.filter((r) => r.id !== updated.id))
    setNotice(updated.status === 'DISMISSED' ? 'Reporte descartado.' : 'Reporte revisado.')
  }

  return (
    <section className="admin-page">
      <header>
        <h1 className="admin-page__title">Reportes</h1>
        <p className="admin-page__subtitle">Reportes de usuarios por spam, acoso, contenido inapropiado o suplantación.</p>
      </header>

      <Tabs tabs={REPORT_STATUS_TABS} value={status} onChange={(s) => { setStatus(s); setNotice('') }} />
      {notice && <p className="admin-page__notice">{notice}</p>}

      {list.loading ? (
        <Loader />
      ) : list.error && !list.items.length ? (
        <ErrorMessage message={list.error} onRetry={list.reload} />
      ) : !list.items.length ? (
        <EmptyState title={status === 'PENDING' ? 'No hay reportes pendientes 🎉' : 'No hay reportes'} />
      ) : (
        <div className="admin-page__list">
          {list.items.map((r) => (
            <ReportItem key={r.id} report={r} onReview={setReviewing} />
          ))}
          {list.hasMore && (
            <Button variant="secondary" onClick={list.loadMore} loading={list.loadingMore}>
              Ver más
            </Button>
          )}
        </div>
      )}

      {reviewing && (
        <ReviewReportModal key={reviewing.id} report={reviewing} onClose={() => setReviewing(null)} onReviewed={onReviewed} />
      )}
    </section>
  )
}
