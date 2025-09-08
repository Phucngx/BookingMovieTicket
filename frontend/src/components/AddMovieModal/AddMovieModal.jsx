import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, DatePicker, InputNumber, Select, Button, message, Row, Col, Upload } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { movieService } from '../../services/movieService'
import './AddMovieModal.css'

const { TextArea } = Input
const { Option } = Select

const AddMovieModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [actors, setActors] = useState([])
  const [directors, setDirectors] = useState([])

  useEffect(() => {
    if (visible) {
      loadData()
    }
  }, [visible])

  const loadData = async () => {
    try {
      const [genresRes, actorsRes, directorsRes] = await Promise.all([
        movieService.getGenres(),
        movieService.getActors(),
        movieService.getDirectors()
      ])
      
      setGenres(genresRes.data?.content || [])
      setActors(actorsRes.data?.content || [])
      setDirectors(directorsRes.data?.content || [])
    } catch (error) {
      console.error('Load data error:', error)
      message.error('Không thể tải dữ liệu')
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const movieData = {
        title: values.title,
        description: values.description,
        releaseDate: values.releaseDate.format('YYYY-MM-DD'),
        language: values.language,
        country: values.country,
        posterUrl: values.posterUrl,
        durationMinutes: values.durationMinutes,
        genreId: values.genres,
        actorId: values.actors,
        directorId: values.director
      }

      const response = await movieService.createMovie(movieData)
      
      if (response.code === 1000) {
        message.success('Thêm phim thành công!')
        form.resetFields()
        onSuccess(response.data)
      }
    } catch (error) {
      message.error(error.message || 'Thêm phim thất bại!')
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
      title="Thêm phim mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="add-movie-modal"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="add-movie-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên phim"
              rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="durationMinutes"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
            >
              <InputNumber
                placeholder="Nhập thời lượng"
                min={1}
                max={300}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả phim"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="releaseDate"
              label="Ngày phát hành"
              rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày phát hành"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="language"
              label="Ngôn ngữ"
              rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
            >
              <Input placeholder="Ví dụ: Tiếng Việt" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="country"
              label="Quốc gia"
              rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
            >
              <Input placeholder="Ví dụ: Việt Nam" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="posterUrl"
          label="URL Poster"
          rules={[{ required: true, message: 'Vui lòng nhập URL poster!' }]}
        >
          <Input placeholder="Nhập URL hình ảnh poster" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="genres"
              label="Thể loại"
              rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn thể loại"
                showSearch
                optionFilterProp="children"
              >
                {genres.map(genre => (
                  <Option key={genre.genreId} value={genre.genreId}>
                    {genre.genreName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="actors"
              label="Diễn viên"
              rules={[{ required: true, message: 'Vui lòng chọn diễn viên!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn diễn viên"
                showSearch
                optionFilterProp="children"
              >
                {actors.map(actor => (
                  <Option key={actor.actorId} value={actor.actorId}>
                    {actor.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="director"
          label="Đạo diễn"
          rules={[{ required: true, message: 'Vui lòng chọn đạo diễn!' }]}
        >
          <Select
            placeholder="Chọn đạo diễn"
            showSearch
            optionFilterProp="children"
          >
            {directors.map(director => (
              <Option key={director.directorId} value={director.directorId}>
                {director.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="form-actions">
          <Button onClick={handleCancel} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            icon={<PlusOutlined />}
          >
            Thêm phim
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddMovieModal
