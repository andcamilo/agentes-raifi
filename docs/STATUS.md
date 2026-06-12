# RAIFI - Estado del Proyecto

## Resumen
MVP completo con todas las páginas implementadas. Actualmente corriendo con **mock data** (sin Firebase configurado) para poder mostrar la app en producción.

**URL producción:** https://ralfi.vercel.app
**Repo:** github.com/andcamilo/raifi
**GitHub Project Board:** #6

---

## Archivos Clave

### Configuración
- `CLAUDE.md` - Convenciones del proyecto
- `.claude/agents/` - 6 agentes especializados (frontend, backend, database, auth, planner, reviewer)
- `.claude/skills/` - 3 skills (implement, review, plan-issue)
- `docs/PRD.md` - Product Requirements Document completo

### Mock Data (temporal)
- `lib/mock-data.ts` - 4 agentes, 6 propiedades, 2 leads, 2 conexiones mock
- `lib/firebase/admin.ts` - Stub (exports null, getAuthUser devuelve agent-1)
- `lib/firebase/auth.ts` - Stub (simula usuario Sofia Martinez)
- `lib/firebase/config.ts` - Stub (exports null)
- `lib/firebase/firestore.ts` - Stub
- `lib/firebase/storage.ts` - Stub (devuelve placeholders)
- `app/actions/*.ts` - Todos retornan `{ success: true }`
- `app/api/**/*.ts` - Todos usan mock-data.ts

### Para reactivar Firebase
El código original con Firebase real está en el commit `bbfe6bd`. Para activar:
1. Crear proyecto Firebase
2. Configurar `.env.local` con las credenciales (ver PRD sección 13)
3. Restaurar los archivos `lib/firebase/*.ts` desde git history
4. Restaurar `app/actions/*.ts` desde git history
5. Restaurar `app/api/**/*.ts` desde git history
6. Restaurar `app/(dashboard)/**/*.tsx` que hacían queries directas
7. Restaurar `contexts/auth-context.tsx` con Firebase Auth real

---

## Issues (GitHub Project #6)

### Fase 1 - Fundación (#1-#9) - IMPLEMENTADOS
### Fase 2 - Inmueble (#10-#13) - IMPLEMENTADOS
### Fase 3 - Agente (#14-#17) - IMPLEMENTADOS
### Fase 4 - Colegaje (#18-#19) - IMPLEMENTADOS
### Fase 5 - Pulido (#20-#23) - PARCIAL

---

## Notas Técnicas
- Next.js 14.2 (no 15) - usa `next.config.mjs` no `.ts`
- ESLint 8 (no 9) - requerido por eslint-config-next
- `@radix-ui/react-badge` y `@radix-ui/react-textarea` no existen como paquetes
- Firestore `doc.data()` retorna DocumentData - necesita casts explícitos
- Login page usa Suspense boundary para `useSearchParams`
- npm (no yarn/pnpm/bun)
