<template>
  <div>
    <h1>Sistema de Gestión de Atención Médica Integral</h1>

    <nav>
      <a href="/citas">Citas</a>
    </nav>
    <nav>
      <a href="/medicos">Médicos</a>
    </nav>
    <nav>
      <a href="/pacientes">Pacientes</a>
    </nav>
    <nav>
      <a href="/usuarios">Usuarios</a>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
}
</script>
