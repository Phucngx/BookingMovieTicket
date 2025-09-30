import React from 'react'
import { Card, Typography, Button } from 'antd'

const { Title, Text } = Typography

const SettingsSimple = () => {
  console.log('SettingsSimple component is rendering')
  
  return (
    <div>
      <div style={{ padding: '16px', backgroundColor: '#e6f7ff', border: '2px solid #1890ff', borderRadius: '4px', marginBottom: '16px' }}>
        <Text strong style={{ color: '#1890ff' }}>🎯 SettingsSimple Component is RENDERING!</Text>
        <br />
        <Text>This is a simple test version</Text>
      </div>
      
      <Title level={2}>Cài đặt hệ thống (Simple Version)</Title>
      
      <Card>
        <Text>Đây là trang cài đặt hệ thống đơn giản để test.</Text>
        <br />
        <Button type="primary" style={{ marginTop: '16px' }}>
          Test Button
        </Button>
      </Card>
    </div>
  )
}

export default SettingsSimple
