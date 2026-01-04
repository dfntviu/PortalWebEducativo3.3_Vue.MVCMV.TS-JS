<template>
	  <!-- ═══════════════════════════════════════════════════ -->
	  <!-- VISTA BIENVENIDA ESTUDIANTES		 -->
	  <!-- ═══════════════════════════════════════════════════ -->
	<main>
		<Transition>
			<!--───────────────────────────────────────────────  -->
			<!--		 Welcome Component  - Role 02 				-->
			<!--───────────────────────────────────────────────  -->
		<WelcomeUsers
		 v-if="isAuthenticated && isTeacher" 
		 role="teacher" 
		 />
			<div class="flex items-center justify-center min-h-screen">
					<!-- Loading State -->
				<div class="text-center">
					<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p class="text-gray-600 dark:text-gray-600 dark:text-gray-400">Cargando Perfil..</p>
				</div> 
				<!-- Error del Estado -->
				<div class="flex items-center justify-center min-h-screen">
					<div class="text-center">
						<svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor"  viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-widh="2" d="M12 9v2m0 4h.01m-6.938 4g13.85c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.33-2 4c-.77-1.33-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
				</div>
			</div>
		</Transition>
	</main>
</template>
<script setup lang="ts">
 import { computed} from 'vue'
 import { storeToRefs } from 'pinia'
  import {useAuthStore} from '@/components/authStore';
  import WelcomeUsers from '@/components/WelcomeUsers.vue'

  const authStore = userAuthStore();
  const {isAuthentitcated, profile} = storeToRefs(authStore);

  // ═════════════════════════════════
  // 		METODOS COMPUTADOS
  // ═════════════════════════════════
  const isLoading = computed(() => {
  	 isAuthentitcated.value && !profile.value
  });

  const isAlumno = computed(() => {
  	 profile.value?.role === 'student';
  });
</script>
	
<style scoped>
	.fade-slide-enter-active {
		opacity: 0;
		transform: translateY(-20px);
	}

	.fade-slide-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}
</style>