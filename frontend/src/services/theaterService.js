const API_BASE_URL = 'http://localhost:8080/api/v1/theater-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const theaterService = {
  // Lấy danh sách rạp theo thành phố (không cần đăng nhập)
  async getTheaters(city) {
    try {
      const url = `${API_BASE_URL}/theaters/get-theaters?city=${encodeURIComponent(city)}`
      console.log('Theater API URL:', url)
      console.log('Requested city:', city)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      console.log('Theater API Response:', data)
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Không có dữ liệu rạp cho thành phố "${city}". Vui lòng thử thành phố khác.`)
        }
        throw new Error(data.message || 'Không thể lấy danh sách rạp')
      }

      // Log the actual theaters returned
      if (data.data && data.data.length > 0) {
        console.log('Returned theaters:', data.data.map(t => ({ 
          name: t.theaterName, 
          city: t.city, 
          district: t.district 
        })))
      }

      return data
    } catch (error) {
      console.error('Get theaters error:', error)
      throw error
    }
  },

  // Lấy tất cả rạp phim (cần token admin)
  async getAllTheaters({ page = 1, size = 20 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/theaters/get-all?page=${page}&size=${size}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách rạp phim')
      }

      return data
    } catch (error) {
      console.error('Get all theaters error:', error)
      throw error
    }
  },

  // Lấy thông tin rạp theo ID (cần token)
  async getTheaterById(theaterId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/theaters/get-detail/${theaterId}`
      
      console.log('Get theater by ID URL:', url)
      console.log('Theater ID:', theaterId)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get theater by ID response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin rạp phim')
      }

      // Kiểm tra response format
      if (data.code === 1000 && data.data) {
        console.log('Theater data:', data.data)
        return data
      } else {
        throw new Error('Format response không đúng')
      }
    } catch (error) {
      console.error('Get theater by ID error:', error)
      throw error
    }
  },

  // Tạo rạp phim mới (cần token admin)
  async createTheater(theaterData) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/theaters/create`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theaterData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo rạp phim mới')
      }

      return data
    } catch (error) {
      console.error('Create theater error:', error)
      throw error
    }
  },

  // Cập nhật thông tin rạp phim (cần token admin)
  async updateTheater(theaterId, theaterData) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/theaters/update/${theaterId}`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theaterData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông tin rạp phim')
      }

      return data
    } catch (error) {
      console.error('Update theater error:', error)
      throw error
    }
  },

  // Xóa rạp phim (cần token admin)
  async deleteTheater(theaterId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/theaters/delete/${theaterId}`
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể xóa rạp phim')
      }

      return { success: true }
    } catch (error) {
      console.error('Delete theater error:', error)
      throw error
    }
  },

  // Lấy danh sách phòng chiếu của rạp (cần token)
  async getTheaterRooms(theaterId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/rooms/get-rooms/${theaterId}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phòng chiếu')
      }

      return data
    } catch (error) {
      console.error('Get theater rooms error:', error)
      throw error
    }
  },

  // Tạo phòng chiếu mới (cần token admin)
  async createRoom({ roomName, screenType, soundSystem, theaterId }) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/rooms/create`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomName, screenType, soundSystem, theaterId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo phòng chiếu mới')
      }

      return data
    } catch (error) {
      console.error('Create room error:', error)
      throw error
    }
  },

  // Cập nhật phòng chiếu (cần token admin)
  async updateRoom(roomId, { roomName, screenType, soundSystem, theaterId }) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/rooms/update/${roomId}`

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomName, screenType, soundSystem, theaterId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật phòng chiếu')
      }

      return data
    } catch (error) {
      console.error('Update room error:', error)
      throw error
    }
  },

  // Xóa phòng chiếu (cần token admin)
  async deleteRoom(roomId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/rooms/delete/${roomId}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể xóa phòng chiếu')
      }

      return { success: true }
    } catch (error) {
      console.error('Delete room error:', error)
      throw error
    }
  },

  // Lấy danh sách bắp nước (cần token)
  async getFoods({ page = 1, size = 20, token }) {
    try {
      const url = `${API_BASE_URL}/foods/get-all?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách bắp nước')
      }

      return data
    } catch (error) {
      console.error('Get foods error:', error)
      throw error
    }
  },

  // Lấy danh sách phòng theo theaterId
  async getRoomsByTheaterId(theaterId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/rooms/get-rooms/${theaterId}`
      
      console.log('Get rooms by theater ID URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get rooms by theater ID response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phòng')
      }

      return data
    } catch (error) {
      console.error('Get rooms by theater ID error:', error)
      throw error
    }
  }
}