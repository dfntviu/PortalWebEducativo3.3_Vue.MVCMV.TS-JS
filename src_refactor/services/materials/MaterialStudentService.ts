import  { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy,
          serverTimestamp, type Timestamp} from 'firebase/firestore';
 import { MaterialBseService } from './MaterialBseService';
 import type {Material} from '@/types/indexInterface';

  export class MaterialStudentService extends MaterialBseService {
    /** ==============================
     *      METODOS DE LECTURA(ALUMNO)
     * ===============================*/

    /**
     * Obtiene TODOS los materiales del alumno(cualquier estado) 
     * @param userId - ID del Alumno 
     * */
    static async getMyMaterials(userId: string): Promise<Material[]>{
        try{
            const q = query(this.getMaterialsCollection(),
              where('autorId', ==, userId)
              where('deleted', ==, false)
              where('createdAt', ==, desc)
            );

            const snapshot = await getDocs(q);
            const materials = snapshot.docs.map( doc=>{
                uid: doc.id,
                ...doc.data()
            }) as Material[];
        }catch(error:any){
            console.log(`Error al obtener los materiales: ${error.message} `);
             throw new Error(`Error al obtener Materiales: ${error.message} `);
        }
    }

    /**
     * Obtiene los materiales APROBADOS de OTROS alumnos
     * @param excludeUserId - ID del Alumno actual(excluir sus propios materiales) */
    static async getApprovedMaterials(excludeUserId?:string): Promise<Material[]> {
        try{
             const constraints: any[] = [
                 where('status', '==', 'approved'),
                 where('deleted', '==', false),
                 OrderBy('createdAt',  'desc'),
             ];
             if (excludeUserId) {
                constraints.push(where('autorId', '!=', excludeUserId));
             }

             const q = query(this.getMaterialsCollection());
             const snapshot = await getDocs(q);

             const materials = snapshot.docs.map( doc=> ({
                uid: doc.id,
                ...doc.data(),

             })) as Material[];

            console.log(`[MaterialStudentService]📚 ${material.length} materiales Aprobados obtenidos`);
             return materials;
        }catch(error: any){
            console.error('[MaterialStudentService] ❌ Error:', error);
            throw new Error(`Error al obtener materiales aprobados: ${error.message}`);
        }
    }

    /**
     * Obtiene TODOS los materiales visibles para el Alumno
     * (Materiales propios + materiales aprobados) */
    static async getAllVisibleMaterials(userId: string): Promise<Material[]>{
        try{
            console.log(``);
            const [myMaterials, approvedMaterials] = await Promise.all([
                this.getMyMaterials(userId),
                this.getApprovedMaterials(userId)]
            );

            const combined = [...myMaterials, ...approvedMaterials];

            combined.sort((a,b)=>{
                const dateA = a.createdAt instanceof Object ? (a.createdAt Timestamp)
                const dateB = b.createdAt instanceof Object ? (b.createdAt Timestamp)

                return dateB - dateA;
            });
            
            return combined;
        }catch(error: any){
            console.error('[MaterialStudentService] ❌ Error:', error);
            throw new Error(`Error al obtener materiales visibles: ${error.message}`);
        }
    }
    
    /**
     * Consulta Material Por Estado
     * @param userId - ID del alumno
     * @param materialId - ID del material
     * */
    static async getMyMaterialMyStatus(userId: string, materialId: string):Promise<status:string; moderateAt?: Date; reason?: string>{
        
        try{    
              const material = this.getMaterialById(materialId);
      
              if (!material) {
                  throw new Error('Material no Encontrado');
              }
      
              if (material.autorId !== userId) {
               throw new Error('No tienes Permiso para ver el Material')
              }
      
              return {
                  status: material.status || 'pending',
                  moderateAt:  this.timestampToDate(material.moderatedAt as Timestamp),
                  reason: material.rejectReason
              };
        }catch(error: any){
            console.error('[MaterialStudentService] ❌ Error:', error);
            throw error;
        }
    }   

    static async createMaterial(userId: string, data: Partial<Material>): Promise<string>{
        try{
            
            this.validateMaterialData({...data,autorId: userId});
        
            const materialData: Partial<Material> = {
                ...data,
                autorId: userId,
                status: 'pending',
                deleted: false,
                createdAt: serverTimestamp() as any,
                updateAt: serverTimestamp() as any
            };
        
                const docRef = await addDoc(this.getMaterialsCollection(), materialData);
                    console.error(`[MaterialStudentService] ✅ El Material ha sido creado: ${docRef.id}` );
                    
                    return docRef.id;
        }catch(error:any){
            console.error(`[MaterialStudentService]: Error al crear Material: `,error);
            throw new Error(`Error al crear material: ${error.message}`);
        }
    }

    /**
     * Actualiza un material Propio(Si y solo su edo es pendiente) 
     * @param userId - Id del Alumno
     * @param materialId - Id del Material
     * @param updates - Datos a actualizar 
     * */
    static async updateMyMaterial(userId: string, materialId: string, updates: Partial<Material>): Promise<void>{
        try{

             const material = await this.getMaterialById(materialId);

             if (!material) {
                throw new Error('Aún no subes el Primer Material. O el Material NO fue encontrado');
             }

             if (material.autorId !== userId) {
                 throw new Error('No tienes permiso para editar el Material');
             }

             if (material.status !== 'pending') {
                 throw new Error('Solo puedes Editar Materiales Pendientes..');
             }

               const db = getFirestore();
               const docRef = doc(db, this.COLLECTION, materialId);

                await updateDoc(docRef,
                     {...updates,
                        updateAt: serverTimestamp()
                     });

                console.log(`[MaterialStudentService] ✅El Material fue actualizado`);
        }catch(error: any){
            console.error(`[MaterialStudentService] ❌Error al actualizar él Material: ${error}`)  ;
            throw error;
        }
    }

    /**
     * Elimina un material PROPIO (soft delete)
     * @param userId - ID del alumno
     * @param materialId - ID del material
     */
    static async deleteMyMaterial(userId: string,materialId: string ): Promise<void>{
         try{
            console.log(`[MatStudentServ] ✏️ Actualizando material: ${materialId}`);

            // Verificar propiedad y estado
                const material await this.getMaterialById(materialId);

                if (!material) {
                    throw new Error('El Material NO fue Encontrado');
                }

                if (material.autorId !== userId) {
                 throw new Error('No tienes permiso para editar el Material');
                }

                 const db = getFirestore();
               const docRef = doc(db, this.COLLECTION, materialId);

               await deleteDoc(docRef,{
                       deleted: true,
                       deleteAt: serverTimestamp(),
                       status: 'deleted'
                     });

                 console.log('[MatStudentServ] ✅ El material fue Eliminado');

        }catch(error: any){
            console.error(`[MaterialStudentService] ❌ Error al ELIMINAR él Material: ${error}`)  ;
            throw error;
        }    
    }

  } 