<template>
  <div id="app">
    <h1>Sistema de Gestión de Atención Médica Integral</h1>

    <!-- SI ESTÁ LOGUEADO -->
    <div v-if="currentUser">

      <div class="nav-bar">

        <div class="left-buttons">

          <a class="btn-nav" href="/citas">
            <i class="fa-solid fa-calendar-check"></i> Citas
          </a>

          <a 
            class="btn-nav" 
            href="/medicos"
            v-if="rol === 'ADMIN' || rol === 'MEDICO'"
          >
            <i class="fa-solid fa-user-doctor"></i> Médicos
          </a>

          <a 
            class="btn-nav" 
            href="/pacientes"
            v-if="rol === 'ADMIN' || rol === 'MEDICO'"
          >
            <i class="fa-solid fa-hospital-user"></i> Pacientes
          </a>
        </div>

        <div class="right-buttons">
          <span class="welcome-message">
            Bienvenido/a, {{ currentUser.nombre }} ({{ rol }})
          </span>

          <a 
            class="btn-nav"
            href="/usuarios"
            v-if="rol === 'ADMIN'"
          >
            <i class="fa-solid fa-users"></i> Usuarios
          </a>

          <a class="btn-nav logout-btn" href="#" @click.prevent="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
          </a>
        </div>

      </div>

      <router-view />
    </div>

    <!-- SI NO ESTÁ LOGUEADO -->
    <div v-else class="login-container-wrap">
      <h2 class="auth-message">Por favor, inicie sesión para acceder al sistema.</h2>
      <Login @login-success="handleLoginSuccess" />
    </div>

  </div>
</template>



<script>
import { inject, ref } from "vue";
import Login from './components/Login.vue';
import RolesProvider from './components/RolesProvider.vue';

export default {
  name: "App",
  components: { Login, RolesProvider },

  setup() {
    // Rol proveniente del RolesProvider
    const rolRef = inject("rolUsuario");

    const currentUser = ref(null);

    // Cargar sesión del localStorage
    const checkSession = () => {
      const stored = localStorage.getItem("currentUser");
      currentUser.value = stored ? JSON.parse(stored) : null;
    };

    checkSession();

    const handleLoginSuccess = () => {
      checkSession();
      rolRef.value = (localStorage.getItem("rol") || "INVITADO").toUpperCase();
    };

    const handleLogout = () => {
      localStorage.clear();
      currentUser.value = null;
      rolRef.value = "INVITADO";
    };

    return {
      currentUser,
      rol: rolRef,
      handleLogout,
      handleLoginSuccess
    };
  }
}
</script>




<style>
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.left-buttons,
.right-buttons {
    display: flex;
    gap: 10px;
}

.btn-nav {
    padding: 10px 18px;
    background: #168E7F;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: 0.3s ease-in-out;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.btn-nav:hover {
    background: #0F5F54;
    transform: scale(1.05);
}

.welcome-message {
    padding: 10px 0;
    font-weight: bold;
    color: #168E7F;
    display: flex;
    align-items: center;
}
</style>
