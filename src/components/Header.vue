<template>
  <header class="w-full">
    <div class="mx-auto mt-3 px-4">
      <nav
        class="relative flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-2 shadow-xl backdrop-blur-xl"
        style="box-shadow: var(--glass-shadow)"
        aria-label="Top navigation"
      >
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600"
          >
            <span class="text-base font-bold text-white">T</span>
          </div>
          <span
            class="hidden sm:inline bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-sm font-semibold text-transparent"
          >
            Twinder
          </span>
        </div>

        <!-- Center nav (desktop) -->
        <ul class="hidden items-center gap-6 md:flex">
          <li>
            <RouterLink
              to="/dashboard"
              class="text-sm text-white/80 hover:text-white transition text-white"
              :class="isActive('/dashboard')"
            >
              Feed
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/matches"
              class="text-sm text-white/80 hover:text-white transition"
              :class="isActive('/matches')"
            >
              Matches
            </RouterLink>
          </li>
        </ul>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <!-- Avatar -->
          <button class="text-white" @click="onLogout">Logout</button>
          <RouterLink to="/createprofile" class="flex items-center gap-2" title="Your profile">
            <img
              :src="avatarUrl || defaultAvatar"
              alt="Avatar"
              class="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20"
            />
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Props or state where avatar URL comes from
// Replace with your real source (store/profile)
const props = defineProps<{ avatarUrl?: string }>()
const defaultAvatar =
  'https://api.dicebear.com/7.x/initials/svg?seed=T&backgroundType=gradientLinear&backgroundColor=f472b6,8b5cf6'
const open = ref(false)

function onLogout() {
  localStorage.removeItem('jwt')
  localStorage.removeItem('userId')
  router.push('/')
}

function isActive(path: string) {
  return route.path === path ? 'text-white' : ''
}

// Close menu on outside click or Escape
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => document.addEventListener('keydown', handleKey))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKey))
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.15s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
