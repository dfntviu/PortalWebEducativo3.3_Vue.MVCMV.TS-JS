### 📚 GESTIÓN DE MATERIALES ###

├─ Ver materiales propios
│  ├─ Estudiante: ✅
│  ├─ Profesor: ➖
│  ├─ Implementado: ✅
│  └─ Vista: viewStudentsAdmMatls
│
├─ Ver todos los materiales
│  ├─ Estudiante: ➖
│  ├─ Profesor: ✅
│  ├─ Implementado: ✅
│  └─ Vista: viewTeachersAdmMatls
│
├─ Subir material
│  ├─ Estudiante: ✅
│  ├─ Profesor: ➖
│  ├─ Implementado: ✅
│  └─ Vista: viewUploadMaterials
│
├─ Editar material (pendiente)
│  ├─ Estudiante: ✅
│  ├─ Profesor: ➖
│  ├─ Implementado: ✅
│  └─ Componente: MaterialCard
│
├─ Eliminar material
│  ├─ Estudiante: ✅
│  ├─ Profesor: ✅
│  ├─ Implementado: ✅
│  └─ Componente: MaterialCard
│
├─ Aprobar / Rechazar material
│  ├─ Estudiante: ➖
│  ├─ Profesor: ✅
│  ├─ Implementado: ✅
│  └─ Vista: viewModerarMateriales
│
├─ Filtros avanzados
│  ├─ Estudiante: ✅
│  ├─ Profesor: ✅
│  ├─ Implementado: ✅
│  └─ Componente: MaterialFilters
│
│  ├─ Búsqueda por texto: ✅ (vistas de gestión)
│  ├─ Filtro por estado: ✅ (vistas de gestión)
│  ├─ Filtro por fecha: ✅ (vistas de gestión)
│  └─ Filtro por estudiante
│     ├─ Estudiante: ➖
│     ├─ Profesor: ✅
│     └─ Implementado: ✅
│
├─ Vistas
│  ├─ Vista por tarjetas: ✅ (ambas vistas)
│  └─ Vista agrupada por estudiante
│     ├─ Estudiante: ➖
│     ├─ Profesor: ✅
│     └─ Vista: viewTeachersAdmMatls
│
├─ Estadísticas
│  ├─ Personales
│  │  ├─ Estudiante: ✅
│  │  ├─ Implementado: ✅
│  │  └─ Componente: MaterialStats
│  └─ Globales
│     ├─ Profesor: ✅
│     ├─ Implementado: ✅
│     └─ Componente: MaterialStats
│
├─ Comentarios de moderación
│  ├─ Profesor: ✅
│  ├─ Implementado: ✅
│  └─ Vista: viewModerateBaseComments
│
└─ Ver detalles de material
   ├─ Estudiante: ✅
   ├─ Profesor: ✅
   ├─ Implementado: ✅
   └─ Vista: viewMaterIndividual


### 🔔 NOTIFICACIONES ###

├─ Campana de notificaciones
│  ├─ Implementado: ✅
│  ├─ Ubicación: NotificationBell
│  └─ Tiempo real: ✅
│
├─ Contador de no leídas: ✅ (NotificationBell)
├─ Dropdown últimas 5: ✅ (NotificationBell)
├─ Marcar como leída: ✅ (NotificationsService)
├─ Marcar todas como leídas: ✅ (NotificationsService)
├─ Eliminar notificación: ✅ (NotificationsService)
├─ Listener en tiempo real: ✅ (NotificationsService)
├─ Sonido de notificación: ✅ (notificationsStore)
├─ Notificar estudiante: ✅ (NotificationsService)
├─ Notificar profesor: ✅ (NotificationsService)
└─ Vista completa de historial
   ├─ Implementado: ❌
   └─ Vista pendiente: viewNotifications


### 👤 PERFIL DE USUARIO ###

├─ Ver perfil completo
│  ├─ Implementado: ✅
│  ├─ Vista: viewProfileUser
│  └─ Tabs: 3
│
├─ Editar información personal
│  ├─ Implementado: ✅
│  ├─ Tab: "Información Personal"
│  └─ Límite de actualizaciones
│
├─ Foto de perfil
│  ├─ Subir foto: ✅ (Sidebar perfil, máx 5MB)
│  └─ Eliminar foto: ✅ (Sidebar perfil)
│
├─ Seguridad
│  ├─ Cambiar contraseña
│  │  ├─ Implementado: ✅
│  │  └─ Reautenticación requerida
│  └─ Cambiar email
│     ├─ Implementado: ✅
│     └─ Validación institucional
│
├─ Estadísticas de cuenta
│  ├─ Implementado: ✅
│  └─ Tab: "Estadísticas"
│
├─ Campos por rol
│  ├─ Implementado: ✅
│  └─ Solo estudiantes (carrera, curso)
│
└─ Validación de límite de actualizaciones
   ├─ Implementado: ✅
   ├─ Servicio: ProfileService
   └─ Límites:
      ├─ Estudiantes: 5
      └─ Profesores: 7


### 🎨 DISEÑO UI/UX ###
├─ Tailwind CSS: ✅ (estilos centralizados)
├─ Layouts por rol: ✅ (diferenciados visualmente)
├─ Selector de rol: ✅ (App.vue)
├─ Responsive design: ✅ (mobile-first)
├─ Dark mode: ❌ (no implementado)
├─ Animaciones: ✅ (fade, slide, etc.)
├─ Loading states: ✅ (spinners globales)
├─ Error states: ✅ (mensajes descriptivos)
└─ Empty states: ✅ (con ilustraciones)
