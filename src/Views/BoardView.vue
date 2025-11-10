<script setup>
import { getBoardByuserEmail } from "@/services/boardService";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const boardStore = useBoardStore();
const boards = computed(() => boardStore.getBoard());
const user = computed(() => userStore.getUser());


onMounted(async () => {
  try {
    

    if (!boardStore.getBoard()) {
      const response = await getBoardByuserEmail(user.value?.email);

      if (response?.error) {
        throw new Error(response.error);
      }
    }
  } catch (error) {
    alert(error)
  }
});
</script>

<template>
  <div class="w-full h-full min-h-screen p-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-md md:text-xl lg:text-2xl font-semibold">Kanban Board</h1>
      <RouterLink :to="{ name: 'createBoard' }">
        <button class="btn btn-primary text-md md:text-xl font-medium">
          + สร้าง
        </button>
      </RouterLink>
    </div>
    <div v-if="boards?.length" class="flex flex-wrap gap-4">
      <RouterLink
        :to="{ name: 'boardDetail', params: { id: board.id } }"
        v-if="boards"
        v-for="board in boards"
        :key="board.id"
        class="card bg-base-100 shadow-lg hover:shadow-blue-200 min-w-60 flex-1 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      >
        <div class="card-body">
          <div class="flex flex-col gap-2">
            <div class="w-6 rounded-2xl border-t-2 text-blue-600"></div>
            <h2 class="card-title text-xl">
              {{ board.name }}
            </h2>
          </div>

          <div class="flex gap-4 mt-4 text-sm">
            <div class="flex justify-center items-center gap-1">
              <span class="text-blue-300"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m9 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6M4.25 14A2.25 2.25 0 0 0 2 16.25v.25S2 21 8 21s6-4.5 6-4.5v-.25A2.25 2.25 0 0 0 11.75 14zM17 19.5c-1.171 0-2.068-.181-2.755-.458a5.5 5.5 0 0 0 .736-2.207A4 4 0 0 0 15 16.55v-.3a3.24 3.24 0 0 0-.902-2.248L14.2 14h5.6a2.2 2.2 0 0 1 2.2 2.2s0 3.3-5 3.3"
                  /></svg
              ></span>
              <span class="text-gray-600"
                >{{ board.members?.length || 0 }} คน</span
              >
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
    <div
      v-else
      class="w-full mt-12 h-full p-12 flex justify-center items-center rounded-lg bg-blue-50 border-1 border-blue-300"
    >
      <p class="text-blue-500 font-extralight">ไม่มีรายการ</p>
    </div>
  </div>
</template>

<style></style>
