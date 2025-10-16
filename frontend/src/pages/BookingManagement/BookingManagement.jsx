import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Table, Tag, message, Input } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllBookings } from '../../store/slices/bookingManagementSlice'
import './BookingManagement.css'

const { Title, Text } = Typography

const BookingManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { bookings, loading, error, total, currentPage, pageSize } = useSelector(state => state.bookingManagement)
  
  const [searchText, setSearchText] = useState('')
  const [filteredBookings, setFilteredBookings] = useState([])

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

    // Fetch all bookings with pagination
    dispatch(fetchAllBookings({ page: 1, size: 10 }))
  }, [isAuthenticated, isAdmin, navigate, dispatch])

  // Filter bookings based on search text
  useEffect(() => {
    if (searchText.trim()) {
      const filtered = bookings.filter(booking =>
        booking.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.movieName.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.theaterName.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.roomName.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredBookings(filtered)
    } else {
      setFilteredBookings(bookings)
    }
  }, [bookings, searchText])

  // Handle search
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  // Handle refresh
  const handleRefresh = () => {
    setSearchText('')
    dispatch(fetchAllBookings({ page: 1, size: 10 }))
  }

  // Handle table pagination
  const handleTableChange = (pagination) => {
    dispatch(fetchAllBookings({ 
      page: pagination.current, 
      size: pagination.pageSize 
    }))
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Format date
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 100,
      render: (id) => <Text code>#{id}</Text>
    },
    {
      title: 'Khách hàng',
      key: 'customerInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <Text strong>{record.userName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDateTime(record.createdAt)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Thông tin phim',
      key: 'movieInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.movieName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDateTime(record.startTime)} - {formatDateTime(record.endTime)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Rạp & Phòng',
      key: 'theaterInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <Text>{record.theaterName}</Text>
          <br />
          <Text type="secondary">{record.roomName}</Text>
        </div>
      ),
    },
    {
      title: 'Ghế ngồi',
      dataIndex: 'seatNames',
      key: 'seatNames',
      width: 120,
      render: (seats) => (
        <div>
          {seats && seats.length > 0 ? (
            <Space wrap>
              {seats.map(seat => (
                <Tag key={seat} color="blue" size="small">
                  {seat}
                </Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">Không có ghế</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Đồ ăn',
      dataIndex: 'foodNames',
      key: 'foodNames',
      width: 150,
      render: (foods) => (
        <div>
          {foods && foods.length > 0 ? (
            <Space wrap>
              {foods.map((food, index) => (
                <Tag key={index} color="orange" size="small">
                  {food}
                </Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">Không có</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        let color = 'default'
        let text = status
        
        switch (status) {
          case 'CONFIRMED':
            color = 'success'
            text = 'Đã xác nhận'
            break
          case 'CANCELLED':
            color = 'error'
            text = 'Đã hủy'
            break
          case 'PENDING':
            color = 'warning'
            text = 'Chờ xác nhận'
            break
          default:
            color = 'default'
        }
        
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              // Navigate to booking detail or show modal
              message.info(`Xem chi tiết booking #${record.bookingId}`)
            }}
            title="Xem chi tiết"
          />
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
          <br />
          <Button 
            type="primary" 
            onClick={() => dispatch(fetchAllBookings({ page: 1, size: 10 }))}
            style={{ marginTop: '10px' }}
          >
            Thử lại
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="booking-management-container">
      <div className="booking-management-header">
        <div>
          <Title level={2}>Quản lý đặt vé</Title>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Search Bar */}
      <Card className="search-card" style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Tìm kiếm theo tên khách hàng, phim, rạp, phòng hoặc trạng thái..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearchChange}
          allowClear
          size="large"
        />
      </Card>

      <Card className="booking-table-card">
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="bookingId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đặt vé`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: searchText ? 'Không tìm thấy đặt vé nào' : 'Chưa có đặt vé nào'
          }}
        />
      </Card>
    </div>
  )
}

export default BookingManagement
