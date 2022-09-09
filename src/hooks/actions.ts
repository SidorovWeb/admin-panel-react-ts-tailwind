import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { controlImgActions } from '../store/ControlImg/ControlImgSlice'

const actions = {
  ...controlImgActions,
}

export const userActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
