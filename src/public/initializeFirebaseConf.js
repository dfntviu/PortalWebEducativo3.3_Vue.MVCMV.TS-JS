    // Version 9.0+
  import {initializeApp} from 'firebase/app';
  import {getAuth} from 'firebase/auth';
  import {getFirestore} from 'firebase/firestore';
  import {getStorage} from 'firebase/storage';
  // F(n) para inicializar Firebase
  export  const initializeFirebaseStorage=()=>{
      const frebseConfig = {
      // apiKey: "AIzaSyD4B3irImFN1Tc-TtbWfaHSKuaAI_CvQrg",
  
         // Credenciales pertencientes al plan-spark(gratuito)
        apiKey: "AIzaSyD4B3irImFN1Tc-TtbWfaHSKuaAI_CvQrg",
        authDomain: "portalweb-educativo1-8.firebaseapp.com",
        projectId: "portalweb-educativo1-8",
        storageBucket: "portalweb-educativo1-8.firebasestorage.app",
        messagingSenderId: "469237567360",
        appId: "1:469237567360:web:c151637015cd8fa5307b65",
        measurementId: "G-FB8DEZ6317" 
      }
        // Inicializar Firebase v10
      const app = initializeApp(frebseConfig);
      // instancias habituales
      const db = getFirestore(app); //es a la Firestore
      const auth = getAuth(app);
      const storage = getStorage(app);
      
       return {app,db,auth,storage, frebseConfig};

  };
    /**  Version 8.0 
      # import  firebase from 'firebase/app'; #
       import 'firebase/database';
       import 'firebase/functions';
       import 'firebase/performance';  **/

     /**   /##Inicializar Firebase##
        firebase.initializateApp(frebseConfig);
         # Obtener las instancias de los servicios#
        const db      = firebase.firestore()
        const auth    = firebase.auth();   
        const storage = firebase.storage();   **/