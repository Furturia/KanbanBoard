<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <div
    class="flex items-center bg-linear-to-b from-blue-100 to-yellow-50 py-16 px-6 md:px-10 h-full min-h-[calc(100vh-72px)]"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
    >
      <div class="flex flex-col gap-5 flex-1 max-w-xl text-center lg:text-left">
        <h1 class="text-4xl md:text-5xl font-bold text-blue-900">
          "งานเยอะ แต่ไม่รู้เริ่มตรงไหน?"
        </h1>
        <p class="text-lg text-gray-700 mb-3">
          Kanban Board ช่วยให้คุณเห็นภาพรวม ติดสินใจง่ายขึ้น<br />
          และลงมือได้ตรงจุด
        </p>
        <RouterLink :to="{name: 'board'}">

            <button 
              class="w-40 btn btn-primary btn-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mx-auto lg:mx-0"
            >
              เริ่มเลย →
            </button>
        </RouterLink>
      </div>

      <div
        class="flex-1 flex justify-center w-full transition-all duration-300 hover:scale-105"
      >
        <div
          class="card bg-base-100 shadow-2xl shadow-blue-200 w-full max-w-md transition-all duration-300 cursor-pointer hover:shadow-amber-100 p-6"
        >
          <div class="grid grid-cols-3 gap-4 mb-5">
            <div class="text-center font-semibold text-gray-700">To do</div>
            <div class="text-center font-semibold text-gray-700">Doing</div>
            <div class="text-center font-semibold text-gray-700">Done</div>
          </div>

          <div class="grid grid-cols-3 justify-center gap-4">
            <div class="flex flex-col gap-3 items-center">
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
            </div>

            <div class="flex flex-col gap-3 items-center">
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
            </div>

            <div class="flex flex-col gap-3 items-center">
              <div
                class="bg-blue-100 h-10 w-22 p-2 rounded-md flex flex-col gap-2"
              >
                <div class="bg-blue-200 px-4 py-1 rounded-xl"></div>
                <div class="bg-blue-200 w-3 px-4 py-1 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
