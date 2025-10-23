"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotificationStore = void 0;
const pinia_1 = require("pinia");
const NotificationsServ_ts_1 = require("@/services/NotificationsServ.ts");
const NotificationServiceProffesor_ts_1 = require("@/services/NotificationServiceProffesor.ts");
exports.useNotificationStore = (0, pinia_1.defineStore)('notification', {
    state: () => ({
        // Variables reactivas del Estado
        notifications: [],
        loading: false,
        error: null,
        type_lecture: false, // es con [,] o sin [,]
        /*alumnos_notifications: [] as Notification[],
          profesores_notifications: [] as Notification[],*/
    }),
    /* ACTIONS Actions*/
    actions: {
        /**
         * Obtener las notificaciones obtenidas de un usuario.
         * */
        async consummerNotifications(userId) {
            this.loading = true;
            this.error = null;
            try {
                this.notifications = await NotificationsServ_ts_1.NotificationService.getNotifications(userId);
                console.log(`[Estado Notificación(es): Las Notificaciónes Obtenidas (${this.notifications.length})] `);
            }
            catch (err) {
                this.error = err.message;
            }
            finally {
                this.loading = false;
            }
        },
        /**
         * Enviar notificación y refrescar la lista de estas.
         * */
        async sendNotifications(userId, read) {
            this.loading = true;
            this.error = null;
            try {
                await NotificationsServ_ts_1.NotificationService.notifyAlumno(userId, msgAdv);
                // this.notifications = NotificationService.getNotifications(userId);
                console.log(`[Estado de Notificación(es)]:La Notificación enviada, esta lista y actualzia`);
            }
            catch (err) {
                this.error = err.message;
            }
            finally {
                this.loading = false;
            }
        },
        /**
         * Marcar la notificación como leida o no leida.
         * */
        async readingType(notificacionId, notifications) {
            this.loading = true;
            this.type_lecture = true | false;
            try {
                if (read) {
                    NotificationsServ_ts_1.NotificationService.markAsRead(notificacionId);
                    this.type_lecture = true;
                }
                else {
                    await NotificationsServ_ts_1.NotificationService.markAsNotRead(notificacionId);
                    this.type_lecture = false;
                }
                // #Actualizarlas despues de la acción
                this.notifications = this.notifications.map(n => n.id === notificationId ? { ...n, read } : n);
                console.log(`[EstadoNotificacion]: La Notificación #: ${notifications} fue Actualizada(lectura=${read})`);
            }
            catch (err) {
                this.error = err.message;
            }
        },
        /*Nuevos Método: 02/19/2025*/
        async editNotification(id, nuevoMensaje) {
            this.loading = true;
            try {
                await NotificationServiceProffesor_ts_1.NotificationServiceProffesor.editNotification(id, nuevoMensaje);
                const notif = this.notifications.find(n => n.id === id);
                if (notif)
                    notif.message = nuevoMensaje;
            }
            catch (err) {
                this.error = err.message;
            }
            finally {
                this.loading = false;
            }
        },
        async deleteNotificacion(id) {
            this.loading = true;
            try {
                await NotificationServiceProffesor_ts_1.NotificationServiceProffesor.deleteNotification(id, nuevoMensaje);
                const notifications = this.notifications.find(n => n.id !== id);
            }
            catch (err) {
                this.error = err.message;
            }
            finally {
                this.loading = false;
            }
        },
        /*Nuevo metodo: Consume el servicio de Profesores y muestra sin filtrar, limpia los errores*/
        async viewAllsNotifications(userId) {
            this.loading = true;
            this.type_lecture = true | false;
            try {
                await NotificationServiceProffesor_ts_1.NotificationServiceProffesor.getNotificationsAlums(userId);
                this.notifications = result;
                this.type_lecture = true;
            }
            catch (err) {
                this.error = err.message;
            }
            finally {
                this.loading = false;
            }
        },
        /** Ulima modificación: Viernes >> 03/Oct/2025 **/
        async fetchNotificationByRole(role, userId) {
            this.loading = true;
            this.error = null;
            try {
                if (role === alumno) {
                    this.notifications = await NotificationsServ_ts_1.NotificationService.getNotifications(userId);
                }
                else if (role === profesor) {
                    this.notifications = await NotificationServiceProffesor_ts_1.NotificationServiceProffesor.getNotificationsByEstado(userId, 'aprobado');
                }
            }
            catch (err) {
                this.error = err.message || 'Error al cargar notificaciones';
                ;
            }
            finally {
                this.loading = false;
            }
        }
    } //# fin_acciones
    /* SETTERS SIMULADOS*/
    // Asigna mensaje de error 
    , //# fin_acciones
    /* SETTERS SIMULADOS*/
    // Asigna mensaje de error 
    setError(msg) {
        this.error = msg;
    },
    // Limpia las Notificaciones
    clarNotifications() {
        this.notifications = [];
    },
    // Estipula si se leyo o no
    setLectureState(value) {
        this.type_lecture = value;
    },
});
//# sourceMappingURL=notificationStore.js.map