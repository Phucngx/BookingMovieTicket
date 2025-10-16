const API_BASE_URL = 'http://localhost:8080/api/v1/showtime-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const showtimeManagementService = {
  // Lấy danh sách tất cả suất chiếu với phân trang
  async getAllShowtimes({ page = 1, size = 10 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/get-all?page=${page}&size=${size}`
      
      console.log('Get all showtimes URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get all showtimes response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Get all showtimes error:', error)
      throw error
    }
  },

  // Tạo suất chiếu mới
  async createShowtime({ movieId, roomId, startTime, endTime, price, status = 'ACTIVE' } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/create`
      
      const requestBody = {
        movieId,
        roomId,
        startTime,
        endTime,
        price,
        status
      }
      
      console.log('Create showtime URL:', url)
      console.log('Create showtime request:', requestBody)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Create showtime response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Create showtime error:', error)
      throw error
    }
  },

  // Cập nhật suất chiếu
  async updateShowtime(showtimeId, { movieId, roomId, startTime, endTime, price, status } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/update/${showtimeId}`
      
      const requestBody = {
        movieId,
        roomId,
        startTime,
        endTime,
        price,
        status
      }
      
      console.log('Update showtime URL:', url)
      console.log('Update showtime request:', requestBody)
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Update showtime response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Update showtime error:', error)
      throw error
    }
  },

  // Xóa suất chiếu
  async deleteShowtime(showtimeId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/delete/${showtimeId}`
      
      console.log('Delete showtime URL:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Delete showtime response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Delete showtime error:', error)
      throw error
    }
  },

  // Lấy chi tiết suất chiếu
  async getShowtimeById(showtimeId) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/${showtimeId}`
      
      console.log('Get showtime by ID URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get showtime by ID response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Get showtime by ID error:', error)
      throw error
    }
  },

  // Lấy suất chiếu theo theater, movie và date
  async getShowtimesByTheaterMovieDate({ theaterId, movieId, date } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/showtimes/get-showtimes/theaters/${theaterId}/movies/${movieId}?date=${date}`
      
      console.log('Get showtimes by theater/movie/date URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get showtimes by theater/movie/date response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách suất chiếu')
      }

      return data
    } catch (error) {
      console.error('Get showtimes by theater/movie/date error:', error)
      throw error
    }
  }
}
