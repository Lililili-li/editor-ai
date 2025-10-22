import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {
      username: '',
      id: '',
    }
  },
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
  }
})

export const { setUserInfo, logout } = userSlice.actions

export default userSlice.reducer
