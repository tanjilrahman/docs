import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { signOut, useSession } from 'next-auth/client';

function Header() {
  const [session] = useSession();
  return (
    <header className='sticky top-0 z-10 flex items-center px-4 py-2 shadow-md bg-white'>
      <Button
        color='gray'
        buttonType='outline'
        rounded={true}
        iconOnly={true}
        ripple='dark'
        className='hidden md:block h-20 w-20 border-0'
      >
        <Icon name='menu' size='3xl' />
      </Button>
      <Icon name='description' size='5xl' color='blue' />
      <h1 className='ml-2 flex-grow md:flex-grow-0 text-gray-700 text-2xl'>
        Docs
      </h1>

      <div className='hidden md:flex md:mx-20 lg:mx-32 flex-grow items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md'>
        <Icon name='search' size='3xl' color='gray' />
        <input
          type='text'
          placeholder='Search'
          className='px-5 text-base bg-transparent flex-grow outline-none'
        />
      </div>

      <Button
        color='lightBlue'
        buttonType='filled'
        size='ragular'
        className='inline-flex h-9 md:h-10'
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
        loading='lazy'
        className='h-10 w-10 md:h-12 md:w-12 rounded-full ml-2'
        src={session?.user?.image}
        alt=''
      />
    </header>
  );
}

export default Header;
