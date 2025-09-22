import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Table, 
  Tag, 
  Modal, 
  message, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  Row,
  Col,
  Breadcrumb
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  HomeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTheaterById } from '../../store/slices/theatersSlice'
import { theaterService } from '../../services/theaterService'
import './RoomManagement.css'

const { Title, Text } = Typography
const { Option } = Select

const RoomManagement = () => {
  const { theaterId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentTheater, loading } = useSelector(state => state.theaters)
  const { userInfo } = useSelector(state => state.user)
  
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false)
  const [editRoomModalVisible, setEditRoomModalVisible] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [form] = Form.useForm()

  const isAdmin = userInfo?.roleName === 'ADMIN'

  const roomTypes = [
    { value: 'STANDARD', label: 'Thường' },
    { value: 'VIP', label: 'VIP' },
    { value: 'IMAX', label: 'IMAX' },
    { value: '4DX', label: '4DX' }
  ]

  const roomStatuses = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'MAINTENANCE', label: 'Bảo trì' },
    { value: 'INACTIVE', label: 'Ngừng hoạt động' }
  ]

  useEffect(() => {
    if (theaterId) {
      dispatch(fetchTheaterById(theaterId))
      fetchRooms()
    }
  }, [theaterId, dispatch])

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true)
      const response = await theaterService.getTheaterRooms(theaterId)
      setRooms(response.data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
      message.error('Không thể tải danh sách phòng chiếu')
    } finally {
      setRoomsLoading(false)
    }
  }

  const handleAddRoom = () => {
    setAddRoomModalVisible(true)
    form.resetFields()
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setEditRoomModalVisible(true)
    form.setFieldsValue({
      roomName: room.roomName,
      roomType: room.roomType,
      totalSeats: room.totalSeats,
      status: room.status,
      description: room.description
    })
  }

  const handleDeleteRoom = (room) => {
    Modal.confirm({
      title: 'Xác nhận xóa phòng chiếu',
      content: `Bạn có chắc chắn muốn xóa phòng "${room.roomName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Implement delete room API
          console.log('Delete room:', room)
          message.success('Xóa phòng chiếu thành công!')
          fetchRooms()
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa phòng chiếu')
        }
      },
    })
  }

  const handleAddRoomSubmit = async (values) => {
    try {
      // TODO: Implement add room API
      console.log('Add room:', { ...values, theaterId })
      setAddRoomModalVisible(false)
      message.success('Thêm phòng chiếu thành công!')
      form.resetFields()
      fetchRooms()
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm phòng chiếu')
    }
  }

  const handleEditRoomSubmit = async (values) => {
    try {
      // TODO: Implement edit room API
      console.log('Edit room:', { ...selectedRoom, ...values })
      setEditRoomModalVisible(false)
      message.success('Cập nhật phòng chiếu thành công!')
      fetchRooms()
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật phòng chiếu')
    }
  }

  const columns = [
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
      render: (type) => {
        const colors = {
          'STANDARD': 'green',
          'VIP': 'gold',
          'IMAX': 'blue',
          '4DX': 'purple'
        }
        const labels = {
          'STANDARD': 'Thường',
          'VIP': 'VIP',
          'IMAX': 'IMAX',
          '4DX': '4DX'
        }
        return (
          <Tag color={colors[type] || 'default'}>
            {labels[type] || type}
          </Tag>
        )
      },
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
      render: (status) => {
        const colors = {
          'ACTIVE': 'green',
          'MAINTENANCE': 'orange',
          'INACTIVE': 'red'
        }
        const labels = {
          'ACTIVE': 'Hoạt động',
          'MAINTENANCE': 'Bảo trì',
          'INACTIVE': 'Ngừng hoạt động'
        }
        return (
          <Tag color={colors[status] || 'default'}>
            {labels[status] || status}
          </Tag>
        )
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditRoom(record)}
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

  if (loading) {
    return (
      <div className="room-management-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Đang tải thông tin rạp phim...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="room-management-container">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/theaters')}
            style={{ padding: 0 }}
          >
            Quản lý rạp phim
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>{currentTheater?.theaterName || 'Rạp phim'}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý phòng chiếu</Breadcrumb.Item>
      </Breadcrumb>

      <div className="room-management-header">
        <div>
          <Title level={2}>Quản lý phòng chiếu</Title>
          <Text type="secondary">
            Rạp: {currentTheater?.theaterName} - {currentTheater?.city}
          </Text>
        </div>
        
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
            size="large"
            className="add-room-btn"
          >
            Thêm phòng mới
          </Button>
        )}
      </div>

      <Card className="room-table-card">
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="roomId"
          loading={roomsLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} phòng`,
          }}
          locale={{
            emptyText: 'Chưa có phòng chiếu nào'
          }}
        />
      </Card>

      {/* Add Room Modal */}
      <Modal
        title="Thêm phòng chiếu mới"
        open={addRoomModalVisible}
        onCancel={() => setAddRoomModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRoomSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomName"
                label="Tên phòng"
                rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomType"
                label="Loại phòng"
                rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
              >
                <Select placeholder="Chọn loại phòng">
                  {roomTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalSeats"
                label="Số ghế"
                rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
              >
                <InputNumber 
                  placeholder="Nhập số ghế" 
                  min={1} 
                  max={500}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  {roomStatuses.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Nhập mô tả phòng chiếu (tùy chọn)" 
              rows={3} 
            />
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
        onCancel={() => setEditRoomModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditRoomSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomName"
                label="Tên phòng"
                rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomType"
                label="Loại phòng"
                rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
              >
                <Select placeholder="Chọn loại phòng">
                  {roomTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalSeats"
                label="Số ghế"
                rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
              >
                <InputNumber 
                  placeholder="Nhập số ghế" 
                  min={1} 
                  max={500}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  {roomStatuses.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Nhập mô tả phòng chiếu (tùy chọn)" 
              rows={3} 
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditRoomModalVisible(false)}>
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

export default RoomManagement
