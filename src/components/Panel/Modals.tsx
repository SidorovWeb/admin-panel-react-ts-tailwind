import { FC } from 'react'
import { ModalBackup } from '../Modals/ModalBackup'
import { ModalChoose } from '../Modals/ModalChoose'
import { ModalConfirm } from '../Modals/ModalConfirm'
import { ModalEditorMeta } from '../Modals/ModalEditorMeta'
import { ModalEditText } from '../Modals/ModalEditText'
import { ModalLogout } from '../Modals/ModalLogout'

interface IModals {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  setCurrentPage: (page: string) => void
  currentPage: string
}

export const Modals: FC<IModals> = ({ virtualDom, setVirtualDom, currentPage, setCurrentPage }) => {
  return (
    <>
      <ModalEditorMeta virtualDom={virtualDom} currentPage={currentPage} />
      <ModalEditText virtualDom={virtualDom} setVirtualDom={setVirtualDom} />
      <ModalConfirm virtualDom={virtualDom} currentPage={currentPage} />
      <ModalChoose setCurrentPage={setCurrentPage} />
      <ModalBackup />
      <ModalLogout />
    </>
  )
}
