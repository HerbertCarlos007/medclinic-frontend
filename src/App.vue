<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import SidebarComponent from "./components/SidebarComponent.vue";

const route = useRoute();
const isLoginRoute = computed(() => route.path === "/login");
</script>

<template>
  <router-view v-if="isLoginRoute" />

  <!-- SISTEMA -->
  <div v-else class="w-full min-h-screen  flex flex-col">

    <div class="flex flex-1">
      <SidebarComponent />

      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
