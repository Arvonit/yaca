import { Message, Profile } from '@prisma/client';

interface Props {
  messages: Message[];
  users: Map<string, Profile>;
}

export default function ChatRoom({ messages, users }: Props) {
  return (
    <>
      {messages.map(m => {
        return (
          <p>
            <span className="font-light text-sm">
              {new Date(m.timestamp).toLocaleTimeString([], { timeStyle: 'short' })}
            </span>{' '}
            <span className="font-semibold">{users.get(m.sender_id)?.username + ':'}</span>{' '}
            {m.content}
          </p>
        );
      })}
    </>
  );
}
