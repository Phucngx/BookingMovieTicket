const API_BASE_URL = 'http://localhost:8080/api/v1/showtime-service'

export const showtimeService = {
  // Lấy lịch chiếu theo rạp và ngày (cần đăng nhập)
  async getShowtimesByDate(theaterId, date, token) {
    try {
      const url = `${API_BASE_URL}/showtimes/get-showtimes-by-date/${theaterId}?date=${date}`
      console.log('Showtime API URL:', url)
      console.log('Requested theaterId:', theaterId, 'date:', date)
      
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
      console.log('Showtime API Response:', data)
      
      if (!response.ok) {
        console.error('API Error - Status:', response.status)
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để xem lịch chiếu')
        }
        if (response.status === 400) {
          throw new Error(`Không có lịch chiếu cho rạp này vào ngày ${date}`)
        }
        throw new Error(data.message || 'Không thể lấy lịch chiếu')
      }

      // Kiểm tra cấu trúc response
      if (data.code === 1000 && data.data) {
        console.log('API Success - Code:', data.code)
        console.log('Showtimes count:', data.data.length)
        
        // Log the actual showtimes returned
        if (data.data.length > 0) {
          console.log('Returned showtimes:', data.data.map(item => ({
            movie: {
              id: item.movie.id,
              title: item.movie.title,
              posterUrl: item.movie.posterUrl,
              genres: item.movie.genres,
              duration: item.movie.durationMinutes
            },
            showtimesCount: item.showtimes.length,
            showtimes: item.showtimes.map(st => ({
              id: st.id,
              time: st.time,
              price: st.price,
              roomId: st.roomId
            }))
          })))
        } else {
          console.log('No showtimes found for theater:', theaterId, 'date:', date)
        }
      } else {
        console.error('Invalid API response structure:', data)
        throw new Error('Cấu trúc response không hợp lệ')
      }

      return data
    } catch (error) {
      console.error('=== Showtime API Error ===')
      console.error('Error type:', error.name)
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      throw error
    }
  },

  // Lấy lịch chiếu theo rạp + phim + ngày (flow chọn từ trang chi tiết phim)
  async getShowtimesByTheaterMovieDate(theaterId, movieId, date, token) {
    try {
      const url = `${API_BASE_URL}/showtimes/get-showtimes/theaters/${theaterId}/movies/${movieId}?date=${date}`
      console.log('Showtime API (by theater+movie+date) URL:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('Showtime API (by theater+movie+date) Response:', data)

      if (!response.ok) {
        if (response.status === 401) throw new Error('Vui lòng đăng nhập để xem lịch chiếu')
        if (response.status === 400) throw new Error(`Không có lịch chiếu cho rạp/phim này vào ngày ${date}`)
        throw new Error(data.message || 'Không thể lấy lịch chiếu theo phim')
      }

      if (data.code === 1000 && Array.isArray(data.data)) {
        return data
      }

      throw new Error('Cấu trúc response không hợp lệ')
    } catch (error) {
      console.error('=== Showtime API (by theater+movie+date) Error ===', error)
      throw error
    }
  }
}