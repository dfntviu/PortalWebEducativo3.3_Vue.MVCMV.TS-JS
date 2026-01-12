
### Proposito  Inicial ###
Sistema de gestión de materiales educativos para la Facultad de Ingeniería de la Universidad Autónoma del Estado de México. Plataforma digital que permite a estudiantes compartir materiales educativos con gestion, moderacion y consulta del profesor y subida del estudiante complementando las plataformas  Institucionales.

### 🎯 Descripción General ###
El Portal Educativo FI-UAEMEX es una plataforma web progresiva que digitaliza y optimiza el proceso de compartir materiales académicos entre estudiantes y profesores. El sistema implementa un flujo de moderación que garantiza la calidad de los recursos antes de publicarlos, reduciendo costos de impresión y facilitando el acceso de los materiales aprobados.

 ### ✨  CARACTERISTÍCAS PRINCIPALES ✨ ### 
### Objetivos del Sistema ###
 - Centralizar recursos educativos digitales en formato PDF y documentos
 - Implementar sistema de calidad mediante moderación docente
 - Facilitar acceso inmediato a materiales aprobados desde cualquier dispositivo
 - Reducir costos operativos en impresiones y fotocopiado
 - Fomentar colaboración estudiantil a través de compartición de apunte
 - Complementar (no sustituir) plataformas LMS existentes como Moodle o Schoology


Sistema de Autenticación

✅ Registro diferenciado por rol (Estudiante / Profesor / Administrador)
<!-- ✅ Login con email/contraseña + OAuth (Google, Facebook) [[pending]] -->
✅ Recuperación de contraseña por email
<!-- ✅ Sesiones persistentes con tokens JWT -->
✅ Sistema de permisos basado en roles

Gestión de Materiales

✅ Upload de archivos PDF (máx. 10MB)
✅ Sistema de moderación con tres estados: pendiente → aprobado → rechazado
✅ Comentarios de moderación por profesores
✅ Organización por categorías (7 categorías disponibles)
<!-- ✅ Sistema de tags para clasificación (8 tags predefinidos) [building] -->
✅ Previsualización de PDF integrada
✅ Edición y eliminación de materiales propios

Búsqueda y Descubrimiento

✅ Búsqueda full-text con Fuse.js (tolerante a errores de escritura)
✅ Filtros avanzados por: estado, categoría, tags, autor, rango de fechas
✅ Búsqueda de perfiles por email o nombre
✅ Búsqueda de profesores por área académica
<!-- ✅ Scoring de relevancia en resultados [[pending]] -->

Notificaciones en Tiempo Real

<!-- ✅ Notificaciones push usando Firebase Realtime listeners [[pending]] -->
✅ Campana de notificaciones con badge de contador
✅ Notificaciones de aprobación/rechazo de materiales
✅ Historial completo de notificaciones
✅ Marcado de leído/no leído

Perfil y Personalización

✅ Gestión completa de perfil de usuario
✅ Foto de perfil opcional con upload a Firebase Storage
✅ Cambio de email con reautenticación
✅ Cambio de contraseña seguro
✅ Preferencias de usuario persistentes
✅ Tracking de provider de autenticación (email/Google/Facebook)  **sin crear cuenta en facebook developers**

Temas y Experiencia de Usuario

✅ Dark Mode con 3 temas: Claro, Oscuro, Auto (sistema)
✅ Personalización de colores por rol (estudiantes: verde / profesores: café)
✅ Keyboard shortcuts (10+ atajos de teclado)
<!-- ✅ Sistema de toasts para feedback visual -->
✅ Animaciones y transiciones fluidas
✅ Diseño responsive (móvil, tablet, desktop)


   ## Exportación y Reportes ##
	<!-- - ✅ Exportación a Excel (XLSX) con formato profesional
	- ✅ Exportación a Word (DOCX) - en desarrollo
	- ✅ Exportación a PDF - en desarrollo
	- ✅ Dashboard de estadísticas personales
	- ✅ Estadísticas globales del sistema -->


   ###	═════════════════════════════════════════════════════════════════════════  ###
	 					<!-- PRINCIPIOS DE DISEÑO -->
   ###	═════════════════════════════════════════════════════════════════════════  ###

- 1. Separacion de Responsabilidades: Cada capa tiene una responsabilidad única y bien definida.
- 2. Unidireccionalidad de Flujo: Los datos fluyen en una sola dirección en produccion( Views → Stores → Services    →  Firebase).
- 3. Reactividad: Pinia nos proporciona reactividad automatica entre stores y views.
- 4. Reutilizacion: Servicios y componentes diseniados para máxima reutilizacion.
 	
 	  ###	═════════════════════════════════════════════════════════════════════════  ###
	 					<!-- STACK[PILA] DE TECNOLOGÍA -->
    ###	═════════════════════════════════════════════════════════════════════════  ###


Framework: Vue.js 3.4+
   - Composition API para Lógica reutilizable
   - [script setup] para codigo limpio
   - Teleport para modales y overlays

Lenguaje: TypeScript 5.3+
  - Type safety en todo el código
  - Interfaces bien definidas
  - Detección temprana de errores

Estado: Pinia 2.1+
  - Store reactivo y modular
  - Soporte completo para TypeScript
  - DevTools integration

Router: Vue Router 4.2+
  - Navegación declarativa
  - Guards de autenticación
  - Lazy loading de rutas

Estilos
   - Utility-First approach
   - Dark mode integrado
   - PostCSS como Preprocesador de Estilo

<!-- Utilities:
  - @vue/test-utils (testing de componentes)   -->

### ════════════════════════════════════════════════════   ###
	 <BACKEND></BACKEND>  <AS></AS> <SERVICE></SERVICE>
### ════════════════════════════════════════════════════   ###

PLATAFORM: FIREBASE 10.7


Autentificacion:
   - Email/Contrasenia
   - Autentificacion Ext. Facebook, Google

Firestore Database:
   - Almacenamiento de Archivos
   - URL seguras
   - Control de Acceso Seguro

<!-- Framework: Vitest: -->
  <!-- - Compatible con Vite
  - Tests rápidos -->

<!-- Conbertura: -->
  - Integration tests: 30%
  - E2E tests: Pendiente

Librerías Adicionales

Búsqueda:
  - Fuse.js 7.0+ (búsqueda fuzzy full-text - en el futuro )

Exportacion:
   - xlsx 0.18+ (Exportacion a Excel)
   - jsPDF (exportacion a PDF - en el futuro)
   - docx (exportacion a Word - en el futuro)



  ### ════════════════════════════════════════════════════   ###
	   	<REQUISITOS></REQUISITOS> <PREVIOS></PREVIOS>
  ### ════════════════════════════════════════════════════   ###
  
A) Preequistos Previos
   - Node.js >= 18.0.0(recomendado: 20.x LTS)
   - npm >= 9.0.0 o otro admin. de paquetes
   - Git> 23.3.0
   - Cuenta de Firebase: Proyecto configurado desde Firebase Console

B) Verificar instalaciones 
   -  **node --version  *Debera mostrar v18.0.0 o superior*
   - **npm --version**  *Debera mostrar 9.0.0 o superior*
   - **git --version**	*Debera mostrar 2.30.0 o superior*

 
   ###  ══════════════════ ###
	      🚀 Instalación
   ###   ══════════════════ ###
1] Clonar el repositorio
   - git clone https://github.com/dfntviu/PortalWebEducativo3.3_Vue.MVCMV.TS-JS/tree/final_Vite%2BTS%2BArqMVCMV
     cd PortalWebEducativo3_3Vue\src_refactor

2] Instalar todas las dependencias respectivas
   - **npm install**
   -  o  bien on pnpm install (segun corresponda el administrador de paquetes)


3] Configurar Variables de Entorno
   - Crear un archivo a la raíz del proyecto
     **cp .env.example .env**

4] Editar archivo con extension [.env] con las credenciales de Firebase Console [tal como muest. Firebase Front(Web)]

  # Firebase Configuration
  VITE_FIREBASE_API_KEY=el_api_key
  VITE_FIREBASE_AUTH_DOMAIN=el_proyecto.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=el_proyecto_id
  VITE_FIREBASE_STORAGE_BUCKET=el_proyecto.appspot.com 
  VITE_FIREBASE_MESSAGING_SENDER_ID= 123456789 -> example
  VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456 -> example
  VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Application
  VITE_APP_NAME="Portal Educativo FI-UAEMEX"
  VITE_APP_VERSION="1.0.0"

# Environment
  VITE_ENV=development

5] Inicializar las colecciones de Firebase
  El Sistema requiere las siguientes colecciones en Firestore para utilizarse
  firestore/
  ├── form_students-register/    # Perfiles de estudiantes
  ├── teachers_register/          # Perfiles de profesores
  ├── admin/                      # Perfiles de administradores
  ├── materials_loaded/           # Materiales educativos
  ├── notifications/              # Notificaciones para estudiantes
  ├── notificationsProfessor/     # Notificaciones para profesores
  ├── profesor_comentarios/       # Comentarios de moderación
  └── preferences/                # Preferencias de usuario


6] ⚙️ Configuracion del Amb. de Desarrollo
  Scripts Disponibles:
 
 	{
   - "dev": "vite",                          **// Servidor de desarrollo **
   - "build": "vue-tsc && vite build",       **// Build de producción **
   - "preview": "vite preview",              **// Preview del build **
   - "test": "vitest",                       **// Tests en modo watch **
   - "test:ui": "vitest --ui",              **// Tests con interfaz visual **
   - "test:coverage": "vitest run --coverage", **// Tests con cobertura **
   - "test:run": "vitest run",              **// Tests una vez **
   - "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx", **
   - "format": "prettier --write src/" **
	}

** FLUJO DE TRABAJO EN PRODUCCION **

# Servidor de desarrollo (http://localhost:5174) 
 **npm run dev:refactor**  (directorio paralelo)

# Build de producción 
 **npm run build**

# Tests unitarios
 **npm run test**

  ### ════════════════════════════════════════════════════════════════════════════════════════════  ###
         <!-- El proyecto implementa el patrón arquitectónico Services-Stores-Views (SSV), una adaptación 
              del patrón  MVC para aplicaciones Vue.js con Firebase -->
  ###   ════════════════════════════════════════════════════════════════════════════════════════════  ###

  ###  FLUJO DE DESAROLLO ###

  ┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: VIEWS                             │
│              (Componentes Vue - Presentación)                 │
│                                                               │
│  ├─ viewLoginDepInit.vue                                      │
│  ├─ viewStudentsAdmMatls.vue                                  │
│  ├─ viewTeachersAdmMatls.vue                                  │
│  ├─ viewUploadMaterials.vue                                   │
│  ├─ viewProfileUser.vue                                       │
│  └─ viewNotifications.vue                                     │
└───────────────────────────────────────────────────────────────
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: STORES                          │
│              (Pinia - Gestión de Estado)                    │
│                                                             │
│  ├─ authStore.ts          → Estado de autenticación         │
│  ├─ materialStore.ts      → Estado de materiales            │
│  ├─ profileStore.ts       → Estado de perfiles              │
│  ├─ notificationStore.ts  → Estado de notificaciones        │
│  └─ themeStore.ts         → Estado de temas                 │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                   LAYER 3: SERVICES                         │
│             (Lógica de Negocio y Firebase)                  │
│                                                             │
│  ├─ AuthService.ts           → Autenticación                │
│  ├─ MaterialService.ts       → CRUD de materiales           │
│  ├─ BaseProfileService.ts    → Servicio base de perfiles    │
│  ├─ NotificationService.ts   → Notificaciones               │
│  ├─ SearchService.ts         → Búsqueda avanzada            │
│  ├─ ExportService.ts         → Exportación de datos         │
│  └─ ThemeService.ts          → Gestión de temas             │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                  FIREBASE BACKEND                           │
│                                                             │
│  ├─ Authentication    → Gestión de usuarios                 │
│  ├─ Firestore        → Base de datos NoSQL                  │
│  ├─ Storage          → Almacenamiento de archivos           │
│  <!-- └─ Hosting          → Despliegue de la aplicación --> │
└─────────────────────────────────────────────────────────────┘