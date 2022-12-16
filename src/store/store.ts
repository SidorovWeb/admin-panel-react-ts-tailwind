import { configureStore } from '@reduxjs/toolkit'
import { codeEditorReducer } from './CodeEditor/CodeEditorSlice'
import { setTextReducer } from './SetText/SetTextSlice'
import { textEditorPanelReducer } from './TextEditorPanel/TextEditorPanel'
// ...

export const store = configureStore({
  reducer: {
    setText: setTextReducer,
    codeEditor: codeEditorReducer,
    textEditorPanel: textEditorPanelReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
