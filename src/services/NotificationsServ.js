// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.NotificationService = void 0;
// const firestore_1 = require("firebase/firestore");
// const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
// const { db } = (0, initializateFirebase_js_1.initializateFireabaseStg)();
// class NotificationService {
//     static collectionName = 'notifications';
//     // Notificar al Alumn
//     static async notifyAlumno(alumnoId, mensaje) {
//         try {
//             const newDocRef = (0, firestore_1.doc)((0, firestore_1.collection)(db, this.collectionName));
//             const notification = {
//                 alumnoId,
//                 mensaje,
//                 leido: false,
//                 timestamp: new Date(),
//             };
//             await (0, firestore_1.setDoc)(newDocRef, notification);
//             return { id: newDocRef.id, ...notification };
//         }
//         catch (error) {
//             console.error('[Servicio Notificiones]: Error al notificar al Alumno', error);
//             throw error;
//         }
//     }
//     // Obtener Notificaciones individuales
//     static async getNotifications(alumnoId) {
//         try {
//             const q = (0, firestore_1.query)((0, firestore_1.collection)(db, this.collectionName), (0, firestore_1.where)('alumnoId', '===', alumnoId));
//             const snapshot = await (0, firestore_1.getDocs)(q);
//             return snapshot.docs.map(doc => { doc.id, ; }, ...firestore_1.doc.data());
//         }
//         finally { }
//         ;
//     }
//     catch() {
//         console.error('[MaterialDeployService]: Error al obt las notificationes', error);
//         throw error;
//     }
// }
// exports.NotificationService = NotificationService;
// async;
// markAsRead(notificationId, string);
// {
//     try {
//         const docRef = (0, firestore_1.doc)(db, this.collectionName, notificationId);
//         await (0, firestore_1.updateDoc)(docRef, { leido: true });
//     }
//     catch (error) {
//         console.error('al Marcar notification como leida', error);
//         throw error;
//     }
// }
// async;
// markAsNotRead(notificationId, string);
// {
//     try {
//         const docRef = (0, firestore_1.doc)(db, this.collectionName, notificationId);
//         await (0, firestore_1.updateDoc)(docRef, { leido: false });
//     }
//     catch (error) {
//         console.error('La notificación sigue sin abrirse', error);
//         throw error;
//     }
// }
// ;
// //# sourceMappingURL=NotificationsServ.js.map