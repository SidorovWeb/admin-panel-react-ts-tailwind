import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IControlImg {
  text: string
  id: number
}

const initialState: IControlImg = {
  text: '',
  id: 0,
}

export const controlImgSlice = createSlice({
  name: 'controlImg',
  initialState,
  reducers: {
    getDataImg: (state, action: PayloadAction<{ id: number; text: string }>) => {
      state.id = action.payload.id
      state.text = action.payload.text
    },
  },
})

export const controlImgActions = controlImgSlice.actions
export const controlImgReducer = controlImgSlice.reducer
