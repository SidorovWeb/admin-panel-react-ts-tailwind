import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { codeEditorActions } from '../store/CodeEditor/CodeEditorSlice'
import { controlImgActions } from '../store/ControlImg/ControlImgSlice'
import { textEditorPanelActions } from '../store/TextEditorPanel/TextEditorPanel'

const actions = {
  ...controlImgActions,
  ...codeEditorActions,
  ...textEditorPanelActions,
}

export const userActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
