<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import axios from 'axios'
import { useCandidates } from '@/stores/candidates'
import { useRouter } from 'vue-router'

const router = useRouter()
const candidates = useCandidates()

const gender = ref('any')
const ageMin = ref(18)
const ageMax = ref(100)
const distanceKm = ref(50)
const error = ref('')
const success = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE

onMounted(async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/users/me/preferences`)
    gender.value = data.gender || 'any'
    ageMin.value = data.ageMin ?? 18
    ageMax.value = data.ageMax ?? 100
    distanceKm.value = data.distanceKm ?? 50
  } catch (e) {
    // ignore
  }
})

async function save() {
  error.value = ''
  try {
    await axios.put(`${API_BASE}/users/me/preferences`, {
      gender: gender.value,
      ageMin: ageMin.value,
      ageMax: ageMax.value,
      distanceKm: distanceKm.value,
    })
    await candidates.fetch()
    success.value = true
    setTimeout(() => router.push('/dashboard'), 1000)
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message
  }
}
</script>

<template>
  <main>
    <Header />
    <div class="p-4 max-w-md mx-auto text-white">
      <h1 class="text-xl mb-4">Preferences</h1>
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block mb-1">Gender</label>
          <select v-model="gender" class="w-full text-black p-2 rounded">
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label class="block mb-1">Age Min</label>
          <input type="number" v-model.number="ageMin" class="w-full text-black p-2 rounded" />
        </div>
        <div>
          <label class="block mb-1">Age Max</label>
          <input type="number" v-model.number="ageMax" class="w-full text-black p-2 rounded" />
        </div>
        <div>
          <label class="block mb-1">Distance (km)</label>
          <input type="number" v-model.number="distanceKm" class="w-full text-black p-2 rounded" />
        </div>
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <p v-if="success" class="text-emerald-400 text-sm">Saved!</p>
        <button type="submit" class="mt-2 px-4 py-2 bg-pink-500 rounded text-white">Save</button>
      </form>
    </div>
  </main>
</template>
