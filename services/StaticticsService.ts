/**
 * @service ServicioDeEstadisticas
 * @description Servicio unficado de Estadistícas para todos los roles
 *  CARACTERISTÍCAS
 *   - Estadistícas de Profesores
 *   - Estadistícas de Alumno
 *   - Estadistícas de Admin
 *  @created 26 de Nov. del 2025
 * */
  import {collection, getDocs,query, where, Timestamp} from 'firebase/firestore';
  import {initializeFirebaseStorage} from '@/config/initializeFirebaseStorage.js';
    import type {Material} from  '@/types/interfaces.index';

    const {db} initializeFirebaseStorage();
    //  ============================================
    //  TIPOS
    // ============================================
        interface TeacherStatics {
      	  totalMaterials: number; 
      	  approvedMaterials: number;
      	  reajectedMaterials: number;
      	  pendingReview: number;
          inReview: number;
      	  reajectedCommentsCount: number;
        }

        interface StudentStactics {
       	  totalMaterials: number; 
       	   approved:number;
       	   reajected: number;
       	   pending: number;
       	   approvalRate: number;
        }

        interface DailySummary {
       	  date: string;
          activitiesCount: number;
       	  activities: Array<{
       	  	 studentId: string;
       	  	 materialType: string;
       	  	 timestamp: Date;
       	  	 status: string;
       	  	 message: string;
       	  }>;
        }

        interface AdminStatictics {
        	totalStudents: number;
        	totalTeachers: number;
        	totalMaterials: number;
        	materialsApproved: number;
        	materialsRejected: number;
        	materialsPending: number;
        }



  export  class StaticsService {
     	  private static readonly MATERIAL_COLLECTION = 'materials';
     	  private static readonly STUDENT_COLLECTION = 'students';
     	  private static readonly TEACHERS_COLLECTION = 'teachers';
     	  private static readonly NOTIFICATION_PROFESSOR = 'notificationsProfessor';

     	 // ============================================
     	  //  ESTADISTÍCAS DE PROFESORES
     	  // ============================================
     	  /**
     	   * Obtiene Estadistícas completas para profesores
     	   * */
     	 static async getTeacherStactics(teacherId?:string): Promise<TeacherStatics> {
     	  	 try{
     	  	 	console.log('[StaticsService]📊 Obteniendo Estadistícas de profesor..');

     	  	 	const materialsRef = collection(db,this.MATERIAL_COLLECTION);

     	  	 	// Queries paralelas para eficiencia
     	  	 	const [
     	  	 		allMaterials,
     	  	 		approved,
     	  	 		reajected,
     	  	 		pending,
     	  	 		inReview
     	  	 	] = await Promise.all([
 	     	  	 		  getDocs(query(materialsRef)),
 	     	  	 		   getDocs(query(materialsRef), where('status', '==','approved')),
 	     	  	 		   getDocs(query(materialsRef), where('status', '==', 'reacted')),
 	     	  	 		   getDocs(query(materialsRef), where('status', '==', 'pending')),
 	     	  	 		   getDocs(query(materialsRef), where('status', '==', 'in_review')),
     	  	 	    ]);

     	  	 	// Cotejar los comentarios en materiales rechazados
     	  	 	  let reajectedCommentsCount = 0;

     	  	 	  reajected.docs.forEach(doc => {
     	  	 	  	  const data = doc.data();
     	  	 	  	   if (data.comentarios) {
     	  	 	  	   	   reajectedCommentsCount++;
     	  	 	  	   }
     	  	 	  });

     	  	 	  const stats: TeacherStatics = {
     	  	 	  	  totalMaterials: allMaterials.size,
     	  	 	  	  approvedMaterials: approved.size,
     	  	 	  	  reajectedMaterials: reajected.size,
     	  	 	  	  pendigReview: inReview.size,
     	  	 	  	  reajectedCommentsCount
     	  	 	  };

     	  	 	  console.log('[StaticsService]📊 Estadistícas del Profesor: ',stats);
     	  	 	   return stats;
     	  	}catch(error: any){
     	  		console.error('[StaticsService]❌ Error en las Estadistícas del Profesor');
     	  		 throw new Error(`Error al Obtener Estadistícas:  ${error.message}`);
     	  	}
     	}
     	/**
     	 * Total de Materiales */
     	static async getTotalDeMateriales(): Promise<number> {
     		try{
     			const snapshot = await getDocs(collection(db, this.MATERIAL_COLLECTION));
     			 return snapshot.size;
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error al Obtener el Total Materiales');
     			 throw error;
     		}
     	}

     	/**
     	 * Materiales Aprobados 
     	 *  **/
     	static async getApprovedMaterials(): Promise<number> {
     		try{
     			const q = query(collection(this.MATERIAL_COLLECTION),
     						    	where('status', '==', 'approved')
     					  );
     			 const snapshot =  await getDocs(q);
     			 return snapshot.size;
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error al obtener los Aprobados', error);
     			throw error;
     		}
     	}

     	/** **
     	 * Materiales Rechazados
     	 * ** */
     	static async getRejectedMaterials(): Promise<number> {
     		try{
     			const q = query(
     					collection(db, this. MATERIAL_COLLECTION),
     					where('status', '==', 'rejected')
     				);
     			   const snapshot = await getDocs(q);
     			     return snapshot.size;
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error en las los Mats. Rechazados',error);
     			 throw error;
     		}
     	}

     	static async getPendingReview(): Promise<number> {
     		try{
     			const q = query(
     					collection(db, this. MATERIAL_COLLECTION),
     					where('status', '==', 'pending')
     				);
     			   const snapshot = await getDocs(q);
     			     return snapshot.size;
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error en las los Mats. en Revisión',error;
     			 throw error;
     		}
     	}
      /**
       * Materiales en proceso de Revisión
       * */
      static async getInReviewMaterials(): Promise <number> {
        try{
            const q = query(
              collection(db, this. MATERIAL_COLLECTION),
              where('status', '==', 'in_review')
              );
              const snapshot = await getDocs(q);
              return snapshot.size;
        }catch(error: any){
          console.error('[StaticsService]❌ Error al obtener al revisión de materiales',error);
          throw err;
        }
      }

     	/**
     	 * Comentarios de Materiales Rechazados
     	 * */
     	static async getReactedCommentsCount(): Promise<number> {
     		try{
     			const q = query(
     					collection(db, this. MATERIAL_COLLECTION),
     					where('status', '==', 'rejected')
     				);
     			   const snapshot = await getDocs(q);

     			   	let count = 0;
     			   	 snapshot.docs.forEach(doc => {
     			   	 	 const data = doc.data();
     			   	 	   if (data.comentarioRechazo || data.rejectionReason) {
     			   	 	   	  count++;
     			   	 	   }

     			   	 	   return count;
     			   	 });
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error en las los Mats. Rechazados');
     			 throw error;
     		}
     	}

    	// ============================================
    	//	    ESTADISTIC DE ALUMNOS
    	// ============================================
     	 
     	 /**
     	   * Obtiene Estadistícas de materiales de Alumnos	
     	   * */
     	static async getStudentStadistics(studentId: string):Promise<StudentStactics>{
     		 try{
     		      	 console.log('[StaticsService]: 📊Obteniendo Estadistícas del Alumno');
     		 
     		      	 const materialRef = collection(db, this.MATERIAL_COLLECTION);
     		 
 		      		 const  [allMaterials, approved, reajected, pending] = await Promise.all([
 		      		 	 getDocs(query(materialsRef, where('status', '==', 'approved'))),
 		  	     	  	 		   getDocs(query(materialsRef, where('autorId', '==',studentId), where('status', '==', 'approved'))),
 		  	     	  	 		   getDocs(query(materialsRef, where('autorId', '==',studentId),where('status', '==', 'reacted'))),
 		  	     	  	 		   getDocs(query(materialsRef, where('autorId', '==',studentId),where('status', '==', 'pending'))),
 		      		 ]);
     		 
		      		 		const total = allMaterials.size;
		      		 		const approvedCount = approved.size;
		      		 		const approvalRate = total > 0 ? (approvedCount / total) * 100 : 0;
		 
		      		 		const stats: StudentStactics = {
		      		 			totalMaterials: total,
		      		 			approved:  approvedCount,
		      		 			reajected: reajected.size,
		      		 			pending: pending.size,
		      		 			approvalRate: Math.round(aprovalRate*100)/100;
		      		 		};
		      		 		 console.log('[StaticsService]: ✅ Estadistícas del Alumno',stats);
		      		 		 return stats;
     		}catch(error: any){
     			console.error('[StaticsService]❌ Error en Estadistícas del Alumno',error);
     			 throw new Error(`Error al obtener estadistícas del alumno: ${error.message}`);
     		}
     	}

     	/**
     	 * Obtiene las Estadistícas globales del Sistemas*/
     	 static async getAdminStatictics(): Promise<AdminStatictics>{
     	 	try{
     	 		console.log('[StaticsService] 📊 Obteniendo Estadistícas de admin...');

     	 		const [
     	 			studentsSnap,
     	 			teachersSnap,
     	 			materialSnap,
     	 			approvedSnap,
     	 			pendingSnap,

     	 		] = await Promise.all([
     	 				getDocs(collection(db,this.STUDENT_COLLECTION)),
     	 				getDocs(collection(db, this.TEACHERS_COLLECTION)),
     	 				getDocs(collection(db,this.MATERIAL_COLLECTION))
     	 				getDocs(query(collection(db, this.MATERIAL_COLLECTION), where('status', '==', 'approved'))),
     	 				getDocs(query(collection(db,this.MATERIAL_COLLECTION), where('status', '==', 'reacted'))),
     	 				getDocs(query(collection(db, this.MATERIAL_COLLECTION), where('status', '==', 'pending')))

     	 			]);
     	 		  console.log('[StaticticsService] ✅ Estadistícasa del Administrador admin:', stats);
     	 		  	return stats;
     	 	}catch(error: any){
     	 		console.error('[StaticsService]:❌ Error en Estadistícas admin: ',error);
     	 		throw new Error(`Error al obtener  Estadistícas globales: ${error.message}`);
     	 	}
     	 }
     	/**
     	 * Tasa de aprobacion de Materiales del Alumno: (Por si acaso)*/

     	// ============================================
     	// 		 ESTADISTÍCAS DE ADMIN
     	// ============================================
     	static async getStudentApprovalRate(studentId: string): Promise<number>{
     	 	 try{
     	 	 	 const stats =  await getStudentStadistics(studentId);
     	 	 	 return stats.approvalRate;
     	 	 }catch(error: asyn){
     	 	 	 console.error('[StaticsService]❌ Error al calcular la tasa: ',error);
     	 	 	  throw error;
     	 	 }
     	}
          /** 
           *Total de Estudiantes registrados */
     	static async getTotalStudents():Promise<number>{
     		try{
     			const snapshot = await getDocs(collection(db,this.STUDENT_COLLECTION));
     			return snapshot.size;
     		}catch(error: any){
     			console.errror('[StatisticsService] Error al obtner total estudiantes: ', error);
     			 throw error;
     		}
     	}

     	static async getTotalTeachers(): Promise<number> {
     		try{
     			const snapshot = await getDocs(collection(db, this.TEACHERS_COLLECTION))
     			return snapshot.size;
     		}catch(error: any){
     			console.log('[StaticsService]: Error al obtener el total de Estudiantes: ',error); 
     			 throw error;
     		}
     	}

     	// ============================================
     	//   RESUMENES TEMPORALES DEL DÍA
     	// ============================================

     	static async getDailySummary(professorId: string): Promise<DailySummary>{
     		try{
     			const now = new Date();
     			const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0,0,0);
     			const endtOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59);

     			const q = query(
     				collection(db, this.NOTIFICATION_PROFESSOR),
     				where('professorId', '==', professorId),
     				where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
     				where('timestamp', '<=', Timestamp.fromDate(endtOfDay)),
     			);

     			const snapshot = await getDocs(q);
     			const activities = snapshot.docs.map(doc => {
     				const data = doc.data();
     				  return {
     				  	  studentId: data. alumnoId || 'N/A',
     				  	  materialType: data.tipoMaterial || 'Material',
     				  	  timestamp: data.timestamp?. toDate() || new Date(), 
     				  	  status:data.estado || 'pending',
     				  	  message: data.mensaje || ''
     				  };
     			});

     			return {
     				date: now.toISOString().split('T')[0],
     				activitiesCount:activities.length,
     				activities
     			};

     		}catch(error: any){
     			 console.error('[StaticticsService] Error al obtener resumen diario: ', error);
     			  throw error;
     		}
     	}

     	/**
     	 * Obtiene Resumen Semestral (últimos 6 meses) 
     	 * */
     	static async getSemesterSummary(professorId: string): Promise<DailySummary>{
     	 	try{
     	 		const now = new Date();
     	 		const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth()-6,1);
     	 		const endOfPeriod = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59);

     	 		const q = query(
     	 				collection('profesorId', '==',professorId),
     	 				where('timeStamp', '<=', Timestamp.fromDate(sixMonthsAgo)),
     	 				where('timestamp', '>=', Timestamp.fromDate(endOfPeriod))
     	 			);

     	 	     const  snapshot = await getDocs(q);

     	 	    const activities = snapshot.docs.map(doc => {
     	 	  	   const data = doc.data(); 
     	 	  	    return {
     	 	  	   	  studentId:data.alumnoId || 'N/A',
     	 	  	   	   materialType: data.tipoMaterial || 'Material',
     	 	  	   	   timestamp:data.estado || 'pending',
     	 	  	   	   message: data.message || ''
     	 	  	    };
     	 	    });

     	 	    return {
     	 	    	date: `${sixMonthsAgo.toLocaleDateString()} - ${endOfPeriod.toLocaleDateString()}`,
     	 	    	activitiesCount: activities.length,
     	 	    	activities
     	 	    };
     		} catch(error: any){
     			console.error(`[StaticsService]  Errro al Obtener el resumen Semestral:', ${error}`);
     			throw error;
     		}

     	}
    }