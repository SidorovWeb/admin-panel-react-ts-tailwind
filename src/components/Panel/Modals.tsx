import { FC } from 'react'
import { ModalBackup } from '../Modal/ModalBackup'
import { ModalChoose } from '../Modal/ModalChoose'
import { ModalConfirm } from '../Modal/ModalConfirm'
import { ModalEditorMeta } from '../Modal/ModalEditorMeta'
import { ModalEditText } from '../Modal/ModalEditText'
import { ModalLogout } from '../Modal/ModalLogout'

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
