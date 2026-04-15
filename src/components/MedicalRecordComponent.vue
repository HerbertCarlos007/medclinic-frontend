<script setup>
import { ref } from "vue";
import {
  ArrowLeft, Calendar, Phone, Mail, MapPin,
  AlertTriangle, Pill, Activity, FileText, ClipboardEdit, Plus,
} from "lucide-vue-next";

const activeTab = ref("historico");

const newObs = ref("");
const observations = ref([
  { date: "28/03/2026", doctor: "Dr. Carlos Mendes", text: "Paciente deve evitar alimentos gordurosos e manter dieta equilibrada. Retorno em 30 dias para acompanhamento." },
  { date: "15/02/2026", doctor: "Dr. Carlos Mendes", text: "Paciente apresentou melhora significativa. Continuar com medicacao atual." },
]);

function addObservation() {
  if (!newObs.value.trim()) return;
  observations.value.unshift({
    date: new Date().toLocaleDateString("pt-BR"),
    doctor: "Dr. Carlos Mendes",
    text: newObs.value.trim(),
  });
  newObs.value = "";
}

const patient = {
  name: "Maria Silva Santos",
  initials: "MS",
  age: "41 anos - Feminino",
  birth: "15/03/1985",
  phone: "(11) 99999-1234",
  email: "maria.silva@email.com",
  address: "Rua das Flores, 123 - Centro, Sao Paulo - SP",
  blood: "O+",
  cpf: "123.456.789-00",
  allergies: ["Penicilina", "Dipirona", "Frutos do mar"],
  medications: [
    { name: "Losartana 50mg", dosage: "1 comprimido ao dia" },
    { name: "Metformina 850mg", dosage: "1 comprimido apos almoco" },
  ],
  vitals: [
    { label: "Pressao Arterial", value: "120/80" },
    { label: "Freq. Cardiaca", value: "72 bpm" },
    { label: "Temperatura", value: "36.5 C" },
    { label: "Peso", value: "68 kg" },
  ],
};

const consultations = [
  {
    type: "Consulta",
    typeColor: "bg-teal-100 text-teal-700",
    date: "28/03/2026",
    doctor: "Dr. Carlos Mendes",
    specialty: "Clinico Geral",
    notes: "Paciente relata dores de cabeca frequentes. Solicitados exames de sangue e ressonancia magnetica.",
    prescription: "Dipirona 500mg - 1 comprimido a cada 6 horas por 5 dias",
  },
  {
    type: "Retorno",
    typeColor: "bg-blue-100 text-blue-700",
    date: "15/02/2026",
    doctor: "Dr. Carlos Mendes",
    specialty: "Clinico Geral",
    notes: "Retorno para avaliacao de exames. Resultados dentro da normalidade. Paciente apresenta melhora.",
    prescription: null,
  },
  {
    type: "Primeira Consulta",
    typeColor: "bg-green-100 text-green-700",
    date: "10/01/2026",
    doctor: "Dr. Carlos Mendes",
    specialty: "Clinico Geral",
    notes: "Primeira consulta. Queixa de fadiga e cansaco excessivo. Historico familiar de diabetes.",
    prescription: "Vitamina D 2000UI - 1 capsula ao dia por 30 dias",
  },
  {
    type: "Exame",
    typeColor: "bg-orange-100 text-orange-700",
    date: "05/12/2025",
    doctor: "Dra. Ana Paula",
    specialty: "Cardiologia",
    notes: "Eletrocardiograma de rotina. Resultados normais, sem alteracoes significativas.",
    prescription: null,
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button class="p-1 text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size="20" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Prontuario</h1>
        <p class="text-sm text-gray-400">Historico medico do paciente</p>
      </div>
    </div>

    <div class="flex gap-6 items-start">
      <!-- LEFT COLUMN -->
      <div class="w-80 shrink-0 flex flex-col gap-4">

        <!-- Patient Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold text-base flex items-center justify-center shrink-0">
              {{ patient.initials }}
            </div>
            <div>
              <p class="font-bold text-gray-900 text-base leading-tight">{{ patient.name }}</p>
              <p class="text-sm text-gray-400">{{ patient.age }}</p>
            </div>
          </div>

          <hr class="border-gray-100 mb-4" />

          <ul class="flex flex-col gap-3 text-sm text-gray-600 mb-4">
            <li class="flex items-center gap-2.5">
              <Calendar size="14" class="text-gray-400 shrink-0" /> {{ patient.birth }}
            </li>
            <li class="flex items-center gap-2.5">
              <Phone size="14" class="text-gray-400 shrink-0" /> {{ patient.phone }}
            </li>
            <li class="flex items-center gap-2.5">
              <Mail size="14" class="text-gray-400 shrink-0" /> {{ patient.email }}
            </li>
            <li class="flex items-start gap-2.5">
              <MapPin size="14" class="text-gray-400 shrink-0 mt-0.5" /> {{ patient.address }}
            </li>
          </ul>

          <hr class="border-gray-100 mb-4" />

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Tipo Sanguineo</p>
              <p class="font-bold text-teal-600 text-base">{{ patient.blood }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">CPF</p>
              <p class="font-semibold text-gray-800 text-xs">{{ patient.cpf }}</p>
            </div>
          </div>
        </div>

        <!-- Allergies -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-3">
            <AlertTriangle size="15" class="text-orange-400" />
            <p class="font-semibold text-gray-800 text-sm">Alergias</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="a in patient.allergies"
              :key="a"
              class="text-xs bg-red-50 text-red-500 border border-red-100 rounded-full px-3 py-1"
            >{{ a }}</span>
          </div>
        </div>

        <!-- Medications -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-3">
            <Pill size="15" class="text-teal-500" />
            <p class="font-semibold text-gray-800 text-sm">Medicamentos em Uso</p>
          </div>
          <ul class="flex flex-col divide-y divide-gray-100">
            <li
              v-for="med in patient.medications"
              :key="med.name"
              class="py-3 first:pt-0 last:pb-0"
            >
              <p class="text-sm font-medium text-gray-800">{{ med.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ med.dosage }}</p>
            </li>
          </ul>
        </div>

        <!-- Vitals -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <Activity size="15" class="text-teal-500" />
            <p class="font-semibold text-gray-800 text-sm">Ultimos Sinais Vitais</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="v in patient.vitals"
              :key="v.label"
              class="bg-gray-50 rounded-lg p-3"
            >
              <p class="text-xs text-gray-400 mb-1">{{ v.label }}</p>
              <p class="font-bold text-gray-800 text-base">{{ v.value }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button
            @click="activeTab = 'historico'"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors',
              activeTab === 'historico' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50',
            ]"
          >
            <FileText size="14" /> Historico de Consultas
          </button>
          <button
            @click="activeTab = 'observacoes'"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors',
              activeTab === 'observacoes' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50',
            ]"
          >
            <ClipboardEdit size="14" /> Observacoes
          </button>
        </div>

        <!-- Historico Tab -->
        <div v-if="activeTab === 'historico'" class="p-5 flex flex-col gap-4">
          <div
            v-for="(c, i) in consultations"
            :key="i"
            class="border border-gray-200 rounded-xl p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <span :class="['text-xs font-medium px-2.5 py-0.5 rounded-full', c.typeColor]">
                {{ c.type }}
              </span>
              <span class="text-sm text-gray-400">{{ c.date }}</span>
            </div>
            <p class="font-semibold text-gray-900 text-sm">{{ c.doctor }}</p>
            <p class="text-xs text-gray-400 mb-3">{{ c.specialty }}</p>
            <p class="text-sm text-gray-600 mb-3">{{ c.notes }}</p>
            <div v-if="c.prescription">
              <hr class="border-gray-100 mb-3" />
              <p class="text-xs text-gray-400 mb-1.5">Prescricao:</p>
              <div class="bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                {{ c.prescription }}
              </div>
            </div>
          </div>
        </div>

        <!-- Observacoes Tab -->
        <div v-if="activeTab === 'observacoes'" class="p-5 flex flex-col gap-6">

          <!-- Nova Observacao -->
          <div>
            <p class="text-sm font-semibold text-gray-800 mb-3">Nova Observacao</p>
            <textarea
              v-model="newObs"
              placeholder="Adicione uma observacao ao prontuario..."
              rows="5"
              class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition resize-none text-gray-700 placeholder-gray-400"
            />
            <div class="flex justify-end mt-3">
              <button
                @click="addObservation"
                class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <Plus size="15" /> Adicionar Observacao
              </button>
            </div>
          </div>

          <hr class="border-gray-100" />

          <!-- Observacoes Anteriores -->
          <div>
            <p class="text-sm font-semibold text-gray-800 mb-3">Observacoes Anteriores</p>
            <div class="flex flex-col gap-3">
              <div
                v-for="(obs, i) in observations"
                :key="i"
                class="bg-gray-50 rounded-xl p-4"
              >
                <p class="text-xs text-gray-400 mb-1.5">{{ obs.date }} - {{ obs.doctor }}</p>
                <p class="text-sm text-gray-700">{{ obs.text }}</p>
              </div>
              <p v-if="observations.length === 0" class="text-sm text-gray-400">
                Nenhuma observacao registrada.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>