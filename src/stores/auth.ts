import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
  // put other fields if you need them: sub, email, etc.
}

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') as string | null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('jwt', token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('jwt')
    },
    isTokenValid(): boolean {
      if (!this.token) return false

      try {
        const decoded = jwtDecode<JwtPayload>(this.token)
        // exp is in seconds
        if (decoded.exp * 1000 < Date.now()) {
          this.logout()
          return false
        }
        return true
      } catch (err) {
        this.logout()
        return false
      }
    },
  },
})
