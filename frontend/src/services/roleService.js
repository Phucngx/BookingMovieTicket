const API_BASE_URL = 'http://localhost:8080/api/v1/user-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const roleService = {
  // Lấy danh sách tất cả roles
  async getAllRoles({ page = 1, size = 10 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/roles/get-all?page=${page}&size=${size}`
      
      console.log('Get all roles URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get all roles response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách roles')
      }

      return data
    } catch (error) {
      console.error('Get all roles error:', error)
      throw error
    }
  }
}
