import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { getErrorMessage, getFieldErrors } from '../../../../utils/errors'
import { CHALLENGE_TYPES } from '../../../challenges/constants'
import { EMPTY_TEMPLATE, TEMPLATE_LIMITS } from '../../constants'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Input from '../../../../components/common/Input'
import Modal from '../../../../components/common/Modal'
import Select from '../../../../components/common/Select'
import Switch from '../../../../components/common/Switch'
import Textarea from '../../../../components/common/Textarea'

const TYPE_OPTIONS = Object.entries(CHALLENGE_TYPES).map(([value, t]) => ({ value, label: `${t.icon} ${t.label}` }))

// template = null → crear; objeto → editar. Se monta con key para reiniciar el formulario.
export default function TemplateFormModal({ open, template, onClose, onSaved }) {
  const editing = Boolean(template?.id)
  const [form, setForm] = useState(() => (template ? { ...EMPTY_TEMPLATE, ...template } : EMPTY_TEMPLATE))
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Escribe un título'
    if (!form.prompt.trim()) e.prompt = 'Escribe la consigna'
    const gems = Number(form.rewardGems)
    if (!Number.isInteger(gems) || gems < TEMPLATE_LIMITS.minGems || gems > TEMPLATE_LIMITS.maxGems)
      e.rewardGems = `Entre ${TEMPLATE_LIMITS.minGems} y ${TEMPLATE_LIMITS.maxGems}`
    return e
  }

  const save = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    const payload = {
      title: form.title.trim(),
      prompt: form.prompt.trim(),
      type: form.type,
      rewardGems: Number(form.rewardGems),
      requiresPresence: form.requiresPresence,
      requiresPhoto: form.requiresPhoto,
      active: form.active,
    }
    setSaving(true)
    setServerError('')
    try {
      const saved = editing
        ? await adminService.updateTemplate(template.id, payload)
        : await adminService.createTemplate(payload)
      onSaved(saved, editing)
    } catch (err) {
      setErrors(getFieldErrors(err))
      setServerError(getErrorMessage(err, 'No se pudo guardar la plantilla'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar plantilla' : 'Nueva plantilla'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="template-form" loading={saving}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="template-form" onSubmit={save} noValidate style={{ display: 'grid', gap: 12 }}>
        <ErrorMessage message={serverError} />
        <Input
          label="Título"
          value={form.title}
          maxLength={TEMPLATE_LIMITS.title}
          onChange={(e) => set('title')(e.target.value)}
          error={errors.title}
        />
        <Textarea
          label="Consigna"
          value={form.prompt}
          maxLength={TEMPLATE_LIMITS.prompt}
          onChange={(e) => set('prompt')(e.target.value)}
          error={errors.prompt}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Tipo" options={TYPE_OPTIONS} value={form.type} onChange={(e) => set('type')(e.target.value)} />
          <Input
            label="Gemas"
            type="number"
            min={TEMPLATE_LIMITS.minGems}
            max={TEMPLATE_LIMITS.maxGems}
            value={form.rewardGems}
            onChange={(e) => set('rewardGems')(e.target.value)}
            error={errors.rewardGems}
          />
        </div>
        <Switch
          label="Requiere check-in juntos"
          description="Solo se completa si hicieron check-in QR o de proximidad ese día"
          checked={form.requiresPresence}
          onChange={set('requiresPresence')}
        />
        <Switch label="Requiere foto" checked={form.requiresPhoto} onChange={set('requiresPhoto')} />
        <Switch
          label="Activa"
          description="Solo las activas se asignan cada lunes"
          checked={form.active}
          onChange={set('active')}
        />
      </form>
    </Modal>
  )
}
