import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      redirect: "my-status",
    },
    {
      path: "/my-status",
      name: "MyStatus",
      component: () => import("../views/MyStatus.vue"),
      meta: {
        layout: "default",
      },
    },
    {
      path: "/dashboard",
      name: "DashBoard",
      component: () => import("../views/DashBoard.vue"),
      meta: {
        layout: "default",
      },
    },
  ],
});

export default router;
