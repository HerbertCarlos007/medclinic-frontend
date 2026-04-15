<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  LayoutGrid,
  Calendar,
  Users,
  FileText,
  Stethoscope,
  DollarSign,
  User
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const isActive = (path) => route.path === path;

const menuItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Agenda", icon: Calendar, path: "/schedule" },
  { label: "Pacientes", icon: Users, path: "/patient" },
  { label: "Prontuário", icon: FileText, path: "/medical-record" },
  { label: "Médicos", icon: Stethoscope, path: "/doctor" },
  { label: "Financeiro", icon: DollarSign, path: "/transactions" },
  { label: "Usuarios", icon: User, path: "/user" },
   { label: "Clinicas", icon: User, path: "/clinic" },
];
</script>

<template>
  <div class="w-56 min-h-screen bg-white flex flex-col justify-between border-r border-gray-200 py-6 px-3">
    <!-- Logo -->
    <div>
      <div class="flex items-center gap-3 px-2 mb-8">
        <div class="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
          <Stethoscope size="18" class="text-white" />
        </div>
        <div class="leading-tight">
          <p class="text-sm font-bold text-gray-900">MedClinic</p>
          <p class="text-xs text-gray-400">Gestão Hospitalar</p>
        </div>
      </div>

      <!-- Nav Items -->
      <ul class="space-y-1">
        <li
          v-for="item in menuItems"
          :key="item.path"
          @click="router.push(item.path)"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors',
            isActive(item.path)
              ? 'bg-teal-50 text-teal-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
          ]"
        >
          <component
            :is="item.icon"
            size="18"
            :class="isActive(item.path) ? 'text-teal-600' : 'text-gray-400'"
          />
          {{ item.label }}
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="px-2">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
          <span class="text-white text-xs font-bold">MC</span>
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-gray-800">MedClinic Pro</p>
          <p class="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>