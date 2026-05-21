<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Stethoscope,
  Clock,
  X,
  User,
} from "lucide-vue-next";
import appointmentService from "../services/appointment";
import doctorService from "../services/doctor";
import patientService from "../services/patient";

const clinicId = localStorage.getItem("clinicId");

// --- Modal ---
const showModal = ref(false);
const newAppointment = ref({
  patient_id: "",
  doctor_id: "",
  scheduled_at: "",
  duration: 30,
  notes: "",
  type: "",
  status: "scheduled",
  clinic_id: clinicId,
});
const bookedTimes = ref([]);

const selectedTime = ref("");

const fullDateTime = computed(() => {
  if (!newAppointment.value.scheduled_at || !selectedTime.value) return null;

  return `${newAppointment.value.scheduled_at} ${selectedTime.value}:00`;
});

const doctors = ref([]);
const patients = ref([]);
const allAppointments = ref([]);

const today = new Date();
const selectedDate = ref(new Date());
const currentMonth = ref(
  new Date(today.getFullYear(), today.getMonth(), 1)
);

onMounted(() => {
  getDoctors();
  getPatients();
  getAllAppointments();
});

watch(
  () => [newAppointment.value.doctor_id, newAppointment.value.scheduled_at],
  async ([doctorId, date]) => {
    if (!doctorId || !date) return;

    await getAppointmentsByDoctor();
  },
);

watch(selectedDate, async () => {
  await getAllAppointments();
});

// const doctors = ["Dr. Carlos Mendes", "Dra. Ana Paula", "Dra. Julia Lima"];
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];
const appointmentTypes = ["Consulta", "Retorno", "Exame", "Primeira Consulta"];

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;

  newAppointment.value = {
    patient_id: "",
    doctor_id: "",
    scheduled_at: "",
    duration: 30,
    notes: "",
    type: "",
    status: "scheduled",
    clinic_id: clinicId,
  };

  selectedTime.value = "";
}

const minDate = computed(() => {
  const now = new Date();

  const min = new Date(now);

  if (now.getHours() >= 17) {
    min.setDate(min.getDate() + 1);
  }

  const year = min.getFullYear();
  const month = String(min.getMonth() + 1).padStart(2, "0");
  const day = String(min.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});

const scheduleAppointment = async () => {
  const payload = {
    ...newAppointment.value,
    scheduled_at: fullDateTime.value,
  };

  await appointmentService.createAppointment(payload);
  closeModal();
};

const getAppointmentsByDoctor = async () => {
  try {
    const response = await appointmentService.getAppointmentsByDoctor(
      newAppointment.value.doctor_id,
      newAppointment.value.scheduled_at,
    );

    bookedTimes.value = response.data.map((a) => {
      const date = new Date(a.scheduled_at);
      return date.toTimeString().slice(0, 5); // "08:30"
    });
  } catch (error) {
    console.log("Error fetching appointments:", error);
  }
};

const getAllAppointments = async () => {
  try {
    const response = await appointmentService.getAllAppointments(
      clinicId,
      formattedSelectedDate.value,
    );

    allAppointments.value = response.data;
  } catch (error) {
    console.log("Error fetching appointments:", error);
  }
};

const getPatients = async () => {
  try {
    const response = await patientService.getPatients(clinicId);
    patients.value = response.data;
  } catch (error) {
    console.log("Error fetching patients:", error);
  }
};

const availableSlots = computed(() => {
  return timeSlots.filter((time) => !bookedTimes.value.includes(time));
});

const getDoctors = async () => {
  try {
    const response = await doctorService.getDoctors(clinicId);
    doctors.value = response.data;
  } catch (error) {
    console.log("Error fetching doctors:", error);
  }
};

// --- Calendar logic ---

const viewMode = ref("dia");

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const weekDayNames = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
  "domingo",
];

const monthLabel = computed(
  () =>
    `${monthNames[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`,
);

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

const formattedSelectedDate = computed(() => {
  const d = selectedDate.value;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
});

// // --- Appointments ---
// const allAppointments = [
//   {
//     time: "08:00",
//     patient: "Maria Silva",
//     doctor: "Dr. Carlos Mendes",
//     duration: "30min",
//     type: "Consulta",
//   },
//   {
//     time: "08:30",
//     patient: "Joao Santos",
//     doctor: "Dra. Ana Paula",
//     duration: "20min",
//     type: "Retorno",
//   },
//   {
//     time: "09:00",
//     patient: "Pedro Costa",
//     doctor: "Dr. Carlos Mendes",
//     duration: "45min",
//     type: "Exame",
//   },
//   { time: "09:30", patient: null, doctor: null, duration: null, type: null },
//   {
//     time: "10:00",
//     patient: "Ana Oliveira",
//     doctor: "Dra. Julia Lima",
//     duration: "30min",
//     type: "Consulta",
//   },
//   {
//     time: "10:30",
//     patient: "Lucas Ferreira",
//     doctor: "Dr. Carlos Mendes",
//     duration: "45min",
//     type: "Primeira Consulta",
//   },
//   {
//     time: "11:00",
//     patient: "Carla Rodrigues",
//     doctor: "Dra. Ana Paula",
//     duration: "20min",
//     type: "Retorno",
//   },
//   { time: "11:30", patient: null, doctor: null, duration: null, type: null },
//   { time: "12:00", patient: null, doctor: null, duration: null, type: null },
//   {
//     time: "14:00",
//     patient: "Roberto Lima",
//     doctor: "Dr. Carlos Mendes",
//     duration: "30min",
//     type: "Consulta",
//   },
//   {
//     time: "14:30",
//     patient: "Patricia Souza",
//     doctor: "Dra. Julia Lima",
//     duration: "45min",
//     type: "Primeira Consulta",
//   },
//   { time: "15:00", patient: null, doctor: null, duration: null, type: null },
// ];

const bookedCount = computed(() => {
  if (!Array.isArray(allAppointments.value)) {
    return 0;
  }

  return allAppointments.value.filter((a) => a.patient).length;
});

const typeStyle = (type) => {
  if (type === "Consulta")
    return "bg-teal-50 text-teal-600 border border-teal-200";
  if (type === "Retorno")
    return "bg-blue-50 text-blue-600 border border-blue-200";
  if (type === "Exame")
    return "bg-orange-50 text-orange-500 border border-orange-200";
  if (type === "Primeira Consulta")
    return "bg-green-50 text-green-600 border border-green-200";
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

const weekHours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const shortDayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Gerencie as consultas e atendimentos
        </p>
      </div>
      <button
        @click="openModal"
        class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus size="16" /> Nova Consulta
      </button>
    </div>

    <div class="flex gap-5 items-start">
      <!-- LEFT: Mini Calendar -->
      <div class="w-80 shrink-0 bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold text-gray-800 text-sm">{{
            monthLabel
          }}</span>
          <div class="flex gap-1">
            <button
              @click="prevMonth"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft size="16" />
            </button>
            <button
              @click="nextMonth"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronRight size="16" />
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 mb-2">
          <div
            v-for="d in dayNames"
            :key="d"
            class="text-center text-xs text-gray-400 font-medium py-1"
          >
            {{ d }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-y-1">
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            class="flex items-center justify-center"
          >
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
      <div
        class="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
        >
          <div>
            <p class="font-semibold text-gray-800 text-sm capitalize">
              {{ selectedLabel }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ bookedCount }} consultas agendadas
            </p>
          </div>
          <div class="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="viewMode = 'dia'"
              :class="[
                'px-3 py-1.5 text-sm transition-colors',
                viewMode === 'dia'
                  ? 'bg-gray-100 text-gray-800 font-medium'
                  : 'text-gray-500 hover:bg-gray-50',
              ]"
            >
              Dia
            </button>
            <button
              @click="viewMode = 'semana'"
              :class="[
                'px-3 py-1.5 text-sm border-l border-gray-200 transition-colors',
                viewMode === 'semana'
                  ? 'bg-gray-100 text-gray-800 font-medium'
                  : 'text-gray-500 hover:bg-gray-50',
              ]"
            >
              Semana
            </button>
          </div>
        </div>

        <!-- DAY VIEW -->
        <div v-if="viewMode === 'dia'" class="divide-y divide-gray-100">
          <div
            v-for="(slot, i) in allAppointments"
            :key="i"
            class="flex items-start gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            <span class="text-sm text-gray-400 w-12 shrink-0 pt-1">{{
              slot.scheduled_at?.slice(11, 16)
            }}</span>
            <div
              v-if="!slot.patient"
              class="flex-1 border border-dashed border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-300 text-center"
            >
              Horario disponivel
            </div>
            <div
              v-else
              class="flex-1 bg-teal-50 border-l-4 border-teal-500 rounded-lg px-4 py-2.5 flex items-center justify-between"
            >
              <div>
                <p class="font-semibold text-gray-800 text-sm">
                  {{ slot?.patient.name }}
                </p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <Stethoscope size="11" class="text-gray-400" />
                    {{ slot?.doctor.name }}
                  </span>
                  <span class="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size="11" class="text-gray-400" />
                    {{ slot?.duration }}
                  </span>
                </div>
              </div>
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
                  typeStyle(slot?.type),
                ]"
              >
                {{ slot?.type }}
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
                    wd.toDateString() === selectedDate.toDateString()
                      ? 'text-teal-600'
                      : 'text-gray-500',
                  ]"
                >
                  <div>{{ shortDayNames[i] }}</div>
                  <div
                    :class="[
                      'w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-semibold',
                      selectedDate.value &&
                      wd.toDateString() === selectedDate.value.toDateString()
                        ? 'bg-teal-600 text-white'
                        : wd.toDateString() === today.toDateString()
                          ? 'border-2 border-teal-400 text-teal-600'
                          : 'text-gray-700',
                    ]"
                  >
                    {{ wd.getDate() }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="hour in weekHours"
                :key="hour"
                class="border-b border-gray-50"
              >
                <td class="py-4 px-3 text-gray-400 text-right align-top">
                  {{ hour }}
                </td>
                <td
                  v-for="(wd, i) in weekDays"
                  :key="i"
                  class="py-1 px-1 align-top"
                >
                  <div
                    v-if="
                      wd.toDateString() === selectedDate.value.toDateString() &&
                      allAppointments.find((a) => a.time === hour && a.patient)
                    "
                    class="bg-teal-50 border-l-2 border-teal-500 rounded px-2 py-1.5"
                  >
                    <p class="font-semibold text-gray-700 truncate">
                      {{
                        allAppointments.find(
                          (a) => a.time === hour && a.patient,
                        )?.patient
                      }}
                    </p>
                    <p class="text-gray-400 truncate">
                      {{
                        allAppointments.find(
                          (a) => a.time === hour && a.patient,
                        )?.doctor
                      }}
                    </p>
                  </div>
                  <div
                    v-else
                    class="h-10 rounded border border-dashed border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL Nova Consulta -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/30 backdrop-blur-sm"
            @click="closeModal"
          />

          <!-- Modal box -->
          <div
            class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-base font-bold text-gray-900">Nova Consulta</h2>
              <button
                @click="closeModal"
                class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size="18" />
              </button>
            </div>

            <!-- Form -->
            <div class="space-y-4">
              <!-- Paciente -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Paciente</label
                >
                <select
                  v-model="newAppointment.patient_id"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="" disabled selected>
                    Selecione um paciente
                  </option>

                  <option
                    v-for="patient in patients"
                    :key="patient.id"
                    :value="patient.id"
                  >
                    {{ patient.name }}
                  </option>
                </select>
              </div>

              <!-- Médico -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Médico</label
                >
                <select
                  v-model="newAppointment.doctor_id"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="" disabled selected>
                    Selecione um médico
                  </option>

                  <option
                    v-for="doctor in doctors"
                    :key="doctor.id"
                    :value="doctor.id"
                  >
                    {{ doctor.name }}
                  </option>
                </select>
              </div>

              <!-- Data + Horário -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5"
                    >Data</label
                  >
                  <input
                    v-model="newAppointment.scheduled_at"
                    type="date"
                    :min="minDate"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5"
                    >Horário</label
                  >
                  <select
                    v-model="selectedTime"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none bg-white"
                  >
                    <option value="" disabled selected>
                      Selecione um horário
                    </option>
                    <option v-for="t in availableSlots" :key="t" :value="t">
                      {{ t }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Tipo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Tipo</label
                >
                <select
                  v-model="newAppointment.type"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="" disabled selected>Selecione um tipo</option>
                  <option v-for="t in appointmentTypes" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Observações</label
                >
                <input
                  type="text"
                  v-model="newAppointment.notes"
                  placeholder="Ex: Paciente tem alergia a penicilina"
                  class="w-full px-3 py-10 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
              <button
                @click="closeModal"
                class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="scheduleAppointment"
                class="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
