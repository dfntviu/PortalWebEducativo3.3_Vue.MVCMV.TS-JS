import { createApp } from 'vue'
import { createPinia } from 'pinia'  // # Aniadir pinia
import { initializeFirebaseStorage } from '@/public/initializeFirebaseConf.js'  //configuracion Firebase centralizado
import router from './router'
import App from './App.vue'  
 
  // Inicializacion de Firebase
 const { auth, db, storage } = initializeFirebaseStorage();
 	
 // modulos de Pinia & Vue
 const pinia = createPinia();
 const app   = createApp(App);

 // console.log('Pinia antes de usar:' ,pinia)

  // Iniciar Ambos modulos 
 app.use(pinia);
 app.use(router);

  // Iniciar la App de montaje
 app.mount('#app');
    
  // Inicializar el estado de autentificacion

  // Verificar si existe la version activa
  // createApp(App).use(router).mount('#app')
  
   // const auth_firebase = useAuthStore(db);
  // useAuthStore.login(correo@dominio.com,'12345');
   
   //habilitar unicamente para ver si conecta con Firebase
  /*authStore.getCurrentUser().then(()=>{
  	 console.log('Verficado');
  }).catch((error)=>{
  	 console.log('No fue Verficado.');
  })*/