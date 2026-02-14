  import viewAdminMaterialStudent from '/views/Teacher/viewAdminMaterialStudent.vue';//x-w-wng
  import viewAdminStatisticsMaterials from '/views/Teacher/viewAdminStatisticsMaterials.vue';
  import viewBienvenidaTeachers from '/views/Teacher/viewBienvenidaTeachers.vue';
  import viewModerateMaterials from '/views/Teacher/viewModerateMaterials.vue';//x-w-wng
  import viewRegisterTeacher from '/views/Teacher/viewRegisterTeacher.vue';//x-w-wng
  // import viewRegisterTeacher2  from '@/views/Teacher/viewRegisterTest2.vue';
  // import viewModerarAbsoluteCM from '@/views/Tracher/viewModerarAbsoluteCM.vue'; /*??*/

   // FILE ROUTER TWO: ROLE_OF_TEACHERS
  export const route_teachers = [
    {
      path:  '/welcome-teachers',
      name: 'viewBienvenidaTeachers',
      component: viewBienvenidaTeachers,
      meta:{requiresAuth: true, role: 'alumno', permission: 'puedeVisualizarBienvenidaRole1'}
    },
  
    {
      path: '/registro-teachers',
      name: 'viewRegisterTeacher',
      component: viewRegisterTeacher,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeVerMaterialIndividual'}
    },

/*{
  path: '/regiter-teachers2',
  name: 'viewRegisterTeacher2',
  component: viewRegisterTeacher2
},*/

    {
      path: '/ind-material-teachers-student',
      name: 'viewAdminMaterialStudent',
      component: viewAdminMaterialStudent,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeRegistrarCuentaAlumno' }
    },
    
    {
      path: '/statistics-materiales-teachers',
      name: 'viewAdminStatisticsMaterials',
      component: viewAdminStatisticsMaterials,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeRegistrarCuentaAlumno' }
    },
   
   {
      path: '/moderate-materials-teachers',
      name: 'viewModerateMaterials',
      component: viewModerateMaterials,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeRegistrarCuentaAlumno' }
    }

  ];