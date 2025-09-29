import React, { useState } from 'react'
import { Layout, Menu, Typography, Avatar, Dropdown, Button, Space } from 'antd'
import { 
  DashboardOutlined, 
  VideoCameraOutlined, 
  BankOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/userSlice'
import './AdminLayout.css'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const { userInfo } = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/movies',
      icon: <VideoCameraOutlined />,
      label: 'Quản lý phim',
    },
    {
      key: '/admin/theaters',
      icon: <BankOutlined />,
      label: 'Quản lý rạp phim',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      label: `Xin chào, ${userInfo?.fullName || userInfo?.username || 'Admin'}`,
      disabled: true,
      style: { color: '#666', fontWeight: 'bold' }
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout className="admin-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="admin-sider"
        width={250}
        collapsedWidth={80}
      >
        <div className="admin-logo">
          {collapsed ? (
            <div className="logo-collapsed">🎬</div>
          ) : (
            <div className="logo-full">
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                Trang quản trị viên
              </Title>
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="admin-menu"
        />
      </Sider>
      
      <Layout>
        <Header className="admin-header">
          <div className="admin-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
            />
            <Title level={4} style={{ margin: 0, color: '#262626' }}>
              {menuItems.find(item => item.key === location.pathname)?.label || 'Admin Panel'}
            </Title>
          </div>
          
          {/* <div className="admin-header-right">
            <Space>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  className="admin-avatar"
                  style={{ backgroundColor: '#52c41a' }}
                  src={userInfo?.avatarUrl}
                >
                  {(userInfo?.fullName || userInfo?.username || 'A').charAt(0).toUpperCase()}
                </Avatar>
              </Dropdown>
            </Space>
          </div> */}
        </Header>
        
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
