# Resumen de Vite

Vite es un **servidor de desarrollo y sistema de construcción** moderno, no un framework ni una librería. Su función principal es **coordinar la interacción** entre el framework (como Vue), el lenguaje de desarrollo (TypeScript) y las herramientas auxiliares, durante desarrollo y producción.

## Arquitectura

- Vite se sitúa **por encima del framework**, definiendo **cómo se sirve y transforma** la aplicación.
- Vue define la **lógica y componentes** de la aplicación, mientras Vite se encarga del **servicio, transformación y empaquetado**.
- El **punto de entrada** es `index.html`, donde se declara `src/main.ts` como módulo ES, permitiendo que el navegador cargue módulos **sin empaquetado completo** en desarrollo.

## Flujo de desarrollo

1. El navegador solicita `index.html`.
2. Se carga `main.ts` como módulo ES.
3. Vite intercepta la solicitud, **transpila TypeScript con esbuild**, procesa componentes Vue mediante plugins y resuelve dependencias.
4. Entrega JavaScript ejecutable al navegador.
5. En producción, Vite utiliza Rollup para generar **bundles optimizados**.

## Roles de las herramientas

- **Vue:** inicializa la app (`createApp`), plugins y ciclo de vida.
- **TypeScript:** lenguaje de desarrollo; la verificación de tipos la realiza `tsc` o el IDE.
- **tsconfig.json:** define reglas de tipado y paths, no ejecuta la compilación.
- **vite.config.ts:** orquesta plugins, alias, servidor y base path.
- **Plugins de Vue:** permiten interpretar archivos `.vue` y aplicar transformaciones.

## Principios clave

1. **Separación de responsabilidades:** framework y sistema de construcción independientes.
2. **Mínima configuración explícita:** la mayoría de la lógica es automática.
3. **Alineación con estándares del navegador:** uso de módulos ES nativos para máxima eficiencia.

---