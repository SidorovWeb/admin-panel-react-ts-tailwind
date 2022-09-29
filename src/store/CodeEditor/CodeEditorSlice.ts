import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ICodeEditor {
  active: boolean
}

const initialState: ICodeEditor = {
  active: false,
}

export const codeEditorSlice = createSlice({
  name: 'codeEditor',
  initialState,
  reducers: {
    activateCodeEditor: (state) => {
      state.active = true
    },
    inactiveCodeEditor: (state) => {
      state.active = false
    },
  },
})

export const codeEditorActions = codeEditorSlice.actions
export const codeEditorReducer = codeEditorSlice.reducer
