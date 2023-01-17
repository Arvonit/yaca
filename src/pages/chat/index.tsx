import Head from '../../components/Head';
import { useSession, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createServerSupabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import ChatRoom from '../../components/ChatRoom';
import { addMessage, getUserByAuthId, useStore } from '../../lib/store';
import ChatInput from '../../components/ChatInput';

export default function Chat() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { isLoading, session, error } = useSessionContext();
  const { messages, users } = useStore(supabase);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Failed to sign out' + error.name);
      console.log('Sign Out Error: ' + error);
      return;
    }
    router.push('/login');
  }

  if (isLoading) {
    return <></>;
  }

  if (session == null || error) {
    router.push('/');
    return <></>;
  }

  const user = getUserByAuthId(users, session.user.id);

  return (
    <>
      <Head section={'Chat'} />

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Chat</h1>
          <p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 border border-red-500 rounded"
              onClick={signOut}
            >
              Sign Out
            </button>
          </p>
        </div>

        {/* <p>Welcome, {user?.username}!</p> */}
        {/* <p>Welcome, {username}!</p> */}
        {/* <p>{messages.length}</p> */}
        <ChatRoom messages={messages} users={users} />
        <div className="bottom-0 left-0 w-full">
          <ChatInput onSubmit={async text => addMessage(supabase, text, user!.id)} />
        </div>
      </div>
    </>
  );
}

// This shit don't work 😡
// https://github.com/supabase/supabase/issues/6764
// Basically, the session is not registered when oauth login redirects to this page. It seems
// like the session creation happens right after the redirection, so I have to handle auth
// protection client side instead of server side. 😔
//
// This really sucks becuase I can't really use Prisma in this page.
//
// export async function getServerSideProps(context: any) {
//   // Create authenticated Supabase Client
//   const supabase = createServerSupabaseClient(context);
//   // Check if we have a session
//   const {
//     data: { session }
//   } = await supabase.auth.getSession();
//   const {
//     data: { user }
//   } = await supabase.auth.getUser();
//   console.log('session', session);
//   console.log('user', user);

//   // Redirect to /login page if we are not logged in
//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: '/login',
//   //       permanent: false
//   //     }
//   //   };
//   // }

//   return { props: {} };
// }
