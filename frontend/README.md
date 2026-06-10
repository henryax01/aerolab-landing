# Frontend — Landing Project

SPA en React + Vite + TailwindCSS que consume la API FastAPI de `../backend`.
Sigue la arquitectura **Vanellix** (Page → Hook → Util → Backend) descrita en `../cursos-vanellix.md`.

## Requisitos

- Node.js 18+
- El backend corriendo (ver `../backend/README` o la raíz del proyecto) — el proxy de Vite reenvía `/api` hacia él.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_STRIPE_PUBLIC_KEY si vas a probar pagos
npm run dev
```

La app queda disponible en `http://localhost:5173`. El proxy `/api` está configurado en
[vite.config.js](vite.config.js) y debe apuntar al puerto donde esté corriendo el backend.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre ESLint sobre todo el proyecto |
| `npm run test` | Corre la suite de tests con Vitest |

## Estructura

```
src/
├── main.jsx, App.jsx        # Punto de entrada, router, layout general
├── i18n.js                  # Configuración de react-i18next (es/en)
├── pages/                   # Una carpeta por página, cada una exporta `pageMetadata`
│   └── pagesConfig.js       # Auto-discovery de páginas vía import.meta.glob
├── hooks/                   # useAuth, useOrders, useContact, useTheme
├── utils/                   # Wrappers de API (axios) y helpers (roles, etc.)
├── components/common/       # Header, Footer, ThemeToggle, LangSwitcher
├── locales/{es,en}/         # Traducciones por namespace (una por página)
└── test/setup.js            # Configuración global de Vitest + Testing Library
```

## Páginas

Cada página vive en `src/pages/<nombre>/` y exporta un objeto `pageMetadata`
(`path`, `label`, `category`, `minRoleLevel`/`maxRoleLevel`, `order`, `locations`, `icon`, ...).
`pagesConfig.js` descubre automáticamente todas las páginas y construye las rutas y la navegación
filtrando por el nivel de rol del usuario (`customer` = 1, `admin` = 6).

## Tema e idioma

- El tema claro/oscuro se gestiona con `useTheme` (clase `dark` en `<html>`, persistida en `localStorage` bajo `lp_theme`).
- El idioma se gestiona con `react-i18next` (persistido en `localStorage` bajo `lp_lang`, namespaces por página en `locales/`).

## Tests

La suite usa **Vitest** + **@testing-library/react** + **jsdom**:

```bash
npm run test
```

Cubre lógica pura (`utils/roles.js`), hooks (`useTheme`) y un componente común (`ThemeToggle`).
