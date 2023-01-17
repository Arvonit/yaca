// https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone
import { Message, Profile } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

export function useStore(supabase: SupabaseClient) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState<Map<string, Profile>>(new Map());
  const [newMessage, handleNewMessage] = useState<Message | null>(null);
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<Profile | null>(null);
  const [deletedMessage, handleDeletedMessage] = useState<Message | null>(null);

  // Load initial data and set up listeners
  useEffect(() => {
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload =>
        handleNewMessage(payload.new as Message)
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload =>
        handleDeletedMessage(payload.old as Message)
      )
      .subscribe();

    // Listen for changes to our users
    const userListener = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, payload =>
        handleNewOrUpdatedUser(payload.new as Profile)
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(messageListener);
      supabase.removeChannel(userListener);
    };
  }, []);

  // New message received from Postgres
  useEffect(() => {
    if (newMessage) {
      const handleAsync = async () => {
        let senderId = newMessage.sender_id;
        if (!users.get(senderId))
          await fetchUser(supabase, senderId, (user: Profile) => handleNewOrUpdatedUser(user));
        setMessages(messages.concat(newMessage));
      };
      handleAsync();
    }
  }, [newMessage]);

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage) setMessages(messages.filter(message => message.id !== deletedMessage.id));
  }, [deletedMessage]);

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser);
  }, [newOrUpdatedUser]);

  return {
    // We can export computed values here to map the authors to each message
    messages: messages.map(x => ({ ...x, sender: users.get(x.sender_id) })),
    users
  };
}

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export async function fetchUser(supabase: SupabaseClient, userId: string, setState: any) {
  try {
    let { data, error } = await supabase.from('profiles').select(`*`).eq('id', userId);
    if (error || !data) {
      throw error;
    }
    let user = data[0];
    if (setState) setState(user);
    return user;
  } catch (error) {
    console.log('error', error);
  }
}

/**
 * Fetch all messages and their authors
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export async function fetchMessages(supabase: SupabaseClient, setState: any) {
  try {
    let { data } = await supabase
      .from('messages')
      .select(`*, sender:sender_id(*)`)
      .order('timestamp', { ascending: true });
    if (setState) setState(data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

/**
 * Insert a new message into the DB
 */
export async function addMessage(supabase: SupabaseClient, content: string, sender_id: string) {
  try {
    let { data } = await supabase.from('messages').insert([{ content, sender_id }]).select();
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

/**
 * Delete a message from the DB
 * @param {number} message_id
 */
export async function deleteMessage(supabase: SupabaseClient, message_id: string) {
  try {
    let { data } = await supabase.from('messages').delete().match({ id: message_id });
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
