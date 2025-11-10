import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/userStore";

import Home from "@/Views/Home.vue";
import LoginView from "@/Views/LoginView.vue";
import RegisterView from "@/Views/RegisterView.vue";
import BoardView from "@/Views/BoardView.vue";
import CreateBoardView from "@/Views/CreateBoardView.vue";
import BoardDetail from "@/Views/BoardDetail.vue";
import NotificationView from "@/Views/NotificationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
      name: "home",
    },
    {
      path: "/login",
      component: LoginView,
      name: "login",
    },
    {
      path: "/register",
      component: RegisterView,
      name: "register",
    },
    {
      path: "/board",
      component: BoardView,
      name: "board",
    },
    {
      path: "/board/create",
      component: CreateBoardView,
      name: "createBoard",
    },
    {
      path: "/board/:id",
      component: BoardDetail,
      name: "boardDetail",
    },
    {
      path: "/noti",
      component: NotificationView,
      name: "notiView",
    },

  ],
});


router.beforeEach((to, from) => {
  const currentUser = useUserStore();

  const loginRequired = ["/board"];

  if (
    !currentUser.getUser()?.id &&
    (loginRequired.includes(to.path) ||
      loginRequired.some((deny) => to.path.startsWith(deny)))
  ) {
    return "/login";
  }
});

export default router;
