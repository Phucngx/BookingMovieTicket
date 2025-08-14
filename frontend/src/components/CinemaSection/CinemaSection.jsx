import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Row, Col, List, Avatar, Space, Tag } from 'antd'
import { EnvironmentOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { selectRegion } from '../../store/slices/regionsSlice'
import { setSelectedCinema } from '../../store/slices/cinemasSlice'
import './CinemaSection.css'

const { Title, Text } = Typography

const CinemaSection = () => {
  const dispatch = useDispatch()
  const { regions, selectedRegion } = useSelector((state) => state.regions)
  const { cinemas } = useSelector((state) => state.cinemas)

  const handleRegionSelect = (regionId) => {
    dispatch(selectRegion(regionId))
  }

  const handleCinemaSelect = (cinema) => {
    dispatch(setSelectedCinema(cinema))
  }

  const selectedRegionData = regions.find(r => r.id === selectedRegion)

  return (
    <div className="cinema-section">
      <div className="container">
        <Title level={2} className="section-title">
          Mua vé theo rạp
        </Title>
        
        <Row gutter={24}>
          {/* Khu vực */}
          <Col xs={24} md={8}>
            <div className="region-panel">
              <Title level={4} className="panel-title">
                Khu vực
              </Title>
              
              <List
                className="region-list"
                dataSource={regions}
                renderItem={(region) => (
                  <List.Item
                    className={`region-item ${region.isSelected ? 'selected' : ''}`}
                    onClick={() => handleRegionSelect(region.id)}
                  >
                    <Space>
                      <Text className="region-name">{region.name}</Text>
                      <Tag color={region.isSelected ? 'blue' : 'default'}>
                        {region.cinemaCount}
                      </Tag>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </Col>
          
          {/* Danh sách rạp */}
          <Col xs={24} md={16}>
            <div className="cinema-panel">
              <Title level={4} className="panel-title">
                {selectedRegionData?.name} ({selectedRegionData?.cinemaCount} rạp)
              </Title>
              
              <List
                className="cinema-list"
                dataSource={cinemas}
                renderItem={(cinema) => (
                  <List.Item className="cinema-item">
                    <div className="cinema-header">
                      <Space>
                        <Avatar 
                          src={cinema.logo} 
                          size={40}
                          className="cinema-logo"
                        />
                        <Title level={5} className="cinema-name">
                          {cinema.name}
                        </Title>
                      </Space>
                    </div>
                    
                    <div className="cinema-locations">
                      {cinema.locations.map((location) => (
                        <div
                          key={location.id}
                          className="location-item"
                          onClick={() => handleCinemaSelect(location)}
                        >
                          <Space>
                            <PlayCircleOutlined className="location-icon" />
                            <Text className="location-name">{location.name}</Text>
                            <Text type="secondary" className="location-address">
                              {location.address}
                            </Text>
                          </Space>
                        </div>
                      ))}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CinemaSection
