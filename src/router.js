import { createRouter, createWebHistory } from 'vue-router';

import PacientesView from './views/PacientesView.vue';
import UsuariosView from './views/UsuariosView.vue';
import LoginView from './components/Login.vue';

const routes = [
    {
        path: '/pacientes',
        name: 'pacientes',
        component: PacientesView

    },
    {
        path: '/usuarios',
        name: 'usuarios',
        component: UsuariosView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView

    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
