<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { register } from '../services/userService';

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  try {
    if (formData.value.password !== formData.value.confirmPassword) {
      throw new Error('รหัสผ่านไม่ตรงกัน');
    }

    const response = await register(
      formData.value.username,
      formData.value.email,
      formData.value.password
    );
    console.log(response);

    if (response?.error) {
      throw new Error(response.error);
    }

    // const { id, username, email } = response;

    // userStore.setUser({ id, username, email });
    // console.log(userStore.getUser());

    router.push({ name: 'home' });
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
          สมัครสมาชิก
        </h2>
        <p class="text-center text-gray-600 mb-6">
          สร้างบัญชีใหม่เพื่อเริ่มใช้งาน Kanban Board
        </p>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          
          <div class="flex flex-col gap-2">
            <label class="label">
              <span class="font-semibold">ชื่อผู้ใช้</span>
            </label>
            <input
              type="text"
              v-model="formData.username"
              placeholder="username"
              class="input input-bordered w-full"
              required
            />
          </div>

       
          <div class="flex flex-col gap-2">
            <label class="label">
              <span class="font-semibold">อีเมล</span>
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
              <span class="font-semibold">รหัสผ่าน</span>
            </label>
            <input
              type="password"
              v-model="formData.password"
              placeholder="รหัสผ่านของคุณ"
              class="input input-bordered w-full"
              required
              minlength="6"
            />
          </div>

 
          <div class="flex flex-col gap-2">
            <label class="label">
              <span class="font-semibold">ยืนยันรหัสผ่าน</span>
            </label>
            <input
              type="password"
              v-model="formData.confirmPassword"
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
              class="input input-bordered w-full"
              required
              minlength="6"
            />
          </div>

          

         
          <div class="mt-6">
            <button type="submit" class="btn btn-primary btn-block">
              สมัครสมาชิก
            </button>
          </div>
        </form>

        
        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?
            <RouterLink :to="{ name: 'login' }" class="link link-primary font-semibold">
              เข้าสู่ระบบ
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>