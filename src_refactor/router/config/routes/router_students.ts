  import viewBienvenidaStudents from '@/views/Student/viewBienvenidaStudents.vue';    
  import viewMaterialIndividual from '@/views/Student/viewMaterialIndividual.vue'; 
  import viewRegisterStudent from '@/views/Student/viewRegisterStudent.vue';
  import viewStudentsAdmMaterials from '@/views/Student/viewStudentsAdmMaterials.vue';
  import viewUploadMaterials from '@/views/Student/viewUploadMaterials.vue';

   // FILE ROUTER ONE: ROLE_OF_STUDENTS
  export const route_student = [
    {
      path:  '/welcome-estudiantes',
      name: 'viewBienvenidaStudents',
      component: viewBienvenidaStudents,
      meta:{requiresAuth: true, role: 'alumno', permission: 'puedeVisualizarBienvenidaRole1'}
    },
  
    {
      path: '/register-estudiante',
      name: 'viewMaterialIndividual',
      component: viewMaterialIndividual,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeVerMaterialIndividual'}
    },
  
    {
      path: '/upload-materiales',
      name: 'viewRegisterStudent',
      component: viewRegisterStudent,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeRegistrarCuentaAlumno' }
    },
  
    {
      path: '/auth_material-individual',
      name: 'viewStudentsAdmMaterials',
      component: viewStudentsAdmMaterials,
      meta: { requiresAuth: true, role: 'alumno', permission: 'puedeGestionarMateriales'}
    },
  
    {
      path: '/upload-materiales',
      name: 'viewUploadMaterials',
      component: viewUploadMaterials,
      meta: {requiresAuth: true, role: 'alumno', permission:'puedeSubirMateriales'}  //alumno, con 1 s
    },
  ]