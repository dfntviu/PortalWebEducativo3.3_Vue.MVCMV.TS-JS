"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationService = void 0;
const firestore_1 = require("firebase/firestore");
const NotificationsServ_ts_1 = require("@/Services/NotificationsServ.ts");
const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
const { db } = (0, initializateFirebase_js_1.initializateFireabaseStg)();
class ModerationService {
    static collectionName = 'materials_register';
    static moderateCommentColl = 'profesor_comentarios';
    // Aprobar los materiales
    static async arpobarMaterialsEduc(materialId, alumnoId) {
        try {
            const matRef = (0, firestore_1.doc)(db, collectionName, materialId);
            const aceptar_mat = (0, firestore_1.updateDoc)(matRef, { estado: 'aprobado', aprobatoAt: new Date() }); //a prueba
            NotificationService.notifyAlumno(alumnoId, 'El matarial fue Aprobado');
            return aceptar_mat; // a prueba
        }
        catch (error) {
            console.error('Error al reibir los materiales de los Alumno');
            throw error;
        }
    }
    // Rechzar los materiales
    static async rechazarMaterialsEduc(materialId, alumnoId) {
        try {
            const matRef = (0, firestore_1.doc)(db, collectionName, materialId);
            const ;
            const rechazar_mat = (0, firestore_1.updateDoc)(matRef, { estado: 'rechazado', aprobatoAt: new Date() }); //a prueba
            NotificationService.notifyAlumno(alumnoId, 'El matarial fue Rechazado');
            return rechazar_mat; // a prueba
        }
        catch (error) {
            console.error('Error al reibir los materiales de los Alumno');
            throw error;
        }
    }
    // Obtener materiales pendientes
    static async getPenditentes() {
        const regCollection = (0, firestore_1.collection)(db, this.collectionName);
        const snapshot = await (0, firestore_1.getDocs)(regCollection);
        const pendientes = snapshot.docs. //?
            map(doc => { doc.id, ; }, ...firestore_1.doc.data());
    }
    filter(mat, mat, estado) { }
}
exports.ModerationService = ModerationService;
 === 'pendiente';
;
return pendientes;
async;
agregarComentarioProffe(mensaje, string, destacado, boolean);
{
    try {
        const docRef = addDoc((0, firestore_1.collection)(db, moderateCommentColl), {
            mensaje, destacado,
            fecha: serverTimeStamp()
        });
        return {
            id: docRef.uuid,
            mensaje,
            destacado,
            fecha: new Date(), m
        };
    }
    catch (error) {
        console.error("Error al guardar el comentario en la Firestore", error);
        throw error;
    }
}
//# sourceMappingURL=ModerationServ.js.map