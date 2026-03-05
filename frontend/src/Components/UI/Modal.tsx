import React from "react"
import "../../styles/modal/modal.css"

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose?: () => void
  modalPopupClassName?: string
}

function Modal({ children, isOpen, onClose, modalPopupClassName }: ModalProps) {
  if (!isOpen) return null
  return (
    <div
      className="modal_overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={["modal_popup", modalPopupClassName].filter(Boolean).join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal_content">{children}</div>
      </div>
    </div>
  )
}

export default Modal