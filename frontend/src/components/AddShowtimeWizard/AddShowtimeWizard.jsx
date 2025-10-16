import React, { useEffect } from 'react'
import {
  Modal,
  Steps,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Spin,
  Alert,
  Image,
  Tag,
  Divider,
  InputNumber,
  message,
  Tooltip
} from 'antd'
import {
  VideoCameraOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMoviesForWizard,
  fetchTheatersForWizard,
  fetchRoomsByTheater,
  fetchExistingShowtimes,
  createShowtime,
  setSelectedMovie,
  setSelectedTheater,
  setSelectedRoom,
  setSelectedDate,
  setSelectedTimeSlot,
  setSelectedPrice,
  clearTimeSelection,
  nextStep,
  prevStep,
  closeWizard,
  clearErrors
} from '../../store/slices/showtimeWizardSlice'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import './AddShowtimeWizard.css'

// Enable dayjs plugins
dayjs.extend(isBetween)

const { Title, Text } = Typography
const { Option } = Select

const AddShowtimeWizard = () => {
  const dispatch = useDispatch()
  const {
    wizardVisible,
    currentStep,
    totalSteps,
    // Step 1 data
    selectedMovieId,
    selectedMovie,
    selectedTheaterId,
    selectedTheater,
    selectedRoomId,
    selectedRoom,
    selectedDate,
    // Step 2 data
    selectedStartTime,
    selectedEndTime,
    selectedPrice,
    existingShowtimes,
    // API data
    movies,
    theaters,
    rooms,
    // Loading states
    moviesLoading,
    theatersLoading,
    roomsLoading,
    existingShowtimesLoading,
    createShowtimeLoading,
    // Error states
    moviesError,
    theatersError,
    roomsError,
    existingShowtimesError,
    createShowtimeError
  } = useSelector(state => state.showtimeWizard)

  // Load initial data when wizard opens
  useEffect(() => {
    if (wizardVisible) {
      dispatch(clearErrors())
      dispatch(fetchMoviesForWizard({ page: 1, size: 100 }))
      dispatch(fetchTheatersForWizard({ page: 1, size: 100 }))
    }
  }, [wizardVisible, dispatch])

  // Load rooms when theater is selected
  useEffect(() => {
    if (selectedTheaterId) {
      dispatch(fetchRoomsByTheater(selectedTheaterId))
    }
  }, [selectedTheaterId, dispatch])

  // Load existing showtimes when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && selectedTheaterId && selectedMovieId && selectedDate) {
      console.log('Fetching existing showtimes with params:', {
        theaterId: selectedTheaterId,
        movieId: selectedMovieId,
        date: selectedDate
      })
      dispatch(fetchExistingShowtimes({
        theaterId: selectedTheaterId,
        movieId: selectedMovieId,
        date: selectedDate
      }))
    }
  }, [currentStep, selectedTheaterId, selectedMovieId, selectedDate, dispatch])

  const handleMovieSelect = (movieId) => {
    const movie = movies.find(m => m.id === movieId)
    if (movie) {
      dispatch(setSelectedMovie(movie))
    }
  }

  const handleTheaterSelect = (theaterId) => {
    const theater = theaters.find(t => t.theaterId === theaterId)
    if (theater) {
      dispatch(setSelectedTheater(theater))
    }
  }

  const handleRoomSelect = (roomId) => {
    const room = rooms.find(r => r.roomId === roomId)
    if (room) {
      dispatch(setSelectedRoom(room))
    }
  }

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date ? date.format('YYYY-MM-DD') : null))
  }

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return selectedMovieId && selectedTheaterId && selectedRoomId && selectedDate
    }
    if (currentStep === 2) {
      return selectedStartTime && selectedEndTime && selectedPrice
    }
    return false
  }

  // Generate time slots for timeline (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 8 // 8:00 AM
    const endHour = 24 // 12:00 AM (midnight)
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = dayjs().hour(hour).minute(minute).second(0).millisecond(0)
        slots.push({
          time: time.format('HH:mm'),
          datetime: time.format('YYYY-MM-DDTHH:mm:ss'),
          display: time.format('HH:mm')
        })
      }
    }
    return slots
  }

  // Check if a time slot is occupied by existing showtime
  const isTimeSlotOccupied = (slotTime) => {
    // If there's an error loading existing showtimes, assume no conflicts
    if (existingShowtimesError) return false
    if (!existingShowtimes || existingShowtimes.length === 0) return false
    
    try {
      const slotDateTime = dayjs(`${selectedDate}T${slotTime}:00`)
      
      return existingShowtimes.some(showtime => {
        // Only check showtimes for the same room
        if (showtime.roomId !== selectedRoomId) return false
        
        try {
          const startTime = dayjs(showtime.startTime)
          const endTime = dayjs(showtime.endTime)
          
          // Check if both dates are valid
          if (!startTime.isValid() || !endTime.isValid() || !slotDateTime.isValid()) {
            console.warn('Invalid date in showtime:', showtime)
            return false
          }
          
          // Check if slot time falls within existing showtime period (inclusive)
          return slotDateTime.isBetween(startTime, endTime, null, '[]')
        } catch (error) {
          console.error('Error checking showtime overlap:', error, showtime)
          return false
        }
      })
    } catch (error) {
      console.error('Error in isTimeSlotOccupied:', error)
      return false
    }
  }

  // Check if a time slot is in the past
  const isTimeSlotPast = (slotTime) => {
    try {
      const slotDateTime = dayjs(`${selectedDate}T${slotTime}:00`)
      const now = dayjs()
      
      if (!slotDateTime.isValid()) {
        console.warn('Invalid slot date time:', selectedDate, slotTime)
        return true // Treat invalid dates as past
      }
      
      return slotDateTime.isBefore(now)
    } catch (error) {
      console.error('Error in isTimeSlotPast:', error)
      return true // Treat errors as past to be safe
    }
  }

  // Get time slot status
  const getTimeSlotStatus = (slotTime) => {
    if (isTimeSlotPast(slotTime)) return 'past'
    if (isTimeSlotOccupied(slotTime)) return 'occupied'
    return 'available'
  }

  // Handle time slot selection
  const handleTimeSlotClick = (slotTime) => {
    const status = getTimeSlotStatus(slotTime)
    if (status !== 'available') return

    // Calculate end time based on movie duration
    const startDateTime = dayjs(`${selectedDate}T${slotTime}:00`)
    const endDateTime = startDateTime.add(selectedMovie.durationMinutes, 'minute')
    
    dispatch(setSelectedTimeSlot({
      startTime: startDateTime.format('YYYY-MM-DDTHH:mm:ss'),
      endTime: endDateTime.format('YYYY-MM-DDTHH:mm:ss')
    }))
  }

  // Handle price change
  const handlePriceChange = (price) => {
    dispatch(setSelectedPrice(price))
  }

  // Handle create showtime
  const handleCreateShowtime = async () => {
    if (!selectedStartTime || !selectedEndTime || !selectedPrice) {
      message.error('Vui lòng chọn thời gian và nhập giá vé')
      return
    }

    try {
      await dispatch(createShowtime({
        movieId: selectedMovieId,
        roomId: selectedRoomId,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        price: selectedPrice
      })).unwrap()
      
      message.success('Tạo suất chiếu thành công!')
    } catch (error) {
      message.error(error || 'Có lỗi xảy ra khi tạo suất chiếu')
    }
  }

  const handleNext = () => {
    if (canProceedToNextStep()) {
      dispatch(nextStep())
    }
  }

  const handlePrev = () => {
    dispatch(prevStep())
  }

  const handleClose = () => {
    dispatch(closeWizard())
  }

  const steps = [
    {
      title: 'Chọn thông tin cơ bản',
      description: 'Phim, rạp, phòng, ngày chiếu',
      icon: <CalendarOutlined />
    },
    {
      title: 'Thiết lập suất chiếu',
      description: 'Thời gian, giá vé',
      icon: <ClockCircleOutlined />
    }
  ]

  const renderStep1 = () => (
    <div className="wizard-step-content">
      <Row gutter={[24, 24]}>
        {/* Movie Selection */}
        <Col span={24}>
          <Card className="selection-card movie-selection-card" title={
            <Space>
              <VideoCameraOutlined style={{ color: '#1890ff' }} />
              <span>Chọn phim</span>
            </Space>
          }>
            {moviesError && (
              <Alert 
                message="Lỗi tải danh sách phim" 
                description={moviesError} 
                type="error" 
                style={{ marginBottom: 16 }} 
              />
            )}
            <Spin spinning={moviesLoading}>
              <Select
                placeholder={selectedMovie ? "Đã chọn phim (xem bên dưới)" : "Chọn phim để tạo suất chiếu"}
                style={{ width: '100%' }}
                size="large"
                value={selectedMovie ? null : selectedMovieId}
                onChange={handleMovieSelect}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                dropdownStyle={{ zIndex: 10000 }}
                getPopupContainer={() => document.body}
              >
                {movies.map(movie => (
                  <Option key={movie.id} value={movie.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        width={40}
                        height={60}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{movie.title}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {movie.durationMinutes} phút • {movie.director?.name}
                        </div>
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Spin>
            
            {selectedMovie && (
              <div className="movie-preview" style={{ 
                marginTop: 16, 
                padding: 12, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 8,
                border: '1px solid #e9ecef'
              }}>
                <Row gutter={12} align="middle">
                  <Col flex="none">
                    <Image
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      width={60}
                      height={90}
                      style={{ borderRadius: 6, objectFit: 'cover' }}
                    />
                  </Col>
                  <Col flex="auto">
                    <div>
                      <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                        {selectedMovie.title}
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 13, color: '#666' }}>
                          {selectedMovie.durationMinutes} phút • {selectedMovie.director?.name} • {selectedMovie.language}
                        </Text>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        {selectedMovie.genres?.slice(0, 3).map(genre => (
                          <Tag key={genre.genreId} color="blue" size="small" style={{ margin: '0 4px 2px 0', fontSize: 11 }}>
                            {genre.genreName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col flex="none">
                    <Button 
                      size="small" 
                      type="link" 
                      onClick={() => dispatch(setSelectedMovie(null))}
                      style={{ color: '#1890ff' }}
                    >
                      Chọn lại
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>

        {/* Theater Selection */}
        <Col span={12}>
          <Card className="selection-card" title={
            <Space>
              <HomeOutlined style={{ color: '#52c41a' }} />
              <span>Chọn rạp</span>
            </Space>
          }>
            {theatersError && (
              <Alert 
                message="Lỗi tải danh sách rạp" 
                description={theatersError} 
                type="error" 
                style={{ marginBottom: 16 }} 
              />
            )}
            <Spin spinning={theatersLoading}>
              <Select
                placeholder={selectedTheater ? "Đã chọn rạp (xem bên dưới)" : "Chọn rạp chiếu"}
                style={{ width: '100%' }}
                size="large"
                value={selectedTheater ? null : selectedTheaterId}
                onChange={handleTheaterSelect}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                dropdownStyle={{ zIndex: 10000 }}
                getPopupContainer={() => document.body}
              >
                {theaters.map(theater => (
                  <Option key={theater.theaterId} value={theater.theaterId}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{theater.theaterName}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {theater.district}, {theater.city}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Spin>

            {selectedTheater && (
              <div style={{ 
                marginTop: 12, 
                padding: 10, 
                backgroundColor: '#f6ffed', 
                borderRadius: 6, 
                border: '1px solid #b7eb8f',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <Text strong style={{ color: '#52c41a', fontSize: 14 }}>
                    {selectedTheater.theaterName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedTheater.district}, {selectedTheater.city}
                  </Text>
                </div>
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => dispatch(setSelectedTheater(null))}
                  style={{ color: '#52c41a' }}
                >
                  Chọn lại
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Room Selection */}
        <Col span={12}>
          <Card className="selection-card" title={
            <Space>
              <HomeOutlined style={{ color: '#faad14' }} />
              <span>Chọn phòng</span>
            </Space>
          }>
            {roomsError && (
              <Alert 
                message="Lỗi tải danh sách phòng" 
                description={roomsError} 
                type="error" 
                style={{ marginBottom: 16 }} 
              />
            )}
            <Spin spinning={roomsLoading}>
              <Select
                placeholder={
                  selectedRoom ? "Đã chọn phòng (xem bên dưới)" :
                  selectedTheaterId ? "Chọn phòng chiếu" : "Vui lòng chọn rạp trước"
                }
                style={{ width: '100%' }}
                size="large"
                value={selectedRoom ? null : selectedRoomId}
                onChange={handleRoomSelect}
                disabled={!selectedTheaterId}
                dropdownStyle={{ zIndex: 10000 }}
                getPopupContainer={() => document.body}
              >
                {rooms.map(room => (
                  <Option key={room.roomId} value={room.roomId}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{room.roomName}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {room.totalSeats} ghế • {room.screenType} • {room.soundSystem}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Spin>

            {selectedRoom && (
              <div style={{ 
                marginTop: 12, 
                padding: 10, 
                backgroundColor: '#fffbe6', 
                borderRadius: 6, 
                border: '1px solid #ffe58f',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <Text strong style={{ color: '#faad14', fontSize: 14 }}>
                    {selectedRoom.roomName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedRoom.totalSeats} ghế • {selectedRoom.screenType}
                  </Text>
                </div>
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => dispatch(setSelectedRoom(null))}
                  style={{ color: '#faad14' }}
                >
                  Chọn lại
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Date Selection */}
        <Col span={24}>
          <Card className="selection-card" title={
            <Space>
              <CalendarOutlined style={{ color: '#f5222d' }} />
              <span>Chọn ngày chiếu</span>
            </Space>
          }>
            <DatePicker
              placeholder="Chọn ngày chiếu phim"
              style={{ width: '100%' }}
              size="large"
              format="DD/MM/YYYY"
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateSelect}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              getPopupContainer={() => document.body}
            />

            {selectedDate && (
              <div style={{ 
                marginTop: 12, 
                padding: 10, 
                backgroundColor: '#fff2e8', 
                borderRadius: 6, 
                border: '1px solid #ffbb96' 
              }}>
                <Text strong style={{ color: '#f5222d', fontSize: 14 }}>
                  📅 {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )

  const renderStep2 = () => {
    const timeSlots = generateTimeSlots()
    const rooms = selectedRoom ? [selectedRoom] : []

    console.log('Rendering Step 2 with data:', {
      timeSlots: timeSlots.length,
      rooms: rooms.length,
      existingShowtimes: existingShowtimes?.length || 0,
      existingShowtimesLoading,
      existingShowtimesError,
      selectedRoom,
      selectedMovie,
      selectedTheater,
      selectedDate
    })

    return (
      <div className="wizard-step-content">
        <Spin spinning={existingShowtimesLoading}>
          {/* {existingShowtimesError && (
            <Alert 
              message="Lỗi tải danh sách suất chiếu" 
              description={`${existingShowtimesError}. Timeline vẫn sẽ hiển thị để bạn có thể chọn thời gian.`} 
              type="warning" 
              style={{ marginBottom: 16 }} 
              showIcon
            />
          )} */}

          {/* Summary Info */}
          <Card className="step2-summary" style={{ marginBottom: 24 }}>
            <Row gutter={16} align="middle">
              <Col flex="none">
                <Image
                  src={selectedMovie?.posterUrl}
                  alt={selectedMovie?.title}
                  width={80}
                  height={120}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  {selectedMovie?.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {selectedMovie?.durationMinutes} phút • {selectedTheater?.theaterName} • {selectedRoom?.roomName}
                </Text>
                <br />
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                  📅 {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Debug Info (remove in production) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <Card title="Debug Info" size="small" style={{ marginBottom: 16, fontSize: 12 }}>
              <div>
                <strong>Selected Data:</strong> Movie ID: {selectedMovieId}, Theater ID: {selectedTheaterId}, Room ID: {selectedRoomId}, Date: {selectedDate}
              </div>
              <div>
                <strong>Existing Showtimes:</strong> {existingShowtimes?.length || 0} items
              </div>
              <div>
                <strong>Loading:</strong> {existingShowtimesLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Error:</strong> {existingShowtimesError || 'None'}
              </div>
              <div>
                <strong>Time Slots:</strong> {timeSlots.length} generated
              </div>
              <div>
                <strong>Rooms:</strong> {rooms.length} available
              </div>
            </Card>
          )} */}

          {/* Timeline */}
          <Card title={
            <Space>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <span>Chọn thời gian chiếu</span>
            </Space>
          } className="timeline-card">
            
            {/* Legend */}
            <div className="timeline-legend" style={{ marginBottom: 16 }}>
              <Space size="large">
                <Space>
                  <div className="legend-item available"></div>
                  <Text>Trống</Text>
                </Space>
                <Space>
                  <div className="legend-item past"></div>
                  <Text>Đã qua</Text>
                </Space>
                <Space>
                  <div className="legend-item occupied"></div>
                  <Text>Đã có suất chiếu</Text>
                </Space>
                <Space>
                  <div className="legend-item selected"></div>
                  <Text>Đã chọn</Text>
                </Space>
              </Space>
            </div>

            {/* Time Header */}
            <div className="timeline-header">
              <div className="room-label"></div>
              {timeSlots.map(slot => (
                <div key={slot.time} className="time-label">
                  {slot.display}
                </div>
              ))}
            </div>

            {/* Room Timeline */}
            {rooms.length > 0 ? (
              rooms.map(room => (
                <div key={room.roomId} className="room-timeline">
                  <div className="room-label">
                    <Text strong>{room.roomName}</Text>
                  </div>
                  {timeSlots.map(slot => {
                    const status = getTimeSlotStatus(slot.time)
                    const isSelected = selectedStartTime && 
                      dayjs(selectedStartTime).format('HH:mm') === slot.time
                    
                    return (
                      <Tooltip
                        key={slot.time}
                        title={
                          status === 'past' ? 'Thời gian đã qua' :
                          status === 'occupied' ? 'Đã có suất chiếu' :
                          status === 'available' ? `Chọn ${slot.display}` : ''
                        }
                      >
                        <div
                          className={`time-slot ${status} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleTimeSlotClick(slot.time)}
                          style={{
                            cursor: status === 'available' ? 'pointer' : 'not-allowed'
                          }}
                        >
                        </div>
                      </Tooltip>
                    )
                  })}
                </div>
              ))
            ) : (
              <div style={{ padding: 20, textAlign: 'center' }}>
                <Alert 
                  message="Không có phòng chiếu" 
                  description="Vui lòng quay lại Step 1 và chọn lại rạp và phòng chiếu." 
                  type="info" 
                  showIcon 
                />
              </div>
            )}
          </Card>

          {/* Selected Time & Price */}
          {selectedStartTime && selectedEndTime && (
            <Card title="Thông tin suất chiếu" style={{ marginTop: 24 }}>
              <Row gutter={24}>
                <Col span={12}>
                  <div>
                    <Text strong>Thời gian chiếu:</Text>
                    <br />
                    <Text style={{ fontSize: 16, color: '#1890ff' }}>
                      {dayjs(selectedStartTime).format('HH:mm')} - {dayjs(selectedEndTime).format('HH:mm')}
                    </Text>
                    <br />
                    <Text type="secondary">
                      Thời lượng: {selectedMovie?.durationMinutes} phút
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>Giá vé (VNĐ):</Text>
                    <br />
                    <InputNumber
                      placeholder="Nhập giá vé"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      step={1000}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      value={selectedPrice}
                      onChange={handlePriceChange}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {createShowtimeError && (
            <Alert 
              message="Lỗi tạo suất chiếu" 
              description={createShowtimeError} 
              type="error" 
              style={{ marginTop: 16 }} 
            />
          )}
        </Spin>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      default:
        return null
    }
  }

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            <VideoCameraOutlined /> Thêm suất chiếu mới
          </Title>
        </div>
      }
      open={wizardVisible}
      onCancel={handleClose}
      width={680}
      footer={null}
      className="showtime-wizard-modal"
      destroyOnClose
      style={{ top: 16 }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <div className="wizard-container">
        {/* Steps */}
        <div style={{ marginBottom: 32 }}>
          <Steps
            current={currentStep - 1}
            items={steps}
            size="small"
          />
        </div>

        {/* Step Content */}
        <div className="wizard-content">
          {renderStepContent()}
        </div>

        <Divider />

        {/* Navigation */}
        <div className="wizard-navigation">
          <Space>
            <Button 
              onClick={handleClose}
              size="large"
            >
              Hủy
            </Button>
            {currentStep > 1 && (
              <Button 
                onClick={handlePrev}
                size="large"
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
            )}
            {currentStep < totalSteps && (
              <Button 
                type="primary"
                onClick={handleNext}
                size="large"
                disabled={!canProceedToNextStep()}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Tiếp tục
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button 
                type="primary"
                size="large"
                loading={createShowtimeLoading}
                disabled={!canProceedToNextStep()}
                onClick={handleCreateShowtime}
              >
                Tạo suất chiếu
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  )
}

export default AddShowtimeWizard
