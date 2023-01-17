import { Profile } from '@prisma/client';
import { prisma } from './prisma';
import { supabase } from './supabase';

export async function isLoggedIn(): Promise<boolean> {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session !== null;
}

export async function getProfile(authId: string): Promise<Profile | null> {
  return await prisma.profile.findUnique({ where: { authId } });
}
