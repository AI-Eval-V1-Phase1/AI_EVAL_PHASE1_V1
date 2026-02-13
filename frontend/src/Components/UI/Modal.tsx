import React from 'react'
import Button from './Button'
import "../../styles/modal/modal.css";

const Modal = ({ children, modalPopupClassName, ...props }) => {
  const { isOpen } = props;
  if (!isOpen) return null;
  return (
    <div className="modal_overlay">
        <div className={["modal_popup", modalPopupClassName].filter(Boolean).join(" ")}>
            <div className="modal_content">
                {children}
            </div>
            {/* <Button onClick={onClose}>Close</Button> */}
           
        </div>
    </div>
  )
}

export default Modal