import React from 'react'
import { Row, Col, Card, Statistic, Typography, Progress } from 'antd'
import { 
  VideoCameraOutlined, 
  BankOutlined, 
  UserOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'

const { Title } = Typography

const Dashboard = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const stats = {
    totalMovies: 156,
    totalTheaters: 42,
    totalUsers: 1250,
    totalRevenue: 1250000000, // 1.25 tỷ VND
    movieGrowth: 12.5,
    theaterGrowth: 8.3,
    userGrowth: 15.2,
    revenueGrowth: 22.1
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

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số phim"
            value={stats.totalMovies}
            icon={<VideoCameraOutlined />}
            growth={stats.movieGrowth}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số rạp"
            value={stats.totalTheaters}
            icon={<BankOutlined />}
            growth={stats.theaterGrowth}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số người dùng"
            value={stats.totalUsers}
            icon={<UserOutlined />}
            growth={stats.userGrowth}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh thu tháng"
            value={stats.totalRevenue}
            icon={<DollarOutlined />}
            growth={stats.revenueGrowth}
            color="#fa8c16"
            suffix="VND"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê phim theo thể loại" style={{ height: 300 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Hành động</span>
                <span>45 phim</span>
              </div>
              <Progress percent={75} strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Hài hước</span>
                <span>32 phim</span>
              </div>
              <Progress percent={53} strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Lãng mạn</span>
                <span>28 phim</span>
              </div>
              <Progress percent={47} strokeColor="#722ed1" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Kinh dị</span>
                <span>18 phim</span>
              </div>
              <Progress percent={30} strokeColor="#fa8c16" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Khác</span>
                <span>33 phim</span>
              </div>
              <Progress percent={55} strokeColor="#f5222d" />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Thống kê rạp theo khu vực" style={{ height: 300 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>TP. Hồ Chí Minh</span>
                <span>15 rạp</span>
              </div>
              <Progress percent={85} strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Hà Nội</span>
                <span>12 rạp</span>
              </div>
              <Progress percent={68} strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Đà Nẵng</span>
                <span>8 rạp</span>
              </div>
              <Progress percent={45} strokeColor="#722ed1" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Cần Thơ</span>
                <span>4 rạp</span>
              </div>
              <Progress percent={22} strokeColor="#fa8c16" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Khác</span>
                <span>3 rạp</span>
              </div>
              <Progress percent={17} strokeColor="#f5222d" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
