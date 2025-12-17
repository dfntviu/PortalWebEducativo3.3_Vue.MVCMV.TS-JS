<template>
	<div class="palette-selector">
		<div class="palettes-grid">
			<div
			   v-for="palette in palettes"
			   :key="palette.id" 
			  class="palette-card"
			  :class= "{ selected: isSelected(paletteId) }"
			  @click="selectedPalette(palette.id)" >
				<div class="color-preview">
					<div class="color-bar" :style="{ backgroundColor: palette.colors.primary  } ">
						
					</div>
					<div class="color-bar " :style="{backgroundColor: palette.colors.secondary}">
						
					</div>
					<!-- ?? -->
					<div class="color-bar" :style="{backgroundColor: palette.colors.accent}">
						
					</div>
				</div>
			</div>
			<!-- Informacion de la Paleta-->
			<div class="palette-info">
				<h4 class="palette-name">{palette.name}
					<p class="palette-description">{{ palette.description}}</p>
				</h4>
			</div>
			<!-- Selector Posicion Paleta -->
			<div v-if="isSelected(paletteId)" class="selected-indicator">
			  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
			     fill="none" stroke="currentColor" >
			  	<popyline points="20 6  9 17 4 12" />
			  <svg/>
			</div>
				
		</div>
	</div>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import {ColorPalette, PaletteType} from '@/interfaces/Personality.types.ts';

	// Props
	interface Props {
		selectedPalette: ColorPalette | null;
		palettes: ColorPalette[];
	}

		const props = defineProps<Props>();

		// Emmitidos
		 const emit = defineEmits<{
		 	'upadate: palette': [paletteId: PaletteType]
		 }>();
		 // Computados
		   const isSelected = (paletteId:PaletteType): boolean =>{
		   	   props.selectedPalette?.id === paletteId;
		   }

		   // Me
		   const selectPaletter = (paletteId:PaletteType): boolean =>{
		   	   emit('upadate: palette', paletteId);
		   }
</script> 
 <!-- Pendiente 01-->
<style scoped>
	.palette-selector{
		width: 100%;
	}

	.palette-grid{
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;  /*Sep. entre tarjetas(cards) */
	}

	.palette-card{
		position: relative;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.palette-card: hover{
		border-color: var(--primary-color, #2C5F2D);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.palette-card.selected{
		border-color: var(--primary-color, #2C5F2D);
		transform:  translateY(-2px);
		box-shadow: 0 0 0 3px rgba(44, 95, 45, 0.1);
	}

	.color-preview{
		display: flex;
		height: 80px;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.color-bar{
		flex: 1;
		transition: flex 0.3s ease;
	}

	.palette-card: hover .color-bar{
		flex: 1.2;
	}

	.palette-card: hover .color-bar:not(:hover) {
		flex: 0.9;
	}

	.palette-info{
		padding: 0.5rem 0;
	}

	.palette-name{
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0 0.25rem 0;
	}

	.palette-description{
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}

	.selected-indicator {
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

	/* Responsividad */
	@media (max-width: 768px) {
		.palette-grid{
			grid-template-columns: 1fr
		}
	}}
</style>