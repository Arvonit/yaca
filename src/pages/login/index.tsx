import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from '../../components/Head';

export default function Login() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [error, setError] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/chat`
      }
    });
    console.log('Login Error: ' + error);
    if (error) {
      setError(error.message);
      return;
    }
    setError('Loading...');
  }

  return (
    <>
      <Head />
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-4">
        <h1 className="text-3xl font-semibold">Yetaca</h1>
        <p>To continue, login with GitHub.</p>

        <p>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 border border-gray-800 rounded"
            onClick={signIn}
          >
            Login with GitHub
          </button>
        </p>
        {error != '' && <p>{error}</p>}
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(context);
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Go to /chat page if we are already logged in
  if (session) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
}
