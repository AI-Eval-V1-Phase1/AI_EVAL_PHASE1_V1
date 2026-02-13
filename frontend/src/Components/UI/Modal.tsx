import React from 'react'
import Button from './Button'
import "../../styles/modal/modal.css";

<<<<<<< HEAD
const Modal = ({ children, modalPopupClassName, ...props }) => {
  const { isOpen } = props;
  if (!isOpen) return null;
  return (
    <div className="modal_overlay">
        <div className={["modal_popup", modalPopupClassName].filter(Boolean).join(" ")}>
=======
const Modal = ({children, ...props}) => {
const {isOpen} = props;
  if (!isOpen) return null; // Don't render anything if modal is closed
  return (
    <div className="modal_overlay" >
        <div className="modal_popup">
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
            <div className="modal_content">
                {children}
            </div>
            {/* <Button onClick={onClose}>Close</Button> */}
           
        </div>
    </div>
  )
}

export default Modal