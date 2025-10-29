// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// const firestore_1 = require("firebase/firestore");
// const firebase_1 = require("@/firebase");
// const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
// class NotificationServiceProffesor {
//     static collectionNameR2 = 'notificationsProfessor';
//     /*Permite al profesor acceder a todas las notificaciones pendientes, facilitando la gestión del material
//      subido por los alumnos.*/
//     static async getNotificationsNoLeidas(profesorId) {
//         try {
//             const consulta = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, collectionNameR2), (0, firestore_1.where)('profesorId' === profesorId), (0, firestore_1.where)('leido' == false));
//             const snapshot = await (0, firestore_1.getDocs)(consulta);
//             return snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//         }
//         catch (error) {
//             console.error('[Serv. Notificaciones Rol-2]:Error al obtener las notificaciones no Leidas', error);
//             throw error;
//         }
//     }
//     /*El met. se encarga de recuperar las notificaciónes que ya han sido leidas por el profesor*/
//     static async getNotificationsLeidas(profesorId) {
//         try {
//             const consulta = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, this.collectionNameR2), (0, firestore_1.where)('profesorId' == profesorId), (0, firestore_1.where)('leido' == true));
//             const snapshot = await (0, firestore_1.getDocs)(consulta);
//             return snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//         }
//         catch (error) {
//             console.error('[Serv. Notificaciones Rol-2]:Error al obtener las notificaciones Leidas', error);
//             throw error;
//         }
//     }
//     /* Obtiene todas las notificaciónes, tal cual. */
//     static async getNotificationsProfessor() {
//         try {
//             const alls = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, this.collectionNameR2));
//             /*Sin condicionar nada*/
//             snap = await (0, firestore_1.getDocs)(alls);
//             // Mapeamos los documentos y devolvemos array de datos
//             return snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//         }
//         catch (error) {
//             console.error('[Mat-Desplegar-Servicio]: Error al obtener las notificaciones', error);
//             throw error;
//         }
//     }
//     async editNotification(id, nuevoMensaje) {
//         try {
//             await updateDoc((0, firestore_1.doc)(firebase_1.db, this.collectionNameR2, id), {
//                 message: nuevoMensaje,
//                 fechaEdicio: new Date().toISOString()
//             });
//         }
//         catch (error) {
//             console.erro('[Servicio Notificaciones]: Error al editar', error);
//             throw error;
//         }
//     }
//     /*El metodo permitiría actualizar el estado de un material y añadir un comentario adicional, por ejemplo: aceptadoo o rechazado.*/
//     static async updateMaterialStatus(notificationId, estado, comentario) {
//         try {
//             const docRef = (0, firestore_1.doc)(firebase_1.db, collectionNameR2, notificationId);
//             await updateDoc(docRef, {
//                 estado: 'rechazado' | 'aprobado',
//                 mensaje: comentario,
//                 leido: true
//             });
//         }
//         catch (error) {
//             console.error('Error al actualizar el estado del material', error);
//             throw error;
//         }
//     }
//     /**--------------------------------------------------------
//      * @fecha 01/Oct/25
//      * @description
//      *  Metodo encargado de agregar una nueva notificación al sistem, guardándola directamente en la
//      *  colección de Firestore llamada 'notifications'
//      *
//      * @param nueva notificación Texto o contenido principal de la notificación
//      *
//      * @returns La notificación recién creada con su id asignado
//      *
//      *  💡Proposito
//      * Este metodo encapsula la lógica de creación de notificaciónes en el servicio. De esta manera:
//      * - La vista nunca interactúa directo con la Firestore
//      * - Se mantiene coherencia con otros dominios
//      *
//      * En resumen:  ** Un punto central de escritura para las notificaciones
//      * ========================================================
//      * */
//     static async addNotification(nuevaNotificacion) {
//         try {
//             // Construimos el objeto de notificacion
//             const notificacion = {
//                 mensaje: nuevaNotificacion,
//                 fecha: firestore_1.TimeStamp.now(),
//                 leido: false,
//             };
//             // guardamos en la colección
//             const docRef = await (0, firestore_1.addDoc)(colection(firebase_1.db, this.collectionNameR2), notificacion);
//             // se retorna la notifiación en el id asignado por Firestore
//             return { id: docRef.id, ...notificacion };
//         }
//         catch (error) {
//             console.error('[Notify-Profesor] Error al agregar la Notificacion', error);
//             throw error;
//         }
//     }
//     /* Permite Filtrar las  Notificaciones segun corresp. el estado del material[aceptado/rechazado] */
//     static async getNotificationsByEstado(profesorId, estado) {
//         try {
//             const filter_query = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, collectionNameR2), (0, firestore_1.where)('profesorId' == profesorId), (0, firestore_1.where)('estado' == estado));
//             const snapshot = await (0, firestore_1.getDocs)(filter_query);
//             return snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//         }
//         catch (error) {
//             console.error('[Servicio Notificaciones]: Error al obtener las notificaciones por ESTADO', error);
//             throw error;
//         }
//     }
//     static async deleteNotification(notificacionId) {
//         try {
//             // Crear la referencia al material(documento) que se desea Eliminar
//             const docRef = (0, firestore_1.doc)(firebase_1.db, this.collectionNameR2, notificacionId);
//             /*Se ejecuta el met. del Back-End de eliminación*/
//             await (0, firestore_1.deleteDoc)(docRef);
//             console.log(`[Serv. Notificaciones]: La Notificación con el ID: ${notificacionId}Eliminada`);
//         }
//         catch () {
//             console.error('ERROR: Lo sentimos hubo un error al Eliminar la Notificación');
//             throw error;
//         }
//     }
// }
// //# sourceMappingURL=NotificationsProfessorServ.js.map