<script setup>
import { ref, computed } from "vue";
import { Search, Phone, Mail, Eye, MoreHorizontal, Plus } from "lucide-vue-next";

const search = ref("");

const patients = ref([
  { id: 1, name: "Maria Silva Santos", initials: "MS", birth: "15/03/1985", cpf: "123.456.789-00", phone: "(11) 99999-1234", email: "maria.silva@email.com", lastVisit: "28/03/2026" },
  { id: 2, name: "Joao Pedro Costa", initials: "JP", birth: "22/07/1978", cpf: "234.567.890-11", phone: "(11) 98888-2345", email: "joao.costa@email.com", lastVisit: "25/03/2026" },
  { id: 3, name: "Ana Paula Oliveira", initials: "AP", birth: "10/12/1990", cpf: "345.678.901-22", phone: "(11) 97777-3456", email: "ana.oliveira@email.com", lastVisit: "20/03/2026" },
  { id: 4, name: "Carlos Eduardo Ferreira", initials: "CE", birth: "05/09/1982", cpf: "456.789.012-33", phone: "(11) 96666-4567", email: "carlos.ferreira@email.com", lastVisit: "18/03/2026" },
  { id: 5, name: "Patricia Lima Souza", initials: "PL", birth: "30/01/1995", cpf: "567.890.123-44", phone: "(11) 95555-5678", email: "patricia.souza@email.com", lastVisit: "15/03/2026" },
  { id: 6, name: "Roberto Almeida Junior", initials: "RA", birth: "18/06/1970", cpf: "678.901.234-55", phone: "(11) 94444-6789", email: "roberto.junior@email.com", lastVisit: "10/03/2026" },
  { id: 7, name: "Fernanda Rodrigues", initials: "FR", birth: "25/04/1988", cpf: "789.012.345-66", phone: "(11) 93333-7890", email: "fernanda.rodrigues@email.com", lastVisit: "05/03/2026" },
]);

const filtered = computed(() =>
  patients.value.filter(
    (p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.cpf.includes(search.value) ||
      p.phone.includes(search.value)
  )
);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pacientes</h1>
        <p class="text-sm text-gray-400 mt-0.5">Gerencie o cadastro de pacientes</p>
      </div>
      <button
        class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus size="16" />
        Novo Paciente
      </button>
    </div>

    <!-- Search Card -->
    <div class="bg-white rounded-xl border border-gray-200 px-4 py-4 mb-4">
      <div class="relative w-72">
        <Search size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nome, CPF ou telefone..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-teal-400 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-gray-500 font-medium px-6 py-3 w-80">Paciente</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">CPF</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Contato</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Ultima Consulta</th>
            <th class="text-right text-gray-500 font-medium px-6 py-3">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in filtered"
            :key="patient.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <!-- Paciente -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ patient.initials }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ patient.name }}</p>
                  <p class="text-xs text-gray-400">Nascimento: {{ patient.birth }}</p>
                </div>
              </div>
            </td>

            <!-- CPF -->
            <td class="px-6 py-4 text-gray-600">{{ patient.cpf }}</td>

            <!-- Contato -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span class="flex items-center gap-1.5 text-gray-600">
                  <Phone size="13" class="text-gray-400" /> {{ patient.phone }}
                </span>
                <span class="flex items-center gap-1.5 text-gray-600">
                  <Mail size="13" class="text-gray-400" /> {{ patient.email }}
                </span>
              </div>
            </td>

            <!-- Ultima Consulta -->
            <td class="px-6 py-4 text-gray-600">{{ patient.lastVisit }}</td>

            <!-- Acoes -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <button class="p-1.5 text-gray-400 hover:text-teal-600 rounded hover:bg-teal-50 transition-colors">
                  <Eye size="16" />
                </button>
                <button class="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size="16" />
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm">
              Nenhum paciente encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>