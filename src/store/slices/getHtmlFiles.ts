import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGetNamesHtmlFiles {
    htmlFiles: string[]
}

const initialState: IGetNamesHtmlFiles = {
    htmlFiles: [],
}

export const getHtmlFilesSlice = createSlice({
    name: 'getHtmlFiles',
    initialState,
    reducers: {
        getHtmlFiles: (
            state,
            action: PayloadAction<{ htmlFiles: string[] }>
        ) => {
            state.htmlFiles = action.payload.htmlFiles
        },
    },
})

export const getHtmlFilesActions = getHtmlFilesSlice.actions
export const getHtmlFilesReducer = getHtmlFilesSlice.reducer
