  import {  ref }            from 'vue';
  import { useProfileStore } from '@/stores/profileStore.optimized.ts';
      
      const store_profile = useProfileStore();
	    const       usuario = ref<User | null >(null);

	    
  	// Formulario de Edición
		const form_edit = ref({
	 	 	 name: '',
	 	 	lname: '',
	 	 	carrera: '',
	 	 	subject: '',
	 	 	  age: 0
	 	}, actualizacionAlumno());  //a prueba
	    
  export async function composableProfileStudent(){


		async function EditarAlumno() {		
			 if (!usuario.value) return;
			    await store_profile.editProfile(usuario.value,datosPerfil.value); //error 5.2	
			     alert('El perfil ha sido editado correctamente');
		}

		async function deleteProfile(){	
			if (usuario.value) {	 // es incesesario definir el valor del rol, porq esta en el store
				  const eliminado = await store_profile.deleteProfiles(usuario.value);
				  if (eliminado) {
					alert(`Perfil ha sido eliminado Satisfactoriamente`);			  	
				  }else{
				  	alert(`No fue posible eliminar el Perfil del usuario: ${usuario.value.name}`);			  	
				  }
				   return eliminado;
			} else{
				 alert('Error: No hay usuario seleccionado para Eliminar');
				    return false;
			}
		} // #End_delProfile 
		
		  /** Metodo para controlar el evento submit **/
		const handleSumbit = async()=>{ 
			 if(!usuario.value){
			 	alert('No hay usuario seleccionado');
			 	 return;
			 }

			 if (action.value === 'edit') {
			 		await EditarAlumno();
			 } else if (action.value === 'delete') {
			 		await deleteProfile();
			 }
		}; //End_S
};