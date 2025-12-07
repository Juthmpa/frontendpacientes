<template>
  <h3>{{ isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}</h3>
  <form @submit.prevent="savePaciente">
    <input type="text" v-model="paciente.nombre" placeholder="Nombre" required>
    <input type="email" v-model="paciente.correo" placeholder="Correo" required>
    <input type="number" v-model="paciente.edad" placeholder="Edad" required>
    <input type="text" v-model="paciente.direccion" placeholder="Dirección" required>
    
    <input 
      type="text" 
      v-model="paciente.numeroCedula" 
      placeholder="N° Cédula (Validar)" 
      @blur="validateCedula" 
      required
      maxlength="10"
    >
    <p v-if="cedulaError" style="color: red; font-size: 0.9em; width: 100%;">{{ cedulaError }}</p>

    <button type="submit">Guardar Paciente</button>
  </form>
</template>

<script>
export default {
    name: 'PacienteForm',
    data() {
        return {
            paciente: {
                nombre: '',
                correo: '',
                edad: null,
                direccion: '',
                numeroCedula: ''
            },
            isEditing: false, 
            API_URL: 'http://localhost:8080/backend_api/api/pacientes',
            cedulaError: null // Variable para almacenar el mensaje de error de cédula
        }
    },
    methods: {
        /**
         * Implementa el algoritmo del dígito verificador para la cédula ecuatoriana.
         * Muestra un error si la validación falla.
         * @returns {boolean} Retorna true si la cédula es válida.
         */
        validateCedula() {
            const cedula = this.paciente.numeroCedula;
            this.cedulaError = null; // Reiniciar error

            if (cedula.length !== 10) {
                if (cedula.length > 0) {
                   this.cedulaError = 'La cédula debe tener 10 dígitos.';
                }
                return false;
            }
            
            // 1. Validar que sean solo números
            if (isNaN(cedula)) {
                this.cedulaError = 'La cédula debe contener solo números.';
                return false;
            }

            // 2. Validar provincia (primeros dos dígitos)
            const provincia = parseInt(cedula.substring(0, 2));
            if (provincia < 1 || provincia > 24) {
                this.cedulaError = 'Código de provincia no válido.';
                return false;
            }

            // 3. Aplicar el algoritmo
            const digitoVerificador = parseInt(cedula.substring(9, 10));
            let coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
            let suma = 0;
            let valor;

            for (let i = 0; i < 9; i++) {
                valor = parseInt(cedula.substring(i, i + 1)) * coeficientes[i];
                // Si el valor es mayor a 9, se le resta 9
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
        
        async savePaciente() {
            // Validar la cédula justo antes de enviar
            if (!this.validateCedula()) {
                // Si la validación falla, nos aseguramos de que el error sea visible
                if (this.cedulaError === null) {
                    this.cedulaError = 'Por favor, ingrese un número de cédula válido.';
                }
                return; // Detiene el envío
            }

            const method = this.isEditing ? 'PUT' : 'POST';
            const url = this.isEditing ? `${this.API_URL}/${this.paciente.id}` : this.API_URL;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(this.paciente)
                });

                if (response.status === 201 || response.ok) {
                    alert('Paciente guardado exitosamente.');
                    this.resetForm(); 
                    this.$emit('paciente-saved'); 
                } else {
                    // El Backend puede devolver un error 400 con un mensaje detallado (ej. cédula inválida)
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    alert(`Error al guardar: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Save Error:", error);
                alert("Error de conexión con el servidor.");
            }
        },
        
        resetForm() {
            this.paciente = { nombre: '', correo: '', edad: null, direccion: '', numeroCedula: '' };
            this.isEditing = false;
            this.cedulaError = null; // Reiniciar el error de cédula
        }
    }
}
</script>
<style scoped>
/* Estilos solo para el formulario */
form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; 
}

/* Ajuste para que los inputs ocupen todo el ancho y el mensaje de error quede bien */
input[type="text"], input[type="email"], input[type="number"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1; 
    min-width: 150px;
}

/* El campo de cédula ocupa más espacio para la validación */
input[placeholder*="Cédula"] {
    flex-grow: 1;
}

button[type="submit"] {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>