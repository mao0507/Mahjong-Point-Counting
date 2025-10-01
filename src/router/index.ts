import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/views/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/game',
    children: [
      {
        path: 'game',
        name: 'Game',
        component: () => import('@/views/game/index.vue'),
        meta: { title: '遊戲' },
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/history/index.vue'),
        meta: { title: '歷史記錄' },
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/index.vue'),
        meta: { title: '統計資訊' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '設定' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守衛
router.beforeEach((to, _from, next) => {
  // 設定頁面標題
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - 麻將計分工具`
  }
  next()
})

export default router
