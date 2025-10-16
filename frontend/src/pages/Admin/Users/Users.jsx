import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Row, Col, Table, Tag, Modal, message, Input, Switch, Form, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllAccounts, deleteAccount, updateAccountStatus, searchAccounts, clearError, addAccount, updateAccountRole } from '../../../store/slices/userManagementSlice'
import { fetchAllRoles } from '../../../store/slices/roleSlice'
import './AccountManagement.css'

const { Title, Text } = Typography
const { Option } = Select

const AccountManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { accounts, loading, error, total, currentPage, pageSize, searchTerm } = useSelector(state => state.accountManagement)
  const { roles, loading: rolesLoading } = useSelector(state => state.roles)
  
  const [searchText, setSearchText] = useState('')
  const [addAccountModalVisible, setAddAccountModalVisible] = useState(false)
  const [editAccountModalVisible, setEditAccountModalVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [form] = Form.useForm()

  // Kiểm tra quyền admin
  const isAdmin = userInfo?.roleName === 'ADMIN'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    
    if (!isAdmin) {
      message.error('Bạn không có quyền truy cập trang này')
      navigate('/')
      return
    }

    // Fetch all accounts with pagination
    dispatch(fetchAllAccounts({ page: 1, size: 10 }))
    
    // Fetch all roles for edit modal
    dispatch(fetchAllRoles({ page: 1, size: 100 }))
  }, [isAuthenticated, isAdmin, navigate, dispatch])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleAddAccount = () => {
    setAddAccountModalVisible(true)
    form.resetFields()
  }

  const handleEditAccount = (account) => {
    setSelectedAccount(account)
    setEditAccountModalVisible(true)
    
    // Tìm roleId từ roleName
    const currentRole = roles.find(role => role.roleName === account.roleName)
    
    form.setFieldsValue({
      roleId: currentRole?.roleId || null
    })
  }

  const handleDeleteAccount = (account) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản',
      content: `Bạn có chắc chắn muốn xóa tài khoản "${account.username}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await dispatch(deleteAccount(account.accountId)).unwrap()
          message.success('Xóa tài khoản thành công!')
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa tài khoản')
        }
      },
    })
  }

  const handleViewAccount = (account) => {
    navigate(`/admin/accounts/${account.accountId}`)
  }

  const handleRefresh = () => {
    dispatch(fetchAllAccounts({ page: 1, size: 10 }))
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchText(value)
    
    // Debounce search để tránh gọi API quá nhiều
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      if (value.trim()) {
        dispatch(searchAccounts({ searchTerm: value.trim(), page: 1, size: 10 }))
      } else {
        dispatch(fetchAllAccounts({ page: 1, size: 10 }))
      }
    }, 500)
  }

  const handleStatusChange = async (account, checked) => {
    try {
      console.log('Changing status for account:', account.accountId, 'to:', checked ? 1 : 0)
      await dispatch(updateAccountStatus({ 
        accountId: account.accountId, 
        status: checked ? 1 : 0 
      })).unwrap()
      message.success(`Tài khoản "${account.username}" đã được ${checked ? 'kích hoạt' : 'vô hiệu hóa'}`)
    } catch (error) {
      console.error('Status change error:', error)
      message.error('Có lỗi xảy ra khi thay đổi trạng thái tài khoản')
    }
  }

  const handleAddAccountSubmit = async (values) => {
    try {
      await dispatch(addAccount(values)).unwrap()
      setAddAccountModalVisible(false)
      message.success('Thêm tài khoản thành công!')
      form.resetFields()
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm tài khoản')
    }
  }

  const handleEditAccountSubmit = async (values) => {
    try {
      console.log('Submitting edit account:', values)
      await dispatch(updateAccountRole({ 
        accountId: selectedAccount.accountId, 
        roleId: values.roleId 
      })).unwrap()
      setEditAccountModalVisible(false)
      setSelectedAccount(null)
      form.resetFields()
      message.success('Cập nhật role tài khoản thành công!')
    } catch (error) {
      console.error('Edit account error:', error)
      message.error('Có lỗi xảy ra khi cập nhật role tài khoản')
    }
  }

  // Sử dụng accounts từ Redux store (đã được filter từ API)
  // Không cần filter local nữa vì API đã xử lý search

  const columns = [
    {
      title: 'Thông tin tài khoản',
      key: 'accountInfo',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <Text strong>{record.user?.fullName || 'Chưa có thông tin'}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            @{record.username}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.accountId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email) => email || 'Chưa có thông tin',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['user', 'phone'],
      key: 'phone',
      render: (phone) => phone || 'Chưa có thông tin',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleName) => (
        <Tag color={roleName === 'USER' ? 'blue' : 'orange'}>
          {roleName === 'USER' ? 'Người dùng' : 'Nhân viên'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Switch
            checked={status === 1}
            onChange={(checked) => handleStatusChange(record, checked)}
            checkedChildren="Đang hoạt động"
            unCheckedChildren="Đã bị khóa"
          />
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewAccount(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditAccount(record)}
            title="Chỉnh sửa"
          />
          {/* <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAccount(record)}
            title="Xóa"
            disabled={record.roleName === 'ADMIN'}
          /> */}
        </Space>
      ),
    },
  ]

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Show error if any
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <Title level={3}>Lỗi khi tải dữ liệu</Title>
          <Text type="danger">{error}</Text>
        </Card>
      </div>
    )
  }

  return (
    <div className="account-management-container">
      <div className="account-management-header">
    <div>
          <Title level={2}>Quản lý tài khoản</Title>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
            onClick={handleAddAccount}
            size="large"
            className="add-account-btn"
        >
            Thêm tài khoản
        </Button> */}
        </Space>
      </div>

      {/* Search Bar */}
      <Card className="search-card" style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Tìm kiếm theo tên, username hoặc role..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearchChange}
          allowClear
          size="large"
        />
      </Card>

      <Card className="account-table-card">
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="accountId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} tài khoản`,
            onChange: (page, size) => {
              if (searchText.trim()) {
                dispatch(searchAccounts({ searchTerm: searchText.trim(), page, size }))
              } else {
                dispatch(fetchAllAccounts({ page, size }))
              }
            }
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: searchText ? 'Không tìm thấy tài khoản nào' : 'Chưa có tài khoản nào'
          }}
        />
      </Card>

      {/* Add Account Modal */}
      <Modal
        title="Thêm tài khoản mới"
        open={addAccountModalVisible}
        onCancel={() => setAddAccountModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAccountSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="USER">Người dùng</Option>
                  <Option value="ADMIN">Quản trị viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAddAccountModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm tài khoản
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        title={`Chỉnh sửa vai trò - ${selectedAccount?.username || ''}`}
        open={editAccountModalVisible}
        onCancel={() => {
          setEditAccountModalVisible(false)
          setSelectedAccount(null)
          form.resetFields()
        }}
        footer={null}
        width={500}
      >
        {selectedAccount && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Thông tin tài khoản:</Text>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Text>Tên đăng nhập: </Text>
              <Text strong>{selectedAccount.username}</Text>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Text>Họ tên: </Text>
              <Text strong>{selectedAccount.user?.fullName || 'Chưa có thông tin'}</Text>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Text>Email: </Text>
              <Text strong>{selectedAccount.user?.email || 'Chưa có thông tin'}</Text>
            </div>
            <div>
              <Text>Vai trò hiện tại: </Text>
              <Tag color={selectedAccount.roleName === 'ADMIN' ? 'red' : selectedAccount.roleName === 'STAFF' ? 'orange' : 'blue'}>
                {selectedAccount.roleName}
              </Tag>
            </div>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditAccountSubmit}
        >
          <Form.Item
            name="roleId"
            label="Chọn vai trò mới"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select 
              placeholder="Chọn vai trò" 
              loading={rolesLoading}
              size="large"
            >
              {roles.map(role => (
                <Option key={role.roleId} value={role.roleId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{role.roleName}</span>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {role.description}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setEditAccountModalVisible(false)
                setSelectedAccount(null)
                form.resetFields()
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật vai trò
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AccountManagement
