import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import Login from '../../components/Login';
import TextEditor from '../../components/TextEditor';
import { db } from '../../firebase';

const Doc = () => {
  const [session] = useSession();
  if (!session) return <Login />;

  const router = useRouter();
  const { id } = router.query;
  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  );

  if (!loadingSnapshot && !snapshot?.data()?.filename) {
    router.replace('/');
  }

  return (
    <div>
      <header className='flex justify-center items-center p-3 pb-1'>
        <span onClick={() => router.push('/')} className='cursor-pointer'>
          <Icon name='description' size='5xl' color='blue' />
        </span>

        <div className='flex-grow px-2'>
          <h2>{snapshot?.data()?.filename}</h2>
          <div className='flex space-x-1 text-gray-600 text-sm items-center -ml-1'>
            <p className='option'>File</p>
            <p className='option'>Edit</p>
            <p className='option'>View</p>
            <p className='option'>Insert</p>
            <p className='option'>Format</p>
            <p className='option'>Tools</p>
          </div>
        </div>
        <Button
          color='lightBlue'
          buttonType='filled'
          size='ragular'
          className='hidden md:inline-flex h-10'
          rounded={false}
          block={false}
          iconOnly={false}
          ripple='light'
        >
          <Icon name='people' size='md' />
          SHARE
        </Button>
        <img
          src={session.user.image}
          className='rounded-full cursor-pointer h-10 w-10 ml-2'
          alt=''
        />
      </header>

      <TextEditor />
    </div>
  );
};

export default Doc;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
