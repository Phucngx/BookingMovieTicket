import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Row, Col, Table, Tag, Modal, message, Form, Input, Select, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EnvironmentOutlined, PhoneOutlined, UserOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllTheaters, addTheater, updateTheater, deleteTheater, clearError } from '../../store/slices/theatersSlice'
import './TheaterManagement.css'

const { Title, Text } = Typography
const { Option } = Select

const TheaterManagement = () => {
  const dispatch = useDispatch()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { theaters, loading, error } = useSelector(state => state.theaters)
  
  const navigate = useNavigate()
  const [addTheaterModalVisible, setAddTheaterModalVisible] = useState(false)
  const [editTheaterModalVisible, setEditTheaterModalVisible] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // Kiểm tra quyền admin
  const isAdmin = userInfo?.roleName === 'ADMIN'

  // Danh sách thành phố mặc định
  const cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Nha Trang',
    'Huế',
    'Vũng Tàu',
    'Quy Nhon',
    'Hạ Long'
  ]

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

    // Fetch all theaters
    dispatch(fetchAllTheaters())
  }, [isAuthenticated, isAdmin, navigate, dispatch])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleAddTheater = () => {
    setAddTheaterModalVisible(true)
    form.resetFields()
  }

  const handleEditTheater = (theater) => {
    setSelectedTheater(theater)
    setEditTheaterModalVisible(true)
    form.setFieldsValue({
      theaterName: theater.theaterName,
      city: theater.city,
      district: theater.district,
      address: theater.address,
      phone: theater.phone,
      managerName: theater.managerName,
      totalRooms: theater.totalRooms
    })
  }

  const handleDeleteTheater = (theater) => {
    Modal.confirm({
      title: 'Xác nhận xóa rạp phim',
      content: `Bạn có chắc chắn muốn xóa rạp "${theater.theaterName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await dispatch(deleteTheater(theater.theaterId)).unwrap()
          message.success('Xóa rạp phim thành công!')
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa rạp phim')
        }
      },
    })
  }

  const handleViewTheater = (theater) => {
    navigate(`/admin/theaters/${theater.theaterId}`)
  }

  const handleRefresh = () => {
    dispatch(fetchAllTheaters())
  }

  const handleAddTheaterSubmit = async (values) => {
    try {
      await dispatch(addTheater(values)).unwrap()
      setAddTheaterModalVisible(false)
      message.success('Thêm rạp phim thành công!')
      form.resetFields()
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm rạp phim')
    }
  }

  const handleEditTheaterSubmit = async (values) => {
    try {
      await dispatch(updateTheater({ 
        theaterId: selectedTheater.theaterId, 
        theaterData: values 
      })).unwrap()
      setEditTheaterModalVisible(false)
      message.success('Cập nhật rạp phim thành công!')
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật rạp phim')
    }
  }

  // Filter theaters based on search text
  const filteredTheaters = theaters.filter(theater =>
    theater.theaterName.toLowerCase().includes(searchText.toLowerCase()) ||
    theater.city.toLowerCase().includes(searchText.toLowerCase()) ||
    theater.district.toLowerCase().includes(searchText.toLowerCase()) ||
    theater.managerName.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'Tên rạp',
      dataIndex: 'theaterName',
      key: 'theaterName',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.theaterId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <EnvironmentOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            <Text>{text}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.district}, {record.city}
          </Text>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <PhoneOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            <Text>{phone}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.managerName}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Số phòng',
      dataIndex: 'totalRooms',
      key: 'totalRooms',
      render: (rooms) => (
        <Tag color={rooms > 0 ? 'green' : 'red'}>
          {rooms} phòng
        </Tag>
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
            onClick={() => handleViewTheater(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTheater(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTheater(record)}
            title="Xóa"
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
        </Card>
      </div>
    )
  }

  return (
    <div className="theater-management-container">
      <div className="theater-management-header">
        <div>
          <Title level={2}>Quản lý rạp phim</Title>
          <Text type="secondary">Quản lý danh sách rạp phim trong hệ thống</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTheater}
            size="large"
            className="add-theater-btn"
          >
            Thêm rạp mới
          </Button>
        </Space>
      </div>

      {/* Search Bar */}
      <Card className="search-card" style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Tìm kiếm theo tên rạp, thành phố, quận/huyện, quản lý..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
        />
      </Card>

      <Card className="theater-table-card">
        <Table
          columns={columns}
          dataSource={filteredTheaters}
          rowKey="theaterId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} rạp`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: searchText ? 'Không tìm thấy rạp phim nào' : 'Chưa có rạp phim nào'
          }}
        />
      </Card>

      {/* Add Theater Modal */}
      <Modal
        title="Thêm rạp phim mới"
        open={addTheaterModalVisible}
        onCancel={() => setAddTheaterModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTheaterSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="theaterName"
                label="Tên rạp"
                rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
              >
                <Select placeholder="Chọn thành phố">
                  {cities.map(city => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
              >
                <Input placeholder="Nhập quận/huyện" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ chi tiết" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="managerName"
                label="Tên quản lý"
                rules={[{ required: true, message: 'Vui lòng nhập tên quản lý' }]}
              >
                <Input placeholder="Nhập tên quản lý" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalRooms"
                label="Số phòng"
                rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
              >
                <InputNumber 
                  placeholder="Nhập số phòng" 
                  min={0} 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAddTheaterModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm rạp
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Theater Modal */}
      <Modal
        title="Chỉnh sửa rạp phim"
        open={editTheaterModalVisible}
        onCancel={() => setEditTheaterModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditTheaterSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="theaterName"
                label="Tên rạp"
                rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
              >
                <Select placeholder="Chọn thành phố">
                  {cities.map(city => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
              >
                <Input placeholder="Nhập quận/huyện" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ chi tiết" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="managerName"
                label="Tên quản lý"
                rules={[{ required: true, message: 'Vui lòng nhập tên quản lý' }]}
              >
                <Input placeholder="Nhập tên quản lý" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalRooms"
                label="Số phòng"
                rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
              >
                <InputNumber 
                  placeholder="Nhập số phòng" 
                  min={0} 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditTheaterModalVisible(false)}>
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

export default TheaterManagement
