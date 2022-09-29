import { configureStore } from '@reduxjs/toolkit'
import { codeEditorReducer } from './CodeEditor/CodeEditorSlice'
import { controlImgReducer } from './ControlImg/ControlImgSlice'
// ...

export const store = configureStore({
  reducer: {
    controlImg: controlImgReducer,
    codeEditor: codeEditorReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
