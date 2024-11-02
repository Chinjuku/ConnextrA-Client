import { Login } from '@/components/Login';

const Authenticate = () => {
  return (
    <div className='h-screen flex items-center w-full justify-center'>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl mb-4'>Welcome to My App</h1>
        <Login />
        {/* <Logout /> */}
      </div>
    </div>
  );
};

export default Authenticate;

