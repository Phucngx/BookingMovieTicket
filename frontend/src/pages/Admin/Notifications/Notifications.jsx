import React, { useState } from 'react'
import { Card, Typography, Form, Input, Button, message } from 'antd'
import { notificationService } from '../../../services/notificationService'

const { Title, Text } = Typography

const Notifications = () => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async (values) => {
    try {
      setSubmitting(true)
      const { title, message: content } = values
      await notificationService.sendNotification({ title, message: content })
      message.success('Đã gửi thông báo tới người dùng')
      form.resetFields()
    } catch (err) {
      message.error(err?.message || 'Gửi thông báo thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>Quản lý thông báo</Title>
        <Text type="secondary">Gửi thông báo tới tất cả người dùng đã đăng ký.</Text>

        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16, maxWidth: 640 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" maxLength={120} />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung thông báo" maxLength={1000} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Gửi thông báo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Notifications


