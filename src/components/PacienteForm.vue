<template>
  <h3>{{ isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}</h3>
  <form @submit.prevent="savePaciente" class="paciente-form">
    <input type="text" v-model="formPaciente.nombre" placeholder="Nombre" required>
    <input type="email" v-model="formPaciente.correo" placeholder="Correo" required>
    <input type="number" v-model="formPaciente.edad" placeholder="Edad" required>
    <input type="text" v-model="formPaciente.direccion" placeholder="Dirección" required>
    
    <input 
      type="text" 
      v-model="formPaciente.numeroCedula" 
      placeholder="N° Cédula (Validar)" 
      @blur="validateCedula" 
      required
      maxlength="10"
    >
    <p v-if="cedulaError" class="error-message">{{ cedulaError }}</p>

    <button type="submit">{{ isEditing ? 'Actualizar Paciente' : 'Guardar Paciente' }}</button>
    <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar Edición</button>
  </form>
</template>

<script>
export default {
    name: 'PacienteForm',
    // PROP: recibe el objeto paciente a editar. Si es null, es un nuevo registro.
    props: {
        pacienteToEdit: {
            type: Object,
            default: null
        }
    },
    emits: ['paciente-saved', 'cancel-edit'], // Eventos para notificar al padre
    data() {
        return {
            // Se utiliza una copia local del objeto para evitar modificar la prop directamente
            formPaciente: {
                nombre: '',
                correo: '',
                edad: null,
                direccion: '',
                numeroCedula: '',
                id: null // Necesario para la edición
            },
            isEditing: false, 
            API_URL: 'http://localhost:8080/backend_api/api/pacientes',
            cedulaError: null // Variable para almacenar el mensaje de error de cédula
        }
    },
    watch: {
        // Observador que se activa cuando la prop pacienteToEdit cambia (ej. al hacer click en Editar)
        pacienteToEdit: {
            handler(newValue) {
                if (newValue) {
                    this.isEditing = true;
                    // Copia profunda del paciente para editar
                    this.formPaciente = { ...newValue }; 
                } else {
                    this.resetForm();
                }
            },
            immediate: true // Se ejecuta al inicio
        }
    },
    methods: {
        // --- LÓGICA DE VALIDACIÓN LOCAL DE CÉDULA ---
        validateCedula() {
            const cedula = this.formPaciente.numeroCedula;
            this.cedulaError = null; // Reiniciar error

            if (cedula.length !== 10) {
                if (cedula.length > 0) {
                    this.cedulaError = 'La cédula debe tener 10 dígitos.';
                }
                return false;
            }
            
            if (isNaN(cedula)) {
                this.cedulaError = 'La cédula debe contener solo números.';
                return false;
            }

            const provincia = parseInt(cedula.substring(0, 2));
            if (provincia < 1 || provincia > 24) {
                this.cedulaError = 'Código de provincia no válido.';
                return false;
            }

            // Aplicar el algoritmo del dígito verificador
            const digitoVerificador = parseInt(cedula.substring(9, 10));
            let coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
            let suma = 0;
            let valor;

            for (let i = 0; i < 9; i++) {
                valor = parseInt(cedula.substring(i, i + 1)) * coeficientes[i];
                suma += (valor >= 10) ? valor - 9 : valor;
            }

            let residuo = suma % 10;
            let digitoVerificadorCalculado = (residuo === 0) ? 0 : 10 - residuo;

            if (digitoVerificadorCalculado !== digitoVerificador) {
                this.cedulaError = 'Número de cédula inválido (dígito verificador incorrecto).';
                return false;
            }

            return true;
        },
        
        // --- LÓGICA DE ENVÍO Y EDICIÓN ---
        async savePaciente() {
            if (!this.validateCedula()) {
                if (this.cedulaError === null) {
                    this.cedulaError = 'Por favor, ingrese un número de cédula válido.';
                }
                return; 
            }

            const method = this.isEditing ? 'PUT' : 'POST';
            const url = this.isEditing ? `${this.API_URL}/${this.formPaciente.id}` : this.API_URL;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    // Usar la copia local para enviar los datos
                    body: JSON.stringify(this.formPaciente) 
                });

                if (response.status === 201 || response.ok) {
                    alert(`Paciente ${this.isEditing ? 'actualizado' : 'registrado'} exitosamente.`);
                    this.resetForm(); 
                    this.$emit('paciente-saved'); // Notificar al padre para recargar la lista
                } else {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    // Muestra el mensaje de error de la API (ej. "La cédula ya está registrada")
                    alert(`Error al guardar: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Save Error:", error);
                alert("Error de conexión con el servidor. Verifique que WildFly esté corriendo.");
            }
        },
        
        // --- UTILIDADES ---
        resetForm() {
            this.formPaciente = { nombre: '', correo: '', edad: null, direccion: '', numeroCedula: '', id: null };
            this.isEditing = false;
            this.cedulaError = null;
        },
        
        cancelEdit() {
            this.resetForm();
            this.$emit('cancel-edit'); // Notificar al padre que la edición se canceló
        }
    }
}
</script>

<style scoped>
/* Estilos solo para el formulario */
.paciente-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; 
    border: 1px solid #007bff;
    padding: 15px;
    border-radius: 8px;
}

input[type="text"], input[type="email"], input[type="number"] {
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
    background-color: #dc3545; /* Botón de cancelar */
}

/* Estilo para el mensaje de error de la cédula */
.error-message {
    color: red; 
    font-size: 0.9em; 
    width: 100%; /* Asegura que ocupe toda la fila */
    margin-top: -5px;
    margin-bottom: 5px;
}
</style>