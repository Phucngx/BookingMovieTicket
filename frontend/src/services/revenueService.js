const API_BASE_URL = 'http://localhost:8080/api/v1/booking-service'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

export const revenueService = {
  // Lấy báo cáo doanh thu theo period
  async getRevenueReport(period = 'month') {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Không có token')
      }

      const url = `${API_BASE_URL}/bookings/report/revenue?period=${period}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy báo cáo doanh thu')
      }

      return data
    } catch (error) {
      console.error('Get revenue report error:', error)
      throw error
    }
  }
}
