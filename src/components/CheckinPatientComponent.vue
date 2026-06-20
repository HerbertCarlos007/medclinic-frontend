<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import appointmentService from "../services/appointment";

const router = useRouter();
const route = useRoute();
const loading = ref(false);

const clinicId = localStorage.getItem("clinicId");
const appointmentId = route.params.id;

// Dados do agendamento (viriam de uma API/prop)
// const appointment = ref({
//   id: 1,
//   date: '12/06/2026',
//   time: '12:00',
//   status: 'agendado',
//   type: 'Consulta',
//   doctor: 'Dr. Herbert Carlos',
//   notes: ''
// })

const appointment = ref({});
const patient = ref({});

// const patient = ref({
//   name: 'João da Silva',
//   age: 36,
//   gender: 'Masculino',
//   phone: '(11) 98765-4321',
//   cpf: '123.456.789-00',
//   birthDate: '22/08/1989',
//   email: 'joao.silva@email.com',
//   address: 'Av. Paulista, 1000 - São Paulo, SP',
//   insurance: 'Particular',
//   emergencyContact: 'Ana Silva · (11) 99999-1234',
//   pendingPayment: 150.00
// })

// const initials = computed(() => {
//   return patient.value.name
//     .split(' ')
//     .map(n => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase()
// })

const doctors = [
  "Dr. Herbert Carlos",
  "Dra. Patrícia Mendes",
  "Dr. Ricardo Alves",
];

const appointmentTypes = ["Consulta", "Retorno", "Exame", "Encaixe"];

async function confirmarChegada() {
  loading.value = true;
  try {
    // await axios.patch(`/appointments/${appointment.value.id}`, {
    //   status: 'aguardando',
    //   checkin_at: new Date().toISOString(),
    //   doctor: appointment.value.doctor,
    //   type: appointment.value.type,
    //   notes: appointment.value.notes
    // })

    appointment.value.status = "aguardando";
    router.push("/agenda");
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const getAppointmentById = async () => {
  try {
    const response = await appointmentService.getAppointmentById(
      appointmentId,
      clinicId,
    );
    appointment.value = response.data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
  }
};

function remarcar() {
  router.push(`/agenda/remarcar/${appointment.value.id}`);
}

function voltar() {
  router.back();
}

onMounted(() => {
  getAppointmentById();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Topbar -->
    <div
      class="bg-white border-b border-gray-200 px-7 py-3.5 flex items-center gap-3"
    >
      <button
        @click="voltar"
        class="w-8.5 h-8.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="text-sm text-gray-400">
        Agenda &gt; Sexta-feira, {{ appointment.date }} &gt;
        <span class="text-gray-800 font-semibold">Check-in</span>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-7 py-7 flex flex-col gap-5">
      <!-- Título -->
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Check-in do Paciente</h1>
        <p class="text-sm text-gray-400 mt-1">
          Confira os dados antes de confirmar a chegada
        </p>
      </div>

      <!-- Header paciente -->
      <div
        class="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-lg font-bold flex-shrink-0"
          >
            {{ initials }}
          </div>
          <div>
            <div class="text-lg font-bold text-gray-800">
              {{ appointment?.patient?.name }}
            </div>
            <div class="text-xs text-gray-500 mt-1 flex gap-3.5 flex-wrap">
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ appointment?.patient?.age }} anos ·
                {{ appointment?.patient?.gender }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L14 12l5 2v3a2 2 0 01-2 2h-1C9.7 19 5 14.3 5 8V7z"
                  />
                </svg>
                {{ appointment?.patient?.phone }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Consulta às {{ appointment?.scheduled_at }} ·
                {{ appointment?.doctor?.name }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {{
            appointment.status === "aguardando"
              ? "Aguardando atendimento"
              : "Não chegou"
          }}
        </div>
      </div>

      <!-- Dados cadastrais -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-sm font-bold text-gray-800">
            <svg
              class="w-4 h-4 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Dados Cadastrais
          </div>
          <button
            class="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 20h9" />
              <path
                d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
              />
            </svg>
            Editar dados
          </button>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="text-xs text-gray-400 mb-1">CPF</div>
            <div class="text-sm text-gray-700 font-medium">
              {{ appointment?.patient?.cpf }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">Data de Nascimento</div>
            <div class="text-sm text-gray-700 font-medium">
              {{ appointment?.patient?.birth_date }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">Email</div>
            <div class="text-sm text-gray-700 font-medium">
              {{ appointment?.patient?.email }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">Endereço</div>
            <div class="text-sm text-gray-700 font-medium">
              {{ appointment?.patient?.address }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">Convênio</div>
            <div class="text-sm text-gray-700 font-medium">
              {{ appointment?.patient?.insurance }}
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmar Check-in -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6">
        <div
          class="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4"
        >
          <svg
            class="w-4 h-4 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          Confirmar Chegada
        </div>

        <div class="grid grid-cols-3 gap-3.5">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Médico
            </label>

            <div
              class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 bg-gray-50"
            >
              {{ appointment?.doctor?.name }}
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Horário da consulta
            </label>

            <div
              class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 bg-gray-50"
            >
              {{ appointment?.scheduled_at }}
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Tipo de atendimento
            </label>

            <div
              class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 bg-gray-50"
            >
              {{ appointment?.type }}
            </div>
          </div>

        </div>
      </div>

      <!-- Ações -->
      <div class="flex justify-end gap-3 pt-1">
        <button
          @click="remarcar"
          class="bg-white text-gray-700 border border-gray-200 hover:border-teal-400 hover:text-teal-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Remarcar
        </button>

        <button
          @click="confirmarChegada"
          :disabled="loading"
          class="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-1.5"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          {{ loading ? "Confirmando..." : "Confirmar Chegada" }}
        </button>
      </div>
    </div>
  </div>
</template>
