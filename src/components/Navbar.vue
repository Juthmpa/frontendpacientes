<template>
    <nav v-if="user" class="navbar">

        <!-- BOTÓN: Gestión de Usuarios (solo ADMIN) -->
        <a 
            v-if="rol === 'ADMIN'"
            href="#usuarios"
        >
            Gestión de Usuarios
        </a>

        <!-- BOTÓN: Gestión de Pacientes (ADMIN y MEDICO) -->
        <a 
            v-if="rol === 'ADMIN' || rol === 'MEDICO'"
            href="#pacientes"
        >
            Gestión de Pacientes
        </a>

        <!-- Bienvenida -->
        <span class="welcome-message">
            Bienvenido, {{ user.nombre }} ({{ rol }})
        </span>

        <!-- Cerrar sesión -->
        <button @click="logout" class="logout-btn">
            Cerrar Sesión
        </button>
    </nav>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';

// 🔹 Emisor de eventos
const emit = defineEmits(["logout-success"]);

// 🔹 Recibimos el ROL desde RolesProvider
const rol = inject("rolUsuario");

// 🔹 Usuario actual desde localStorage
const user = ref(null);

// Cargar usuario al montar
onMounted(() => {
    const saved = localStorage.getItem("currentUser");
    user.value = saved ? JSON.parse(saved) : null;
});

// Cerrar sesión
const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rol");

    user.value = null;

    // Notificar al padre
    emit("logout-success");
};
</script>

<style>
.navbar {
    display: flex;
    gap: 20px;
    align-items: center;
}
.welcome-message {
    margin-left: auto;
    font-weight: bold;
}
.logout-btn {
    background: red;
    color: white;
    border: none;
    padding: 6px 15px;
    cursor: pointer;
}
</style>
