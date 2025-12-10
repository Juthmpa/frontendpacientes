<template>
    <h3>Listado de Usuarios</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Estado (Activo)</th>
                <th>Acción</th> </tr>
        </thead>
        <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.correo }}</td>
                <td>{{ usuario.username }}</td>
                <td>{{ usuario.rol }}</td>
                <td>{{ usuario.activo ? 'Sí' : 'No' }}</td>
                <td>
                    <button @click="editUsuario(usuario)">
                        Editar
                    </button>

                    <button @click="viewDetails(usuario)">
                    Ver Detalles
                    </button>
                    
                    <button @click="toggleStatus(usuario)">
                        {{ usuario.activo ? 'Desactivar' : 'Activar' }}
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: 'UsuariosList',
    props: ['usuarios'],
    emits: ['status-changed', 'edit-usuario', 'view-details'], // Declaración de eventos emitidos
    methods: {
        // Método para cambiar el estado (PUT /api/usuarios/{id}/status)
        async toggleStatus(usuario) {
            const nuevoEstado = !usuario.activo;
            // URL ajustada para el recurso de Usuario
            const url = `http://localhost:8080/backend_api/api/usuarios/${usuario.id}/status?activo=${nuevoEstado}`; 

            try {
                const response = await fetch(url, {
                    method: 'PUT' // Consumir el PUT para activar/desactivar
                });

                if (response.ok) {
                    alert(`Usuario ${usuario.username} ${nuevoEstado ? 'activado' : 'desactivado'}.`);
                    this.$emit('status-changed'); // Notifica al padre para recargar la lista
                } else {
                    alert('Error al cambiar el estado del usuario.');
                }
            } catch (error) {
                console.error("Status Change Error:", error);
                alert("Error de conexión con el servidor. Verifique que WildFly esté corriendo.");
            }
        },

        // Método para EDITAR (emite el usuario al padre)
        editUsuario(usuario) {
            // Se emite un evento con el usuario seleccionado para que el componente principal
            // cargue el formulario de registro con los datos para edición.
            this.$emit('edit-usuario', usuario); 
        },

        // Método para VER DETALLES (emite el paciente al padre)
        viewDetails(usuario) {
            // Se emite un evento con el paciente seleccionado.
            // El componente principal puede usar este evento para abrir un modal o una vista de solo lectura.
            this.$emit('view-details', usuario); 
        }
    }
}
</script>

<style scoped>
/* (Estilos copiados de PacientesList para consistencia) */
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