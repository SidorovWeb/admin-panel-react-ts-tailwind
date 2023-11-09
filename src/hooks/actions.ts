import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { codeEditorActions } from '../store/slices/codeEditorSlice'
import { getImageActions } from '../store/slices/getImagesSlice'
import { setTextActions } from '../store/slices/setTextSlice'
import { textEditorPanelActions } from '../store/slices/textEditorPanel'
import { getHtmlFilesActions } from '../store/slices/getHtmlFiles'
import { getCssFilesActions } from '../store/slices/getCssFiles'
import { getJsFilesActions } from '../store/slices/getJsFiles'
import { getBackupFilesActions } from '../store/slices/getBackupFilesSlise'

const actions = {
    ...setTextActions,
    ...codeEditorActions,
    ...textEditorPanelActions,
    ...getImageActions,
    ...getHtmlFilesActions,
    ...getCssFilesActions,
    ...getJsFilesActions,
    ...getBackupFilesActions,
}

export const userActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}
