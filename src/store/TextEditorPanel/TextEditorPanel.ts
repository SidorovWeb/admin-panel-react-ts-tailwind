import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ITextEditorPanel {
  id: number
}

const initialState: ITextEditorPanel = {
  id: 0,
}

export const textEditorPanelSlice = createSlice({
  name: 'controlImg',
  initialState,
  reducers: {
    setTextID: (state, action: PayloadAction<{ id: number }>) => {
      state.id = action.payload.id
    },
  },
})

export const textEditorPanelActions = textEditorPanelSlice.actions
export const textEditorPanelReducer = textEditorPanelSlice.reducer
