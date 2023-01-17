import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function LandingPage() {
  return <></>;
}

export async function getServerSideProps(context: any) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(context);
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Redirect to /chat page if logged in
  if (session) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false
      }
    };
  }

  // Go to /login page if not
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  };
}
