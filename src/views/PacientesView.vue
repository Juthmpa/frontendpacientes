<template>
  <div id="app" class="container">
    <h1>Gestión de Pacientes</h1>
    <hr>
    
    <PacienteForm 
        :pacienteToEdit="pacienteParaEditar"
        @paciente-saved="handlePacienteSaved" 
        @cancel-edit="resetEdicion"
    />

    <hr>
    
    <PacientesList 
        :pacientes="pacientes" 
        @status-changed="fetchPacientes"
        @edit-paciente="abrirFormularioEdicion"
        @view-details="mostrarModalDetalles"
    />

    </div>
</template>

<script>
import PacienteForm from '../components/PacienteForm.vue';
import PacientesList from '../components/PacientesList.vue';

export default {
  name: 'App',
  components: {
    PacienteForm,
    PacientesList
  },
  data() {
    return {
      pacientes: [],
      // NUEVA VARIABLE DE ESTADO CLAVE: Almacena el paciente que se enviará al formulario para editar
      pacienteParaEditar: null 
    }
  },
  methods: {
    // Método para cargar la lista desde el API
    async fetchPacientes() {
      try {
        const response = await fetch('http://localhost:8081/backend_api/api/pacientes'); 
        if (!response.ok) {
          throw new Error('Error al obtener la lista de pacientes');
        }
        this.pacientes = await response.json();
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },

    // --- NUEVOS MÉTODOS PARA MANEJAR EVENTOS ---
    
    /**
     * Maneja el evento emitido por PacientesList (al hacer click en Editar)
     * @param {Object} paciente - El objeto paciente a editar.
     */
    abrirFormularioEdicion(paciente) {
        // Carga el objeto paciente en la variable de estado.
        // Esto automáticamente pasa la información al PacienteForm vía props.
        this.pacienteParaEditar = paciente;
        
        // Opcional: Desplazar la vista al formulario para mejor UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Muestra los detalles del paciente. En un proyecto simple, se usa un alert. En un proyecto real, se abriría un modal.
     * @param {Object} paciente - El objeto paciente a ver.
     */
    mostrarModalDetalles(paciente) {
        alert(`Detalles del Paciente:
ID: ${paciente.id}
Nombre: ${paciente.nombre}
Correo: ${paciente.correo}
Edad: ${paciente.edad}
Dirección: ${paciente.direccion}
Cédula: ${paciente.numeroCedula}
Estado: ${paciente.activo ? 'Activo' : 'Inactivo'}`);
    },

    /**
     * Se llama cuando el formulario termina de Guardar o Actualizar.
     * 1. Recarga la lista.
     * 2. Resetea el formulario a modo "Registro".
     */
    handlePacienteSaved() {
        this.fetchPacientes();
        this.resetEdicion();
    },

    /**
     * Resetea el estado de edición (vuelve el formulario a modo "Registro")
     */
    resetEdicion() {
        this.pacienteParaEditar = null;
    }
    // -------------------------------------------
  },
  mounted() {
    this.fetchPacientes(); // Cargar datos al iniciar
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