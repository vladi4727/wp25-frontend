<template>
  <div class="relative overflow-hidden bg-[#0b0d12] text-white">
    <!-- Animated gradient blobs background -->

    <div class="relative z-10 mx-auto flex items-center px-4">
      <div class="w-full flex flex-col justify-center gap-[12px] items-center min-h-screen">
        <div class="order-1 md:order-2 w-lg">
          <div
            class="relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8 flex flex-col justify-center gap-[12px]"
            style="box-shadow: var(--glass-shadow)"
          >
            <div
              class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"
            ></div>

            <!-- Logo + title -->
            <div class="mb-6 flex items-center gap-[12px]">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
              >
                <span class="text-xl font-bold">T</span>
              </div>
              <div>
                <div class="text-lg font-semibold tracking-tight">Create account</div>
                <div class="text-xs text-white/60">Join Twinder in seconds</div>
              </div>
            </div>

            <!-- Form -->
            <form
              @submit.prevent="onSubmit"
              class="space-y-4 flex flex-col justify-center gap-[12px]"
            >
              <div>
                <label class="mb-1 block text-xs text-white/70">Email</label>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
                  autocomplete="email"
                />
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs text-white/70">Password</label>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
                    autocomplete="new-password"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-white/70">Confirm password</label>
                  <input
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
                    autocomplete="new-password"
                  />
                </div>
              </div>

              <button
                type="button"
                class="text-xs text-white/60 hover:text-white/80"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }} passwords
              </button>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
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
                <span>{{ loading ? 'Creating…' : 'Create account' }}</span>
              </button>

              <p v-if="error" class="text-center text-xs text-red-400">{{ error }}</p>
              <p v-if="success" class="text-center text-xs text-emerald-400">
                Account created! Redirecting…
              </p>

              <p class="mt-2 text-center text-xs text-white/60">
                Already have an account?
                <router-link
                  to="/"
                  class="text-pink-300 hover:text-pink-200 underline underline-offset-2 rounded-sm"
                >
                  Sign in
                </router-link>
              </p>
            </form>
          </div>

          <p class="mt-4 text-center text-white/50 text-xs">
            © {{ new Date().getFullYear() }} Twinder
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

import axios from 'axios'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = false

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post('/api/users', {
      email: email.value.trim().toLowerCase(),
      password: password.value,
    })

    // If backend returns a token directly:
    if (data?.token) {
      auth.setToken(data.token)
      localStorage.setItem('userId', data.userId)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      router.push('/createprofile')
      return
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>
