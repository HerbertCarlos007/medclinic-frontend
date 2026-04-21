<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import userService from "../services/user";
import {
  Search,
  Plus,
  MoreHorizontal,
  Shield,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  X,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-vue-next";

const clinicId = localStorage.getItem("clinicId");

const users = ref([]);

const search = ref("");
const filterRole = ref("todos");
const showModal = ref(false);
const showEditModal = ref(false);
const showPassword = ref(false);
const showEditPassword = ref(false);

const userForm = reactive({
  clinic_id: clinicId,
  name: "",
  email: "",
  role: "",
  password: "",
  is_active: "",
});

const editForm = reactive({
  id: null,
  name: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  is_active: "",
});

onMounted(() => {
  getUsers();
});

const roleStyle = (role) => {
  if (role === "Administrador")
    return {
      badge: "bg-purple-50 text-purple-700 border border-purple-200",
      icon: "text-purple-400",
    };
  if (role === "Recepcionista")
    return {
      badge: "bg-teal-50 text-teal-700 border border-teal-200",
      icon: "text-teal-400",
    };
  if (role === "Financeiro")
    return {
      badge: "bg-blue-50 text-blue-700 border border-blue-200",
      icon: "text-blue-400",
    };
  return { badge: "bg-gray-100 text-gray-500", icon: "text-gray-400" };
};

const avatarColor = (role) => {
  if (role === "Administrador") return "bg-purple-100 text-purple-700";
  if (role === "Recepcionista") return "bg-teal-100 text-teal-700";
  if (role === "Financeiro") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
};

const statusStyle = (s) =>
  s === "Ativo"
    ? "bg-green-50 text-green-600 border border-green-200"
    : "bg-gray-100 text-gray-500 border border-gray-200";

const roles = ["todos", "Administrador", "Recepcionista", "Financeiro"];

const filtered = computed(() =>
  users.value.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase()) ||
      u.role.toLowerCase().includes(search.value.toLowerCase());
    const matchRole =
      filterRole.value === "todos" || u.role === filterRole.value;
    return matchSearch && matchRole;
  }),
);

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter((u) => u.role === "Administrador").length,
  recepcionistas: users.value.filter((u) => u.role === "Recepcionista").length,
  ativos: users.value.filter((u) => u.is_active === "Ativo").length,
}));

function openModal() {
  showModal.value = true;
}

function openEditModal(user) {
  editForm.id = user.id;
  editForm.name = user.name;
  editForm.email = user.email;
  editForm.phone = user.phone || "";
  editForm.role = user.role;
  editForm.password = "";
  editForm.is_active = user.is_active;
  showEditPassword.value = false;
  showEditModal.value = true;
}

const getUsers = async () => {
  try {
    const response = await userService.getUsers(clinicId);
    users.value = response.data;
  } catch (error) {
    console.log("Error fetching users:", error);
  }
};

const createUser = async () => {
  try {
    await userService.createUser(userForm);
    showModal.value = false;
    getUsers();
  } catch (error) {
    console.log("Error creating user:", error);
  }
};

const updateUser = async () => {
  try {
    const payload = { ...editForm };

    if (!payload.password) {
      delete payload.password;
    }

    await userService.updateUser(editForm.id, payload);

    showEditModal.value = false;
    getUsers();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const updateIsActive = async (user) => {
  try {
    const newStatus = user.is_active === "Ativo" ? "Inativo" : "Ativo";
    await userService.updateIsActive(user.id, {
      is_active: newStatus,
    });
    getUsers();
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Gerencie os funcionarios e acessos do sistema
        </p>
      </div>
      <button
        @click="openModal"
        class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus size="16" /> Novo Usuario
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Total de Usuarios</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Administradores</p>
        <p class="text-2xl font-bold text-purple-600">{{ stats.admins }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Recepcionistas</p>
        <p class="text-2xl font-bold text-teal-600">
          {{ stats.recepcionistas }}
        </p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-400 mb-1">Usuarios Ativos</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.ativos }}</p>
      </div>
    </div>

    <!-- Search + Filters -->
    <div
      class="bg-white rounded-xl border border-gray-200 px-4 py-4 mb-4 flex items-center gap-4"
    >
      <div class="relative w-72">
        <Search
          size="15"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nome, email ou cargo..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-gray-700 placeholder-gray-400 transition"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="r in roles"
          :key="r"
          @click="filterRole = r"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
            filterRole === r
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          ]"
        >
          {{ r === "todos" ? "Todos" : r }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="text-left text-gray-500 font-medium px-6 py-3">
              Usuario
            </th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">
              Contato
            </th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">Cargo</th>
            <th class="text-left text-gray-500 font-medium px-6 py-3">
              Status
            </th>
            <th class="text-right text-gray-500 font-medium px-6 py-3">
              Acoes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filtered"
            :key="user.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <!-- Usuario -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0',
                    avatarColor(user.role),
                  ]"
                >
                  {{ user.initials }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ user.name }}</p>
                  <p class="text-xs text-gray-400">{{ user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Contato -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1 text-gray-600">
                <span class="flex items-center gap-1.5 text-xs">
                  <Phone size="12" class="text-gray-400" /> {{ user.phone }}
                </span>
                <span class="flex items-center gap-1.5 text-xs">
                  <Mail size="12" class="text-gray-400" /> {{ user.email }}
                </span>
              </div>
            </td>

            <!-- Cargo -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5">
                <Shield size="13" :class="roleStyle(user.role).icon" />
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    roleStyle(user.role).badge,
                  ]"
                >
                  {{ user.role }}
                </span>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  statusStyle(user.is_active),
                ]"
              >
                {{ user.is_active }}
              </span>
            </td>

            <!-- Acoes -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="updateIsActive(user)"
                  :title="user.is_active === 'Ativo' ? 'Desativar' : 'Ativar'"
                  class="p-1.5 text-gray-400 hover:text-teal-600 rounded hover:bg-teal-50 transition-colors"
                >
                  <UserCheck size="15" />
                </button>

                <button
                  @click="openEditModal(user)"
                  title="Editar usuario"
                  class="p-1.5 text-gray-400 hover:text-teal-600 rounded hover:bg-teal-50 transition-colors"
                >
                  <Pencil size="15" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td
              colspan="6"
              class="px-6 py-14 text-center text-gray-400 text-sm"
            >
              Nenhum usuario encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Usuario -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Novo Usuario</h2>
              <p class="text-xs text-gray-400">
                Preencha os dados do funcionario
              </p>
            </div>
            <button
              @click="showModal = false"
              class="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size="18" />
            </button>
          </div>

          <!-- Form -->
          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Nome completo</label
              >
              <input
                v-model="userForm.name"
                type="text"
                placeholder="Ex: Ana Paula Silva"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Email</label
              >
              <input
                v-model="userForm.email"
                type="email"
                placeholder="usuario@medclinic.com"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Telefone</label
              >
              <input
                type="text"
                placeholder="(11) 99999-0000"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Senha provisoria</label
              >
              <div class="relative">
                <input
                  v-model="userForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition pr-10"
                />
                <button
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showPassword" size="15" />
                  <EyeOff v-else size="15" />
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Cargo</label
                >
                <select
                  v-model="userForm.role"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Recepcionista">Recepcionista</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Status</label
                >
                <select
                  v-model="userForm.is_active"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white"
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex gap-3 mt-6">
            <button
              @click="showModal = false"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="createUser"
              class="flex-1 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              Cadastrar Usuario
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Editar Usuario -->
    <Teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="showEditModal = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Editar Usuario</h2>
              <p class="text-xs text-gray-400">
                Atualize os dados do funcionario
              </p>
            </div>
            <button
              @click="showEditModal = false"
              class="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size="18" />
            </button>
          </div>

          <!-- Form -->
          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Nome completo</label
              >
              <input
                v-model="editForm.name"
                type="text"
                placeholder="Ex: Ana Paula Silva"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Email</label
              >
              <input
                v-model="editForm.email"
                type="email"
                placeholder="usuario@medclinic.com"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Telefone</label
              >
              <input
                v-model="editForm.phone"
                type="text"
                placeholder="(11) 99999-0000"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Nova senha
                <span class="text-gray-400 font-normal"
                  >(deixe em branco para manter)</span
                >
              </label>
              <div class="relative">
                <input
                  v-model="editForm.password"
                  :type="showEditPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition pr-10"
                />
                <button
                  @click="showEditPassword = !showEditPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showEditPassword" size="15" />
                  <EyeOff v-else size="15" />
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Cargo</label
                >
                <select
                  v-model="editForm.role"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Status</label
                >
                <select
                  v-model="editForm.is_active"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white"
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex gap-3 mt-6">
            <button
              @click="showEditModal = false"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="updateUser"
              class="flex-1 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              Salvar Alteracoes
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
