import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  TimePicker,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Alert,
  Statistic,
  Image
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchAllShowtimes, 
  createShowtime, 
  updateShowtime, 
  deleteShowtime,
  fetchMoviesForShowtime,
  fetchTheatersForShowtime,
  setCurrentPage,
  setPageSize,
  clearError
} from '../../store/slices/showtimeManagementSlice'
import { openWizard } from '../../store/slices/showtimeWizardSlice'
import AddShowtimeWizard from '../../components/AddShowtimeWizard'
import dayjs from 'dayjs'
import './ShowtimeManagement.css'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const ShowtimeManagement = () => {
  // Redux
  const dispatch = useDispatch()
  const { 
    showtimes, 
    loading, 
    error, 
    totalElements, 
    totalPages, 
    currentPage, 
    pageSize,
    movies,
    theaters,
    moviesLoading,
    theatersLoading 
  } = useSelector(state => state.showtimeManagement)

  // Local states
  const [searchText, setSearchText] = useState('')
  const [selectedTheater, setSelectedTheater] = useState('')
  const [selectedMovie, setSelectedMovie] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingShowtime, setEditingShowtime] = useState(null)
  const [form] = Form.useForm()
  const [filteredShowtimes, setFilteredShowtimes] = useState([])
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // Mock data for dropdowns - sẽ thay thế bằng API calls
  const mockTheaters = [
    { theaterId: 1, theaterName: 'CGV Vincom' },
    { theaterId: 2, theaterName: 'CGV Landmark' },
    { theaterId: 3, theaterName: 'Lotte Cinema' },
    { theaterId: 4, theaterName: 'Galaxy Cinema' }
  ]

  const mockMovies = [
    { movieId: 1, title: 'Avengers: Endgame' },
    { movieId: 2, title: 'Spider-Man: No Way Home' },
    { movieId: 3, title: 'The Batman' },
    { movieId: 4, title: 'Top Gun: Maverick' },
    { movieId: 5, title: 'Doctor Strange' },
    { movieId: 7, title: 'Black Widow' }
  ]

  const mockRooms = [
    { roomId: 1, roomName: 'Phòng 1', theaterId: 1 },
    { roomId: 2, roomName: 'Phòng 2', theaterId: 1 }
  ]

  // Load data
  useEffect(() => {
    loadShowtimes()
  }, [currentPage, pageSize])

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText])

  // Filter showtimes based on filter criteria
  useEffect(() => {
    // If no filters are applied, use original showtimes from server
    const hasFilters = debouncedSearchText.trim() || selectedTheater || selectedMovie || selectedStatus || (dateRange && dateRange.length === 2)
    
    if (!hasFilters) {
      setFilteredShowtimes(showtimes)
      return
    }

    let filtered = [...showtimes]

    // Search filter
    if (debouncedSearchText.trim()) {
      const searchLower = debouncedSearchText.toLowerCase()
      filtered = filtered.filter(showtime => {
        const movieTitle = getMovieTitle(showtime.movieId).toLowerCase()
        const theaterName = getTheaterName(showtime.roomId).toLowerCase()
        const roomName = getRoomName(showtime.roomId).toLowerCase()
        
        return movieTitle.includes(searchLower) || 
               theaterName.includes(searchLower) || 
               roomName.includes(searchLower) ||
               showtime.showtimeId.toString().includes(searchLower)
      })
    }

    // Theater filter
    if (selectedTheater) {
      filtered = filtered.filter(showtime => {
        const theaterName = getTheaterName(showtime.roomId)
        return theaterName === selectedTheater
      })
    }

    // Movie filter
    if (selectedMovie) {
      filtered = filtered.filter(showtime => showtime.movieId === selectedMovie)
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(showtime => showtime.status === selectedStatus)
    }

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange
      filtered = filtered.filter(showtime => {
        const showtimeDate = dayjs(showtime.startTime)
        return showtimeDate.isAfter(startDate.startOf('day')) && 
               showtimeDate.isBefore(endDate.endOf('day'))
      })
    }

    setFilteredShowtimes(filtered)
  }, [showtimes, debouncedSearchText, selectedTheater, selectedMovie, selectedStatus, dateRange])

  // Load reference data (movies, theaters) when component mounts
  useEffect(() => {
    dispatch(fetchMoviesForShowtime({ page: 1, size: 100 }))
    dispatch(fetchTheatersForShowtime({ page: 1, size: 100 }))
  }, [dispatch])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Show error message
  useEffect(() => {
    if (error) {
      message.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const loadShowtimes = () => {
    dispatch(fetchAllShowtimes({ page: currentPage, size: pageSize }))
  }

  const handleAddShowtime = () => {
    dispatch(openWizard())
  }

  const handleEditShowtime = (record) => {
    setEditingShowtime(record)
    form.setFieldsValue({
      movieId: record.movieId,
      roomId: record.roomId,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      price: record.price,
      status: record.status
    })
    setModalVisible(true)
  }

  const handleDeleteShowtime = async (showtimeId) => {
    try {
      await dispatch(deleteShowtime(showtimeId)).unwrap()
      message.success('Xóa suất chiếu thành công')
      // Refresh list after delete
      loadShowtimes()
    } catch (error) {
      message.error('Không thể xóa suất chiếu')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const showtimeData = {
        movieId: values.movieId,
        roomId: values.roomId,
        startTime: values.startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DDTHH:mm:ss'),
        price: values.price,
        status: values.status
      }

      if (editingShowtime) {
        await dispatch(updateShowtime({ 
          showtimeId: editingShowtime.showtimeId, 
          ...showtimeData 
        })).unwrap()
        message.success('Cập nhật suất chiếu thành công')
      } else {
        await dispatch(createShowtime(showtimeData)).unwrap()
        message.success('Thêm suất chiếu thành công')
      }
      
      // Refresh list after create/update
      loadShowtimes()

      setModalVisible(false)
      form.resetFields()
      setEditingShowtime(null)
    } catch (error) {
      message.error('Có lỗi xảy ra')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green'
      case 'INACTIVE': return 'red'
      case 'FULL': return 'orange'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động'
      case 'INACTIVE': return 'Tạm dừng'
      case 'FULL': return 'Hết vé'
      default: return status
    }
  }

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    return movie ? movie.title : `Movie ID: ${movieId}`
  }

  const getMovieInfo = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    return movie || { id: movieId, title: `Movie ID: ${movieId}`, posterUrl: null }
  }

  const getTheaterName = (roomId) => {
    // Find theater that contains this room
    for (const theater of theaters) {
      if (theater.rooms) {
        const room = theater.rooms.find(r => r.roomId === roomId)
        if (room) return theater.theaterName
      }
    }
    return 'Unknown Theater'
  }

  const getRoomName = (roomId) => {
    // Try to find room in theaters data (rooms are nested in theaters)
    for (const theater of theaters) {
      if (theater.rooms) {
        const room = theater.rooms.find(r => r.roomId === roomId)
        if (room) return room.roomName
      }
    }
    // Fallback to mock data if not found in theaters
    const room = mockRooms.find(r => r.roomId === roomId)
    return room ? room.roomName : `Room ID: ${roomId}`
  }

  const columns = [
    {
      title: 'Suất chiếu',
      key: 'showtime',
      width: 280,
      render: (_, record) => {
        const movieInfo = getMovieInfo(record.movieId)
        return (
          <Space align="start">
            {movieInfo.posterUrl ? (
              <Image
                src={movieInfo.posterUrl}
                alt={movieInfo.title}
                width={40}
                height={60}
                style={{ borderRadius: 4, objectFit: 'cover' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div style={{ 
                width: 40, 
                height: 60, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 4, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <VideoCameraOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              </div>
            )}
            <div>
              <Text strong style={{ fontSize: 14 }}>{movieInfo.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined /> ID: {record.showtimeId}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                <HomeOutlined /> {getTheaterName(record.roomId)}
              </Text>
            </div>
          </Space>
        )
      }
    },
    {
      title: 'Phòng chiếu',
      key: 'room',
      width: 150,
      render: (_, record) => (
        <div>
          <Tag color="blue" style={{ fontSize: 11 }}>
            {getRoomName(record.roomId)}
          </Tag>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            Room ID: {record.roomId}
          </Text>
        </div>
      )
    },
    {
      title: 'Thời gian chiếu',
      key: 'time',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <Text style={{ marginLeft: 6, fontSize: 13 }}>
              {dayjs(record.startTime).format('DD/MM/YYYY')}
            </Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <ClockCircleOutlined style={{ color: '#52c41a' }} />
            <Text style={{ marginLeft: 6, fontSize: 13 }}>
              {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Thời lượng: {dayjs(record.endTime).diff(dayjs(record.startTime), 'minute')} phút
          </Text>
        </div>
      )
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: '#f5222d', fontSize: 14 }}>
          {price?.toLocaleString('vi-VN')}đ
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: 12 }}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {/* <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              style={{ color: '#1890ff' }}
            />
          </Tooltip> */}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditShowtime(record)}
              style={{ color: '#faad14' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa suất chiếu"
            description="Bạn có chắc chắn muốn xóa suất chiếu này?"
            onConfirm={() => handleDeleteShowtime(record.showtimeId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Statistics - use filtered data if filters are applied, otherwise use server data
  const hasFilters = debouncedSearchText.trim() || selectedTheater || selectedMovie || selectedStatus || (dateRange && dateRange.length === 2)
  const statsData = hasFilters ? filteredShowtimes : showtimes
  
  const totalShowtimesCount = hasFilters ? filteredShowtimes.length : totalElements
  const activeShowtimes = statsData.filter(s => s.status === 'ACTIVE').length
  const totalRevenue = statsData.reduce((sum, s) => sum + (s.price || 0), 0)
  const averagePrice = statsData.length > 0 
    ? (statsData.reduce((sum, s) => sum + (s.price || 0), 0) / statsData.length).toFixed(0)
    : 0

  return (
    <div className="showtime-management">
      {/* Header */}
      <div className="showtime-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
             Quản lý suất chiếu
          </Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleAddShowtime}
          className="add-showtime-btn"
        >
          Thêm suất chiếu
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={12}>
          <Card className="stat-card">
            <Statistic
              title="Tổng suất chiếu"
              value={totalShowtimesCount}
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Card className="stat-card">
            <Statistic
              title="Đang hoạt động"
              value={activeShowtimes}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Tổng giá trị"
              value={totalRevenue}
              prefix="₫"
              formatter={(value) => `${value.toLocaleString('vi-VN')}`}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Giá trung bình"
              value={averagePrice}
              prefix="₫"
              formatter={(value) => `${value.toLocaleString('vi-VN')}`}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col> */}
      </Row>

      {/* Filters */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm phim, rạp, phòng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Chọn rạp"
              value={selectedTheater}
              onChange={setSelectedTheater}
              allowClear
              style={{ width: '100%' }}
              loading={theatersLoading}
            >
              {theaters.map(theater => (
                <Option key={theater.theaterId} value={theater.theaterName}>
                  {theater.theaterName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Chọn phim"
              value={selectedMovie}
              onChange={setSelectedMovie}
              allowClear
              style={{ width: '100%' }}
              loading={moviesLoading}
            >
              {movies.map(movie => (
                <Option key={movie.id} value={movie.id}>
                  {movie.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Tạm dừng</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={2}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setSearchText('')
                setSelectedTheater('')
                setSelectedMovie('')
                setSelectedStatus('')
                setDateRange([])
                loadShowtimes()
              }}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredShowtimes}
          rowKey="showtimeId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: hasFilters ? filteredShowtimes.length : totalElements,
            showSizeChanger: !hasFilters,
            showQuickJumper: !hasFilters,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} suất chiếu`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
              if (!hasFilters) {
                dispatch(setCurrentPage(page))
                if (size !== pageSize) {
                  dispatch(setPageSize(size))
                }
              }
            },
            onShowSizeChange: (current, size) => {
              if (!hasFilters) {
                dispatch(setCurrentPage(1))
                dispatch(setPageSize(size))
              }
            }
          }}
          scroll={{ x: 1200 }}
          className="showtime-table"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingShowtime ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setEditingShowtime(null)
        }}
        footer={null}
        width={520}
        className="showtime-modal"
        bodyStyle={{ maxHeight: '65vh', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="movieId"
                label="Phim"
                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
              >
                <Select placeholder="Chọn phim">
                  {mockMovies.map(movie => (
                    <Option key={movie.movieId} value={movie.movieId}>
                      {movie.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Phòng chiếu"
                rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
              >
                <Select placeholder="Chọn phòng">
                  {mockRooms.map(room => (
                    <Option key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
              >
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder="Chọn ngày và giờ bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="Thời gian kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
              >
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder="Chọn ngày và giờ kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá vé (VNĐ)"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá vé' }
                ]}
              >
                <Input 
                  type="number" 
                  placeholder="120000"
                  min={0}
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
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Tạm dừng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setModalVisible(false)
                  form.resetFields()
                  setEditingShowtime(null)
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={editingShowtime ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingShowtime ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
        </Modal>

        {/* Add Showtime Wizard */}
        <AddShowtimeWizard />
      </div>
    )
  }

  export default ShowtimeManagement
