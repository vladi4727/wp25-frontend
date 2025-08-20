<template>
  <div class="relative flex items-center justify-center h-dvh bg-[#0b0d12]">
    <div v-if="candidates.length" class="relative w-80 h-[460px]">
      <SwipeCarouselCard
        v-for="(u, i) in candidates"
        :key="u._id || u.id"
        :user="u"
        :style="{ zIndex: candidates.length - i }"
        @swipe="onSwipe"
      />
    </div>
    <div
      v-if="!candidates.length"
      class="relative w-80 h-[460px] flex items-center justify-center text-white/60"
    >
      No more candidates available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SwipeCarouselCard from '@/components/SwipeCarouselCard.vue'
import axios from 'axios'
import { useCandidates } from '@/stores/candidates'

const store = useCandidates()
const candidates = computed(() => store.list)

onMounted(() => {
  if (!store.list.length) {
    store.fetch()
  }
})

async function onSwipe({ direction, userId }: { direction: 'left' | 'right'; userId: string }) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE
    await axios.post(`${API_BASE}/users/swipes`, { targetId: userId, direction })
  } catch (e) {
    // handle error (optional rollback)
  } finally {
    // remove the swiped user from stack
    store.remove(userId)
  }
}
</script>
