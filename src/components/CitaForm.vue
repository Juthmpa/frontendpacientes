<template>
  <div class="card-form">
    <h3>{{ isEditing ? 'Editar Cita' : 'Registrar Nueva Cita' }}</h3>

    <form @submit.prevent="saveCita" class="cita-form">

      <!-- Paciente -->
      <label>Paciente</label>
      <select v-model.number="form.idPaciente" required>
        <option value="" disabled>Seleccione paciente</option>
        <option v-for="p in pacientes" :key="p.id" :value="p.id">
          {{ p.nombre }}
        </option>
      </select>

      <!-- Médico -->
      <label>Médico</label>
      <select v-model.number="form.idMedico" required>
        <option value="" disabled>Seleccione médico</option>
        <option v-for="m in medicos" :key="m.id" :value="m.id">
          {{ m.nombre }}
        </option>
      </select>

      <!-- Estado -->
      <label>Estado</label>
      <select v-model.number="form.idEstado" required>
        <option value="" disabled>Seleccione estado</option>
        <option v-for="e in estados" :key="e.id" :value="e.id">
          {{ e.nombre }}
        </option>
      </select>

      <!-- Fecha -->
      <label>Fecha y Hora</label>
      <input type="datetime-local" v-model="formInputFecha" required />
      <p v-if="fechaError" class="error-message">{{ fechaError }}</p>

      <!-- Motivo -->
      <label>Motivo</label>
      <input type="text" v-model="form.motivo" maxlength="255" />

      <div class="form-actions">
        <button type="submit">
          {{ isEditing ? 'Actualizar Cita' : 'Guardar Cita' }}
        </button>
        <button v-if="isEditing" type="button" @click="cancelEdit">
          Cancelar
        </button>
      </div>

    </form>
  </div>
</template>

<script>
export default {
  name: "CitaForm",

  props: {
    citaToEdit: Object
  },

  emits: ["cita-saved", "cancel-edit"],

  data() {
    return {
      // formulario
      form: {
        idCita: null,
        idPaciente: null,
        idMedico: null,
        idEstado: null,
        fechaHora: null,
        motivo: ""
      },

      formInputFecha: "",
      isEditing: false,
      fechaError: null,

      // listas
      pacientes: [],
      medicos: [],
      estados: [],

      // URLs
      PACIENTES_URL: "http://localhost:8080/backend_api/api/pacientes",
      MEDICOS_URL: "http://localhost:8080/backend_api/api/medicos",
      ESTADOS_URL: "http://localhost:8080/backend_api/api/estado_cita"
    };
  },

  watch: {
    citaToEdit: {
      immediate: true,
      handler(cita) {
        if (!cita) {
          this.resetForm();
          return;
        }

        this.isEditing = true;
        this.form = { ...cita };
        this.formInputFecha = cita.fechaHora?.replace(" ", "T").slice(0, 16);
      }
    }
  },

  mounted() {
    this.fetchSelects();
  },

  methods: {
    async fetchSelects() {
      try {
        const [p, m, e] = await Promise.all([
          fetch(this.PACIENTES_URL),
          fetch(this.MEDICOS_URL),
          fetch(this.ESTADOS_URL)
        ]);

        this.pacientes = p.ok ? await p.json() : [];
        this.medicos   = m.ok ? await m.json() : [];
        this.estados   = e.ok ? await e.json() : [];

      } catch (err) {
        console.error("Error cargando selects", err);
      }
    },

    validarFecha() {
      if (!this.formInputFecha) {
        this.fechaError = "Fecha obligatoria";
        return false;
      }

      const d = new Date(this.formInputFecha);
      if (d < new Date()) {
        this.fechaError = "No puede ser fecha pasada";
        return false;
      }

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      const hh = String(d.getHours()).padStart(2,'0');
      const mi = String(d.getMinutes()).padStart(2,'0');

      this.form.fechaHora = `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
      this.fechaError = null;
      return true;
    },

    async saveCita() {
      if (!this.validarFecha()) return;

      const url = this.isEditing
        ? `http://localhost:8080/backend_api/api/citas/${this.form.idCita}`
        : `http://localhost:8080/backend_api/api/citas`;

      const method = this.isEditing ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form)
        });

        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            throw json;
          } catch {
            throw { message: text };
          }
        }

        alert("Cita guardada correctamente");
        this.$emit("cita-saved");
        this.resetForm();

      } catch (err) {
        alert(err.message || "Error al guardar");
      }
    },

    cancelEdit() {
      this.resetForm();
      this.$emit("cancel-edit");
    },

    resetForm() {
      this.isEditing = false;
      this.form = {
        idCita: null,
        idPaciente: null,
        idMedico: null,
        idEstado: null,
        fechaHora: null,
        motivo: ""
      };
      this.formInputFecha = "";
    }
  }
};
</script>

<style scoped>
.card-form { border:1px solid #168E7F; padding:12px; border-radius:8px; }
.cita-form { display:flex; flex-direction:column; gap:8px; }
select, input { padding:8px; border:1px solid #ccc; border-radius:4px; }
.form-actions { display:flex; gap:8px; margin-top:10px; }
button { padding:8px 14px; border:none; border-radius:6px; color:white; cursor:pointer; }
button[type="submit"] { background:#168E7F; }
button[type="button"] { background:#dc3545; }
.error-message { color:red; font-size:0.9em; }
</style>
