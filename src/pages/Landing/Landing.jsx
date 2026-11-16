import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { PLAN_COMPARISON } from '../../features/subscription/constants'
import Icon from '../../components/common/Icon'
import inicioImg from '../../assets/images/landing/inicio.jpg'
import novedadesImg from '../../assets/images/landing/novedades.jpg'
import billeteraImg from '../../assets/images/landing/billetera.jpg'
import wrappedImg from '../../assets/images/landing/wrapped.jpg'
import './Landing.css'

const STEPS = [
  {
    icon: 'users',
    title: 'Síganse',
    text: 'Cuando tú y tu amigo se siguen mutuamente, se vuelven mutuals.',
  },
  {
    icon: 'envelope',
    title: 'Empiecen una racha',
    text: 'Uno invita y el otro acepta. Desde ese día, la racha es de los dos.',
  },
  {
    icon: 'flame',
    title: 'Cuenten cada día',
    text: 'Cada día necesita al menos una interacción confirmada. Si un día no se ven, la racha se rompe… salvo que tengan un escudo.',
  },
]

const VERIFY = [
  {
    icon: 'scan',
    title: 'Código QR',
    text: 'Uno escanea el QR del otro y la racha cuenta al instante. El código cambia cada 30 segundos.',
  },
  {
    icon: 'pin',
    title: 'Cercanía',
    text: 'Los dos comparten su ubicación con menos de 2 minutos de diferencia y a menos de 100 metros.',
  },
  {
    icon: 'check',
    title: 'Confirmación mutua',
    text: 'Uno registra lo que hicieron y el otro tiene 24 horas para confirmarlo.',
  },
]

const FEATURES = [
  {
    icon: 'target',
    title: 'Desafíos semanales',
    text: 'Cada lunes llega un desafío por pareja. La respuesta de tu amigo se revela solo cuando los dos responden.',
  },
  {
    icon: 'shield',
    title: 'Escudos',
    text: 'Protegen tu racha el día que no pueden verse. Máximo uno por racha por semana, y nunca se venden con dinero real.',
  },
  {
    icon: 'gem',
    title: 'Gemas y logros',
    text: 'Gana gemas por cada semana de racha, desafío completado y logro desbloqueado.',
  },
  {
    icon: 'feed',
    title: 'Novedades',
    text: 'Celebra los logros de tus amigos con likes. Los comentarios son solo entre mutuals.',
  },
  {
    icon: 'lock',
    title: 'Privado por defecto',
    text: 'Con quién tienes rachas y cuántos días llevan es solo de ustedes. Tus logros públicos nunca dicen con quién.',
  },
  {
    icon: 'film',
    title: 'Tu Wrapped',
    text: 'Cada mes y cada año, un resumen de cómo conectaste: tu mutual #1, tu racha más larga y más.',
  },
]

// Aparece suave al hacer scroll (respeta "reducir movimiento")
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.15 },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

function Phone({ src, alt, className = '' }) {
  return (
    <div className={`phone ${className}`}>
      <img src={src} alt={alt} loading="lazy" width="540" height="1174" />
    </div>
  )
}

const YEAR = new Date().getFullYear()

export default function Landing() {
  const pageRef = useReveal()

  return (
    <div className="landing" ref={pageRef}>
      {/* ---------- Navegación */}
      <header className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          <span className="landing-nav__logo">
            <Icon name="flame" size={20} />
          </span>
          Mutuals
        </Link>
        <nav className="landing-nav__links" aria-label="Secciones">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#verificacion">Verificación</a>
          <a href="#plus">Plus</a>
        </nav>
        <div className="landing-nav__actions">
          <Link to={ROUTES.LOGIN} className="btn btn--ghost btn--sm">
            Iniciar sesión
          </Link>
          <Link to={ROUTES.REGISTER} className="btn btn--primary btn--sm">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main>
        {/* ---------- Portada */}
        <section className="hero">
          <div className="hero__text">
            <span className="chip">
              <Icon name="flame" size={14} filled /> Rachas de amistad verificadas
            </span>
            <h1 className="hero__title">
              Las rachas que importan <span className="accent">son las de verdad.</span>
            </h1>
            <p className="hero__subtitle">
              Mutuals mantiene vivas tus amistades con rachas diarias que solo cuentan cuando de verdad
              se ven o hablan: con un QR, por cercanía o con la confirmación de los dos.
            </p>
            <div className="hero__ctas">
              <Link to={ROUTES.REGISTER} className="btn btn--primary btn--lg">
                Crear cuenta gratis
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn--secondary btn--lg">
                Ya tengo cuenta
              </Link>
            </div>
            <ul className="hero__facts">
              <li>
                <Icon name="check" size={16} /> Gratis para empezar
              </li>
              <li>
                <Icon name="check" size={16} /> En la web y en el celular
              </li>
            </ul>
          </div>

          <div className="hero__phones" aria-hidden>
            <Phone src={novedadesImg} alt="" className="phone--back phone--left" />
            <Phone src={wrappedImg} alt="" className="phone--back phone--right" />
            <Phone src={inicioImg} alt="" className="phone--front" />
          </div>
        </section>

        {/* ---------- Problema */}
        <section className="statement reveal">
          <p>
            Snapchat mide que <em>mandaste algo</em>.
            <br />
            <strong>Mutuals mide que de verdad se vieron.</strong>
          </p>
        </section>

        {/* ---------- Cómo funciona */}
        <section id="como-funciona" className="section">
          <div className="section__head reveal">
            <span className="section__eyebrow">Cómo funciona</span>
            <h2 className="section__title">Tres pasos y su primera racha está encendida</h2>
          </div>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="glass-card step reveal" style={{ '--delay': `${i * 90}ms` }}>
                <span className="step__number">{i + 1}</span>
                <span className="feature-icon">
                  <Icon name={step.icon} size={24} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Verificación */}
        <section id="verificacion" className="section">
          <div className="section__head reveal">
            <span className="section__eyebrow">Verificación</span>
            <h2 className="section__title">Tres formas de demostrar que estuvieron juntos</h2>
            <p className="section__subtitle">
              El GPS solo detecta y sugiere. La racha cuenta cuando la interacción se confirma.
            </p>
          </div>
          <div className="grid-3">
            {VERIFY.map((item, i) => (
              <article key={item.title} className="glass-card verify reveal" style={{ '--delay': `${i * 90}ms` }}>
                <span className="feature-icon feature-icon--sky">
                  <Icon name={item.icon} size={24} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Funciones */}
        <section className="section split">
          <div className="split__media reveal">
            <Phone src={billeteraImg} alt="Billetera de Mutuals con gemas, escudos y movimientos" />
          </div>
          <div className="split__content">
            <div className="section__head section__head--left reveal">
              <span className="section__eyebrow">Mucho más que un contador</span>
              <h2 className="section__title">Motivos reales para escribirle a alguien hoy</h2>
            </div>
            <div className="features">
              {FEATURES.map((f, i) => (
                <article key={f.title} className="feature reveal" style={{ '--delay': `${i * 60}ms` }}>
                  <span className="feature-icon">
                    <Icon name={f.icon} size={22} />
                  </span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Wrapped */}
        <section className="section wrapped-band reveal">
          <div className="wrapped-band__content">
            <span className="section__eyebrow">Wrapped</span>
            <h2 className="section__title">Tu año con tus amigos, en una historia</h2>
            <p className="section__subtitle">
              El día 1 de cada mes llega tu resumen: interacciones, días activos, tu racha más larga, tu
              mutual #1 y cómo se encontraron. También hay uno de toda la comunidad.
            </p>
          </div>
          <Phone src={wrappedImg} alt="Historia del Wrapped de Mutuals" className="phone--small" />
        </section>

        {/* ---------- Plus */}
        <section id="plus" className="section">
          <div className="section__head reveal">
            <span className="section__eyebrow">Mutuals Plus</span>
            <h2 className="section__title">Empieza gratis. Pásate a Plus cuando quieras más.</h2>
          </div>
          <div className="plans reveal">
            <article className="glass-card plan">
              <h3>Gratis</h3>
              <ul>
                {PLAN_COMPARISON.map((row) => (
                  <li key={row.feature}>
                    <span>{row.feature}</span>
                    <strong>{row.free}</strong>
                  </li>
                ))}
              </ul>
              <Link to={ROUTES.REGISTER} className="btn btn--secondary btn--md btn--full">
                Crear cuenta
              </Link>
            </article>
            <article className="glass-card plan plan--plus">
              <h3>
                <Icon name="crown" size={20} /> Plus
              </h3>
              <ul>
                {PLAN_COMPARISON.map((row) => (
                  <li key={row.feature}>
                    <span>{row.feature}</span>
                    <strong>{row.plus}</strong>
                  </li>
                ))}
              </ul>
              <Link to={ROUTES.REGISTER} className="btn btn--primary btn--md btn--full">
                Empezar y probar Plus
              </Link>
            </article>
          </div>
        </section>

        {/* ---------- Llamado final */}
        <section className="final-cta reveal">
          <span className="final-cta__logo">
            <Icon name="flame" size={44} />
          </span>
          <h2>¿Con quién empezarías tu primera racha?</h2>
          <p>Crea tu cuenta, busca a tus amigos y enciendan su primer fueguito hoy.</p>
          <Link to={ROUTES.REGISTER} className="btn btn--primary btn--lg">
            Crear cuenta gratis
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <span className="landing-nav__brand">
          <span className="landing-nav__logo">
            <Icon name="flame" size={16} />
          </span>
          Mutuals
        </span>
        <span>© {YEAR} Mutuals</span>
        <div className="landing-footer__links">
          <Link to={ROUTES.LOGIN}>Iniciar sesión</Link>
          <Link to={ROUTES.REGISTER}>Crear cuenta</Link>
        </div>
      </footer>
    </div>
  )
}
