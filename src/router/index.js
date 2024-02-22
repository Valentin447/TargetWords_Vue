import{createRouter, createWebHistory}from 'vue-router';
import Index from "@/pages/Index.vue";
import List from "@/pages/List.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/list",
    name: "List",
    component: List,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;