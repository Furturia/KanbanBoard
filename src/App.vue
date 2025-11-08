<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { useUserStore } from "./store/userStore";
import { onMounted } from "vue";
import { computed } from "vue";
import { ref } from "vue";
import { useBoardStore } from "./store/boardStore";

const userStore = useUserStore();
const boardStore = useBoardStore()
const user = computed(() => userStore.getUser());
console.log(user);

const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const logout = () => {
  console.log("Logout clicked");
  localStorage.removeItem("user");
  sessionStorage.removeItem("userTempt")
  userStore.clearUser();
  boardStore.clearBoard()
  dropdownOpen.value = false;
};
</script>

<template>
  <div class="bg-base-200 w-full min-h-screen h-full">
    <Navbar>
      <template v-if="user && user.username" #menu>
        <RouterLink :to="{ name: 'board' }" class="hover:text-blue-500 hover:underline">board</RouterLink>
      </template>
      <div
        v-if="user && user.username"
        class="relative"
        @click="toggleDropdown"
      >
        <div
          class="avatar bg-blue-600 text-white rounded-full p-1 flex justify-center items-center w-10 h-10 cursor-pointer"
        >
          {{ user?.username[0] + user?.username[user?.username.length - 1] }}
        </div>
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded border border-gray-200 z-10"
        >
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </Navbar>
    <RouterView />
  </div>
</template>

<style scoped></style>
