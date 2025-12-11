<template>
    <h3>{{ isEditing ? 'Editar Médico' : 'Registrar Nuevo Médico' }}</h3>

    <form @submit.prevent="saveMedico" class="medico-form">
        <input type="text" v-model="formMedico.nombre" placeholder="Nombre del Médico" required>
        <input type="text" v-model="formMedico.especialidad" placeholder="Especialidad" required>

        <button type="submit">
            {{ isEditing ? 'Actualizar Médico' : 'Guardar Médico' }}
        </button>

        <button type="button" v-if="isEditing" @click="cancelEdit">
            Cancelar Edición
        </button>
    </form>
</template>

<script>
export default {
    name: 'MedicoForm',

    props: {
        medicoToEdit: {
            type: Object,
            default: null
        }
    },

    emits: ['medico-saved', 'cancel-edit'],

    data() {
        return {
            formMedico: {
                id: null,
                nombre: '',
                especialidad: '',
                activo: true
            },

            isEditing: false,

            API_URL: 'http://localhost:8080/backend_api/api/medicos'
        }
    },

    watch: {
        medicoToEdit: {
            handler(newValue) {
                if (newValue) {
                    this.isEditing = true;
                    this.formMedico = { ...newValue };
                } else {
                    this.resetForm();
                }
            },
            immediate: true
        }
    },

    methods: {
        async saveMedico() {
            const method = this.isEditing ? 'PUT' : 'POST';
            const url = this.isEditing
                ? `${this.API_URL}/${this.formMedico.id}`
                : this.API_URL;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formMedico)
                });

                if (response.ok || response.status === 201) {
                    alert(`Médico ${this.isEditing ? 'actualizado' : 'registrado'} exitosamente.`);
                    this.resetForm();
                    this.$emit('medico-saved');
                } else {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    alert(`Error al guardar: ${errorData.message}`);
                }

            } catch (error) {
                console.error("Save Error:", error);
                alert("Error de conexión con el servidor.");
            }
        },

        resetForm() {
            this.formMedico = { id: null, nombre: '', especialidad: '', activo: true };
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
.medico-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    border: 1px solid #007bff;
    padding: 15px;
    border-radius: 8px;
}

input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
    min-width: 150px;
}

button {
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
