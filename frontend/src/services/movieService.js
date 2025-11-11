const API_BASE_URL = 'http://localhost:8080/api/v1/movie-service'

export const movieService = {
  // Lấy danh sách phim (không cần đăng nhập)
  async getMovies(page = 1, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phim')
      }

      return data
    } catch (error) {
      console.error('Get movies error:', error)
      throw error
    }
  },

  // Lấy danh sách phim đang chiếu (không cần đăng nhập)
  async getNowShowing(page = 1, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/now-showing?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phim đang chiếu')
      }

      return data
    } catch (error) {
      console.error('Get now showing movies error:', error)
      throw error
    }
  },

  // Lấy danh sách phim sắp chiếu (không cần đăng nhập)
  async getComingSoon(page = 1, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/coming-soon?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phim sắp chiếu')
      }

      return data
    } catch (error) {
      console.error('Get coming soon movies error:', error)
      throw error
    }
  },

  // Cập nhật phim
  async updateMovie(movieId, movieData) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/movies/update/${movieId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật phim')
      }

      return data
    } catch (error) {
      console.error('Update movie error:', error)
      throw error
    }
  },

  // Tìm kiếm phim
  async searchMovies(title, page = 1, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/search?page=${page}&size=${size}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.code === 1000) {
        return {
          success: true,
          data: data.data
        }
      } else {
        throw new Error(data.message || 'Lỗi tìm kiếm phim')
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Lấy danh sách phim cho admin (cần đăng nhập)
  async getMoviesForAdmin(page = 1, size = 10) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/movies/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách phim')
      }

      return data
    } catch (error) {
      console.error('Get movies for admin error:', error)
      throw error
    }
  },

  // Tạo phim mới
  async createMovie(movieData) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/movies/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo phim')
      }

      return data
    } catch (error) {
      console.error('Create movie error:', error)
      throw error
    }
  },

  // Lấy danh sách thể loại
  async getGenres(page = 1, size = 100) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/genres/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách thể loại')
      }

      return data
    } catch (error) {
      console.error('Get genres error:', error)
      throw error
    }
  },

  // Lấy danh sách diễn viên
  async getActors(page = 1, size = 100) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/actors/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách diễn viên')
      }

      return data
    } catch (error) {
      console.error('Get actors error:', error)
      throw error
    }
  },

  // Lấy danh sách đạo diễn (giả sử có API này)
  async getDirectors(page = 1, size = 100) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/directors/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách đạo diễn')
      }

      return data
    } catch (error) {
      console.error('Get directors error:', error)
      throw error
    }
  },

  // Lấy chi tiết phim (cần đăng nhập)
  async getMovieDetails(movieId) {
    try {
      // const token = localStorage.getItem('accessToken')
      // if (!token) {
      //   throw new Error('Vui lòng đăng nhập để xem chi tiết phim')
      // }

      const response = await fetch(`${API_BASE_URL}/movies/get-details/${movieId}`, {
        method: 'GET'
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json',
        // }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy chi tiết phim')
      }

      return data
    } catch (error) {
      console.error('Get movie details error:', error)
      throw error
    }
  },

  // Xóa phim (cần token admin)
  async deleteMovie(movieId) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Không có token')
      }

      const response = await fetch(`${API_BASE_URL}/movies/delete/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Không thể xóa phim')
      }

      return { success: true }
    } catch (error) {
      console.error('Delete movie error:', error)
      throw error
    }
  }
}
