<script setup>
import { useUserStore } from '@/store/userStore';
import { onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {login} from '../services/userService'


const formData= ref({
    email : "",
    password: "",
    rememberMe : false
})

const router = useRouter()
const userStore=useUserStore()


const handleLogin = async () => {
  try {
    const response = await login(
      formData.value.email,
      formData.value.password
    );
    console.log(response);
    

    if (response?.error) {
      throw new Error(response.error);
    }

    const { id, username, email} = response;

    userStore.setUser({ id, username, email });
    console.log(userStore.getUser());
    

    if (formData.value.rememberMe) {
      localStorage.setItem(
        "user",
        JSON.stringify({ id, username, email })
      );
    }

    router.push({ name: "home" });
  } catch (error) {
    
   console.log(error);
   
  }
};
</script>
<template>
  <div
    class="min-h-[calc(100vh-72px)] h-full bg-linear-to-br from-blue-200 via-indigo-200 to-purple-200 flex items-center justify-center p-6"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <div class="flex justify-center mb-4">
          <div class="avatar">
            <div
              class="flex justify-center items-center bg-blue-600 text-primary-content rounded-full w-20"
            >
              <span class="text-white">KANBAN</span>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-center justify-center mb-2">
          ยินดีต้อนรับ
        </h2>
        <p class="text-center text-gray-600 mb-6">
          เข้าสู่ระบบเพื่อใช้งาน Kanban Board
        </p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="label">
              <span class=" font-semibold">อีเมล</span>
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="your@email.com"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="label">
              <span class=" font-semibold">รหัสผ่าน</span>
            </label>
            <input
              type="password"
              v-model="formData.password"
              placeholder="Your Password"
              class="input input-bordered w-full"
              required
            />
           
          </div>

          <div>
            <label class="flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                v-model="formData.rememberMe"
                class="checkbox checkbox-primary"
              />
              จดจำการเข้าสู่ระบบ
            </label>
          </div>

          <div class="mt-6">
            <button type="submit" class="btn btn-primary btn-block">
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        
        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            ยังไม่มีบัญชี?
            <RouterLink :to="{name: 'register'}" class="link link-primary font-semibold">สมัครสมาชิก</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
