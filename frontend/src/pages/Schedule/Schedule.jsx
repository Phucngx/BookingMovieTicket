import React, { useState } from 'react'

const Schedule = () => {
  const [selectedRegion, setSelectedRegion] = useState('Đồng Nai')
  const [selectedCinema, setSelectedCinema] = useState('Lotte Cinema')
  const [selectedDate, setSelectedDate] = useState('19/8 Th 3')

  // Mock data cho khu vực
  const regions = [
    { name: 'Tp. Hồ Chí Minh', count: 69 },
    { name: 'Bắc Giang', count: 2 },
    { name: 'Đồng Nai', count: 8 },
    { name: 'Bình Dương', count: 10 },
    { name: 'Đắk Lắk', count: 3 },
    { name: 'Cần Thơ', count: 5 },
    { name: 'Đà Nẵng', count: 9 },
    { name: 'Quảng Ninh', count: 5 },
    { name: 'Hà Nội', count: 52 },
    { name: 'Hải Phòng', count: 5 }
  ]

  // Mock data cho rạp chiếu
  const cinemas = [
    { name: 'CGV BigC Đồng Nai', chain: 'CGV Cinemas' },
    { name: 'CGV Coopmart Biên Hòa', chain: 'CGV Cinemas' },
    { name: 'Lotte Cinema', chain: 'Lotte Cinema' },
    { name: 'Lotte Biên Hòa', chain: 'Lotte Cinema' },
    { name: 'Lotte Đồng Nai', chain: 'Lotte Cinema' }
  ]

  // Mock data cho ngày
  const dates = [
    { date: '19/8 Th 3', day: 'Thứ 3' },
    { date: '20/8 Th 4', day: 'Thứ 4' },
    { date: '21/8 Th 5', day: 'Thứ 5' },
    { date: '22/8 Th 6', day: 'Thứ 6' },
    { date: '23/8 Th 7', day: 'Thứ 7' },
    { date: '24/8 CN', day: 'Chủ nhật' }
  ]

  // Mock data cho phim
  const movies = [
    {
      id: 1,
      title: 'Thanh Gươm Diệt Quỷ: Vô Hạn Thành',
      englishTitle: 'Demon Slayer - Kimetsu no Yaiba - The Movie: Infinity Castle',
      rating: 'T16',
      duration: '2h35\'',
      genres: ['Action', 'Thriller', 'Animation', 'Fantasy'],
      format: '2D Phụ Đề Việt',
      showtimes: [
        { time: '09:00', price: null },
        { time: '11:30', price: null },
        { time: '12:30', price: '50K' },
        { time: '13:00', price: '50K' },
        { time: '14:15', price: '50K' },
        { time: '15:15', price: '50K' }
      ]
    },
    {
      id: 2,
      title: 'Mang Mẹ Đi Bỏ',
      englishTitle: 'Leaving Mom',
      rating: 'K',
      duration: '1h52\'',
      genres: ['Drama', 'Family'],
      format: '2D Phụ Đề Anh',
      showtimes: [
        { time: '09:30', price: null },
        { time: '19:30', price: '50K' },
        { time: '23:00', price: '50K' }
      ]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Hero Banner */}
      <div style={{
        height: '200px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Lịch chiếu
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            Tìm lịch chiếu phim / rạp nhanh nhất với chỉ 1 bước!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '24px' }}>
          
          {/* Cột trái - Khu vực */}
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Khu vực</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {regions.map((region, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: selectedRegion === region.name ? '#1890ff' : 'transparent',
                    color: selectedRegion === region.name ? 'white' : '#333',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setSelectedRegion(region.name)}
                >
                  <span style={{ fontWeight: 500 }}>{region.name}</span>
                  <div style={{
                    background: selectedRegion === region.name ? 'white' : '#1890ff',
                    color: selectedRegion === region.name ? '#1890ff' : 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {region.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột giữa - Rạp chiếu */}
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Rạp chiếu</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {cinemas.map((cinema, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: selectedCinema === cinema.name ? '#e6f7ff' : 'transparent',
                    border: selectedCinema === cinema.name ? '1px solid #91d5ff' : '1px solid transparent',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setSelectedCinema(cinema.name)}
                >
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    {cinema.chain}
                  </div>
                  <div style={{ fontWeight: 500, color: '#333' }}>
                    {cinema.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải - Lịch chiếu */}
          <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Date Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {dates.map((date, index) => (
                <button
                  key={index}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9',
                    background: selectedDate === date.date ? '#1890ff' : 'white',
                    color: selectedDate === date.date ? 'white' : '#333',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setSelectedDate(date.date)}
                >
                  {date.date}
                </button>
              ))}
            </div>

            {/* Instruction Box */}
            <div style={{
              background: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#fa8c16' }}>ℹ️</span>
              <span style={{ color: '#d46b08', fontWeight: 500 }}>
                Nhấn vào suất chiếu để tiến hành mua vé
              </span>
            </div>

            {/* Movies List */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {movies.map((movie) => (
                <div key={movie.id} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e8e8e8',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '120px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    Poster
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                      {movie.title}
                    </h4>
                    <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic', marginBottom: '8px' }}>
                      {movie.englishTitle}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        background: '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}>
                        {movie.rating}
                      </span>
                      <span style={{ color: '#666' }}>· {movie.duration}</span>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#1890ff',
                        cursor: 'pointer',
                        padding: 0
                      }}>
                        ▶️ Trailer
                      </button>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                      {movie.genres.join(', ')}
                    </p>
                    <p style={{ color: '#333', fontWeight: 500, marginBottom: '16px' }}>
                      {movie.format}
                    </p>
                    
                    {/* Showtimes */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                      gap: '8px'
                    }}>
                      {movie.showtimes.map((showtime, index) => (
                        <button
                          key={index}
                          style={{
                            height: '50px',
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#1890ff'
                            e.target.style.color = '#1890ff'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#d9d9d9'
                            e.target.style.color = '#333'
                          }}
                        >
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            {showtime.time}
                          </div>
                          {showtime.price && (
                            <div style={{ fontSize: '11px', color: '#1890ff', fontWeight: '600' }}>
                              {showtime.price}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule
