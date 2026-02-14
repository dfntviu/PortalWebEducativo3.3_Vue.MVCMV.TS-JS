/**
 * @service MateraialService
 * @description Servicio unificado para gestión de Materiales
 * @Proposito 
 * - CRUD de Materiales
 * - Filtrado por Roles y Estudiantes
 * - Validación de Permisos
 * 
 * REMPLAZA:
 * - MaterialAdmServAlumno
 * - MaterialAdmServProfessor
 * */
	import {  getFirestore,  doc,  setDoc, getDoc, 
      collection, query, where, orderBy,getDocs,
       updateDoc, deleteDoc,serverTimestamp, type Timestamp, startAfter, addDoc } from 'firebase/firestore';
     import type {Material} from '@/types/indexInterface.ts';
  
  class MaterialService {
  	// ============================================
  	// METODOS DE LECTURA
  	// ============================================
     
     /**
     * Obtiene materiales de roles según el rol de Usuario
     * @param userId - Datos del Perfil
     * @param role - Rol del Usuario
     * @param options - Opciones de Filtrado y paginacion
     */
  	 private static readonly COLLECTION_MT = 'materials';

  	static async getMaterialsByRole(userId: string, role: 'student'| 'teacher',
  		options?:{
  			 status?: 'pending' '| approved | reacted';
  			 limit?:  number,
  			 lastDoc?: DocumentSnapshot;
  		}):Promise<{materials: Material[], lastDoc: DocumentSnapshot| null}>{

  		try{
  			const db = getFirestore();
            const materialsRef = doc(db, collectionName, this.COLLECTION_MT);

            console.log(`[MaterialService] 📚 Obteniendo materiales para ${role}:`, userId);

            	 const constraints: QueryConstraint[] = [];

            	 // FILTRAR segun el rol
            	 if (role === 'student') {
            	 	 // Alumno sol vis.
            	 	  // 1. Sus propios materiales de cualq. state(est)
            	 	   // 2. Materiales aprobados por otros
            	 	constraints.push(where('autorId', '==', userId));
            	 } else if (role === 'teacher') {
            	 	// Profesor ve todos los materiales
            	 	// Opcionalmente filtrar el estado 
            	 		if (options?.status) {
            	 		    constraints.push(where('status', '==', options.status)):
            	 		}
            	 }

            	 // Ordenar por fecha (mas recientes primero)
            	 constraints.push(orderBy('createdAt','desc'));

            	 // Corrob. la paginacion
            	  if (options?.limit) {
            	  	 constraints.push(limit(options.limit));
            	  }

            	  // El material anterior
            	   if (options?.lastDoc) {
            	   	 	constraints.push(startAfter(options.lastDoc));
            	   }

            	   const q  = query(materialsRef, ...constraints);
            	   const sanpshot = await getDocs(q);

            	   const materials = sanpshot.docs.map(doc => ({
            	   	   uid: doc.id,
            	   	   ...doc.data(),
            	   })) as Material[];

            	   // Si el rol también nec. materiales otros
            	   if (role === 'student') {
            	   	  	const approvedQuery = query(		//query subconsulta SQL - No-SQL
            	   	  			materialsRef,
            	   	  			where('status', '==', 'approved'),
            	   	  			where('autorId', '==', userId),
            	   	  			  orderBy('autorId'),
            	   	  			  orderBy('createdAt', desc),
            	   	  	);

            	   	  	const approvedSnapshot = await getDocs(approvedQuery);
            	   	  	const approvedMaterials =  approvedSnapshot.docs.map(doc => ({
            	   	  		uid:doc.id,
            	   	  		...doc.data(),
            	   	  	})) as Material[];

            	   	  	// Cambiar y ordenar Materiales

            	   	  	const combined = [...materials, ...approvedMaterials];
            	   	  	combined.short((a,b) => {
            	   	  			const date_A  = a.createdAt?.toMillis() || 0,
							    const date_B =  b.createdAt?.toMillis()|| 0,
							    const date_C = date_A;
            	   	  	});

            	   	  	console.log(`[ProfileStudentService] ✅ ${materials.length} materiales obtenidos.`);

            	   	  	return {materials,
            	   	  	         lastDoc: sanpshot.docs[sanpshot.docs.length -1] || null
            	   	  	      };
            	    }
  			   }catch(error: any){
  			   	   console.error('[MaterialsService]❌ Error al obtener los materiales: ',error);
  			   	   	throw new Error(`Error al obtener materiales: ${error.message}`);
  			   }
  		} //F(n)

  		/**
  		 * Obtiene los Materiales con el ID especifíco 
  		 *  @param materialId - ID del material*/
  		static async getMaterialsById(materialId: string): Promise<Material| null> {
  			try{
  			   const db = getFirestore();
  			   const docReference = doc(db, this.COLLECTION_MT,materialId);

  			    	 console.log(`[MaterialService]🔎 Obteniendo el Material: `,materialId);

  			   const docSnap = await getDoc(docReference);
  			    
  			    if (docSnap.exists()) {
  			   		 console.log(`[MaterialService] ✅ El Material fue ENCONTRADO...`);
  			   		 	return {
  			   		 		uid: docSnap.id,
  			   		 		...docSnap.data(),
            	   	  	 } as Material;
  			    }
  			    console.log(`[MaterialService] ⚠️ El Material NO fue ENCONTRADO.`);

  			     return null;
  			}catch(error: any){
  				console.error('[MaterialService] ❌Error: ', error);
  				throw error;
  			}
  		}
  		/**
  		 * Obtiene los Materiales por Estado 
  		 *  @param status - Estado del material
  		 * @param limitCount - Limíte de Resultados*/
  		static async getMaterialsByStatus(status: 'pending'| 'approved'|'reacted', limitCount: number = 50): Promise<Material []>{
  			   
  			try{
	  			   const db = getFirestore();
	  			   const matReference = doc(db, this.COLLECTION_MT,materialId);
	
	  			   console.log(`[MaterialService] 📚Obtiene Materiales por ESTADO: ${status}`);
	
	  			   const qry = query(
	  			   		matReference,
	  			   		 where('status', '==', status),
	  			   		 orderBy('createdAt', '==', 'desc'),
	  			   		   limit(limitCount)
	  			   	);
	
	  			   		const snapshot = await getDocs(qry);
	
	  			     const materials = sanpshot.docs.map(doc => ({
	  			     	   uid: doc.id,
	            			doc.data(),
	  			     }))  as Material[];
	
	  			     return materials;
  			}catch(error: any){
  			  		console.log('[MaterialService] ❌ Error en el Status: ', error);
  			  			throw error;
  			}
  		}

  		// =============================
  		//	 METODOS DE ESCRITURA
  		// =============================
  		/** 
  		 * Crea un nuevo material
  		 * @param data - Datos del material
  		 * */
  		static async createMaterial(data: Partial<Material>): Promise<string> {
		    try{
			        const db = getFirestore();
  			   const matReference = doc(db, this.COLLECTION_MT,materialId);

  			   console.log('[MaterialService] 🗒️Creando un nuevo Material..');

  			   // Validar datos requeridos
  			   if (data.titulo || data.autorId) {
  			   	 	throw new Error('El título y el autor son requeridos');
  			   }

  			   // Preparar los datos
  			    const materialData = {
  			    	...data,
  			    	status:'pending',
  			    	createdAt: serverTimestamp(),
  			    	updatedAt: serverTimestamp(),
  			    };

  			    const docReference = await addDoc(matReference,materialData);
  			    console.log('[MaterialService] ✅ El Material ha sido creado: ', docReference.id);

  			    return docReference.id;
		    }catch(error: any){
		    	console.log('[MaterialService] ❌ Error al crear el Material: ', error);
  			  		throw new Error( `Error: al crear el Material:  ${error.message}`);
		    }
  		}

  		/**
  		 * Actualiza el Material existente
  		 * @param materialId - ID del material
  		 * @param updates  - Cmps a actualizar */
  		static async updatedMaterial(
  		 	          materialId: string,
  		 	          updates: Partial <Material>): Promise <void>{
  		 	try{
  		 	
  		 	  		const db = getFirestore();
  		 	  		const matReference = doc(db, this.COLLECTION_MT,materialId); 
  		 	
  		 	  			console.log('[MaterialService] ✏️ Actualizando el  Material..');
  		 	
	 	  			   await updateDoc(
	 	  			   		matReference,
	 	  			   	     ...updates,
	 	  			   	     updateAt: serverTimestamp().
	 	  			   );

  		 	}catch(error: any){
  		 			console.log('[MaterialService] ❌ Error al actualizar  Material: ', error);
  			  		throw new Error( `Error: al actualizar el Material:  ${error.message}`);
  		 	}
  		}

  			static async deleteMaterial(materialId: string):Promise <void>{
				try{
	  					const db = getFirestore();
	  		 	  		const matReference = doc(db, this.COLLECTION_MT,materialId); 
	
	  		 	  		console.log('[MaterialService] 🧹Eliminacion del Material.');
	
	  		 	  		await updateDoc(matReference, {status:'deleted' deleteAt: serverTimestamp()});
	
	  		 	  		console.log('[MaterialService] ✅ Material Eliminado.');
				 }catch(error: any){
				 	   console.log('[MaterialService] ❌ Error al Eliminar material: ', error);
  			  		  throw new Error( `Error: al Eliminar el Material:  ${error.message}`);
				}
  			}

  		static async hardDelMaterial(materialId: string):Promise <void>{
  				try{	
  				  					const db = getFirestore();
  				  		 	  		const matReference = doc(db, this.COLLECTION_MT,materialId); 
  				
  				  		 	  		console.warn('[MaterialService] 🗒️Eliminacion del Material Permanente..');
  				
  				  		 	  		await deleteDoc(matReference);
  				
  				  		 	  		console.log('[MaterialService] ✅ Material Eliminado PERMANENTEMENTE');
  				}catch(error: any){
  				  	console.log('[MaterialService] ❌ Error ',error);
  				  	throw error;
  				}
  		}
  		 // METODOS DEL ROLE-2
		/**
  		 * Aprueba el Material existente
  		 * @param materialId - ID del material
  		 * @param moderatorId  -ID del moderador */
  		static async approveMaterial(materialId: string, moderatorId: string): Promise<void> {
  		 	try{	
  				
  				  		 	  		console.warn('[MaterialService] 🗒️Eliminacion del Material Permanente..');
  				
  				  		 	  		await updateDoc(materialId, {
  				  		 	  			 status: 'aproved',
  				  		 	  			 moderatorId: moderatorId,
  				  		 	  			 moderateAt: serverTimestamp () as any,
  				  		 	  		});

  				  		 	  		console.log('[MaterialService] ✅ Material Aprobado');
  				}catch(error: any){
  					 console.error('[MaterialService] ❌ Error', error);
  					  throw error;
  				}
  		}

  		 /**
  		 * Rechazar el Material existente
  		 * @param materialId - ID del material
  		 * @param moderatorId  -ID del moderador 
  		 * @param reason- Razon del Rechazo*/
  		static async rejectMaterial(materialId: string, moderatorId: string, reason?: string): Promise<void> {
  		 	try{	
  				
  				  		 	  		console.warn('[MaterialService] 🗒️Eliminacion del Material Permanente..');
  				
  				  		 	  		await updateDoc(materialId, {
  				  		 	  			 status: 'reajted',
  				  		 	  			 moderatorId: moderatorId,
  				  		 	  			 moderateAt: serverTimestamp () as any,
  				  		 	  		});

  				  		 	  		console.log('[MaterialService] ✅ Material Rechazado');
  				}catch(error: any){
  					 console.error('[MaterialService] ❌ Error', error);
  					  throw error;
  				}
  		}

  		static async searchMaterials(searchTerm: string, userId: string, role: 'student'| 'teacher' ): Promise <Material[]>{
  		 	  try{
 	    		 	  // Obtener todos los materiales según el rol
 	              const { materials } = await this.getMaterialsByRole(userId, role);
 	              
 	              // Filtrar en memoria (no óptimo para grandes volúmenes)
 	              const searchLower = searchTerm.toLowerCase();
 	              const filtered = materials.filter(material => 
 	                  material.titulo?.toLowerCase().includes(searchLower) ||
 	                  material.description?.toLowerCase().includes(searchLower)
 	              );
 	              
 	              console.log(`[MaterialService] ✅ ${filtered.length} resultados encontrados`);
 	  
 	              return filtered;
  		 	   }catch(error:any){
  		 	   	 console.error(`[MaterialService] ❌Error en la Busqueda: `, error);
  		 	   	 throw error;
  		 	   }
  		}
  		 
  		 /**
  		 *Obtienen las Estadisticas
  		 * */
  		static async getStatistics(): Promise<{
	        total: number;
	        pending: number;
	        approved: number;
	        rejected: number;
    	}> {
	         try {
	            console.log('[MaterialService] 📊 Obteniendo estadísticas...');
	            
	            const db = getFirestore();
	            const materialsRef = collection(db, this.COLLECTION);
	            
	            // Obtener todas las estadísticas en paralelo
	            const [allSnapshot, pendingSnapshot, approvedSnapshot, rejectedSnapshot] = await Promise.all([
	                getDocs(query(materialsRef)),
	                getDocs(query(materialsRef, where('status', '==', 'pending'))),
	                getDocs(query(materialsRef, where('status', '==', 'approved'))),
	                getDocs(query(materialsRef, where('status', '==', 'rejected'))),
	            ]);
	            
	            const stats = {
	                total: allSnapshot.size,
	                pending: pendingSnapshot.size,
	                approved: approvedSnapshot.size,
	                rejected: rejectedSnapshot.size,
	            };
	            
	            console.log('[MaterialService] ✅ Estadísticas:', stats);
	            
	            return stats;
	            
	        } catch (error: any) {
	            console.error('[MaterialService] ❌ Error en estadísticas:', error);
	            throw error;
	        }
      }

        	// Actualizacion de Metodos p/fetch en MaterialService.unify
      static async getMaterialsSortedByLatest(): Promise<Material>{
	      try {
	          console.log('[MaterialService] Obteniendo materiales ordenados por fecha...');

	         const q = query(
	            this.getMaterialsCollection(),
	            where('deleted', '==', false),
	            orderBy('fechaOrigen', 'desc'),
	            limit(50)
	         );

	        const snapshot = await getDocs(q);
	         const materials = snapshot.docs.map(doc => ({
	            uid: doc.id,
	            ...doc.data()
	         } as Material));

	        console.log(`[MaterialService] ${materials.length} materiales más recientes obtenidos`);
	         return materials;

	      } catch (error) {
	         console.error('[MaterialService] Error al obtener materiales recientes:', error);
	         throw new Error('Error al obtener materiales ordenados');
	      }
      }

      /**
       * Obt materiales por nombre de Usuario **/
      static async getMaterialsByUsername(username?: string):Promise<Material[]>{
		      try {
		        console.log('[MaterialService] Obteniendo materiales por usuario...');

		        let q;

		        if (username) {
		            q = query(
		                this.getMaterialsCollection(),
		                where('deleted', '==', false),
		                where('autorNombre', '==', username),
		                orderBy('fechaOrigen', 'desc')
		            );
		        } else {
		            q = query(
		                this.getMaterialsCollection(),
		                where('deleted', '==', false),
		                orderBy('autorNombre'),
		                orderBy('fechaOrigen', 'desc')
		            );
		        }

		         const snapshot = await getDocs(q);
		         const materials = snapshot.docs.map(doc => ({
		            uid: doc.id,
		            ...doc.data()
		         } as Material));

		        console.log(`[MaterialService] ${materials.length} materiales obtenidos por usuario`);
		        return materials;

		   }catch (error) {
		        console.error('[MaterialService] Error al obtener materiales por usuario:', error);
		        throw new Error('Error al obtener materiales por usuario');
		   }
      }
      /**
       * Obtiene los Materiales de Hoy
       * */
      static async getMaterialsToday():Promise<Material[]>{
      	try{
      		 console.log('[MaterialService] Obteniendo materiales de hoy...');

        		const today = new Date();
        	    today.setHours(0, 0, 0, 0);

	         const q = query(
	            this.getMaterialsCollection(),
	            where('deleted', '==', false),
	            where('fechaOrigen', '>=', today),
	            orderBy('fechaOrigen', 'desc')
	         );

	        const snapshot = await getDocs(q);
	         const materials = snapshot.docs.map(doc => ({
	            uid: doc.id,
	            ...doc.data()
	         } as Material));

           console.log(`[MaterialService] ${materials.length} materiales de hoy obtenidos`);
             return materials;
      	}catch(error: any){
      		  console.error('[MaterialService] Error al obtener materiales de hoy:', error);
        			throw new Error('Error al obtener materiales de hoy');
      	}
      }

      static async getMaterialsLast2Days(): Promise<Material[] >{
      	try{
      		console.log('[MaterialService] Obteniendo materiales de últimos 2 días...');

        		const twoDaysAgo = new Date();
	        	 	twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
	        	 	twoDaysAgo.setHours(0, 0, 0, 0);

	         const q = query(
	            this.getMaterialsCollection(),
	            where('deleted', '==', false),
	            where('fechaOrigen', '>=', twoDaysAgo),
	            orderBy('fechaOrigen', 'desc')
	         );

             const snapshot = await getDocs(q);
	         const materials = snapshot.docs.map(doc => ({
	            uid: doc.id,
	            ...doc.data()
	         } as Material));

        		console.log(`[MaterialService] ${materials.length} materiales de últimos 2 días obtenidos`);
          return materials;
      	}catch(error){
      		 console.error(` [MaterialService] Error al obtener los materiales de últimos 2 días` );
      		throw new Error('Error al obtener materiales de últimos 2 días');
      	}
      }

      static async getMaterialsLastWeek(): Promise<Material[]>{
      	try{
      		console.log('[MaterialService] Obteniendo materiales de última semana...');

	        const oneWeekAgo = new Date();
	        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
	        oneWeekAgo.setHours(0, 0, 0, 0);

	         const q = query(
	            this.getMaterialsCollection(),
	            where('deleted', '==', false),
	            where('fechaOrigen', '>=', oneWeekAgo),
	            orderBy('fechaOrigen', 'desc')
	         );

	        const snapshot = await getDocs(q);
	         const materials = snapshot.docs.map(doc => ({
	            uid: doc.id,
	             ...doc.data()
	         } as Material));

	        console.log(`[MaterialService] ${materials.length} materiales de última semana obtenidos`);
	        return materials;
      	}catch(error){
      		 console.error('[MaterialService] Error al obtener materiales de última semana:', error);
        		  throw new Error('Error al obtener materiales de última semana');
      	}
      }
      static async getAllMaterials(): Promise<Material[]>{
      	/*try{

      	}catch(){

      	}*/
      }
   }  //##Clase##
   /*IMPORTANTE: A Reconsiderar los metodos de materiales no parecen simetricos. Se Considera reevaluar el
   analisis. --> 'Para estos casos, el caso idoneo es aplicar Herencia'*/