# /implement

Implementar un issue del backlog de RAIFI.

## Instrucciones

Cuando el usuario invoque `/implement <numero-issue>`:

1. **Leer el issue** de GitHub con `gh issue view <numero> --repo andcamilo/raifi`
2. **Leer CLAUDE.md** para convenciones del proyecto
3. **Planificar** usando el agente planner: identificar archivos a crear/modificar y orden
4. **Crear branch**: `git checkout -b feat/f<x>.<y>-<descripcion-corta>`
5. **Implementar** paso a paso:
   - Leer archivos existentes relacionados antes de modificar
   - Seguir las convenciones del proyecto
   - Validar con Zod en server y client
   - Verificar auth y autorizacion en Server Actions
   - Hacer componentes responsive
6. **Verificar** que `npm run build` pasa sin errores
7. **Commit** con mensaje formato: `F<x>.<y>: <descripcion> (#<issue-number>)`
8. **Reportar** que archivos se crearon/modificaron

## Formato de uso
```
/implement 1      # Implementar issue #1
/implement 4 5    # Implementar issues #4 y #5
```
