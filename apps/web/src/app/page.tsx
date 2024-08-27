'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { center } from 'styled-system/patterns';

import { Button } from '~/components/ui/button';

export default function Home() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <div className={center({
        height: '100vh',
      })}
      >Loading...
      </div>
    );
  }
  if (status !== 'authenticated') {
    return (
      <div className={center({
        height: '100vh',
      })}
      >
        <Button onClick={() => signIn('google')}>さいんいん</Button>
      </div>
    );
  }
  return (
    <div className={center({
      height: '100vh',
    })}
    >
      <p>{data.user?.email}</p>
      <Button onClick={() => signOut()}>さいんあうと</Button>
    </div>
  );

}
