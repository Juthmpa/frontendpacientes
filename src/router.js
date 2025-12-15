import { createRouter, createWebHistory } from 'vue-router';

import PacientesView from './views/PacientesView.vue';
import UsuariosView from './views/UsuariosView.vue';
import MedicosView from './views/MedicosView.vue';   
import CitasView from './views/CitasView.vue';   
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
        path: '/medicos',               
        name: 'medicos',
        component: MedicosView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    }
    ,
    {
        path: '/citas',
        name: 'citas',
        component: CitasView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

