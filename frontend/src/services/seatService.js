const API_BASE_URL = 'http://localhost:8080/api/v1/showtime-service'

export const seatService = {
  // Lấy layout và trạng thái ghế theo showtimeId
  async getSeatsByShowtimeId(showtimeId, token) {
    try {
      const url = `${API_BASE_URL}/showtimes/get-seats/${showtimeId}`
      console.log('Seat API URL:', url)
      console.log('Requested showtimeId:', showtimeId)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const data = await response.json()
      console.log('Seat API Response:', data)
      
      if (!response.ok) {
        console.error('API Error - Status:', response.status)
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để xem ghế')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy thông tin ghế cho suất chiếu này')
        }
        throw new Error(data.message || 'Không thể lấy thông tin ghế')
      }

      // Kiểm tra cấu trúc response
      if (data.code === 1000 && data.data) {
        console.log('API Success - Code:', data.code)
        console.log('Layout:', data.data.layout)
        console.log('Seats count:', data.data.seats.length)
        
        // Log một số ghế mẫu để debug
        if (data.data.seats.length > 0) {
          console.log('Sample seats:', data.data.seats.slice(0, 5).map(seat => ({
            seatId: seat.seatId,
            code: seat.code,
            seatType: seat.seatType,
            price: seat.price,
            status: seat.status
          })))
        }
      } else {
        console.error('Invalid API response structure:', data)
        throw new Error('Cấu trúc response không hợp lệ')
      }

      return data
    } catch (error) {
      console.error('=== Seat API Error ===')
      console.error('Error type:', error.name)
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      throw error
    }
  }
}
