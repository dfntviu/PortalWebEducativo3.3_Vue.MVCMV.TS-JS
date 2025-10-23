import { createRouter, createWebHistory } from 'vue-router';
 import {useAuthStore} from '@/stores/useAuthStore.ts'  
 /* Capa de blindaje adicional (med. POO) */
 import { RouterGuardService } from '@/services/config/RouterGuardServ.ts'
  
   import HomeView from '@/views/HomeView.vue'; /*x default */
  import {bienvenidaTeachers} from '@/Teacher/views/bienvenidaTeachers.vue'; 
  import {viewModerarMaterialessolution} from '@/Teacher/views/viewModerarMateriales.solution.vue';
  import {viewModerateBaseComments} from '@/Teacher/views/viewModerateBaseComments.vue';
  import {viewRegisterTeacher1} from '@/Teacher/views/viewRegisterTeacher1.vue';
  import {viewTeachersAdmMatls} from '@/Teacher/views/viewTeachersAdmMatls.vue';
  import {bienvenidaStudents} from '@/Student/views/bienvenidaStudents.vue';  
  import {viewMaterIndividual} from '@/Student/views/viewMaterIndividual.vue'; 
  import {viewStudentRegisterBase} from '@/Student/views/viewStudentRegisterBase.vue';
  import {viewStudentsAdmMatls} from '@/Student/views/viewStudentsAdmMatls.vue';
  import {viewUploadMaterial} from '@/Student/views/viewUploadMaterial.vue'; 
    /*La pauta diferencial me la asigna el directorio for Role*/

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  // Role1 - Profesor
  {
    path: '/bienvenida-teachers',
    name: 'bienvenidaTeachers',
    component: bienvenidaTeachers,
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeVisualizarBienvenidaRole2'}
  },

  {
    path: '/view-moderar-materiales-solution',
    name: 'viewModerarMaterialessolution',
    component: viewModerarMaterialessolution,
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeGestionarMateriales_Alumno' }
  },

  {
    path: '/view-moderate-base-comments',
    name: 'viewModerateBaseComments',
    component: viewModerateBaseComments,
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeModerarComentarios'}
  },

  {
    path: '/view-register-teacher1',
    name: 'viewRegisterTeacher1',
    component: viewRegisterTeacher1,
    meta: { requiresAuth: false, role: 'profesor', permission: 'puedeRegistrarCuentaProfesor'}
  },

  {
    path: '/view-teacher-adm-matls',
    name: 'viewTeachersAdmMatls',
    component: viewTeachersAdmMatls,
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeGestionarMateriales_Alumno'}
  },
  // Role2 - Alumno
  {
    path:  'bienvenida-students',
    name: 'bienvenidaStudents',
    component: bienvenidaStudents,
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
    path: 'view-upload-materials',
    name: 'viewUploadMaterial',
    component: viewUploadMaterial,
    meta: {requiresAuth: true, role: 'alumno', permission:'puedeSubirMateriales'}
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

 // ### Guard global con verificacion de permisos ###
router.beforeEach((to, from, next) => {
  const auth_store = useAuthStore();
  // Cambios Parte 04
  if(auth_store.Isloading){
       auth_store.checkAuthState();
  }
  if (to.meta.requiresAuth && !auth_store.isAuthenticated){
      return next({ name: 'Home' }); 
  } 
  // Verificacion de Rol
  if (to.meta.role && auth_store.role !== to.meta.role) {
     return next({ name: 'PageError403' }); 
  }
     // Verificacion de permisos usando clase PermissionsService
  const permissionServ = new RouterGuardService(auth_store.role);
    if (to.meta.permission && permissionServ.hasPermission(to.meta.permission)) {
      return next({name: 'PageError403'});
    }

   next();
});

export default router;