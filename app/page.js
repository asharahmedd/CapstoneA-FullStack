'use client';
const { useAuth } = require('../lib/authContext');
const { useRouter } = require('next/navigation');
const { useEffect } = require('react');

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="container">
      <p>Loading...</p>
    </div>
  );
}