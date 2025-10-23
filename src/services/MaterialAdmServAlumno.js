"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialDeployService = void 0;
const firestore_1 = require("firebase/firestore");
const firestore_2 = require("firebase/firestore"); /*alm archivo en firebae **/
const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
const interf_index_js_1 = require("@/types/interf.index.js"); //script de interfaces
const { db } = (0, initializateFirebase_js_1.initializateFireabaseStg)();
/* Nuevas*/
/* const currentPage = ref(0); const allItems = ref([0]); const pageSize = 20; const nextPageToken = ref(false); */
/* El Viernes pasado*/
class MaterialDeployService {
    static collectionName = 'materials_loaded';
    /* ------------------------------------------------
      Obtener los Servicios de los materiales
      ------------------------------------------------
     */
    static async getAllMaterialsEduc() {
        try {
            const snapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, this.collectionName));
            return snapshot.docs.map(doc => { id: doc.id, ; }, ...firestore_1.doc.data);
        }
        finally { }
        ;
    }
    catch(error) {
        console.error('Error al obtener materiales');
        throw error;
    }
}
exports.MaterialDeployService = MaterialDeployService;
async;
getMaterialsEducById(id, string);
{
    try {
        docRef = (0, firestore_1.doc)(db, this.collectionName, id);
        docSnap = await getDoc(docRef); // no sera 1 condicional y obtener el snap
        if (!docSnap.exists())
            return null;
    }
    catch (error) {
        console.error('[MaterialDeployService]: Error al obtener material', error);
        throw error;
    }
}
async;
saveMaterialsEduc(material, { id: string, titulo: string, descripcion: string, archivoURL: string, fechaCreacion: Date, autor: string });
{
    try {
        // Obligar a llenar los campos escenciales
        if (material.titulo || material.descripcion) {
            throw new ('El titulo y la descripcion del material son obligatorios');
        }
        const docRef = material.id ? (0, firestore_1.doc)(db, this.collectionName, material.id) : (0, firestore_1.doc)((0, firestore_1.collection)(db, this.collectionName));
        const dataToSave = {
            titulo: material.titulo,
            descripcion_extract: material.descripcion,
            archivoURL: material.archivoURL || null,
            fechaCreacion: material.fechaCreacion || new Date(),
            autor: material.autor || null,
        };
        await (0, firestore_1.setDoc)(docRef, dataToSave, { merge: true });
    }
    catch (error) {
        console.error('[MaterialDeployService]: Error al guardar material', error);
        throw error;
    }
}
async;
saveMatererials(file_material, string);
{
    try {
        // P1 Obt. la instancia de Firebase Storage
        const storage = (0, firestore_2.getStorage)();
        // P2: Crear la referencia del archivo
        const filreRef = (0, firestore_2.ref)(storage, `file_dir/${file_material.name}`);
        // P3: Subir el archivo
        const snapshot = await (0, firestore_2.uploadBytes)(filreRef, file_material);
        // P4: Obtener la URL de descarga
        const fileURL = (0, firestore_2.getDownloadURL)(snapshot.ref); //ref es prop. del snaphot
        // 4.1 devolver la URL
        return fileURL;
    }
    catch (error) {
        console.error("Error al subir el archivo:", error);
        throw error;
    }
}
async;
deleteMaterialsEduc(material, string);
{
    try {
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(db, this.collectionName, id));
    }
    catch (error) {
        console.error('[MaterialDeployService]: Error al borrar el material', error);
        throw error;
    }
}
async;
siguientePagina(next = true);
{
    if (next) {
        if ((currentPage + 1) * pageSize < allItems.value.length) {
            currentPage.value++;
        }
        else {
            if (currentPage.value > 0) { //13 -12 //12 11 //9 -8
                currentPage.value--;
            }
        }
    }
    // Nueva logica: Devuelve el rango entre materiales del primero al siguiente
    const start = currentPage.value * pageSize;
    const end = start + pageSize;
    return allItems.value.slice(start, next);
    // return {next,currentPage,pageSize}
}
async;
cargarMaterialesPaginados();
{
    try {
        const materiales = this.getAllMaterialsEduc();
        allItems.value = materiales;
        nextPageToken.value = materiales.length > pageSize;
        return {
            materiales: allItems.value.slice(0, pageSize),
            total: allItems.value.length,
            hasNext: nextPageToken.value,
        };
    }
    catch (error) {
        console.error('[Desp. Servicio de Materiales Edu]: Error al cargar la Paginación de Materiales');
        throw error;
    }
    // return {materiales,allItems,nextPageToken}
}
//# sourceMappingURL=MaterialAdmServAlumno.js.map