<template>
  <div id="app" class="container">
    <h1>Gestión de Usuarios</h1>
    <hr>
    
    <!-- Formulario de edición de usuario -->
    <UsuarioForm 
        :usuarioToEdit="usuarioParaEditar"
        @usuario-saved="handleUsuarioSaved" 
        @cancel-edit="resetEdicion"
    />

    <hr>
    
    <!-- Lista de usuarios -->
    <UsuariosList 
        :usuarios="usuarios" 
        @status-changed="fetchUsuarios"
        @edit-usuario="abrirFormularioEdicion"
        @view-details="mostrarModalDetalles"
    />
  </div>
</template>

<script>
import UsuarioForm from '../components/UsuarioForm.vue';
import UsuariosList from '../components/UsuarioList.vue';

export default {
  name: 'App',
  components: {
    UsuarioForm,
    UsuariosList
  },
  data() {
    return {
      usuarios: [],
      usuarioParaEditar: null
    }
  },
  methods: {
    // Método para cargar la lista de usuarios desde el API
    async fetchUsuarios() {
      try {
        const response = await fetch('http://localhost:8080/backend_api/api/usuarios'); 
        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios');
        }
        this.usuarios = await response.json();
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },

    // Maneja el evento para editar un usuario
    abrirFormularioEdicion(usuario) {
      this.usuarioParaEditar = usuario;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Muestra los detalles del usuario en un modal o con alert
    mostrarModalDetalles(usuario) {
      alert(`Detalles del Usuario:
        ID: ${usuario.id}
        Nombre: ${usuario.nombre}
        Correo: ${usuario.correo}
        Username: ${usuario.username}
        Rol: ${usuario.rol}
        Estado: ${usuario.activo ? 'Activo' : 'Inactivo'}`);
    },

    // Se llama cuando se guarda un usuario o se actualiza
    handleUsuarioSaved() {
      this.fetchUsuarios();
      this.resetEdicion();
    },

    // Resetea la variable de estado para la edición de usuario
    resetEdicion() {
      this.usuarioParaEditar = null;
    }
  },
  mounted() {
    this.fetchUsuarios(); // Cargar los datos al iniciar
  }
}
</script>

<style>
/* Estilos globales */
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}
</style>