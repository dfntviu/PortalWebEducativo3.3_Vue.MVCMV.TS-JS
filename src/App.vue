<template>
   <h1>Hola, desde App.vue con Vite</h1>
   <!-- Se encarga de la gestiona del control de acceso en grupo de vistas(Layout) basadas segun su role de usuario -->
  <nav>
   <!--  <router-link to="/encab-1">1</router-link> |
    <router-link to="/encab-2">2</router-link> |
    <router-link to="/encab-3">3</router-link> | -->
     <!-- Mostrar el navbar según el rol del usuario -->
    <LayoutNavBarRole2 v-if="role === 'profesor'"/>
    <LayoutNavBarRole1 v-else-if="role === 'alumno'"/>
     <router-view/>
  </nav>
</template>
<!-- Seguir el flujo natural de cualquier Sistema.-->
 <script setup lang="ts">  // Code_new: 2025-Nov-02
  import { ref, watchEffect } from 'vue';
  import  LayoutNavBarRole2  from '@/components/LayoutNavBarRole2.vue';
  import  LayoutNavBarRole1  from '@/components/LayoutNavBarRole1.vue';
  // import { useAuthStore } from '@/stores/authStore.ts';
  import {useEmpSysStore} from '@/stores/emptySystemStore.ts';
  import { useRouter } from 'vue-router';
    /*import HeaderOne from '@/components/HeaderOne.vue';
    import HeaderTwo from '@/components/HeaderTwo.vue';
    import HeaderThree from '@/components/HeaderThree.vue';*/
   
  const initAuthSys = useEmpSysStore();
  const routing_rol = useRouter();

  const role = ref<string | null>(initAuthSys.role);

   watchEffect(()=> {
      if (!initAuthSys.isAuthenticated){ 
          // Si no se esta autenticado regresa al inicio
          routing_rol.push('/view-login-dep-init');  
        } else if(!role.value) {
          // Si no fue seteado el rol, regresa al inicio
          routing_rol.push('/view-login-dep-init');
              // console.log('boom');  
        }
   });

   /*role.value = authStore.role; -- sincroniza con el store en tiempo real --
  if (!authStore.isAuthenticated || !role.value) {
    routing_rol.push('/view-login-dep-init');
  }*/

 </script>

 <style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  h1 {
    color: #42b983;
    text-align: center;
  }
  nav {
    padding: 30px;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
