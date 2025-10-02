import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Row, Col, Table, Tag, Image, Modal, message, Input } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AddMovieModal from '../../components/AddMovieModal/AddMovieModal'
import { fetchMoviesForAdmin } from '../../store/slices/movieListSlice'
import { movieService } from '../../services/movieService'
import './MovieManagement.css'

const { Title, Text } = Typography

const MovieManagement = () => {
  const dispatch = useDispatch()
  const { userInfo, isAuthenticated } = useSelector(state => state.user)
  const { movies, loading, pagination, error } = useSelector(state => state.movieList)
  
  // Debug log
  console.log('MovieManagement render:', { movies: movies.length, loading, error, pagination })
  const navigate = useNavigate()
  const [addMovieModalVisible, setAddMovieModalVisible] = useState(false)
  const [editMovieModalVisible, setEditMovieModalVisible] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filteredMovies, setFilteredMovies] = useState([])

  // Kiểm tra quyền admin
  const isAdmin = userInfo?.roleName === 'ADMIN'

  useEffect(() => {
    console.log('MovieManagement useEffect:', { isAuthenticated, isAdmin, userInfo, movies: movies.length })
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to home')
      navigate('/')
      return
    }
    
    if (!isAdmin) {
      console.log('Not admin, showing error and redirecting')
      message.error('Bạn không có quyền truy cập trang này')
      navigate('/')
      return
    }

    // Fetch movies when component mounts
    if (movies.length === 0) {
      console.log('Fetching movies for admin...')
      dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))
    }
  }, [isAuthenticated, isAdmin, navigate, dispatch, movies.length])

  // Filter movies based on search text
  useEffect(() => {
    if (searchText.trim()) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.director?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.genres?.some(genre => 
          genre.genreName.toLowerCase().includes(searchText.toLowerCase())
        )
      )
      setFilteredMovies(filtered)
    } else {
      setFilteredMovies(movies)
    }
  }, [movies, searchText])

  const handleAddMovie = () => {
    setAddMovieModalVisible(true)
  }

  const handleAddMovieSuccess = (newMovie) => {
    setAddMovieModalVisible(false)
    message.success('Thêm phim thành công!')
    // Refresh movies list
    dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))
  }

  const handleEditMovie = (movie) => {
    setEditingMovie(movie)
    setEditMovieModalVisible(true)
  }

  const handleDeleteMovie = (movie) => {
    Modal.confirm({
      title: 'Xác nhận xóa phim',
      content: `Bạn có chắc chắn muốn xóa phim "${movie.title}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await movieService.deleteMovie(movie.id)
          message.success('Xóa phim thành công!')
          // Refresh movies list
          dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa phim')
          console.error('Delete movie error:', error)
        }
      },
    })
  }

  const handleViewMovie = (movie) => {
    navigate(`/phim/${movie.id}`)
  }

  // Handle table pagination
  const handleTableChange = (pagination) => {
    dispatch(fetchMoviesForAdmin({ 
      page: pagination.current, 
      size: pagination.pageSize 
    }))
  }

  // Handle search
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  // Handle refresh
  const handleRefresh = () => {
    setSearchText('')
    dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))
  }

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'posterUrl',
      key: 'poster',
      width: 80,
      render: (url) => (
        <Image
          width={60}
          height={80}
          src={url}
          // fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.director?.name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres) => (
        <Space wrap>
          {genres?.map(genre => (
            <Tag key={genre.genreId} color="blue">
              {genre.genreName}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
      key: 'duration',
      render: (minutes) => `${minutes} phút`,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewMovie(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditMovie(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMovie(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ]

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Show error if any
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <Title level={3}>Lỗi khi tải dữ liệu</Title>
          <Text type="danger">{error}</Text>
          <br />
          <Button 
            type="primary" 
            onClick={() => dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))}
            style={{ marginTop: '10px' }}
          >
            Thử lại
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="movie-management-container">
      <div className="movie-management-header">
        <div>
          <Title level={2}>Quản lý phim</Title>
          <Text type="secondary">Quản lý danh sách phim trong hệ thống</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMovie}
            size="large"
            className="add-movie-btn"
          >
            Thêm phim mới
          </Button>
        </Space>
      </div>

      {/* Search Bar */}
      <Card className="search-card" style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Tìm kiếm theo tên phim, đạo diễn hoặc thể loại..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearchChange}
          allowClear
          size="large"
        />
      </Card>

      <Card className="movie-table-card">
        <Table
          columns={columns}
          dataSource={filteredMovies}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} phim`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: searchText ? 'Không tìm thấy phim nào' : 'Chưa có phim nào'
          }}
        />
      </Card>

      <AddMovieModal
        visible={addMovieModalVisible}
        onCancel={() => setAddMovieModalVisible(false)}
        onSuccess={handleAddMovieSuccess}
      />

      <AddMovieModal
        visible={editMovieModalVisible}
        onCancel={() => { setEditMovieModalVisible(false); setEditingMovie(null) }}
        onSuccess={() => {
          setEditMovieModalVisible(false)
          setEditingMovie(null)
          message.success('Cập nhật phim thành công!')
          dispatch(fetchMoviesForAdmin({ page: 1, size: 10 }))
        }}
        initialValues={editingMovie}
        mode="edit"
        movieId={editingMovie?.id}
      />
    </div>
  )
}

export default MovieManagement
