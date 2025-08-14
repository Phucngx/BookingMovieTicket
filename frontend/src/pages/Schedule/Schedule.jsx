import React, { useState } from 'react'
import { Layout, Typography, Row, Col, Card, Tag, Space, Button, Tabs } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, PlayCircleOutlined, ClockCircleOutlined as ClockIcon } from '@ant-design/icons'
import NowShowing from './NowShowing'
import './Schedule.css'

const { Content } = Layout
const { Title, Text } = Typography

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('now-showing')

  const schedules = [
    {
      id: 1,
      movie: 'Thanh Gươm Diệt Quỷ',
      cinema: 'Beta Quang Trung',
      date: '15/08/2024',
      time: '19:00',
      duration: '120 phút',
      price: '95,000 VNĐ',
      available: true
    },
    {
      id: 2,
      movie: 'Zombie Cùng Ba',
      cinema: 'Cinestar Hai Bà Trưng',
      date: '08/08/2024',
      time: '20:30',
      duration: '105 phút',
      price: '75,000 VNĐ',
      available: true
    },
    {
      id: 3,
      movie: 'Conan Movie',
      cinema: 'DCINE Bến Thành',
      date: '25/07/2024',
      time: '18:00',
      duration: '110 phút',
      price: '85,000 VNĐ',
      available: false
    }
  ]

  return (
    <Content className="schedule-content">
      <div className="container">
        <Title level={2} className="page-title">
          Lịch chiếu phim
        </Title>
        
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="schedule-tabs"
          items={[
            {
              key: 'now-showing',
              label: (
                <span>
                  <PlayCircleOutlined />
                  Đang chiếu
                </span>
              ),
              children: <NowShowing />
            },
            {
              key: 'coming-soon',
              label: (
                <span>
                  <ClockIcon />
                  Sắp chiếu
                </span>
              ),
              children: <div>Màn hình Sắp chiếu - Đang phát triển</div>
            },
            {
              key: 'schedule-list',
              label: (
                <span>
                  <CalendarOutlined />
                  Lịch chiếu chi tiết
                </span>
              ),
              children: (
                <div className="schedule-list-content">
                  <Row gutter={[24, 24]}>
                    {schedules.map((schedule) => (
                      <Col xs={24} md={12} lg={8} key={schedule.id}>
                        <Card 
                          className={`schedule-card ${!schedule.available ? 'unavailable' : ''}`}
                          hoverable
                        >
                          <div className="schedule-header">
                            <Title level={4} className="movie-title">
                              {schedule.movie}
                            </Title>
                            <Tag color={schedule.available ? 'green' : 'red'}>
                              {schedule.available ? 'Còn vé' : 'Hết vé'}
                            </Tag>
                          </div>
                          
                          <div className="schedule-info">
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Space>
                                <EnvironmentOutlined />
                                <Text>{schedule.cinema}</Text>
                              </Space>
                              
                              <Space>
                                <CalendarOutlined />
                                <Text>{schedule.date}</Text>
                              </Space>
                              
                              <Space>
                                <ClockCircleOutlined />
                                <Text>{schedule.time} - {schedule.duration}</Text>
                              </Space>
                              
                              <div className="schedule-price">
                                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                  {schedule.price}
                                </Text>
                              </div>
                            </Space>
                          </div>
                          
                          <div className="schedule-actions">
                            <Button 
                              type="primary" 
                              size="large" 
                              block
                              disabled={!schedule.available}
                            >
                              {schedule.available ? 'Đặt vé ngay' : 'Hết vé'}
                            </Button>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )
            }
          ]}
        />
      </div>
    </Content>
  )
}

export default Schedule
