import { collection, doc, setDoc,getDocs, query,where, updateDoc } from 'firebase/firestore';
import { initializateFireabaseStg } from '@/config/initializateFirebase.js';
 import type Notification from '@/types/interf.index.ts'

const { db } = initializateFireabaseStg();

  export class NotificationService {
      static collectionName = 'notifications';
        // Notificar al Alumn
      static async notifyAlumno(alumnoId: string, mensaje: string){
           try{
              const newDocRef =  doc(collection(db, this.collectionName));
              const notification: Notification = {
                 alumnoId,
                 mensaje,
                 leido: false,
                 timestamp: new Date(),
            } 
            await setDoc(newDocRef, notification);
              return  {id: newDocRef.id, ...notification};
        }catch(error){
           console.error('[Servicio Notificiones]: Error al notificar al Alumno', error);
           throw error;
      }
    } 
      // Obtener Notificaciones individuales
      static async getNotifications(alumnoId: string){
        try{
          const q = query(collection(db,this.collectionName),where('alumnoId','===', alumnoId));
             const   snapshot = await getDocs(q);
              return snapshot.docs.map(doc =>{doc.id, ...doc.data()});
        }catch(){
          console.error('[MaterialDeployService]: Error al obt las notificationes', error);
        throw error;
        }   
      }
       // Notificaciones leidas
      static async markAsRead(notificationId: string){
          try{
             const docRef = doc(db,this.collectionName, notificationId);
             await updateDoc(docRef, {leido:true});

          }catch(error){
             console.error('al Marcar notification como leida', error);
              throw error;
          }
      }
        // Notificaciones No leidas
      static async markAsNotRead(notificationId: string){
          try{
             const docRef = doc(db,this.collectionName, notificationId);
             await updateDoc(docRef, {leido:false});

          }catch(error){
             console.error('La notificación sigue sin abrirse', error)
              throw error;
          }
      }

};