const API_BASE_URL = 'http://localhost:8080/api/v1/booking-service'

export const bookingService = {
  async createBooking({ accountId, showtimeId, seatIds, foodIds, token }) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountId, showtimeId, seatIds, foodIds })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo đặt vé')
      }
      if (data?.code !== 1000) {
        throw new Error(data?.message || 'Tạo đặt vé thất bại')
      }
      return data
    } catch (error) {
      console.error('Create booking error:', error)
      throw error
    }
  }
  ,
  async getTicket({ bookingId, token }) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/booking-service/bookings/ticket/${encodeURIComponent(bookingId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy thông tin vé')
      }
      if (data?.code !== 1000) {
        throw new Error(data?.message || 'Lấy thông tin vé thất bại')
      }
      return data
    } catch (error) {
      console.error('Get ticket error:', error)
      throw error
    }
  }
}


