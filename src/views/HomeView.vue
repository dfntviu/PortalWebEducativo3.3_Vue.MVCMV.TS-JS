<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld(vue_origin).vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
/*A Recordar: Fueron unificados 2 scripts: El store del perfil del profesro optimizado y el servicio de Primer uso
(Empty-Sym[Sistema-Vacio], por lo que genera errores en cosola, unicamente modificar la ruta
  Features new Adding:
     Fondo Obscuro
     Atajos de Teclado
     Notificaciones tpo Toast 
*/
</script>