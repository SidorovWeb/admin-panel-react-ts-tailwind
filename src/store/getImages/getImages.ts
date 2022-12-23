import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGetImages {
  images: []
}

const initialState: IGetImages = {
  images: [],
}

export const getImagesSlice = createSlice({
  name: 'getImages',
  initialState,
  reducers: {
    getImages: (state, action: PayloadAction<{ images: [] }>) => {
      state.images = action.payload.images
    },
  },
})

export const getImageActions = getImagesSlice.actions
export const getImageReducer = getImagesSlice.reducer
