<template>
   <div class="vista-estudiantes">
       <nav class="navegacion-paneles">
          <button class="btn-nav"> Regístrar Estudiante </button>
          <button class="btn-nav"> Editar el Perfil </button>
       </nav>

     <!-- =======================================
              CONTENEDOR DE PANELES
          ======================================= -->

      <div class="contenedor-paneles">
          <Transition>
             <div v-if="currentPanel === 'register'"  key="register" class="panel-activo">
                 <RegisterStudentView/>
             </div>
             <div v-else-if="currentPanel === 'edit'"  key="edit" class="panel-activo">
                <ProfileStudentView/>
             </div>
          </Transition>
      </div>

  <!-- =====================================
         MODAL DE CAMBIO DE CONTRASENIA
       ===================================== -->
     <ChangePasswordModal
       is-open="isPasswordModalOpen"
       @close="closePasswordModal"
       @success="openPasswordChangeSuccess"
     />
   </div>
</template>


<script setup lang="ts">

   /**
    * FLUJO DE DESAROLLO
    * 1. El Script Base (este -  vwRegisterStudent)
    * 2.  RegisterStudentView → Componente de Registro
    * 3.  ProfileStudentView → Componente de Edicion
    * 4. ChangePasswordModal  → Comp. Modal de camb. de Passwd*/
   import { ref, onMounted } from 'vue';
   import  RegisterStudentView from '@/components/RegisterStudentView.vue';
   import  ProfileStudentView  from '@/components/ProfileStudentView.vue';
   import  ChangePasswordModal from  '@/components/ChangePasswordModal.vue';
   import  { useProfileStore } from '@/stores/profileStore.ts'

   // ══════════════════════════════════════════
   //  ESTADO LOCAL
   // ══════════════════════════════════════════
   
   /**
    * Panel actual mostrado ('register'| 'edit') 
    * */
   const currentPanel = ref<'register'| 'edit'>('register');

   /**
    * Estado del modal de cambio de contrasenia*/
   const isPasswordModalOpen = ref(false);
   
   // ════════════════════════════════════════
   //    STORE
   // ════════════════════════════════════════
   const store_profile = useProfileStore();

   // ═════════════════════════════════════
   //     LYFECICLE HOOKS
   // ═════════════════════════════════════

   onMounted(async () => {
    // Intetar cargar de perfil desde localStorage al montar
     const loaded =  store_profile.loadFromLocalStorage();

     if(loaded){
        console.log('[vwStudentRegister] Perfil cargado desde el localStorage');
     } else {
        console.log('[vwStudentRegister] No hay perfil en el localStorage, mostrando registro..');
     }
   });


   // ═══════════════════════════════════════
   //        MTDOS DE NAVEGACIÓN
   // ═══════════════════════════════════════

   /**
    * Cambiar el panel actual
    * */
   function changePanel(panel: 'registrar' | 'edit'): void {
        store_profile.clearMessages();

        currentPanel.value = panel;

        console.log(`[vwStudentRegister] El panel fue cambiado a: ${panel} `);
   }

   // ═══════════════════════════════════════
   //        MTDOS DEL  MODAL
   // ═══════════════════════════════════════
   /**
    * Abre el modal de cambio de contrasenia
    * */
   function openPasswordModal(): void {
      isPasswordModalOpen.value = true;
   }
   /**
    * Cierra el modal de cambio de contrasenia
    * */
   function closePasswordModal():void {
      isPasswordModalOpen.value = false;
   }
   /**
    * Maneja el exito de cambio de contrasenia
    * */
   function openPasswordChangeSuccess(): void {
       console.log('[vwStudentRegister] La contraseña fue cambiada, redirigiendo...');
       // Limpiar el estado
       store_profile.resetState();
        // Cambiar a panel de Registro
       currentPanel.value = 'register';
         // Cerrar el modal
       closePasswordModal();
   }

</script>

<style scoped>
 .vista-estudiantes{
    min-height:100vh;
    background:padding;
    padding:1rem;
 }

 .navegacion-paneles{
   displa:flex;
   justify-content:center;
   gap:1rem;
   text-decoration: underline;
   align-content:left;
 }
</style>