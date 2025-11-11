import React, { useState } from 'react'
import { Card, Descriptions, Avatar, Tag, Button, Space, Typography, Row, Col, Divider, Modal, Form, Input, message } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/userService'
import { authService } from '../../services/authService'
import { fetchUserInfo } from '../../store/slices/userSlice'
import { sendOtpStart, sendOtpSuccess, sendOtpFailure, resetOtp } from '../../store/slices/otpSlice'
import { otpService } from '../../services/otpService'
import OtpModal from '../../components/OtpModal'
import './Profile.css'

const { Title, Text } = Typography

const Profile = () => {
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form] = Form.useForm()
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [passwordForm] = Form.useForm()
  const [isOtpOpen, setIsOtpOpen] = useState(false)
  const [pendingPasswordData, setPendingPasswordData] = useState(null)

  const openEdit = () => {
    form.setFieldsValue({
      fullName: userInfo?.fullName,
      email: userInfo?.email,
      phone: userInfo?.phone,
      address: userInfo?.address,
      avatarUrl: userInfo?.avatarUrl,
    })
    setIsEditOpen(true)
  }

  const handleEditCancel = () => {
    setIsEditOpen(false)
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        avatarUrl: values.avatarUrl,
      }
      await userService.updateUser(userInfo.userId, payload)
      message.success('Cập nhật thông tin thành công')
      setIsEditOpen(false)
      await dispatch(fetchUserInfo())
    } catch (error) {
      if (error?.errorFields) return
      message.error(error?.message || 'Cập nhật thất bại')
    }
  }

  const openChangePassword = () => {
    passwordForm.resetFields()
    setIsPasswordOpen(true)
  }

  const handlePasswordCancel = () => {
    setIsPasswordOpen(false)
  }

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (values.oldPassword === values.newPassword) {
        message.error('Mật khẩu mới không được trùng với mật khẩu cũ')
        return
      }
      
      // Validate old password with backend (login attempt)
      try {
        await authService.login(userInfo.username, values.oldPassword)
      } catch (e) {
        message.error('Mật khẩu hiện tại không chính xác')
        return
      }

      // Lưu thông tin mật khẩu để sử dụng sau khi xác thực OTP
      setPendingPasswordData({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })

      // Gửi OTP trước khi đổi mật khẩu
      await handleSendOtp()
      
    } catch (error) {
      if (error?.errorFields) return
      message.error(error?.message || 'Đổi mật khẩu thất bại')
    }
  }

  const handleSendOtp = async () => {
    try {
      dispatch(sendOtpStart())
      const data = await otpService.sendOtp(userInfo.email, userInfo.fullName)
      dispatch(sendOtpSuccess(data))
      
      // Đóng modal đổi mật khẩu và mở modal OTP
      setIsPasswordOpen(false)
      setIsOtpOpen(true)
      
      message.success('OTP đã được gửi đến email của bạn')
    } catch (error) {
      dispatch(sendOtpFailure(error.message))
      message.error(error.message || 'Không thể gửi OTP')
    }
  }

  const handleOtpSuccess = async () => {
    // Đóng popup OTP ngay khi xác thực thành công, không hiển thị toast thành công
    setIsOtpOpen(false)
    try {
      if (pendingPasswordData) {
        await userService.updatePassword(userInfo.accountId, pendingPasswordData)
        // Hiển thị thông báo đổi mật khẩu thành công và đảm bảo đóng mọi popup
        message.success('Đổi mật khẩu thành công')
        setPendingPasswordData(null)
        dispatch(resetOtp())
        setIsPasswordOpen(false)
      }
    } catch (error) {
      message.error(error?.message || 'Đổi mật khẩu thất bại')
    }
  }

  const handleOtpCancel = () => {
    setPendingPasswordData(null)
    dispatch(resetOtp())
    setIsOtpOpen(false)
  }

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
              <Space>
                <Button icon={<LockOutlined />} onClick={openChangePassword}>
                  Đổi mật khẩu
                </Button>
                <Button type="primary" icon={<EditOutlined />} onClick={openEdit}>
                  Chỉnh sửa
                </Button>
              </Space>
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
          <Card className="profile-card profile-side-card">
            <div className="avatar-section">
              <Avatar 
                size={96} 
                src={userInfo.avatarUrl}
                icon={<UserOutlined />}
                className="profile-avatar"
              />
              <Title level={5} style={{ marginTop: '12px', marginBottom: '6px' }}>
                {userInfo.fullName}
              </Title>
              <Tag color="blue" className="role-tag">
                {userInfo.roleName}
              </Tag>
            </div>

            <Divider />

            <div className="account-info">
              <Title level={5} style={{ marginBottom: 8 }}>Thông tin tài khoản</Title>
              <Space direction="vertical" size={6} style={{ width: '100%' }}>
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

            {/* <div className="action-buttons">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
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
                  onClick={openChangePassword}
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </div> */}

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
                  <Button type="link" size="small" onClick={openChangePassword}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="security-item">
                  <Title level={5}>Xác thực 2 bước</Title>
                  <Text type="secondary">Tính năng sắp ra mắt</Text>
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

      <Modal
        title="Chỉnh sửa thông tin"
        open={isEditOpen}
        onOk={handleEditSubmit}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}> 
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Avatar URL">
            <Input placeholder="Dán link ảnh avatar" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        open={isPasswordOpen}
        onOk={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form layout="vertical" form={passwordForm}>
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>

      {/* OTP Modal */}
      <OtpModal
        visible={isOtpOpen}
        onCancel={handleOtpCancel}
        onSuccess={handleOtpSuccess}
        email={userInfo?.email}
        fullName={userInfo?.fullName}
      />
    </div>
  )
}

export default Profile
