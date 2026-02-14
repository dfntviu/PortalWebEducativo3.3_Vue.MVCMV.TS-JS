 <template>
 	<div class="background-selector">
 		<div class="backgrounds-grid">
 			<!--Opcion: Sin Fondo -->
 			<div class="background-card no-background"
 			     :class="{selected: selectedBackground}"
 					@click="selectedBackground(null)"
 			 >
 				<div class="no-bg-content">
 					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            				<line x1="18" y1="6" x2="6" y2="18"/>
            				<line x1="6" y1="6" x2="18" y2="18"/>
          			</svg>
          			<span>Sin Fondo</span>
 				</div>	
 				<div v-if="!selectedBackground" class="selected-indicator">
 					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            				<polyline points="20 6 9 17 4 12" />
          			</svg>
 				</div>	
 				  <!-- Backgrounds images -->
 				<div  v-for="background in backgrounds"   :key="background.id" class="backgrounds-card" 
 				   :class="{ selected: isSelected(background.id) } ">
 				   <!-- Image Preview -->
 				      <div class="background-preview">
 				      	<img src="background.thumbnail" alt="background-name" loading="lazy">
 				      </div>
 				      <div class="preview-overlay">
 				      	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none" stroke="currentColor">
 				      		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
 				      			<circle cx="12" cy="12"  r="3"/>
 				      	</svg>
 				      </div>
 				      <!-- Background info -->
 				      <div class="background-info">
 					      <h4 class="background-name">{{background.name}}</h4>
 					  </div>
 					  <!-- Selected Indicator -->
		 				<div  v-if="isSelected(background.id)" class="selected-indicator">
		 					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none" stroke="currentColor">
		 						<polilyne points="20 6 9 17 4 12">
		 				    <svg/>
		 				</div>
 				</div>	
 			</div>
 			<!-- Full Preview Modal -->
 			<Teleport to="body">
 				<Transition name="modal">
 					<div class="preview-modal">
 						<div class="modal-content" @click.stop>
 							<button class="close-button" @click="closePreview">
 								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none" stroke="currentColor">
								  <line x1="18" y1="6" x2="6" y2="18"/>
								  <line x1="6" y1="6" x2="18" y2="18"/>
								<svg/>
 							</button>
 							<img src="previewImage.url" alt="previewImage.name">
 							<p class="preview-name"> {{previewImage.name}} </p>
 						</div>
 					</div>
 				</Transition>
 			</Teleport>
 		</div>
 	</div>
 			 <!-- Container for Backgrounds(Imagenes de Fondo) -->
 </template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { BackgroundImage }from '@/interfaces/Personality.types.ts';

	// Props
	interface Props {
		selectedBackground: BackgroundImage | null;
		palettes: BackgroundImage[];
	}

		const props = defineProps<Props>();

		// Metodo Emitido
		 const emit = defineEmits<{
		 	'upadate: backgrounds': [imageId: string | null];
		 }>();

		  //  State 
		 const previewImage = ref<BackgroundImage | null>();
		 	
		 /*  ================= Methods =================  */
		 //Desc: For preview - Interface Seleccion de Fondo
		const isSelected = (imageId:string): boolean =>{
		   	   props.selectedBackground?.id === imageId;
		}

		const selectedBackground = (imageId: string | null): void =>{
		   	   emit('update:background',imageId)
		}

		const showPreview = (background: BackgroundImage): void =>{
		   	   previewImage.value = background;
		}

		const closePreview = (): void =>{
		   	   previewImage.value = null;
		}

</script>
<!-- Continuando..-->
<style scoped>
	.background-selector{
		width: 100%;
	}

	.backgrounds-grid{
		display: grid;
		grid-template-columns: repeat(auto-fill, min(200px, 1fr));
		gap: 1rem;
	 }

	 .background-card{
	 	position: relative;
	 	background: white;
	 	border: 2px solid #e5e7eb;
	 	border-radius: 0.75rem;
	 	overflow: hidden;
	 	cursor: pointer;
	 	transition: all 0.2s ease;
	 }

	 .background-card: hover{	
	 	border-color: var(--primary-color, #2C5F2D);
	 	transform: translateY(-2px);
	 	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	 }
	 .background-card.selected {
	 	border-color: var(--primary-color,#2C5F2D);
	 	transform: translateY(-2px);
	 	border-width: 3px;
	 	box-shadow: 0 0 0 3px rgba(44, 95, 45, 0.1);
	 }
	 
	 .no-background{
	 	aspect-ratio: 16/9;
	 	display: flex;
	 	align-items: center;
	 	justify-content: center;
	 	background: linear-gradient(135deg, #f3f4f6, #e5e7eb, 100%);
	 }

	 .no-bg-content{
	 	display: flex;
	 	flex-direction: column;
	 	align-items: center;
	 	gap: 0.5rem;
	 	counter-reset: #6b7280;
	 }

	 .no-bg-content svg{
	 	width: 3rem;
	 	height: 3rem;
	 	stroke-width: 2;
	 }

	 .no-bg-content span{
	 	font-weight: 600;
	 }
	 /* Background- Preview */
	 .background-preview{
	 	position: relative;
	 	aspect-ratio: 16/9;
	 	overflow: hidden;
	 }	

	 .background-preview img{
	 	width: 100%;
	 	height: 100%;
	 	object-fit: cover;
	 	transition: transform 0.3s ease;
	 }
	 
	 .backgrounds-card: hover .background-preview: img {
	 	 transform: scale(1.05);
	 }

	 .preview-overlay{
	 	position: absolute;
	 	inset: 0;
	 	background: rgba(0, 0, 0, 0.6);
	 	display: flex;
	 	flex-direction: column;
	 	align-items: center;
	 	justify-content: center;
	 	gap: 0.5rem;
	 	transition: opacity 0.2s ease;
	 	color: white;
	 }

	 .backgrounds-card: hover .preview-overlay{
	 	opacity: 1;
	 }	

	 .preview-overlay svg{
	  	width: 2rem;
	  	height: 2rem;
	  	stroke-width: 2;
	 }

	 .preview-overlay span {
	 	font-weight: 600;
	 	font-size: 0.875rem;
	 }
	   /* Background Info */
	 .background-info{
	 	padding: 0.75rem;
	 }	

	 .background-name{
	 	font-size: 0.9375rem;
	 	font-weight: 600;
	 	color: #1f2937;
	 	margin: 0;
	 	white-space: nowrap;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 }
	 	/* Indicador Selector */
	 .selected-indicator {
	 	position: absolute;
	 	top: 0.75rem;
	 	right: 0.75rem;
	 	width: 2rem;
	 	height: 2rem;
	 	background: var(--primary-color,#2C5F2D);
	 	border-radius: 50%;
	 	display: flex;
	 	align-items: center;
	 	justify-content: center;
	 	color: white;
	 	z-index: 10;
	 }
	 .selected-indicator svg{
	 	width: 1.25rem;
  		height: 1.25rem;
  		stroke-width: 3;
	 }
	 	/*Preview Modal*/
	 .preview-modal{
	 	position: fixed;
	 	inset: 0;
	 	background: rgba(0, 0, 0, 0.9);
	 	display: flex;
	 	align-items: center;
	 	justify-content: center;
	 	z-index: 999;
	 	padding: 2rem;
	 }
	 .modal-content{
	 	position: relative;
	 	max-width: 90vw;
 	    max-height: 90vh;
	 }

	 .modal-content img{
	 	max-width: 100%;
 	    max-height: 80vh;
 	    border-radius: 0.5rem;
 	    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
	 }

	 .preview-name{
	 	text-align: center;
	 	color: white;
	 	font-weight: 600;
	 	margin-top: 1rem;
	 }

	 .close-button{
	 	position: absolute;
	 	top: 1rem;
	 	right: 0;
	 	background: white;
	 	border: none;
	 	border-radius: 50%;
	 	 width: 2.5rem;
	 	 height: 2.5rem;
	 	 display: flex;
	 	 align-items: center;
	 	 justify-content: center;
	 	 cursor: pointer;
	 	 transition: all 0.2s ease;
	 }

	 .close-button : hover{
	 	transform: scale(1.1);
	 }
	 
	 .close-button svg{
	 	width: 1.5rem;
  		height: 1.5rem;
  		stroke-width: 2;
	 }

	 /* Modal of transition */
	 .modal-enter-active,
	 .modal-leave-active{
	 	transition: opacity 0.3s ease;
	 }

	 .modal-enter-from,
	 .modal-leave-to{
	 	opacity: 0;
	 }

	 /* Responsive */
	 @media (max-width: 768px){
	 	.backgrounds-grid{
	 		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	 	}
	 }

</style>