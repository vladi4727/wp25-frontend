<template>
  <div class="relative overflow-hidden bg-[#0b0d12] text-white">
    <div class="relative z-10 mx-auto">
      <h1 class="text-2xl font-bold">
        <span
          class="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent"
          >Matches</span
        >
      </h1>

      <!-- Search -->
      <div class="mt-6">
        <div
          class="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl"
          style="box-shadow: var(--glass-shadow)"
        >
          <svg class="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21l-4.3-4.3M10.8 18.5a7.7 7.7 0 1 1 0-15.4 7.7 7.7 0 0 1 0 15.4Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Search by name..."
            class="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
          />
          <button v-if="query" @click="query = ''" class="text-xs text-white/70 hover:text-white">
            Clear
          </button>
        </div>
      </div>

      <!-- Table card -->
      <div
        class="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl"
        style="box-shadow: var(--glass-shadow)"
      >
        <!-- Table header -->
        <div
          class="hidden grid-cols-12 items-center gap-4 border-b border-white/10 px-4 py-3 text-xs text-white/60 md:grid"
        >
          <div class="col-span-5">Match</div>
          <div class="col-span-2">Updated</div>
          <div class="col-span-2 text-right">Action</div>
        </div>

        <!-- Rows -->
        <div v-if="loading" class="px-4 py-6 text-center text-white/70">Loading matches…</div>
        <div v-else-if="filteredMatches.length === 0" class="px-4 py-6 text-center text-white/70">
          No matches found.
        </div>
        <div
          v-else
          v-for="m in filteredMatches"
          :key="m._id"
          class="grid grid-cols-1 items-center gap-4 border-t border-white/10 px-4 py-3 md:grid-cols-12 md:border-t-0 md:hover:bg-white/5"
        >
          <!-- Match (avatar, name, bio) -->
          <div class="col-span-5 flex items-center gap-3">
            <img
              :src="defaultAvatar('')"
              alt=""
              class="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
            />
            <div>
              <div class="text-sm font-semibold text-white">{{ '' }}</div>
              <div class="text-xs text-white/60 line-clamp-1">{{ '—' }}</div>
            </div>
          </div>

          <!-- Updated -->
          <div class="col-span-2 text-xs text-white/60">
            {{ formatTime(m.createdAt) }}
          </div>

          <!-- Action -->
          <div class="col-span-2 flex justify-end">
            <button
              class="rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow"
              @click="openMatch(m)"
            >
              Open
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile list (alternative presentation) -->
      <div class="mt-4 space-y-3 md:hidden">
        <div
          v-for="m in filteredMatches"
          :key="'m-mobile-' + m._id"
          class="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-xl"
        >
          <div class="flex items-center gap-3">
            <img
              :src="defaultAvatar('')"
              alt=""
              class="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
            />
            <div>
              <div class="text-sm font-semibold text-white">{{ '' }}</div>
            </div>
          </div>
          <button
            class="rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow"
            @click="openMatch(m)"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

type MatchRow = {
  _id: string
  userIds: string[]
  createdAt?: string
}

const router = useRouter()
const query = ref('')
const loading = ref(false)
const error = ref('')
const matches = ref<MatchRow[]>([])

onMounted(() => {
  loadMatches()
})

async function loadMatches() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await axios.get('/api/users/matches')
    // Normalize: map backend response to MatchRow list if needed
    // Expecting data to be an array; adapt if wrapped
    const arr = Array.isArray(data) ? data : data?.matches || []
    matches.value = arr.map((m: any) => {
      // Derive withUser field: if backend returns userIds: [me, other], and a populated other user
      const wu = m.withUser || m.otherUser || m.user || {}
      return {
        _id: m._id || m.id,
        userIds: m.userIds || [],
        createdAt: m.createdAt,
      } as MatchRow
    })
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load matches'
  } finally {
    loading.value = false
  }
}

const filteredMatches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return matches.value
  return matches.value.filter((m) => ''.toLowerCase().includes(q))
})

function defaultAvatar(name?: string) {
  const seed = encodeURIComponent(name || 'T')
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=f472b6,8b5cf6`
}

function formatTime(iso?: string) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return '—'
  }
}

function openMatch(m: MatchRow) {
  router.push({ name: 'chat', params: { id: m._id } })
}
</script>
