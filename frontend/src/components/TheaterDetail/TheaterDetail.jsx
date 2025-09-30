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
  Table,
  Modal,
  message,
  Spin,
  Alert
} from 'antd'
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  UserOutlined, 
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTheaterById, deleteTheater } from '../../store/slices/theatersSlice'
import { theaterService } from '../../services/theaterService'
import './TheaterDetail.css'

const { Title, Text, Paragraph } = Typography

const TheaterDetail = () => {
  const { theaterId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentTheater, loading, error } = useSelector(state => state.theaters)
  const { userInfo } = useSelector(state => state.user)
  
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const isAdmin = userInfo?.roleName === 'ADMIN'

  useEffect(() => {
    if (theaterId) {
      dispatch(fetchTheaterById(theaterId))
      fetchTheaterRooms()
    }
  }, [theaterId, dispatch])

  const fetchTheaterRooms = async () => {
    try {
      setRoomsLoading(true)
      const response = await theaterService.getTheaterRooms(theaterId)
      setRooms(response.data || [])
    } catch (error) {
      console.error('Error fetching theater rooms:', error)
      message.error('Không thể tải danh sách phòng chiếu')
    } finally {
      setRoomsLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/admin/theaters/${theaterId}/edit`)
  }

  const handleDelete = () => {
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    try {
      await dispatch(deleteTheater(theaterId)).unwrap()
      message.success('Xóa rạp phim thành công!')
      navigate('/admin/theaters')
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa rạp phim')
    } finally {
      setDeleteModalVisible(false)
    }
  }

  const handleAddRoom = () => {
    navigate(`/admin/theaters/${theaterId}/rooms/add`)
  }

  const handleEditRoom = (roomId) => {
    navigate(`/admin/theaters/${theaterId}/rooms/${roomId}/edit`)
  }

  const roomColumns = [
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.roomId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType',
      render: (type) => (
        <Tag color={type === 'VIP' ? 'gold' : type === 'IMAX' ? 'blue' : 'green'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Số ghế',
      dataIndex: 'totalSeats',
      key: 'totalSeats',
      render: (seats) => (
        <Tag color="blue">{seats} ghế</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
        </Tag>
      ),
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
            onClick={() => handleEditRoom(record.roomId)}
            title="Chỉnh sửa phòng"
          />
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="theater-detail-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Đang tải thông tin rạp phim...</Text>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="theater-detail-container">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/admin/theaters')}>
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  if (!currentTheater) {
    return (
      <div className="theater-detail-container">
        <Alert
          message="Không tìm thấy rạp phim"
          description="Rạp phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/admin/theaters')}>
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="theater-detail-container">
      <div className="theater-detail-header">
        <div className="theater-detail-title">
          <Title level={2} style={{ margin: 0 }}>
            {currentTheater.theaterName}
          </Title>
          <Text type="secondary">Thông tin chi tiết rạp phim</Text>
        </div>
        
        {isAdmin && (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Xóa rạp
            </Button>
          </Space>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin cơ bản */}
        <Col span={24}>
          <Card title="Thông tin cơ bản" className="theater-info-card">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên rạp" span={2}>
                <Text strong>{currentTheater.theaterName}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="ID rạp">
                <Text code>{currentTheater.theaterId}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Số phòng">
                <Tag color="blue">{currentTheater.totalRooms} phòng</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Thành phố">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentTheater.city}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Quận/Huyện">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <HomeOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentTheater.district}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Địa chỉ" span={2}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px', color: '#8c8c8c', marginTop: '2px' }} />
                  <Paragraph style={{ margin: 0 }}>{currentTheater.address}</Paragraph>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentTheater.phone}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Quản lý">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                  {currentTheater.managerName}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Danh sách phòng chiếu */}
        <Col span={24}>
          <Card 
            title="Danh sách phòng chiếu" 
            className="theater-rooms-card"
            extra={
              isAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRoom}
                  size="small"
                >
                  Thêm phòng
                </Button>
              )
            }
          >
            <Table
              columns={roomColumns}
              dataSource={rooms}
              rowKey="roomId"
              loading={roomsLoading}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} phòng`,
              }}
              locale={{
                emptyText: 'Chưa có phòng chiếu nào'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa rạp phim"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa rạp phim <strong>{currentTheater.theaterName}</strong>?
        </p>
        <p style={{ color: '#ff4d4f' }}>
          <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến rạp phim này.
        </p>
      </Modal>
    </div>
  )
}

export default TheaterDetail
