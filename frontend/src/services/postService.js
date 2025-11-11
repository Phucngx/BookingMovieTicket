const API_BASE_URL = 'http://localhost:8080/api/v1/post-service'

export const postService = {
  // Lấy tất cả bài viết (không cần đăng nhập)
  async getAll(page = 1, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/get-all?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Không thể lấy danh sách bài viết')
      }
      return data
    } catch (error) {
      console.error('Get posts error:', error)
      throw error
    }
  },

  // Tạo bài viết mới (cần đăng nhập - bearer token)
  async create(content) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Bạn cần đăng nhập để đăng bài')
      }

      const response = await fetch(`${API_BASE_URL}/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Không thể tạo bài viết')
      }

      return data
    } catch (error) {
      console.error('Create post error:', error)
      throw error
    }
  },

  // Lấy bài viết của tôi (cần đăng nhập)
  async getMyPosts(page = 1, size = 10) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Bạn cần đăng nhập')
      }

      const response = await fetch(`${API_BASE_URL}/posts/get-my-posts?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Không thể lấy bài viết của bạn')
      }

      return data
    } catch (error) {
      console.error('Get my posts error:', error)
      throw error
    }
  },

  // Tạo comment mới cho bài viết (cần đăng nhập)
  async createComment(postId, text) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Bạn cần đăng nhập để bình luận')
      }
      const response = await fetch(`${API_BASE_URL}/comments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, text })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Không thể tạo bình luận')
      }
      return data
    } catch (error) {
      console.error('Create comment error:', error)
      throw error
    }
  },

  // Tạo reply cho comment (cần đăng nhập)
  async createReply(commentId, text) {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Bạn cần đăng nhập để phản hồi')
      }
      const response = await fetch(`${API_BASE_URL}/replies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ commentId, text })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Không thể tạo phản hồi')
      }
      return data
    } catch (error) {
      console.error('Create reply error:', error)
      throw error
    }
  }
}


