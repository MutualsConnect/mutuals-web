import { useSearchParams } from 'react-router-dom'
import { userService } from '../../../user/services/userService'
import { useDebounce } from '../../../../hooks/useDebounce'
import { usePaginated } from '../../../../hooks/usePaginated'
import { SEARCH_MAX_LENGTH, SEARCH_MIN_LENGTH } from '../../constants'
import EmptyState from '../../../../components/common/EmptyState'
import Input from '../../../../components/common/Input'
import UserList from '../../components/UserList'
import '../../../user/components/UserPage.css'

// Busca por username (el backend busca usernames que empiezan con el texto)
export default function Search() {
  // El texto se guarda en la URL (?q=) para que al volver atrás no se pierda
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debounced = useDebounce(query.trim().replace(/^@/, '').toLowerCase())
  const enabled = debounced.length >= SEARCH_MIN_LENGTH

  const results = usePaginated((page) => userService.search(debounced, page), [debounced], {
    enabled,
  })

  return (
    <section className="user-page">
      <h1 className="user-page__title">Buscar amigos</h1>
      <Input
        type="search"
        placeholder="Busca por nombre de usuario"
        value={query}
        maxLength={SEARCH_MAX_LENGTH}
        autoFocus
        onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
        aria-label="Buscar por nombre de usuario"
      />

      {!enabled ? (
        <EmptyState
          title="Encuentra a tus amigos"
          description={`Escribe al menos ${SEARCH_MIN_LENGTH} letras de su nombre de usuario. Cuando se sigan mutuamente podrán empezar una racha.`}
        />
      ) : (
        <UserList {...results} emptyTitle={`No encontramos a "${debounced}"`} />
      )}
    </section>
  )
}
