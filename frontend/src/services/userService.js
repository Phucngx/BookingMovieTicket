const API_BASE_URL = 'http://localhost:8080/api/v1/user-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const userService = {
  // Cập nhật thông tin người dùng theo userId
  async updateUser(userId, userData) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/users/update/${userId}`

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông tin người dùng')
      }

      return data
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },
  // Lấy danh sách tất cả tài khoản (cần token admin)
  async getAllAccounts({ page = 1, size = 10 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/get-all?page=${page}&size=${size}`
      
      console.log('Get all accounts URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get all accounts response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách tài khoản')
      }

      return data
    } catch (error) {
      console.error('Get all accounts error:', error)
      throw error
    }
  },

  // Lấy thông tin tài khoản theo ID (cần token)
  async getAccountById(accountId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/get-detail/${accountId}`
      
      console.log('Get account by ID URL:', url)
      console.log('Account ID:', accountId)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get account by ID response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin tài khoản')
      }

      // Kiểm tra response format
      if (data.code === 1000 && data.data) {
        console.log('Account data:', data.data)
        return data
      } else {
        throw new Error('Format response không đúng')
      }
    } catch (error) {
      console.error('Get account by ID error:', error)
      throw error
    }
  },

  // Tạo tài khoản mới (cần token admin)
  async createAccount(accountData) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/create`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accountData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo tài khoản mới')
      }

      return data
    } catch (error) {
      console.error('Create account error:', error)
      throw error
    }
  },

  // Cập nhật role của tài khoản (cần token admin)
  async updateAccountRole(accountId, roleId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/update/${accountId}`
      
      console.log('Update account role URL:', url)
      console.log('Request body:', { roleId })
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roleId })
      })

      const data = await response.json()
      console.log('Update account role response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật role tài khoản')
      }

      return data
    } catch (error) {
      console.error('Update account role error:', error)
      throw error
    }
  },

  // Xóa tài khoản (cần token admin)
  async deleteAccount(accountId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/delete/${accountId}`
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể xóa tài khoản')
      }

      return { success: true }
    } catch (error) {
      console.error('Delete account error:', error)
      throw error
    }
  },

  // Tìm kiếm tài khoản theo tên hoặc role
  async searchAccounts({ searchTerm = '', page = 1, size = 10 } = {}) {
    try {
      const token = getAuthToken()
      let url = `${API_BASE_URL}/accounts/search?page=${page}&size=${size}`
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      
      console.log('Search accounts URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Search accounts response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tìm kiếm tài khoản')
      }

      return data
    } catch (error) {
      console.error('Search accounts error:', error)
      throw error
    }
  },

  // Thay đổi trạng thái tài khoản (kích hoạt/vô hiệu hóa)
  async updateAccountStatus(accountId, status) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/update-status/${accountId}`
      
      console.log('Update account status URL:', url)
      console.log('Request body:', { status })
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      console.log('Update account status response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể thay đổi trạng thái tài khoản')
      }

      return data
    } catch (error) {
      console.error('Update account status error:', error)
      throw error
    }
  }
  ,
  // Đổi mật khẩu tài khoản (cần token)
  async updatePassword(accountId, { oldPassword, newPassword }) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/accounts/update-password/${accountId}`

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đổi mật khẩu')
      }

      return data
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }
}
