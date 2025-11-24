import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore.ts';
import { useProfileStore } from '@/stores/profileStore.ts';

// Importar componentes por tipo de registro
import PanelTradicional from './panels/PanelTradicional.vue';
import PanelFacebook from './panels/PanelFacebook.vue';
import PanelGoogle from './panels/PanelGoogle.vue';


const authStore = useAuthStore();
const profileStore = useProfileStore();

const tipoRegistro = ref<string>('');
const animatePanel = ref(false);
const loading = ref(false);
const   error = ref<string | null>(null);
const message = ref<string | null>(null);


	function seleccionarTipo(tipo: string) {
	   tipoRegistro.value = tipo;
	   animatePanel.value = false;
	    requestAnimationFrame(() => animatePanel.value = true);
	}

	  // Computed para seleccionar el componente correspondiente
	const panelActual = computed(() => {
		switch (tipoRegistro.value) {
		   case 'tradicional': return PanelTradicional;
		   case 'facebook': return PanelFacebook;
		   case 'google': return PanelGoogle;
		default: return null;
		}
	});

	onMounted(() => {
	  tipoRegistro.value = 'tradicional';
	  animatePanel.value = true;
	});