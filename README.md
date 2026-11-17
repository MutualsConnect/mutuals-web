# Mutuals Web

Frontend web de **Mutuals**, la red social de rachas que solo cuentan cuando los amigos de verdad se ven o hablan
(QR, cercanía o confirmación mutua). Consume la API REST de Spring Boot del proyecto
([mutuals-backend](https://github.com/MutualsConnect/mutuals-backend)).

Curso CS2031 Desarrollo Basado en Plataformas, UTEC 2026-2.

## Integrantes y participación

| Integrante | Código | Principales aportes | Participación |
|---|---|---|---|
| Oriana Manuela Fe Manrique Romero | 202320149 | Frontend web completo en React: estructura del proyecto, cliente axios con JWT y refresh token, autenticación (incluido login con Google), rachas y check-in (QR y cercanía), perfil y social, billetera y escudos, retos, actividad, logros, notificaciones, suscripción Plus, panel de administración, Wrapped, landing page y diseño visual. En el backend: login con Google. | 100 % |
| Ashly Nicole Veliz Barba | 202210422 | App móvil, cuyo diseño visual (paleta y estilo) se usó también en la web. En el backend: momentos de foto. | 100 % |

## Stack

- **React 19** + **Vite**
- **React Router 7**: rutas protegidas, de invitado y de administrador
- **Axios**: cliente centralizado con interceptores
- **lucide-react** para íconos y **qrcode.react** para el QR de check-in
- CSS por componente con tokens de diseño (`src/styles/global.css`), modo oscuro como en el móvil
- **oxlint** para lint

## Funcionalidades

| Módulo | Vistas |
|---|---|
| Landing | Página pública con la propuesta, cómo funciona, verificación, Wrapped y planes |
| Autenticación | Login, registro, recuperar y restablecer contraseña, **Continuar con Google** |
| Inicio | Grid de mutuals con racha, rachas en riesgo, gemas y racha personal |
| Rachas | Lista, detalle, invitaciones, interacciones pendientes, historial y check-in (QR, cámara, cercanía con GPS) |
| Social | Búsqueda con debounce, perfiles públicos, seguidores y seguidos, bloqueos |
| Retos | Desafíos semanales con respuesta de texto o foto y revelación mutua |
| Actividad | Feed con likes y comentarios |
| Billetera | Gemas, escudos, tienda y movimientos |
| Logros y notificaciones | Medallas desbloqueadas y destacadas, centro de notificaciones con contador |
| Suscripción | Comparación Free vs Plus y aviso de límites del plan |
| Wrapped | Resúmenes mensuales y anuales en formato de historias, Wrapped de siempre y de la plataforma |
| Admin | Dashboard de métricas, usuarios, reportes y plantillas de desafíos |

## Arquitectura

```
src/
├── api/            axiosClient: baseURL, token Bearer, refresh token y logout global
├── components/     componentes reutilizables (common/) y de layout (Navbar, BottomNav, Sidebar)
├── config/         variables de entorno
├── constants/      rutas, roles y claves
├── context/        AuthProvider y NotificationsProvider (estado global con Context API)
├── features/       un módulo por dominio: components/, pages/, services/, hooks/
├── hooks/          useAuth, useAsync, usePaginated, useDebounce, useNotifications
├── layouts/        MainLayout, AuthLayout, AdminLayout
├── pages/          Landing y NotFound
├── routes/         AppRouter, ProtectedRoute, PublicRoute, AdminRoute, HomeGate
├── styles/         tema global
└── utils/          errores, validadores, fechas, almacenamiento y media
```

Cada módulo de `features/` tiene su **service** (llamadas a la API), sus **hooks** (lógica) y sus
**componentes** (UI), así las páginas solo combinan piezas.

### Errores y feedback

- **Error Boundary** global y por layout: si una pantalla falla, se muestra un aviso con "Reintentar" sin perder la
  navegación.
- **Mensajes en español** (`utils/errors.js`): traduce los mensajes del backend y responde según el código HTTP
  (400, 401, 403, 404, 409, 413, 5xx), sin conexión y timeout. También traduce las validaciones de los formularios.
- **Toasts** (`ToastProvider` + `useToast`) para confirmar acciones: seguir, invitar a una racha, comprar escudos,
  guardar cambios, etc.
- Loaders, estados vacíos con acción, botón "Reintentar" y botones deshabilitados durante cada petición.

## Cómo correrlo

Requisitos: Node 20+ y el backend corriendo (ver su README).

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:5173
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL de la API, por ejemplo `http://localhost:8080/api/v1` o `/api/v1` detrás del proxy de Vercel |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID (aplicación web) de Google Cloud. Vacío = sin botón de Google |

Otros comandos: `npm run build`, `npm run preview`, `npm run lint`.

## Despliegue

Se despliega en **Vercel** desde este repositorio. `vercel.json` redirige todas las rutas a `index.html` para que
funcione el router. Las variables `VITE_*` se configuran en el panel de Vercel y se aplican en cada build.
El origen de producción debe agregarse en *Orígenes autorizados de JavaScript* del cliente OAuth de Google y en
`CORS_ALLOWED_ORIGINS` / `FRONTEND_URL` del backend.
