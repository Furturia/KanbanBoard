<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { useBoardStore } from "@/store/boardStore";
import { createBoard, getBoardByuserEmail } from "@/services/boardService";
import { getUserByEmail, updateUser } from "@/services/userService";

const router = useRouter();
const userStore = useUserStore();
const boardStore = useBoardStore();
onMounted(async () => {
  try {
    

    if (!boardStore.getBoard()) {
      const response = await getBoardByuserEmail(user.value?.email);

      if (response?.error) {
        throw new Error(response.error);
      }
    }
  } catch (error) {
    alert(error);
  }
});
const user = computed(() => userStore.getUser());

const formData = ref({
  name: "",
  members: [],
});

const memberEmail = ref("");
const showMemberInput = ref(false);

const addMember = () => {
  if (memberEmail.value && memberEmail.value.includes("@")) {
    if (!formData.value.members.includes(memberEmail.value)) {
      formData.value.members.push(memberEmail.value);
      memberEmail.value = "";
      showMemberInput.value = false;
    }
  } else{
    alert("รูปแบบอีเมลไม่ถูกต้อง หรือมีอีเมลอยู่แล้ว")

  }
};

const removeMember = (index) => {
  formData.value.members.splice(index, 1);
};

const addNoti = async (board, email) => {
  try {
    const response = await getUserByEmail(email);

    if (response?.error) {
      return;
    }
    response.noti
      ? response.noti.push({
          title: "คุณถูกเพิ่มในบอร์ดใหม่",
          boardId: board.id,
          message: `คุณถูกเชิญให้เข้าร่วม ${board.name} โดย ${user.value?.email}`,
        })
      : response.noti = [
          {
            title: "คุณถูกเพิ่มในบอร์ดใหม่",
            boardId: board.id,
            message: `คุณถูกเชิญให้เข้าร่วม ${board.name} โดย ${user.value?.email}`,
          },
        ];

    const updateRes = await updateUser(response.id, { ...response });

    if (updateRes?.error) {
      throw new Error(updateRes?.error);
    }
  } catch (error) {
    alert(error)
  }
};

const handleCreateBoard = async () => {
  try {
    if (!formData.value.name.trim()) {
      throw new Error("กรุณาใส่ชื่อบอร์ด");
    }

    const boardData = {
      name: formData.value.name,
      members: [...formData.value.members, user.value.email],
    };

    const response = await createBoard(boardData);

    if (response?.error) {
      throw new Error(response.error);
    }

    if (response.members) {
      response.members.forEach(async (member) => {
        if (member !== user.value.email) {
          await addNoti(response, member);
        }
      });
    }
    boardStore.addBoard(response);
    router.push({ name: "board" });
  } catch (error) {
    
    alert(error.message);
  }
};

const goBack = () => {
  router.push({ name: "board" });
};
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="goBack" class="btn btn-circle btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">สร้างบอร์ดใหม่</h1>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleCreateBoard" class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <label class="label">
                <span class="label-text font-semibold text-lg">
                  ชื่อบอร์ด <span class="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                v-model="formData.name"
                placeholder="เช่น โปรเจค A, งานพัฒนาระบบ..."
                class="input input-bordered input-lg w-full"
                required
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="label">
                <span class="label-text font-semibold text-lg">
                  เพิ่มสมาชิก
                </span>
              </label>

              <div
                v-if="formData.members.length > 0"
                class="flex flex-wrap gap-2 mb-3"
              >
                <div
                  v-for="(member, index) in formData.members"
                  :key="index"
                  class="badge badge-lg badge-primary gap-2"
                >
                  {{ member }}
                  <button
                    type="button"
                    @click="removeMember(index)"
                    class="cursor-pointer hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div v-if="showMemberInput" class="flex gap-2">
                <input
                  type="email"
                  v-model="memberEmail"
                  placeholder="กรอกอีเมลสมาชิก"
                  class="input input-bordered w-full"
                  @keyup.enter="addMember"
                />
                <button
                  type="button"
                  @click="addMember"
                  class="btn btn-primary"
                >
                  เพิ่ม
                </button>
                <button
                  type="button"
                  @click="
                    showMemberInput = false;
                    memberEmail = '';
                  "
                  class="btn btn-ghost"
                >
                  ยกเลิก
                </button>
              </div>

              <button
                v-else
                type="button"
                @click="showMemberInput = true"
                class="btn btn-outline btn-primary w-full"
              >
                + เพิ่มสมาชิก
              </button>
            </div>

            <div class="divider"></div>

            <div class="flex gap-3 justify-end">
              <button
                type="button"
                @click="goBack"
                class="btn btn-ghost btn-lg"
              >
                ยกเลิก
              </button>
              <button type="submit" class="btn btn-primary btn-lg">
                สร้างบอร์ด
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
