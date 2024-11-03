import { Login } from '@/components/Login';

const Authenticate = () => {
  return (
    <div className="h-screen flex items-center justify-between w-full bg-gradient-to-br from-green-100 to-blue-100">
      {/* Left Section with Logo */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg p-8 ">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-green-300 to-blue-300 p-5 rounded-full shadow-md">
            {/* Message Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4l-2 2v-2H2V6a2 2 0 012-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11h8m-8 4h6"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-7xl font-extrabold text-blue-900">Connextra</h1>
            <p className="text-xl text-gray-500">Create for cloud-computing project</p>
          </div>
        </div>
      </div>

      {/* Right Section with Login - Transparent background */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full relative p-12 m-6">

        <h2 className="text-3xl font-semibold text-gray-700 relative z-10">
          <span className="text-blue-800">Sign in</span> to Connextra
        </h2>

        <Login />
      </div>
    </div>
  );
};

export default Authenticate;
