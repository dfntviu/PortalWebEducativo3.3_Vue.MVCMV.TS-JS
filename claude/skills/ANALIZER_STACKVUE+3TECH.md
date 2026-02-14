---
name: analyzing-vue-views
description: Analyzes Vue 3 + TypeScript + Tailwind views for architecture compliance, performance issues, and best practices. Use when reviewing Vue SFCs, debugging component logic, checking Services-Stores-Views pattern adherence, or optimizing large components.
---

# Vue View Analyzer

## Analysis checklist

### 1. Architecture compliance (Services-Stores-Views)
```
[ ] No direct Firebase calls in view
[ ] Store handles all state mutations
[ ] Services handle external communications
[ ] View only manages UI state and user interactions
```

### 2. Script setup structure

Expected order:
```typescript
// 1. Imports (external → internal → types)
// 2. Props & Emits definitions
// 3. Composables (useRouter, useStore, etc.)
// 4. Refs & Reactive state
// 5. Computed properties
// 6. Watchers
// 7. Lifecycle hooks
// 8. Methods (handlers → helpers)
```

### 3. TypeScript quality
```
[ ] Props properly typed (no `any`)
[ ] Emits with payload types
[ ] Refs with explicit generic: ref<Type>()
[ ] Functions with return types
```

### 4. Tailwind patterns
```
[ ] No inline styles (use Tailwind classes)
[ ] Consistent spacing scale (4, 8, 12, 16...)
[ ] Dark mode variants where needed
[ ] Responsive breakpoints (sm:, md:, lg:)
```

### 5. Performance flags
```
[ ] No v-if + v-for on same element
[ ] Keys on v-for loops
[ ] Computed vs method for derived state
[ ] Large lists use virtual scrolling
```

## Output format
```yaml
archivo: "[ComponentName].vue"
lineas: [total]
arquitectura:
  cumple_svv: true | false
  violaciones: []
typescript:
  score: "A | B | C"
  issues: []
performance:
  flags: []
refactor_sugerido:
  prioridad: "H | M | L"
  acciones: []
```

## For large files (400+ lines)

Consider splitting if:
- Multiple unrelated features in one file
- Template exceeds 200 lines
- More than 10 methods

Suggest extraction:
- Composables for reusable logic
- Child components for template sections
- Utility functions for pure transformations
```

---

### Flujo Práctico en claude.ai

**Para tu AdminDashboard.vue de ~600 líneas:**
```
Contexto: Soy arquitecto de desarrollo web trabajando en Portal Educativo FI-UAEMEX.
Stack: Vue 3 + TypeScript + Pinia + Tailwind + Firebase.
Patrón arquitectónico: Services-Stores-Views.

Analiza el siguiente componente usando este framework:

[PEGAR EL SKILL AQUÍ]

---

Componente a analizar:
```vue
[TU CÓDIGO AQUÍ]
```

Enfócate en:
1. Violaciones del patrón Services-Stores-Views
2. Oportunidades de extracción a composables
3. Issues de TypeScript