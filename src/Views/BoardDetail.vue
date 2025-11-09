<script setup>
import MessageModal from "@/components/MessageModal.vue";
import { getBoardById, updateBoard } from "@/services/boardService";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const boardId = route.params.id;
const board = ref(null);
const boardStore = useBoardStore();

const userStore = useUserStore();
const user = computed(() => userStore.getUser());
const draggingCard = ref(null);
const draggingFromCol = ref(null);
const dragging = ref(false);
const hoveredIndex = ref(null);
onMounted(async () => {
  try {
    const response = await getBoardById(boardId);
    console.log(response);

    if (response?.error) {
      throw new Error(response.error);
    }

    board.value = response;
  } catch (error) {
    console.log(error);
  }
});

const onDragStart = (card, colId) => {
  dragging.value = true;
  draggingCard.value = card;
  draggingFromCol.value = colId;
  console.log(draggingCard.value);

  console.log("start");
};

const onTouchMove = (event) => {
  const touch = event.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el) return;

  const cardEl = el.closest("[data-card-index]");
  if (cardEl) {
    hoveredIndex.value = Number(cardEl.dataset.cardIndex);
  } else {
    hoveredIndex.value = null;
  }
};

const onTouchEnd = (event) => {
  if (!draggingCard.value) return;

  const touch = event.changedTouches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el) return;

  const toColEl = el.closest("[data-col-id]");
  if (!toColEl) return;

  const toColId = toColEl.dataset.colId;

  console.log("Drop in col:", toColId);
  onDrop(toColId, hoveredIndex.value);
};

const updateBoardApi = async () => {
  try {
    console.log("before data");
    const data = await updateBoard(board.value);
    console.log(data);

    console.log("after data");

    if (data?.error) {
      throw new Error(data.error);
    }

    boardStore.updateBoardVS(data);
  } catch (error) {}
};

const onDrop = async (toColId, dropIndex = null) => {
  dragging.value = false;
  if (!draggingCard.value) return;
  const fromCol = board.value.cols.find(
    (col) => col.id === draggingFromCol.value
  );
  console.log(draggingFromCol.value);

  console.log(fromCol);

  fromCol.cards = fromCol.cards.filter((c) => c.id !== draggingCard.value.id);

  const toCol = board.value.cols.find((col) => col.id == toColId);

  console.log(toColId);

  console.log("to" + toCol);

  if (dropIndex !== null) {
    toCol.cards.splice(dropIndex, 0, draggingCard.value);
  } else {
    toCol.cards.push(draggingCard.value);
  }

  await updateBoardApi();

  dragging.value = false;
  draggingCard.value = null;
  draggingFromCol.value = null;
  hoveredIndex.value = null;
};

const newColName = ref("");
const openColModal = ref(false);
const addCol = async () => {
  openColModal.value = true;
  if (newColName.value) {
    const newId = Math.max(...board.value.cols.map((col) => col.id || 0)) + 1;
    board.value.cols.push({ id: newId, name: newColName.value });
    await updateBoardApi();
    openColModal.value = false;
    newColName.value = "";
  }
};

const showAddCardModal = ref(false);
const showMemberDropdown = ref(false);
const showBadgeDropdown = ref(false);
const selectedColId = ref(null);
const newCard = ref({
  title: "",
  description: "",
  badges: [],
  members: [],
});

const selectDelCard = ref(null);
const selectDelCol = ref(null);

const showDelCard = ref(false);
const showDelCol = ref(false);
const openAddCardModal = (colId) => {
  console.log(colId);

  selectedColId.value = colId;
  console.log(selectedColId.value);

  showAddCardModal.value = true;
};

const closeAddCardModal = () => {
  console.log("hiclose");

  selectedColId.value = null;
  showMemberDropdown.value = false;
  showBadgeDropdown.value = false;
  showAddCardModal.value = false;
  newCard.value = { title: "", description: "", badges: [], members: [] };
};

const selectMember = (member) => {
  if (!newCard.value.members.includes(member)) {
    newCard.value.members.push(member);
  }
  showMemberDropdown.value = false;
};

const availableMembers = () => {
  if (!board.value?.members) return [];
  return board.value.members.filter(
    (m) => !newCard.value.members.includes(m) && m !== user.value.email
  );
};

const removeMember = (index) => {
  newCard.value.members.value.splice(index, 1);
};

const badgeInput = ref("");
const selectBadge = (badge) => {
  console.log("select");

  if (!newCard.value.badges.includes(badge.name)) {
    console.log("hi");

    newCard.value.badges.push(badge.name);
  }
  showBadgeDropdown.value = false;
};

const addBadge = () => {
  if (badgeInput.value.trim()) {
    const exists =
      board.value.badges.filter(
        (badge) =>
          badge.name.trim().toLowerCase() ===
          badgeInput.value.trim().toLowerCase()
      ).length !== 0;
    if (!newCard.value.badges.includes(badgeInput.value.trim()) && !exists) {
      newCard.value.badges.push(badgeInput.value.trim());
      board.value.badges.push({
        id:
          Math.max(
            board.value.badges.map((badge) => badge.id || 0),
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
  if (!board.value?.badges) return [];
  return board.value.badges.filter(
    (b) => !newCard.value.badges.includes(b.name)
  );
};

const removeBadge = (index) => {
  newCard.value.badges.splice(index, 1);
};

const removeCard = async () => {
  console.log(selectDelCard.value);
  showDelCard.value=false
  const col = board.value.cols.find(
    (col) => col.id == selectDelCard.value.colId
  );
  if (col) {
    col.cards.splice(selectDelCard.value.index, 1);
  }

  await updateBoardApi();
};

const removeCol = async () => {
  showDelCol.value=false
  const index = board.value.cols.findIndex(
    (col) => col.id == selectDelCol.value.colRemove.id
  );
  if (index !== -1) {
    board.value.cols.splice(index, 1);
  }

  await updateBoardApi();
};

const addCard = async () => {
  console.log("add");

  if (!newCard.value.title.trim()) return;

  const targetCol = board.value.cols.find((col) => {
    console.log(col.id === selectedColId.value);
    console.log("target" + selectedColId.value);
    console.log("col" + col.id);

    return col.id === selectedColId.value;
  });

  console.log(targetCol);
  if (!targetCol) return;

  const addNewCard = {
    id: Math.max(...targetCol.cards.map((card) => card.id || 0), 0) + 1,
    ...newCard.value,
    members: [...newCard.value.members, user.value.email],
  };

  targetCol.cards.push(addNewCard);

  console.log("beforeapi" + board.value);
  await updateBoardApi();

  closeAddCardModal();
};

const askDelCard = (index, colId) => {
  showDelCard.value = true;
  selectDelCard.value = { index, colId };
};
const askDelCol = (colRemove) => {
  showDelCol.value = true;
  selectDelCol.value = { colRemove };
};

const lostFocus = () => {
  setTimeout(() => {
    showBadgeDropdown.value = false;
  }, 150);
};
</script>

<template>
  <div class="p-10 min-h-screen w-full h-full">
    <div
      class="flex flex-col items-start gap-3 md:flex-row md:justify-between md:w-auto md:items-center mb-4"
    >
      <div class="flex gap-2 justify-center">
        <RouterLink :to="{ name: 'board' }">
          <svg
            class="w-6 h-6 md:w-8 md:h-8"
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 512 512"
          >
            <path
              fill="none"
              stroke="#000"
              opacity="70%"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="48"
              d="M328 112L184 256l144 144"
            />
          </svg>
        </RouterLink>
        <div class="flex items-center justify-center">
          <input
            v-if="board"
            v-model="board.name"
            @keyup.enter="(e) => e.target.blur()"
            @blur="updateBoardApi"
            class="md:text-xl text-lg lg:text-2xl font-semibold min-w-fit"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path
                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
              />
              <path
                fill="#000"
                d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
              />
            </g>
          </svg>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 sm:w-fit w-full">
        <div class="w-auto sm:w-fit">
          <button
            @click="addCol"
            class="btn btn-primary btn-block sm:btn-md text-white flex-1 sm:flex-none"
          >
            เพิ่มคอลัมน์
          </button>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <button
            class="btn btn-info btn-sm sm:btn-md text-white flex-1 sm:flex-none"
          >
            invite
          </button>
          <button
            class="btn btn-error btn-sm sm:btn-md text-white flex-1 sm:flex-none"
          >
            ลบบอร์ด
          </button>
        </div>
      </div>
    </div>
    <div class="h-screen overflow-x-scroll">
      <div class="flex gap-4 h-full">
        <div
          class="w-7xl p-4 max-h-fit min-w-60 rounded-2xl shadow-xs flex flex-col gap-2 bg-white"
          v-for="col in board?.cols"
          @dragover.prevent
          @drop.stop="onDrop(col.id)"
          @touchend.stop="onTouchEnd"
          @touchmove.prevent="onTouchMove"
          :data-col-id="col.id"
        >
          <div class="flex h-fit items-center justify-between">
            <div class="flex items-center justify-center">
              <input
                v-model="col.name"
                @keyup.enter="(e) => e.target.blur()"
                @blur="updateBoardApi"
                class="font-semibold w-fit max-w-40 text-sm md:text-xl"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                  />
                  <path
                    fill="#000"
                    d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                  />
                </g>
              </svg>
            </div>
            <button
              @click.stop="askDelCol(col)"
              @touchstart.stop
              class="btn font-light text-red-500 btn-ghost btn-circle"
            >
              X
            </button>
          </div>

          <div
            v-for="(card, index) in col?.cards"
            draggable="true"
            @dragstart="onDragStart(card, col.id)"
            @dragover.prevent
            @drop.stop="onDrop(col.id, index)"
            @touchstart="onDragStart(card, col.id, index)"
            @touchmove.prevent="onTouchMove"
            @touchend.stop="onTouchEnd"
            :data-card-index="index"
            :data-col-id="col.id"
          >
            <div
              v-show="dragging"
              class="mb-2 w-full rounded-2xl border-t-2 text-blue-600"
            ></div>
            <div
              class="shrink-0 cursor-pointer rounded-xl w-full flex flex-col gap-3 p-3 bg-blue-50"
            >
              <div class="flex justify-between">
                <h1 class="text-lg">{{ card?.title }}</h1>
                <button
                  @click.stop="askDelCard(index, col.id)"
                  @touchstart.stop
                  class="btn btn-ghost btn-circle text-black/50 font-light"
                >
                  X
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(badge, index) in card.badges"
                  :key="index"
                  class="badge badge-lg gap-2 bg-green-100 text-green-800"
                >
                  {{ badge }}
                </div>
              </div>
            </div>
          </div>
          <button
            @click.stop="openAddCardModal(col.id)"
            @touchstart.stop
            class="flex gap-2 btn text-blue-600 btn-block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
              />
            </svg>
            <p class="text-xs sm:text-md md:text-lg">เพิ่มการ์ด</p>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="openColModal"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">เพิ่มคอลัมน์ใหม่</h2>

      <div class="mb-4">
        <label class="label">
          <span class="label-text">ชื่อคอลัมน์</span>
        </label>
        <input
          v-model="newColName"
          type="text"
          placeholder="ใส่ชื่อคอลัมน์..."
          class="input input-bordered w-full"
          @keyup.enter="addCol"
        />
      </div>

      <div class="flex gap-2 justify-end">
        <button @click="openColModal = false" class="btn btn-ghost">
          ยกเลิก
        </button>
        <button @click="addCol" class="btn btn-primary text-white">
          เพิ่ม
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showAddCardModal"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">เพิ่มการ์ดใหม่</h2>

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
            v-show="member !== user.email"
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
        <button @click="showAddCardModal = false" class="btn btn-ghost">
          ยกเลิก
        </button>
        <button
          :disabled="!newCard.title"
          @click="addCard"
          class="btn btn-primary text-white"
        >
          เพิ่ม
        </button>
      </div>
    </div>
  </div>

  <MessageModal
    v-if="showDelCard"
    :handle-ok="removeCard"
    :handle-cancel="
      () => {
        showDelCard = false;
        selectDelCard = null
      }
    "
    :title="'Do you want to delete this card ?'"
  />

  <MessageModal
    v-if="showDelCol"
    :handle-ok="removeCol"
    :handle-cancel="
      () => {
        showDelCol = false;
        selectDelCol = null
      }
    "
    :title="'Do you want to delete this column ?'"
  />
</template>

<style></style>
