import React, { useState } from 'react'
import { Modal, Form, Input, Button, Tabs, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/slices/userSlice'
import './AuthModal.css'

const { TabPane } = Tabs

const AuthModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleLogin = async (values) => {
    setLoading(true)
    try {
      console.log('Đang gọi API đăng nhập với:', { username: values.email, password: values.password })
      
      // Dispatch login action
      const result = await dispatch(loginUser({
        username: values.email,
        password: values.password
      })).unwrap()
      
      console.log('Login result:', result)
      
      message.success('Đăng nhập thành công!')
      onCancel()
      form.resetFields()
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
      message.error(error || 'Đăng nhập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Đăng ký thành công!')
      onCancel()
      form.resetFields()
    } catch (error) {
      message.error('Đăng ký thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      className="auth-modal"
      centered
    >
      <div className="auth-container">
        <div className="auth-header">
          <h2>Chào mừng đến với CGV</h2>
          <p>Đăng nhập hoặc tạo tài khoản để trải nghiệm tốt nhất</p>
        </div>

        <Tabs defaultActiveKey="login" className="auth-tabs">
          <TabPane tab="Đăng nhập" key="login">
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên đăng nhập"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="auth-button"
                  block
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>
          </TabPane>

          <TabPane tab="Đăng ký" key="register">
            <Form
              form={form}
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Họ và tên"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="auth-button"
                  block
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        {/* <Divider className="auth-divider">Hoặc</Divider>

        <div className="social-login">
          <Button className="social-button facebook" block>
            <i className="fab fa-facebook-f"></i>
            Tiếp tục với Facebook
          </Button>
          <Button className="social-button google" block>
            <i className="fab fa-google"></i>
            Tiếp tục với Google
          </Button>
        </div> */}
      </div>
    </Modal>
  )
}

export default AuthModal
