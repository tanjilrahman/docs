import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import Modal from '@material-tailwind/react/Modal';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { db } from '../firebase';
import firebase from 'firebase';

const DocumentRow = ({ id, filename, date }) => {
  const router = useRouter();
  const [session] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [input, setInput] = useState(filename);

  const editDocument = () => {
    db.collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .doc(id)
      .set(
        {
          filename: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    setShowEditModal(false);
  };

  const removeDocument = () => {
    db.collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .doc(id)
      .delete();

    setShowRemoveModal(false);
  };

  const editModal = (
    <Modal
      size='sm'
      active={showEditModal}
      toggler={() => setShowEditModal(false)}
    >
      <ModalBody>
        <h1 className='font-medium text-lg mb-4 border-b'>Edit Title</h1>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='outline-none w-full'
          placeholder='Edit...'
          onKeyDown={(e) => e.key === 'Enter' && editDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color='blue'
          buttonType='link'
          onClick={(e) => setShowEditModal(false)}
          ripple='dark'
        >
          Cancel
        </Button>
        <Button color='blue' onClick={editDocument} ripple='light'>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );

  const removeModal = (
    <Modal
      size='sm'
      active={showRemoveModal}
      toggler={() => setShowRemoveModal(false)}
    >
      <ModalBody>
        <h1>Are you sure you want to remove the document?</h1>
      </ModalBody>
      <ModalFooter>
        <Button
          color='blue'
          buttonType='link'
          onClick={(e) => setShowRemoveModal(false)}
          ripple='dark'
        >
          No
        </Button>
        <Button color='blue' onClick={removeDocument} ripple='light'>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div
      className='flex items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-700 text-sm relative'
      onMouseOver={() => setIsLeave(true)}
      onMouseLeave={() => {
        setIsLeave(false);
        setIsOpen(false);
      }}
    >
      {editModal}
      {removeModal}
      <div
        onClick={() => router.push(`/doc/${id}`)}
        className='flex items-center flex-grow'
      >
        <Icon name='article' size='3xl' color='blue' />
        <p className='flex-grow pl-5 w-10 truncate'>{filename}</p>
        <p className='pr-5 text-sm'>{date?.toDate().toLocaleDateString()}</p>
      </div>

      <Button
        color='gray'
        buttonType='outline'
        rounded={true}
        iconOnly={true}
        ripple='dark'
        className='border-0'
        onClick={() => (!isOpen ? setIsOpen(true) : setIsOpen(false))}
      >
        <Icon name='more_vert' size='3xl' />
      </Button>
      <div
        className={`${
          isLeave && isOpen ? 'block' : 'hidden'
        } bg-gray-100 z-10 absolute bottom-[-87px] right-0 rounded-b-lg`}
      >
        <p
          onClick={() => setShowEditModal(true)}
          className='px-6 py-3 hover:bg-blue-500 hover:text-white transition duration-300'
        >
          Edit title
        </p>
        <p
          onClick={() => setShowRemoveModal(true)}
          className='px-6 py-3 hover:bg-red-500 rounded-b-lg hover:text-white transition duration-300'
        >
          Remove Document
        </p>
      </div>
    </div>
  );
};

export default DocumentRow;
