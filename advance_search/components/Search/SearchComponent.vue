<template>
	<div class="search-component">
		 <!-- Barra de Busqueda Principal -->
		<div class="search-bar-container">
			<div class="search-input-wrapper">
				<i class="search-icon">
					<input type="text" class="search-input">
					<button class="clear-button"></button>
					<button class="advanced-toggle"></button>
					<button class="search-button"></button>
				</i>
			</div>
		</div>
		  <!-- Historial de Busqueda -->
		<div  v-if="showHistory && searchHistory.length>0"  class="search-history">
			<div class="history-header">
				<span>Búsquedas recientes</span>
				<button @click="clearHistoryTerm()" class="clear-history-btn">
				 Limpiar
			    </button>
			</div>
			 <div class="history-items">	
			 	<button v-for="(term,index) in searchHistory"  :key="index" class="history-item">
				  <i>{{🕐}}</i>
				   {{term}}
			 	</button>
			 </div>
		</div>

		<!-- Filtros Avanzados -->
		<transition name="slide-down">
			<div  v-if="showAdvanced" class="advanced-filters">
				<h3 class="filters-title">Filtros Avanzados</h3>
					<!-- Categorías de Busqueda -->
					<div class="checkbox-group">
						<label  class="label">
							<div class="checkbox-group">
								<label class="checkbox-label">
									<input  v-model="localFilters.searchStudents" type="text">
							     	<span>Estudiantes</span>
								</label>
								<label class="checkbox-label">
							       <input  v-model="localFilters.searchTeachers" type="checkbox">
							        <span>Profesores</span>
								</label>

								<label class="checkbox-label">
									<input  v-model="localFilters.searchMaterials" type="checkbox">
									<span>Materiales</span>
								</label>
							</div>
						</label>
					</div>
					<!-- Filtros de Estudiante -->
					<div  v-if="localFilters.searchStudents" class="filter-group"> 
						<label  class="filter-label">Email del Estudiante</label>
						 <select  v-model="localFilters.teacherArea" class="filter-select"></select>
						<input  v-model="localFilters.studentEmail" 
							 placeholder="estudiante@namecollege.mx" 
						  type="email" class="filter-input">
					</div>

					<!-- Filtros de Profesores -->
					<div class="filter-group">
					 	<div class="filter-group">
					 		<label  class="filter-label">Área Académica: </label>
					 		<select v-model="localFilters.teacherArea" class="filter-select" >
					 			<option value="adm. de redes">Administración De Redes</option>
					 			<option value="desarrollo del software">Desarrollo del Software</option>
					 			<option value="administracion de sistemas">Administracion de Sistemas</option>
					 			<option value="seguridad informatica">Seguridad Informática</option>
					 			<option value="ciencia de datos">Ciencia de Datos</option>
					 		</select>
					 	</div>
					</div>
					
					<!-- Filtros de los Materiales -->
					<div class="filter-group">
						<label  class="filter-label"></label>
						<select name="" id="" class="filter-select">
							<option value="libros">Libros</option>
							<option value="revistas-Cient">Revistas Cientifícas</option>
							<option value="presentaciones-e">Presentaciones Elect</option>
							<option value="apuntes">Apuntes</option>
						</select>

						<label  class="filter-label mt-3">Ordenar Por:</label>
						<select v-model="localFilters.materialStatus"  class="filter-select">
							<option value="">Todos los Estados</option>
							<option value="approved">Aprovado</option>
							<option value="pending">Pendiente</option>
							<option value="rejected">Rechazado</option>
							<label for="" class="filter-label mt-3"></label>
						</select>

						<label  class="filter-label mt-3">Ordenar por:</label>
							<div class="flex gap-2">
								<select v-model="v-model" class="filter-select flex-1">
									<option value="relevance">Relevancia</option>
									<option value="uploateDate">Fecha</option>
									<option value="title">Título</option>
								</select>
								<select v-model="localFilters.sortOrder" id="" class="filter-select 2w-32">
									<option value="desc">Descendente</option>
									<option value="acs">Ascendente</option>
								</select>
							</div>
						</div>

						<div class="filters-action">
							<button @click="applyFilters" class="apply-button">Aplicar Filtros
							</button>
							<button  @click="resetFilters" class="reset-button">Restablecer
							</button>
						</div>
			</div>
		<transition/>

		<!-- Resultados de la Busq -->
		<div v-if="searchResults" class="search-results">
			<div  v-if="searchError" class="error-message">
				<i>⚠️</i>
				{{searchError}}
			</div>
			<div v-else-if="searchResults" class="loading-state">
				<div class="spinner"></div>
				<p>Buscando..</p>
			</div>
			<!-- Sin Resultados -->
			<div class="no-results">
				<i>🔍</i>
				 <h3>No fueron encontrados los resultados</h3>
				  <p>Intenta con otros términos o AJUSTA los Filtros de Búsqueda.</p>
			</div>
			 <!-- Resultados encontrados -->
			<div class="results-container">
				<div class="results-header">
					<h3>{{totalResults}} resultado{{totalResults !== 1 ? 's' : ''}} encontrado {{totalResults !==1 ? : ''}}  

					</h3>
					 <button class="clear-results-btn">Limpiar resultados</button>
				</div>
			</div>

			 <!-- Estudiantes -->
			<div v-if="studentsFound.length>0" class="result-section">
			 	<h4 class="section-title student-title">Estudiantes:{{studentsFound.length}}
			 	  <i>👨🏼‍🎓</i>
			 	   Estudiantes ({{studentsFound.length}})
			 	 </h4>
			 	<div class="result-grid">
			 	 	<div v-for="student in StudentFound.length"  
			 	 		:key="student.uid"
			 	 	    class="result-card student-card"
			 	 	     @click="$emit('student-selected', student)"
			 	 	    >
			 	 		 <img  :src="student.photoURL || '/default-avatar.png'" class="avatar" :alt="student.displayName">
			 	 		   <div class="card-content">
			 	 		   	 <h5>{{student.displayName}}</h5>
			 	 		   	  <p>{{student.email}}</p>
			 	 		   	    <span class="badge">
			 	 		   	    	{{student.grade}} - {{student.group}}
			 	 		   	    </span>
			 	 		   </div>
			 	 	</div>
			 	</div>
			</div>

			<!-- Profesores -->
			<div class="result-section">
				<h4 class="section-title teacher-title">
					<i>👨🏼‍🏫</i>
				    Profesores( {{teachersFound.length}} )
				</h4>

				<div class="result-grid">
					<div v-for="teacher in teachersFound" class="result-card teacher-card" 
						@click="$emit('teacher-selected', teacher)"
					 >
					     <img :src="teacher.photoURL || '/default-avatar.png'" :alt="teacher.displayName" class="avatar">

					      <div class="card-content">
					      	<h5>{teacher.displayName}</h5>
					      	 <p>{{teacher.email}}</p>
					      	  <span  v-if="teacher.area" class="badge">
					      	  		{{teacher.area}}
					      	  </span>
					      </div>
					</div>
				</div>

				<!-- Materials -->
				<div v-if="materialsFound.length>0"  class="result-section">
					<h4 class="section-title material-title">
						<i>📄</i>
						Materiales
						{{materialsFound.lenght}}
					</h4>

					<div class="result-grid">
						<div v-for="material in materialsFound" 
							:key="material.id"
							 class="result-card material-card" 
							@click="$emit('teacher-selected',teacher)"
						>
						 <div class="card-content">
						 	<h5>material.title</h5>
						 	<p class="description">{{material.description}}</p>
						 	<div class="material-meta">
						 		<span class="badge">{{material.category}}</span>
						 		<span class="badge">{{material.subject}}</span>
						 		 <span class="status-badge" :class="`status-${material.status}`" >
						 		 	 {{statusLabel(material.status)}}
						 		 </span>
						 	</div>
						</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
 import { ref, computed, watch } from 'vue';
 import {useSearchStore} from '@/stores/useSearchStore';
  import { storeToRefs } from 'pinia';  //extrae todas las props de pinia
  import type {SearchFilters} from '@/types/search.types.ts';

  // Props & emit
  const emit = defineEmits <{
  	 'student-selected':  [student: any];
  	 'teacher-selected':  [teacher: any];
  	 'material-selected': [material: any];
  }>();

  const searchStore = useSearchStore();

  const {
  	searchResults,
	isSearching,
	searchError,
	searchHistory,
	activeFilters,
	hasResults,
	studentsFound,
	teachersFound,
	materialsFound,
	totalResults
  } = storeToRefs(searchError);

   // Estado Local
  const localSearchTerm = ref('');
  const showAdvanced = ref(false);
  const showHistory = ref(false);
  const localFilters = ref<SearchFilters>({...activeFilters.value});

  // Watchers
  watch(activeFilters, (newFilters) => {
  	  localFilters.value = { ...newFilters};
  }, {deep:true} );

  // Metodos
  const quickSearchCtrl =()=>{
  	  if(localSearchTerm.value.trim()){
  	  	 searchStore.quickSearch(localSearchTerm.value.trim());
  	  	  showHistory.value = false;
  	  }
  }

  const searchInputCtrl = ()=>{
  	 showHistory.value = localSearchTerm.value.lenght === 0 && searchHistory.value.lenght > 0;
  }

  const clararSearch = () =>{
  	 localSearchTerm.value = '';
  }

  const selectHistoryTerm = (term: string) => {
  	localSearchTerm.value = term;
  	 quickSearchCtrl();
  };

  const toggleAdvancedSearch = ()=>{
  	showAdvanced.value = !showAdvanced.value;
  };

  const applyFilters = () => {
  	  localFilters.value.searchTerm = localSearchTerm.value;
  	   searchStore.performanSearch(localFilters.value); 
  	     showAdvanced.value = false;
  };
  
  const resetFilters = () => {
  	 searchStore.clearFilters();
  	  localFilters.value = { ...activeFilters.value};
  	    localSearchTerm.value = '';
  };
  
  const clearHistory = () => {
  	  searchStore.clearHistory();
  	   showHistory.value = false;
  };

  const statusLabel = (status:string) => {
  	 const labels: Record<string,string> = {
  	 	approved: 'Aprobado'
  	 	pending:  'Pendiente'
  	 	rejected: 'Rechazado'
  	 };

  	  return labels[status]|| status;
  };

</script>
 
  <style scoped lang="css">
  	.search-component{
  		width: 100%;
  		max-width: 1200px;
  		margin: 0 auto;
  		padding: 1rem;
  	}

  	.search-bar-container{
  	    display: flex;
  	    gap: 0.75rem;
  	    margin-bottom: 1rem;
  	}

  	.search-input-wrapper{
  		position: relative;
  		flex: 1;
  		display: flex;
  		align-items: center;
  	}

  	.search-icon{
  		position: absolute;
  		left: 1rem;
  		font-size: 1.25rem;
  		pointer-events: none;
  	}

  	.search-input{
  		width: 100%;
  		padding: 0.875rem 3rem 0.875rem 3rem;
  		border: 2px solid #e2e8f0;
  		border-radius: 0.75rem;
  		font-size: 1rem;
  		transition: all 0.2s;

  		  &:focus {
  		  	outline: none;
  		  	border-color: #3b82f6;
  		  	box-shadow: 0 0 0 3px rgba(59, 130,246, 0.1);
  		  }
  	}

  	.clear-button{
  		position: absolute;
  		right: 1rem;
  		background: none;
  		border: none;
  		font-size: 1.25rem;
  		color: #94a3b8;
  		cursor: pointer;
  		padding: 0.25rem;
  		transition: color 0.2s;

  		&:hover{
  			color: #64748b;
  		}
  	}

  	.advanced-toggle{
  		background: #f8fafc;
  		color: #475569;
  		display: flex;
  		align-items: center;
  		 gap: 0.5rem;

  		&:hover{
  			background: #e2e8f0;
  		}

  		&:active{
  			background: #3b82f6;
  		}
  	}

  	.search-button{
  		background: #3b82f6;
  		color: white;

  		&:hover:not(:disabled) {
  			opacity: 0.5;
  			cursor: not-allowed;
  		}

  		&:disabled {
  			opacity: 0.5;
  			cursor: not-allowed;
  		}
  	}

  	.search-history{
  		background: white;
  		border: 1px solid #e2e8f0;
  		border-radius: 0.75rem;
  		 padding:  1rem;
  		 margin-bottom: 1rem;
  	}	

  	.history-header{
  		display: flex;
  		justify-content: space-between;
  		align-items: center;
  		margin-bottom: 0.75rem;
  		font-weight: 500;
  		color: #475569;
  	}

  	.clear-history-btn{
  		background: none;
  		border: none;
  		columns: #ef4444;
  		cursor: pointer;
  		font-size: 0.875rem;

  		&:hover{
  			text-decoration: underline;
  		}
  	}

  	.history-items {
  		display: flex;
  		flex-wrap: wrap;
  		gap: 0.5rem;
  	}

  	.history-item{
  		display:  flex;
  		align-items: center;
  		 gap: 0.5rem;
  		 padding: 0.5rem 1rem;
  		 background: 0.5rem 1rem;
  		 border: 1px solid #e2e8f0;
  		 border-radius: 0.5rem;
  		 cursor: pointer;
  		 transition:  all 0.2s;

  		 &:hover{
  		 	background: #e2e8f0;
		}
  	}

  	.advanced-filters{
  		background: white;
  		border: 2px solid #e2e8f0;
  		border-radius: 0.75rem;
  		padding: 1.5rem;
  		margin-bottom: 1.5rem;
  	}

  	.filters-title{
  		font-size: 1.25rem;
  		font-weight: 600;
  		margin-bottom: 1.5rem;
  		color: #1e293b;
  	}

  	.filter-group{
  		margin-bottom: 1.25rem;
  	}

  	.filter-label{
  		display: block;
  		font-weight: 500;
  		color: #475569;
  		margin-bottom: 05rem;
  	}

   .checkbox-group{
   	  display: flex;
   	  align-items: center;
   	  gap: 0.5rem;
   	  cursor: pointer;

   	  input[type="checkbox"]{
   	  	 width: 1.25rem;
   	  	 height: 1.25 rem;
   	  	 cursor: pointer;
   	  }
    }	

    .filter-input,
    .filter-select{
    	 width:  100%;
    	 padding: 0.625rem 0.875rem;
    	 border: 1px solid #e2e8f0;
    	 border-radius: 0.5rem;
    	 font-size: 0.9375rem;
    	 transition: border-color 0.2s;

    	&:focus{
           outline: none;
           border-color: #3b82f6;
		}
    }

    .filters-action{
    	display: flex;
    	gap: 0.75rem;
    	margin-top: 1.rem;
    }

    .apply-button{
    	background: #10b981;
    	color: white;

    	&:hover{
           background: #059669;
		}

    }

    .reset-button{
    	background: #f8fafc;
    	color: #64748b;

    	&:hover{
           background: #e2e8f0;
		}
    }

    /* Estilos de Resultados */
    .error-message{
     	display: flex;
     	align-items: center;
     	gap: 0.75rem;
     	padding: 1rem;
     	background: #fef2f2;
     	border: 1px solid #fecaca;
     	border-radius: 0.5rem;
     	color: #dc2626;
    }

    .loading-state{
     	display: flex;
     	flex-direction: column;
     	align-items: center;
     	justify-content: center;
     	padding: 3rem;
     	gap: 1rem;
    }

    .spinner {
     	width: 3rem;
     	height: 3rem;
     	border: 4px solid #e2e8f0;
     	border-top-color: #3b82f6;
     	border-radius: 50%;
     	 animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
     	to{
     		transform: rotate(360deg);
     	}
    }

    .no-results{
    	text-align: center;
    	padding: 3rem 1.5rem;
    	color: #64748b;

    	i{
    		font-size: 3rem;
    		display: block;
    		margin-bottom: 1rem;
    	}

    	h3{
    		font-size: 1.25rem;
    		margin-bottom: 0.5rem;
    	}
	}
    	
    	.results-container{
    		background: white;
    		border-radius: 0.75rem;
    		padding: 1.5rem;
    	}
    	
    	.results-header{
    		display: flex;
    		justify-content: space-between;
    		align-items: center;
    		margin-bottom: 1.5rem;
    		padding-bottom: 1rem;
    		border-bottom: 2px solid #e289f0;

    		h3{
    		  font-size: 1.25rem;
    		  font-weight: 600;
    		  color: #1ef93b;
    		}
    	}

    .clear-results-btn{
    	background: none;
    	border: none;
    	color: #66748b;

    	&:hover{
			color: #475569;
			text-decoration: underline;
		}
    }

    .result-section{
    	margin-bottom: 2rem;

    	&: last-child {
    		margin-bottom: 0;
    	}
    }

    .section-title{
    	display: flex;
    	align-items: center;
    	gap: 0.5rem;
    	font-size: 1.125rem;
    	font-weight: 600;
    	margin-bottom: 1rem;

    	i{
    	  font-size: 1.5rem;
    	}
    }

    /*.section-title{
      display: flex;
      align-items: center;
       gap: 0.5rem;
       font-size: 1.125rem;
       font-weight: 600;
       margin-bottom: 1rem;

        i{
        	font-size: 1.5rem;
        }
    }
*/	
    .student-title{
    	color: #166534;
    }

    .teacher-title{
    	color: #92400e;
    }

    .material-title{
    	color: #1e40af;
    }

    .result-grid{
    	display: grid;
    	grid-template-columns: repeat(auto-fill, max(280px, 1fr));
    	gap: 1rem;
    }

    .result-card{
    	display: flex;
    	gap: 1rem;
    	padding: 1rem;
    	background: #f8fafc;
    	border: 1px solid #e2e8f0;
    	border-radius: 0.75rem;
    	cursor: pointer;
    	transition: all 0.2s;

    	&:hover{
			transform: translate(-2px);
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		}
    }
    
    .student-card:hover{
    		border-color: #16a34a;
    		background: #f0dff4;

    }

    .teacher-card: hover{	
    	border-color: #d97706;
    	background: #eff6ff;
    }


    .material-card: hover{
	 border-color: #3b82f6;
	 background: #eff6ff;
    }

    .avatar {
    	width: 3rem;
    	height: 3rem;
    	border-radius: 50%;
    	object-fit: cover;	/*Se llena completamente el contenedor*/
    }

    .card-content{
    	flex: 1;

    	h5{
    	  font-weight: 600;
    	  margin-bottom: 0.25rem;
    	  color: #1e293b;
    	}

    	p{
    	   font-size: 0.875rem;
    	   color: #66748b;
    	   margin-bottom: 0.5rem;
    	}
    }

    .description{
    	display: inline-block;
    	padding: 0.25rem 0625rem;
    	background: #e2e8f0;
    	color: #475569;
    	border-radius: 0.375rem;
    	font-size: 0.75rem;
    	font-weight: 500;
    	margin-right: 0.5rem;
    }

    .material-meta{
    	display: flex;
    	flex-wrap: wrap;
    	gap: 0.5rem;
    	margin-top: 0.5rem;
    }
    
    .status-badge{
    	padding: 0.25rem 0.625rem;
    	border-radius: 0.375rem;
    	font-size: 0.75rem;
    	font-weight: 500;

    	 &.status-approved{
           background: #d1fae5;
           color: #065f46;	

    	 }
    	 &.status-pending{
			 background: #fef3c7;
			 color: #92400e;	
	              	
    	 }

    	 &.status-rejected{
    	 background: #fee2e2;
    	 color: #991b1b;
    	 }
    }

   .badge{
   	display: inline-block;
   	padding: 0.25rem 0.625rem;
   	background: #e2e8f0;
   	color: #475569;
   	border-radius: 0.375rem;
	   font-size: 0.75rem;	
	   font-weight: 500;
	   margin-right: 0.5rem;
   }


   .material-meta{
   	display:  flex;
		flex-wrap: 0.
		375rem;
		font-size: 075rem;
		font-weight: 500;
   }

   .status-badge{
   	padding: 0.25rem;
   	border-radius: 0.375rem;
   	font-size: 0.75rem;

   	&.status-approved{
   		background: #d1fae5;
   		color: #065f46;
   	}

   	&.status-pendig{
   		background: #fef3c7;
   		color: #92400e;
   	}

   	&.status-rejected{
   		background: #fee2e2;
   		color: #991b1b;
   	}
   }

   /* Animaciones*/
   .slide-down-enter-active,
   .slide-down-leave-active {
   	 transition: all 0.3s ease;
   	 max-width: 1000px;
   	 overflow: hidden;
   }

   /* Responsividad */
   @media (max-width: 768px){
   	.search-bar-container{
  	     flex-direction: column;
  		}

  		.result-grid{
  			grid-template-columns: 1fr;
  		}

  		.checkbox-group{
  			flex-direction: column;
  			gap: 0.75rem;
  		}
   }

   /*Soporte Modo Obscuro*/

   @media (prefers-color-scheme: dark) {
   		.search-input,
   		.filter-input,
   		.filter-select,
   	  .advanced-filters,
         .results-container{
         	background: #1e293b;
         	color: #e2e8f0;
         	border-color: #334155;
         }

         .result-card{
         	background: #334155;
         	border-color:#475569
         }

         .badge{
         	background: #475569;
         	color: #e2e8f0;
         }
   }
  </style>