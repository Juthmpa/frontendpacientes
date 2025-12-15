<template>
  <div id="app" class="container">
    <h1>Gestión de Citas</h1>
    <hr>

    <CitaForm
      :citaToEdit="citaParaEditar"
      @cita-saved="handleCitaSaved"
      @cancel-edit="resetEdicion"
    />

    <hr />

    <CitasList
      :citas="citas"
      :pacientes="pacientes"
      :medicos="medicos"
      :estados="estados"
      @edit-cita="abrirEdicion"
      @view-cita="mostrarDetalles"
      @delete-cita="eliminarCita"
    />

    <!-- Modal simple de detalles -->
    <div v-if="modalOpen" class="modal-backdrop" @click.self="cerrarModal">
      <div class="modal">
        <h3>Detalles de la Cita</h3>
        <p><strong>ID:</strong> {{ modalCita.idCita }}</p>
        <p><strong>Paciente:</strong> {{ nombrePaciente(modalCita.idPaciente) }}</p>
        <p><strong>Médico:</strong> {{ nombreMedico(modalCita.idMedico) }}</p>
        <p><strong>Estado:</strong> {{ nombreEstado(modalCita.idEstado) }}</p>
        <p><strong>Fecha / Hora:</strong> {{ modalCita.fechaHora }}</p>
        <p><strong>Motivo:</strong> {{ modalCita.motivo }}</p>

        <div class="modal-actions">
          <button @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CitaForm from "../components/CitaForm.vue";
import CitasList from "../components/CitasList.vue";

export default {
  name: "CitasView",
  components: { CitaForm, CitasList },
  data() {
    return {
      citas: [],
      pacientes: [],
      medicos: [],
      estados: [],
      citaParaEditar: null,

      // modal
      modalOpen: false,
      modalCita: {}
    };
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchAll() {
      try {
        const [cRes, pRes, mRes, eRes] = await Promise.all([
          fetch("http://localhost:8080/backend_api/api/citas"),
          fetch("http://localhost:8080/backend_api/api/pacientes"),
          fetch("http://localhost:8080/backend_api/api/medicos"),
          fetch("http://localhost:8080/backend_api/api/estado_cita")
        ]);

        if (cRes.ok) this.citas = await cRes.json();
        else this.citas = [];

        if (pRes.ok) this.pacientes = await pRes.json();
        else this.pacientes = [];

        if (mRes.ok) this.medicos = await mRes.json();
        else this.medicos = [];

        if (eRes.ok) this.estados = await eRes.json();
        else this.estados = [];

      } catch (error) {
        console.error("FetchAll error:", error);
      }
    },

    // abrir edición
    abrirEdicion(cita) {
      this.citaParaEditar = { ...cita };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    resetEdicion() {
      this.citaParaEditar = null;
    },

    // Maneja guardado (crear/actualizar)
    handleCitaSaved() {
      this.fetchAll();
      this.resetEdicion();
    },

    // Ver detalles (abre modal)
    mostrarDetalles(cita) {
      this.modalCita = { ...cita };
      this.modalOpen = true;
    },

    cerrarModal() {
      this.modalOpen = false;
      this.modalCita = {};
    },

    nombrePaciente(id) {
      const p = this.pacientes.find(x => x.id === id);
      return p ? p.nombre : `ID ${id}`;
    },
    nombreMedico(id) {
      const m = this.medicos.find(x => x.id === id);
      return m ? m.nombre : `ID ${id}`;
    },
    nombreEstado(id) {
      const e = this.estados.find(x => x.id === id);
      return e ? e.nombre : `ID ${id}`;
    },

    // Eliminar cita
    async eliminarCita(cita) {
      try {
        const response = await fetch(`http://localhost:8080/backend_api/api/citas/${cita.idCita}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("Cita eliminada correctamente.");
          this.fetchAll();
        } else {
          const err = await response.json().catch(() => ({ message: response.statusText }));
          alert("Error al eliminar cita: " + err.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error de conexión con el servidor.");
      }
    }
  }
};
</script>

<style scoped>
.container { max-width: 1000px; margin: 0 auto; padding: 16px; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 1000; }
.modal { background:white; padding: 20px; border-radius: 8px; width: 400px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
.modal-actions { text-align:right; margin-top: 12px; }
.modal-actions button { padding: 8px 12px; background:#168E7F; color:white; border:none; border-radius:6px; cursor:pointer; }
</style>
