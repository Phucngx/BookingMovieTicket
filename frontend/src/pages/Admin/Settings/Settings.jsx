import React, { useState } from 'react'
import { Card, Form, Input, Button, Switch, Select, Typography, Row, Col, message, Divider } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const Settings = () => {
  console.log('Settings component is rendering')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async (values) => {
    setLoading(true)
    try {
      // TODO: Implement save settings API
      console.log('Save settings:', values)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      message.success('Cài đặt đã được lưu thành công!')
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    message.info('Đã reset về cài đặt mặc định')
  }

  // Test if component renders
  if (!form) {
    console.error('Form is not initialized')
    return <div>Error: Form not initialized</div>
  }

  return (
    <div>
      <div style={{ padding: '16px', backgroundColor: '#e6f7ff', border: '2px solid #1890ff', borderRadius: '4px', marginBottom: '16px' }}>
        <Text strong style={{ color: '#1890ff' }}>🎯 Settings Component is RENDERING!</Text>
        <br />
        <Text>This proves Settings component is working</Text>
      </div>
      <Title level={2}>Cài đặt hệ thống</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          siteName: 'Booking Movie Ticket',
          siteDescription: 'Hệ thống đặt vé xem phim trực tuyến',
          emailNotifications: true,
          smsNotifications: false,
          maintenanceMode: false,
          maxFileSize: '10',
          allowedFileTypes: ['jpg', 'png', 'gif'],
          defaultLanguage: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Thông tin website" style={{ height: '100%' }}>
              <Form.Item
                name="siteName"
                label="Tên website"
                rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}
              >
                <Input placeholder="Nhập tên website" />
              </Form.Item>

              <Form.Item
                name="siteDescription"
                label="Mô tả website"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả website' }]}
              >
                <TextArea 
                  placeholder="Nhập mô tả website" 
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                name="defaultLanguage"
                label="Ngôn ngữ mặc định"
              >
                <Select placeholder="Chọn ngôn ngữ">
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timezone"
                label="Múi giờ"
              >
                <Select placeholder="Chọn múi giờ">
                  <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</Option>
                  <Option value="UTC">UTC</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Cài đặt thông báo" style={{ height: '100%' }}>
              <Form.Item
                name="emailNotifications"
                label="Thông báo qua email"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                label="Thông báo qua SMS"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maintenanceMode"
                label="Chế độ bảo trì"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Text type="secondary">
                Khi bật chế độ bảo trì, website sẽ hiển thị thông báo bảo trì cho người dùng
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Cài đặt upload file">
              <Form.Item
                name="maxFileSize"
                label="Kích thước file tối đa (MB)"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước file tối đa' }]}
              >
                <Input type="number" placeholder="Nhập kích thước file tối đa" min={1} />
              </Form.Item>

              <Form.Item
                name="allowedFileTypes"
                label="Loại file được phép"
              >
                <Select mode="tags" placeholder="Nhập loại file">
                  <Option value="jpg">JPG</Option>
                  <Option value="png">PNG</Option>
                  <Option value="gif">GIF</Option>
                  <Option value="pdf">PDF</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Cài đặt bảo mật">
              <Form.Item
                name="sessionTimeout"
                label="Thời gian hết hạn phiên (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian hết hạn phiên' }]}
              >
                <Input type="number" placeholder="Nhập thời gian hết hạn phiên" min={5} />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label="Số lần đăng nhập sai tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số lần đăng nhập sai tối đa' }]}
              >
                <Input type="number" placeholder="Nhập số lần đăng nhập sai tối đa" min={3} />
              </Form.Item>

              <Form.Item
                name="enableTwoFactor"
                label="Bật xác thực 2 bước"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu cài đặt
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default Settings
