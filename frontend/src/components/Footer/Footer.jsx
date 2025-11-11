import React from 'react'
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  YoutubeOutlined, 
  TwitterOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <div className="footer-logo-text">CinemaGo</div>
              <div className="footer-logo-subtitle">Cinema Experience</div>
            </div>
            <p className="footer-description">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu. 
              Trải nghiệm điện ảnh tuyệt vời với công nghệ hiện đại.
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
            <h4 className="footer-section-title">Liên kết nhanh</h4>
            <div className="footer-links">
              <a href="/" className="footer-link">Trang chủ</a>
              <a href="/dang-chieu" className="footer-link">Phim đang chiếu</a>
              <a href="/lich-chieu" className="footer-link">Lịch chiếu</a>
              <a href="/mua-ve-theo-rap" className="footer-link">Mua vé theo rạp</a>
              <a href="/community" className="footer-link">Cộng đồng</a>
            </div>
          </div>

          {/* Movies */}
          <div className="footer-section">
            <h4 className="footer-section-title">Phim</h4>
            <div className="footer-links">
              <a href="/dang-chieu" className="footer-link">Đang chiếu</a>
              <a href="/sap-chieu" className="footer-link">Sắp chiếu</a>
              <a href="/chieu-som" className="footer-link">Chiếu sớm</a>
              <a href="/phim-viet" className="footer-link">Phim Việt Nam</a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-section-title">Hỗ trợ</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Câu hỏi thường gặp</a>
              <a href="#" className="footer-link">Hướng dẫn đặt vé</a>
              <a href="#" className="footer-link">Chính sách hoàn vé</a>
              <a href="#" className="footer-link">Liên hệ</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-info">
            <h4 className="footer-section-title">Liên hệ</h4>
            <div className="contact-items">
              <div className="contact-item">
                <PhoneOutlined className="contact-icon" />
                <span>Hotline: 0342315090</span>
              </div>
              <div className="contact-item">
                <MailOutlined className="contact-icon" />
                <span>support@cinemago.vn</span>
              </div>
              <div className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                <span>Long Biên, Hà Nội</span>
              </div>
              <div className="contact-item">
                <ClockCircleOutlined className="contact-icon" />
                <span>24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2025 CinemaGo. Tất cả quyền được bảo lưu.
            </div>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Điều khoản sử dụng</a>
              <a href="#" className="footer-bottom-link">Chính sách bảo mật</a>
              <a href="#" className="footer-bottom-link">Chính sách cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
