import { Component } from 'react'
import Icon from '../Icon'
import './ErrorBoundary.css'

// Atrapa errores de renderizado para que una falla no deje la pantalla en blanco.
// resetKey (por ejemplo, la ruta actual) limpia el error al navegar a otra página.
export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error) {
    return { error }
  }

  // Al cambiar resetKey (otra ruta) se limpia el error
  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) return { error: null, resetKey: props.resetKey }
    return null
  }

  componentDidCatch(error, info) {
    console.error('Error de renderizado:', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback({ error: this.state.error, reset: this.reset })

    return (
      <div className="error-boundary" role="alert">
        <span className="error-boundary__icon">
          <Icon name="alert" size={30} />
        </span>
        <h2 className="error-boundary__title">Algo salió mal</h2>
        <p className="error-boundary__text">
          Esta pantalla tuvo un problema. Puedes intentarlo de nuevo o volver al inicio.
        </p>
        <div className="error-boundary__actions">
          <button type="button" className="btn btn--primary" onClick={this.reset}>
            Reintentar
          </button>
          <a href="/" className="btn btn--secondary">
            Ir al inicio
          </a>
        </div>
      </div>
    )
  }
}
