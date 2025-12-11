<template>
  <slot />
</template>

<script setup>
import { ref, provide, onMounted } from "vue";

const rolUsuario = ref("INVITADO");

onMounted(() => {
  const r = localStorage.getItem("rol");
  rolUsuario.value = r ? r.toUpperCase() : "INVITADO";
});

provide("rolUsuario", rolUsuario);
</script>