<!-- Componente Administracion-de_Alumnos: 
    Proposito: Tener un componente completo en UI/UX, Lógica, reactivo
    y eficiente mas que la vista por si se necesesta utilizar muchas veces 
   para la busqueda de alumnos, teninendo las metriscas escenciales todos sus alumnos
    y la actualización informacion de alumnos (UI -> Tabla)
 		** Ojo no confundirlo como SearchMateriales que busca todo, esto solo busca alumnos
  -->
 <template>
  	<section class="admin-alumnos">
  		<!-- Seccion de Búsqueda -->
  			<div class="busqueda">
  				<input type="text"		
  					v-model="filtro"
  					placeholder="Buscar alumno por nombre..." 
  				/>
  			</div>

  		<!-- Tabla de Alumnos -->
  		<table class="table_alumnos">
  			<thead>
  				<tr>Nombre</tr>
  				<tr>Apellido</tr>
  				<tr>Carrera</tr>
  				<tr>Curso</tr>
  				<tr>Fecha-Reg.</tr>
  				<tr>Edad</tr>
  			</thead>
  			<tbody>
  				<tr v-for="al in todos_alumnos" :key="al.uuid"></tr>
  				<td>{al.nombre}</td>
  				<td>{al.apellido}</td>
  				<td>{al.carrera}</td>
  				<td>{al.curso}</td>
  				<td>{al.fechaDeRegistro}</td>
  				<td>{al.edad}</td>
  			</tbody>
  		</table>
  			<!-- En otro caso animar el contador de alumnos para darle vivides -->
  			<p v-else>No se encontrarn alumns con ese criterio</p>

  			 <!--  🔢 Invocar al Contador animado  🔢-->
  			 <div class="contador-alumnos">
  			 	<h3>Total de Alumnos Registrados</h3>
  			 	 <span class="contador"> {{contadorAnimado}} </span>
  			 </div>
  			 <!-- Boton de Actualizacion -->
  			  <div class="acciones">
  			  	 <button @click="refrescarDatos">Actualizar Datos</button>
  			  </div>
  	</section>
  </template>

<script setup>
	import {ref, onMounted,computed} from 'vue';
 	import {useAdmAllStore} from 'stores/allAdmStore.ts';
 	// --> new_01
 	const storeAll = useAdmAllStore();
 	const alumnos = ref([]);
 	const totalAlumnos = ref(0);
 	const contadorAnimado = ref(0);
 	const filtro = ref('');
	
	 // Las constantes viejas p/los 2 ult's métodos
 		const todos_alumnos = ref([]);
 	  	   const dato_total = ref(0);

 	// Filtro Dinámico  --> new_02
 	 const alumnosFiltrados = computed(()=>{
 	 	return alumnos.value.filter((al)=>{
 	 		 al.nombre.toLowerCase().includes(filtro.value.toLowerCase());
 	 	});
 	 });

 	 // Animación del contador --> new_03
 	  function animarContador(valorFinal){
 	  	 let inicio = 0; 
 	  	  const duracion = 800 //it s a miliseconds
 	  	  const incremento = Math.ceil(valorFinal / (duracion /16));

 	  	  const intervalo = setInterval( ()=>{
 	  	  	 inicio += incremento;
 	  	  	  if (inicio >= valorFinal) {
 	  	  	  	 contadorAnimado.value = valorFinal;
 	  	  	  	  clearInterval(intervalo);
 	  	  	  }else{
 	  	  	  	contadorAnimado.value = inicio; //se hace el rest
 	  	  	  }
 	  	  }, 16); //pago el que simula al timmer
 	   } //#end del tiempo total de la animacion


 	   /*Refrescar al Alumnno desde el store --> new_04*/
 	    async function refrescarDatos() {
 	    	// prop f
	       const data = await  storeAll.monitoringTotal();
	       alumnos.value = data || [];
	       totalAlumnos.value = alumnos.value.length;
	         animarContador(totalAlumnos.value)
 	    }	

 	    	// f(n) de antanio
 	    async function todosAlumnosRegistradosFormTabla() {
 	  	 try{
 	  	 	todos_alumnos.value = await storeAll.monitoringTotal();
 	  	 	console.log("Alumnos cargados: ", todos_alumnos.value);
 	  	 }catch(err) {
 	  	 	console.error("Error al cargar a los Alumnos",merr);
 	  	 }

 	  } 

 	  /*Obtener el Total de alumnos --> f(n) de antanio */
 	 async	function datoDeRegistros() {
 	  	try{
 	  		dato_total.value = await storeAll.cuantificateTotal();
 	  		console.log(`Total de Alumnos: ${dato_total.value}`);
 	  	 } catch(err) {
 	  	 	console.error("Error al contar el TOTAL Alumnos",err);
 	  	 }
 	  }

 	    /*Cargar al Inicio de la vista*/
 	    onMounted(()=>{	
 	    	refrescarDatos();
 	    });

</script>
   <style scoped>
   	.admin-alumnos{
		padding: 1rem;
		animation: fadeIn 0.6ms ease-out;
	}

	.busqueda{
		 margin-bottom: 1rem;
	}

	.busqueda input{
		border: 0.5rem;
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
		/*Animación de tabla y botones*/
	.table_alumnos{
 		width: 100%;
 		border-collapse: collapse;
 		margin-bottom: 1rem;
 		animation:fadeIn 0.8ms ease-out; 
 	}

 	.table_alumnos th,
	.table_alumnos td{
		padding: 0.6rem;
		border: 1px solid #ddd;
		text-align: left;
	}
		/*Animación de datos de la tabla y botones*/
	.table_alumnos tr:hoover{
		background-color: #f9f9f9;
		transition: background 0.3s ease-in-out;
	}

	.contador-alumnos{
		font-size: 1.2rem;
		font-weight: bold;
		margin: 1rem 0;
	 }
		
		.contador{
			font-size: 1.2rem;
			color: #0077cc;
			transition: color 0.3ms ease ;
		}

		button{
    		padding: 0.4rem;
    		border: none;
    		background-color: #0077cc;
    		color: white;
    		border-radius: 6px;
    		cursor: pointer;
    		transition: color 0.2ms ease, background-color 0.3s ease;
    	}

    	button: hover{
 			transform: scale(1.05);
 			background-color: #005fa3;
 		}   
   </style>