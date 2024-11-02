import { UserContext } from '@/context/UserContext';
import React, { useContext, useEffect } from 'react'

const Home = () => {
  const { userData, isAuthenticated } = useContext(UserContext);

    useEffect(() => {
      console.log(isAuthenticated ? 'isAuthenticated' : 'notAuthenticated')
        if (isAuthenticated) {
            // ทำอะไรกับ userData ที่นี่
            console.log('User data in SomeComponent:', userData);
        }
    }, [isAuthenticated, userData]);

    console.log('User data in SomeComponent:', userData);
  return (
    <div>Home</div>
  )
}

export default Home
