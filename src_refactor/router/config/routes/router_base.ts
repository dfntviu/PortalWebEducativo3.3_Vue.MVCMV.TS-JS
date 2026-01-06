import  LoginMultiusuario  from '@/views/LoginMultiusuario.vue';
import  viewProfileUser from '@/views/viewProfileUser.vue';
import  HomeView from '@/views/HomeView.vue'
import  viewUnifyNotification from '@/views/viewUnifyNotification.vue' //* notificacion ambos roles
  
  // ###  FILE_ROUTER_MAIN ###
export const route_main = [
{     
       // #Pagina de Error
    path: '/profile-usr-main',
    name:  'viewProfileUser',
    component: viewProfileUser,
  },

  {     
       // #NO requiere autorizacion porque es la base
    path: '/view-login-multuser',
    name:  'LoginMultiusuario', 
    component: LoginMultiusuario,
     meta: { requiresAuth: false }  
  },

  {
    path: '/home-view-main',
    name: 'HomeView',
    component: HomeView,
    meta: {requiresAuth: true, role: 'professor', permission:'puedeSubirMateriales'}  //alumno, con 1 s
  },
 
  {  //*
    path: '/panel-main_notify-roles',
    name: 'viewUnifyNotification',
    component: viewUnifyNotification,
  }
];