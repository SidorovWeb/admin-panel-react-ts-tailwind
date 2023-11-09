import { configureStore } from '@reduxjs/toolkit'
import { codeEditorReducer } from './slices/codeEditorSlice'
import { getImageReducer } from './slices/getImagesSlice'
import { setTextReducer } from './slices/setTextSlice'
import { textEditorPanelReducer } from './slices/textEditorPanel'
import thunk from 'redux-thunk'
import { getHtmlFilesReducer } from './slices/getHtmlFiles'
import { getCssFilesReducer } from './slices/getCssFiles'
import { getJsFilesReducer } from './slices/getJsFiles'
import { getBackupFilesReducer } from './slices/getBackupFilesSlise'

export const store = configureStore({
    reducer: {
        setText: setTextReducer,
        codeEditor: codeEditorReducer,
        textEditorPanel: textEditorPanelReducer,
        getImage: getImageReducer,
        htmlFiles: getHtmlFilesReducer,
        cssFiles: getCssFilesReducer,
        jsFiles: getJsFilesReducer,
        backupFiles: getBackupFilesReducer,
    },
    middleware: [thunk],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
