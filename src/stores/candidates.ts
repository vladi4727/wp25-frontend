import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE

export const useCandidates = defineStore('candidates', {
  state: () => ({
    list: [] as any[],
  }),
  actions: {
    async fetch() {
      const { data } = await axios.get(`${API_BASE}/users/candidates`)
      this.list = data || []
    },
    remove(id: string) {
      this.list = this.list.filter((x: any) => x.userId !== id)
    },
  },
})
