import PageError403 from '@/components/PageError403.vue';
import  viewLoginDepInit  from '@/views/viewLoginDepInit.vue';
import viewUploadMaterial from '@/Student/views/viewUploadMaterial.vue';

export const route_main = [
{     
       // #Pagina de Error
    path: '/page-error-403',
    name:  'PageError403',
    component: PageError403,
  },

  {     
       // #NO requiere autorizacion porque es la base
    path: '/view-login-dep-init',
    name:  'viewLoginDepInit', 
    component: viewLoginDepInit,
     meta: { requiresAuth: false }  
  },
  {
    path: '/view-upload-materials',
    name: 'viewUploadMaterial',
    component: viewUploadMaterial,
    meta: {requiresAuth: true, role: 'professor', permission:'puedeSubirMateriales'}  //alumno, con 1 s
  }
];