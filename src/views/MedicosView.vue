<template>
  <div id="app" class="container">
    <h1>Gestión de Médicos</h1>
    <hr>

    <MedicoForm 
        :medicoToEdit="medicoParaEditar"
        @medico-saved="handleMedicoSaved"
        @cancel-edit="resetEdicion"
    />

    <hr>

    <MedicosList 
        :medicos="medicos"
        @status-changed="fetchMedicos"
        @edit-medico="abrirFormularioEdicion"
        @view-details="mostrarModalDetalles"
    />
  </div>
</template>

<script>
import MedicoForm from '../components/MedicoForm.vue';
import MedicosList from '../components/MedicosList.vue';

export default {
  name: 'App',

  components: {
    MedicoForm,
    MedicosList
  },

  data() {
    return {
      medicos: [],         // Lista de médicos
      medicoParaEditar: null // Médico seleccionado para edición
    };
  },

  methods: {
    // Obtener lista del backend
    async fetchMedicos() {
      try {
        const response = await fetch('http://localhost:8080/backend_api/api/medicos');

        if (!response.ok) {
          throw new Error('Error al obtener la lista de médicos');
        }

        this.medicos = await response.json();

      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },

    // Abrir formulario en modo edición
    abrirFormularioEdicion(medico) {
      this.medicoParaEditar = medico;

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Mostrar detalles del Médico
    mostrarModalDetalles(medico) {
      alert(`Detalles del Médico:
    ID: ${medico.id}
    Nombre: ${medico.nombre}
    Especialidad: ${medico.especialidad}
    Estado: ${medico.activo ? 'Activo' : 'Inactivo'}`);
    },

    // Se ejecuta después de guardar/actualizar
    handleMedicoSaved() {
      this.fetchMedicos();
      this.resetEdicion();
    },

    // Resetea el formulario a modo "nuevo médico"
    resetEdicion() {
      this.medicoParaEditar = null;
    }
  },

  mounted() {
    this.fetchMedicos(); // Llamado inicial
  }
}
</script>

<style>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}
</style>
