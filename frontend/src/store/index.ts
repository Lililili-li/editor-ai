import { configureStore } from '@reduxjs/toolkit'
import articleReducer from './features/articleSlice.ts'
import editorReducer from './features/editorSlice.ts'
import userReducer from './features/userSlice.ts'
import appReducer from './features/appSlice.ts'

export const store = configureStore({
  reducer: {
    article: articleReducer,
    editor: editorReducer,
    user: userReducer,
    app: appReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
