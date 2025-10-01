<template>
  <div class="confirm-dialog-overlay" @click.self="handleCancel">
    <div class="confirm-dialog mahjong-card">
      <h3 class="text-xl font-bold text-gray-800 mb-3">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      
      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 mahjong-button-secondary"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95 transition-transform"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  confirmText: '確認',
  cancelText: '取消',
})

const emit = defineEmits<Emits>()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4;
}

.confirm-dialog {
  @apply max-w-md w-full;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

