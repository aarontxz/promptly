'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Hero from "./components/Hero"
import { LoginButton } from "./components/LoginButton"

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/decks');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (status === 'authenticated') {
    return null; // Will redirect to /decks
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Hero />
        <div className="mt-12">
          <LoginButton />
        </div>
      </div>
    </main>
  )
}
