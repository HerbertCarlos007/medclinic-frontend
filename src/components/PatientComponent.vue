<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { Search, Phone, Mail, Eye, MoreHorizontal, Plus, X, User, CreditCard, Calendar } from "lucide-vue-next";
import patientService from '../services/patient'

const clinicId = localStorage.getItem("clinicId");

const search = ref("")
const patients = ref([])

// --- Modal ---
const showModal = ref(false);

const formPatient = reactive({
  name: "",
  email: "",
  cpf: "",
  birth_date: "",
  gender: "",
  phone: "",
  address: "",
  clinic_id: clinicId,
});

onMounted(() => {
  getPatients();
})

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;

  formPatient.name = "";
  formPatient.email = "";
  formPatient.cpf = "";
  formPatient.birth_date = "";
  formPatient.gender = "";
  formPatient.phone = "";
  formPatient.address = "";
  formPatient.clinic_id = clinicId;
}


const createPatient = async () => {
  try {
    await patientService.createPatient(formPatient);
    showModal.value = false;
    getPatients();
  } catch (error) {
    console.log("Error creating patient:", error);
  }
}

const getPatients = async () => {
  try {
    const response = await patientService.getPatients(clinicId);
    patients.value = response.data;
  } catch (error) {
    console.log("Error fetching patients:", error);
  }
}

// CPF mask
function onCpfInput(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  formPatient.cpf = v;
}

// Phone mask
function onPhoneInput(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/, "($1) $2");
  v = v.replace(/(\d{5})(\d)/, "$1-$2");
  formPatient.phone = v;
}

// const patients = ref([
//   { id: 1, name: "Maria Silva Santos", initials: "MS", birth_date: "15/03/1985", cpf: "123.456.789-00", phone: "(11) 99999-1234", email: "maria.silva@email.com", lastVisit: "28/03/2026" },
//   { id: 2, name: "Joao Pedro Costa", initials: "JP", birth_date: "22/07/1978", cpf: "234.567.890-11", phone: "(11) 98888-2345", email: "joao.costa@email.com", lastVisit: "25/03/2026" },
//   { id: 3, name: "Ana Paula Oliveira", initials: "AP", birth: "10/12/1990", cpf: "345.678.901-22", phone: "(11) 97777-3456", email: "ana.oliveira@email.com", lastVisit: "20/03/2026" },
//   { id: 4, name: "Carlos Eduardo Ferreira", initials: "CE", birth: "05/09/1982", cpf: "456.789.012-33", phone: "(11) 96666-4567", email: "carlos.ferreira@email.com", lastVisit: "18/03/2026" },
//   { id: 5, name: "Patricia Lima Souza", initials: "PL", birth: "30/01/1995", cpf: "567.890.123-44", phone: "(11) 95555-5678", email: "patricia.souza@email.com", lastVisit: "15/03/2026" },
//   { id: 6, name: "Roberto Almeida Junior", initials: "RA", birth: "18/06/1970", cpf: "678.901.234-55", phone: "(11) 94444-6789", email: "roberto.junior@email.com", lastVisit: "10/03/2026" },
//   { id: 7, name: "Fernanda Rodrigues", initials: "FR", birth: "25/04/1988", cpf: "789.012.345-66", phone: "(11) 93333-7890", email: "fernanda.rodrigues@email.com", lastVisit: "05/03/2026" },
// ]);

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
        @click="openModal"
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
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ patient.initials }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ patient.name }}</p>
                  <p class="text-xs text-gray-400">Nascimento: {{ patient.birth_date }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ patient.cpf }}</td>
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
            <td class="px-6 py-4 text-gray-600">{{ patient.lastVisit }}</td>
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
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm">
              Nenhum paciente encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL Novo Paciente -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeModal" />

          <!-- Modal box -->
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 class="text-base font-bold text-gray-900">Novo Paciente</h2>
              <button
                @click="closeModal"
                class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size="18" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

              <!-- Nome completo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nome completo <span class="text-red-400">*</span></label>
                <div class="relative">
                  <User size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="formPatient.name"
                    type="text"
                    placeholder="Nome completo do paciente"
                    class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <!-- CPF + Data de Nascimento -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                  <div class="relative">
                    <CreditCard size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      :value="formPatient.cpf"
                      @input="onCpfInput"
                      type="text"
                      placeholder="000.000.000-00"
                      class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Data de Nascimento</label>
                  <div class="relative">
                    <Calendar size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="formPatient.birth_date"
                      type="date"
                      class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Sexo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Sexo</label>
                <div class="flex gap-2">
                  <button
                    v-for="opt in ['Masculino', 'Feminino', 'Outro']"
                    :key="opt"
                    @click="formPatient.gender = opt"
                    :class="[
                      'flex-1 py-2 text-sm rounded-lg border transition-colors font-medium',
                      formPatient.gender === opt
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50',
                    ]"
                  >
                    {{ opt }}
                  </button>
                </div>
              </div>

              <!-- Telefone + Email -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                  <div class="relative">
                    <Phone size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      :value="formPatient.phone"
                      @input="onPhoneInput"
                      type="text"
                      placeholder="(00) 00000-0000"
                      class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                  <div class="relative">
                    <Mail size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="formPatient.email"
                      type="email"
                      placeholder="email@exemplo.com"
                      class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Endereço -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                <input
                  v-model="formPatient.address"
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                @click="closeModal"
                class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="createPatient"
                :disabled="!formPatient"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors',
                  formPatient.name ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-300 cursor-not-allowed',
                ]"
              >
                Cadastrar Paciente
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
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>