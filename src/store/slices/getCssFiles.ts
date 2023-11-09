import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGetCssFiles {
    cssFiles: IFiles
}

interface IFiles {
    files: string[]
    path: string[]
}

const initialState: IGetCssFiles = {
    cssFiles: {
        files: [],
        path: [],
    },
}

export const getCssFilesSlice = createSlice({
    name: 'getCssFiles',
    initialState,
    reducers: {
        getCssFiles: (state, action: PayloadAction<{ cssFiles: IFiles }>) => {
            state.cssFiles = action.payload.cssFiles
        },
    },
})

export const getCssFilesActions = getCssFilesSlice.actions
export const getCssFilesReducer = getCssFilesSlice.reducer
