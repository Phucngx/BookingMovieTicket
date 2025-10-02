import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Descriptions, 
  Divider,
  Modal,
  message,
  Spin,
  Alert,
  Switch
} from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAccountById, deleteAccount, updateAccountStatus } from '../../store/slices/userManagementSlice'
import './AccountDetail.css'

const { Title, Text, Paragraph } = Typography

const AccountDetail = () => {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentAccount, loading, error } = useSelector(state => state.accountManagement)
  const { userInfo } = useSelector(state => state.user)
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const isAdmin = userInfo?.roleName === 'ADMIN'

  useEffect(() => {
    if (accountId) {
      console.log('AccountDetail: Fetching account with ID:', accountId)
      dispatch(fetchAccountById(accountId))
    }
  }, [accountId, dispatch])

  const handleEdit = () => {
    navigate(`/admin/accounts/${accountId}/edit`)
  }

  const handleDelete = () => {
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    try {
      await dispatch(deleteAccount(accountId)).unwrap()
      message.success('Xóa tài khoản thành công!')
      navigate('/admin/users')
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa tài khoản')
    } finally {
      setDeleteModalVisible(false)
    }
  }

  const handleStatusChange = async (checked) => {
    try {
      console.log('Changing status for account:', accountId, 'to:', checked ? 1 : 0)
      await dispatch(updateAccountStatus({ 
        accountId: parseInt(accountId), 
        status: checked ? 1 : 0 
      })).unwrap()
      message.success(`Tài khoản "${currentAccount.username}" đã được ${checked ? 'kích hoạt' : 'vô hiệu hóa'}`)
    } catch (error) {
      console.error('Status change error:', error)
      message.error('Có lỗi xảy ra khi thay đổi trạng thái tài khoản')
    }
  }

  const handleBack = () => {
    navigate('/admin/users')
  }

  if (loading) {
    return (
      <div className="account-detail-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Đang tải thông tin tài khoản...</Text>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="account-detail-container">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/admin/users')}>
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  if (!currentAccount) {
    return (
      <div className="account-detail-container">
        <Alert
          message="Không tìm thấy tài khoản"
          description="Tài khoản bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/admin/users')}>
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="account-detail-container">
      <div className="account-detail-header">
        <div className="account-detail-title">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginRight: '16px' }}
          >
            Quay lại
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentAccount.user?.fullName || 'N/A'}
            </Title>
            <Text type="secondary">Thông tin chi tiết tài khoản</Text>
          </div>
        </div>
        
        {isAdmin && (
          <Space>
            {/* <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button> */}
            {/* <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={currentAccount.roleName === 'ADMIN'}
            >
              Xóa tài khoản
            </Button> */}
          </Space>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin tài khoản */}
        <Col span={24}>
          <Card title="Thông tin tài khoản" className="account-info-card">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên đăng nhập" span={2}>
                <Text strong>{currentAccount.username}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="ID tài khoản">
                <Text code>{currentAccount.accountId}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Vai trò">
                <Tag color={currentAccount.roleName === 'ADMIN' ? 'red' : 'blue'}>
                  {currentAccount.roleName === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Trạng thái">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* <Switch
                    checked={currentAccount.status === 1}
                    onChange={handleStatusChange}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Không hoạt động"
                    disabled={!isAdmin}
                  /> */}
                  <Text type={currentAccount.status === 1 ? 'success' : 'danger'}>
                    {currentAccount.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </Text>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Thông tin người dùng */}
        <Col span={24}>
          <Card title="Thông tin người dùng" className="user-info-card">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Họ và tên" span={2}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  <Text strong>{currentAccount.user?.fullName || 'N/A'}</Text>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="ID người dùng">
                <Text code>{currentAccount.user?.userId || 'N/A'}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MailOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentAccount.user?.email || 'N/A'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentAccount.user?.phone || 'N/A'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Địa chỉ" span={2}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px', color: '#8c8c8c', marginTop: '2px' }} />
                  <Paragraph style={{ margin: 0 }}>
                    {currentAccount.user?.address || 'N/A'}
                  </Paragraph>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày sinh">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentAccount.user?.dob ? new Date(currentAccount.user.dob).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Avatar">
                {currentAccount.user?.avatarUrl ? (
                  <img 
                    src={currentAccount.user.avatarUrl} 
                    alt="Avatar" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                ) : (
                  <Text type="secondary">Không có avatar</Text>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa tài khoản"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa tài khoản <strong>{currentAccount.username}</strong>?
        </p>
        <p style={{ color: '#ff4d4f' }}>
          <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến tài khoản này.
        </p>
      </Modal>
    </div>
  )
}

export default AccountDetail
