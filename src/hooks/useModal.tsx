import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useModal = (): ModalState => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return { isOpen, openModal, closeModal };
};

export default useModal;
