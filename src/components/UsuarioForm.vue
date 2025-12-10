<template>
    <h3>{{ isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h3>
    <form @submit.prevent="saveUsuario" class="usuario-form">
        <input type="text" v-model="formUsuario.nombre" placeholder="Nombre" required>
        <input type="email" v-model="formUsuario.correo" placeholder="Correo" required>
        
        <input type="text" v-model="formUsuario.username" placeholder="Username" required>
        
        <input 
            type="password" 
            v-model="formUsuario.password" 
            :placeholder="isEditing ? 'Contraseña (Dejar vacío para no cambiar)' : 'Contraseña'"
            :required="!isEditing"
        >
        
        <select v-model="formUsuario.rol" required>
            <option value="" disabled>Seleccionar Rol</option>
            <option value="admin">Administrador</option>
            <option value="medico">Médico</option>
            <option value="paciente">Paciente/Cliente</option>
        </select>

        <button type="submit">{{ isEditing ? 'Actualizar Usuario' : 'Guardar Usuario' }}</button>
        <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar Edición</button>
    </form>
</template>

<script>
export default {
    name: 'UsuarioForm',
    // PROP: recibe el objeto usuario a editar. Si es null, es un nuevo registro.
    props: {
        usuarioToEdit: {
            type: Object,
            default: null
        }
    },
    emits: ['usuario-saved', 'cancel-edit'], 
    data() {
        return {
            formUsuario: {
                nombre: '',
                correo: '',
                username: '',
                password: '', // Necesario para la creación
                rol: '',
                id: null,
                activo: true // Por defecto
            },
            isEditing: false, 
            // URL ajustada para la entidad 'usuarios'
            API_URL: 'http://localhost:8080/backend_api/api/usuarios', 
        }
    },
    watch: {
        usuarioToEdit: {
            handler(newValue) {
                if (newValue) {
                    this.isEditing = true;
                    // Copia del usuario, PERO la contraseña se reinicia a vacío 
                    // para no enviar el hash cifrado de vuelta en el PUT a menos que se cambie.
                    this.formUsuario = { 
                        ...newValue,
                        password: '' // LIMPIAR la contraseña al editar
                    }; 
                } else {
                    this.resetForm();
                }
            },
            immediate: true
        }
    },
    methods: {
        async saveUsuario() {
            // Se puede añadir aquí validación local de fortaleza de contraseña si se desea.

            const method = this.isEditing ? 'PUT' : 'POST';
            const url = this.isEditing ? `${this.API_URL}/${this.formUsuario.id}` : this.API_URL;

            try {
                // Preparar el cuerpo de la petición
                let payload = { ...this.formUsuario };
                
                // Si estamos editando y el password está vacío, no lo enviamos
                if (this.isEditing && payload.password.trim() === '') {
                    delete payload.password;
                }

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(payload) 
                });

                if (response.status === 201 || response.ok) {
                    alert(`Usuario ${this.isEditing ? 'actualizado' : 'registrado'} exitosamente.`);
                    this.resetForm(); 
                    this.$emit('usuario-saved'); // Notificar al padre para recargar la lista
                } else {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    // Muestra el mensaje de error de la API (ej. "Username ya está registrado")
                    alert(`Error al guardar: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Save Error:", error);
                alert("Error de conexión con el servidor. Verifique que WildFly esté corriendo.");
            }
        },
        
        resetForm() {
            this.formUsuario = { nombre: '', correo: '', username: '', password: '', rol: 'paciente', id: null, activo: true };
            this.isEditing = false;
        },
        
        cancelEdit() {
            this.resetForm();
            this.$emit('cancel-edit');
        }
    }
}
</script>

<style scoped>
/* (Estilos copiados de PacienteForm para consistencia) */
.usuario-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; 
    border: 1px solid #007bff;
    padding: 15px;
    border-radius: 8px;
}

input[type="text"], input[type="email"], input[type="password"], select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1; 
    min-width: 150px;
}

button[type="submit"], button[type="button"] {
    padding: 10px 15px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"] {
    background-color: #007bff;
}

button[type="button"] {
    background-color: #dc3545;
}
</style>