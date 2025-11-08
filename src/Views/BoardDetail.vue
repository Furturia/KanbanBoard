<script setup>
import { getBoardById, updateBoard } from "@/services/boardService";
import { useBoardStore } from "@/store/boardStore";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const boardId = route.params.id;
const board = ref(null);
const boardStore = useBoardStore();

const draggingCard = ref(null);
const draggingFromCol = ref(null);
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
  draggingCard.value = card;
  draggingFromCol.value = colId;
};

const onDrop = async (toColId,dropIndex=null) => {
  if (!draggingCard.value) return;
  const fromCol = board.value.cols.find(
    (col) => col.id === draggingFromCol.value
  );
  fromCol.cards = fromCol.cards.filter((c) => c.id !== draggingCard.value.id);

  const toCol = board.value.cols.find((col) => col.id === toColId);

  if (dropIndex !== null) {
    toCol.cards.splice(dropIndex, 0, draggingCard.value);
  } else {

    toCol.cards.push(draggingCard.value);
  }
  

  try {
    console.log("before data");
    const data = await updateBoard(board.value);

    console.log("after data");

    if (data?.error) {
      throw new Error(data.error);
    }

    boardStore.updateBoardVS(data);
  } catch (error) {}

  draggingCard.value = null;
  draggingFromCol.value = null;
};

const moveCard = () => {};
</script>

<template>
  <div class="p-10 min-h-screen w-full h-full overflow-x-scroll">
    <div class="flex gap-4 h-full">
      <div
        class="w-7xl p-4 max-h-fit rounded-2xl shadow-xs flex flex-col gap-2 bg-white"
        v-for="col in board?.cols"
        @dragover.prevent
        @drop="onDrop(col.id)"
      >
        <div class="flex h-fit justify-between">
          <h1 class="font-semibold text-xl">{{ col.name }}</h1>
          <p v-show="col?.cards?.length">{{ col?.cards?.length }}</p>
        </div>

        <div
          v-for="card in col?.cards"
          draggable="true"
          @dragstart="onDragStart(card, col.id)"
          class="cursor-pointer rounded-xl w-full flex p-3 bg-blue-50"
        >
          <h1 class="text-lg">{{ card?.title }}</h1>
        </div>
        <button class="flex gap-2 btn text-blue-600 btn-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
            /></svg
          >เพิ่มการ์ด
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
