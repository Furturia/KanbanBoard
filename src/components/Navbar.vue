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
    console.log("hi");
    
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
    console.log(error);
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
      <slot>
        <RouterLink :to="{ name: 'login' }">
          <button class="btn btn-primary">Login</button>
        </RouterLink>
      </slot>
    </div>
  </div>
</template>

<style></style>
