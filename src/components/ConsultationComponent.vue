<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import appointmentService from "../services/appointment";
import medicalRecordService from "../services/medicalRecord";

const router = useRouter();
const route = useRoute();
const appointmentId = route.params.id;

const activeTab = ref("anamnese");
const tabs = [
  { key: "anamnese", label: "Anamnese", icon: "list" },
  { key: "exame-fisico", label: "Exame Fisico", icon: "stethoscope" },
  { key: "prescricao", label: "Prescricao", icon: "pill" },
  { key: "exames", label: "Exames", icon: "pencil" },
];

const patient = ref([]);

const anamnese = ref({
  chief_complaint: "",
  current_illness_history: "",
  diagnostic_hypothesis: "",
});

const vitalSign = ref({
  blood_pressure: "",
  heart_rate: "",
  temperature: "",
  weight: "",
  height: "",
  oxygen_saturation: "",
});

const physicalExam = ref({
  description: "",
  conduct: "",
  observations: "",
});

const exam = ref({
  name: "",
  notes: "",
});

const prescription = ref({
  medication: "",
  dosage: "",
  frequency: "",
  duration: "",
});

const prescriptions = ref([]);
const requestedExams = ref([]);

const commonExams = [
  "Hemograma completo",
  "Glicemia em jejum",
  "Colesterol total",
  "Triglicérides",
  "TGO/TGP",
  "Creatinina",
  "Ureia",
  "TSH",
  "Raio-X Tórax",
  "Eletrocardiograma",
];

function addMedication() {
  if (!prescription.value.medication) return;
  prescriptions.value.push({ ...prescription.value });
  prescription.value = {
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
  };
}

const removeMedication = (index) => {
  prescriptions.value.splice(index, 1);
};

const addExam = () => {
  if (!exam.value.name.trim()) return;
  requestedExams.value.push(exam.value.name.trim());
  exam.value = { name: "", notes: "" };
};

const addExamFromTag = (name) => {
  if (!requestedExams.value.includes(name)) requestedExams.value.push(name);
};

const removeExam = (index) => {
  requestedExams.value.splice(index, 1);
};

const saveDraft = () => {
  const draft = {
    vital_sign: vitalSign.value,
    anamnese: anamnese.value,
    physical_exam: physicalExam.value,
    prescription: prescriptions.value,
    exam: requestedExams.value,
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem("medical_record_draft", JSON.stringify(draft));
};

const loadDraft = () => {
  const saved = localStorage.getItem("medical_record_draft");

  if (!saved) return;

  const draft = JSON.parse(saved);

  vitalSign.value = draft.vital_sign ?? vitalSign.value;
  anamnese.value = draft.anamnese ?? anamnese.value;
  physicalExam.value = draft.physical_exam ?? physicalExam.value;
  prescriptions.value = draft.prescription ?? prescriptions.value;
  requestedExams.value = draft.exam ?? requestedExams.value;
};

const buildMedicalRecordPayload = () => ({
  medical_record: {
    appointment_id: Number(appointmentId),
  },

  anamnese: {
    chief_complaint: anamnese.value.chief_complaint,
    current_illness_history: anamnese.value.current_illness_history,
    diagnostic_hypothesis: anamnese.value.diagnostic_hypothesis,
  },

  vital_sign: {
    blood_pressure: vitalSign.value.blood_pressure,
    heart_rate: vitalSign.value.heart_rate,
    temperature: vitalSign.value.temperature,
    weight: vitalSign.value.weight,
    height: vitalSign.value.height,
    oxygen_saturation: vitalSign.value.oxygen_saturation,
  },

  physical_exam: {
    description: physicalExam.value.description,
    conduct: physicalExam.value.conduct,
    observations: physicalExam.value.observations,
  },

  exam: requestedExams.value.map((name) => ({
    name: name.trim(),
  })),

  prescription: prescriptions.value.map((item) => ({
    medication: item.medication,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
  })),
});

const finalizeAttendance = async () => {
  try {
    const payload = buildMedicalRecordPayload();
    await medicalRecordService.createMedicalRecord(payload);
    router.push("/appointments");
  } catch (error) {
    console.log("Error finalizing attendance:", error);
  }
};

const getAppointmentById = async () => {
  try {
    const response = await appointmentService.getAppointmentById(appointmentId);

    patient.value = response.data.patient;
  } catch (error) {
    console.log("Error fetching appointments:", error);
  }
};

const goBack = () => router.back();

onMounted(() => {
  getAppointmentById();
  loadDraft();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Topbar -->
    <header
      class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between"
    >
      <div class="relative w-72">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
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
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>
        <div class="flex items-center gap-2 cursor-pointer select-none">
          <div
            class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold"
          >
            DR
          </div>
          <div class="text-sm leading-tight">
            <p class="font-medium text-gray-800">Dr. Ricardo</p>
            <p class="text-xs text-gray-400">Administrador</p>
          </div>
          <svg
            class="w-4 h-4 text-gray-400 ml-1"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </header>

    <!-- Page Header -->
    <div
      class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="text-gray-400 hover:text-gray-700 transition"
          aria-label="Voltar"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Atendimento</h1>
          <p class="text-xs text-gray-400 mt-0.5">
            Registro de consulta medica
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="saveDraft"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Salvar Rascunho
        </button>
        <button
          @click="finalizeAttendance"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Finalizar Atendimento
        </button>
      </div>
    </div>

    <!-- Main -->
    <main class="px-8 py-6 max-w-7xl mx-auto flex gap-6">
      <!-- Sidebar paciente -->
      <aside class="w-72 flex-shrink-0 flex flex-col gap-4">
        <!-- Info Card -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900 text-sm">
                {{ patient.name }}
              </p>
              <p class="text-xs text-gray-400">
                {{ patient.age }} anos - {{ patient.gender }}
              </p>
            </div>
          </div>

          <div
            class="flex flex-col gap-2 text-sm border-t border-gray-100 pt-4"
          >
            <div class="flex items-center gap-2 text-gray-500">
              <svg
                class="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {{ patient.birth_date }}
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <svg
                class="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
              {{ patient.phone }}
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-400">Convenio:</span>
              <span class="font-medium text-gray-800">{{
                patient.insurance
              }}</span>
            </div>
          </div>

          <button
            class="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Ver Prontuario Completo
          </button>
        </div>

        <!-- Alergias -->
        <div class="bg-red-50 border border-red-100 rounded-2xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg
              class="w-4 h-4 text-red-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span class="text-sm font-semibold text-red-700">Alergias</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="allergy in patient.allergies"
              :key="allergy"
              class="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium"
            >
              {{ allergy }}
            </span>
          </div>
        </div>

        <!-- Medicamentos -->
        <div class="bg-white border border-gray-200 rounded-2xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg
              class="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"
              />
              <path d="m8.5 8.5 7 7" />
            </svg>
            <span class="text-sm font-semibold text-gray-800"
              >Medicamentos em Uso</span
            >
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="medication in patient.medications"
              :key="medication.name"
            >
              <p class="text-sm font-medium text-gray-800">
                {{ medication.name }}
              </p>
              <p class="text-xs text-teal-600">{{ medication.dosage }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main area -->
      <div class="flex-1 min-w-0 flex flex-col gap-5">
        <!-- Sinais Vitais -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg
              class="w-5 h-5 text-teal-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <h2 class="text-sm font-semibold text-gray-800">Sinais Vitais</h2>
          </div>
          <div class="grid grid-cols-3 xl:grid-cols-6 gap-3">
            <div
              v-for="(value, key) in vitalSign"
              :key="key"
              class="flex flex-col gap-1"
            >
              <label class="text-xs text-teal-600 font-medium">
                {{
                  {
                    blood_pressure: "Pressao Arterial",
                    heart_rate: "Freq. Cardiaca",
                    frequency: "Freq. Cardiaca",
                    temperature: "Temperatura",
                    weight: "Peso (kg)",
                    height: "Altura (cm)",
                    oxygen_saturation: "Saturacao O2",
                  }[key]
                }}
              </label>
              <input
                v-model="vitalSign[key]"
                type="text"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-teal-400 transition"
              />
            </div>
          </div>
        </div>

        <!-- Tabs + Conteudo -->
        <div
          class="bg-white border border-gray-200 rounded-2xl overflow-hidden"
        >
          <!-- Tab bar -->
          <div class="flex border-b border-gray-100">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2',
                activeTab === tab.key
                  ? 'text-white bg-teal-600 border-teal-600'
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              <!-- Anamnese -->
              <svg
                v-if="tab.key === 'anamnese'"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                />
                <rect width="6" height="4" x="9" y="3" rx="1" ry="1" />
              </svg>
              <!-- Exame Fisico -->
              <svg
                v-if="tab.key === 'exame-fisico'"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"
                />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <!-- Prescricao -->
              <svg
                v-if="tab.key === 'prescricao'"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"
                />
              </svg>
              <!-- Exames -->
              <svg
                v-if="tab.key === 'exames'"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20h9" />
                <path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                />
              </svg>
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab content -->
          <div class="p-6">
            <!-- Anamnese -->
            <div v-if="activeTab === 'anamnese'" class="flex flex-col gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Queixa Principal</label
                >
                <textarea
                  v-model="anamnese.chief_complaint"
                  rows="3"
                  placeholder="Descreva a queixa principal do paciente..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Historia da Doenca Atual</label
                >
                <textarea
                  v-model="anamnese.currentIllnessHistory"
                  rows="4"
                  placeholder="Descreva a historia da doenca atual..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Hipotese Diagnostica</label
                >
                <textarea
                  v-model="anamnese.diagnostic_hypothesis"
                  rows="3"
                  placeholder="Descreva a hipotese diagnostica..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
            </div>

            <!-- Exame Fisico -->
            <div
              v-if="activeTab === 'exame-fisico'"
              class="flex flex-col gap-5"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Exame Fisico</label
                >
                <textarea
                  v-model="physicalExam.description"
                  rows="3"
                  placeholder="Descreva o exame físico..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Conduta</label
                >
                <textarea
                  v-model="physicalExam.conduct"
                  rows="4"
                  placeholder="Descreva a conduta..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Observações</label
                >
                <textarea
                  v-model="physicalExam.observations"
                  rows="3"
                  placeholder="Descreva as observações..."
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition resize-none text-gray-500 placeholder-gray-300"
                />
              </div>
            </div>

            <!-- Prescricao -->
            <div v-if="activeTab === 'prescricao'" class="flex flex-col gap-5">
              <!-- Adicionar Medicamento -->
              <div class="bg-white border border-gray-200 rounded-2xl p-5">
                <p class="text-sm font-semibold text-gray-700 mb-3">
                  Adicionar Medicamento
                </p>
                <div class="flex gap-2 items-center">
                  <input
                    v-model="prescription.medication"
                    type="text"
                    placeholder="Medicamento"
                    class="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition text-gray-600 placeholder-gray-300"
                  />
                  <input
                    v-model="prescription.dosage"
                    type="text"
                    placeholder="Dosagem (ex: 500mg)"
                    class="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition text-gray-600 placeholder-gray-300"
                  />
                  <input
                    v-model="prescription.frequency"
                    type="text"
                    placeholder="Posologia (ex: 8/8h)"
                    class="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition text-gray-600 placeholder-gray-300"
                  />
                  <input
                    v-model="prescription.duration"
                    type="text"
                    placeholder="Duração (ex: 7 dias)"
                    class="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition text-gray-600 placeholder-gray-300"
                  />
                  <button
                    @click="addMedication"
                    class="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center text-xl transition flex-shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Medicamentos Prescritos -->
              <div class="bg-white border border-gray-200 rounded-2xl p-5">
                <p class="text-sm font-semibold text-gray-700 mb-3">
                  Medicamentos Prescritos
                </p>
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(med, index) in prescriptions"
                    :key="index"
                    class="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p class="text-sm font-semibold text-gray-800">
                        {{ med.medication }} {{ med.dosage }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">
                        {{ med.frequency }} - {{ med.duration }}
                      </p>
                    </div>
                    <button
                      @click="removeMedication(index)"
                      class="text-red-400 hover:text-red-600 transition p-1"
                    >
                      <!-- ícone de lixeira -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                  <p
                    v-if="!prescriptions.length"
                    class="text-sm text-gray-400 text-center py-2"
                  >
                    Nenhum medicamento prescrito.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'exames'" class="flex flex-col gap-5">
              <!-- Solicitar Exame -->
              <div class="bg-white border border-gray-200 rounded-2xl p-5">
                <p class="text-sm font-semibold text-gray-700 mb-3">
                  Solicitar Exame
                </p>
                <div class="flex gap-2 items-center">
                  <input
                    v-model="exam.name"
                    @keydown.enter="addExam"
                    type="text"
                    placeholder="Nome do exame (ex: Hemograma completo)"
                    class="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition text-gray-600 placeholder-gray-300"
                  />
                  <button
                    @click="addExam"
                    class="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center text-xl transition flex-shrink-0"
                  >
                    +
                  </button>
                </div>

                <div class="mt-4">
                  <p class="text-xs text-teal-600 mb-2">Exames comuns:</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="exam in commonExams"
                      :key="exam"
                      @click="addExamFromTag(exam)"
                      class="px-3 py-1.5 text-xs border border-gray-300 rounded-full text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition"
                    >
                      + {{ exam }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Exames Solicitados -->
              <div>
                <p class="text-sm font-semibold text-gray-800 mb-3">
                  Exames Solicitados
                </p>
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(exam, index) in requestedExams"
                    :key="index"
                    class="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-4 py-3"
                  >
                    <div
                      class="flex items-center gap-2 text-sm font-medium text-gray-800"
                    >
                      <svg
                        class="w-3.5 h-3.5 text-teal-500"
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
                      {{ exam }}
                    </div>
                    <button
                      @click="removeExam(index)"
                      class="text-red-400 hover:text-red-600 transition p-1"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                  <p
                    v-if="!requestedExams.length"
                    class="text-sm text-gray-400 text-center py-2"
                  >
                    Nenhum exame solicitado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
