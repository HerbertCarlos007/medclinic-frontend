<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const isLoginRoute = computed(() => route.path === "/login");
</script>

<template>
  <router-view v-if="isLoginRoute" />
</template>
