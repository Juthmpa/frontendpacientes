<template>
  <div>
    <h3>Listado de Citas</h3>
    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Estado</th>
          <th>Fecha / Hora</th>
          <th>Motivo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in citas" :key="c.idCita">
          <td>{{ c.idCita }}</td>
          <td>{{ nombrePaciente(c.idPaciente) }}</td>
          <td>{{ nombreMedico(c.idMedico) }}</td>
          <td>{{ nombreEstado(c.idEstado) }}</td>
          <td>{{ c.fechaHora }}</td>
          <td>{{ c.motivo }}</td>
          <td>
            <button @click="$emit('edit-cita', c)" title="Editar">
              <i class="fa-solid fa-pen"></i>
            </button>

            <button @click="$emit('view-cita', c)" title="Ver detalles">
              <i class="fa-solid fa-eye"></i>
            </button>

            <button @click="deleteConfirm(c)" title="Eliminar">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Simple empty state -->
    <p v-if="citas.length === 0">No hay citas registradas.</p>
  </div>
</template>

<script>
export default {
  name: "CitasList",
  props: {
    citas: {
      type: Array,
      default: () => []
    },
    pacientes: { type: Array, default: () => [] },
    medicos: { type: Array, default: () => [] },
    estados: { type: Array, default: () => [] }
  },
  emits: ["delete-cita", "edit-cita", "view-cita"],
  methods: {
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
    deleteConfirm(cita) {
      if (confirm(`¿Eliminar la cita ID ${cita.idCita}? Esta acción es irreversible.`)) {
        this.$emit("delete-cita", cita);
      }
    }
  }
};
</script>

<style scoped>
.tabla { width:100%; border-collapse: collapse; margin-top:12px; }
.tabla th, .tabla td { padding:8px; border:1px solid #ddd; text-align:left; }
.tabla th { background:#f2f2f2; }
td button { margin-right:6px; padding:6px 8px; cursor:pointer; }
</style>
