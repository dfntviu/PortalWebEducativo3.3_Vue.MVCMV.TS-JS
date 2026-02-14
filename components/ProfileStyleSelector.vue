 <template>
 	<div class="profile-style-selector">
 		<div class="styles-grid">
 			<div v-for="style in profileStyles" class="style-card" :class="{selected: isSelected(style.id) }"
 			  @click="selecStyle(style.id)" >
 			    <!-- Style Preview -->
 			    <div class="style-preview">
 			    	<div class="profile-demo" :class="`profile-${style.id}`" @click="selectStyle(style.id)" >
 			    		<img src="Preview" alt="https://ui-avatars.com/api?/?name=Usuario&background=2C5F2D&color=fff&size=200">
 			    	</div>
 			    </div>

 				 <!-- Style Info -->
 				<div class="style-info">
 					<h4 class="style-name">
 						<h4 class="style-name"> {{style.name}} </h4>
 						 <p class="style-description"> {{style.description}} </p>
 					</h4>
 				</div>

 					<!-- Indicador Selector -->
 				<div v-if="isSelected(style.id)" class="selected-indicator">
 					<svg xmlns="http://w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
 						<polyline points="20 6 9 17 4 12">
 					</svg>
 				</div>
 			</div>

 		</div>

 	</div>
 </template>

 <script setup lang="ts">
 	 import { computed } from 'vue';
 	 import type { ProfilePhotoStyle } from '@/types/personality.types';

 	 // Props
 	  interface Props {
 	  	 selectedStyle: ProfilePhotoStyle;
 	  }

 	  const props = defineProps<{
 		 'update:style [style: ProfilePhotoStyle]'
 	  }>();

 	  // Styles configuration
 	   const profileStyles = [
 	   	 	{
 	   	  	   id: 'circle' as ProfilePhotoStyle
 	   	  	   name: 'Circular'
 	   	  	   description: 'Estilo clasico y profesional'
 	   	  	},
 	   	  	{
 	   	  		id: 'circle'
				name: 'Circular'
				description: 'Estilo Clásico y profesional'
 	   	  	},
 	   	  	{
 	   	  		id: 'oval' as ProfilePhotoStyle,
				name: 'Ovalado',
				description: 'Forma elegante y distintiva'
 	   	  	},
 	   	  	{
 	   	  		id: 'square' as ProfilePhotoStyle,
				name: 'Cuadrado',
				description: 'Moderno y minimalista'
			},
			{
				id: 'hexagon' as ProfilePhotoStyle,
				name: 'Hexagono',
				description: 'Creativo y original'
			},
 	   ]

 	   const isSelected = (styleId: ProfilePhotoStyle): boolean => {
 	   	     return props.selectedStyle === styleId;
 	   }

 	   const selectStyle = (styleId: ProfilePhotoStyle): void =>{
 	   	   emit('update:style', styleId);
 	   }
 </script>
 
 <style scoped>
 	.profile-style-selector{
 		width: 100%;
 	}

 	.styles-grid{
 		display: grid;
 		grid-template-columns: repeat(auto-fill, min(200px, 1fr));
 		gap: 1rem;
 	}

 	.style-card{	
 		position: relative;
 		background: white;
 		border: 2px solid #e5e7eb;
 		border-radius: 0.75rem;
 		padding: 1.5rem;
 		cursor: pointer;
 		transition: all 0.2s ease;
 	}

 	.style-card: hover {
 		border-color: var(--primary-color, #2C5F2D);
 		transform: translateY(-2px);
 		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 	}

 	.style-card.selected {
 		border-color: var(--primary-color, #2C5F2D);
 		border-width: 3px;
 		box-shadow: 0 0 0 3px rgba(44, 95, 45, 0.1);
 	}

 	.style-preview{
 		display: flex;
 		justify-content: center;
 		margin-bottom: 1rem;
 	}

 	.profile-demo{	
 		width: 100%;
 		height:100%;
 		overflow: hidden;
 		transition: all 0.3s ease; 
 	}

 	.profile-demo img {
 		 width: 100%;
 		height:100%;
 		object-fit: cover;
 	}
 	/* Profile Styles */
 	.profile-circle {
 		border-radius: 50%;
 	}

 	.style-card: hover .profile-circle{
 		transform: rotate(360deg);
 	}

 	.profile-oval{
 		border-radius: 50%/ 60%;  /*radio-horizontal, r. vertical*/
 	}

 	.style-card: hover .profile-oval{
 		border-radius: 60% / 50%;
 	}

 	.profile-square {
 		border-radius: 8px;
 	}

 	.style-card: hover .profile-square{
       border-radius: 16px;
       transform: rotate(-5deg);
 	}

 	.profile-hexagon{
 		clip-path: polygon(50% 0%, 100% 25%, 100% 75%,50% 100%, 0% 75%, 0% 25%);
 	}

 	.style-card: hover  .profile-hexagon{
 		transform: scale(1.05);
 	}

 	.style-info{
 		text-align: center;
 	}

 	.style-name{
 		font-size: 1.0625rem;
 		font-weight: 600;
 		color: #1f2937;
 		margin: 0 0 0.5rem 0;
 	}

 	.style-description{
 		font-size: 0.8125rem;
 		color: #6b7280;
 		margin: 0;
 	}
 	
 	.selected-indicator{
 		position: absolute;
 		 top: 0.75rem;
 		 right: 0.75rem;
 		 width: 2rem;
 		 height: 2rem;
 		 background: var(--primary-color, #2C5F2D);
 		 border-radius: 50%;
 		 display: flex;
 		 align-items: center;
 		 justify-content: center;
 		 color: white;
 	}

 	.selected-indicator svg {	
 		width: 1.25rem;
 		height: 1.25rem;
 		stroke-width: 3;
 	}

 	@media(max-width: 768px){
 		.styles-grid{
 			grid-template-columns: repeat(2, 1fr);
 		}
 		
 		.profile-demo{
 			 width: 100px;
 			height: 100px;
	 	}
 	}
 </style>