import axios from 'axios'

const API_BASE_URL = '/api/users'

const userService = {
  // Fetch all users
  async getUsers() {
    const response = await axios.get(API_BASE_URL)
    return response.data
  },

  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password })
    return response.data
  },

  // Create a new user
  async createUser(userData: string) {
    const response = await axios.post(API_BASE_URL, userData)
    return response.data
  },

  async createProfile(userId: string, profileData: any) {
    const response = await axios.post(`${API_BASE_URL}/${userId}/profile`, profileData)
    return response.data
  },

  // Update an existing user
  async updateProfile(userId: string, profileData: any) {
    const response = await axios.put(`${API_BASE_URL}/${userId}/profile`, profileData)
    return response.data
  },
}

export default userService
