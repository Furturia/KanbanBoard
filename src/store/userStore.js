import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue';

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  function getUser() {
    return user.value;
  }

  function setUser(userInfo) {
    user.value = userInfo;
  }

  function clearUser() {
    user.value = null;
  }

  return { user, getUser, setUser, clearUser };
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}