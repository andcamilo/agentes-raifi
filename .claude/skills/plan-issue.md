# /plan-issue

Planificar la implementacion de un issue antes de codificar.

## Instrucciones

Cuando el usuario invoque `/plan-issue <numero-issue>`:

1. **Leer el issue** de GitHub con `gh issue view <numero> --repo andcamilo/raifi`
2. **Leer CLAUDE.md** para convenciones
3. **Explorar codigo existente** relacionado con el issue
4. **Producir plan** con el agente planner:
   - Contexto y como encaja en la arquitectura
   - Lista de archivos a crear/modificar (con orden)
   - Pasos de implementacion numerados
   - Dependencias de otros issues
   - Edge cases y consideraciones de seguridad
   - Criterios de verificacion
5. **Estimar complejidad**: Simple / Medio / Complejo
6. **Identificar bloqueantes**: que debe existir antes

## Formato de uso
```
/plan-issue 4     # Planificar implementacion del issue #4
```
