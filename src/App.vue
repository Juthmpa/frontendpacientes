<template>
  <div id="app" class="container">
    <h1>Gestión de Pacientes</h1>
    <hr>
    
    <PacienteForm @paciente-saved="fetchPacientes" />

    <hr>
    
    <PacientesList :pacientes="pacientes" @status-changed="fetchPacientes" />
  </div>
</template>

<script>
import PacienteForm from './components/PacienteForm.vue';
import PacientesList from './components/PacientesList.vue';

export default {
  name: 'App',
  components: {
    PacienteForm,
    PacientesList
  },
  data() {
    return {
      pacientes: []
    }
  },
  methods: {
    // Método para cargar la lista desde el API
    async fetchPacientes() {
      try {
        const response = await fetch('http://localhost:8080/backend_api/api/pacientes'); // Asume el backend en 8080
        if (!response.ok) {
          throw new Error('Error al obtener la lista de pacientes');
        }
        this.pacientes = await response.json();
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
  },
  mounted() {
    this.fetchPacientes(); // Cargar datos al iniciar
  }
}
</script>