# RAIFI - Plataforma Inmobiliaria Colaborativa

## Proyecto
Plataforma inmobiliaria colaborativa para agentes independientes en Colombia. Next.js 14+ (App Router) + Firebase + Tailwind + shadcn/ui.

## Stack
- **Framework:** Next.js 14+ (App Router, Server Components, Server Actions)
- **Lenguaje:** TypeScript (strict mode)
- **DB:** Cloud Firestore
- **Auth:** Firebase Authentication (email/password)
- **Storage:** Firebase Storage
- **Backend:** Firebase Admin SDK (server-side en Next.js)
- **Estilos:** Tailwind CSS + shadcn/ui
- **Formularios:** React Hook Form + Zod
- **Fetching:** TanStack Query (client), Firebase Admin SDK (server)
- **Deploy:** Vercel

## Convenciones de Codigo

### General
- Todo en TypeScript con tipos estrictos, nunca `any`
- Usar path aliases `@/*` para imports
- Idioma del codigo: ingles (nombres de variables, funciones, componentes)
- Idioma del contenido/UI: espanol (textos, labels, mensajes)
- Archivos en kebab-case: `property-card.tsx`, `use-auth.ts`
- Componentes en PascalCase: `PropertyCard`, `AgentProfile`
- Hooks con prefijo `use-`: `use-auth.ts`, `use-properties.ts`

### Next.js App Router
- Server Components por defecto, `'use client'` solo cuando necesario
- Server Actions en `/app/actions/` para mutaciones
- API Routes solo para queries SSR/ISR en `/app/api/`
- Layouts en cada route group: `(public)`, `(auth)`, `(dashboard)`
- Metadata export en cada page.tsx para SEO

### Firebase
- Client SDK: solo en componentes client (`'use client'`)
- Admin SDK: solo en Server Components, Server Actions, API Routes
- Admin SDK singleton en `/lib/firebase/admin.ts`
- Nunca importar `firebase-admin` en codigo client
- Cookie `__session` para auth en SSR

### Componentes
- shadcn/ui como base, customizar con Tailwind
- Componentes reutilizables en `/components/`
- Organizados por dominio: `/components/properties/`, `/components/agents/`
- Props tipadas con interfaces, no inline types

### Validacion
- Zod schemas en `/lib/validators.ts`
- Validar en client (React Hook Form) Y en server (Server Actions)
- Nunca confiar en datos del cliente

### Datos
- Precios siempre en COP (number), formatear con `formatCOP()`
- Fechas como Firestore Timestamp, formatear para display
- Slugs auto-generados desde nombres: "Sofia Martinez" -> "sofia-martinez"
- Denormalizar datos frecuentes (agentName en properties, etc.)

## Estructura de Carpetas
```
/app/            - Pages y layouts (App Router)
/app/actions/    - Server Actions
/app/api/        - API Routes
/components/ui/  - shadcn/ui base components
/components/     - Feature components por dominio
/lib/firebase/   - Firebase config y helpers
/lib/            - Utils, validators, constants, formatters
/types/          - Interfaces TypeScript
/hooks/          - Custom React hooks
/contexts/       - React Context providers
/public/         - Assets estaticos
/scripts/        - Scripts de seed y utilidad
```

## Agentes Disponibles
Usar los agentes especializados en `.claude/agents/` para cada tarea:
- `frontend.md` - UI/UX, componentes React, Tailwind, responsive
- `backend.md` - Server Actions, API Routes, Firebase Admin, seguridad
- `database.md` - Firestore schema, queries, indices, security rules
- `auth.md` - Autenticacion, sesiones, middleware, permisos
- `reviewer.md` - Code review, calidad, seguridad, performance
- `planner.md` - Planificacion, desglose de tareas, arquitectura

## Skills Disponibles
- `/implement` - Implementar un issue del backlog
- `/review` - Revisar codigo de un archivo o directorio
- `/plan-issue` - Planificar la implementacion de un issue

## GitHub
- Repo: andcamilo/raifi
- Project Board: #6
- Issues organizados por fases (fase-1 a fase-5)
- Branch strategy: `main` + feature branches `feat/f1.1-setup`
- Commits en espanol, descriptivos, referenciando issue: "F1.1: Setup inicial del proyecto (#1)"
