import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Input, Button, Space, Avatar, Dropdown, message, Badge, List, Tabs, Spin, Popover } from 'antd'
import { SearchOutlined, EnvironmentOutlined, QuestionCircleOutlined, UserOutlined, DownOutlined, LogoutOutlined, ShakeOutlined, BellOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from '../AuthModal/AuthModal'
import { logout, restoreAuth } from '../../store/slices/userSlice'
import './Header.css'

const { Header: AntHeader } = Layout
const { Search } = Input

const Header = () => {
  const [moviesDropdownOpen, setMoviesDropdownOpen] = useState(false)
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false)
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Lấy state từ Redux
  const { isAuthenticated, userInfo, loading } = useSelector(state => state.user)
  const { unreadCount, items, loading: notifLoading } = useSelector(state => state.notification || { unreadCount: 0, items: [], loading: false })
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifTab, setNotifTab] = useState('all')

  // Khôi phục trạng thái đăng nhập khi component mount
  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleAvatarClick = () => {
    setAuthModalVisible(true)
  }

  const handleAuthModalCancel = () => {
    setAuthModalVisible(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    message.success('Đăng xuất thành công!')
    navigate('/')
  }

  const openNotifications = async () => {
    if (!isAuthenticated) {
      message.info('Vui lòng đăng nhập để xem thông báo')
      setAuthModalVisible(true)
      return
    }
    setNotifOpen(true)
  }

  const onMenuClick = (e) => {
    console.log('Menu clicked:', e.key)
    if (e.key === 'schedule') {
      navigate('/lich-chieu')
    } else if (e.key === 'booking') {
      navigate('/')
    }  else if (e.key === 'community') {
      navigate('/community')
    }
  }

  const onMoviesMenuClick = (e) => {
    console.log('Movies menu clicked:', e.key)
    setMoviesDropdownOpen(false)
    
    // Navigate based on movie filter selection
    switch(e.key) {
      case 'now-showing':
        navigate('/dang-chieu')
        break
      case 'coming-soon':
        navigate('/sap-chieu')
        break
      case 'early-show':
        navigate('/chieu-som')
        break
      default:
        navigate('/dang-chieu')
    }
  }

  const onNewsMenuClick = (e) => {
    console.log('News menu clicked:', e.key)
    setNewsDropdownOpen(false)
    
    // Navigate based on news category selection
    switch(e.key) {
      case 'movie-news':
        navigate('/tin-dien-anh')
        break
      case 'movie-reviews':
        navigate('/danh-gia-phim')
        break
      case 'video':
        navigate('/video')
        break
      case 'topics':
        navigate('/chuyen-de')
        break
      case 'cinematic-universe':
        navigate('/vu-tru-dien-anh')
        break
      case 'tv-series':
        navigate('/tv-series')
        break
      default:
        navigate('/tin-tuc')
    }
  }

  const moviesMenuItems = [
    { key: 'now-showing', label: 'Đang chiếu' },
    { key: 'coming-soon', label: 'Sắp chiếu' },
    { key: 'early-show', label: 'Chiếu sớm' },
    // { key: 'august-2025', label: 'Phim tháng 08/2025' },
    // { key: 'vietnamese', label: 'Phim Việt Nam' }
  ]

  const newsMenuItems = [
    { key: 'movie-news', label: 'Tin điện ảnh' },
    { key: 'movie-reviews', label: 'Đánh giá phim' },
    { key: 'video', label: 'Video' },
    { 
      key: 'topics', 
      label: (
        <div className="news-menu-item-with-arrow">
          Chuyên đề
          <span className="news-arrow-right">›</span>
        </div>
      )
    },
    { 
      key: 'cinematic-universe', 
      label: (
        <div className="news-menu-item-with-arrow">
          Vũ trụ điện ảnh
          <span className="news-arrow-right">›</span>
        </div>
      )
    },
    { key: 'tv-series', label: 'TV Series' }
  ]

  const menuItems = [
    { key: 'booking', label: 'Đặt vé phim chiếu rạp' },
    { key: 'schedule', label: 'Lịch chiếu' },
    { 
      key: 'movies', 
      label: (
        <Dropdown
          menu={{ 
            items: moviesMenuItems,
            onClick: onMoviesMenuClick
          }}
          open={moviesDropdownOpen}
          onOpenChange={setMoviesDropdownOpen}
          placement="bottomLeft"
          trigger={['click']}
        >
          <div className="movies-dropdown-trigger">
            Phim
            <DownOutlined className={`movies-arrow ${moviesDropdownOpen ? 'rotate' : ''}`} />
          </div>
        </Dropdown>
      )
    },
    { 
      key: 'news', 
      label: (
        <Dropdown
          menu={{ 
            items: newsMenuItems,
            onClick: onNewsMenuClick
          }}
          open={newsDropdownOpen}
          onOpenChange={setNewsDropdownOpen}
          placement="bottomLeft"
          trigger={['click']}
        >
          <div className="news-dropdown-trigger">
            Tin tức
            <DownOutlined className={`news-arrow ${newsDropdownOpen ? 'rotate' : ''}`} />
          </div>
        </Dropdown>
      )
    },
    { key: 'community', label: 'Cộng đồng' }
  ]
  

  return (
    <AntHeader className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="header-logo">
          <div className="logo-container" onClick={() => navigate('/')}>
            <div className="logo-placeholder">
              {/* Placeholder for logo image - replace with actual logo */}
              <div className="logo-text">CinemaGo</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="header-nav">
          <Menu
            mode="horizontal"
            items={menuItems}
            className="header-menu"
            onClick={onMenuClick}
          />
        </div>
        
        {/* Search and User Actions */}
        <div className="header-actions">
          <Search
            placeholder="Tìm kiếm phim..."
            onSearch={onSearch}
            className="header-search"
            enterButton={<SearchOutlined />}
          />
          
          <Space size="middle" className="header-user-actions">
            <Popover
              open={notifOpen}
              onOpenChange={async (open) => {
                if (open) {
                  if (!isAuthenticated) return openNotifications()
                  try {
                    const accountId = userInfo?.id || userInfo?.accountId
                    const { fetchMyNotifications, clearUnread } = await import('../../store/slices/notificationSlice')
                    await dispatch(fetchMyNotifications(accountId))
                    dispatch(clearUnread())
                  } catch (_) {}
                }
                setNotifOpen(open)
              }}
              trigger={["click"]}
              placement="bottomRight"
              overlayStyle={{ width: 360 }}
              content={
                <div style={{ width: 328 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Thông báo</div>
                  <Tabs
                    activeKey={notifTab}
                    onChange={setNotifTab}
                    items={[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'unread', label: 'Chưa đọc' },
                    ]}
                    size="small"
                  />
                  {notifLoading ? (
                    <div style={{ textAlign: 'center', padding: 16 }}><Spin size="small" /></div>
                  ) : (
                    <List
                      locale={{ emptyText: 'Chưa có thông báo' }}
                      dataSource={(items || []).filter(it => notifTab === 'all' ? true : it.read === false)}
                      renderItem={(item) => (
                        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                          <List.Item.Meta
                            avatar={<div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1677ff' }}>🎬</div>}
                            title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 600 }}>{item.title}</span>
                              {!item.read && <span style={{ width: 8, height: 8, background: '#1890ff', borderRadius: '50%', display: 'inline-block' }}></span>}
                            </div>}
                            description={<span style={{ color: '#595959' }}>{item.message}</span>}
                          />
                        </List.Item>
                      )}
                      style={{ maxHeight: 360, overflowY: 'auto' }}
                    />
                  )}
                </div>
              }
            >
              <Badge count={isAuthenticated ? unreadCount : 0} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="header-icon-btn"
                  title="Thông báo"
                  onClick={openNotifications}
                />
              </Badge>
            </Popover>
            <Button 
              type="text" 
              icon={<EnvironmentOutlined />} 
              className="header-icon-btn"
              title="Vị trí"
            />
            <Button 
              type="text" 
              icon={<QuestionCircleOutlined />} 
              className="header-icon-btn"
              title="Hỗ trợ"
            />
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      label: `Xin chào, ${userInfo?.fullName || userInfo?.username || 'User'}`,
                      disabled: true,
                      style: { color: '#666', fontWeight: 'bold' }
                    },
                    {
                      type: 'divider'
                    },
                    {
                      key: 'account',
                      label: 'Tài khoản của tôi',
                      icon: <UserOutlined />,
                      onClick: () => navigate('/tai-khoan')
                    },
                    {
                      key: 'my-tickets',
                      label: 'Vé đã mua',
                      icon: <ShakeOutlined />,
                      onClick: () => navigate('/ve-da-mua')
                    },
                    ...(userInfo?.roleName === 'ADMIN' ? [{
                      key: 'admin-dashboard',
                      label: 'Admin Dashboard',
                      icon: <UserOutlined />,
                      onClick: () => navigate('/admin/dashboard')
                    }] : []),
                    {
                      key: 'logout',
                      label: 'Đăng xuất',
                      icon: <LogoutOutlined />,
                      onClick: handleLogout
                    }
                  ]
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  className="header-avatar"
                  style={{ backgroundColor: '#52c41a' }}
                  src={userInfo?.avatarUrl}
                >
                  {(userInfo?.fullName || userInfo?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <Avatar 
                icon={<UserOutlined />} 
                className="header-avatar"
                onClick={handleAvatarClick}
              />
            )}
          </Space>
        </div>
      </div>
      
      <AuthModal 
        visible={authModalVisible}
        onCancel={handleAuthModalCancel}
      />

      
    </AntHeader>
  )
}

export default Header
