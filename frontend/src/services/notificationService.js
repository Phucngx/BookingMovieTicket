const API_BASE_URL = 'http://localhost:8080/api/v1/notification-service'

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken')
  if (token) return token
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.token
}

export const notificationService = {
  async getMyNotifications(accountId) {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/notifications/my-notifications/${encodeURIComponent(accountId)}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Không thể lấy danh sách thông báo')
    }
    return data
  }
  ,
  async sendNotification({ title, message }) {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/notifications/send-notification`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, message })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || 'Không thể gửi thông báo')
    }
    return data
  }
}


