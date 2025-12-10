import { createRouter, createWebHistory } from 'vue-router';

import UsuariosView from './views/UsuariosView.vue';
import PacientesView from './views/PacientesView.vue';

const routes = [
    {
        path: '/usuarios',
        name: 'usuarios',
        component: UsuariosView
    },
    {
        path: '/pacientes',
        name: 'pacientes',
        component: PacientesView

    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
