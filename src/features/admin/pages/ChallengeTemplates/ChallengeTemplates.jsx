import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { getErrorMessage } from '../../../../utils/errors'
import Button from '../../../../components/common/Button'
import EmptyState from '../../../../components/common/EmptyState'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import Tabs from '../../../../components/common/Tabs'
import TemplateFormModal from '../../components/TemplateFormModal'
import TemplateItem from '../../components/TemplateItem'
import '../../components/AdminPage.css'
import { useToast } from '../../../../hooks/useToast'

const FILTERS = [
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
  { value: 'all', label: 'Todas' },
]

export default function ChallengeTemplates() {
  const list = usePaginated((page) => adminService.getTemplates(page), [])
  const [filter, setFilter] = useState('active')
  const [editing, setEditing] = useState(undefined) // undefined: cerrado, null: nueva, objeto: editar
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')
  const toast = useToast()

  const visible = list.items.filter((t) =>
    filter === 'active' ? t.active : filter === 'inactive' ? !t.active : true,
  )

  const onSaved = (saved, wasEditing) => {
    setEditing(undefined)
    list.setItems((items) => (wasEditing ? items.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...items]))
    toast.success(wasEditing ? 'Plantilla actualizada.' : 'Plantilla creada.')
  }

  const deactivate = async (template) => {
    setBusyId(template.id)
    setActionError('')
    try {
      await adminService.deactivateTemplate(template.id)
      list.setItems((items) => items.map((t) => (t.id === template.id ? { ...t, active: false } : t)))
      toast.success(`"${template.title}" se desactivó. Ya no se asignará.`)
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo desactivar'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Plantillas de desafíos</h1>
          <p className="admin-page__subtitle">El catálogo del que sale el desafío semanal de cada pareja.</p>
        </div>
        <Button onClick={() => setEditing(null)}>+ Nueva plantilla</Button>
      </header>

      <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />
      <ErrorMessage message={actionError} />

      {list.loading ? (
        <Loader />
      ) : list.error && !list.items.length ? (
        <ErrorMessage message={list.error} onRetry={list.reload} />
      ) : !visible.length ? (
        <EmptyState title="No hay plantillas aquí" />
      ) : (
        <div className="admin-page__list">
          {visible.map((t) => (
            <TemplateItem key={t.id} template={t} onEdit={setEditing} onDeactivate={deactivate} busy={busyId === t.id} />
          ))}
          {list.hasMore && (
            <Button variant="secondary" onClick={list.loadMore} loading={list.loadingMore}>
              Ver más
            </Button>
          )}
        </div>
      )}

      {editing !== undefined && (
        <TemplateFormModal
          key={editing?.id ?? 'new'}
          open
          template={editing}
          onClose={() => setEditing(undefined)}
          onSaved={onSaved}
        />
      )}
    </section>
  )
}
