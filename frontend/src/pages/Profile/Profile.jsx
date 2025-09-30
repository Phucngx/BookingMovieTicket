import React from 'react'
import { Card, Descriptions, Avatar, Tag, Button, Space, Typography, Row, Col, Divider } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const { Title, Text } = Typography

const Profile = () => {
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const navigate = useNavigate()

  if (!isAuthenticated || !userInfo) {
    return (
      <div className="profile-container">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={3}>Vui lòng đăng nhập để xem thông tin tài khoản</Title>
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Title level={2}>Thông tin tài khoản</Title>
        <Text type="secondary">Quản lý thông tin cá nhân của bạn</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                Thông tin cá nhân
              </Space>
            }
            extra={
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            }
            className="profile-card"
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và tên">
                <Text strong>{userInfo.fullName}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Tên đăng nhập">
                <Text code>{userInfo.username}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email" icon={<MailOutlined />}>
                <Text>{userInfo.email}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại" icon={<PhoneOutlined />}>
                <Text>{userInfo.phone}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Địa chỉ" icon={<EnvironmentOutlined />}>
                <Text>{userInfo.address}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Avatar và thông tin tài khoản */}
        <Col xs={24} lg={8}>
          <Card className="profile-card">
            <div className="avatar-section">
              <Avatar 
                size={120} 
                src={userInfo.avatarUrl}
                icon={<UserOutlined />}
                className="profile-avatar"
              />
              <Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>
                {userInfo.fullName}
              </Title>
              <Tag color="blue" className="role-tag">
                {userInfo.roleName}
              </Tag>
            </div>

            <Divider />

            <div className="account-info">
              <Title level={5}>Thông tin tài khoản</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div className="info-item">
                  <Text type="secondary">ID Tài khoản:</Text>
                  <Text strong>{userInfo.accountId}</Text>
                </div>
                <div className="info-item">
                  <Text type="secondary">ID Người dùng:</Text>
                  <Text strong>{userInfo.userId}</Text>
                </div>
                <div className="info-item">
                  <Text type="secondary">Trạng thái:</Text>
                  <Tag color={userInfo.status === 1 ? 'green' : 'red'}>
                    {userInfo.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </div>
              </Space>
            </div>

            <Divider />

            <div className="action-buttons">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  block
                  className="action-btn"
                >
                  Chỉnh sửa thông tin
                </Button>
                <Button 
                  icon={<LockOutlined />} 
                  block
                  className="action-btn"
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Thông tin bảo mật */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <LockOutlined />
                Bảo mật tài khoản
              </Space>
            }
            className="profile-card"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="security-item">
                  <Title level={5}>Mật khẩu</Title>
                  <Text type="secondary">Đã được thiết lập</Text>
                  <br />
                  <Button type="link" size="small">
                    Đổi mật khẩu
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="security-item">
                  <Title level={5}>Xác thực 2 bước</Title>
                  <Text type="secondary">Chưa bật</Text>
                  <br />
                  <Button type="link" size="small">
                    Bật xác thực 2 bước
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="security-item">
                  <Title level={5}>Phiên đăng nhập</Title>
                  <Text type="secondary">Đang hoạt động</Text>
                  <br />
                  <Button type="link" size="small">
                    Quản lý phiên
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile
