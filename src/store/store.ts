import { configureStore } from '@reduxjs/toolkit'
import { codeEditorReducer } from './CodeEditor/CodeEditorSlice'
import { controlImgReducer } from './ControlImg/ControlImgSlice'
import { textEditorPanelReducer } from './TextEditorPanel/TextEditorPanel'
// ...

export const store = configureStore({
  reducer: {
    controlImg: controlImgReducer,
    codeEditor: codeEditorReducer,
    textEditorPanel: textEditorPanelReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
