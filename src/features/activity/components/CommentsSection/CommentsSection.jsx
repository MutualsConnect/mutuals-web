import { useState } from 'react'
import { Link } from 'react-router-dom'
import { activityService } from '../../services/activityService'
import { usePaginated } from '../../../../hooks/usePaginated'
import { profilePath } from '../../../../constants/routes'
import { getErrorMessage } from '../../../../utils/errors'
import { formatRelativeTime } from '../../../../utils/format'
import { COMMENT_MAX_LENGTH } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Button from '../../../../components/common/Button'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import Loader from '../../../../components/common/Loader'
import './CommentsSection.css'

export default function CommentsSection({ activity, onCommented }) {
  const comments = usePaginated((page) => activityService.getComments(activity.id, page), [activity.id])
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    setError('')
    try {
      const created = await activityService.comment(activity.id, content.trim())
      comments.setItems([...comments.items, created])
      setContent('')
      onCommented?.()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo publicar el comentario'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="comments">
      {comments.loading ? (
        <Loader />
      ) : comments.error && !comments.items.length ? (
        <ErrorMessage message={comments.error} onRetry={comments.reload} />
      ) : (
        <>
          {!comments.items.length && <p className="comments__empty">Todavía no hay comentarios.</p>}
          <ul className="comments__list">
            {comments.items.map((c) => (
              <li key={c.id} className="comments__item">
                <Link to={profilePath(c.author.username)}>
                  <Avatar src={c.author.avatarUrl} name={c.author.displayName} size={30} />
                </Link>
                <div className="comments__bubble">
                  <div className="comments__meta">
                    <Link to={profilePath(c.author.username)} className="comments__author">
                      {c.author.displayName}
                    </Link>
                    <span>{formatRelativeTime(c.createdAt)}</span>
                  </div>
                  <p className="comments__content">{c.content}</p>
                </div>
              </li>
            ))}
          </ul>
          {comments.hasMore && (
            <Button size="sm" variant="ghost" onClick={comments.loadMore} loading={comments.loadingMore}>
              Ver más comentarios
            </Button>
          )}
        </>
      )}

      {activity.canComment ? (
        <form className="comments__form" onSubmit={send}>
          <ErrorMessage message={error} />
          <div className="comments__input-row">
            <input
              className="field__input comments__input"
              placeholder="Escribe un comentario…"
              value={content}
              maxLength={COMMENT_MAX_LENGTH}
              onChange={(e) => setContent(e.target.value)}
              aria-label="Comentario"
            />
            <Button type="submit" size="sm" loading={sending} disabled={!content.trim()}>
              Enviar
            </Button>
          </div>
        </form>
      ) : (
        <p className="comments__empty">Solo los mutuals pueden comentar.</p>
      )}
    </div>
  )
}
