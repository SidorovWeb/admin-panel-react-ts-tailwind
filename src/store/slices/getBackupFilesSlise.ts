import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGetBackupFiles {
    backupFiles: string[]
}

const initialState: IGetBackupFiles = {
    backupFiles: [],
}

export const getBackupFilesSlice = createSlice({
    name: 'getBackupFiles',
    initialState,
    reducers: {
        getBackupFiles: (
            state,
            action: PayloadAction<{ backupFiles: string[] }>
        ) => {
            state.backupFiles = action.payload.backupFiles
        },
    },
})

export const getBackupFilesActions = getBackupFilesSlice.actions
export const getBackupFilesReducer = getBackupFilesSlice.reducer
