import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { codeEditorActions } from '../store/slices/codeEditorSlice'
import { getImageActions } from '../store/slices/getImagesSlice'
import { setTextActions } from '../store/slices/setTextSlice'
import { textEditorPanelActions } from '../store/slices/textEditorPanel'

const actions = {
  ...setTextActions,
  ...codeEditorActions,
  ...textEditorPanelActions,
  ...getImageActions,
}

export const userActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
