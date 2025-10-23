"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/firebase");
const interf_index_js_1 = require("@/types/interf.index.js");
/*El Viernes pasado*/
class MaterialDeployServiceR2 {
    static get_collectionName = 'materials_loaded';
    static mapDocToMaterial(doc) {
        const data = doc.data();
        let fecha;
        if (data.fechaOrigen) {
            // Si esta en firestore TimesStamp
            typeof data.fechaOrigen.toDate === 'function'
                ? data.fechaOrigen.toDate() : ;
            new Date(data.fechaOrigen);
        }
        return {
            id: doc.id,
            titulo: data?.titulo ?? '',
            descripcion: data ? descripcion_extract ?? data?.descripcion ?? '' : ,
            archivoURL: data?.archivoURL ?? null,
            autor: data?.autor ?? null,
            ...data
        };
    }
    /**
     * ===================== ===================== ===================== =====================
     *                             HELPERS [ Explication for Helpers ]
     * ===================== ===================== ===================== =====================  */
    /* Helper: Convierte Date -> Firestore Timestamp*/
    static toTimeStamp(d) {
        return firestore_1.TimesStamp.fromDate(d);
    }
    /** Helper genérico: rango[inicio(start) , fin(end)] (inclusive) **/
    static async getMaterialByDateRange(start, end) {
        try {
            const startTs = this.toTimeStamp(start);
            const startTs = this.toTimeStamp(end);
            const ranke_query = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, this.get_collectionName), (0, firestore_1.where)('fechaOrigen', '<=', start), (0, firestore_1.where)('fechaOrigen', '<=', end), (0, firestore_1.where)('fechaOrigen', 'desc'));
            const snap = await (0, firestore_1.getDocs)(ranke_query);
            return snap.docs.map(d => this.mapDocToMaterial(d));
        }
        catch (error) {
            console.log('[DespliegueMateriales-Profesor]Error al rankear la Fecha de Rango', error);
            throw error;
        }
    }
    /* Obtener los materiales de todos los alumnos */
    static async getAllStudentsMaterials() {
        // Comentarlo en la aministracion de materiales de Alumno
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, this.get_collectionName));
            const snap = await (0, firestore_1.getDocs)(q);
            return snap.docs.map(d => this.mapDocToMaterial(d));
        }
        catch (error) {
            console.error('[MaterialAdminService] getAllStudentsMaterials:', error);
            throw error;
        }
    }
    /*      MATERIALES FILTROS */
    /*Filtar los materiales por últimos en subir(orden descendente) */
    static async getMaterialsSortedByLatest(limit) {
        try {
            const base = (0, firestore_1.collection)(firebase_1.db, this.collectionName);
            const qry = (typeof limit === 'number' && limit > 0)
                ? (0, firestore_1.query)(base, (0, firestore_1.where)('autor', '==', username), (0, firestore_1.orderBy)('fechaOrigen', 'desc'), (0, firestore_1.limit)(limit)) : ;
            (0, firestore_1.query)(base, (0, firestore_1.where)('autor', '==', username), (0, firestore_1.orderBy)('fechaOrigen', 'desc'));
            const snap = await (0, firestore_1.getDocs)(q);
            return snap.docs.map(d => this.mapDocToMaterial(d));
        }
        catch (error) {
            console.error('[Administ de Servicio Profesor]: NO fue posible efectuar el filtro correspondiente');
            throw error;
        }
    }
    /*Filtrar los materiales por nombre de usuario (x autor) */
    static async getMaterialsByUsername(username, limit) {
        try {
            const base = (0, firestore_1.collection)(firebase_1.db, this.collectionName);
            const q = (typeof limit === 'number' && limit > 0)
                ? (0, firestore_1.query)(base, (0, firestore_1.where)('autor' === username), (0, firestore_1.orderBy)('fechaOrigen', 'desc'), (0, firestore_1.limit)(limit)) : ;
            (0, firestore_1.query)(base, (0, firestore_1.where)('autor' === username), (0, firestore_1.orderBy)('fechaOrigen', 'desc'));
            const snap = await (0, firestore_1.getDocs)(q);
            return snap.docs.map(d => this.mapDocToMaterial(d));
        }
        catch (error) {
            console.error('[MaterialAdminService] getMaterialsByUsername:', error);
            throw error;
        }
    }
    /*4a) El día de Hoy(00:00:00 -> 23:59:59, hora local) */
    static async getMaterialsToday() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return this.getMaterialByDateRange(start, end);
    }
    /** 4b) 2 Días previos: Los días completos anteriores a Hoy(ayer y antier) */
    static async getMaterialLast2Days() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); //Inicio de hoy
        const end = new Date(todayStart.getTime() - 1); // fin de ayer
        const start = new Date(todayStart, getTime() - 2 * 24 * 60 * 60 * 1000); // inicio de los 7 dias
        return this.getMaterialByDateRange(start, end);
    }
    /*4c La semana pasada: 7 dias completos anteriores a hoy(excluye hoy)  */
    static async getMaterialsLastWeek() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const end = new Date(todayStart.getTime() - 1);
        const start = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        return this.getMaterialByDateRange(start, end);
    }
    // Forma de uso en el store, para iniciar y reactivar las variables reactivas y estado
    //  obtener todo
    todos = await MaterialAdminService.getAllStudentsMaterials();
}
/*  */ 
//# sourceMappingURL=MaterialAdmServProffesor.js.map