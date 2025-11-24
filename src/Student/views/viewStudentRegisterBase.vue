<template>
    <!-- El script actual fue sustituido por el vStndRegister, la unica diferencia es que 
       el codigo es muy extenso y el script actual se distribuyo enn componentes se invocan
       y se usar por logica JS directa, y devuelve el Componente segun corrresponda  -->
    <!-- Manipulacion entre  paneles -->
        <div class="acciones">
            <button @click="mostrarRegistro">Registro Alumno</button>
            <button @click="mostrarEdicion">Edición  Alumno</button>
        </div>

        <div class="paneles">
            <button @click="current='register'">Registrar</button>
            <button @click="current= 'edit'">Personality</button>
            <component :is="currentView"></component>
        </div>
</template>
<script setup>
    import {ref, computed, onMounted} from 'vue';
    import  RegisterStudentView  from '@/components/RegisterStudentView.vue';
    import  ProfileStudentView from '@/components/ProfileStudentView.vue';
    // import {validacionesPerfilProfessor} from '@/utils/validations.origin/validacionsProfileTeacher.js'; //*

    const current = ref('register');
    const currentView = computed(()=>current.value === 'register' ? RegisterStudentView : ProfileStudentView)

    // const modoVista = ref<'registro' | 'edicion'>('registro'); [en su lugar quedo 'current']

    function mostrarRegistro() {
        current.value = 'registro';
    }

    function mostrarEdicion() {
        current.value = 'edicion';
    }

    onMounted(()=>{
        currentView;
    });

        
    /*Sugerencia crear directorio composables:
      a. Recordando:
       ================================================================================
       COMPOSABLE: El composable permite separar la lógica de negocio 
       de la lógica de infraestructura o utilidades.
      ================================================================================ 
      Es por ello que podemos centralizar la lógica que encapsula las utilidades(entradas[data-structure])*/

</script>
 <style>
     /*Aimacion entre paneles*/
    .paneles section{
        display: none;
        transition: all 0.3s ease-in-out; /** efecto de desvancer **/
        opacity: 0;  /*no me veo*/
    }

    .paneles section.activo{
        display: block;
        opacity: 1;   /* me veo */
    }

    .acciones{
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem;
    }

    .acciones button {
        padding: 0.5rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        background-color: #0d6efd;  /** primario Bootstrap **/
          color: white;
         cursor: pointer;
         transition: background-color 0.3s;
    }

    .acciones button:hover {
        background-color: #ob5ed7;
    }
    /*.paneles section {  
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 2rem;
        width: 100%;
        max-width: 600px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }*/
 </style>