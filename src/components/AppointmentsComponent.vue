<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import appointmentService from '../services/appointment'

const router = useRouter()
const clinicId = localStorage.getItem("clinicId");

const todayAppointmentsByDoctor = ref([])

onMounted(() => {
  getDoctorTodayAppointments();
})

const searchQuery = ref('')

const getDoctorTodayAppointments = async () => {
  try {
    const response = await appointmentService.getDoctorTodayAppointments(clinicId);
    todayAppointmentsByDoctor.value = response.data;
  } catch (error) {
    console.log("Error fetching appointments:", error);
  }
};

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const attendedPatients = ref([
  { id: 5, name: 'Roberto Carlos Lima', age: 52, type: 'Atendido', time: '09:30', status: 'attended' },
])

const filteredWaiting = computed(() =>
  todayAppointmentsByDoctor.value.filter(appointment =>
    appointment.patient.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
)

const filteredAttended = computed(() =>
  attendedPatients.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const tagClass = (type) => {
  const map = {
    'Retorno': 'bg-amber-50 text-amber-600',
    'Consulta': 'bg-sky-50 text-sky-600',
    'Primeira Consulta': 'bg-violet-50 text-violet-600',
  }
  return map[type] ?? 'bg-gray-100 text-gray-500'
}

const selectPatient = (appointment) => {
  router.push({ name: 'consultation', params: { id: appointment.id } })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <!-- Topbar -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div class="relative w-72">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar pacientes, consultas..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-gray-300 focus:bg-white transition"
        />
      </div>

      <div class="flex items-center gap-4">
        <button class="relative text-gray-500 hover:text-gray-700 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div class="flex items-center gap-2 cursor-pointer select-none">
          <div class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold">
            DR
          </div>
          <div class="text-sm leading-tight">
            <p class="font-medium text-gray-800">Dr. Ricardo</p>
            <p class="text-xs text-gray-400">Administrador</p>
          </div>
          <svg class="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="px-8 py-7 max-w-7xl mx-auto">

      <!-- Page header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Atendimento</h1>
          <p class="text-sm text-gray-400 mt-0.5">Selecione um paciente para iniciar o atendimento</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Search patient -->
      <div class="relative w-80 mb-7">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar paciente..."
          class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition"
        />
      </div>

      <!-- Columns grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <!-- Aguardando Atendimento -->
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span class="font-medium text-sm text-gray-800">Aguardando Atendimento</span>
            </div>
            <span class="text-xs text-gray-400">{{ filteredWaiting.length }} pacientes</span>
          </div>

          <div class="divide-y divide-gray-100">
            <div
              v-for="appointment in filteredWaiting"
              :key="appointment.id"
              class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition group"
              @click="selectPatient(appointment)"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ appointment.patient.name }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-gray-400">{{ appointment.patient.age }}</span>
                    <span :class="tagClass(appointment.type)" class="text-xs px-2 py-0.5 rounded-full font-medium">
                      {{ appointment.type }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span class="text-sm text-gray-500">{{ appointment.scheduled_at.slice(11, 16) }}</span>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            <div v-if="filteredWaiting.length === 0" class="px-5 py-8 text-center text-sm text-gray-400">
              Nenhum paciente encontrado
            </div>
          </div>
        </div>

        <!-- Atendidos Hoje -->
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span class="font-medium text-sm text-gray-800">Atendidos Hoje</span>
            </div>
            <span class="text-xs text-gray-400">{{ filteredAttended.length }} pacientes</span>
          </div>

          <div class="divide-y divide-gray-100">
            <div
              v-for="patient in filteredAttended"
              :key="patient.id"
              class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition group"
              @click="selectPatient(patient)"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ patient.name }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-gray-400">{{ patient.age }} anos</span>
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">
                      Atendido
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span class="text-sm text-gray-500">{{ patient.time }}</span>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            <div v-if="filteredAttended.length === 0" class="px-5 py-8 text-center text-sm text-gray-400">
              Nenhum paciente atendido ainda
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>