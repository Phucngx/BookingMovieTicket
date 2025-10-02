const API_BASE_URL = 'http://localhost:8080/api/v1/booking-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const bookingService = {
  // Lấy danh sách tất cả bookings (cần token admin)
  async getAllBookings({ page = 1, size = 10 } = {}) {
    try {
      const token = getAuthToken()
      const url = `${API_BASE_URL}/bookings/get-all?page=${page}&size=${size}`
      
      console.log('Get all bookings URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Get all bookings response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách đặt vé')
      }

      return data
    } catch (error) {
      console.error('Get all bookings error:', error)
      throw error
    }
  },

  // Lấy danh sách vé của user hiện tại
  async getMyTickets({ accountId, period = 'month', page = 1, size = 10, token } = {}) {
    try {
      const authToken = token || getAuthToken()
      
      // Sử dụng đúng endpoint format: /bookings/get-my-ticket/{accountId}?period=year&page=1&size=10
      if (!accountId) {
        throw new Error('Account ID is required to get user tickets')
      }
      
      const url = `${API_BASE_URL}/bookings/get-my-ticket/${accountId}?period=${period}&page=${page}&size=${size}`
      
      console.log('Get my tickets URL:', url)
      console.log('Account ID:', accountId, 'Period:', period)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()
      console.log('Get my tickets response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách vé của bạn')
      }

      return data
    } catch (error) {
      console.error('Get my tickets error:', error)
      throw error
    }
  },

  // Lấy thông tin vé theo booking ID
  async getTicket({ bookingId, token } = {}) {
    try {
      const authToken = token || getAuthToken()
      const url = `${API_BASE_URL}/bookings/ticket/${bookingId}`
      
      console.log('Get ticket URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()
      console.log('Get ticket response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin vé')
      }

      return data
    } catch (error) {
      console.error('Get ticket error:', error)
      throw error
    }
  },

  // Tạo booking mới
  async createBooking({ accountId, showtimeId, seatIds, foodIds = [], token } = {}) {
    try {
      const authToken = token || getAuthToken()
      const url = `${API_BASE_URL}/bookings/create`
      
      const requestBody = {
        accountId,
        showtimeId,
        seatIds,
        foodIds
      }
      
      console.log('Create booking URL:', url)
      console.log('Create booking request:', requestBody)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Create booking response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo đặt vé')
      }

      return data
    } catch (error) {
      console.error('Create booking error:', error)
      throw error
    }
  }
}