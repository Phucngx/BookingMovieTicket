import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Typography, List, Avatar, Spin, Empty, Tag, Input, Button, message, Modal, Tabs } from 'antd'
import { ClockCircleOutlined, CommentOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { postService } from '../../services/postService'
import { movieService } from '../../services/movieService'
import './Community.css'
import { useSelector } from 'react-redux'

const { Content } = Layout
const { Title, Text } = Typography

const formatTime = (iso) => {
  if (!iso) return ''
  try {
    const target = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - target.getTime()
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diffMs < minute) return 'Vừa xong'
    if (diffMs < hour) {
      const m = Math.floor(diffMs / minute)
      return `${m} phút trước`
    }
    if (diffMs < day) {
      const h = Math.floor(diffMs / hour)
      return `${h} giờ trước`
    }
    if (diffMs < 3 * day) {
      const d = Math.floor(diffMs / day)
      return `${d} ngày trước`
    }

    return target.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (_) {
    return iso
  }
}

const Community = () => {
  const navigate = useNavigate()
  const { isAuthenticated, userInfo } = useSelector(state => state.user || {})

  // Feed state - All
  const [loadingAll, setLoadingAll] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [allPage, setAllPage] = useState(1)
  const [allHasMore, setAllHasMore] = useState(true)

  // Feed state - Mine
  const [loadingMine, setLoadingMine] = useState(false)
  const [myPosts, setMyPosts] = useState([])
  const [myPage, setMyPage] = useState(1)
  const [myHasMore, setMyHasMore] = useState(true)

  // UI state
  const [feedType, setFeedType] = useState('all') // 'all' | 'mine'
  const loaderRef = useRef(null)

  const [loadingMovies, setLoadingMovies] = useState(false)
  const [movies, setMovies] = useState([])
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentTextByPostId, setCommentTextByPostId] = useState({})
  const [commentSubmittingByPostId, setCommentSubmittingByPostId] = useState({})
  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const [commentsModalPost, setCommentsModalPost] = useState(null)
  const [replyOpenByCommentId, setReplyOpenByCommentId] = useState({})
  const [replyTextByCommentId, setReplyTextByCommentId] = useState({})
  const [replySubmittingByCommentId, setReplySubmittingByCommentId] = useState({})

  const PAGE_SIZE = 10

  const loadAllPosts = async (p = 1) => {
    if (loadingAll) return
    setLoadingAll(true)
    try {
      const res = await postService.getAll(p, PAGE_SIZE)
      if (res?.code === 1000) {
        const content = res.data?.content || []
        setAllPosts(prev => (p === 1 ? content : [...prev, ...content]))
        const last = !!res.data?.last
        setAllHasMore(!last && content.length > 0)
        setAllPage((res.data?.number || 0) + 1)
      } else {
        if (p === 1) setAllPosts([])
        setAllHasMore(false)
      }
    } catch (_) {
      if (p === 1) setAllPosts([])
      setAllHasMore(false)
    } finally {
      setLoadingAll(false)
    }
  }

  const loadMyPosts = async (p = 1) => {
    if (loadingMine) return
    setLoadingMine(true)
    try {
      const res = await postService.getMyPosts(p, PAGE_SIZE)
      if (res?.code === 1000) {
        const content = res.data?.content || []
        setMyPosts(prev => (p === 1 ? content : [...prev, ...content]))
        const last = !!res.data?.last
        setMyHasMore(!last && content.length > 0)
        setMyPage((res.data?.number || 0) + 1)
      } else {
        if (p === 1) setMyPosts([])
        setMyHasMore(false)
      }
    } catch (_) {
      if (p === 1) setMyPosts([])
      setMyHasMore(false)
    } finally {
      setLoadingMine(false)
    }
  }

  const loadMovies = async () => {
    setLoadingMovies(true)
    try {
      const res = await movieService.getNowShowing(1, 8)
      const data = res?.data || res
      setMovies((data?.content || data?.movies || []).slice(0, 8))
    } catch (_) {
      setMovies([])
    } finally {
      setLoadingMovies(false)
    }
  }

  useEffect(() => {
    loadAllPosts(1)
    loadMovies()
  }, [])

  // React to feed type change
  useEffect(() => {
    if (feedType === 'mine' && isAuthenticated && myPosts.length === 0 && !loadingMine) {
      loadMyPosts(1)
    }
  }, [feedType, isAuthenticated])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (!first.isIntersecting) return
      if (feedType === 'all') {
        if (allHasMore && !loadingAll) {
          loadAllPosts(allPage + 1)
        }
      } else if (feedType === 'mine' && isAuthenticated) {
        if (myHasMore && !loadingMine) {
          loadMyPosts(myPage + 1)
        }
      }
    }, { root: null, rootMargin: '200px', threshold: 0 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [feedType, allHasMore, myHasMore, loadingAll, loadingMine, allPage, myPage, isAuthenticated])

  const postsData = useMemo(() => (feedType === 'all' ? allPosts : myPosts), [feedType, allPosts, myPosts])

  const handleCreatePost = async () => {
    const content = (newContent || '').trim()
    if (!content) {
      message.warning('Vui lòng nhập nội dung bài viết')
      return
    }
    setSubmitting(true)
    try {
      const res = await postService.create(content)
      if (res?.code === 1000 && res?.data) {
        // Optimistic prepend for smooth UX
        if (feedType === 'all') {
          setAllPosts(prev => [res.data, ...prev])
        }
        if (isAuthenticated && (feedType === 'mine')) {
          setMyPosts(prev => [res.data, ...prev])
        }
        setNewContent('')
        message.success('Đăng bài thành công')
        // Background refresh current feed
        if (feedType === 'all') {
          loadAllPosts(1)
        } else {
          loadMyPosts(1)
        }
      } else {
        throw new Error(res?.message || 'Không thể tạo bài viết')
      }
    } catch (err) {
      message.error(err?.message || 'Đăng bài thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeComment = (postId, value) => {
    setCommentTextByPostId(prev => ({ ...prev, [postId]: value }))
  }

  const handleSubmitComment = async (postId) => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để bình luận')
      return
    }
    const text = (commentTextByPostId[postId] || '').trim()
    if (!text) {
      message.warning('Vui lòng nhập nội dung bình luận')
      return
    }
    setCommentSubmittingByPostId(prev => ({ ...prev, [postId]: true }))
    try {
      const res = await postService.createComment(postId, text)
      if (res?.code === 1000 && res?.data) {
        const newComment = res.data
        // Update All feed
        setAllPosts(prev => prev.map(p => {
          if ((p.id || p.postId) !== postId) return p
          const current = Array.isArray(p.comments) ? p.comments : []
          return { ...p, comments: [newComment, ...current] }
        }))
        // Update My feed
        setMyPosts(prev => prev.map(p => {
          if ((p.id || p.postId) !== postId) return p
          const current = Array.isArray(p.comments) ? p.comments : []
          return { ...p, comments: [newComment, ...current] }
        }))
        // Clear input
        setCommentTextByPostId(prev => ({ ...prev, [postId]: '' }))
        message.success('Đã thêm bình luận')
      } else {
        throw new Error(res?.message || 'Không thể tạo bình luận')
      }
    } catch (err) {
      message.error(err?.message || 'Tạo bình luận thất bại')
    } finally {
      setCommentSubmittingByPostId(prev => ({ ...prev, [postId]: false }))
    }
  }

  const openCommentsModal = (post) => {
    setCommentsModalPost(post)
    setCommentsModalOpen(true)
  }

  const closeCommentsModal = () => {
    setCommentsModalOpen(false)
    setCommentsModalPost(null)
  }

  const toggleReplyBox = (commentId) => {
    setReplyOpenByCommentId(prev => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  const handleChangeReply = (commentId, value) => {
    setReplyTextByCommentId(prev => ({ ...prev, [commentId]: value }))
  }

  const handleSubmitReply = async (postId, commentId) => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để phản hồi')
      return
    }
    const text = (replyTextByCommentId[commentId] || '').trim()
    if (!text) {
      message.warning('Vui lòng nhập nội dung phản hồi')
      return
    }
    setReplySubmittingByCommentId(prev => ({ ...prev, [commentId]: true }))
    try {
      const res = await postService.createReply(commentId, text)
      if (res?.code === 1000 && res?.data) {
        const newReply = res.data
        const updateComments = (comments) =>
          comments.map(c => {
            if (c.id !== commentId) return c
            const currentReplies = Array.isArray(c.replies) ? c.replies : []
            return { ...c, replies: [newReply, ...currentReplies] }
          })
        // Update All feed
        setAllPosts(prev => prev.map(p => {
          if ((p.id || p.postId) !== postId) return p
          const currentComments = Array.isArray(p.comments) ? p.comments : []
          return { ...p, comments: updateComments(currentComments) }
        }))
        // Update My feed
        setMyPosts(prev => prev.map(p => {
          if ((p.id || p.postId) !== postId) return p
          const currentComments = Array.isArray(p.comments) ? p.comments : []
          return { ...p, comments: updateComments(currentComments) }
        }))
        // Clear and collapse input
        setReplyTextByCommentId(prev => ({ ...prev, [commentId]: '' }))
        setReplyOpenByCommentId(prev => ({ ...prev, [commentId]: false }))
        message.success('Đã thêm phản hồi')
      } else {
        throw new Error(res?.message || 'Không thể tạo phản hồi')
      }
    } catch (err) {
      message.error(err?.message || 'Tạo phản hồi thất bại')
    } finally {
      setReplySubmittingByCommentId(prev => ({ ...prev, [commentId]: false }))
    }
  }

  return (
    <Content className="community-page">
      <div className="community-container">
        <div className="community-hero">
          <div>
            <Title level={2} className="community-hero-title" style={{ color: '#fff' }}>
              Cộng đồng điện ảnh
            </Title>
            <div className="community-hero-sub">Nơi chia sẻ cảm xúc và khám phá phim hay mỗi ngày</div>
          </div>
        </div>

        <div className="movies-strip">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <h2 style={{ fontWeight: 700, display: 'flex', justifyContent: 'center' }}>Phim đang chiếu</h2>
            {/* <a onClick={() => navigate('/dang-chieu')}>Xem tất cả</a> */}
          </div>
          {loadingMovies ? (
            <div style={{ textAlign: 'center', padding: 16 }}><Spin size="small" /></div>
          ) : (
            <div className="movies-strip-grid">
              {movies.map((m) => (
                <div key={m.id || m.movieId} className="movies-strip-item" onClick={() => navigate(`/phim/${m.id || m.movieId}`)}>
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x320/cccccc/666666?text=No+Image' }}
                  />
                  <div className="movies-strip-badge">ĐANG CHIẾU</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posts section title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <h2 style={{ margin: 0, fontWeight: 700 }}>Bài viết cộng đồng</h2>
        </div>

        {/* Composer (only when logged in) */}
        {isAuthenticated && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Avatar style={{ background: '#1677ff', flex: '0 0 auto' }}>{(userInfo?.username || 'U').charAt(0).toUpperCase()}</Avatar>
              <div style={{ flex: 1 }}>
                <Input.TextArea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  maxLength={1000}
                  placeholder="Chia sẻ cảm xúc về phim bạn vừa xem..."
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button type="primary" loading={submitting} onClick={handleCreatePost}>
                    Đăng bài
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feed selector - Tabs */}
        <div style={{ background: '#fff', borderRadius: 12, marginTop: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'center'}}>
          <Tabs
            activeKey={feedType}
            onChange={(key) => setFeedType(key)}
            items={[
              { key: 'all', label: 'Tất cả bài viết' },
              ...(isAuthenticated ? [{ key: 'mine', label: 'Bài viết của tôi' }] : [])
            ]}
          />
        </div>

        <div className="posts-wrapper">
          {(feedType === 'all' ? loadingAll && allPosts.length === 0 : loadingMine && myPosts.length === 0) ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
              <div style={{ marginTop: 12 }}><Text>Đang tải bài viết...</Text></div>
            </div>
          ) : postsData.length === 0 ? (
            <Empty description="Chưa có bài viết" style={{ background: '#fff', borderRadius: 12, padding: 40 }} />
          ) : (
            <>
              <List
                dataSource={postsData}
                renderItem={(item) => {
                  const hasComments = Array.isArray(item.comments) && item.comments.length > 0
                  const previewComments = hasComments ? item.comments.slice(0, 3) : []
                  return (
                    <List.Item className="post-card">
                      <div style={{ width: '100%' }}>
                        <div className="post-header">
                          <Avatar style={{ background: '#1677ff' }}>{(item.username || 'U').charAt(0).toUpperCase()}</Avatar>
                          <div>
                            <div className="post-username">{item.username || 'Người dùng'}</div>
                            <div className="post-time"><ClockCircleOutlined /> <span style={{ marginLeft: 6 }}>{formatTime(item.createdDate)}</span></div>
                          </div>
                        </div>
                        <div className="post-content">{item.content}</div>
                        {/* Always show comment icon below content */}
                        <div className="post-actions" style={{ marginTop: hasComments ? 8 : 0 }}>
                          <Button className="action-btn" size="small" icon={<CommentOutlined />} onClick={() => openCommentsModal(item)}>
                            Bình luận
                          </Button>
                        </div>
                        <div className="comments-section">
                          {hasComments && (
                            <div>
                              {previewComments.map((c) => (
                                <div key={c.id} className="comment-item">
                                  <Avatar style={{ background: '#52c41a' }}>{(c.account?.fullName || c.account?.username || 'U').charAt(0).toUpperCase()}</Avatar>
                                  <div className="comment-body">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontWeight: 600 }}>{c.account?.fullName || c.account?.username || 'Người dùng'}</span>
                                      <span style={{ color: '#8c8c8c', fontSize: 12 }}>{formatTime(c.createdAt)}</span>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>

                                    {/* Reply toggle in preview (only when logged in) */}
                                    {isAuthenticated && (
                                      <div style={{ marginTop: 6 }}>
                                        <Button className="reply-toggle" size="small" type="link" onClick={() => toggleReplyBox(c.id)}>Phản hồi</Button>
                                      </div>
                                    )}
                                    {replyOpenByCommentId[c.id] && isAuthenticated && (
                                      <div className="comment-composer" style={{ marginTop: 8 }}>
                                        <Input
                                          className="comment-input"
                                          value={replyTextByCommentId[c.id] || ''}
                                          onChange={(e) => handleChangeReply(c.id, e.target.value)}
                                          placeholder="Viết phản hồi..."
                                          maxLength={500}
                                        />
                                        <Button
                                          className="comment-send-btn"
                                          type="primary"
                                          loading={!!replySubmittingByCommentId[c.id]}
                                          onClick={() => handleSubmitReply(item.id, c.id)}
                                        >
                                          Gửi
                                        </Button>
                                      </div>
                                    )}

                                    {Array.isArray(c.replies) && c.replies.length > 0 && (
                                      <div style={{ marginTop: 8 }}>
                                        {c.replies.map((r) => (
                                          <div key={r.id} className="reply-item">
                                            <Avatar size={28} style={{ background: '#f5222d' }}>{(r.account?.fullName || r.account?.username || 'U').charAt(0).toUpperCase()}</Avatar>
                                            <div style={{ borderRadius: 8, padding: 8 }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontWeight: 600 }}>{r.account?.fullName || r.account?.username || 'Người dùng'}</span>
                                                <span style={{ color: '#8c8c8c', fontSize: 12 }}>{formatTime(r.createdAt)}</span>
                                              </div>
                                              <div style={{ whiteSpace: 'pre-wrap' }}>{r.text}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {item.comments.length > 3 && (
                                <div style={{ marginTop: 8 }}>
                                  <Button className="comments-view-all" type="link" onClick={() => openCommentsModal(item)}>
                                    Xem tất cả bình luận ({item.comments.length})
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                        {/* Comment composer per post */}
                        {isAuthenticated && (
                          <div className="comment-composer" style={{ marginTop: 12 }}>
                            <Input
                              className="comment-input"
                              value={commentTextByPostId[item.id] || ''}
                              onChange={(e) => handleChangeComment(item.id, e.target.value)}
                              placeholder="Viết bình luận của bạn..."
                              maxLength={500}
                            />
                            <Button
                              className="comment-send-btn"
                              type="primary"
                              loading={!!commentSubmittingByPostId[item.id]}
                              onClick={() => handleSubmitComment(item.id)}
                            >
                              Gửi
                            </Button>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )
                }}
              />

              {/* Infinite loader sentinel */}
              <div ref={loaderRef} style={{ height: 1 }} />
              {(feedType === 'all' ? loadingAll : loadingMine) && (
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <Spin size="small" />
              </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      <Modal
        open={commentsModalOpen}
        onCancel={closeCommentsModal}
        footer={null}
        title="Tất cả bình luận"
        width={640}
        centered
        bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
      >
        {(() => {
          const latestPost = commentsModalPost
            ? (allPosts.find(p => (p.id || p.postId) === (commentsModalPost.id || commentsModalPost.postId)) ||
               myPosts.find(p => (p.id || p.postId) === (commentsModalPost.id || commentsModalPost.postId)) ||
               commentsModalPost)
            : null

          const hasAny = Array.isArray(latestPost?.comments) && latestPost.comments.length > 0
          return (
            <div>
              {/* {latestPost && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Avatar style={{ background: '#1677ff' }}>{(latestPost.username || 'U').charAt(0).toUpperCase()}</Avatar>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{latestPost.username || 'Người dùng'}</div>
                      <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 6 }}>{formatDateTime(latestPost.createdDate)}</div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{latestPost.content}</div>
                    </div>
                  </div>
                </div>
              )} */}

              {!hasAny ? (
                <div style={{ padding: 16, textAlign: 'center', color: '#8c8c8c' }}>
                  {isAuthenticated ? 'Bạn hãy là người đầu tiên bình luận' : 'Đăng nhập để bình luận bài viết này'}
                </div>
              ) : (
                <div>
                  {latestPost.comments.map((c) => (
                    <div key={c.id} className="comment-item" style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Avatar style={{ background: '#52c41a' }}>{(c.account?.fullName || c.account?.username || 'U').charAt(0).toUpperCase()}</Avatar>
                        <div className="comment-body" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600 }}>{c.account?.fullName || c.account?.username || 'Người dùng'}</span>
                            <span style={{ color: '#8c8c8c', fontSize: 12 }}>{formatTime(c.createdAt)}</span>
                          </div>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>

                          {/* Reply toggle in modal (only when logged in) */}
                          {isAuthenticated && (
                            <div style={{ marginTop: 6 }}>
                              <Button className="reply-toggle" size="small" type="link" onClick={() => toggleReplyBox(c.id)}>Phản hồi</Button>
                            </div>
                          )}
                          {replyOpenByCommentId[c.id] && isAuthenticated && (
                            <div className="comment-composer" style={{ marginTop: 8 }}>
                              <Input
                                className="comment-input"
                                value={replyTextByCommentId[c.id] || ''}
                                onChange={(e) => handleChangeReply(c.id, e.target.value)}
                                placeholder="Viết phản hồi..."
                                maxLength={500}
                              />
                              <Button
                                className="comment-send-btn"
                                type="primary"
                                loading={!!replySubmittingByCommentId[c.id]}
                                onClick={() => handleSubmitReply(latestPost.id, c.id)}
                              >
                                Gửi
                              </Button>
                            </div>
                          )}

                          {Array.isArray(c.replies) && c.replies.length > 0 && (
                            <div style={{ marginTop: 8, paddingLeft: 8 }}>
                              {c.replies.map((r) => (
                                <div key={r.id} className="reply-item" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                  <Avatar size={28} style={{ background: '#f5222d' }}>{(r.account?.fullName || r.account?.username || 'U').charAt(0).toUpperCase()}</Avatar>
                                  <div style={{ borderRadius: 8, padding: 8, flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontWeight: 600 }}>{r.account?.fullName || r.account?.username || 'Người dùng'}</span>
                                      <span style={{ color: '#8c8c8c', fontSize: 12 }}>{formatTime(r.createdAt)}</span>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{r.text}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAuthenticated && latestPost && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Input
                    value={commentTextByPostId[latestPost.id] || ''}
                    onChange={(e) => handleChangeComment(latestPost.id, e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    maxLength={500}
                  />
                  <Button
                    type="primary"
                    loading={!!commentSubmittingByPostId[latestPost.id]}
                    onClick={() => handleSubmitComment(latestPost.id)}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </div>
          )
        })()}
      </Modal>
    </Content>
  )
}

export default Community