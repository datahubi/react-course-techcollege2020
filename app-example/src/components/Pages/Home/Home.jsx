import React, { useContext } from "react";
import { ModalContext } from "../../ModalContext/ModalContext";

const HomePage = props => {
  const modalContext = useContext(ModalContext);
  const { showModal, setModalContent, toggleModal, clearModalContent } = modalContext;

  const showNiceModal = () => {
    setModalContent(
      <div>
        <h3>Hej fra home!</h3>
        <p>Dette er en test af en modal!</p>
      </div>
    )
    showModal();
  }

  return (
    <>
      <h2>Home</h2>
      <p>Velkommen</p>
      <button onClick={showModal}>Vis en modal</button> <br/>
      <button onClick={toggleModal}>Toggle en modal</button> <br/>
      <button onClick={clearModalContent}>Ryd indholdet i modalen</button> <br/>
      <button onClick={showNiceModal}>Vis en modal med andet indhold</button>
    </>
  );
};

export default HomePage;
