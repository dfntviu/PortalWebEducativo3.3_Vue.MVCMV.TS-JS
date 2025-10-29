  import  firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import 'firebase/storage';
  import 'firebase/database';
  import 'firebase/functions';
  // import 'firebase/performance';
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
        // Inicializar Firebase
     firebase.initializateApp(frebseConfig);
        // Obtener las instancias de los servicios
      const db      = firebase.firestore()
      const auth    = firebase.auth();   
      const storage = firebase.storage();

      return {firebase,db,auth,storage, frebseConfig}
  }