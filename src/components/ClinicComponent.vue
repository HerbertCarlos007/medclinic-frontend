<script setup>
import { ref, computed } from "vue";
import {
  Building2, Plus, Search, MapPin, Phone, Mail,
  Globe, Users, MoreHorizontal, CheckCircle, XCircle,
  X, ChevronRight, Stethoscope, Clock,
} from "lucide-vue-next";

// --- List state ---
const search = ref("");
const showModal = ref(false);
const step = ref(1);

const clinics = ref([
  {
    id: 1, name: "MedClinic Centro", initials: "MC", type: "Clinica Geral",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP", cep: "01310-100",
    phone: "(11) 3333-1111", email: "centro@medclinic.com", website: "www.medclinic.com",
    doctors: 8, capacity: 40, status: "Ativa", since: "Jan 2022",
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: 2, name: "MedClinic Pinheiros", initials: "MP", type: "Cardiologia",
    address: "Rua dos Pinheiros, 500 - Pinheiros, São Paulo - SP", cep: "05422-000",
    phone: "(11) 3333-2222", email: "pinheiros@medclinic.com", website: "www.medclinic.com",
    doctors: 5, capacity: 25, status: "Ativa", since: "Mar 2023",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3, name: "MedClinic Moema", initials: "MM", type: "Pediatria",
    address: "Av. Ibirapuera, 2100 - Moema, São Paulo - SP", cep: "04029-901",
    phone: "(11) 3333-3333", email: "moema@medclinic.com", website: "www.medclinic.com",
    doctors: 4, capacity: 20, status: "Inativa", since: "Jun 2023",
    color: "bg-purple-100 text-purple-700",
  },
]);

const filtered = computed(() =>
  clinics.value.filter(
    (c) =>
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.type.toLowerCase().includes(search.value.toLowerCase()) ||
      c.address.toLowerCase().includes(search.value.toLowerCase())
  )
);

// --- Form ---
const form = ref({
  name: "", type: "Clinica Geral", cnpj: "", email: "",
  phone: "", website: "", cep: "", address: "", number: "",
  complement: "", neighborhood: "", city: "", state: "SP",
  capacity: "", openTime: "08:00", closeTime: "18:00",
  workDays: ["Seg","Ter","Qua","Qui","Sex"],
  status: "Ativa",
});

const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];

function toggleDay(d) {
  const idx = form.value.workDays.indexOf(d);
  if (idx >= 0) form.value.workDays.splice(idx, 1);
  else form.value.workDays.push(d);
}

function openModal() {
  step.value = 1;
  form.value = {
    name: "", type: "Clinica Geral", cnpj: "", email: "",
    phone: "", website: "", cep: "", address: "", number: "",
    complement: "", neighborhood: "", city: "São Paulo", state: "SP",
    capacity: "", openTime: "08:00", closeTime: "18:00",
    workDays: ["Seg","Ter","Qua","Qui","Sex"],
    status: "Ativa",
  };
  showModal.value = true;
}

function nextStep() { if (step.value < 3) step.value++; }
function prevStep() { if (step.value > 1) step.value--; }

function saveClinic() {
  if (!form.value.name) return;
  const initials = form.value.name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  const colors = ["bg-teal-100 text-teal-700","bg-blue-100 text-blue-700","bg-purple-100 text-purple-700","bg-orange-100 text-orange-700"];
  clinics.value.unshift({
    id: Date.now(), name: form.value.name, initials,
    type: form.value.type,
    address: `${form.value.address}, ${form.value.number} - ${form.value.neighborhood}, ${form.value.city} - ${form.value.state}`,
    cep: form.value.cep, phone: form.value.phone, email: form.value.email,
    website: form.value.website, doctors: 0, capacity: form.value.capacity || 0,
    status: form.value.status,
    since: new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
    color: colors[clinics.value.length % colors.length],
  });
  showModal.value = false;
}

const stepLabels = ["Informacoes Basicas", "Endereco", "Configuracoes"];
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clinicas</h1>
        <p class="text-sm text-gray-400 mt-0.5">Gerencie as unidades do sistema</p>
      </div>
      <button
        @click="openModal"
        class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus size="16" /> Nova Clinica
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Total de Clinicas</p>
        <p class="text-2xl font-bold text-gray-900">{{ clinics.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Clinicas Ativas</p>
        <p class="text-2xl font-bold text-teal-600">{{ clinics.filter(c => c.status === 'Ativa').length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Total de Medicos</p>
        <p class="text-2xl font-bold text-blue-600">{{ clinics.reduce((a, c) => a + c.doctors, 0) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Capacidade Total</p>
        <p class="text-2xl font-bold text-purple-600">{{ clinics.reduce((a, c) => a + Number(c.capacity), 0) }}</p>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-gray-200 px-4 py-4 mb-5">
      <div class="relative w-80">
        <Search size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nome, tipo ou endereco..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-gray-700 placeholder-gray-400 transition"
        />
      </div>
    </div>

    <!-- Clinic Cards -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="clinic in filtered"
        :key="clinic.id"
        class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow"
      >
        <!-- Top -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center shrink-0', clinic.color]">
              {{ clinic.initials }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ clinic.name }}</p>
              <p class="text-xs text-gray-400">{{ clinic.type }}</p>
            </div>
          </div>
          <button class="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors">
            <MoreHorizontal size="16" />
          </button>
        </div>

        <!-- Info -->
        <ul class="flex flex-col gap-2 text-xs text-gray-500">
          <li class="flex items-start gap-2">
            <MapPin size="13" class="text-gray-400 shrink-0 mt-0.5" />
            <span>{{ clinic.address }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Phone size="13" class="text-gray-400 shrink-0" /> {{ clinic.phone }}
          </li>
          <li class="flex items-center gap-2">
            <Mail size="13" class="text-gray-400 shrink-0" /> {{ clinic.email }}
          </li>
          <li class="flex items-center gap-2">
            <Globe size="13" class="text-gray-400 shrink-0" /> {{ clinic.website }}
          </li>
        </ul>

        <hr class="border-gray-100" />

        <!-- Stats row -->
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span class="flex items-center gap-1.5">
            <Stethoscope size="12" class="text-gray-400" /> {{ clinic.doctors }} medicos
          </span>
          <span class="flex items-center gap-1.5">
            <Users size="12" class="text-gray-400" /> {{ clinic.capacity }} vagas/dia
          </span>
          <span class="flex items-center gap-1.5">
            <Clock size="12" class="text-gray-400" /> desde {{ clinic.since }}
          </span>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between">
          <span :class="[
            'text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1',
            clinic.status === 'Ativa'
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          ]">
            <CheckCircle v-if="clinic.status === 'Ativa'" size="11" />
            <XCircle v-else size="11" />
            {{ clinic.status }}
          </span>
          <button class="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
            Ver detalhes <ChevronRight size="13" />
          </button>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="col-span-3 text-center py-16 text-gray-400 text-sm">
        Nenhuma clinica encontrada.
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Nova Clinica</h2>
              <p class="text-xs text-gray-400 mt-0.5">Passo {{ step }} de 3 — {{ stepLabels[step - 1] }}</p>
            </div>
            <button @click="showModal = false" class="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <X size="18" />
            </button>
          </div>

          <!-- Step indicator -->
          <div class="flex px-6 pt-4 gap-2">
            <div
              v-for="s in 3"
              :key="s"
              :class="['h-1.5 flex-1 rounded-full transition-colors', s <= step ? 'bg-teal-500' : 'bg-gray-100']"
            />
          </div>

          <!-- Step 1: Informacoes Basicas -->
          <div v-if="step === 1" class="px-6 py-5 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Nome da Clinica *</label>
                <input v-model="form.name" type="text" placeholder="Ex: MedClinic Centro"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tipo / Especialidade</label>
                <select v-model="form.type" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white">
                  <option>Clinica Geral</option>
                  <option>Cardiologia</option>
                  <option>Pediatria</option>
                  <option>Ortopedia</option>
                  <option>Dermatologia</option>
                  <option>Neurologia</option>
                  <option>Oftalmologia</option>
                  <option>Psiquiatria</option>
                  <option>Oncologia</option>
                  <option>Multidisciplinar</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">CNPJ</label>
                <input v-model="form.cnpj" type="text" placeholder="00.000.000/0000-00"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Telefone</label>
                <input v-model="form.phone" type="text" placeholder="(11) 3333-0000"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input v-model="form.email" type="email" placeholder="contato@clinica.com"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Website</label>
                <input v-model="form.website" type="text" placeholder="www.suaclinica.com.br"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
            </div>
          </div>

          <!-- Step 2: Endereco -->
          <div v-if="step === 2" class="px-6 py-5 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">CEP</label>
                <input v-model="form.cep" type="text" placeholder="00000-000"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Logradouro *</label>
                <input v-model="form.address" type="text" placeholder="Av. Paulista"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Numero</label>
                <input v-model="form.number" type="text" placeholder="1000"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Complemento</label>
                <input v-model="form.complement" type="text" placeholder="Sala 42, Andar 3..."
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Bairro</label>
                <input v-model="form.neighborhood" type="text" placeholder="Bela Vista"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
                <input v-model="form.city" type="text" placeholder="São Paulo"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                <select v-model="form.state" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white">
                  <option>SP</option><option>RJ</option><option>MG</option><option>RS</option>
                  <option>PR</option><option>SC</option><option>BA</option><option>CE</option>
                  <option>GO</option><option>DF</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Configuracoes -->
          <div v-if="step === 3" class="px-6 py-5 flex flex-col gap-5">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Dias de Funcionamento</label>
              <div class="flex gap-2">
                <button
                  v-for="d in weekDays"
                  :key="d"
                  @click="toggleDay(d)"
                  :class="[
                    'w-10 h-10 rounded-full text-xs font-medium transition-colors',
                    form.workDays.includes(d)
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                  ]"
                >{{ d }}</button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Horario de Abertura</label>
                <input v-model="form.openTime" type="time"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Horario de Fechamento</label>
                <input v-model="form.closeTime" type="time"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Capacidade Diaria</label>
                <input v-model="form.capacity" type="number" placeholder="Ex: 40"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select v-model="form.status" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white">
                  <option>Ativa</option>
                  <option>Inativa</option>
                  <option>Em implantacao</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex gap-3 px-6 pb-6 pt-2">
            <button
              v-if="step > 1"
              @click="prevStep"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >Voltar</button>
            <button
              v-else
              @click="showModal = false"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >Cancelar</button>
            <button
              v-if="step < 3"
              @click="nextStep"
              class="flex-1 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >Continuar</button>
            <button
              v-else
              @click="saveClinic"
              class="flex-1 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >Cadastrar Clinica</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
  
</template>

<style scoped></style>