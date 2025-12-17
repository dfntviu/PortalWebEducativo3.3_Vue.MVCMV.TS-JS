  import {createRouter,createWebHistory} from 'vue-router'; 
  import { route_base } from '@/router/config/routes/router_base.ts';
  import { route_students } from '@/router/config/routes/router_students.ts';
  import { route_teachers } from '@/router/config/routes/router_teachers.ts';
  import RouterGuardService from '@/router/guard/RouterGuardService.ts'

   const routes = [
      ...route_base,
      ...route_students,
      ...route_teachers
   ];

    const router = createRouter({
      history: createWebHistory,
       routes 
    });

    // Ghuards Security
    const serviceGhuard = new RouterGuardService('default');
    router.beforeEach(async(to, from, next)=>serviceGhuard.globalGhuard(to, from, next));
    
  export default router;