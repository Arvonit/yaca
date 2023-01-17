import { Message, Profile } from '@prisma/client';

interface Props {
  messages: Message[];
  // users: Map<string, Profile>;
}

export default function ChatRoom({ messages }: Props) {
  return (
    <>
      {messages.map(m => {
        return <p>{(m as any).sender.username + ' ' + m.content}</p>;
      })}
    </>
  );
}
