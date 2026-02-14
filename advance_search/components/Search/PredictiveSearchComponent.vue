 <template>
	<div class="predictive-search-container" v-click-outside="handleClickOutside">
				<!-- Entrada de Busqueda -->
	 <div class="search-input-wrapper">
					<slot name="prefix">
						<i class="search-icon">🔍</i>
					</slot>

					<input type="text" v-model="searchQuery" class="predictive-input"  :class="{ 'has-results': isOpen && hasSuggestions}"
						@focus="handleFocus" @keyboard="handleKeboard" autocomplete="off"
					   :aria-explanded="isOpen" :aria-controls="dropdownid":aria-activedescendant="selectedIndex >= 0 ? 
					      `suggestion-${selectedIndex}` : undefined" role="combobox" >
					      <!-- Indicado de Carga -->
					  <div	 class="loading-indicator">
					  	<div class="spinner-small">
					  	</div>
					  </div>

					  <!-- Boton de Limpieza -->
					  <button  v-else-if="searchQuery"   @click="handleClear" class="clear-btn"
					  	:aria-label="limpiar búsqueda" type="button" 
					   >
					  	 ✕
					  </button>

					  <slot name="suffix">
					  </slot>
				
		  <transtion name="drodown-fade">
				<!-- Dropdown de Sugerencias -->
				<div class="dropdown-loading">
					<div class="spinner">
						<p>Buscando..</p>
					</div>
				</div>
					<!-- Sugerencias -->
				 <template>
				 	<div class="suggestions-group">
				 		<div class="group-header"><i>👨🏼‍🎓</i>
				 		<span>Estudiantes</span></div>
				 	</div>
				 	   <button 
				 	   	 v-for="(suggestion,index) in studentSuggestions"
				 	   	 :key="suggestion.id"
				 	   	class="{
				 	   		selected: selectedIndex === getSuggestionIndex(suggestion)
				 	   		'student-item': true
				 	   	}"
				 	   	@click="handleSelect(suggestion)"
				 	   	@mouseenter="handleHover(getSuggestionIndex(suggestion))"
				 	   	role="option"
				 	   	:aria-selected="selectedIndex === getSuggestionIndex(suggestion)"
				 	   	>
				 	   	
				 		<div class="suggestion-icon"> {{suggestion.icon}}</div>
				 			<div class="suggestion-content">
				 				<div class="sugggestion-title" v-hmtl="highLightMatch(suggestion.title)">{{suggestion.title}}</div>
				 				<div class="sugggestion-subtitle">{{suggestion.content}}</div>
				 					<div   v-if="suggestion.description" class="sugggestion-description">
				 						{{suggestion.description}}
				 					</div>
				 			</div>
				 			<div class="suggestion-arrow">→</div>
				 	</button>
				  </div>

				  <!-- Materiales -->
				  <div class="suggestion-group">
				  	<div class="suggestion-header">
				  		 <i>icon</i>
				  	     <span>Materiales</span>
				  	</div>
				  	<button
				  		v-for="(suggestion,index) in studentSuggestions"
				  		:key="suggestion.id"
				  		class="{
				 	   		selected: selectedIndex === getSuggestionIndex(suggestion)
				 	   		'material-item': true
				 	   	}"
				 	   	@click="handleSelect(suggestion)"
						@mouseenter="handleHover(getSuggestionIndex(suggestion))"
						role="option"
						:aria-selected="selectedIndex === getSuggestionIndex(suggestion)"
				  	>
				    	<div class="suggestion-icon">{{suggestion.icon}}</div>
				    	   <div class="suggestion-content">
				    			<div class="suggestion-icon" v-hmtl="highLightMatch(suggestion.title)"></div> 
				    			<div class="sugggestion-subtitle"> {{suggestion.subtitle}} </div>
				    			<div class="sugggestion-description">  {{suggestion.description}}
				    			  {{suggestion.description}}
				    		   </div>
				    	   </div>				      
				    </button>
				 </div>
		       </template>

		    <!-- Pie de Pagina con ayuda de Teclado -->
		    <div class="dropdown-footer">
		    	<span class="keyboard-hint">
		    		<kbd>↑↓</kbd> Navegar
		    		<kbd>↵</kbd> Seleccionar
		    		<kbd>Esc</kbd> Cerrar
		    	</span>
		    </div>
		  <transtion/>
	</div>
	<!-- inhabilited for comment -->
 </template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue';
  import { usePredictiveSearch } from '@/composables/usePredictiveSearch';
   import type {PredictiveSuggestion,PredictiveSearchOptions} from '@/types/predictive-search.types';

   // Props
    interface Props {
    	placeholder?: string;
    	options?: PredictiveSearchOptions
    	 autofocus?: boolean;
    }

    const props = withDefaults(defineProps<Props>(),{ 
    	placeholder: 'Buscando....',
    	autofocus: false
    });


    // Emits > Emitidos
      const emitir = defineEmits <{
      	'suggestion-selected': [suggestion: PredictiveSuggestion];
      	 'search': [query: string];
      	 'clear': [];
      }>();


      return {
      	searchQuery,
  		suggestions,
  		isLoading,
  		selectedIndex,
  		isOpen,
  		hasSuggestions,
  		selectedSuggestion,
  		studentSuggestions,
  		teacherSuggestions,
  		materialSuggestions,
  		handleKeyDown,
  		selectSuggestion,
  		clear,	//*	
		close,	//*	
      } = usePredictiveSearch(props.options);

      // References On The DOM
       const inputReference = ref<HTMLInputElement | null >(null); 
    const containerRefeence = ref<HTMLDivElement | null >(null); 
     const dropdownid = `predictive-dropdown- ${Math.random().toString(36).substr(2,9)} `;

     // No habia aussencia de metodo, sino metodo con otro nombre
    const handleSelect=(suggestion: PredictiveSuggestion)=>{
     	 emit('suggestion-	selected', suggestion);
     	  searchQuery.value = suggestion.title;
     	   close();
     	    inputReference.value?.blur();
    };
    	// Hacia falta met. de Teclado
    const handleKeboard=(event: KeboarEvent)=>{
    	const result = handleKeyDown(event);

    	if(result && event.key === 'Enter'){
    		handleSelect(result);
    	}
    };

    const handleHover=(index: number)=>{
      	clear();
      	 emit('clear');
      	 inputReference.value?.focus();
    };

    const handleClear=(index: number)=>{
    	clear();
    	emit('clear');
    	inputReference.value?.focus();
    }


    const handleFocus=()=>{
     	if(hasSuggestions.value){
     		 isOpen.value = true;
     	}
    };

    const handleClickOutside=()=>{
    	 close();
    }

    const getSuggestionIndex=(suggestion: PredictiveSuggestion)=>{
    	const suggest = suggestions.value.findIndex(s => s.id=== suggestion.id);
    	  return suggest;
    }

    const highLightMatch =(text: string): string =>{
    	if(!searchQuery.value) return text;

    	    const regex	= new RegExp(` ${searchQuery.value}`, 'gi');
    	 return text.replace(regex, `<mark>$1<mark/>	 `);
    } 

      //  #Directiva v-click outside#
    const vClickOutside = {
    	mounted(el: HTMLDivElement, binding: any){
    	 	el._clickOutside = (event: Event)=>{
    	 	 	if(!(el ===  event.target || el.contains(event.target as Node)) ){
    	 	 		 binding.value();
    	 	 	}
    	 	};
    	 	document.addEventListener('click', el._vClickOutside);
    	}

    	unmounted(el: HTMLElement){
    		document.removeEventListener('click',el._vClickOutside);
    	}
    };


    // Autofocus(Autoenfoque)
     if(props.autofocus){
     	nextTick(()=>{
     		inputReference?.value.focus();
     	});
     }
</script>

<style scoped>

	.predictive-search-container{
		position: relative;
		width: 100%;
	}

	.search-input-wrapper{
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon{
		position: absolute;
		left: 1rem;
		font-size: 1rem;
		color: #94a3b8;
		pointer-events: none;
		z-index: 1;
		
	}
	
	.predictive-input{
				width: 100%;
				padding:  0.875rem 3rem 0.875rem 3rem;
				border: 2px solid #e2e8f0;
				border-radius: 0.75rem;
				font-size: 1rem;
				transition: all 0.2s;
				background: white;

					&.focus{
						outline: none;
						border-color: #3b82f6;
						box-shadow: 0 0 03px rgba(59, 59, 59, 0.1);
				   }

				   &.has-results{
				   	border-bottom-left-radius: 0;
				   	border-bottom-right-radius:0;
					}
		
	}

	.loading-indicator{
 	  position: absolute;
 	  right: 1rem;
	}
		.spinner-small{
			width: 1.25rem;
			height: 1rem;
			border: 2px solid #e2e8f0;
			border-top-color: #3b82f6;
			border-radius: 50%;
			animation: spinn 0.6s linear infinite;
		}
	
	.clear-btn {
		position: absolute;
		right: 1rem;
		border: none;
		font-size: 1.25rem;
		color: #94a3b8;
		cursor: pointer;
		padding:  0.25rem;
		transition: color 0.2s;
		z-index: 1;

		&.hover{
			color: #64748b;
		}
	}	

	.predictive-input{
		&.has-results{

		}

		&.focus{

		}
	}
	
		/*Dropdown*/
	.suggestion-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 2px solid #3b82f6;
		border-top: none;
		border-bottom-left-radius: 0.75rem;
		border-bottom-right-radius: 0.75rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
		max-height: 400px;
		overflow-y: auto;
		z-index: 1000;
	}

	.dropdown-loading{
		 display: flex;
		 align-items: center;
  	 justify-content: center;
  	padding: 2rem;
  	 gap: 1rem;

  		 .spinner{
  		 	 width: 2rem;
  		 	 height: 2rem;
  		 	 border: 3px solid #e2e8f0;
  		 	 border-top-color: #3b8f26;
  		 	 border-radius: 50%;
  		 	 animation: spin 0.8s linear infinite;
  		 }

  		  p{
  		  	 color: #64748b;
  		  	 font-size: 0.875rem;
  		  }
	}

   .suggestion-group{
   	&:not(:last-child){
   		 border-bottom: 1px solid #e2e8f0;
   	}
   }

   .group-header {
   	display: flex;
	  align-items: center;
	  gap: 0.5rem;
	  padding: 0.625rem 1rem;
	  background: #f8fafc;
	  font-size: 0.8125rem;
	  font-weight: 600;
	  color: #475569;
	  text-transform: uppercase;
	  letter-spacing: 0.025em;

	   i{
	   	 font-size: 1rem;
	   }
   }

   .suggestion-item{
   	display: flex;
   	align-items: center;
   	gap: 0.875rem;
   	width: 100%;
   	padding: none;
   	border: none;
   	background: white;
   	text-align: left;
   	cursor: pointer;
   	text-replace: all 0.15s;
   	 
   	 &.hover,
   	 &.selected{
			 background: #f1f5f9;
		 }

		  &.selected{
		  	 border-left: 3px solid #3b82f6;
		  }

		  &.student-item.selected{
				border-left-color: #16a34a;
		  }

		 &.teacher-item.selected{
			 border-left-color: #d97706;
		 }

		 &.material-item.selected{
		 		border-left-color: #3b82f6;
		 }

   }

   .suggestion-icon{
   	 font-size: 1.75rem;
   	 flex-shrink: 0;
   }
   
   .suggestion-content{
   	  flex: 1;
   	  min-width: 0;
   }

   .sugggestion-title{
   	 font-weight: 500;
   	 color: #1e293b;
   	 margin-bottom:  0.125rem;
   	 white-space:  nowrap;
   	 overflow: hidden;
   	 text-overflow:  ellipsis;

   	  :deep(mark){
   	  	background: #fef08a;
   	  	color: #854d0e;
   	  	padding: 0.125rem;
   	  	border-radius: 0.125rem;
   	  }
   }


   .sugggestion-subtitle{
   	 font-size: 0.8125rem;
   	 color: #64748b;
   	 white-space: nowrap;
   	 overflow: hidden;
   	 text-overflow: ellipsis;
   }

   .sugggestion-description{
   	 font-size: 0.75rem;
   	 color: #94a3b8;
   	 margin-top: 0.125rem;
   	 white-space: nowrap;
   	 overflow: hidden;
   	 text-overflow: ellipsis;
   }

   .suggestion-arrow{
   	 font-size: 1.25rem;
   	 flex-shrink: 0;
   	 opacity: 0;
   	 transform: translateX(-0.5rem);
   	  transition: all 0.2s;

   	   .suggestion-item: hover &,
   	    .suggestion-item.selected & {
   	    	opacity: 1;
   	    	transform: translateX(0);
   	    }
   }

   .dropdown-footer{
   		padding: 0.75rem 1rem;
   		background: #f8fafc;
   		border-top: 1px solid #e2e8f0;
   }

   .keyboard-hint{
   	  display: flex;
   	  align-items: center;
   	  gap: 0.75rem;
   	  font-size: 0.75rem;
   	  color: #64748b;

	   kbd{
	   	 padding: 0.125rem ;
	   	 background: white;
	   	 border:  1px solid #cbd5e1;
	   	 border-radius: 0.25rem;
	   	 font-family: monospace;
	   	 font-size: 0.6875rem;
	   	 box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	   }

   }

   /** Animaciones **/
   .dropdown-fade-enter-active
   .dropdown-fade-leave-active{
   	 transition:  all 0.2s ease;
   }

   .dropdown-fade-enter-from,
   .dropdown-fade-leave-to{
   	 opacity: 0;
   	 transform: translateY(-0.5rem);
   }

    @keyframes spin {
   		to { transform: rotate(360deg); }
    }

    /*Scroll-bar Personalizado*/
    .suggestion-dropdown {
    	
    	&::-webkit-scrollbar-track{
    		 background: #f1f5f9;
    	}
    	
    	&::-webkit-scrollbar-thumb{
  	    	background: #cbd5e1;
    		  border-radius: 0.25rem;

  	    	&:hover{
  	    		 background: #94a3b8;
  	    	}
    	}

    }
   /*Resposividad*/
   @media(max-width: 768px){
   	  .suggestion-dropdown{
   	  	max-width: 300px;
   	  }

   	  .sugggestion-description{
   	  	display: none;
   	  }
   }

   @media (prefers-color-scheme: dark) {
   		 .predictive-input{
   		 	  background: #1e293b;
   		 	  color: #e2e8f0;
   		 	  border-color: #334155;
   		 }

   		 .suggestion-dropdown{
					background:  #1e293b;
					border-color: #334155;
				}

				.suggestion-item{
					 background: #1e293b;

					 &:hover,
					 &:selected
					 {
					 	 background: #334155;
					 }
				}

				.group-header,
				.dropdown-footer {
					 background: #0f172a;
				}

				kbd{
					 background: #334155;
					 border-color: #475569;
				}
   }
</style> 