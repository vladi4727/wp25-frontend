<template>
  <div
    class="absolute w-80 h-[460px] select-none [touch-action:pan-y]"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerUp"
  >
    <!-- Card -->
    <div
      class="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-xl"
      :style="{ transform: transformStyle, transition: dragging ? 'none' : 'transform 0.25s ease' }"
    >
      <!-- Images carousel -->
      <div class="relative h-[75%] w-full bg-black">
        <!-- Active image -->
        <img
          v-if="currentImage"
          :src="currentImage"
          alt=""
          class="h-full w-full object-cover"
          @click="nextImage"
        />

        <!-- Gradient overlay for readability -->
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0"
        ></div>

        <!-- Click zones (optional): left/back, right/next -->
        <div class="absolute inset-0 flex">
          <button
            class="h-full flex-1 opacity-0"
            @click.stop="prevImage"
            aria-label="Previous image"
          ></button>
          <button
            class="h-full flex-1 opacity-0"
            @click.stop="nextImage"
            aria-label="Next image"
          ></button>
        </div>

        <!-- Image dots -->
        <div class="absolute top-2 left-0 right-0 flex justify-center gap-1 px-4">
          <span
            v-for="(img, i) in pictures"
            :key="'dot-' + i"
            class="h-1 w-8 rounded-full"
            :class="i === imgIndex ? 'bg-white/90' : 'bg-white/40'"
          />
        </div>
      </div>

      <!-- Info -->
      <div class="flex h-[25%] flex-col justify-between p-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">
            {{ user.profile.fullName || 'Unknown' }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 line-clamp-3">
            {{ user.profile.bio || '' }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="mt-2 flex justify-between">
          <button
            type="button"
            class="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow text-red-500 text-2xl border border-gray-200 hover:bg-gray-50"
            @click.stop="dislike"
          >
            ❌
          </button>
          <button
            type="button"
            class="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow text-green-500 text-2xl border border-gray-200 hover:bg-gray-50"
            @click.stop="like"
          >
            ✅
          </button>
        </div>
      </div>
    </div>

    <!-- Optional like/nope badges during drag -->
    <div
      class="pointer-events-none absolute left-4 top-6 rounded-md border-4 px-3 py-1 text-2xl font-extrabold"
      :class="likeBadgeClass"
      v-if="dragging && currentX > 30"
    >
      LIKE
    </div>
    <div
      class="pointer-events-none absolute right-4 top-6 rounded-md border-4 px-3 py-1 text-2xl font-extrabold"
      :class="nopeBadgeClass"
      v-if="dragging && currentX < -30"
    >
      NOPE
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type UserCard = {
  userId?: string
  _id?: string
  profile: {
    fullName?: string
    bio?: string
    pictures?: string[]
  }
}

const props = defineProps<{
  user: UserCard
  swipeThreshold?: number // px, default 150
}>()

const emit = defineEmits<{
  (e: 'swipe', payload: { direction: 'left' | 'right'; userId: string }): void
  (e: 'like', userId: string): void
  (e: 'dislike', userId: string): void
}>()

const userId = computed(() => (props.user.userId || '') as string)
const pictures = computed(() =>
  Array.isArray(props.user.profile.pictures) ? props.user.profile.pictures : [],
)
const imgIndex = ref(0)
const currentImage = computed(() => pictures.value[imgIndex.value] || '')

watch(pictures, () => {
  // reset index when user changes
  imgIndex.value = 0
})

function nextImage() {
  if (pictures.value.length <= 1) return
  imgIndex.value = (imgIndex.value + 1) % pictures.value.length
}
function prevImage() {
  if (pictures.value.length <= 1) return
  imgIndex.value = (imgIndex.value - 1 + pictures.value.length) % pictures.value.length
}

// Drag/swipe handling
const startX = ref(0)
const currentX = ref(0)
const dragging = ref(false)
const transformStyle = ref('translateX(0) rotate(0deg)')

const threshold = computed(() => props.swipeThreshold ?? 150)

function onPointerDown(e: PointerEvent) {
  startX.value = e.clientX
  dragging.value = true
  ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  currentX.value = e.clientX - startX.value
  transformStyle.value = `translateX(${currentX.value}px) rotate(${currentX.value / 12}deg)`
}
function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false

  if (currentX.value > threshold.value) return like()
  if (currentX.value < -threshold.value) return dislike()

  transformStyle.value = 'translateX(0) rotate(0deg)'
  currentX.value = 0
}

function like() {
  // animate out to right
  transformStyle.value = 'translateX(400px) rotate(14deg)'
  setTimeout(() => {
    emit('like', userId.value)
    emit('swipe', { direction: 'right', userId: userId.value })
    reset()
  }, 220)
}
function dislike() {
  // animate out to left
  transformStyle.value = 'translateX(-400px) rotate(-14deg)'
  setTimeout(() => {
    emit('dislike', userId.value)
    emit('swipe', { direction: 'left', userId: userId.value })
    reset()
  }, 220)
}
function reset() {
  transformStyle.value = 'translateX(0) rotate(0deg)'
  currentX.value = 0
}

// Badges classes (optional visual feedback)
const likeBadgeClass = computed(() => {
  const opacity = Math.min(1, Math.abs(currentX.value) / threshold.value)
  return `border-green-500 text-green-500 bg-white/70 rotate-[-10deg]` + ` opacity-[${opacity}]`
})
const nopeBadgeClass = computed(() => {
  const opacity = Math.min(1, Math.abs(currentX.value) / threshold.value)
  return `border-red-500 text-red-500 bg-white/70 rotate-[10deg]` + ` opacity-[${opacity}]`
})
</script>

<style scoped>
/* no extra styles required; Tailwind utilities used */
</style>
