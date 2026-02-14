<!-- --
name: analyzing-vue-views
description: Analyzes Vue 3 + Typescript + Pinia + Tailwind components for architecture compilance. Use when user uploads or
	pastes Vue SFC files, ask to review vue Component, check Services-Stores-Views pattern, debug Vue template errors, or
	optimize large Vue views (400+ lines).
--

# Vue View Analyzer

## Trigger conditions

Activate when: 
- User pastes `.vue` file content
- User mentions "analiza", "revisa", "verifica" + Vue/Component
- User ask about Services-Store-Views pattern
- File contains `<scrip setup lang="ts">`


## Analysis phases

For files >400 lines, analyze in phases:


## Phase 1: Script structure (first 100 lines)

``
[] Imports ordered: external → internal → types
[] Props/Emits properly typed
[] Composables declared early
[] No direct Firebase/API calls (violates SVV)


## Phase 2: State & logic

 ```
  [] Refs with explicit types: ref<Type>()
  [] Computed for derived state (not methods)
  [] Watchers with cleanup
  [] No bussines logic in view
 ```


## Phase 2: Templates analysis

 ```
  [] No v-if + v-for on same element
  [] keys on all v-for
  [] Events use @clik on v-on:click
  [] Tailwind classses (not inline styles)
 ```

 ## Output Format

``` yaml
  componente: "[name].vue"
  lineas:[total]
  arquitectura_svv:
  	cumple: true | false
  	violaciones:
  	- ubicacion: "linea X"
  	 tipo: "llamada directa a Firebase"
  	 correccion: "mover a servicio"
  typescript:
  	score: "A|B|C"
  	issues: []
  refactorizacion:
  	prioridad: "H | M | L"
  	extraciones_sugeridas:
  		-tipo: "composable"
  		nombre: "useXXX"
  		lineas: 50-120
 ```

 ## Extracion triggers

 Suggest splitting when:
 -template > 200 lines → child components
 ->5 related refs → composable
 - Repeated logic →  utility function
 - Store interactions > 50 lines →  dedicates store actions -->