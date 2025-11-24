 /* # Funciones de Vue-Router # */
 import { createRouter, createWebHistory } from 'vue-router';
 // import {useAuthStore} from '@/stores/authStore2.ts';  
  // Definicion de los Layouts(la Geometria de Navegacion del Sitio) [library_new: 02-Nov]
 import  LayoutNavBarRole1 from '@/components/LayoutNavBarRole1.vue'  //*
 import  LayoutNavBarRole2 from '@/components/LayoutNavBarRole2.vue'  //*
  /* Capa de blindaje adicional (med. POO) */
 import { RouterGuardService } from '@/services/config/RouterGuardServ.ts'  
  /* Vistas de Ambos Roles*/
   import HomeView from '@/views/HomeView.vue'; /*x default */
  import viewBienvenidaTeachers from '@/Teacher/views/viewBienvenidaTeachers.vue'; 
  import viewModerarMaterialessolution from '@/Teacher/views/viewModerarMateriales.solution.vue';
  import viewModerateBaseComments from '@/Teacher/views/viewModerateBaseComments.vue';
  import viewRegisterTeacher1 from '@/Teacher/views/viewRegisterTeacher1.vue';
  import viewTeachersAdmMatls from '@/Teacher/views/viewTeachersAdmMatls.vue';
  import viewBienvenidaStudents from '@/Student/views/viewBienvenidaStudents.vue';    
  import viewMaterIndividual from '@/Student/views/viewMaterIndividual.vue'; 
  import viewStudentRegisterBase from '@/Student/views/viewStudentRegisterBase.vue';
  import viewStudentsAdmMatls from '@/Student/views/viewStudentsAdmMatls.vue';
  import viewUploadMaterial from '@/Student/views/viewUploadMaterial.vue'; 
  import PageError403 from '@/components/PageError403.vue';
     // import {useEmpSysStore} from '@/stores/emptySystemStore.ts'; //# probar init#
    /*La pauta diferencial me la asigna el directorio for Role*/

  /*import HeaderOne from '@/components/HeaderOne.vue';
   import HeaderTwo from '@/components/HeaderTwo.vue';*/ 
  import HeaderThree from '@/components/HeaderThree.vue';
  
   // Here starting of the Web App. [new_feature]
  import  viewLoginDepInit  from '@/views/viewLoginDepInit.vue';

const routes = [
  // { path: '/', name: 'HomeView', component: HomeView },
  // Role1 - Profesor
  {
    path: '/view-bienvenida-teachers',
    name: 'viewBienvenidaTeachers',
    component: {
      default: viewBienvenidaTeachers,
      layout: LayoutNavBarRole2, //New_01
    },
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeVisualizarBienvenidaRole2'}
  },

  {
    path: '/view-moderar-materiales-solution',
    name: 'viewModerarMaterialessolution',
    component: {
      default: viewBienvenidaTeachers,
      layout: LayoutNavBarRole2, //New_01
    },
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeGestionarMateriales_Alumno' }
  },

  {
    path: '/view-moderate-base-comments',
    name: 'viewModerateBaseComments',
    component: {
       default: viewBienvenidaTeachers,
        layout: LayoutNavBarRole2, //New_01
    },
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeModerarComentarios'}
  },

  {
    path: '/view-register-teacher1',
    name: 'viewRegisterTeacher1',
    component:{ 
       default: viewBienvenidaTeachers,
        layout: LayoutNavBarRole2, //New_01
     },
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeRegistrarCuentaProfesor'}
  },

  {
    path: '/view-teacher-adm-matls',
    name: 'viewTeachersAdmMatls',
    component: {
       default: viewBienvenidaTeachers,
       layout: LayoutNavBarRole2, //New_01
     },
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeGestionarMateriales_Alumno'}
  },
  // Role2 - Alumno
  {
    path:  '/bienvenida-students',
    name: 'viewBienvenidaStudents',
    component: viewBienvenidaStudents,
    meta:{requiresAuth: true, role: 'alumno', permission: 'puedeVisualizarBienvenidaRole1'}
  },

  {
    path: '/view-mater-individual',
    name: 'viewMaterIndividual',
    component: viewMaterIndividual,
    meta: { requiresAuth: true, role: 'alumno', permission: 'puedeVerMaterialIndividual'}
  },

  {
    path: '/view-student-register-base',
    name: 'viewStudentRegisterBase',
    component: viewStudentRegisterBase,
    meta: { requiresAuth: true, role: 'alumno', permission: 'puedeRegistrarCuentaAlumno' }
  },

  {
    path: '/view-student-adm-matls',
    name: 'viewStudentsAdmMatls',
    component: viewStudentsAdmMatls,
    meta: { requiresAuth: true, role: 'alumno', permission: 'puedeGestionarMateriales'}
  },

  {
    path: '/view-upload-materials',
    name: 'viewUploadMaterial',
    component: viewUploadMaterial,
    meta: {requiresAuth: true, role: 'professor', permission:'puedeSubirMateriales'}  //alumno, con 1 s
  },

  
    // Pantalla Inicial [new_feature]
  {     
       // #NO requiere autorizacion porque es la base
    path: '/view-login-dep-init',
    name:  'viewLoginDepInit',
    component: viewLoginDepInit,
     meta: { requiresAuth: false }
  },

   {     
       // #Pagina de Error
    path: '/pageerror-403',
    name:  'PageError403',
    component: PageError403,
  },

  /*{
     path: '/encab-1',
    name:  'HeaderOne',
    component: HeaderOne,
  },
  {
     path: '/encab-2',
    name:  'HeaderTwo',
    component: HeaderTwo,
  },*/
  {
     path: '/encab-3',
    name:  'HeaderThree',
    component: HeaderThree,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});
    
    const servicioGuardian = new RouterGuardService('default');
   router.beforeEach(async(to, from, next)=> servicioGuardian.globalGuard(to, from, next));
   
   export default router;

 // ### Guard global con verificacion de permisos ###
/*router.beforeEach(async(to, from, next) => {
  const teach_store = await useAuthStore();
    // Logica Principal de Routing

   // Cambios Parte 04
  if(teach_store.Isloading){ 
       teach_store.checkAuthState();
  }
  if (to.meta.requiresAuth && !teach_store.isAuthenticated){
      return next({ name: 'viewLoginDepInit' });  // [new_feature], En lugar de Home.
  } 
  // Verificacion de Rol
  if (to.meta.role && teach_store.role !== to.meta.role) {
     return next({ name: 'PageError403' }); 
  }
     // Verificacion de permisos usando clase PermissionsService
  const permissionServ = new RouterGuardService(teach_store.role);
    if (to.meta.permission && permissionServ.hasPermission(to.meta.permission)) {
      return next({name: 'PageError403'});
    }

   next();
}); */

    /* // #Cambiar por el store: 'emptySystemStore' para verificar si se cargo automaticamente el Primer usuario
       - Seria idoneo crear un role de administrar una vista sencilla, agregar el registro desde un componente HTML
       - Redirigir a  la sesíon, y que el usuario administrador registre a todos los profesores.
       - los usuarios Alumnos tendran acceso inmediato a la vista de Registro, y se registraran uno a uno, pues  una vez hecho
         esto se tendra el  acceso.
       #  - Verificar con la vista viewLoginDepInit - #
     const {useAuthStore} = await import('@/stores/authStore.ts');
    const authStore = useAuthStore();*/
