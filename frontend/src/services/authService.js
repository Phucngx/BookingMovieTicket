const API_BASE_URL = 'http://localhost:8080/api/v1/user-service'

export const authService = {
  // Đăng nhập
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại')
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Lấy thông tin user hiện tại
  async getUserInfo() {
    try {
      const token = tokenUtils.getToken()
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin user')
      }

      return data
    } catch (error) {
      console.error('Get user info error:', error)
      throw error
    }
  },

  // Đăng ký
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          email: userData.email,
          phone: userData.phone
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại')
      }

      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }
}

// Utility functions for token management
export const tokenUtils = {
  // Lưu token vào localStorage
  setToken(token) {
    localStorage.setItem('accessToken', token)
  },

  // Lấy token từ localStorage
  getToken() {
    return localStorage.getItem('accessToken')
  },

  // Xóa token
  removeToken() {
    localStorage.removeItem('accessToken')
  },

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated() {
    return !!this.getToken()
  }
}
