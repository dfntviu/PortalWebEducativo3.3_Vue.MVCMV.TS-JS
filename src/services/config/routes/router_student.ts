  import viewBienvenidaStudents from '@/Student/views/viewBienvenidaStudents.vue';    
  import viewMaterIndividual from '@/Student/views/viewMaterIndividual.vue'; 
  import viewStudentRegisterBase from '@/Student/views/viewStudentRegisterBase.vue';
  import viewStudentsAdmMatls from '@/Student/views/viewStudentsAdmMatls.vue';
  import viewUploadMaterial from '@/Student/views/viewUploadMaterial.vue';

   // ROLE OF STUDENTS
  export const route_student = [
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
      meta: {requiresAuth: true, role: 'alumno', permission:'puedeSubirMateriales'}  //alumno, con 1 s
    },
  ]