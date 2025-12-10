<template>
    <div id="usuarios-view" class="container">
        <h1>Gestión de Usuarios</h1>
        <hr>
        
        <UsuarioForm 
            :usuarioToEdit="usuarioParaEditar"
            @usuario-saved="handleUsuarioSaved" 
            @cancel-edit="resetEdicion"
        />

        <hr>
        
        <UsuariosList 
            :usuarios="usuarios" 
            @status-changed="fetchUsuarios"
            @edit-usuario="abrirFormularioEdicion"
        />

    </div>
</template>

<script>
// Asegúrate de que las rutas a los componentes sean correctas
import UsuarioForm from '../components/UsuarioForm.vue';
import UsuariosList from '../components/UsuarioList.vue';

export default {
    name: 'UsuariosView', // Cambiado a UsuariosView para distinguirlo del Paciente
    components: {
        UsuarioForm,
        UsuariosList
    },
    data() {
        return {
            usuarios: [],
            // Variable de estado CLAVE: Almacena el usuario que se enviará al formulario para editar
            usuarioParaEditar: null,
            API_URL: 'http://localhost:8080/backend_api/api/usuarios' // URL del API de Usuarios
        }
    },
    methods: {
        // Método para cargar la lista desde el API
        async fetchUsuarios() {
            try {
                const response = await fetch(this.API_URL); 
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de usuarios');
                }
                this.usuarios = await response.json();
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        },

        /**
         * Maneja el evento emitido por UsuariosList (al hacer click en Editar)
         * @param {Object} usuario - El objeto usuario a editar.
         */
       abrirFormularioEdicion(usuario) {
        // --- AGREGAR ESTO TEMPORALMENTE ---
        console.log("Usuario recibido para edición:", usuario);
        // --- FIN TEMPORAL ---
        
        // Carga el objeto usuario en la variable de estado.
        this.usuarioParaEditar = usuario;
        
        // Opcional: Desplazar la vista al formulario para mejor UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

        /**
         * Se llama cuando el formulario termina de Guardar o Actualizar.
         * 1. Recarga la lista.
         * 2. Resetea el formulario a modo "Registro".
         */
        handleUsuarioSaved() {
            this.fetchUsuarios();
            this.resetEdicion();
        },

        /**
         * Resetea el estado de edición (vuelve el formulario a modo "Registro")
         */
        resetEdicion() {
            this.usuarioParaEditar = null;
        }
        
    },
    mounted() {
        this.fetchUsuarios(); // Cargar datos al iniciar
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