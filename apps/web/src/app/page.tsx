'use client';

import { Button } from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <div sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
      >
        Loading...
      </div>
    );
  }
  if (status !== 'authenticated') {
    return (
      <div sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
      >
        <Button onClick={() => signIn('google')}>さいんいん</Button>
      </div>
    );
  }
  return (
    <div sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
    }}
    >
      <p>{data.user?.email}</p>
      <Button onClick={() => signOut()}>さいんあうと</Button>
    </div>
  );

}
