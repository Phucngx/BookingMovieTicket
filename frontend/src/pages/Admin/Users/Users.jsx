import React, { useState } from 'react'
import { Card, Button, Space, Typography, Row, Col, Table, Tag, Modal, message, Input } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Search } = Input

const Users = () => {
  const [searchText, setSearchText] = useState('')
  
  // Mock data - trong thực tế sẽ lấy từ API
  const users = [
    {
      id: 1,
      username: 'admin',
      fullName: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      phone: '0123456789',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15'
    },
    {
      id: 2,
      username: 'user1',
      fullName: 'Trần Thị User',
      email: 'user1@example.com',
      phone: '0987654321',
      role: 'USER',
      status: 'ACTIVE',
      createdAt: '2024-01-02',
      lastLogin: '2024-01-14'
    },
    {
      id: 3,
      username: 'user2',
      fullName: 'Lê Văn Test',
      email: 'user2@example.com',
      phone: '0369852147',
      role: 'USER',
      status: 'INACTIVE',
      createdAt: '2024-01-03',
      lastLogin: '2024-01-10'
    }
  ]

  const handleEditUser = (user) => {
    console.log('Edit user:', user)
    message.info('Chức năng chỉnh sửa người dùng đang được phát triển')
  }

  const handleDeleteUser = (user) => {
    Modal.confirm({
      title: 'Xác nhận xóa người dùng',
      content: `Bạn có chắc chắn muốn xóa người dùng "${user.fullName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        console.log('Delete user:', user)
        message.success('Xóa người dùng thành công!')
      },
    })
  }

  const handleAddUser = () => {
    message.info('Chức năng thêm người dùng đang được phát triển')
  }

  const columns = [
    {
      title: 'Thông tin người dùng',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <Text strong>{record.fullName}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            @{record.username}
          </Text>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
            title="Xóa"
            disabled={record.role === 'ADMIN'}
          />
        </Space>
      ),
    },
  ]

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Quản lý người dùng</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm người dùng..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}

export default Users
