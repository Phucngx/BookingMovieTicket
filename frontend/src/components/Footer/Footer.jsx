import React from 'react'
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  YoutubeOutlined, 
  TwitterOutlined
} from '@ant-design/icons'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">CineMax Cinema</h4>
            <p className="footer-description">
              Hệ thống rạp chiếu phim hàng đầu Việt Nam
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FacebookOutlined className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <InstagramOutlined className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <YoutubeOutlined className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <TwitterOutlined className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Liên kết</h4>
            <div className="footer-links">
              <a href="/" className="footer-link">Trang chủ</a>
              <a href="/dang-chieu" className="footer-link">Phim đang chiếu</a>
              <a href="/lich-chieu" className="footer-link">Lịch chiếu</a>
              <a href="/community" className="footer-link">Cộng đồng</a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-section-title">Hỗ trợ</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Câu hỏi thường gặp</a>
              <a href="#" className="footer-link">Hướng dẫn đặt vé</a>
              <a href="#" className="footer-link">Liên hệ</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2024 CineMax Cinema. Tất cả quyền được bảo lưu.
            </div>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Điều khoản sử dụng</a>
              <a href="#" className="footer-bottom-link">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
