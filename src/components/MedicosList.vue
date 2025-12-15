<template>
    <h3>Listado de Médicos</h3>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Estado (Activo)</th>
                <th>Acciones</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="medico in medicos" :key="medico.id">
                <td>{{ medico.id }}</td>
                <td>{{ medico.nombre }}</td>
                <td>{{ medico.especialidad }}</td>
                <td>{{ medico.activo ? 'Sí' : 'No' }}</td>

                <td>
                    <button @click="editMedico(medico)" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button @click="viewDetails(medico)" title="Ver Detalles">
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    <button @click="toggleStatus(medico)" title="Cambiar estado">
                        <i class="fa-solid fa-power-off"></i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: 'MedicosList',
    props: ['medicos'],
    emits: ['edit-medico', 'view-details', 'status-changed'],

    methods: {
        async toggleStatus(medico) {
            const nuevoEstado = !medico.activo;

            const url = `http://localhost:8080/backend_api/api/medicos/${medico.id}/status?activo=${nuevoEstado}`;

            try {
                const response = await fetch(url, { method: 'PUT' });

                if (response.ok) {
                    alert(`Médico ${medico.nombre} ${nuevoEstado ? 'activado' : 'desactivado'}.`);
                    this.$emit('status-changed');
                } else {
                    alert('Error al cambiar el estado del médico.');
                }

            } catch (error) {
                console.error("Status Error:", error);
                alert("Error de conexión con el servidor.");
            }
        },

        editMedico(medico) {
            this.$emit('edit-medico', medico);
        },

        viewDetails(medico) {
            this.$emit('view-details', medico);
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
}

td button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
