<script setup>
import { useUserStore } from "@/store/userStore";
import { computed } from "vue";

const userStore = useUserStore();
const user = computed(() => userStore.getUser());
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">การแจ้งเตือน</h1>
      </div>

      <div class="space-y-4">
        <RouterLink
          v-if="user.noti"
          v-for="noti in user.noti"
          :to="{ name: 'board' }"
        >
          <div
            class="relative rounded-xl shadow-sm border-2 border-blue-200 bg-blue-50 transition-all duration-300 hover:shadow-md"
          >
            <div class="p-5">
              <div class="flex flex-col sm:flex-row justify-center md:items-start gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-col  items-start justify-between gap-2 mb-1">
                    <h3 class="text-lg font-semibold text-slate-800">{{ noti?.title }}</h3>
                    
                    <p class="text-xs md:text-md text-slate-600 mb-2">{{ noti?.message }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RouterLink>
        <div
          v-else
          class="w-full mt-12 h-full p-12 flex justify-center items-center rounded-lg bg-blue-50 border-1 border-blue-300"
        >
          <p class="text-blue-500 font-extralight">ไม่มีรายการ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
