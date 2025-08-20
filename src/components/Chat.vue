<template>
  <div
    class="relative overflow-hidden bg-[#0b0d12] text-white w-full flex justify-center items-center"
  >
    <div class="relative z-10 mx-auto flex flex-col px-4 w-[100%] justify-center">
      <!-- Header -->
      <header class="sticky top-3 z-10 mt-3">
        <div
          class="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl"
          style="box-shadow: var(--glass-shadow)"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600"
            >
              <span class="text-sm font-bold">T</span>
            </div>
            <div>
              <div class="text-sm font-semibold">Chat</div>
              <div class="text-xs text-white/60">ID: {{ chatId }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15"
              @click="refreshMessages"
              :disabled="loading"
              title="Refresh"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <!-- Messages -->
      <main class="mt-4">
        <div
          class="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl"
          style="box-shadow: var(--glass-shadow)"
        >
          <!-- Scrollable list -->
          <div
            ref="scrollBox"
            class="flex-1 flex flex-col gap-[12px] overflow-y-auto p-4 space-y-2"
          >
            <div class="flex justify-center">
              <button
                v-if="canLoadOlder && !loadingOlder"
                class="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/15"
                @click="loadOlder"
              >
                Load older
              </button>
              <span v-if="loadingOlder" class="text-xs text-white/60">Loading…</span>
            </div>

            <div
              v-for="m in messages"
              :key="m._id"
              class="flex"
              :class="isMine(m) ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[70%] rounded-2xl px-3 py-2 text-sm"
                :class="
                  isMine(m)
                    ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white'
                    : 'bg-white/10 text-white/90 border border-white/20'
                "
              >
                <div class="whitespace-pre-wrap break-words">{{ m.text }}</div>
                <div class="mt-1 text-[10px] opacity-80 text-right">
                  {{ fmtTime(m.createdAt) }}
                </div>
              </div>
            </div>

            <div v-if="!messages.length && !loading" class="text-center text-white/70 py-10">
              No messages yet.
            </div>
          </div>

          <!-- Composer -->
          <div class="border-t border-white/10 p-2">
            <form class="flex items-end gap-2" @submit.prevent="send">
              <textarea
                v-model="draft"
                rows="1"
                placeholder="Type a message…"
                class="min-h-[40px] max-h-40 flex-1 resize-y rounded-xl border border-white/20 bg-white/10 p-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
                @keydown.enter.exact.prevent="send"
              />
              <button
                type="submit"
                class="rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                :disabled="sending || !trimmedDraft"
              >
                {{ sending ? 'Sending…' : 'Send' }}
              </button>
            </form>
          </div>
        </div>

        <p v-if="error" class="mt-2 text-center text-xs text-red-400">{{ error }}</p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

type Msg = {
  _id: string
  chatId: string
  senderId: string
  text: string
  createdAt: string
}

const route = useRoute()
const chatId = route.params.id as string

const messages = ref<Msg[]>([])
const loading = ref(false)
const loadingOlder = ref(false)
const sending = ref(false)
const error = ref('')

const draft = ref('')
const trimmedDraft = computed(() => draft.value.trim())

// Optional: identify current user ID if stored (used to style bubbles)
const currentUserId = localStorage.getItem('userId') || '' // set this at login after /auth/me if needed

const scrollBox = ref<HTMLDivElement | null>(null)
function scrollToBottom() {
  nextTick(() => {
    const el = scrollBox.value
    if (!el) return
    el.scrollTop = el.scrollHeight
  })
}

function isMine(m: Msg) {
  return String(m.senderId) === String(currentUserId)
}

function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Load initial
onMounted(async () => {
  await refreshMessages()
  scrollToBottom()
})

// Fetch latest (refresh)
async function refreshMessages() {
  error.value = ''
  loading.value = true
  try {
    // Get newest set (no before param). Backend returns in ascending time or descending? We expect ascending.
    const { data } = await axios.get(`/api/chats/${chatId}/messages`)
    const arr: Msg[] = Array.isArray(data) ? data : []
    messages.value = arr
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load messages'
  } finally {
    loading.value = false
  }
}

// Pagination: load older (prepend)
const canLoadOlder = computed(() => messages.value.length > 0)
async function loadOlder() {
  if (!messages.value.length) return
  loadingOlder.value = true
  error.value = ''
  try {
    const oldest = messages.value[0]
    const { data } = await axios.get(`/api/chats/${chatId}/messages`, {
      params: { before: oldest.createdAt },
    })
    const older: Msg[] = Array.isArray(data) ? data : []
    // Keep scroll position roughly stable when prepending
    const el = scrollBox.value
    const oldHeight = el?.scrollHeight || 0
    messages.value = [...older, ...messages.value]
    await nextTick()
    if (el) {
      const newHeight = el.scrollHeight
      el.scrollTop = newHeight - oldHeight
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load older messages'
  } finally {
    loadingOlder.value = false
  }
}

// Send message then refresh
async function send() {
  if (!trimmedDraft.value) return
  sending.value = true
  error.value = ''
  try {
    await axios.post(`/api/chats/${chatId}/messages`, { text: trimmedDraft.value })
    draft.value = ''
    // After sending, refresh list (no real-time)
    await refreshMessages()
    scrollToBottom()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to send'
  } finally {
    sending.value = false
  }
}
</script>
