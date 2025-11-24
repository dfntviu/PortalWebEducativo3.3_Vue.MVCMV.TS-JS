
import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { NotificationsService } from '@/services/NotificationsServ.ts';
import { initializeFirebaseStorage } from '@/public/initializeFirebaseConf.js'; 

 const { db } = initializeFirebaseStorage();

 export class ModerationService {
 	static collectionName = 'materials_register';
   static moderateCommentColl = 'profesor_comentarios';
 	// Aprobar los materiales
 	static async arpobarMaterialsEduc(materialId: string, alumnoId: string){
      try{
 	   		const matRef = doc(db,collectionName, materialId);
 	   		  const aceptar_mat = updateDoc(matRef, {estado: 'aprobado', aprobatoAt: new Date()});  //a prueba
          	   NotificationService.notifyAlumno(alumnoId,'El matarial fue Aprobado');
               return aceptar_mat; // a prueba
        }catch(error){
           console.error('Error al reibir los materiales de los Alumno');
            throw error;
        }

   }
    // Rechzar los materiales
   static async rechazarMaterialsEduc(materialId: string, alumnoId: string){
      try{
 	   		const matRef = doc(db,collectionName, materialId);
 	   		  const  rechazar_mat = updateDoc(matRef, {estado: 'rechazado', aprobatoAt: new Date()}); //a prueba
          	   NotificationService.notifyAlumno(alumnoId,'El matarial fue Rechazado');
               return rechazar_mat // a prueba
        }catch(error){
           console.error('Error al reibir los materiales de los Alumno');
            throw error;
        }

   }
     // Obtener materiales pendientes
   static async getPenditentes(){
          const regCollection = collection(db,this.collectionName);
          const snapshot = await getDocs(regCollection);
      	  const pendientes = snapshot.docs.  //?
      	     map(doc => {doc.id, doc.data()}).
      	        filter(mat => mat.estado === 'pendiente');
      	          return pendientes;
   }

   static async agregarComentarioProffe(mensaje: string, destacado: boolean){
       try{
          const docRef = addDoc(collection(db,moderateCommentColl),{
             mensaje, destacado,
              fecha: serverTimeStamp(),
          });

          return {
             id: docRef.uuid,
             mensaje,
             destacado,
             fecha: new Date()
          };
       }catch(error){
          console.error("Error al guardar el comentario en la Firestore", error);
          throw error;
       }
   }
       // return {mensaje, destacado, fecha};
    
 }
