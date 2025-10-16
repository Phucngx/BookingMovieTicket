import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../../services/userService'

// Async thunks
export const fetchAllAccounts = createAsyncThunk(
  'accountManagement/fetchAllAccounts',
  async ({ page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching all accounts with page:', page, 'size:', size)
      const response = await userService.getAllAccounts({ page, size })
      console.log('Account service response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning accounts data:', response.data)
        return {
          content: response.data?.content || [],
          totalElements: response.data?.totalElements || 0,
          totalPages: response.data?.totalPages || 0,
          currentPage: response.data?.pageable?.pageNumber || 0,
          size: response.data?.size || size,
          first: response.data?.first || false,
          last: response.data?.last || false
        }
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch all accounts error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAccountById = createAsyncThunk(
  'accountManagement/fetchAccountById',
  async (accountId, { rejectWithValue }) => {
    try {
      console.log('Fetching account by ID:', accountId)
      const response = await userService.getAccountById(accountId)
      console.log('Account service response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning account data:', response.data)
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Fetch account by ID error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const addAccount = createAsyncThunk(
  'accountManagement/addAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await userService.createAccount(accountData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateAccountRole = createAsyncThunk(
  'accountManagement/updateAccountRole',
  async ({ accountId, roleId }, { rejectWithValue }) => {
    try {
      console.log('Updating account role:', { accountId, roleId })
      const response = await userService.updateAccountRole(accountId, roleId)
      console.log('Update account role response:', response)
      
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Update account role error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const deleteAccount = createAsyncThunk(
  'accountManagement/deleteAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      await userService.deleteAccount(accountId)
      return accountId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchAccounts = createAsyncThunk(
  'accountManagement/searchAccounts',
  async ({ searchTerm = '', page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      console.log('Searching accounts with term:', searchTerm)
      const response = await userService.searchAccounts({ searchTerm, page, size })
      console.log('Search accounts response:', response)
      
      // Kiểm tra response format
      if (response.code === 1000 && response.data) {
        console.log('Returning search results:', response.data)
        return {
          content: response.data?.content || [],
          totalElements: response.data?.totalElements || 0,
          totalPages: response.data?.totalPages || 0,
          currentPage: response.data?.pageable?.pageNumber || 0,
          size: response.data?.size || size,
          first: response.data?.first || false,
          last: response.data?.last || false,
          searchTerm
        }
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Search accounts error:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const updateAccountStatus = createAsyncThunk(
  'accountManagement/updateAccountStatus',
  async ({ accountId, status }, { rejectWithValue }) => {
    try {
      console.log('Updating account status:', { accountId, status })
      const response = await userService.updateAccountStatus(accountId, status)
      console.log('Update account status response:', response)
      
      if (response.code === 1000 && response.data) {
        return response.data
      } else {
        throw new Error('Response format không đúng')
      }
    } catch (error) {
      console.error('Update account status error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  accounts: [],
  currentAccount: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  first: true,
  last: true,
  searchTerm: ''
}

const accountManagementSlice = createSlice({
  name: 'accountManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
    },
    clearCurrentAccount: (state) => {
      state.currentAccount = null
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    clearSearch: (state) => {
      state.searchTerm = ''
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all accounts
      .addCase(fetchAllAccounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.loading = false
        state.accounts = action.payload.content
        state.total = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage + 1 // API trả về 0-based, UI dùng 1-based
        state.pageSize = action.payload.size
        state.first = action.payload.first
        state.last = action.payload.last
        state.error = null
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch account by ID
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false
        state.currentAccount = action.payload
        state.error = null
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add account
      .addCase(addAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.loading = false
        state.accounts.unshift(action.payload)
        state.total += 1
        state.error = null
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update account role
      .addCase(updateAccountRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAccountRole.fulfilled, (state, action) => {
        state.loading = false
        const index = state.accounts.findIndex(account => account.accountId === action.payload.accountId)
        if (index !== -1) {
          // Cập nhật thông tin account với data mới từ API
          state.accounts[index] = {
            ...state.accounts[index],
            ...action.payload
          }
        }
        state.error = null
      })
      .addCase(updateAccountRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false
        state.accounts = state.accounts.filter(account => account.accountId !== action.payload)
        state.total -= 1
        state.error = null
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Search accounts
      .addCase(searchAccounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchAccounts.fulfilled, (state, action) => {
        state.loading = false
        state.accounts = action.payload.content
        state.total = action.payload.totalElements
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage + 1 // API trả về 0-based, UI dùng 1-based
        state.pageSize = action.payload.size
        state.first = action.payload.first
        state.last = action.payload.last
        state.searchTerm = action.payload.searchTerm
        state.error = null
      })
      .addCase(searchAccounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update account status
      .addCase(updateAccountStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAccountStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.accounts.findIndex(account => account.accountId === action.payload.accountId)
        if (index !== -1) {
          // Cập nhật toàn bộ thông tin account với data mới từ API
          state.accounts[index] = {
            ...state.accounts[index],
            ...action.payload
          }
        }
        state.error = null
      })
      .addCase(updateAccountStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentPage, setPageSize, clearCurrentAccount, setSearchTerm, clearSearch } = accountManagementSlice.actions
export default accountManagementSlice.reducer