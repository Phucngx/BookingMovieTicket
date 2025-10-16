import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, Statistic, Typography, Progress, Select, Spin, message, Table } from 'antd'
import { 
  VideoCameraOutlined, 
  BankOutlined, 
  UserOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { movieService } from '../../../services/movieService'
import { theaterService } from '../../../services/theaterService'
import { userService } from '../../../services/userService'
import { revenueService } from '../../../services/revenueService'

const { Title } = Typography
const { Option } = Select

// Simple Chart Component using Canvas
const SimpleChart = ({ data, width = 700, height = 350 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)

    const padding = 60
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.revenue))
    const minValue = Math.min(...data.map(d => d.revenue))

    // Draw axes
    ctx.strokeStyle = '#d9d9d9'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 0.5
    for (let i = 1; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw line chart
    if (data.length > 1) {
      ctx.strokeStyle = '#1890ff'
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((point.revenue - minValue) / (maxValue - minValue)) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw points
      ctx.fillStyle = '#1890ff'
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((point.revenue - minValue) / (maxValue - minValue)) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw labels with smart spacing
    ctx.fillStyle = '#666'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'

    // Calculate how many labels to show to avoid overlap
    const maxLabels = Math.floor(chartWidth / 80) // Minimum 80px between labels
    const labelStep = Math.max(1, Math.floor(data.length / maxLabels))

    data.forEach((point, index) => {
      // Only show every nth label to avoid overlap
      if (index % labelStep === 0 || index === data.length - 1) {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding + 20
        
        // Rotate text for better fit
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(-Math.PI / 4) // 45 degree rotation
        ctx.fillText(point.period, 0, 0)
        ctx.restore()
      }
    })

    // Draw Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (maxValue - minValue) * (5 - i) / 5
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(new Intl.NumberFormat('vi-VN').format(Math.round(value)), padding - 10, y + 4)
    }
  }, [data, width, height])

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: '1px solid #f0f0f0', borderRadius: '4px', cursor: 'pointer' }}
        title="Biểu đồ doanh thu - Hover để xem chi tiết"
      />
    </div>
  )
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [revenueData, setRevenueData] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Fetch revenue data when period changes
  useEffect(() => {
    fetchRevenueData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch movies, theaters, and users data in parallel
      const [moviesRes, theatersRes, usersRes] = await Promise.all([
        movieService.getMoviesForAdmin(1, 1), // Get first page to get total count
        theaterService.getAllTheaters({ page: 1, size: 1 }), // Get first page to get total count
        userService.getAllAccounts({ page: 1, size: 1 }) // Get first page to get total count
      ])

      setStats({
        totalMovies: moviesRes.data?.totalElements || 0,
        totalTheaters: theatersRes.data?.totalElements || 0,
        totalUsers: usersRes.data?.totalElements || 0,
        totalRevenue: 0 // Will be updated by revenue data
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      message.error('Không thể tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchRevenueData = async () => {
    try {
      const revenueRes = await revenueService.getRevenueReport(selectedPeriod)
      
      if (revenueRes.code === 1000 && revenueRes.data) {
        setRevenueData(revenueRes.data)
        
        // Update total revenue in stats
        setStats(prev => ({
          ...prev,
          totalRevenue: revenueRes.data.total || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      message.error('Không thể tải dữ liệu doanh thu')
    }
  }

  const StatCard = ({ title, value, icon, growth, color = '#1890ff' }) => (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color }}
        suffix={growth && (
          <span style={{ fontSize: '12px', color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
            {growth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(growth)}%
          </span>
        )}
      />
    </Card>
  )

  // Prepare revenue table data
  const revenueTableData = revenueData ? revenueData.labels.map((label, index) => ({
    key: index,
    period: label,
    revenue: revenueData.series[0]?.data[index] || 0,
    formattedRevenue: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(revenueData.series[0]?.data[index] || 0)
  })) : []

  // Calculate max revenue for progress bar percentage
  const maxRevenue = revenueData ? Math.max(...revenueData.series[0]?.data || [0]) : 0

  const revenueColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'formattedRevenue',
      key: 'revenue',
    },
    {
      title: 'Tỷ lệ',
      key: 'progress',
      render: (_, record) => (
        <Progress 
          percent={maxRevenue > 0 ? Math.round((record.revenue / maxRevenue) * 100) : 0}
          strokeColor="#1890ff"
          size="small"
        />
      ),
    },
  ]

  const periodOptions = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm nay' }
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số phim"
            value={stats.totalMovies}
            icon={<VideoCameraOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số rạp"
            value={stats.totalTheaters}
            icon={<BankOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số người dùng"
            value={stats.totalUsers}
            icon={<UserOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh thu"
            value={stats.totalRevenue}
            icon={<DollarOutlined />}
            color="#fa8c16"
            suffix="VND"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Biểu đồ doanh thu" 
            extra={
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: 120 }}
              >
                {periodOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            }
            style={{ height: 400 }}
          >
            {revenueData ? (
              <SimpleChart 
                data={revenueTableData}
                width={600}
                height={320}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu doanh thu...</div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Chi tiết doanh thu" 
            style={{ height: 400 }}
          >
            {revenueData ? (
              <Table 
                dataSource={revenueTableData}
                columns={revenueColumns}
                pagination={false}
                size="small"
                scroll={{ y: 280 }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu doanh thu...</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
