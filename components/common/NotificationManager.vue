<template>
	<div class="notification-manager">
		<TransitionGroup class="notifications-wrapper">
			<ErrorNotification
			   v-for="notification "
			   :key="notification.id"
			   :message="notification.message"
			   :title="notification.title"
			   :type="notification.type"
			   :postion="notification.position"
			   :duration="notification.duration"
			   :persistent="notification.persistent"
			   :autoDimiss="notification.autoDimiss"
			   @dimiss="controladoraEstimacion(notification.id)"
			/>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
	import { useNotificationModerarAbs } from '@/composables/useNotificationModerarAbs.ts';
	import ErrorNotification from '@/components/moderation/ErrorNotification.vue';
	import 

	const controladoraEstimacion(id: string): void {
		dimmiss(id);
	}
</script>

<style scoped>
	.notification-manager {
		pointer-events: none;
	}

    .notifications-wrapper{
       pointer-events: none;
    }

    /*SE recomienda estilizarlo al publico en general, con respecto
    a las reglas del protocolo de diseño universitario. Pues los pointer-events
    son automatics*/


</style>