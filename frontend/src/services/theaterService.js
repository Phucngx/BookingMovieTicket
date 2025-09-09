const API_BASE_URL = 'http://localhost:8083/theater-service'

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
  }
}