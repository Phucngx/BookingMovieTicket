const API_BASE_URL = 'http://localhost:8080/api/v1/showtime-service'

export const showtimeService = {
  // Lấy lịch chiếu theo rạp, phim và ngày 
  async getShowtimes(theaterId, movieId, date) {
    try {
      // const token = localStorage.getItem('accessToken')
      // if (!token) {
      //   throw new Error('Vui lòng đăng nhập để xem lịch chiếu')
      // }

      const url = `${API_BASE_URL}/showtimes/get-showtimes/theaters/${theaterId}/movies/${movieId}?date=${date}`
      console.log('API URL:', url)
      console.log('Request params:', { theaterId, movieId, date })

      const response = await fetch(url, {
        method: 'GET'
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json',
        // }
      })

      const data = await response.json()
      console.log('API Response:', data)
      
      if (!response.ok) {
        // Handle specific error cases
        if (data.message === 'SHOWTIME not found') {
          throw new Error('Không có lịch chiếu cho rạp này vào ngày được chọn')
        }
        throw new Error(data.message || 'Không thể lấy lịch chiếu')
      }

      return data
    } catch (error) {
      console.error('Get showtimes error:', error)
      throw error
    }
  }
}
