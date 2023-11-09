import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGetJsFiles {
    jsFiles: IFiles
}

interface IFiles {
    files: string[]
    path: string[]
}

const initialState: IGetJsFiles = {
    jsFiles: {
        files: [],
        path: [],
    },
}

export const getJsFilesSlice = createSlice({
    name: 'getJsFiles',
    initialState,
    reducers: {
        getJsFiles: (state, action: PayloadAction<{ jsFiles: IFiles }>) => {
            state.jsFiles = action.payload.jsFiles
        },
    },
})

export const getJsFilesActions = getJsFilesSlice.actions
export const getJsFilesReducer = getJsFilesSlice.reducer
