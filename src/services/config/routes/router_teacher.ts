  import viewBienvenidaTeachers from '@/Teacher/views/viewBienvenidaTeachers.vue'; 
  import viewModerarMaterialessolution from '@/Teacher/views/viewModerarMateriales.solution.vue';
  import viewModerateBaseComments from '@/Teacher/views/viewModerateBaseComments.vue';
  import viewRegisterTeacher1 from '@/Teacher/views/viewRegisterTeacher1.vue';
  import viewTeachersAdmMatls from '@/Teacher/views/viewTeachersAdmMatls.vue';

  /*import  LayoutNavBarRole1 from '@/components/LayoutNavBarRole1.vue'  
  import  LayoutNavBarRole2 from '@/components/LayoutNavBarRole2.vue'  
*/
export const route_teacher = [
 {
    path: '/view-bienvenida-teachers',
    name: 'viewBienvenidaTeachers',
    component:viewBienvenidaTeachers, /*{
      default: viewBienvenidaTeachers,
      layout: LayoutNavBarRole2, //New_01
    },*/
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeVisualizarBienvenidaRole2'}
  },

  {
    path: '/view-moderar-materiales-solution',
    name: 'viewModerarMaterialessolution',
    component: viewModerarMaterialessolution,/* {
      default: viewBienvenidaTeachers,
      layout: LayoutNavBarRole2, //New_01
    },*/
    meta: { requiresAuth: true, role: 'profesor', permission:'puedeGestionarMateriales_Alumno' }
  },

  {
    path: '/view-moderate-base-comments',
    name: 'viewModerateBaseComments',
    component: viewModerateBaseComments, /*{
       default: viewBienvenidaTeachers,
        layout: LayoutNavBarRole2, //New_01
    },*/
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeModerarComentarios'}
  },

  {
    path: '/view-register-teacher1', 
    name: 'viewRegisterTeacher1',   
    component:  viewRegisterTeacher1,/*{ 
       default: viewBienvenidaTeachers,
        layout: LayoutNavBarRole2, //New_01
     },*/
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeRegistrarCuentaProfesor'}
  },

  {
    path: '/view-teacher-adm-matls',
    name: 'viewTeachersAdmMatls',
    component:viewTeachersAdmMatls, /*{
       default: viewBienvenidaTeachers,
       layout: LayoutNavBarRole2, //New_01
     },*/
    meta: { requiresAuth: true, role: 'profesor', permission: 'puedeGestionarMateriales_Alumno'}
  },
];