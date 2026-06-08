# /review

Revisar codigo del proyecto RAIFI usando el agente reviewer.

## Instrucciones

Cuando el usuario invoque `/review <path-o-area>`:

1. **Identificar archivos** a revisar:
   - Si es un path especifico: revisar ese archivo/directorio
   - Si es un area (ej: "auth", "properties"): buscar archivos relacionados
   - Si no se especifica: revisar cambios recientes (`git diff`)
2. **Leer CLAUDE.md** para las convenciones
3. **Leer cada archivo** completamente
4. **Aplicar checklist del reviewer**:
   - Seguridad (auth, validacion, XSS, injection)
   - Correctitud (tipos, errores, edge cases)
   - Performance (server components, queries, renders)
   - UI/UX (responsive, loading, empty states)
   - Convenciones (naming, estructura, imports)
5. **Reportar hallazgos** por severidad:
   - Critico: bugs o vulnerabilidades
   - Importante: mejoras recomendadas
   - Menor: sugerencias opcionales
6. **Ofrecer fixes** para issues criticos

## Formato de uso
```
/review app/actions/properties.ts    # Revisar archivo especifico
/review components/properties/       # Revisar directorio
/review auth                         # Revisar area de autenticacion
/review                              # Revisar cambios recientes
```
