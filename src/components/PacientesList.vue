<template>
  <h3>Listado de Pacientes</h3>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Edad</th>
        <th>Estado (Activo)</th>
        <th>Acción</th> </tr>
    </thead>
    <tbody>
      <tr v-for="paciente in pacientes" :key="paciente.id">
        <td>{{ paciente.id }}</td>
        <td>{{ paciente.nombre }}</td>
        <td>{{ paciente.correo }}</td>
        <td>{{ paciente.edad }}</td>
        <td>{{ paciente.activo ? 'Sí' : 'No' }}</td>
        <td>
          <button @click="editPaciente(paciente)">
            Editar
          </button>
          
          <button @click="viewDetails(paciente)">
            Ver Detalles
          </button>

          <button @click="toggleStatus(paciente)">
            {{ paciente.activo ? 'Desactivar' : 'Activar' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
    name: 'PacientesList',
    props: ['pacientes'],
    emits: ['status-changed', 'edit-paciente', 'view-details'], // Declaración de eventos emitidos
    methods: {
        // Método ya existente para cambiar el estado (PUT /api/pacientes/{id}/status)
        async toggleStatus(paciente) {
            const nuevoEstado = !paciente.activo;
            // Asegúrate de usar la URL y puerto correctos de tu WildFly
            const url = `http://localhost:8080/backend_api/api/pacientes/${paciente.id}/status?activo=${nuevoEstado}`; 

            try {
                const response = await fetch(url, {
                    method: 'PUT' // Consumir el PUT para activar/desactivar
                });

                if (response.ok) {
                    alert(`Paciente ${paciente.nombre} ${nuevoEstado ? 'activado' : 'desactivado'}.`);
                    this.$emit('status-changed'); // Notifica al padre para recargar la lista
                } else {
                    alert('Error al cambiar el estado del paciente.');
                }
            } catch (error) {
                console.error("Status Change Error:", error);
                alert("Error de conexión con el servidor. Verifique que WildFly esté corriendo.");
            }
        },

        // Método para EDITAR (emite el paciente al padre)
        editPaciente(paciente) {
            // Se emite un evento con el paciente seleccionado para que el componente principal
            // cargue el formulario de registro con los datos para edición.
            this.$emit('edit-paciente', paciente); 
        },

        // Método para VER DETALLES (emite el paciente al padre)
        viewDetails(paciente) {
            // Se emite un evento con el paciente seleccionado.
            // El componente principal puede usar este evento para abrir un modal o una vista de solo lectura.
            this.$emit('view-details', paciente); 
        }
    }
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

td button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>