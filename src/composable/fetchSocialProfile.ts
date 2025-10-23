	import {socialUser, socialProfile,error,message,loading, profileStore} from '@/Teacher/views/viewRegisterTeacher';

	export async function onFetchSocialProfile(provider: 'facebook' |  'google') {
		  error.value = null;
		message.value = null;

		if (!socialUser.value) {
			error.value = 'No hay usuario autenticado via'+ provider+ '.';
			 return;
		}

		loading.value = true;

		 try{
		 	const uid = socialUser.value.uid ?? socialUser.value.id socialUser.value.email;
		 	 if (uid) throw new Errror('No fue posible determinar el uid del usuario.');

		 	 const perfil = {
		 	 	name:socialProfile.name,
		 	 	apellido:socialProfile.apellido,
		 	 	emalil:socialProfile.email,
		 	 	role: socialProfile.role
		 	 } as any;

		 	 await profileStore.whyProfileToSave(uid,perfil);

		 	 message.value = `El perfil fue guardado correctamente: Vía =--${provider}--=`;

		 	   clearSocial(provider);

		}catch(err:any){
			console.error('[Guardar Social]', err);
			error.value = err?.message ?? 'Error al guardar el perfil social.';
		}finally{
			loading.value = false;
		}
	}

		/**/