<script setup lang="ts">
	import {useFormAlumno} from '@/composables/useFormAlumno.js';
	import {useFormProfesor} from '@/composables/useFormProfesor.js';
	import {useUIState} from '@/composables/useUIState.js';
	import {useNotifications} from '@/composables/useNotifications.js'
	import {useErrorHandler} from '@/composables/useErrorHandler.js';
	import {useAuthSession} from '@/composables/useAuthSession.js';
	
	/* Inicializacion Centralizada */

	const   alumnoForm = useFormAlumno();
	const profesorForm = useFormProfesor();
	const      ui = useUIState();
	const notify = useNotifications();
	const errors = useErrorHandler();
	const auth   = useAuthSession();
	
	/* Control Dinamico entre Vistas */
	import RegisterStudentView from '@/components/RegisterStudentView';
	import ProfileStudentView from '@/components/ProfileStudentView';
	import RegisterTeacherView from '@/components/RegisterTeacherView';
	import ProfileTeacherView from '@/components/ProfileTeacherView';

	const currentPanel = computed(()=> {
		swith(ui.panelActivo.value) {
		    case 'alumno': return RegisterStudentView;
            case: 'profesor' return RegisterTeacherView;
            case: 'perfil' return ProfileStudentView;
             default: return ProfileTeacherView; 
		}
	});

	function cerrarSession() {
		try{
			await auth.logout();
			notify.mostrar('La sesion fue cerrada correctamente');
			ui.CambiarPanel('Login');
		}catch(err){
			errors.handleTemp(err);

		}
	}
</script>