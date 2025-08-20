<template>
  <div class="relative overflow-hidden text-white flex flex-col items-center justify-center">
    <!-- Centered card -->
    <div class="relative z-10 mx-auto flex max-w-xl items-center justify-center px-4 w-xl">
      <div
        class="w-full relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8"
        style="box-shadow: var(--glass-shadow)"
      >
        <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"></div>

        <!-- Header -->
        <div class="mb-6 flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
          >
            <span class="text-xl font-bold">T</span>
          </div>
          <div>
            <div class="text-lg font-semibold tracking-tight">Create your profile</div>
            <div class="text-xs text-white/60">Tell others who you are</div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          <!-- Full name -->
          <div>
            <label class="mb-1 block text-xs text-white/70">Full name</label>
            <input
              v-model="fullName"
              type="text"
              required
              placeholder="e.g., Alex Popescu"
              class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
              autocomplete="name"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="mb-1 block text-xs text-white/70">Bio</label>
            <textarea
              v-model="bio"
              rows="4"
              placeholder="A few words about you"
              class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
              maxlength="220"
            />
            <div class="mt-1 text-right text-[11px] text-white/50">{{ bio.length }}/220</div>
          </div>

          <!-- Pictures uploader (multiple) -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <label class="block text-xs text-white/70"
                >Profile pictures (up to {{ maxPictures }})</label
              >
              <span class="text-[11px] text-white/50">{{ images.length }}/{{ maxPictures }}</span>
            </div>

            <!-- Controls -->
            <div class="flex flex-wrap items-center gap-2">
              <label
                for="files"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium hover:bg-white/15"
              >
                <span>Add pictures</span>
                <input
                  id="files"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  multiple
                  @change="onFilesChange"
                />
              </label>
              <p class="text-[11px] text-white/50">JPG/PNG/WebP, up to 5MB each.</p>
            </div>

            <!-- Thumbnails grid -->
            <div class="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              <div
                v-for="(img, idx) in images"
                :key="img.id"
                class="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/20 bg-white/5"
              >
                <img :src="img.url" alt="" class="h-full w-full object-cover" />

                <!-- Actions -->
                <div
                  class="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <div class="flex gap-1">
                    <button
                      type="button"
                      class="rounded-md bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/80"
                      @click="moveLeft(idx)"
                      :disabled="idx === 0"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      class="rounded-md bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/80"
                      @click="moveRight(idx)"
                      :disabled="idx === images.length - 1"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    class="rounded-md bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/80"
                    @click="removeAt(idx)"
                  >
                    Remove
                  </button>
                </div>

                <!-- Index badge -->
                <div class="absolute left-1 top-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px]">
                  {{ idx + 1 }}
                </div>

                <!-- Tag: existing vs new -->
                <div
                  v-if="img.kind === 'existing'"
                  class="absolute right-1 top-1 rounded-md bg-emerald-500/70 px-2 py-0.5 text-[10px] text-black"
                >
                  existing
                </div>
                <div
                  v-else
                  class="absolute right-1 top-1 rounded-md bg-pink-500/70 px-2 py-0.5 text-[10px] text-black"
                >
                  new
                </div>
              </div>

              <!-- Placeholders -->
              <div
                v-for="n in placeholders"
                :key="'ph-' + n"
                class="relative aspect-[4/5] rounded-xl border border-white/10 bg-white/5"
              >
                <div
                  class="absolute inset-0 flex items-center justify-center text-white/30 text-xs"
                >
                  Empty
                </div>
              </div>
            </div>
          </div>

          <!-- Actions: Preview + Save -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition"
              @click="openPreview"
            >
              Preview profile
            </button>

            <button
              type="submit"
              :disabled="loading"
              class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
            >
              <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-30"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-80"
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  stroke-width="4"
                />
              </svg>
              <span>{{ loading ? 'Saving…' : 'Save profile' }}</span>
            </button>
          </div>

          <p v-if="error" class="text-center text-xs text-red-400">{{ error }}</p>
          <p v-if="success" class="text-center text-xs text-emerald-400">
            Profile saved! Redirecting…
          </p>
        </form>
      </div>
    </div>

    <!-- Modal: Profile Preview -->
    <transition name="fade">
      <div
        v-if="showPreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="closePreview"
      >
        <div
          class="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div class="relative h-[560px] w-full" :style="previewBackgroundStyle">
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20"
            ></div>

            <div class="absolute inset-x-0 bottom-0 p-4">
              <h2 class="text-2xl font-bold">
                {{ fullName || 'Your name' }}
              </h2>
              <p class="mt-1 text-white/80 break-words">
                {{ bio || 'Your short bio goes here.' }}
              </p>

              <div class="mt-3 flex gap-1">
                <span
                  v-for="(img, i) in images"
                  :key="'dot-' + img.id"
                  class="h-1.5 w-6 rounded-full"
                  :class="i === 0 ? 'bg-white/90' : 'bg-white/40'"
                />
              </div>
            </div>

            <button
              type="button"
              class="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              @click="closePreview"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Config
const maxPictures = 6

// State
const router = useRouter()
const fullName = ref('')
const bio = ref('')

type ImgItem =
  | { id: string; kind: 'existing'; url: string } // existing server image
  | { id: string; kind: 'new'; url: string; file: File } // newly added file

const images = ref<ImgItem[]>([])

const loading = ref(false)
const error = ref('')
const success = ref(false)

const showPreview = ref(false)
const placeholders = computed(() => Math.max(0, maxPictures - images.value.length))

// Load profile on mount
onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  error.value = ''
  try {
    const { data } = await axios.get('/api/users/profile')
    // Expected data.profile or direct fields; adjust if needed
    const p = data?.profile || data || {}
    fullName.value = p.fullName || ''
    bio.value = p.bio || ''
    const pics: string[] = Array.isArray(p.pictures) ? p.pictures : []
    // Replace current images with existing ones
    // Revoke any old object URLs to avoid leaks
    for (const img of images.value) {
      if (img.kind === 'new') URL.revokeObjectURL(img.url)
    }
    images.value = pics.slice(0, maxPictures).map((url) => ({
      id: crypto.randomUUID(),
      kind: 'existing',
      url,
    }))
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load profile'
  }
}

function onFilesChange(e: Event) {
  error.value = ''
  const input = e.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  if (!files.length) return

  const remaining = maxPictures - images.value.length
  const toAdd = files.slice(0, remaining)

  for (const f of toAdd) {
    if (!f.type.startsWith('image/')) {
      error.value = 'Only image files allowed'
      continue
    }
    if (f.size > 5 * 1024 * 1024) {
      error.value = 'An image exceeds 5MB'
      continue
    }
    const url = URL.createObjectURL(f)
    images.value.push({ id: crypto.randomUUID(), kind: 'new', file: f, url })
  }

  input.value = ''
}

function removeAt(idx: number) {
  const item = images.value[idx]
  if (!item) return
  if (item.kind === 'new') URL.revokeObjectURL(item.url)
  images.value.splice(idx, 1)
}

function moveLeft(idx: number) {
  if (idx <= 0) return
  const tmp = images.value[idx]
  images.value[idx] = images.value[idx - 1]
  images.value[idx - 1] = tmp
}

function moveRight(idx: number) {
  if (idx >= images.value.length - 1) return
  const tmp = images.value[idx]
  images.value[idx] = images.value[idx + 1]
  images.value[idx + 1] = tmp
}

const previewBackgroundStyle = computed(() => {
  const first = images.value[0]
  if (first) {
    return `background-image: url('${first.url}');
              background-size: cover;
              background-position: center;`
  }
  return `background: radial-gradient(80% 60% at 50% 0%, rgba(236,72,153,.6), transparent),
                     radial-gradient(60% 50% at 100% 50%, rgba(147,51,234,.5), transparent),
                     #0b0d12;`
})

function openPreview() {
  showPreview.value = true
  document.body.style.overflow = 'hidden'
}
function closePreview() {
  showPreview.value = false
  document.body.style.overflow = ''
}

onBeforeUnmount(() => {
  for (const img of images.value) {
    if (img.kind === 'new') URL.revokeObjectURL(img.url)
  }
})

async function onSubmit() {
  error.value = ''
  success.value = false

  if (!fullName.value.trim()) {
    error.value = 'Full name is required'
    return
  }
  if (images.value.length === 0) {
    error.value = 'Please add at least one picture'
    return
  }

  // Build FormData:
  // - existingOrder[]: ordered URLs for existing images kept
  // - pictures: new files, in final order position after existing
  const form = new FormData()
  form.append('fullName', fullName.value.trim())
  form.append('bio', bio.value.trim())

  // Collect ordered existing and new
  const existingInOrder: string[] = []
  const newFilesInOrder: File[] = []
  for (const img of images.value) {
    if (img.kind === 'existing') existingInOrder.push(img.url)
    else if (img.kind === 'new') newFilesInOrder.push(img.file)
  }

  // Let backend know which existing URLs to keep and in what order
  existingInOrder.forEach((url) => form.append('existingOrder[]', url))
  // Append new files (field name pictures)
  for (const f of newFilesInOrder) {
    form.append('pictures', f)
  }

  loading.value = true
  try {
    await axios.post('/api/users/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    router.push('/dashboard') // Redirect to dashboard or home
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to save profile'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
