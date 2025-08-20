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
import { ref } from 'vue'
import SwipeCarouselCard from '@/components/SwipeCarouselCard.vue'
import axios from 'axios'

const candidates = ref([] as any[])

// Load once or when needed
async function fetchCandidates() {
  const { data } = await axios.get('/api/users/candidates')
  candidates.value = data || []
}
fetchCandidates()

async function onSwipe({ direction, userId }: { direction: 'left' | 'right'; userId: string }) {
  try {
    await axios.post('/api/users/swipes', { targetId: userId, direction })
  } catch (e) {
    // handle error (optional rollback)
  } finally {
    // remove the swiped user from stack
    candidates.value = candidates.value.filter((x) => x.userId !== userId)
  }
}
</script>
