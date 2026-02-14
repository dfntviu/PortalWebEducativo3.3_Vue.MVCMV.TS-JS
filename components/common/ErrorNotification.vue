<template>
	<Teleport>
		<Transition name="notification">
      <div
        v-if="visible"
        class="notification-container"
        :class="[typeClass, positionClass]"
        role="alert"
        aria-live="assertive"
      >
        <div class="notification-content">
          <!-- Ícono según tipo -->
          <div class="notification-icon">
            <span class="icon">{{ iconEmoji }}</span>
          </div>

          <!-- Mensaje -->
          <div class="notification-body">
            <h4 v-if="title" class="notification-title">{{ title }}</h4>
            <p class="notification-message">{{ message }}</p>
          </div>

          <!-- Botón cerrar -->
          <button
            class="notification-close"
            aria-label="Cerrar notificación"
            @click="close"
          >
            ✕
          </button>
      </div>

        <!-- Barra de progreso de auto-dismiss -->
        <div v-if="autoDismiss" class="progress-bar">
          <div class="progress-fill" :style="progressStyle"></div>
        </div>
      </div>
    </Transition>
	</Teleport>
</template>
 <!-- Este componente de notificación toast (emergente) proporciona un
   FeedBack visual del usuario sobre el resultado de las acciones de
    las notificaciónes de la vista vwModerarAbsoluteCM.vue
 -->
<script setup lang="ts">
	import { ref, computed,onMounted, unMounted } from 'vue';

	interface Props {
		message: string;
  		title?: string;
  		type?: 'error' | 'warning' | 'success' | 'info';
  		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  		autoDimiss?: number;
  		duration?: number; //msecs
  		persistent?: boolean; //ap. de autoabre
	}
    const props = withDefaults(defineProps<Props>(),{
    	title: '',
    	type: 'error',
    	position: 'top-right',
    	autoDimiss:  true,
    	duration: 5000;
    	persistent: false,
    });

    interface Emits {
 		(e: 'dimiss'): void;
    }

     const emit = defineEmits<Emits>();

    /*══════════════════════════════════
 	 	   ESTADO LOCAL
      ══════════════════════════════════*/
     const visible = ref(false);
     const progressWidth = ref(100);
     const dimissTimmer: number | null = null;
     let progressInterval: number | null = null;

    /*══════════════════════════════════
 	 	   METHODS COMPUTED
      ══════════════════════════════════*/
     const typeClass = computed(() => { (`notification- ${props.type}`);
     const positionClass = computed (()=>`position-${props.position}`);

    const iconEmoji = computed(()=> {
    	const icons = {
    	 error: '❌',
    	 warning: '⚠️',
    	 success: '✅',
    	 info: 'ℹ️',
    	}
    	return icons[props.type];
    });

    const progressStyle = computed(() => {
    	width: `${progressWidth.value}%`;
    });

    /*══════════════════════════════════
 	 	  METODOS
      ══════════════════════════════════*/
      function show(): void {
      	visible.value = true;

      	 if(props.autoDimiss && !props.persistent){
      	 	startDimissTimmer();
      	 	startProgressAnimation();
      	 }
      }

      function close(): void {
      	 visible.value = false;
      	 clearTimmers();
      	 emit('dimiss');
      }

      function startDimissTimmer(): void {
      	 dimissTimmer = window.setTimeout( () => {
      	 	 close();
      	 }, props.duration);

      }

      function startProgressAnimation(): void {
      	const fps = 60;
      	 const interval = 1000 /fps;

      	 const totalSteps = props.duration /interval;
      	 let currentStep = 0;

      	  progressInterval = window.setInterval( () => {
      	  	 currentStep++;

      	  	 progressWidth.value = 100 - (currentStep/totalSteps)*100;

      	  	 if(currentStep>= totalSteps){
      	  	 	clearProgresssAnimation();
      	  	 }

      	  }, interval);
      }

      function clearProgresssAnimation(): void {
      	  if(progressInterval!== null){
      	  	 clearInterval(progressInterval);
      	  	  progressInterval = null;
      	  }
      }

       function handleMouseEnter(): void {
       	  if(props.autoDimiss && !props.persistent) {
       	  	 clearTimmers();
       	  }
       }

        function clearTimmers(): void {
        	if(dimissTimmer !== null){
        		clearTimeout(dimissTimmer);
        		 dimissTimmer = null;
        	}
        	clearProgresssAnimation();
        }

        function handleMouseEnter(): void {
        	if(props.autoDimiss && !props.persistent && visible.value){
        		startDimissTimmer();
        		startProgressAnimation();
        	}
        }

      /*══════════════════════════════════
          CICLOS DE VIDA
        ══════════════════════════════════*/
        onMounted(() => {
          show();
        });

		unMounted(()=> {
		  close();
		});

</script>

<style scoped>
	/* ====================================
   CONTENEDOR BASE
   ==================================== */
.notification-container {
  position: fixed;
  z-index: 10000;
  min-width: 320px;
  max-width: 400px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  pointer-events: auto;
}

/* ====================================
   POSICIONES
   ==================================== */
.position-top-right {
  top: 1.5rem;
  right: 1.5rem;
}

.position-top-left {
  top: 1.5rem;
  left: 1.5rem;
}

.position-bottom-right {
  bottom: 1.5rem;
  right: 1.5rem;
}

.position-bottom-left {
  bottom: 1.5rem;
  left: 1.5rem;
}

.position-top-center {
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
}

/* ====================================
   TIPOS (COLORES)
   ==================================== */
.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-error .notification-icon {
  background: #fef2f2;
  color: #ef4444;
}

.notification-warning {
  border-left: 4px solid #f59e0b;
}

.notification-warning .notification-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.notification-success {
  border-left: 4px solid #22c55e;
}

.notification-success .notification-icon {
  background: #f0fdf4;
  color: #22c55e;
}

.notification-info {
  border-left: 4px solid #3b82f6;
}

.notification-info .notification-icon {
  background: #eff6ff;
  color: #3b82f6;
}

/* ====================================
   CONTENIDO
   ==================================== */
.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-icon .icon {
  font-size: 1.25rem;
  line-height: 1;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.notification-message {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  word-break: break-word;
}

.notification-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  background: transparent;
  border: none;
  font-size: 1.125rem;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #111827;
}

/* ====================================
   BARRA DE PROGRESO
   ==================================== */
.progress-bar {
  height: 3px;
  background: #f3f4f6;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.1s linear;
}

.notification-error .progress-fill {
  background: #ef4444;
}

.notification-warning .progress-fill {
  background: #f59e0b;
}

.notification-success .progress-fill {
  background: #22c55e;
}

.notification-info .progress-fill {
  background: #3b82f6;
}

/* ====================================
   TRANSICIONES
   ==================================== */
/* Top */
.notification-enter-active.position-top-right,
.notification-enter-active.position-top-left,
.notification-enter-active.position-top-center {
  animation: slideInDown 0.3s ease-out;
}

.notification-leave-active.position-top-right,
.notification-leave-active.position-top-left,
.notification-leave-active.position-top-center {
  animation: slideOutUp 0.3s ease-in;
}

/* Bottom */
.notification-enter-active.position-bottom-right,
.notification-enter-active.position-bottom-left {
  animation: slideInUp 0.3s ease-out;
}

.notification-leave-active.position-bottom-right,
.notification-leave-active.position-bottom-left {
  animation: slideOutDown 0.3s ease-in;
}

/* ====================================
   ANIMACIONES
   ==================================== */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOutUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}

/* Fix para top-center transform */
.position-top-center.notification-enter-active,
.position-top-center.notification-leave-active {
  left: 50%;
}

.position-top-center.notification-enter-from {
  transform: translate(-50%, -100%);
}

.position-top-center.notification-enter-to {
  transform: translate(-50%, 0);
}

.position-top-center.notification-leave-from {
  transform: translate(-50%, 0);
}

.position-top-center.notification-leave-to {
  transform: translate(-50%, -100%);
}

/* ====================================
   RESPONSIVE
   ==================================== */
@media (max-width: 640px) {
  .notification-container {
    min-width: 280px;
    max-width: calc(100vw - 2rem);
  }

  .position-top-right,
  .position-top-left {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .position-bottom-right,
  .position-bottom-left {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .position-top-center {
    top: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }

  .notification-content {
    padding: 0.875rem;
  }

  .notification-title {
    font-size: 0.875rem;
  }

  .notification-message {
    font-size: 0.8125rem;
  }
}

/* ====================================
   HOVER PAUSE
   ==================================== */
.notification-container:hover .progress-fill {
  animation-play-state: paused;
}
</style>