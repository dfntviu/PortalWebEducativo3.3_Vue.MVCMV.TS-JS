 <!-- Muestra las Estadisticas de la moderacion -->
 <template>
 	<div class="moderation-stats">
 		<div class="stat-card pending">
	 		<div class="stat icon"></div>
	 			<div class="stat-content">
	 				<span class="stat-value">{stats.pendingTotal || 0}</span>
	 				<span class="stats-label">Pendientes</span>
	 			</div>
	    </div>

	    <div class="stat-card approved">
	    	<div class="stat-icon">
	    		<div class="stat-content">
	    			 <span class="stat-value"></span>
	    		     <span class="stat-label">Aprobados</span>
	    		 </div>
	    	</div>
	    </div>

	    <div class="stat-card reajected">
	    	<div class="stat-icon">
	    		<div class="stat-content">
	    			<span class="stat-value"></span>
	    		    <span class="stat-label">Rechazados</span>
	    		</div>
	    	</div>
	    </div>

    </div>
 </template>


<script setup lang="ts">
	interfaceProps {
		stats: {
			pendingTotal: number;
			approvedsTotal: number;
			rejectsTotal: number;
		};
		loading?: boolean;
	}

	withDefaults(defineProps<Props>(), {
		loading: false;
	});


</script>

<style scoped>
	.moderation-stats{
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card{
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: white;
		border-radius: 0.75rem;
		border: 2px solid;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.stat-card.pending {
		border-color: #22c55e;
		background: linear-gradient(135deg, #fef3c7 0%, white 100%);
	}

	.stat-card.approved {
		border-color: #fbbf24;
		background: linear-gradient(135deg, #dcfce7 0%,  white 100%);
	}

	.stat-card .reajected {
		border-color: #ef4444;
		background: linear-gradient(135deg, #fee2e2 0%,  white 100%);
	}

	.stat-icon{
		font-size: 2rem;
	}

	.stat-content{
		display: flex;
		flex-direction: column;
	}

	/*.stat-content {  }*/

	.stat-value {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}
</style>