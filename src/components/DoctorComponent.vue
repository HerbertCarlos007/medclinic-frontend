<script setup>
import { ref, computed } from "vue";
import { Search, Plus, Stethoscope, Phone, Mail, Calendar, MoreHorizontal, LayoutGrid, List } from "lucide-vue-next";

const search = ref("");
const viewMode = ref("cards");

const doctors = ref([
  { id: 1, name: "Dr. Carlos Mendes", initials: "DC", specialty: "Clinico Geral", crm: "123456-SP", phone: "(11) 99999-1111", email: "carlos.mendes@medclinic.com", status: "Disponivel", consultasHoje: 8 },
  { id: 2, name: "Dra. Ana Paula Silva", initials: "DA", specialty: "Cardiologia", crm: "234567-SP", phone: "(11) 99999-2222", email: "ana.paula@medclinic.com", status: "Em Consulta", consultasHoje: 6 },
  { id: 3, name: "Dra. Julia Lima", initials: "DJ", specialty: "Pediatria", crm: "345678-SP", phone: "(11) 99999-3333", email: "julia.lima@medclinic.com", status: "Disponivel", consultasHoje: 10 },
  { id: 4, name: "Dr. Roberto Santos", initials: "DR", specialty: "Ortopedia", crm: "456789-SP", phone: "(11) 99999-4444", email: "roberto.santos@medclinic.com", status: "Ausente", consultasHoje: 0 },
  { id: 5, name: "Dra. Fernanda Costa", initials: "DF", specialty: "Dermatologia", crm: "567890-SP", phone: "(11) 99999-5555", email: "fernanda.costa@medclinic.com", status: "Disponivel", consultasHoje: 5 },
  { id: 6, name: "Dr. Marcos Oliveira", initials: "DM", specialty: "Neurologia", crm: "678901-SP", phone: "(11) 99999-6666", email: "marcos.oliveira@medclinic.com", status: "Em Consulta", consultasHoje: 4 },
]);

const statusStyle = (status) => {
  if (status === "Disponivel") return "bg-green-50 text-green-600 border border-green-200";
  if (status === "Em Consulta") return "bg-teal-50 text-teal-600 border border-teal-200";
  return "bg-gray-100 text-gray-500 border border-gray-200";
};

const filtered = computed(() =>
  doctors.value.filter(
    (d) =>
      d.name.toLowerCase().includes(search.value.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.value.toLowerCase()) ||
      d.crm.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Medicos</h1>
        <p class="text-sm text-gray-400 mt-0.5">Gerencie a equipe medica</p>
      </div>
      <button class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
        <Plus size="16" /> Novo Medico
      </button>
    </div>

    <!-- Search + View Toggle -->
    <div class="bg-white rounded-xl border border-gray-200 px-4 py-4 mb-5 flex items-center justify-between">
      <div class="relative w-72">
        <Search size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nome, especialidade ou CRM..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-gray-700 placeholder-gray-400 transition"
        />
      </div>
      <div class="flex border border-gray-200 rounded-lg overflow-hidden">
        <button
          @click="viewMode = 'cards'"
          :class="['flex items-center gap-1.5 px-3 py-2 text-sm transition-colors', viewMode === 'cards' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50']"
        >
          <LayoutGrid size="14" /> Cards
        </button>
        <button
          @click="viewMode = 'lista'"
          :class="['flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-l border-gray-200', viewMode === 'lista' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50']"
        >
          <List size="14" /> Lista
        </button>
      </div>
    </div>

    <!-- CARDS VIEW -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-3 gap-4">
      <div
        v-for="doc in filtered"
        :key="doc.id"
        class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow"
      >
        <!-- Top -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0">
              {{ doc.initials }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ doc.name }}</p>
              <p class="text-xs text-gray-400">{{ doc.specialty }}</p>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors">
            <MoreHorizontal size="16" />
          </button>
        </div>

        <!-- Info -->
        <ul class="flex flex-col gap-2 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <Stethoscope size="14" class="text-gray-400 shrink-0" /> CRM: {{ doc.crm }}
          </li>
          <li class="flex items-center gap-2">
            <Phone size="14" class="text-gray-400 shrink-0" /> {{ doc.phone }}
          </li>
          <li class="flex items-center gap-2">
            <Mail size="14" class="text-gray-400 shrink-0" /> {{ doc.email }}
          </li>
        </ul>

        <hr class="border-gray-100" />

        <!-- Footer -->
        <div class="flex items-center justify-between">
          <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusStyle(doc.status)]">
            {{ doc.status }}
          </span>
          <span class="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size="13" /> {{ doc.consultasHoje }} consultas hoje
          </span>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="col-span-3 text-center py-16 text-gray-400 text-sm">
        Nenhum medico encontrado.
      </div>
    </div>

    <!-- LIST VIEW -->
    <div v-if="viewMode === 'lista'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-gray-500 font-medium px-6 py-3">Medico</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">CRM</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Contato</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Status</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Consultas Hoje</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="doc in filtered"
            :key="doc.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {{ doc.initials }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ doc.name }}</p>
                  <p class="text-xs text-gray-400">{{ doc.specialty }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ doc.crm }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1 text-gray-600">
                <span class="flex items-center gap-1.5"><Phone size="12" class="text-gray-400" /> {{ doc.phone }}</span>
                <span class="flex items-center gap-1.5"><Mail size="12" class="text-gray-400" /> {{ doc.email }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusStyle(doc.status)]">
                {{ doc.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ doc.consultasHoje }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm">Nenhum medico encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>