import { defineStore } from 'pinia'
import api from '@/lib/api'

// Simple candidate type used by the store
interface Candidate {
  userId: string
  profile: Record<string, unknown>
}

// Centralized store for swipe candidates
export const useCandidates = defineStore('candidates', {
  // Hold the list of candidates returned from the API
  state: () => ({
    list: [] as Candidate[],
  }),
  actions: {
    // Load fresh candidates from the backend
    async fetch() {
      const { data } = await api.get('/users/candidates')
      this.list = data || []
    },
    // Remove a candidate after swiping
    remove(id: string) {
      this.list = this.list.filter((x: Candidate) => x.userId !== id)
    },
  },
})
