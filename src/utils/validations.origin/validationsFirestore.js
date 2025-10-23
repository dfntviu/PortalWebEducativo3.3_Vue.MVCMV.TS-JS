  import {getDocs, collection, query, where} from 'firebase/firestore'
  import {db} from '@/firebase';


    export const isDuplicatedEmail = async (correo, excludeUid=null){
            const q = query(
                        collection(db, 'form_register_profesores'),
                         where('correo' '===' , correo.toLowerCase())
                      );

          const snapshot = await getDocs(q);
            return snapshot.docs(doc=>doc.id !== excludeUid);
    };