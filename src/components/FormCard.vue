<script setup>
import { ref } from "vue";
const props = defineProps({
  showAddCardModal: Boolean,
  newCard: Object,
  board: Object,
  user: Object,
  closeAddCardModal: Function,
  addCard: Function,
  update: Boolean,
});

const showMemberDropdown = ref(false);
const showBadgeDropdown = ref(false);

const selectMember = (member) => {
  if (!props.newCard.members.includes(member)) {
    props.newCard.members.push(member);
  }
  showMemberDropdown.value = false;
};

const availableMembers = () => {
  console.log(props.board);

  if (!props.board?.members) return [];
  return props.board.members.filter(
    (m) => !props.newCard.members.includes(m) && m !== props.user.email
  );
};

const removeMember = (index) => {
  props.newCard.members.splice(index, 1);
};

const badgeInput = ref("");
const selectBadge = (badge) => {
  console.log("select");

  if (!props.newCard.badges.includes(badge.name)) {
    console.log("hi");

    props.newCard.badges.push(badge.name);
  }
  showBadgeDropdown.value = false;
};

const addBadge = () => {
  if (badgeInput.value.trim()) {
    const exists =
      props.board.badges.filter(
        (badge) =>
          badge.name.trim().toLowerCase() ===
          badgeInput.value.trim().toLowerCase()
      ).length !== 0;
    if (!props.newCard.badges.includes(badgeInput.value.trim()) && !exists) {
      props.newCard.badges.push(badgeInput.value.trim());
      props.board.badges.push({
        id:
          Math.max(
            props.board.badges.map((badge) => badge.id || 0),
            0
          ) + 1,
        name: badgeInput.value.trim(),
      });
    }
    badgeInput.value = "";
    showBadgeDropdown.value = false;
  }
};

const availableBadges = () => {
  if (!props.board?.badges) return [];
  return props.board.badges.filter(
    (b) => !props.newCard.badges.includes(b.name)
  );
};

const removeBadge = (index) => {
  props.newCard.badges.splice(index, 1);
};

const lostFocus = () => {
  setTimeout(() => {
    showBadgeDropdown.value = false;
  }, 150);
};

const handlerAdd = () => {
  badgeInput.value = "";
  props.addCard()
};
</script>

<template>
  <div
    v-if="showAddCardModal"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ update ? "อัปเดตการ์ด" : "เพิ่มการ์ดใหม่" }}
      </h2>

      <div class="mb-4">
        <label class="label">
          <span class="label-text">ชื่อการ์ด</span>
        </label>
        <input
          v-model="newCard.title"
          type="text"
          placeholder="ใส่ชื่อการ์ด..."
          class="input input-bordered w-full"
          @keyup.enter="addCard"
        />
      </div>
      <div class="mb-4">
        <label class="label">
          <span class="label-text font-semibold">คำอธิบาย</span>
        </label>
        <textarea
          v-model="newCard.description"
          placeholder="ใส่คำอธิบาย..."
          class="textarea textarea-bordered w-full h-24"
        ></textarea>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text font-semibold">สมาชิก</span>
        </label>
        <div class="relative">
          <button
            @click="showMemberDropdown = !showMemberDropdown"
            class="btn btn-outline w-full justify-start"
          >
            <div class="flex w-full items-center justify-between">
              เลือกสมาชิก
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                  />
                  <path
                    fill="#000"
                    d="M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95l4.95-4.95a1 1 0 0 1 1.414 1.414z"
                  />
                </g>
              </svg>
            </div>
          </button>

          <div
            v-if="showMemberDropdown"
            class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <div
              v-for="member in availableMembers()"
              :key="member"
              @click="selectMember(member)"
              @blur="showMemberDropdown = false"
              class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              {{ member }}
            </div>
            <div
              v-if="availableMembers().length === 0"
              class="px-4 py-2 text-gray-400 text-center"
            >
              ไม่มีสมาชิกที่เหลือ
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-3">
          <div
            v-for="(member, index) in newCard.members"
            v-show="member !== props.user.email"
            :key="index"
            class="badge badge-lg gap-2 bg-blue-100 text-blue-800"
          >
            {{ member }}
            <button @click="removeMember(index)" class="btn btn-ghost btn-xs">
              X
            </button>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <label class="label">
          <span class="label-text font-semibold">ป้ายกำกับ</span>
        </label>
        <div class="flex gap-2 mb-2">
          <div class="relative flex-1">
            <input
              v-model="badgeInput"
              @focus="showBadgeDropdown = !showBadgeDropdown"
              @blur="lostFocus"
              @input="showBadgeDropdown = true"
              type="text"
              placeholder="พิมพ์หรือเลือกป้ายกำกับ..."
              class="input input-bordered w-full"
              @keyup.enter="addBadge"
            />
            <div
              v-if="
                showBadgeDropdown &&
                (badgeInput || availableBadges().length > 0)
              "
              class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              <div
                v-for="badge in availableBadges()"
                :key="badge"
                @click="selectBadge(badge)"
                class="px-4 py-2 hover:bg-green-50 cursor-pointer"
              >
                {{ badge.name }}
              </div>
            </div>
          </div>
          <button @click="addBadge" class="btn btn-primary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(badge, index) in newCard.badges"
            :key="index"
            class="badge badge-lg gap-2 bg-green-100 text-green-800"
          >
            {{ badge }}
            <button @click="removeBadge(index)" class="btn btn-ghost btn-xs">
              X
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-2 justify-end">
        <button @click="closeAddCardModal" class="btn btn-ghost">ยกเลิก</button>
        <button
          :disabled="!newCard.title"
          @click="handlerAdd"
          class="btn btn-primary text-white"
        >
          {{ update ? "อัปเดต" : "เพิ่ม" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
