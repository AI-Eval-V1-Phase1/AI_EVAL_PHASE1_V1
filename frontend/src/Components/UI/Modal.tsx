import React from 'react'
import Button from './Button'
import "../../styles/modal/modal.css";

const Modal = ({children, ...props}) => {
const {isOpen} = props;
  if (!isOpen) return null; // Don't render anything if modal is closed
  return (
    <div className="modal_overlay" >
        <div className="modal_popup">
            <div className="modal_content">
                {children}
            </div>
            {/* <Button onClick={onClose}>Close</Button> */}
           
        </div>
    </div>
  )
}

export default Modal