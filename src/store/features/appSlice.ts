import { createSlice } from '@reduxjs/toolkit'
export enum ThemeEnum {
  "light" = "明亮",
  "dark" = "黑暗",
  "system" = "跟随系统",
}
export enum LanguageEnum {
  "chinese" = "简体中文",
  "english" = "English",
}


const appSlice = createSlice({
  name: 'app',
  initialState: {
    appConfig: {
      language: 'chinese',
      theme: 'light',
    }
  },
  reducers: {
    setTheme(state, action) {
      state.appConfig.theme = action.payload
    },
    setLanguage(state, action) {
      state.appConfig.language = action.payload
    }
  }
})

export const { setTheme, setLanguage } = appSlice.actions

export default appSlice.reducer
