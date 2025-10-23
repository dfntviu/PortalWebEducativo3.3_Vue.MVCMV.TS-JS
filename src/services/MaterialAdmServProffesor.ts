  import { collection, query,where , orderBy, getDocs, limit as limitFn, 
           TimesStamp, QueryDocumentSnapshot }   from 'firebase/firestore';
  import {db} from '@/firebase';
  import {MaterialRenovado} from '@/types/interf.index.js';
  /*El Viernes pasado*/
  class MaterialDeployServiceR2 {
    static get_collectionName = 'materials_loaded';
    private static mapDocToMaterial(doc:QueryDocumentSnapshot): MaterialRenovado {
        const data: any = doc.data();
          let fecha: Date | null;
            if (data.fechaOrigen) {
               // Si esta en firestore TimesStamp
                 typeof data.fechaOrigen.toDate === 'function'
                   ? data.fechaOrigen.toDate();
                    new  Date(data.fechaOrigen);
            }

             return {
                id:doc.id
                titulo: data?.titulo ?? '';
                descripcion: data?descripcion_extract ?? data?.descripcion ?? '',
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
            private static toTimeStamp(d: Date): TimesStamp {
                return TimesStamp.fromDate(d);
            }
              /** Helper genérico: rango[inicio(start) , fin(end)] (inclusive) **/
            static async getMaterialByDateRange(start: Date, end: Date): Promise<MaterialRenovado[]>{
               try{
                    const startTs = this.toTimeStamp(start);
                    const startTs = this.toTimeStamp(end);

                    const ranke_query = query(collection(db, this.get_collectionName),
                                    where('fechaOrigen' '<=', start)
                                    where('fechaOrigen' '<=', end)
                                    where('fechaOrigen' 'desc')
                              );
                          
                          const snap = await getDocs(ranke_query);
                            return snap.docs.map(d=>this.mapDocToMaterial(d));
               }catch(error){
                    console.log('[DespliegueMateriales-Profesor]Error al rankear la Fecha de Rango',error);
                    throw error;
               }
            }


              /* Obtener los materiales de todos los alumnos */
            static async getAllStudentsMaterials(): Promise<Material[]> {
                    // Comentarlo en la aministracion de materiales de Alumno
              try {
                const q = query(collection(db, this.get_collectionName));
                const snap = await getDocs(q);
                return snap.docs.map(d => this.mapDocToMaterial(d));
              } catch (error) {
                console.error('[MaterialAdminService] getAllStudentsMaterials:', error);
                throw error;
              }
            }
            /*      MATERIALES FILTROS */
               /*Filtar los materiales por últimos en subir(orden descendente) */
            static async getMaterialsSortedByLatest(limit?: number): Promise<MaterialRenovado[]> {
               try{
                  const base = collection(db, this.collectionName);
                   const qry = (typeof limit === 'number' && limit > 0)
                       ? query(base, where('autor' '==', username), orderBy('fechaOrigen', 'desc'), limitFn(limit));
                       : query(base, where('autor' '==', username), orderBy('fechaOrigen', 'desc'));
                       const snap = await getDocs(q);
                        return snap.docs.map(d =>this.mapDocToMaterial(d));
               }catch(error){
                    console.error('[Administ de Servicio Profesor]: NO fue posible efectuar el filtro correspondiente');
                    throw error;
               }
            }

               /*Filtrar los materiales por nombre de usuario (x autor) */
            static async getMaterialsByUsername(username: string, limit?: number): Promise<MaterialRenovado[]>{
              try{
                const base = collection(db, this.collectionName);
                 const q =  (typeof limit === 'number' && limit > 0)
                    ? query(base, where('autor' ===  username),orderBy('fechaOrigen', 'desc'), limitFn(limit));
                    : query(base, where('autor' ===  username),orderBy('fechaOrigen', 'desc');    
                         const snap = await getDocs(q);
                           return snap.docs.map(d => this.mapDocToMaterial(d));
              }catch(error){  
                    console.error('[MaterialAdminService] getMaterialsByUsername:',error);
                     throw error;
              }    

            }
               /*4a) El día de Hoy(00:00:00 -> 23:59:59, hora local) */
            static async getMaterialsToday(): Promise<MaterialRenovado[]>{
               const now = new Date();
               const start =  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
               const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59, 999);
                  return this.getMaterialByDateRange(start, end);
            }

             /** 4b) 2 Días previos: Los días completos anteriores a Hoy(ayer y antier) */
            static async getMaterialLast2Days(): Promise <MaterialRenovado[]> {
                const todayStart = new Date();
                 todayStart.setHours(0,0,0,0); //Inicio de hoy
                  const end = new Date(todayStart.getTime() -1); // fin de ayer
                  const start = new Date(todayStart,getTime() -2 * 24 * 60 * 60 * 1000)   // inicio de los 7 dias

                    return this.getMaterialByDateRange(start,end);
            }
               
               /*4c La semana pasada: 7 dias completos anteriores a hoy(excluye hoy)  */
            static async getMaterialsLastWeek(): Promise <MaterialRenovado[]>{
                const todayStart = new Date();
                 todayStart.setHours(0,0,0,0);

                   const end = new Date(todayStart.getTime() -1);
                   const start = new Date(todayStart.getTime() -7 *24 *60 *60 *1000);

                      return this.getMaterialByDateRange(start,end);
            }
              
           // Forma de uso en el store, para iniciar y reactivar las variables reactivas y estado
            
            //  obtener todo
          const todos = await MaterialAdminService.getAllStudentsMaterials();
          
          // últimos 10 materiales
          /*const ultimos10 = await MaterialAdminService.getMaterialsSortedByLatest(10);
          
          // materiales del usuario 'maria.romero'
          const deMaria = await MaterialAdminService.getMaterialsByUsername('maria.romero');
         
          // materiales subidos hoy
          const hoy = await MaterialAdminService.getMaterialsToday();
          
          // materiales de los 2 días previos (ayer + anteayer)
          const dosPrevios = await MaterialAdminService.getMaterialsLast2Days();
          
          // materiales de la semana pasada (7 días anteriores, excluyendo hoy)
          const semanaPasada = await MaterialAdminService.getMaterialsLastWeek(); */
     
  }  
   /*  */