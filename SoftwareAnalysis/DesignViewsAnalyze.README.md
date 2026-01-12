	   			###	    ═════════════════════════════════════════════════════════════════════════     ###
	   												ANALISIS DE LAS VISTAS 
	   			###		═════════════════════════════════════════════════════════════════════════     ###

### 👨‍🎓 Vistas de ESTUDIANTE ###
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| MÓDULO / VISTA                | RUTA                                          | DESCRIPCIÓN                                                 | ESTADO               |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----|
| Bienvenida Estudiante         | viewBienvenidaStudents/                       | Vista principal post-login.                                 | ✅ Implementada      |
|                               | bienvenida-studentsDashboard                  | - Estadísticas                                              |                      |
|                               |                                               | - Resumen de materiales                                     |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| Gestión de Materiales         | viewStudentsAdmMatls/                         | Vista principal de gestión de materiales del estudiante.    | ✅ Implementada      |
|                               | view-student-adm-matls                        | - Ver mis materiales (propios)                              |                      |
|                               |                                               | - Filtros: búsqueda, estado, fecha                          |                      |
|                               |                                               | - Estadísticas personales                                   |                      |
|                               |                                               | - Editar materiales pendientes                              |                      |
|                               |                                               | - Eliminar materiales                                       |                      |
|                               |                                               | - Ver detalles                                              |                      |
|                               |                                               | - Ordenamiento múltiple                                     |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| Subir Material                | viewUploadMaterials/                          | Subir nuevo material educativo con archivo.                 | ✅ Implementada      |
|                               | view-upload-materials                         |                                                             |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| Detalle de Material           | viewMaterIndividual/                          | Ver detalles completos de un material específico.           | ✅ Implementada      |
|                               | view-mater-individual/:id                     |                                                             |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| Registro Inicial Estudiante   | viewStudentRegisterBase/                      | Registro inicial de estudiante (primer uso).                | ✅ Implementada      |
|                               | view-student-register-base                    | Solo para nuevos usuarios                                   |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----
| Notificaciones                | viewNotifications/                            | Ver todas las notificaciones (historial completo).          | ⚠️ Falta crear       |
|                               | notificaciones                                | Mencionada pero no creada                                   |                      |
+-------------------------------+-----------------------------------------------+-------------------------------------------------------------+-----


 ### 👨‍🏫 Vistas de PROFESOR ###
+-------------------------------+------------------------------------------------------+------------------------------------------------------------|                               |                        |                      |      |
| MÓDULO / VISTA                | RUTA                                                 | FUNCIONALIDADES PRINCIPALES                                              | ESTADO               |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Bienvenida Profesor           | viewBienvenidaTeachers/                             | Vista principal post-login.                                              | ✅ Implementada      |
|                               | view-bienvenida-teachers                            | - Dashboard                                                              |                      |
|                               |                                                      | - Estadísticas globales                                                   |                      |
|                               |                                                      | - Resumen del sistema                                                     |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Gestión de Materiales         | viewTeachersAdmMatls/                               | Vista principal de gestión de materiales del sistema.                    | ✅ Implementada      |
| (Profesor)                    | view-teacher-adm-matls                              | - Ver TODOS los materiales                                                |                      |
|                               |                                                      | - 2 modos de vista: Tarjetas / Por Estudiante                             |                      |
|                               |                                                      | - Filtros: estudiante, estado, búsqueda, fecha                            |                      |
|                               |                                                      | - Materiales agrupados por alumno                                         |                      |
|                               |                                                      | - Estadísticas por estudiante                                             |                      |
|                               |                                                      | - Acceso rápido a moderación                                              |                      |
|                               |                                                      | - Expandir / colapsar por estudiante                                      |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Moderación de Materiales      | viewModerarMaterialessolution/                      | Sistema de moderación de materiales.                                     | ✅ Implementada      |
|                               | view-moderar-materiales-solution                    | - Aprobar / Rechazar materiales                                           |                      |
|                               |                                                      | - Agregar comentarios de moderación                                       |                      |
|                               |                                                      | - Ver materiales pendientes                                               |                      |
|                               |                                                      | - Notificar al estudiante                                                 |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Comentarios de Profesores     | viewModerateBaseComments/                           | Gestión de comentarios de profesores sobre materiales.                   | ✅ Implementada      |
|                               | view-moderate-base-comments                         |                                                                          |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Registro Inicial Profesor     | viewRegisterTeacher1/                               | Registro inicial de profesor (primer uso del sistema).                   | ✅ Implementada      |
|                               | view-register-teacher1                              | Para setup inicial                                                        |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------
| Notificaciones                | viewNotifications/                                  | Ver todas las notificaciones (historial completo).                       | ⚠️ Falta crear       |
|                               | notificaciones                                      | Mencionada pero no creada                                                 |                      |
+-------------------------------+------------------------------------------------------+------------------------------------------------------------



 ### 2️⃣ SERVICIOS IMPLEMENTADOS ###
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| SERVICIO                      | ARCHIVO                              | RESPONSABILIDAD                                                          | ESTADO               | ¿DUPLICADO?                  |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| BaseFirestoreService          | BaseFirestoreService.ts              | CRUD genérico para Firestore (clase abstracta).                          | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| AuthService2                  | AuthService2.ts                      | - Login                                                                  | ✅ Implementado      | ⚠️ Posible duplicado         |
|                               |                                     | - Logout                                                                 |                      | con AuthService.ts           |
|                               |                                     | - Estado de autenticación                                                 |                      |                              |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| MaterialAdmService            | MaterialAdmService.ts                | - CRUD de materiales                                                     | ✅ Implementado      | ⚠️ Unificar                  |
|                               |                                     | - Obtener por estudiante                                                 |                      | MaterialAdmServAlumno        |
|                               |                                     | - Filtros por fecha                                                      |                      | y MaterialAdmServProfesor    |
|                               |                                     | - Estadísticas                                                           |                      |                              |
|                               |                                     | - Agrupar por estudiante                                                 |                      |                              |
|                               |                                     | - Subir archivos                                                         |                      |                              |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| ProfileService                | ProfileService.ts                    | - Obtener perfil                                                         | ✅ Implementado      | ❌ No                        |
|                               |                                     | - Actualizar perfil                                                      |                      |                              |
|                               |                                     | - Subir / eliminar foto                                                  |                      |                              |
|                               |                                     | - Cambiar contraseña                                                     |                      |                              |
|                               |                                     | - Cambiar email                                                          |                      |                              |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| NotificationsService          | NotificationsService.ts              | - Notificar estudiantes                                                  | ✅ Implementado      | ❌ No                        |
|                               |                                     | - Notificar profesores                                                   |                      |                              |
|                               |                                     | - Listeners en tiempo real                                               |                      |                              |
|                               |                                     | - Marcar como leído                                                      |                      |                              |
|                               |                                     | - Eliminar notificaciones                                                |                      |                              |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| ToastService                  | ToastService.ts                      | Sistema de notificaciones toast                                          | ✅ Implementado      | ❌ No                        |
|                               |                                     | (éxito, error, warning, info)                                            |                      |                              |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| PermissionsService            | PermissionsServ.ts                   | Gestión de permisos por rol.                                             | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| RouterGuardService            | RouterGuardServ.ts                   | Guards de navegación, validación de roles y permisos.                    | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| TeacherFirstUsingService      | TeacherFirstUseServ2.ts              | Detectar y manejar primer uso del sistema.                               | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+----------------------+------------------------------+
| TokenValidationService        | TokenValidationService.ts            | Validar tokens de Firebase, refresh automático.                          | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+----------------------+------------------------------+
| ProfileStudentService         | ProfileStudentServ.ts                | Servicios específicos de perfil de estudiante.                           | ⚠️ Parcial           | ⚠️ Duplicado                 |
|                               |                                     |                                                                          |                      | con ProfileService           |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--
| ModerationService             | ModerationServ.ts                    | Moderación de materiales.                                                | ✅ Implementado      | ❌ No                        |
+-------------------------------+-------------------------------------+--------------------------------------------------------------------------+--

				###	    ═════════════════════════════════════════════════════════════════════════     ###
	   												ANALISIS DE LAS ARQUITECTURA
	   			###		═════════════════════════════════════════════════════════════════════════     ###
	   			
 ### 3️⃣ COMPONENTES REUTILIZABLES ###
+----------------------+-----------------------------+---------------------------------------------------------------+------------------+
| Componente           | Ubicación                   | Uso                                                           | Estado           |
+----------------------+-----------------------------+---------------------------------------------------------------+------------------+
| LayoutNavBarRole1    | components/Layout            | Layout con navbar para Estudiantes (5 vistas)                 | ✅ Implementado |
| LayoutNavBarRole2    | components/Layout            | Layout con navbar para Profesores (5 vistas)                  | ✅ Implementado |
| MaterialCard         | components/materials         | Tarjeta individual de material con acciones                   | ✅ Implementado |
| MaterialStats        | components/materials         | Widget de estadísticas (total, aprobados, rechazados,         | ✅ Implementado |
|                      |                              | pendientes)                                                   |                 |
| MaterialFilters      | components/materials         | Panel de filtros avanzados (búsqueda, estado, fecha,          | ✅ Implementado |  
|                      |                              | estudiante)                                                   |                  |
| NotificationBell     | components/notifications     | Campana con dropdown de notificaciones en tiempo real         | ✅ Implementado  |
| ToastContainer       | components/toast             | Contenedor de toasts                                          | ✅ Implementado  |
| ToastItem            | components/toast             | Toast individual con animaciones                              | ✅ Implementado  |
+----------------------+-----------------------------+------------------------------------------------------------------------------------+


 ### 4️⃣ STORES (ESTADO GLOBAL) ###
+---------------------+---------------------------+--------------------------------------------------------------+---------------------------------
| Store               | Archivo                   | Responsabilidad / Estado                                     | Estado           | Sincronizado con Service           |

| authStore           | authStore2.ts             | Estado de autenticación                                       | ✅ Implementado  | ✅ Sí (AuthService2)          |
|                     |                           | Usuario actual                                                |                  |                               |
|                     |                           | Rol                                                           |                  |                               |
|                     |                           | Primer uso                                                    |                  |                               |
|                     |                           | Loading / Error                                               |                  |                               |
+---------------------+---------------------------+---------------------------------------------------------------+------------------+--------------
| materialStore       | materialStore.ts           | Lista de materiales                                          | ✅ Implementado  | ✅ Sí (MaterialAdmService)     |
|                     |                           | Estadísticas                                                  |                  |                               |
|                     |                           | Material actual                                               |                  |                               |
|                     |                           | Filtros                                                       |                  |                               |
|                     |                           | Loading / Error                                               |                  |                               |
+---------------------+---------------------------+---------------------------------------------------------------+------------------+--------------
| notificationsStore  | notificationsStore.ts      | Lista de notificaciones                                      | ✅ Implementado  | ✅ Sí (NotificationsService) |
|                     |                           | Contador de no leídas                                         |                  |                               |
|                     |                           | Listener en tiempo real                                       |                  |                               |
|                     |                           | Reproducir sonido                                             |                  |                               |
+---------------------+---------------------------+---------------------------------------------------------------+------------------+--------------
| toastStore          | toastStore.ts              | Cola de toasts                                               | ✅ Implementado  | ✅ Sí (ToastService)         |
|                     |                           | Auto-dismiss                                                  |                  |                               |
|                     |                           | Gestión de ciclo de vida                                      |                  |                               |
+---------------------+---------------------------+---------------------------------------------------------------+------------------+--------------
