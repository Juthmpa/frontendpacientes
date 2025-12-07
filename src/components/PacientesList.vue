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
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="paciente in pacientes" :key="paciente.id">
        <td>{{ paciente.id }}</td>
        <td>{{ paciente.nombre }}</td>
        <td>{{ paciente.correo }}</td>
        <td>{{ paciente.edad }}</td>
        <td>{{ paciente.activo ? 'Sí' : 'No' }}</td>
        <td>
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
    methods: {
        async toggleStatus(paciente) {
            const nuevoEstado = !paciente.activo;
            const url = `http://localhost:8080/backend_api/api/pacientes/${paciente.id}/status?activo=${nuevoEstado}`; // Endpoint de estado

            try {
                const response = await fetch(url, {
                    method: 'PUT' // Consumir el PUT para activar/desactivar [cite: 42, 67]
                });

                if (response.ok) {
                    alert(`Paciente ${paciente.nombre} ${nuevoEstado ? 'activado' : 'desactivado'}.`);
                    this.$emit('status-changed'); // Recargar lista
                } else {
                    alert('Error al cambiar el estado.');
                }
            } catch (error) {
                console.error("Status Change Error:", error);
            }
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
</style>