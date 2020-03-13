import React, { useContext } from "react";
import { ModalContext } from "../../ModalContext/ModalContext";

const ContactPage = props => {
  const { showModal, setModalContent } = useContext(ModalContext);

  const showContactModal = () => {
    setModalContent(
      <>
        <h3>Contact Info</h3>
        <ul>
          <li>Tlf: xxxxxxxx</li>
          <li>Adresse: Andebyvej 1337</li>
          <li>By: Andeby</li>
          <li>Navn: Anders And</li>
        </ul>
      </>
    );
    showModal();
  };
  
  return (
    <>
      <h2>Contact</h2>
      <p>Kontakt os nu bare!</p>
      <button onClick={showContactModal}>Vis kontakt info</button>
    </>
  );
};

export default ContactPage;
