import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  regions: [
    { id: 1, name: 'Tp. Hồ Chí Minh', cinemaCount: 69, isSelected: true },
    { id: 2, name: 'Đồng Nai', cinemaCount: 8, isSelected: false },
    { id: 3, name: 'Đắk Lắk', cinemaCount: 3, isSelected: false },
    { id: 4, name: 'Đà Nẵng', cinemaCount: 9, isSelected: false },
    { id: 5, name: 'Bình Định', cinemaCount: 4, isSelected: false },
    { id: 6, name: 'Thái Nguyên', cinemaCount: 2, isSelected: false },
    { id: 7, name: 'Hà Nội', cinemaCount: 52, isSelected: false },
    { id: 8, name: 'Lâm Đồng', cinemaCount: 5, isSelected: false },
    { id: 9, name: 'Thanh Hóa', cinemaCount: 2, isSelected: false },
    { id: 10, name: 'Bắc Giang', cinemaCount: 2, isSelected: false }
  ],
  selectedRegion: 1
}

const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    selectRegion: (state, action) => {
      const regionId = action.payload
      state.regions.forEach(region => {
        region.isSelected = region.id === regionId
      })
      state.selectedRegion = regionId
    },
    updateRegionTheaterCount: (state, action) => {
      const { regionName, theaterCount } = action.payload
      const region = state.regions.find(r => r.name === regionName)
      if (region) {
        region.cinemaCount = theaterCount
      }
    }
  }
})

export const { selectRegion, updateRegionTheaterCount } = regionsSlice.actions
export default regionsSlice.reducer
