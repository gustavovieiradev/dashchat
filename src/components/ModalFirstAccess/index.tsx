import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button } from "@chakra-ui/react";
import { useState } from "react";

export function ModalFirstAccess() {
  const [isOpen, setIsOpen] = useState<boolean>(true);


  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent AlertDialogContent bg="gray.900">
          <ModalHeader>Create your account</ModalHeader>
          <ModalBody pb={6}>
            dsfklskf;
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
  );
}