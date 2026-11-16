import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../utils/errors'

// Para endpoints que devuelven PageResponse { content, page, last, totalElements }.
// fetchPage(page) => Promise<PageResponse>. Si enabled es false no carga nada.
export function usePaginated(fetchPage, deps = [], { enabled = true } = {}) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [last, setLast] = useState(true)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(enabled)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const fetchRef = useRef(fetchPage)
  fetchRef.current = fetchPage
  const requestId = useRef(0)

  const load = useCallback(async (pageToLoad) => {
    const id = ++requestId.current
    if (pageToLoad === 0) setLoading(true)
    else setLoadingMore(true)
    setError(null)
    try {
      const res = await fetchRef.current(pageToLoad)
      if (id !== requestId.current) return // llegó una respuesta vieja
      setItems((prev) => (pageToLoad === 0 ? res.content : [...prev, ...res.content]))
      setPage(res.page)
      setLast(res.last)
      setTotal(res.totalElements)
    } catch (err) {
      if (id === requestId.current) setError(getErrorMessage(err))
    } finally {
      if (id === requestId.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      requestId.current++
      setItems([])
      setLoading(false)
      setLast(true)
      setTotal(0)
      return
    }
    load(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])

  return {
    items,
    setItems,
    total,
    hasMore: !last,
    loading,
    loadingMore,
    error,
    loadMore: () => load(page + 1),
    reload: () => load(0),
  }
}
