import { createApp } from 'vue'
import { createPinia } from 'pinia'  // # Aniadir pinia
import { initializeFirebaseStorage } from '@/config/initializeFirebaseConf.ts'  //configuracion Firebase centralizado
import router from './router/index.js'
import './assets/styles/materialColors.css'
import App from './App.vue'  
 
  // Inicializacion de Firebase
 const { auth, db, storage } = initializeFirebaseStorage();
 	
  /* npx tailwindcss init -p [lo cree manualmente] */
  // import './assets/styles/main.css'

 // modulos de Pinia & Vue
 const pinia = createPinia();
 const app   = createApp(App);


  // Iniciar Ambos modulos 
 app.use(pinia);
 app.use(router);

  // Iniciar la App de montaje
 app.mount('#app');

    // npm install -D tailwindcss@latest postcss@latest autoprefixer@latest [ready]