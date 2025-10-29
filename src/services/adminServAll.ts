	import { ProfileStudentService } from '@/Services/ProfileStudentServ.ts';
	import { MaterialsDeployService } from '@/Services/MaterialAdmServAlumno.ts';  
	 import type Profile from '@/types/interf.index.ts';
	 /*El Viernes pasado*/
  export class adminAllServices {
  	static todos_alumnos = 'adm_alumnos_register';
  	
  	static async  adminAlumnos(nombre): Promise <Profile[]>{
     	try{
     	    const alumnos = ProfileStudentService.getStudentById()
     	
     	console.log('============================================');
     	console.log(' Listado de Alumnos ya Registrados Previamente');
     	console.log('============================================');
 	
	     	alumnos.forEach(alum => {
	     		console.log(`- ${alum.nombre} - `);
	     	});
     	  		  return alumnos;
     	}catch(error){
     		console.error('Error al Listar a todos los Alumnos Registrados');
     		 throw error;
     	}
  	}

  	static async adminMaterials():Promise<any>{
 	    try{
			const materiales = MaterialsDeployService.getAllMaterialsEduc()
 	        materiales.forEach((mat,idx)=>{
 	         console.log('Material Nombre: ', mat.titulo);
 	        }); 
 	       		 return materiales
 	    }catch(error){
 	    	console.error('Error obtenido en materiales');
 	    	 throw error;
 	    }
  	}

  	static async totalDeMateriales(material_id:string): Promise<void>{
  		try{
  		  	  const materiales =	 MaterialDeployService.getAllMaterialsEduc();
  		 	const encontrados = materiales.filter(mat => mat.id === material_id);
  		 	 console.log(`El Total de Materiales con ID ${encontrados.length}`);
  		}catch(error){
  			console.error('Error al contar los materiales: ', error);
  			 throw error;
  		}
  	}
   
 
  	static async totalDeAlumnos(): Promise<void>{
  		try{
  		   		 const todos_sus_alumnos = this.getAllAlumnos();
  		   		   console.log('El total de Alumnos es: ',todos_alumnos.length);
  		    }catch(error){	
  		   	   throw error;
  		   	     console.error('Error en la longitud de Alumnos',error);
  		}
  	}

		static async getAllAlumnos():Promise<any> {
	     	try{
	           const snapshot = await getDocs(collection(db, this.todos_alumnos));
	             return snapshot.docs.map(doc =>( {id: doc.id, ...doc.data}));
	        }catch(error){
	            console.error('Error al obtener todos los Alumnos');
	             throw error;
	        }
	          return snapshot;
	    }

	    /*Nuevas -->  26/09/25 */
	     /** Estadisticas de uso de los materiales **/
	    static async getResumenDiario(profesorId: string){
	   	    try{
		   	  	 const fecha_actual = new Date();
		   	  	 const inicio_delDia = new Date(fecha_actual.setHours(0,0,0,0)); //Inicio del Dia
		   	  	 const    fin_delDia = new Date(fecha_actual.setHours(23,59,59,999)); //Fin del Dia

	   	  	    const hour_query = query(db, 'notificationsProfessor',
	   	  	       where('profesorId', '==', profesorId),
	   	  	       where('timestamp' , '>=', TimeStamp.fromDate(inicio_delDia)),
	   	  	       where('timestamp', '<=', TimeStamp.fromDate(fin_delDia))
	   	  	    );
	   	  	   const snapshot = await getDocs(hour_query);
	   	  	   const resumen = `Resumen de actividades del día`;

	   	  	 snapshot.docs.forEach(doc=> {
	   	  	 	const data = doc.data();
	   	  	 	   resumen += `\n - ${data.alumnoId} subio el Material '${data.tipoMaterial}'a las ${data.timestamp}. Estado: ${data.estado} 
	   	  	 	    	       Y comento que: ${data.mensaje}`
	   	  	 });

	   	  	   return resumen;

	   	    }catch(error){
	   	  	   console.error('[Servicio Notificaciones]: Error al obtener el resumen diario', error);
        		throw error;
	   	    }
	    }

	    	/*Este metodo se obtiene con el rango de fechas de los últimos 6 meses. y se cecesitamos obtener la fecha de inicio 
	    	  para hace 6 meses  a partir de la fecha actual*/
	    static async getResumenDiario(profesorId: string){
	   	    try{
	   	  	 const fecha_actual = new Date();
	   	  	 const inicio_delSemestre = new Date(fecha_actual.getFullYear(),fecha_actual.getMonth() -6,1); //Inicio del Dia
	   	  	 const    fin_delSemestre = new Date(fecha_actual.getFullYear(),fecha_actual.getMonth()0,23,59,29,999); //Fin del Dia

	   	  	    const query_chemestry = query(db, 'notificationsProfessor',
	   	  	       where('profesorId', '==', profesorId),
	   	  	       where('timestamp' , '>=', TimeStamp.fromDate(inicio_delSemestre)),
	   	  	       where('timestamp', '<=',  TimeStamp.fromDate(fin_delSemestre))
	   	  	    );
	   	  	  const snapshot = await getDocs(query_chemestry);
	   	  	  const resumen = `Resumen de actividades del Semestre [${inicio_delSemestre.toLocaleDateString()}] - [${fin_delSemestre.toLocaleDateString()}] `;

	   	  	    snapshot.docs.forEach(doc=> {
	   	  	 	    const data = doc.data();
	   	  	 	        resumen += `\n - ${data.alumnoId} subio el Material '${data.tipoMaterial}'a las ${data.timestamp.toDate().toLocaleDateString()}.
	   	  	 	   					El Estado es: ${data.estado} ○ El comentario es: ${data.mensaje}`;
	   	  	    });

	   	  	   return resumen;

	   	    }catch(error){
	   	  	   console.error('[Servicio Notificaciones]: Error al obtener el resumen Semestral', error);
        		throw error;
	   	    }
	    }
  		
 }  //#End de la Clase
	    /* Constructor actualizado, utilizado
	       async getAllStudents(): Promise<Profile[]> {
    		const snapshot = await getDocs(collection(db, 'adm_alumnos_register'));
   			 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Profile[];
  		}, */
