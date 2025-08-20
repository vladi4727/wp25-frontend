<template>
  <div class="relative flex items-center justify-center h-dvh bg-[#0b0d12]">
    <div v-if="candidates.length" class="relative w-80 h-[460px]">
      <!-- Render a stack of swipeable cards -->
      <SwipeCarouselCard
        v-for="(u, i) in candidates"
        :key="u.userId"
        :user="u"
        :style="{ zIndex: candidates.length - i }"
        @swipe="onSwipe"
      />
    </div>
    <div
      v-if="!candidates.length"
      class="relative w-80 h-[460px] flex items-center justify-center text-white/60"
    >
      <!-- Message shown when there are no candidates to swipe on -->
      No more candidates available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SwipeCarouselCard from '@/components/SwipeCarouselCard.vue'
import api from '@/lib/api'
import { useCandidates } from '@/stores/candidates'

// Access the candidate store and expose its list
const store = useCandidates()
const candidates = computed(() => store.list)

// Load candidates the first time the carousel mounts
onMounted(() => {
  if (!store.list.length) {
    store.fetch()
  }
})

// Handle like/dislike swipes and notify the backend
async function onSwipe({ direction, userId }: { direction: 'left' | 'right'; userId: string }) {
  try {
    await api.post('/users/swipes', { targetId: userId, direction })
  } catch (e) {
    // Optionally handle errors (network issues, etc.)
  } finally {
    // Always remove the swiped user from the stack
    store.remove(userId)
  }
}
</script>
