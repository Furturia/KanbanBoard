<script setup>
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";

const userStore = useUserStore();
const boardStore = useBoardStore();
onMounted(() => {
  if (localStorage.getItem("user")) {
    userStore.setUser(JSON.parse(localStorage.getItem("user")));
    return;
  }
  if (sessionStorage.getItem("userTempt")) {

    userStore.setUser(JSON.parse(sessionStorage.getItem("userTempt")));
  }
});

onMounted(async () => {
  try {
    if (userStore.getUser() && !boardStore.getBoard) {
      const response = await getBoardByuserEmail(user.value?.email);

      if (response?.error) {
        throw new Error(response.error);
      }
    }
  } catch (error) {
    alert(error);
  }
});
</script>

<template>
  <div
    class="flex justify-between px-8 py-4 items-center bg-white border-b border-base-300"
  >
    <RouterLink :to="{ name: 'home' }" class="text-blue-600 font-semibold"
      >KANBAN</RouterLink
    >
    <div class="flex gap-6 items-center justify-center">
      <slot name="menu"></slot>
      <RouterLink v-if="userStore.getUser()" :to="{name:'notiView'}">
        <svg class="text-black/80"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93c-22-26.61-35.31-42.67-35.31-118c0-39-9.33-71-27.72-95c-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 0 1-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.1 3.1 0 0 1-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14c0 75.36-13.29 91.42-35.31 118c-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 0 0-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 0 0-4.61-37.66M256 480a80.06 80.06 0 0 0 70.44-42.13a4 4 0 0 0-3.54-5.87H189.12a4 4 0 0 0-3.55 5.87A80.06 80.06 0 0 0 256 480"
          />
        </svg>

      </RouterLink>
      <slot>
        <RouterLink :to="{ name: 'login' }">
          <button class="btn btn-primary">Login</button>
        </RouterLink>
      </slot>
    </div>
  </div>
</template>

<style></style>
