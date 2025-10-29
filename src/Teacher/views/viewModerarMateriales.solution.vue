<template>
  <div class="status_moderate">
     <!-- Registro de Materiales Aprobados -->
    <section v-for="(mat,ix_mat) in tipo_respuesta" :key="autorizados" class="mats_aprobados"
           :class="{habilitar_mode: modoModeracion === 'mats_aprobados'} ">
            
          <input type="text" placeholder="Uuid del Alumno" v-model="form_recibe.uid_alumno">
           <input type="text" placeholder="Apellido del Alumno" v-model="form_recibe.lname">
           <input type="text" placeholder="Titulo del Material" v-model="form_recibe.titulo">

           <textarea placeholder="Cargando el contenido del Material..."
            v-model="form_recibe.contenido"> </textarea>  

            <input type="date" placeholder="Fecha de Carga" v-model="form_recibe.fecha_actual">
            <input type="text" placeholder="Uuid del Material" v-model="form_recibe.uid_material">
           
   <button type="submit" @click="listadoMtAprobados">Materiales Aprobados</button>
    </section>

     <!-- Registro de Materiales Rechazados -->
    <section v-for="(mat,ix_mat) in tipo_respuesta" :key="no_autorizados" class="mats_rechazados"
           :class="{habilitar_mode: modoModeracion === 'mats_rechazados'} ">
            
          <input type="text" placeholder="Uuid del Alumno" v-model="form_recibe.uid_alumno">
           <input type="text" placeholder="Apellido del Alumno" v-model="form_recibe.lname">
           <input type="text" placeholder="Titulo del Material" v-model="form_recibe.titulo">

           <textarea placeholder="Cargando el contenido del Material..."
            v-model="form_recibe.contenido"> </textarea>  

            <input type="date" placeholder="Fecha de Carga" v-model="form_recibe.fecha_actual">
            <input type="text" placeholder="Uuid del Material" v-model="form_recibe.uid_material">
              <button type="submit" @click="listadoMtRechazados">Materiales Rechazados</button>
    </section>

    <!-- Registro de Materiales Pendiente -->
    <section v-for="(mat,ix_mat) in alls" :key="'?'" class="all_mats"
           :class="{habilitar_mode: modoModeracion === 'all_mats'} ">
            
          <input type="text" placeholder="Uuid del Alumno" v-model="form_recibe.uid_alumno">
           <input type="text" placeholder="Apellido del Alumno" v-model="form_recibe.lname">
           <input type="text" placeholder="Titulo del Material" v-model="form_recibe.titulo">

           <textarea placeholder="Cargando el contenido del Material..."
            v-model="form_recibe.contenido"> </textarea>  

            <input type="date" placeholder="Fecha de Carga" v-model="form_recibe.fecha_actual">
            <input type="text" placeholder="Uuid del Material" v-model="form_recibe.uid_material">
              <button type="submit" @click="listadoTodosMateriales">Todos los Materiales</button>
    </section>
  </div>
</template>

<script setup> 
   import  { ref } from 'vue';
   import  { useModerationStore } from '@/stores/moderateStore.ts';
   // import {materialAdmValidations}  from '@/utils/validations.origin/validationsAdminMaterials.js';                         
     // Revisar validacion y verificar en q accion se utilizara
    const store_moderate = useModerationStore();
    const modoModeracion = ref("all_mats");

    const form_send = ref({
      uid_alumno: '',
      lname: '',
      titulo: '',
      contenido: '',
      fecha_actual: '',
      uid_material: '',
    });
         // Tipo de respuesta dinamica (corresp. al Store)
       const tipo_respuesta = ref();  // aprobado ó rechazado
       const alls = ref([]);

       /** ****  **** **** **** **** ****
        * Clasificacion de Listados
        * ****  **** **** **** **** **** */

        // Determinar listado de aquellos Materiales pertencientes a la 1° Clasificación
      async function listadoMtAprobados() {
          modoModeracion.value =  'mats_aprobados'  //UI
          tipo_respuesta.value = 'aprobado';  //de mas
          try{
            store_moderate.estado = 'aprobado'; // store
              await store_moderate.estadoDeModeracion(form_send.value.uid_alumno, form_send.value.uid_material);
          }catch(e){
             console.error('Error en Materiales Aprobados',e);
          }
      }
        // Determinar listado de aquellos Materiales pertencientes a la 2° Clasificación
      async function listadoMtRechazados() {
          modoModeracion.value =  'mats_rechazados';
          tipo_respuesta.value = 'rechazado';
        // modoModeracion.value = tipo_respuesta: 'rechazado'
          try{
            store_moderate.estado = 'rechazado';
              await store_moderate.estadoDeModeracion(form_send.value.uid_alumno,form_send.value.uid_material);
          }catch(e){
             console.error('Error en Materiales No Aprobados',e);
          }

      }
      // Determinar listado de aquellos Materiales pertencientes a la 3era Clasificación
      async function listadoTodosMateriales() {
          modoModeracion.value = 'all_mats';
          try{
              await store_moderate.estadosDeModeracionPendientes();
              alls.value = store_moderate.collection_type;
            // store_moderate.estado = tipo_respuesta;
          }catch(e){
             console.error('Error al Mostrar todos los Materiales ',e);
          }
      }

      // npm install eslint vue-eslint-parser @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-vue --save-dev
</script>

<style scoped>
  .status_moderate{
    display: flex;
    flex-direction: column;
     grap: 1.5rem;
     padding:  1rem;
     font-family: Arial, sans-serif;
  }
        /** ANIMATION PANELS BETWEEN **/
    /*Base de Cada sección*/
    .status_moderate section {
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease-in-out;
      border-radius: 8px;
       padding: 1rem;
       box-shadow: 0 2px 6px rgba(0,0,0, 0.1);
       background-color: #f9f9f9;
    }

  .status_moderate section.habilitar_mode {
     display: block;
     opacity: 1;
     transform: translateY(0);
  }

  /*Diferenciar secciones por tipo*/
   .mats_aprobados{
     border-left: 5px solid #4CAF50;  /*verde*/
   }

   .mats_rechazados{
     border-left: 5px solid #F44336;  /*verde*/
   }
   /*sin clasificacion*/
   .alls_mats{
     border-left: 5px solid #2196F3;  /*Azul*/
   }
   /*Ents y textarea*/
   .status_moderate input,
   .status_moderate textarea{
     width: 100%;
     margin-bottom: 0.5rem;
     padding: 0.5rem;
     border-radius: 4px;
     border: 1px solid #ccc;
     font-size: 0.95rem;
     transition: border-color 0.2s;
   }

    .status_moderate input:focus,
    .status_moderate textarea:focus{
      border-color: #2196F3;
      outline: none;
    }

    .status_moderate button {
      padding: 0.5rem 1rem;
      font-size: 0.95rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      transition: background 0.2s;
    }
     
      .mats_aprobados button{
       background-color: #4CAF50;
      }
    
      .mats_aprobados button:hover {
       background-color: #43a047;
      }


      .mats_rechazados button{
       background-color: #4CAF50;
      }

      .mats_rechazados button:hover {
       background-color: #e53935;
      }

      .alls_mats button{
       background-color: #2196F3;
      }

      .all_mats button:hover {
       background-color: #1e88e5;
      }

   status_moderate input::placeholder,
   status_moderate textarea::placeholder {
    color: #999;
    font-style: italic;
   }

  @media (max-width: 600px) {
    .status_moderate section {
      padding: 0.75rem;
    }

    .status_moderate input,
    .status_moderate textarea{
      padding: 0.9rem;
    } 

    .status_moderate button{
      font-size: 0.9rem;
    }
  }
</style>