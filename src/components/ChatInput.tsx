// https://github.com/supabase/supabase/blob/132022225fe4123fdb96f3a5ad6714f87eaf61fd/examples/slack-clone/nextjs-slack-clone/components/MessageInput.js
import { Message } from '@prisma/client';
import { useState } from 'react';

interface Props {
  onSubmit: (text: string) => Promise<Message[] | undefined>;
}

export default function MessageInput({ onSubmit }: Props) {
  const [messageText, setMessageText] = useState('');

  const submitOnEnter = (event: any) => {
    if (event.keyCode === 13) {
      onSubmit(messageText);
      setMessageText('');
    }
  };

  return (
    <>
      <input
        className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Enter a message"
        value={messageText}
        onChange={e => setMessageText(e.target.value)}
        onKeyDown={e => submitOnEnter(e)}
      />
    </>
  );
}
