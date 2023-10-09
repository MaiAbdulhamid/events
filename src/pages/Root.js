import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { useEffect } from 'react';
import { getTokenDuration } from '../util/Auth';

function RootLayout() {
  // const navigation = useNavigation();
  const submit = useSubmit();
  const token = useLoaderData();

  useEffect(() => {
    if(!token){
      return;
    }
    if (token === 'EXPIRED'){
      submit(null, {action: "/logout", method: 'POST'});
      return;
    }
    const tokenDuration = getTokenDuration();
    setTimeout(() => {
      submit(null, {action: "/logout", method: 'POST'});
    }, tokenDuration)
  }, [])
  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
