##authStore3.ts - Guía de Integración y Uso ##

## Descripción
`authStore3.ts` es el módulo principal encargado de la gestión de autenticación y autorización en el sistema LoginMultiusuario. Se integra con `AuthService.js` y Firebase para manejar la creación de sesiones, roles de usuario y validaciones de permisos.

## Flujo de Inicialización

1. **Firebase:**  
   - Las instancias de Firebase (`auth`, `db`, `storage`) deben inicializarse únicamente en `main.js`.
   - Evitar inicializaciones directas en `authStore3.ts` en producción.

2. **Store:**  
   - Importar únicamente la propiedad `auth` de Firebase:
     ```ts
     import { auth } from "@/firebase/firebaseInit";
     ```
   - Evitar desestructurar toda la configuración repetidamente.

3. **AuthService:**  
   - Se utiliza como capa intermedia para validar credenciales y roles.
   - Todas las llamadas de login, logout y verificación de sesión deben pasar por `AuthService.js`.

## Recomendaciones en Caso de Fallo

- Verificar que `authStore3.ts` no se haya reiniciado o duplicado.
- Confirmar que la instancia de Firebase ya haya sido inicializada en `main.js`.
- Revisar que los roles de usuario (alumno, profesor, administrador) estén correctamente configurados en Firebase Authentication.
- Comprobar rutas de importación dentro de `src_refactor` para evitar errores de alias.

## Mejores Prácticas

- No reinventar `authStore3.ts` si ya se encuentra funcional.
- Mantener pruebas unitarias sobre `AuthService` para asegurar la correcta autorización de cada rol.
- Documentar cualquier cambio en las credenciales de Firebase para no afectar el flujo de login multiusuario.

## Contacto

 **Para dudas sobre integración o fallos críticos, vincular al repositorio base 3.3 del controlador de versiones GitHub**