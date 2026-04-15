<script setup>
import { ref, computed } from "vue";
import { ChevronLeft, ChevronRight, Plus, Stethoscope, Clock } from "lucide-vue-next";

// --- Calendar logic ---
const today = new Date(2026, 2, 30); // March 30 2026
const selectedDate = ref(new Date(2026, 2, 30));
const currentMonth = ref(new Date(2026, 2, 1));
const viewMode = ref("dia");

const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const dayNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];
const weekDayNames = ["segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado","domingo"];

const monthLabel = computed(() => `${monthNames[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`);

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
});

function prevMonth() {
  const d = new Date(currentMonth.value);
  d.setMonth(d.getMonth() - 1);
  currentMonth.value = d;
}
function nextMonth() {
  const d = new Date(currentMonth.value);
  d.setMonth(d.getMonth() + 1);
  currentMonth.value = d;
}
function selectDay(day) {
  if (day) selectedDate.value = day;
}
function isToday(day) {
  return day && day.toDateString() === today.toDateString();
}
function isSelected(day) {
  return day && day.toDateString() === selectedDate.value.toDateString();
}

const selectedLabel = computed(() => {
  const d = selectedDate.value;
  const wd = weekDayNames[(d.getDay() + 6) % 7];
  return `${wd}, ${d.getDate()} de ${monthNames[d.getMonth()].toLowerCase()}`;
});

// --- Appointments ---
const allAppointments = [
  { time: "08:00", patient: "Maria Silva", doctor: "Dr. Carlos Mendes", duration: "30min", type: "Consulta" },
  { time: "08:30", patient: "Joao Santos", doctor: "Dra. Ana Paula", duration: "20min", type: "Retorno" },
  { time: "09:00", patient: "Pedro Costa", doctor: "Dr. Carlos Mendes", duration: "45min", type: "Exame" },
  { time: "09:30", patient: null, doctor: null, duration: null, type: null },
  { time: "10:00", patient: "Ana Oliveira", doctor: "Dra. Julia Lima", duration: "30min", type: "Consulta" },
  { time: "10:30", patient: "Lucas Ferreira", doctor: "Dr. Carlos Mendes", duration: "45min", type: "Primeira Consulta" },
  { time: "11:00", patient: "Carla Rodrigues", doctor: "Dra. Ana Paula", duration: "20min", type: "Retorno" },
  { time: "11:30", patient: null, doctor: null, duration: null, type: null },
  { time: "12:00", patient: null, doctor: null, duration: null, type: null },
  { time: "14:00", patient: "Roberto Lima", doctor: "Dr. Carlos Mendes", duration: "30min", type: "Consulta" },
  { time: "14:30", patient: "Patricia Souza", doctor: "Dra. Julia Lima", duration: "45min", type: "Primeira Consulta" },
  { time: "15:00", patient: null, doctor: null, duration: null, type: null },
];

const bookedCount = computed(() => allAppointments.filter(a => a.patient).length);

const typeStyle = (type) => {
  if (type === "Consulta") return "bg-teal-50 text-teal-600 border border-teal-200";
  if (type === "Retorno") return "bg-blue-50 text-blue-600 border border-blue-200";
  if (type === "Exame") return "bg-orange-50 text-orange-500 border border-orange-200";
  if (type === "Primeira Consulta") return "bg-green-50 text-green-600 border border-green-200";
  return "";
};

// --- Week view ---
const weekDays = computed(() => {
  const d = new Date(selectedDate.value);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(monday);
    nd.setDate(monday.getDate() + i);
    return nd;
  });
});

const weekHours = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const shortDayNames = ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
        <p class="text-sm text-gray-400 mt-0.5">Gerencie as consultas e atendimentos</p>
      </div>
      <button class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
        <Plus size="16" /> Nova Consulta
      </button>
    </div>

    <div class="flex gap-5 items-start">
      <!-- LEFT: Mini Calendar -->
      <div class="w-80 shrink-0 bg-white rounded-xl border border-gray-200 p-5">
        <!-- Month nav -->
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold text-gray-800 text-sm">{{ monthLabel }}</span>
          <div class="flex gap-1">
            <button @click="prevMonth" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <ChevronLeft size="16" />
            </button>
            <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <ChevronRight size="16" />
            </button>
          </div>
        </div>

        <!-- Day headers -->
        <div class="grid grid-cols-7 mb-2">
          <div v-for="d in dayNames" :key="d" class="text-center text-xs text-gray-400 font-medium py-1">
            {{ d }}
          </div>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 gap-y-1">
          <div v-for="(day, i) in calendarDays" :key="i" class="flex items-center justify-center">
            <button
              v-if="day"
              @click="selectDay(day)"
              :class="[
                'w-8 h-8 rounded-full text-sm transition-colors flex items-center justify-center',
                isSelected(day)
                  ? 'bg-teal-600 text-white font-bold'
                  : isToday(day)
                  ? 'border-2 border-teal-400 text-teal-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              {{ day.getDate() }}
            </button>
            <div v-else class="w-8 h-8" />
          </div>
        </div>
      </div>

      <!-- RIGHT: Schedule -->
      <div class="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Schedule header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="font-semibold text-gray-800 text-sm capitalize">{{ selectedLabel }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ bookedCount }} consultas agendadas</p>
          </div>
          <div class="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="viewMode = 'dia'"
              :class="['px-3 py-1.5 text-sm transition-colors', viewMode === 'dia' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50']"
            >Dia</button>
            <button
              @click="viewMode = 'semana'"
              :class="['px-3 py-1.5 text-sm border-l border-gray-200 transition-colors', viewMode === 'semana' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50']"
            >Semana</button>
          </div>
        </div>

        <!-- DAY VIEW -->
        <div v-if="viewMode === 'dia'" class="divide-y divide-gray-100">
          <div
            v-for="(slot, i) in allAppointments"
            :key="i"
            class="flex items-start gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            <!-- Time -->
            <span class="text-sm text-gray-400 w-12 shrink-0 pt-1">{{ slot.time }}</span>

            <!-- Empty slot -->
            <div
              v-if="!slot.patient"
              class="flex-1 border border-dashed border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-300 text-center"
            >
              Horario disponivel
            </div>

            <!-- Appointment -->
            <div
              v-else
              class="flex-1 bg-teal-50 border-l-4 border-teal-500 rounded-lg px-4 py-2.5 flex items-center justify-between"
            >
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ slot.patient }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <Stethoscope size="11" class="text-gray-400" /> {{ slot.doctor }}
                  </span>
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size="11" class="text-gray-400" /> {{ slot.duration }}
                  </span>
                </div>
              </div>
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full shrink-0', typeStyle(slot.type)]">
                {{ slot.type }}
              </span>
            </div>
          </div>
        </div>

        <!-- WEEK VIEW -->
        <div v-if="viewMode === 'semana'" class="overflow-x-auto">
          <table class="w-full text-xs min-w-[700px]">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="w-14 py-3 text-gray-400 font-normal"></th>
                <th
                  v-for="(wd, i) in weekDays"
                  :key="i"
                  :class="[
                    'py-3 text-center font-medium',
                    wd.toDateString() === selectedDate.toDateString() ? 'text-teal-600' : 'text-gray-500',
                  ]"
                >
                  <div>{{ shortDayNames[i] }}</div>
                  <div
                    :class="[
                      'w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-semibold',
                      wd.toDateString() === selectedDate.value.toDateString()
                        ? 'bg-teal-600 text-white'
                        : wd.toDateString() === today.toDateString()
                        ? 'border-2 border-teal-400 text-teal-600'
                        : 'text-gray-700',
                    ]"
                  >{{ wd.getDate() }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hour in weekHours" :key="hour" class="border-b border-gray-50">
                <td class="py-4 px-3 text-gray-400 text-right align-top">{{ hour }}</td>
                <td v-for="(wd, i) in weekDays" :key="i" class="py-1 px-1 align-top">
                  <div
                    v-if="wd.toDateString() === selectedDate.value.toDateString() && allAppointments.find(a => a.time === hour && a.patient)"
                    class="bg-teal-50 border-l-2 border-teal-500 rounded px-2 py-1.5"
                  >
                    <p class="font-semibold text-gray-700 truncate">
                      {{ allAppointments.find(a => a.time === hour && a.patient)?.patient }}
                    </p>
                    <p class="text-gray-400 truncate">
                      {{ allAppointments.find(a => a.time === hour && a.patient)?.doctor }}
                    </p>
                  </div>
                  <div v-else class="h-10 rounded border border-dashed border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>