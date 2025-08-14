import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Input, Button, Space, Avatar, Dropdown } from 'antd'
import { SearchOutlined, EnvironmentOutlined, QuestionCircleOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import './Header.css'

const { Header: AntHeader } = Layout
const { Search } = Input

const Header = () => {
  const [moviesDropdownOpen, setMoviesDropdownOpen] = useState(false)
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const onSearch = (value) => {
    console.log('Search:', value)
  }

  const onMenuClick = (e) => {
    console.log('Menu clicked:', e.key)
    if (e.key === 'schedule') {
      navigate('/dang-chieu')
    } else if (e.key === 'booking') {
      navigate('/')
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
            <Avatar 
              icon={<UserOutlined />} 
              className="header-avatar"
            />
          </Space>
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
