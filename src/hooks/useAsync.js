import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../utils/errors'

// Ejecuta una función async y maneja loading / error / data.
// const { data, loading, error, run } = useAsync(() => streakService.list(), [])
export function useAsync(asyncFn, deps = [], { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null })
  const fnRef = useRef(asyncFn)
  fnRef.current = asyncFn

  const run = useCallback(async (...args) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fnRef.current(...args)
      setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }))
      throw err
    }
  }, [])

  useEffect(() => {
    if (immediate) run().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const setData = useCallback((data) => setState((s) => ({ ...s, data })), [])

  return { ...state, run, setData }
}
