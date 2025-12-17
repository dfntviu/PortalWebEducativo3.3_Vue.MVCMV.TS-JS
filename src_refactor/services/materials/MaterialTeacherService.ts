/**
 * @service MaterialTeacherService
 * @description Gestión administrativa y moderación de materiales del PROFESOR
 * @extends MaterialBaseService
 * 
 * - Ver todos los Materiales
 * - Aprobar/Rechazar los Materiales
 * - Generar Estadistícas
 * */

import  { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy,
          serverTimestamp, type Timestamp} from 'firebase/firestore';
 import { MaterialBseService } from './MaterialBseService';
 import type {Material} from '@/types/indexInterface';

 interface MaterialStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deleted: number;
 }

 interface FilterOptions {
     status?: 'pending' | 'approved' | 'rejected';
      limit?: number;
    orderByField?: 'createdAt' | 'updateAt' | 'moderateAt';
 }



class MaterialStudentService extends MaterialBseService {
     /** ==============================
     *     METODOS DE LECTURA(PROFESOR)
     * ===============================*/
    /**
     * Obtiene todos los Materiales(incluye los estados) 
     * @param options - Opciones de Filtrado
     * */
    static async getAllMaterials(options?:FilterOptions): Promise<Material[]>{
        try{
            console.log(' [MS]📚 Obteniendo todos los Mats..');

            const constraints: any[] = where('deleted', '==', false);
                // Filtrar el estado si se especifica
            if(options?.status) {
                constraints.push(where('status', '==', options.status));
            }

            // Ordenar
             const orderField = options?.orderByField || 'createdAt';
              constraints.push(orderBy(orderField, 'desc'));

              // Limitar los resultados
              if (options?.limit) {
                 constraints.push(limit(options.limit));
              }

              const q = query(getMaterialsCollection(),...constraints);
              const snapshot = await getDocs(q);

              const materials = snapshot.docs.map(doc => ({
                 uid: doc.id,
                 ...doc.data()
              })) as Material;

               console.log(`[MaterialTeacherService] El metodo listo: ✅ ${materials.lenght} materiales obtenidos`); 
               return materials;
        }catch(error: any){
             console.log('[MatStudentServ] ❌ Error: ', error,' al listar el Total de Materiales');
        }
    }

    static async getMaterialsByStatus(status: 'pending' | 'approved'| 'reajected'): Promise<Material[]>{
        try{
            console.log(`[MaterialTeacherService]📋 Obteniendo Materiales ${status}...`);

            const qm = query(this.getMaterialsCollection(),
                 where('status', '==' , status),
                 where('deleted', '==' , false),
                 orderBy('createdAt', 'desc')
                );
            const snapshot = await getDocs(qm);
            const materials = snapshot.docs.map(doc =>({
                uid: doc.id,
                ...doc.data(),
            }));

            console.log(`[MaterialTeacherService] ✅ ${materials.lenght} materiales obtenidos` );
        }catch(error: any){
            console.error('[MatStudentServ] ❌ Error al obtener listado de Materiales', error);
             throw new Error(`Erro al obtener materiales: ${error.message}`);
        }
    }   

    /**
     * Obtiene los materiales Pendientes por Moderacion
     * */
     static async getPendingMaterials(): Promise<Material[]>{
          return this.getMaterialsByStatus('pending');
     }

     /**
      * Obtiene los materiales APROBADOS 
      * */
     static async getApprovedMaterials():Promise<Material[]>{
             return this.getMaterialsByStatus('approved');
     }  

     /**
      * Obtiene los materiales RECHAZADOS 
      * */
     static async geReajectedMaterials():Promise<Material[]>{
         return this.getMaterialsByStatus('reajected');
     }

     /**
      * Aprueba un Material
      * @param materialId - ID del material
      * @param moderationId - ID del profesor que aprueba
      * */
    static async approveMaterial(materialId: string, moderationId: string): Promise<void>{
        try{
            console.log(` [MaterialTeacherServ] Aprobado material: ${materialId}`);

                 const material = this.getMaterialById(materialId);

                 if (!materialId) {
                     throw new Error('El material NO fue Encontrado');
                 }

                 if (material.status === 'approved') {
                    throw new Error('El Material fue Aprobado');
                 }

                      const db = getFirestore();
                  const docRef = doc(db, this.COLLECTION, materialId);

                  await updateDoc(docRef,{
                    status: 'approved',
                    moderationId,
                    moderateAt: serverTimestamp,
                    updateAt: serverTimestamp,
                  });

                   console.log('[MaterialTeacherService] ✅ Material Aprobado exitosamente');
        }catch(error: any){
            console.error(`[MaterialTeacherService] ❌Error al probar`, error);
             throw error;
        } 
    }
    /**
      * Rechaza un Material
      * @param materiaId - ID del Material
      * @param maoderatorId - ID del profesor que rechaza
      * @param reason - Razón del rechazo
      * */
    static async rejectMaterial(materialId: string, moderationId: string, reason:string): Promise<void>{
        try{
            console.log(`MaterialTechrService ❌ El Material ha sido RECHAZADO: ${materialId}`);

            if (!reason?.trim()) {
                throw new Error('Debes proporcionar una razón para el rechazo');
            }

                    const material = this.getMaterialById(materialId);

                if (!material) {
                    throw new Error('El material no fue encontrado');
                }
                
                const db = getFirestore();
                const docReference = doc(db, this.COLLECTION, materialId);

                  updateDoc(docRef,{
                    status: 'rejected'
                    moderationId,
                    reajctionReason: reason,
                    moderateAt: serverTimestamp(),
                    updateAt: serverTimestamp()

                  });

                  console.log('[MaterialTeacherService] Material fue rechazado');
        }catch(error: any){
            console.log('[MaterialTeacherService] Error al rechazar:', error );
             throw error;
        }
    }

    /**
     * Revierte la desición de moderacion(vuelve a pending)
     * @param materialId - ID del material
     * @param moderatorId - Id del Profesor
     *  */
    static async revertModeration(materialId: string, moderationId: string): Promise<void>{
        try{
            console.log(`[MaterialTeacherService] 🔄️ Revirtiendo la moderación: ${materialId} `);

            const db = getFirestore();
            const docRef = doc(db, this.COLLECTION, materialId);

            await updateDoc(docRef,{
                status: 'pending',
                moderationId,
                reajectionReason: null,
                moderateAt: null,
                updateAt: serverTimestamp(),
            });

            console.log('[MaterialTeacherService] ✅ Moderación Revertida');

        }catch(error: any){
            console.error('[MaterialTeacherService]❌ Error al revertir: ',error);
             throw error;
        }
    }

    /** ==============================================
     *       ESTADISTÍCOS PARA ADMIN DE PROFESOR
     *  ============================================== */   

    static async getStatistics(): Promise<MaterialStats> {
        try{
            console.log('[MaterialTeacherService] 📊 Obteniendo Estdistícas...');

            const [
              allSnapshot,
              pendingSnapshot,
              approvedSnapshot,
              rejectedSnapshot,
              deletedSnapshot
            ] = await Promise.all([
                getDocs(query(getMaterialsCollection())),
                getDocs(query(getMaterialsCollection(), where('status', '==', 'pending' ))),
                getDocs(query(getMaterialsCollection(), where('status', '==', 'approved' ))),
                getDocs(query(getMaterialsCollection(), where('status', '==', 'rejected' ))),
                getDocs(query(getMaterialsCollection(), where('status', '==', true ))),
            ]);

            const stats: MaterialStats = {
                total: allSnapshot.size,
                pending: pendingSnapshot.size,
                approved: approvedSnapshot.size,
                rejected: rejectedSnapshot.size,
                deleted: deletedSnapshot.size
            };

            console.log('[MaterialTeacherService] Estadistícas: ',stats);

            return stats;
        }catch(error: any){
              console.error('[MaterialTeachService] ❌ Error en Estadistícas: ',error);
             throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }

    static async getMaterialsToday(): Promise<Material[]> {
        try{
            console.log('[MaterialTeacherService] 📅 Obteniendo los Materiales del Día de Hoy...');

            const today = new Date();
            today.setHours(0,0,0,0);

            const qt = query(
                 this.getMaterialsCollection(),
                 where('deleted', '==', false),
                 where('createdAt', '>=', today),
                  orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(qt);
            const materials = snapshot.docs.map(doc=> ({
                uid: doc.id,
                ...doc.data()
            })) as Material[];

            return materials;
        }catch(error:any){
            console.error('[MatService] Error',error, ' detectado..');
            throw new Error(`Error al obtener las estadisticas de Hoy: ${error.message}`);
        }
    }

    static async getMaterialsLastWeek(): Promise<Material[]>{
        try{
            console.log('[MaterialTchrService] Se están obteniendo los Materiales de la Últ. semana.');

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
            oneWeekAgo.setHours(0,0,0,0);

            const qlw = query(
                this.getMaterialsCollection(),
                    where('deleted', '==', false)
                    where('createdAt', '>=', oneWeekAgo),
                    orderBy('createdAt', 'desc')                
                );
            
            const snapshot  = await getDocs(qlw);
            const materials =  snapshot.docs.map( doc => ({
                                uid: doc.id,
                                ...doc.data()
                           })) as Material[];

              console.log('[MatrTeacherService] Error al filtrar esta categoria de Materiales..');

              return materials;
        }catch(error: any){
            console.log("[MaterialTeacherService] ❌ Error al Filtrar: 'La semana pasada' ",error);
             throw new Error(`Error al obtener materiales de la última Semana`);
        }
    }

    static async hardDeleteMaterial(materialId: string, moderationId: string): Promise<void>{
        try{
            console.warn(`[MaterialTeacherService] ⚠️ Eliminación LÓGICA: ${materialId} `);

            if (!material) {
                throw new Error('El material NO fue Encontrado');
            }

            if(!materialId.deleted){
                throw new Error('Primero debes de realizar un soft delete');
            }

             const db = getFirestore();
             const docRef = doc(db,this.COLLECTION, materialId);

              await deleteDoc(docRef);

              console.log('[MatrTeacherService] ✅ Material eliminado PERMANENTEMENTE');
        }catch(error: any){
            console.log('[MaterialTeacherService] ❌ En la Elimianción LÓGICA');
             throw error;
        }
    }
}