import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Input, Button, Space, Avatar, Dropdown, message } from 'antd'
import { SearchOutlined, EnvironmentOutlined, QuestionCircleOutlined, UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons'
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

  // Khôi phục trạng thái đăng nhập khi component mount
  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  const onSearch = (value) => {
    console.log('Search:', value)
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

  const onMenuClick = (e) => {
    console.log('Menu clicked:', e.key)
    if (e.key === 'schedule') {
      navigate('/lich-chieu')
    } else if (e.key === 'booking') {
      navigate('/')
    } else if (e.key === 'theater-booking') {
      navigate('/mua-ve-theo-rap')
    } else if (e.key === 'community') {
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
    { key: 'august-2025', label: 'Phim tháng 08/2025' },
    { key: 'vietnamese', label: 'Phim Việt Nam' }
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
    { key: 'theater-booking', label: 'Mua vé theo rạp' },
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
    { key: 'cinemas', label: 'Rạp' },
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
        <div className="header-left">
          <Menu
            mode="horizontal"
            items={menuItems}
            className="header-menu"
            onClick={onMenuClick}
          />
        </div>
        
        <div className="header-right">
          <Search
            placeholder="Từ khóa tìm kiếm..."
            onSearch={onSearch}
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          
          <Space size="middle">
            <Button 
              type="text" 
              icon={<EnvironmentOutlined />} 
              className="header-icon-btn"
            />
            <Button 
              type="text" 
              icon={<QuestionCircleOutlined />} 
              className="header-icon-btn"
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
                    ...(userInfo?.roleName === 'ADMIN' ? [{
                      key: 'movie-management',
                      label: 'Quản lý phim',
                      icon: <UserOutlined />,
                      onClick: () => navigate('/quan-ly-phim')
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
