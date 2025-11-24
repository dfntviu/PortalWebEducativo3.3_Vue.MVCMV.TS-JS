	// Version 2.5
  import { createRouter, createWebHistory } from 'vue-router';  //*
  import { route_main } from '@/services/config/routes/router_main.ts';
  import { route_teacher } from '@/services/config/routes/router_teacher.ts';
  import { route_student } from '@/services/config/routes/router_student.ts';
  import {RouterGuardService} from '@/services/config/guard/RouterGuardServ.ts';

  import HomeView from '@/views/HomeView.vue';  

   // homogeneizar el array of router(arreglo de ruteo)
  const routes = [
  	{ path: '/', name: 'HomeView', component: HomeView },
  	...route_main,
  	...route_teacher,
  	...route_student,
  ];
   // router base
  const router = createRouter({
   history: createWebHistory(),
   routes
  });
  		// Instancia del guard
    const servicioGuardian = new RouterGuardService('default');
    router.beforeEach(async(to, from, next)=> servicioGuardian.globalGuard(to, from, next));

   export default router;