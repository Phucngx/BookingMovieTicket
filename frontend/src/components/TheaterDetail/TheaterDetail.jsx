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
  Alert,
  Form,
  Input,
  Select
} from 'antd'
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  UserOutlined, 
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTheaterById, deleteTheater } from '../../store/slices/theatersSlice'
import { theaterService } from '../../services/theaterService'
import './TheaterDetail.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const TheaterDetail = () => {
  const { theaterId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentTheater, loading, error } = useSelector(state => state.theaters)
  const { userInfo } = useSelector(state => state.user)
  
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false)
  const [editRoomModalVisible, setEditRoomModalVisible] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [form] = Form.useForm()

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
    setAddRoomModalVisible(true)
    form.resetFields()
  }

  const handleAddRoomSubmit = async (values) => {
    try {
      const payload = {
        roomName: values.roomName,
        screenType: values.screenType,
        soundSystem: values.soundSystem,
        theaterId: Number(theaterId)
      }
      const res = await theaterService.createRoom(payload)
      if (res?.code === 1000) {
        message.success('Thêm phòng chiếu thành công!')
        setAddRoomModalVisible(false)
        form.resetFields()
        fetchTheaterRooms()
      } else {
        message.error(res?.message || 'Không thể thêm phòng chiếu')
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi thêm phòng chiếu')
    }
  }

  const handleEditRoom = (roomId) => {
    const room = rooms.find(r => r.roomId === roomId)
    setSelectedRoom(room)
    setEditRoomModalVisible(true)
    form.setFieldsValue({
      roomName: room?.roomName,
      screenType: room?.screenType,
      soundSystem: room?.soundSystem,
    })
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
      title: 'Màn hình',
      dataIndex: 'screenType',
      key: 'screenType',
      render: (type) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: 'Âm thanh',
      dataIndex: 'soundSystem',
      key: 'soundSystem',
      render: (sound) => (
        <Tag color="purple">{sound}</Tag>
      ),
    },
    {
      title: 'Số ghế',
      dataIndex: 'totalSeats',
      key: 'totalSeats',
      render: (seats) => (
        <Tag color="geekblue">{seats} ghế</Tag>
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
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRoom(record)}
            title="Xóa phòng"
          />
        </Space>
      ),
    },
  ]

  const handleDeleteRoom = (room) => {
    Modal.confirm({
      title: 'Xác nhận xóa phòng chiếu',
      content: `Bạn có chắc chắn muốn xóa phòng "${room.roomName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await theaterService.deleteRoom(room.roomId)
          message.success('Xóa phòng chiếu thành công!')
          fetchTheaterRooms()
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi xóa phòng chiếu')
        }
      },
    })
  }

  const handleEditRoomSubmit = async (values) => {
    try {
      const payload = {
        roomName: values.roomName,
        screenType: values.screenType,
        soundSystem: values.soundSystem,
        theaterId: Number(theaterId)
      }
      const res = await theaterService.updateRoom(selectedRoom.roomId, payload)
      if (res?.code === 1000) {
        message.success('Cập nhật phòng chiếu thành công!')
        setEditRoomModalVisible(false)
        setSelectedRoom(null)
        form.resetFields()
        fetchTheaterRooms()
      } else {
        message.error(res?.message || 'Không thể cập nhật phòng chiếu')
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật phòng chiếu')
    }
  }

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
        <div className="theater-detail-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/theaters')}
            style={{ padding: 0 }}
          >
            Quay lại
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentTheater.theaterName}
            </Title>
            <Text type="secondary">Thông tin chi tiết rạp phim</Text>
          </div>
        </div>
        
        {/* {isAdmin && (
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
        )} */}
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

      {/* Add Room Modal */}
      <Modal
        title="Thêm phòng chiếu mới"
        open={addRoomModalVisible}
        onCancel={() => setAddRoomModalVisible(false)}
        footer={null}
        width={520}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddRoomSubmit}
        >
          <Form.Item
            name="roomName"
            label="Tên phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
          >
            <Input placeholder="Ví dụ: Room A" />
          </Form.Item>

          <Form.Item
            name="screenType"
            label="Loại màn hình (screenType)"
            rules={[{ required: true, message: 'Vui lòng chọn loại màn hình' }]}
          >
            <Select placeholder="Chọn loại màn hình">
              <Option value="TWO_D">TWO_D</Option>
              <Option value="THREE_D">THREE_D</Option>
              <Option value="FOUR_D">FOUR_D</Option>
              <Option value="IMAX">IMAX</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="soundSystem"
            label="Hệ thống âm thanh (soundSystem)"
            rules={[{ required: true, message: 'Vui lòng chọn hệ thống âm thanh' }]}
          >
            <Select placeholder="Chọn hệ thống âm thanh">
              <Option value="DOLBY_ATMOS">DOLBY_ATMOS</Option>
              <Option value="DOLBY_DIGITAL">DOLBY_DIGITAL</Option>
              <Option value="DTS">DTS</Option>
              <Option value="THX">THX</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAddRoomModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm phòng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        title="Chỉnh sửa phòng chiếu"
        open={editRoomModalVisible}
        onCancel={() => { setEditRoomModalVisible(false); setSelectedRoom(null) }}
        footer={null}
        width={520}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleEditRoomSubmit}
        >
          <Form.Item
            name="roomName"
            label="Tên phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
          >
            <Input placeholder="Ví dụ: Room A" />
          </Form.Item>

          <Form.Item
            name="screenType"
            label="Loại màn hình (screenType)"
            rules={[{ required: true, message: 'Vui lòng chọn loại màn hình' }]}
          >
            <Select placeholder="Chọn loại màn hình">
              <Option value="TWO_D">TWO_D</Option>
              <Option value="THREE_D">THREE_D</Option>
              <Option value="FOUR_D">FOUR_D</Option>
              <Option value="IMAX">IMAX</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="soundSystem"
            label="Hệ thống âm thanh (soundSystem)"
            rules={[{ required: true, message: 'Vui lòng chọn hệ thống âm thanh' }]}
          >
            <Select placeholder="Chọn hệ thống âm thanh">
              <Option value="DOLBY_ATMOS">DOLBY_ATMOS</Option>
              <Option value="DOLBY_DIGITAL">DOLBY_DIGITAL</Option>
              <Option value="DTS">DTS</Option>
              <Option value="THX">THX</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setEditRoomModalVisible(false); setSelectedRoom(null) }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TheaterDetail
