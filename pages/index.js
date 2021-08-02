import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import { getSession, useSession } from 'next-auth/client';
import Login from '../components/Login';
import { useState } from 'react';
import Modal from '@material-tailwind/react/Modal';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import { db } from '../firebase';
import firebase from 'firebase';
import {
  useCollection,
  useCollectionOnce,
} from 'react-firebase-hooks/firestore';
import DocumentRow from '../components/DocumentRow';
import { useRouter } from 'next/dist/client/router';

export default function Home() {
  const [session] = useSession();
  if (!session) return <Login />;
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();

  const [snapshot] = useCollection(
    db
      .collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .orderBy('timestamp', 'desc')
  );

  const createDocument = async () => {
    if (!input) return;

    const generateId = await db
      .collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .add({
        filename: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    setInput('');
    setShowModal(false);
    router.push(`/doc/${generateId.id}`);
  };

  const modal = (
    <Modal size='sm' active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='outline-none w-full'
          placeholder='Enter name of document...'
          onKeyDown={(e) => e.key === 'Enter' && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color='blue'
          buttonType='link'
          onClick={(e) => setShowModal(false)}
          ripple='dark'
        >
          Cancel
        </Button>
        <Button color='blue' onClick={createDocument} ripple='light'>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      <Head>
        <title>Docs</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      {modal}

      <section className='bg-[#F8F9FA] pb-10 px-5 sm:px-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center justify-between py-6'>
            <h2 className='text-gray-700 text-lg'>Start a new document</h2>

            <Button
              color='gray'
              buttonType='outline'
              iconOnly={true}
              ripple='dark'
              className='border-0'
            >
              <Icon name='more_vert' size='3xl' />
            </Button>
          </div>
          <div>
            <div
              onClick={() => setShowModal(true)}
              className='relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700 transition-all duration-300'
            >
              <Image src='https://links.papareact.com/pju' layout='fill' />
            </div>

            <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>
              Blank
            </p>
          </div>
        </div>
      </section>

      <section className='bg-white px-5 md:px-0'>
        <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
          <div className='flex items-center justify-between pb-5'>
            <h2 className='font-medium flex-grow'>My Documents</h2>
            <p className='mr-8 sm:mr-12'>Date Created</p>
            <Icon name='folder' size='3xl' color='gray' />
          </div>
          {snapshot?.docs.map((doc) => (
            <DocumentRow
              key={doc.id}
              id={doc.id}
              filename={doc.data().filename}
              date={doc.data().timestamp}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
