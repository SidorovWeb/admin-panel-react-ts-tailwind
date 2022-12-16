import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { codeEditorActions } from '../store/CodeEditor/CodeEditorSlice'
import { setTextActions } from '../store/SetText/SetTextSlice'
import { textEditorPanelActions } from '../store/TextEditorPanel/TextEditorPanel'

const actions = {
  ...setTextActions,
  ...codeEditorActions,
  ...textEditorPanelActions,
}

export const userActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
