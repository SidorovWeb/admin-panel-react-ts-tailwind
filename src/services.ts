import axios from 'axios'
import { pathAPI } from './constants'
import i18next from 'i18next'
import { toast } from 'react-toastify'
import { IAuth } from './App'

export const checkAuth = async () => {
    try {
        const { data } = await axios.get<IAuth>(`${pathAPI}checkAuth.php`)
        return data
    } catch (e) {
        toast.error(`Failed to load checkAuth! ${e}`)
    }
}

export const getBackupList = async () => {
    try {
        const { data } = await axios.get<string[]>(`${pathAPI}backupList.php`)
        const editedData = [] as any
        data.forEach((str: string) => {
            const idx = str.lastIndexOf('/')
            editedData.push(str.slice(idx + 1))
        })

        return editedData
    } catch (e) {
        toast.error(`Failed to load backup files! ${e}`)
    }
}

export const createBackup = async () => {
    try {
        await axios.post(`${pathAPI}zipper.php`)

        if (i18next.language === 'ru') {
            toast.success('Архив успешно создан! ./backups/')
            return true
        } else {
            toast.success('Archive created successfully! ./backups/')
        }
    } catch (e) {
        toast.error(`Failed to create archive! ${e}`)
    }
}

export const getListHtmlFiles = async () => {
    try {
        const { data } = await axios.get<string[]>(`${pathAPI}htmlList.php`)

        return data.filter((item) => item !== 'temporaryFileCanBeDeleted.html')
    } catch (e) {
        toast.error(`Failed to load html files! ${e}`)
    }
}

export const getListCssFiles = async () => {
    try {
        const { data } = await axios.get<[]>(`${pathAPI}cssList.php`)

        let files = [] as string[]

        data.map((f: string) => {
            const fileName = f.split('/').pop()
            if (fileName) files.push(fileName)
        })
        return { files, path: data }
    } catch (e) {
        toast.error(`Failed to load html files! ${e}`)
    }
}

export const getListJsFiles = async () => {
    try {
        const { data } = await axios.get<[]>(`${pathAPI}jsList.php`)

        let files = [] as string[]

        data.map((f: string) => {
            const fileName = f.split('/').pop()
            if (fileName) files.push(fileName)
        })
        return { files, path: data }
    } catch (e) {
        toast.error(`Failed to load html files! ${e}`)
    }
}
