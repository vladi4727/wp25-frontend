<template>
  <div class="relative overflow-hidden bg-[#0b0d12] text-white">
    <!-- Content -->
    <div class="relative z-10 mx-auto flex items-center px-4">
      <div class="w-full flex justify-center gap-8 md:grid-cols-2 min-h-screen items-center">
        <!-- Right: glassmorphism auth card -->
        <div class="order-1 md:order-2 w-lg">
          <div
            class="relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8 flex flex-col gap-[12px]"
            style="box-shadow: var(--glass-shadow)"
          >
            <!-- Decorative glass border highlight -->
            <div
              class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"
            ></div>

            <!-- Logo + title -->
            <div class="mb-6 flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
              >
                <span class="text-xl font-bold">T</span>
              </div>
              <div>
                <div class="text-lg font-semibold tracking-tight">Twinder</div>
                <div class="text-xs text-white/60">Find your next match</div>
              </div>
            </div>

            <!-- OAuth buttons -->
            <div class="space-y-3 flex flex-col gap-[12px]">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition"
                @click="continueWith('google')"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  class="h-5 w-5"
                />
                Continue with Google
              </button>
              <button
                type="button"
                class="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition"
                @click="continueWith('apple')"
              >
                <img
                  src="https://www.svgrepo.com/show/452210/apple.svg"
                  alt="Apple"
                  class="h-5 w-5 invert"
                />
                Continue with Apple
              </button>
            </div>

            <!-- Divider -->
            <div class="my-5 flex items-center gap-3">
              <div class="h-px flex-1 bg-white/10"></div>
              <div class="text-xs uppercase tracking-widest text-white/40">or</div>
              <div class="h-px flex-1 bg-white/10"></div>
            </div>

            <!-- Email/Password -->
            <form @submit.prevent="onSubmit" class="space-y-4 flex flex-col gap-[12px]">
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
              <div>
                <label class="mb-1 block text-xs text-white/70">Password</label>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/40"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="mt-1 text-xs text-white/60 hover:text-white/80"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }} password
                </button>
              </div>

              <router-link
                to="/createaccount"
                class="text-pink-300 hover:text-pink-200 underline underline-offset-2 w-fit rounded-sm"
              >
                Create account
              </router-link>

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
                <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
              </button>
            </form>

            <!-- Subtext -->
            <p class="mt-4 text-center text-xs text-white/50">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </div>

          <!-- Small footer -->
          <p class="mt-4 text-center text-white/50 text-xs">
            © {{ new Date().getFullYear() }} Twinder
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

import axios from 'axios'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

// Adjust to your backend
const API_BASE = import.meta.env.VITE_API_BASE || ''
function authEndpoint(provider) {
  return `${API_BASE}/auth/${provider}`
}

async function continueWith(provider) {
  // If using server-initiated OAuth, redirect:
  window.location.href = authEndpoint(provider)
}

async function onSubmit() {
  loading.value = true
  try {
    const res = await axios.post(`${API_BASE}/api/users/login`, {
      email: email.value,
      password: password.value,
    })
    const data = res.data
    // If using JWT in response:
    if (data.user.token) {
      auth.setToken(data.user.token)
      localStorage.setItem('userId', data.user.userId)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`

      if (data.user.hasProfile) {
        router.push('/dashboard') // Adjust to your home/feed route
        return
      }

      router.push('/createprofile') // Redirect to profile creation
    }

    // Navigate to home/feed
  } catch (e) {
    alert(e.message || 'Login error')
  } finally {
    loading.value = false
  }
}
</script>
