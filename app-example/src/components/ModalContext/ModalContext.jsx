import React, { createContext, useState } from 'react'
import styles from './ModalContext.module.scss';


const Modal = props => {
  const { modalContent, hideModal } = props;
  return (
    <div className={styles.wrapper} onClick={hideModal} >
      <div className={styles.container}>
        {modalContent || "Dette er en modal "}
        <button onClick={hideModal}>close</button>
      </div>
    </div>
  )
}

// Dette er udelukkende til intellisense i de filer
// dette importeres i, så editoren kan foreslå ting.
// Objektet indeholder bare no-op funktioner og tomme
// strings.
const modalContext = {
  showModal: x => x,
  hideModal: x => x,
  toggleModal: x => x,
  setModalContent: x => x,
  clearModalContent: x => x,
  modalContent: "",
}

export const ModalContext = createContext(modalContext);


export default function ModalProvider(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null)

  const context = {
    showModal: () => setShowModal(true),
    hideModal: () => setShowModal(false),
    toggleModal: () => setShowModal(!showModal),
    setModalContent: setModalContent,
    clearModalContent: () => setModalContent(null),
    modalContent: modalContent,
  }

  return (
    <ModalContext.Provider value={context}>
      {props.children}
      {showModal && <Modal {...context} />}
    </ModalContext.Provider>
  )
}