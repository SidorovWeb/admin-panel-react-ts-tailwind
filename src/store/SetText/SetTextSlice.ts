import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ISetText {
  text: string
  id: number
  selector: string
  element: string
}

const initialState: ISetText = {
  text: '',
  id: 0,
  selector: '',
  element: '', // img или text
}

export const setTextSlice = createSlice({
  name: 'setText',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<{ id: number; text: string; selector: string; element: string }>) => {
      state.id = action.payload.id
      state.text = action.payload.text
      state.selector = action.payload.selector
      state.element = action.payload.element
    },
  },
})

export const setTextActions = setTextSlice.actions
export const setTextReducer = setTextSlice.reducer
