<template>
  <div class="main-layout h-full flex flex-col">
    <!-- 主要內容區 -->
    <main class="flex-1 overflow-y-auto bg-gray-100 pb-16">
      <router-view />
    </main>

    <!-- 底部導航列 -->
    <nav class="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div class="flex justify-around items-center h-16">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item flex flex-col items-center justify-center flex-1 h-full transition-colors"
          :class="{ 'active': isActive(item.path) }"
        >
          <span class="text-2xl mb-1">{{ item.icon }}</span>
          <span class="text-xs">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavItem {
  path: string
  label: string
  icon: string
}

const route = useRoute()

const navItems: NavItem[] = [
  { path: '/game', label: '遊戲', icon: '🀄' },
  { path: '/history', label: '記錄', icon: '📋' },
  { path: '/statistics', label: '統計', icon: '📊' },
  { path: '/settings', label: '設定', icon: '⚙️' }
]

const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.nav-item {
  color: #9ca3af;
  text-decoration: none;
}

.nav-item.active {
  color: #1a5f3f;
}

.nav-item:active {
  background-color: #f3f4f6;
}
</style>

