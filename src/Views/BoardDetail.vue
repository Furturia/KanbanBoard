<script setup>
import FormCard from "@/components/FormCard.vue";
import MessageModal from "@/components/MessageModal.vue";

import {
  getBoardById,
  removeBoardById,
  updateBoard,
} from "@/services/boardService";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const boardId = route.params.id;
const board = ref(null);
const boardStore = useBoardStore();
const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.getUser());
const draggingCard = ref(null);
const draggingFromCol = ref(null);
const dragging = ref(false);
const hoveredIndex = ref(null);

const showInviteModal = ref(false);
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
  showInviteModal.value = false;
};
const removeBoardApi = async () => {
  showDelBoard.value = false;
  try {
    const data = await removeBoardById(boardId);

    if (data?.error) {
      throw new Error(data.error);
    }

    boardStore.removeBoard(boardId);
    router.push({ name: "board" });
  } catch (error) {}
};

const resetDragState = () => {
  dragging.value = false;
  draggingCard.value = null;
  draggingFromCol.value = null;
  hoveredIndex.value = null;
};

const onDrop = async (toColId, dropIndex = null) => {
  console.log(hoveredIndex.value);

  if (!draggingCard.value) return;

  const fromCol = board.value.cols.find(
    (col) => col.id === draggingFromCol.value
  );
  const toCol = board.value.cols.find((col) => col.id == toColId);

  if (!fromCol || !toCol) {
    resetDragState();
    return;
  }

  const fromIndex = fromCol.cards.findIndex(
    (c) => c.id === draggingCard.value.id
  );

  console.log(draggingCard.value.id);

  console.log("from" + fromIndex);
  console.log("to" + dropIndex);

  if (fromIndex === -1) {
    console.log("fromIndex === -1");

    resetDragState();
    return;
  }
  if (
    draggingFromCol.value === toColId &&
    (dropIndex === null || dropIndex === fromIndex) &&
    hoveredIndex.value === fromIndex
  ) {
    console.log("same position");
    resetDragState();
    return;
  }

  let insertIndex = dropIndex;

  const [movedCard] = fromCol.cards.splice(fromIndex, 1);

  if (insertIndex == null || insertIndex > toCol.cards.length) {
    insertIndex = toCol.cards.length;
    console.log("from" + fromIndex);
    console.log("insert" + dropIndex);
  }

  console.log(
    `Move card[${fromIndex}] to index[${insertIndex}] in col[${toColId}]`
  );
  toCol.cards.splice(insertIndex, 0, movedCard);

  resetDragState();

  await updateBoardApi();
};

const newColName = ref("");
const openColModal = ref(false);
const addCol = async () => {
  openColModal.value = true;
  if (newColName.value) {
    // Filter out null/undefined ids, fallback to 0 if all are null
    let maxId = 0;
    if (Array.isArray(board.value.cols) && board.value.cols.length > 0) {
      const validIds = board.value.cols.map(col => typeof col.id === 'number' && !isNaN(col.id) ? col.id : null).filter(id => id !== null);
      maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
    }
    const newId = maxId + 1;
    board.value.cols.push({ id: newId, name: newColName.value });
    await updateBoardApi();
    openColModal.value = false;
    newColName.value = "";
  }
};

const showUpdateCardModal = ref(false);
const showDelBoard = ref(false);
const updateForm = ref({
  title: "",
  description: "",
  badges: [],
  members: [],
});
const targetCard = ref(null);
const updateCard = (card) => {
  targetCard.value = card;
  updateForm.value.title = card.title;
  updateForm.value.description = card.description;
  updateForm.value.badges = [...card.badges];
  updateForm.value.members = [...card.members];
  showUpdateCardModal.value = true;
};

const showAddCardModal = ref(false);
// const showMemberDropdown = ref(false);
// const showBadgeDropdown = ref(false);
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
  showUpdateCardModal.value = false;
  updateForm.value = { title: "", description: "", badges: [], members: [] };
  // showMemberDropdown.value = false;
  // showBadgeDropdown.value = false;
  showAddCardModal.value = false;
  newCard.value = { title: "", description: "", badges: [], members: [] };
};

const removeCard = async () => {
  console.log(selectDelCard.value);
  showDelCard.value = false;
  const col = board.value.cols.find(
    (col) => col.id == selectDelCard.value.colId
  );
  if (col) {
    col.cards.splice(selectDelCard.value.index, 1);
  }

  await updateBoardApi();
};

const removeCol = async () => {
  showDelCol.value = false;
  const index = board.value.cols.findIndex(
    (col) => col.id == selectDelCol.value.colRemove.id
  );
  if (index !== -1) {
    board.value.cols.splice(index, 1);
  }

  await updateBoardApi();
};

const addCard = async () => {
  if (!newCard.value.title.trim()) return;

  const targetCol = board.value.cols.find((col) => {
    return col.id === selectedColId.value;
  });

  if (!targetCol) return;
  console.log("active");
  // Find max card id across all columns
  let maxId = 0;
  board.value.cols.forEach(col => {
    if (Array.isArray(col.cards)) {
      col.cards.forEach(card => {
        if (typeof card.id === 'number' && card.id > maxId) {
          maxId = card.id;
        }
      });
    }
  });
  const addNewCard = {
    id: maxId + 1,
    ...newCard.value,
    members: [...newCard.value.members, user.value.email],
  };

  if(!Array.isArray(targetCol.cards)){
    targetCol.cards = []
  }

  targetCol.cards.push(addNewCard);

  await updateBoardApi();

  closeAddCardModal();
};
const onUpdateCard = async () => {
  if (!updateForm.value.title.trim()) return;

  if (!targetCard.value && updateForm.value) return;

  targetCard.value.title = updateForm.value.title;
  targetCard.value.description = updateForm.value.description;
  targetCard.value.badges = [...updateForm.value.badges];
  targetCard.value.members = [...updateForm.value.members];

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

const memberEmail = ref("");
const showMemberInput = ref(false);

const addMember = () => {
  if (memberEmail.value && memberEmail.value.includes("@")) {
    if (!board.value.members.includes(memberEmail.value)) {
      board.value.members.push(memberEmail.value);
      memberEmail.value = "";
      showMemberInput.value = false;
    }
  }
};

const removeMember = (index) => {
  board.value.members.splice(index, 1);
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
            @click="showInviteModal = true"
            class="btn btn-info btn-sm sm:btn-md text-white flex-1 sm:flex-none"
          >
            invite
          </button>
          <button
            @click="showDelBoard = true"
            class="btn btn-error btn-sm sm:btn-md text-white flex-1 sm:flex-none"
          >
            ลบบอร์ด
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="!board?.cols"
      class="w-full mt-12 h-full p-12 flex justify-center items-center rounded-lg bg-blue-50 border-1 border-blue-300"
    >
      <p class="text-blue-500 font-extralight">ไม่มีรายการ</p>
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
            @dragover.prevent="hoveredIndex = index"
            @drop.stop="onDrop(col.id, index)"
            @touchstart="onDragStart(card, col.id, index)"
            @touchmove.prevent="onTouchMove"
            @touchend.stop="onTouchEnd"
            :data-card-index="index"
            :data-col-id="col.id"
          >
            <div
              v-if="dragging && hoveredIndex === index"
              class="mb-2 w-full rounded-2xl border-t-2 text-blue-600"
            ></div>
            <div
              :class="{
                'opacity-50': dragging && draggingCard?.id === card.id,
              }"
              class="shrink-0 cursor-pointer rounded-xl w-full flex flex-col gap-3 p-3 bg-blue-50"
            >
              <div class="flex justify-between items-center">
                <h1 class="text-lg">{{ card?.title }}</h1>
                <div class="flex justify-center items-center gap-1">
                  <button
                    @click.stop="updateCard(card)"
                    @touchstart.stop
                    class="btn btn-ghost btn-circle text-blue-600 font-light"
                  >
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
                          fill="#155dfc"
                          d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                        />
                      </g>
                    </svg>
                  </button>
                  <button
                    @click.stop="askDelCard(index, col.id)"
                    @touchstart.stop
                    class="btn btn-ghost btn-circle text-blue-600 font-light"
                  >
                    X
                  </button>
                </div>
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

  <FormCard
    :showAddCardModal="showAddCardModal"
    :board="board"
    :user="user"
    :newCard="newCard"
    :close-add-card-modal="closeAddCardModal"
    :addCard="addCard"
  />
  <FormCard
    :update="true"
    :showAddCardModal="showUpdateCardModal"
    :board="board"
    :user="user"
    :newCard="updateForm"
    :close-add-card-modal="closeAddCardModal"
    :addCard="onUpdateCard"
  />

  <MessageModal
    v-if="showDelCard"
    :handle-ok="removeCard"
    :handle-cancel="
      () => {
        showDelCard = false;
        selectDelCard = null;
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
        selectDelCol = null;
      }
    "
    :title="'Do you want to delete this column ?'"
  />

  <MessageModal
    v-if="showDelBoard"
    :handle-ok="removeBoardApi"
    :handle-cancel="
      () => {
        showDelBoard = false;
      }
    "
    :title="'Do you want to delete this board ?'"
  />

  <div
    v-if="showInviteModal"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
  >
    <div
      class="bg-white h-fit w-fit outline-1 outline-blue-600 p-6 rounded-2xl"
    >
      <form @submit.prevent="updateBoardApi" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="label">
            <span class="label-text font-semibold text-lg"> เพิ่มสมาชิก </span>
          </label>

          <div
            v-if="board.members.length > 0"
            class="flex flex-wrap gap-2 mb-3"
          >
            <div
              v-for="(member, index) in board.members"
              v-show="member !== user.email"
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
            <button type="button" @click="addMember" class="btn btn-primary">
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
            @click="showInviteModal = false"
            class="btn btn-ghost btn-lg"
          >
            ยกเลิก
          </button>
          <button type="submit" class="btn btn-primary btn-lg">บันทึก</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
