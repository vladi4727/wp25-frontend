<template>
  <!-- Site-wide navigation bar -->
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
        <!-- Desktop navigation links -->
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
          <li>
            <RouterLink
              to="/preferences"
              class="text-sm text-white/80 hover:text-white transition"
              :class="isActive('/preferences')"
            >
              Preferences
            </RouterLink>
          </li>
        </ul>

        <!-- Right actions -->
        <!-- User actions: logout and profile link -->
        <div class="flex items-center gap-2">
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
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Props or state where avatar URL comes from
// Replace with your real source (store/profile)
const props = defineProps<{ avatarUrl?: string }>()
const defaultAvatar =
  'https://api.dicebear.com/7.x/initials/svg?seed=T&backgroundType=gradientLinear&backgroundColor=f472b6,8b5cf6'
function onLogout() {
  localStorage.removeItem('jwt')
  localStorage.removeItem('userId')
  router.push('/')
}

function isActive(path: string) {
  return route.path === path ? 'text-white' : ''
}

// Close potential menus on Escape keypress (future use)
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // placeholder for menu-close logic
  }
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
