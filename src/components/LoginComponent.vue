<script setup></script>

<template>
  <div class="flex min-h-screen">
    <!-- ESQUERDA -->
    <div
      class="w-1/2 bg-cyan-700 text-white flex flex-col justify-center items-center px-10"
    >
      <h1 class="text-3xl font-bold mb-2">MedClinic</h1>
      <p class="text-sm mb-8">Gestão Hospitalar</p>

      <h2 class="text-xl font-semibold text-center mb-4">
        Sistema completo para gestão da sua clínica
      </h2>

      <p class="text-center text-white/80 max-w-md">
        Gerencie pacientes, consultas, prontuários e finanças em uma única
        plataforma moderna e intuitiva.
      </p>
    </div>

    <!-- DIREITA -->
    <div class="w-1/2 flex items-center justify-center bg-gray-50">
      <div class="w-full max-w-sm">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Bem-vindo de volta
        </h2>

        <p class="text-gray-500 mb-6">
          Entre com suas credenciais para acessar o sistema
        </p>

        <form class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <a href="#" class="text-cyan-700"> Esqueci minha senha </a>
          </div>

          <button
            type="submit"
            class="w-full bg-cyan-700 text-white py-2 rounded-md hover:bg-cyan-800 transition"
          >
            Entrar
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?
          <a href="#" class="text-cyan-700"> Entre em contato </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
