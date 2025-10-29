 <script setup>
 	// {De Metodo-L4}
 	/*Componente de busqueda de materiales y alumnos, por el filtro nombre del alumno. Es utilizado para ambos
 	 roles, ademas de otras vistas en donde se requiera */
 	import {ProfileStudentService} from '@/services/ProfileStudentServ.ts';
 	import {MaterialDeployService} from '@/services/MaterialAdmServAlumno.ts';
 	import {ref, onMounted} from 'vue';
 	 // import {} from 'firebase/firestore'
 	 
 	 /* Definicion de constantes */
 	 	const     materiales = ref([]);
 	 const alumno_encontrado = ref(null);
 	 	   // const alumnos    = ref([]);

 	 /** P1 Definir la f(n) de busqueda de Materiales, por el nombre del Alumno **/
 	/*Nota: El servicio se consume en la vista, por lo tanto. Es quien manipula los estados y la reactividad*/
 	function studentSearchByName(nombre) {
 	 	try{

 	 		// P2.1 Obtener la referencia del ALUMNO -> LLamar al servicio
 	 		const alumno = ProfileStudentService.busquedaDelAlumnoPorNombre(nombre)

 	 		// P3 Validar que el alumno NO fue encontrado
 		    if(!alumno) {
 		 	  console.war(`Error en la busqueda: No se ENCONTRÓ el Alumno con el NOMBRE: ${nombre}`);
 		 	   return;
 		    }  
 		      //P3.1 Referenciar el que se busco, contra el que esta en firebase
 		     alumno_encontrado.value = alumno;

 		      /*Paso 4:  Traer los materiales asociados al alumno [Ejemp: Maria Estrella] y mostrarlos*/
 		     materiales.value = await MaterialDeployService.getMaterialsEducById(alumno.uuid);
 	 		 
		     // vinular los elementos de los materiales y guardarlos 
		     console.log('El Alumno: ', alumno_encontrado.value,  ' fue Encontrado');
		     console.log('Materiales del Alumno',materiales.value);
 	 	}catch(error){
 	 		  console.error('Error en la busqueda del Alumno', error);
 	 	}
 	}

 	onMounted(()=>{
 	    studentSearchByName('Daniel');
 	});
 	 	// return {alumno_encontrado, materiales};
 </script>