import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import moment from 'moment';
import Link from 'next/link';
import { getSession, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useDocument } from 'react-firebase-hooks/firestore';
import Login from '../../components/Login';
import TextEditor from '../../components/TextEditor';
import { db } from '../../firebase';
import Head from 'next/head';

const Doc = () => {
  const [session] = useSession();
  if (!session) return <Login />;

  const router = useRouter();
  const { id } = router.query;
  const [snapshot, loadingSnapshot] = useDocument(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  );

  if (!loadingSnapshot && !snapshot?.data()?.filename) {
    router.replace('/');
  }

  return (
    <div>
      <Head>
        <title>{snapshot?.data()?.filename}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className='flex sticky top-0 z-50 justify-center items-center p-3 pb-1 bg-white'>
        <Link href='/'>
          <a>
            <span className='cursor-pointer'>
              <Icon name='description' size='5xl' color='blue' />
            </span>
          </a>
        </Link>

        <div className='flex-grow px-2 space-y-1'>
          <h2>{snapshot?.data()?.filename}</h2>
          <div className='flex space-x-1'>
            <p className='text-gray-500 text-xs italic'>
              {`Last edited: ${moment(
                snapshot?.data()?.timestamp?.toDate().getTime()
              ).format('lll')}`}
            </p>
            {snapshot?.data()?.upToDate && (
              <Icon name='cloud_done' color='gray' />
            )}
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
          onClick={signOut}
        >
          <Icon name='logout' size='md' />
          LOGOUT
        </Button>
        <img
          src={session.user.image}
          className='rounded-full h-10 w-10 ml-2'
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
