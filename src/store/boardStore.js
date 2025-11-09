import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useBoardStore = defineStore("board", () => {
  const board = ref(null);

  function getBoard() {
    return board.value;
  }

  function setBoard(boardInfo) {
    board.value = boardInfo;
  }

  function addBoard(boardInfo) {
    if (board.value) {
      board.value.push(boardInfo);
    } else {
      board.value = [boardInfo];
    }}

    function removeBoard(id) {
      if (board.value && id) {
        let index = board.value.findIndex((b) => b.id == id);

        if (index) {
          board.value.splice(index, 1);
        }
      }
    }

    function addBoard(boardInfo) {
      if (board.value) {
        board.value.push(boardInfo);
      } else {
        board.value = [boardInfo];
      }
    }

    function updateBoardVS(updatedBoard) {
      if (!board.value || !Array.isArray(board.value)) return;

      const index = board.value.findIndex((b) => b.id === updatedBoard.id);

      if (index !== -1) {
        board.value.splice(index, 1, updatedBoard);
      }
    }

    function clearBoard() {
      board.value = null;
    }

    return {
      board,
      getBoard,
      setBoard,
      updateBoardVS,
      addBoard,
      clearBoard,
      removeBoard,
    };
  
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
