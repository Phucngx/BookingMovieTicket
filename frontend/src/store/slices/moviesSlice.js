import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  movies: [
    {
      id: 1,
      title: 'Thanh Gươm Diệt Quỷ',
      poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
      date: '15/08',
      rating: 95,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'action',
      language: 'japanese',
      duration: '120 phút',
      director: 'Haruo Sotozaki',
      cast: ['Natsuki Hanae', 'Akari Kitō', 'Hiro Shimono'],
      description: 'Câu chuyện về Tanjiro, một cậu thiếu niên trở thành Diệt Quỷ để cứu em gái Nezuko khỏi lời nguyền biến thành quỷ. Bộ phim kể về hành trình đầy thử thách của anh để tìm cách chữa lành cho em gái và tiêu diệt những con quỷ độc ác.',
      trailer: 'https://www.youtube.com/embed/VQGCKyvzIM4',
      locations: [
        {
          id: 1,
          name: 'Đồng Nai',
          cinemas: [
            {
              id: 1,
              name: 'Beta Cinemas',
              address: 'Tầng 6, The Pegasus Plaza, 53-55 Võ Thị Sáu, P. Quyết Thắng, Biên Hoà, Đồng Nai.',
              showtimes: [
                {
                  id: 1,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '08:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '09:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '11:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '13:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '13:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '13:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '15:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '15:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '16:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '16:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '16:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '18:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '18:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '20:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '21:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:20', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:40', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '23:20', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                },
                {
                  id: 2,
                  date: '20/8',
                  day: 'Th 4',
                  times: [
                    { time: '09:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                },
                {
                  id: 3,
                  date: '21/8',
                  day: 'Th 5',
                  times: [
                    { time: '09:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                },
                {
                  id: 4,
                  date: '22/8',
                  day: 'Th 6',
                  times: [
                    { time: '09:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                },
                {
                  id: 5,
                  date: '23/8',
                  day: 'Th 7',
                  times: [
                    { time: '09:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                },
                {
                  id: 6,
                  date: '24/8',
                  day: 'CN',
                  times: [
                    { time: '09:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '10:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:00', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:30', price: '40000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:00', price: '40000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 2,
              name: 'CGV Aeon Mall',
              address: 'Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, TP.HCM',
              showtimes: [
                {
                  id: 7,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '09:00', price: '85000', type: '2D Phụ Đề Việt', available: true },
                    { time: '11:30', price: '85000', type: '2D Phụ Đề Việt', available: true },
                    { time: '14:00', price: '120000', type: '3D Phụ Đề Việt', available: true },
                    { time: '16:30', price: '85000', type: '2D Phụ Đề Việt', available: true },
                    { time: '19:00', price: '120000', type: '3D Phụ Đề Việt', available: true },
                    { time: '21:30', price: '85000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Mang Mẹ Đi Bo',
      poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
      date: '01/08',
      rating: 69,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'comedy',
      language: 'vietnamese',
      duration: '105 phút',
      director: 'Vũ Ngọc Đãng',
      cast: ['Minh Hằng', 'Hồng Ánh', 'Quốc Khánh'],
      description: 'Bộ phim hài hước kể về hành trình của một cô gái trẻ khi cô quyết định đưa mẹ đi du lịch để thay đổi không khí gia đình. Những tình huống hài hước và cảm động sẽ khiến khán giả cười ra nước mắt.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 3,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 3,
              name: 'BHD Star Bitexco',
              address: 'Tầng 5, Bitexco Financial Tower, 2 Hải Triều, P. Bến Nghé, Q.1, TP.HCM',
              showtimes: [
                {
                  id: 8,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '10:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '12:30', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '15:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:30', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '20:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:30', price: '75000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Dính Lẹo',
      poster: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=400&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'romance',
      language: 'vietnamese',
      duration: '95 phút',
      director: 'Nguyễn Quang Dũng',
      cast: ['Minh Hằng', 'Đức Thịnh', 'Hồng Ánh'],
      description: 'Một câu chuyện tình yêu lãng mạn về hai người trẻ gặp gỡ trong hoàn cảnh đặc biệt và dần dần phát hiện ra tình cảm dành cho nhau.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 4,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 4,
              name: 'Galaxy Cinema',
              address: 'Tầng 4, Vincom Center, 72 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP.HCM',
              showtimes: [
                {
                  id: 9,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '13:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '15:30', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '18:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '20:30', price: '75000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Zombie Cung Cua Ba',
      poster: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=400&fit=crop',
      date: '08/08',
      rating: 100,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'horror',
      language: 'vietnamese',
      duration: '110 phút',
      director: 'Lê Hoàng',
      cast: ['Minh Hằng', 'Hồng Ánh', 'Quốc Khánh'],
      description: 'Bộ phim kinh dị hài hước về một nhóm bạn trẻ phải đối mặt với những con zombie trong một cung điện cổ đầy bí ẩn.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 5,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 5,
              name: 'Galaxy Cinema',
              address: 'Tầng 4, Vincom Center, 72 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP.HCM',
              showtimes: [
                {
                  id: 10,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '20:00', price: '80000', type: '2D Phụ Đề Việt', available: true },
                    { time: '22:30', price: '80000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Conan Movie 27',
      poster: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&h=400&fit=crop',
      date: '25/07',
      rating: 92,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'animation',
      language: 'japanese',
      duration: '115 phút',
      director: 'Yuzuru Tachikawa',
      cast: ['Minami Takayama', 'Wakana Yamazaki', 'Rikiya Koyama'],
      description: 'Phim hoạt hình Nhật Bản về thám tử Conan trong một vụ án mới đầy thách thức và nguy hiểm.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 6,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 6,
              name: 'CGV Aeon Mall',
              address: 'Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, TP.HCM',
              showtimes: [
                {
                  id: 11,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '15:00', price: '90000', type: '2D Phụ Đề Việt', available: true },
                    { time: '17:30', price: '90000', type: '2D Phụ Đề Việt', available: true },
                    { time: '20:00', price: '90000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Trại Tu Nuôi Quỷ',
      poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'horror',
      language: 'vietnamese',
      duration: '100 phút',
      director: 'Nguyễn Quang Dũng',
      cast: ['Minh Hằng', 'Đức Thịnh'],
      description: 'Bộ phim kinh dị về một trại tu đầy bí ẩn nơi những con quỷ được nuôi dưỡng và huấn luyện.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 7,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 7,
              name: 'Galaxy Cinema',
              address: 'Tầng 4, Vincom Center, 72 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP.HCM',
              showtimes: [
                {
                  id: 12,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '22:00', price: '80000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Tôi Có Bệnh Mà Thích Cậu',
      poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'romance',
      language: 'vietnamese',
      duration: '90 phút',
      director: 'Lê Hoàng',
      cast: ['Minh Hằng', 'Đức Thịnh'],
      description: 'Một câu chuyện tình yêu ngọt ngào về hai người trẻ với những căn bệnh đặc biệt và tình yêu đặc biệt.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 8,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 8,
              name: 'BHD Star Bitexco',
              address: 'Tầng 5, Bitexco Financial Tower, 2 Hải Triều, P. Bến Nghé, Q.1, TP.HCM',
              showtimes: [
                {
                  id: 13,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '18:00', price: '75000', type: '2D Phụ Đề Việt', available: true },
                    { time: '20:30', price: '75000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Kẻ Vô Danh 2',
      poster: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=160&h=240&fit=crop',
      banner: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=400&fit=crop',
      date: '15/08',
      rating: null,
      isEarlyShow: false,
      isComingSoon: false,
      genre: 'action',
      language: 'vietnamese',
      duration: '125 phút',
      director: 'Nguyễn Quang Dũng',
      cast: ['Minh Hằng', 'Đức Thịnh', 'Quốc Khánh'],
      description: 'Phần tiếp theo của bộ phim hành động đình đám về một kẻ vô danh phải đối mặt với những thử thách mới.',
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      locations: [
        {
          id: 9,
          name: 'TP. Hồ Chí Minh',
          cinemas: [
            {
              id: 9,
              name: 'CGV Aeon Mall',
              address: 'Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, TP.HCM',
              showtimes: [
                {
                  id: 14,
                  date: '19/8',
                  day: 'Th 3',
                  times: [
                    { time: '21:00', price: '85000', type: '2D Phụ Đề Việt', available: true }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  selectedMovie: null,
  loading: false,
  error: null
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setSelectedMovie, setLoading, setError } = moviesSlice.actions
export default moviesSlice.reducer
