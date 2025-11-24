<template>
	<section class="catalogo-container">
		<div class="vista-previa">
			<h2>Catálogo Individual del Alumno</h2>
			  <h3>Bienvenido: {{alumno?.nombre}} (UID: {{alumno?.uid}}) </h3>
		</div>

		<div class="tabla-contenedor">
			<table class="table_alumnos">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Apellido</th>
						<th>Id del Material</th>
						<th>Nombre del Material</th>
						<th>Fecha de Subida</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="mat in materialesAlumno" :key="mat.id_material">
						<td>{alumno?.nombre} </td>
						<td>{alumno?.apellido} </td>
						<td>{mat.id_material} </td>
						<td>{mat.nombre_material} </td>
						<td>{mat.fechaSubida} </td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
  <!-- Logica escrita en la Fecha: [08/Oct/2025] -->
  <script setup lang="ts">
  	// Instalar alguna de las  dependencias mostradas
  	// npm install ts-loader vue-loader --save-dev
  	// npm install ts-loader vue-loader@next typescript --save-dev (mas completo)
  	// SPA ->template+TS+CSS -> third parameter, the only arg is a guardar config

 	   // Definicion nativa
 	 import {ref,onMounted} from 'vue';
 	  // Definicion de states
 	 import { useProfileStore }  from '@/stores/profileStore.rules.arch.ts';
 	 import { useMaterialStore}  from '@/stores/materialStore.ts';
 	 import { useAuthStore }     from '@/stores/authStore2.ts';  
 	 // import {materialsValidations} from '@/utils/validationsMaterial s.js' //*

 	  /* Definicion de states */
 	 const storeMaterial = useMaterialStore();
 	 const     storeAuth = useAuthStore();
 	 const  storeProfile = useProfileStore();

 	  /* Definicion de varibales reactivas */
 	 const alumno = ref<any>(null);
 	 const materialesAlumno = ref<any[]>([]);

 	 /* Def. de la funcion Principal */
 	  async function verMaterialPorAlumno(uid: string) {
 	 	  try{
 	 		   // 1. Obtener los materiales del alumno
 	 			const materiales = await storeMaterial.obtenerMaterialPorId(uid);
 	 		    if (!materiales || materiales.length === 0) {
 	 		    	console.warn('El Alumno no tiene materiales subidos.');
 	 		    	 return;
 	 		    }

 	 		     // 2. Verificar la autentificación	
 	 		  if (storeAuth.uid !== uid) {
 	 		    	console.error('El usuario autenticado no coincide con el material SOLICITADO');
 	 		    	 return;
 	 		  }

 	 		    // 3. Asignar los materiales al Alumno
 	 		    materialesAlumno.value = materiales;
 	 		    alumno.value = await storeProfile.fetchProfiles(uid);

 	 		    // 4. Advertir al Usuario: Alumno del error
 	 		    console.log(`✅ Materiales cargados del Alumno: ${uid}`, materiales);
 	 	  }catch(error: any){
 	 	   console.log('Error al obtener los materiales PDF del Alumno');
 	 	}
 	}
 	 /* Ciclo de vida de Montaje > Inicializa la f(n) */
	 	onMounted(()=>{
	 	 	const uid_actual = storeAuth.uid;
	 	 	  if (uid_actual) {
	 	 	 	 verMaterialPorAlumno(uid_actual);
	 	 	  }
	 	});
 	/*const storeMaterial = useMaterialStoreR2();
	 const authStore = useAuthStore();
	 const { materialesAlumno, alumno, loading, error } = storeMaterial;

		onMounted(() => {
		  if (authStore.uid) {
		    storeMaterial.fetchMaterialesPorAlumno(authStore.uid);
		  }
		});*/
  </script>

 <style scoped>
 	.catalogo-container{
 		display: flex;
 		flex-direction: column;
 		align-items: center;
 		animation: fadeIn 1s ease;
 		margin-top: 2rem;
 		background: linear-gradient(135deg, #e6f0ff, #fefefe);
 	    padding: 1.5rem;
 	    border-radius: 12px;
 	    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
 	}
 	
 	.vista-previa h2{
 	    color: #1d4ed8;
 	    font-weight: 600;
 	}

 	.vista-previa h3 {
 		color: #377451;
 		font-weight: 500;
 		margin-bottom: 1.5rem;
 	}

 	.tabla-contenedor{
 		width: 100%;
 		overflow-x: auto;
 	}


 	.table_alumnos {
 	  width: 100%;
 	  border-collapse: collapse;
 	  background-color: #fff;
 	}

 	.table_alumnos th {
 	  background-color: #1d4ed8;
 	  color: white;
 	  padding: 10px;
 	}

 	.table_alumnos td{
 	  border: 1px solid #ccc;
 	  text-align: center;
 	  padding:  8px;
 	}

 	.table_alumnos tr:hover {
 		background-color:  #f3f4f6;
 	}

 	@keyframes identifier {
 	   from {
 	   	opacity: 0; transform: translateY(-10px);
 	   }
 	   to{
 	   	opacity: 1; transform: translateY(0);
 	   }
 	}
 </style>