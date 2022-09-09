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
    // setText: (state, action: PayloadAction<{ idx: number; text: string }>) => {
    //   state.idx = action.payload.idx
    //   state.text = action.payload.text
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // }
  },
})

export const controlImgActions = controlImgSlice.actions
export const controlImgReducer = controlImgSlice.reducer
