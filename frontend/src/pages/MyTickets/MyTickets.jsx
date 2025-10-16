import React, { useEffect, useState } from 'react'
import { Card, Typography, Select, Table, Tag, Space, Image, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyTickets, setSelectedPeriod } from '../../store/slices/bookingsSlice'
import './MyTickets.css'

const { Title, Text } = Typography
const { Option } = Select

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' }
]

const MyTickets = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, userInfo } = useSelector(state => state.user)
  const {
    myTickets,
    ticketsTotal,
    ticketsPage,
    ticketsPageSize,
    selectedPeriod,
    loading,
    error
  } = useSelector(state => state.bookings)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (!isAuthenticated || !userInfo?.accountId) return
    const token = localStorage.getItem('accessToken')
    dispatch(fetchMyTickets({ accountId: userInfo.accountId, period: selectedPeriod, page, size: pageSize, token }))
  }, [dispatch, isAuthenticated, userInfo?.accountId, selectedPeriod, page, pageSize])

  const handlePeriodChange = (value) => {
    dispatch(setSelectedPeriod(value))
    setPage(1)
  }

  const columns = [
    {
      title: 'Vé',
      key: 'ticket',
      render: (_, record) => (
        <Space align="start">
          <Image width={56} src={record.qrCode} alt="QR" preview={false} />
          <div>
            <Text strong>{record.movieName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>#{record.bookingId}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <div>
          <div><Text>Giờ chiếu: </Text><Text strong>{new Date(record.startTime).toLocaleString('vi-VN')}</Text></div>
          <div><Text>Giờ kết thúc: </Text><Text>{new Date(record.endTime).toLocaleString('vi-VN')}</Text></div>
        </div>
      )
    },
    {
      title: 'Rạp / Phòng',
      key: 'theater',
      render: (_, record) => (
        <div>
          <div><Text strong>{record.theaterName}</Text></div>
          <div><Tag color="blue">{record.roomName}</Tag></div>
        </div>
      )
    },
    {
      title: 'Ghế',
      dataIndex: 'seatNames',
      key: 'seats',
      render: (seats = []) => seats.length ? seats.map(s => <Tag key={s}>{s}</Tag>) : <Text type="secondary">-</Text>
    },
    {
      title: 'Bắp nước',
      dataIndex: 'foodNames',
      key: 'foods',
      render: (foods = []) => foods.length ? foods.map(f => <Tag key={f}>{f}</Tag>) : <Text type="secondary">-</Text>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dt) => new Date(dt).toLocaleString('vi-VN')
    }
  ]

  return (
    <div className="my-tickets-container">
      <div className="my-tickets-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>Vé đã mua</Title>
          {/* <Text type="secondary">Danh sách vé bạn đã mua theo khoảng thời gian</Text> */}
        </div>
        <div>
          <Text style={{ marginRight: 8 }}>Khoảng thời gian:</Text>
          <Select value={selectedPeriod} onChange={handlePeriodChange} style={{ width: 160 }}>
            {PERIOD_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="my-tickets-card">
        <Table
          columns={columns}
          dataSource={myTickets}
          rowKey="bookingId"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total: ticketsTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vé`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps) }
          }}
          locale={{ emptyText: error ? <Empty description={error} /> : <Empty description="Chưa có vé nào" /> }}
        />
      </Card>
    </div>
  )
}

export default MyTickets
