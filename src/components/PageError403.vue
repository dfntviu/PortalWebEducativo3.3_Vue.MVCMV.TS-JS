<template>
	<div class="error_403">
	   <h1>403 El Acceso ha sido Negado</h1>
	 <p>No se tienen los permisos para acceder a esta página</p>
	 <router-link to="/">Volver al Inicio</router-link>
	</div>
</template>

<style scoped>
	.error_403{
      text-align: center;
  		padding: 3rem;
	}
	h1{
		color: #c62828;
	}
</style>