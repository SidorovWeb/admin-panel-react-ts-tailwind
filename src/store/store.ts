import { configureStore } from '@reduxjs/toolkit'
import { codeEditorReducer } from './CodeEditor/CodeEditorSlice'
import { getImageReducer } from './getImages/getImages'
import { setTextReducer } from './SetText/SetTextSlice'
import { textEditorPanelReducer } from './TextEditorPanel/TextEditorPanel'
import thunk from 'redux-thunk'

export const store = configureStore({
  reducer: {
    setText: setTextReducer,
    codeEditor: codeEditorReducer,
    textEditorPanel: textEditorPanelReducer,
    getImage: getImageReducer,
  },
  middleware: [thunk],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
